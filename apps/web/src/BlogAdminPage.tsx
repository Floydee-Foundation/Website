import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import type {
  BlogCategory,
  BlogContentBlock,
  BlogImageMedia,
  BlogPost,
  BlogProgramAssociation,
  BlogStatus
} from "@floydee/shared";
import floydeeLogo from "./assets/floydee-logo.png";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "");
const sessionKey = "floydee_blog_admin_token";

type AdminResponse<T> = T & {
  errors?: string[];
  message?: string;
  ok: boolean;
  token?: string;
};

type EditorPost = Omit<BlogPost, "id"> & {
  id?: string;
};

type AdminView = "categories" | "editor" | "library";

const emptyPost: EditorPost = {
  author: "",
  blocks: [],
  categorySlugs: [],
  excerpt: "",
  heroImage: undefined,
  programAssociation: "general",
  seo: {
    description: "",
    keywords: [],
    title: ""
  },
  slug: "",
  status: "draft",
  tags: [],
  title: ""
};

const programLabels: Record<BlogProgramAssociation, string> = {
  aarohi: "AAROHI",
  general: "General",
  sakhi: "SAKHI",
  vidya: "VIDYA"
};

const blockLabels: Record<BlogContentBlock["type"], string> = {
  heading: "Heading",
  image: "Image",
  list: "List",
  paragraph: "Paragraph",
  quote: "Quote",
  youtube: "Video"
};

const blockDescriptions: Record<BlogContentBlock["type"], string> = {
  heading: "Break the story into readable sections.",
  image: "Place a photo from a public URL or Google Drive.",
  list: "Summarize actions, outcomes, or next steps.",
  paragraph: "Write the main story in clear body text.",
  quote: "Highlight a field voice or partner line.",
  youtube: "Embed a YouTube video or a public Google Drive video."
};

const starterOutlines: Array<{ blocks: BlogContentBlock[]; description: string; name: string }> = [
  {
    name: "Field update",
    description: "Best for program activity, camps, workshops, and on-ground notes.",
    blocks: [
      { id: "field-context", level: 2, text: "What happened", type: "heading" },
      { id: "field-intro", text: "Describe the activity, location, audience, and why this update matters.", type: "paragraph" },
      { id: "field-impact", level: 2, text: "What changed for the community", type: "heading" },
      { id: "field-list", items: ["People reached", "Partners involved", "Follow-up planned"], style: "bullet", type: "list" },
      { attribution: "Floydee field team", id: "field-quote", text: "Add a short voice from the field here.", type: "quote" }
    ]
  },
  {
    name: "Impact story",
    description: "Best for beneficiary journeys, partner stories, and human-interest posts.",
    blocks: [
      { id: "story-person", level: 2, text: "The person or community at the centre", type: "heading" },
      { id: "story-context", text: "Open with the person, place, challenge, or opportunity. Keep consent and dignity in mind.", type: "paragraph" },
      { attribution: "Story voice", id: "story-quote", text: "Add one approved quote that carries the emotion of the story.", type: "quote" },
      { id: "story-support", level: 2, text: "How Floydee supported the next step", type: "heading" },
      { id: "story-next", text: "Explain the program touchpoint, support pathway, and what happens next.", type: "paragraph" }
    ]
  },
  {
    name: "Resource note",
    description: "Best for explainers, SEO posts, and educational blog content.",
    blocks: [
      { id: "resource-topic", level: 2, text: "What readers need to know", type: "heading" },
      { id: "resource-summary", text: "Introduce the topic in plain language and connect it to Floydee's program work.", type: "paragraph" },
      { id: "resource-points", items: ["Key point one", "Key point two", "Key point three"], style: "numbered", type: "list" },
      { id: "resource-action", level: 2, text: "What readers can do next", type: "heading" },
      { id: "resource-close", text: "Close with a practical action, support route, or partner invitation.", type: "paragraph" }
    ]
  }
];

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

function arrayToInput(value: string[]) {
  return value.join(", ");
}

function inputToArray(value: string) {
  return Array.from(new Set(value.split(",").map((item) => item.trim()).filter(Boolean)));
}

function cloneBlocks(blocks: BlogContentBlock[]) {
  return blocks.map((block) => ({ ...block, id: createId() })) as BlogContentBlock[];
}

function getAdminRoute(path: string): { editId?: string; view: AdminView } {
  if (path === "/admin/blogs/categories") return { view: "categories" };
  if (path === "/admin/blogs/new") return { view: "editor" };
  if (path.startsWith("/admin/blogs/edit/")) return { editId: path.replace("/admin/blogs/edit/", ""), view: "editor" };
  return { view: "library" };
}

function youtubeEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function googleDriveFileId(url: string) {
  try {
    const parsed = new URL(url);
    if (!["drive.google.com", "docs.google.com"].includes(parsed.hostname.replace(/^www\./, ""))) return "";
    return parsed.pathname.match(/\/d\/([^/]+)/)?.[1] ?? parsed.searchParams.get("id") ?? "";
  } catch {
    return "";
  }
}

function isGoogleDriveUrl(url: string) {
  return Boolean(googleDriveFileId(url));
}

function imagePreviewUrl(url: string) {
  const driveId = googleDriveFileId(url);
  return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1600` : url;
}

function videoEmbedUrl(url: string) {
  const driveId = googleDriveFileId(url);
  return driveId ? `https://drive.google.com/file/d/${driveId}/preview` : youtubeEmbedUrl(url);
}

function driveMediaConfirmed(post: EditorPost) {
  if (post.heroImage?.url && isGoogleDriveUrl(post.heroImage.url) && !post.heroImage.publicAccessConfirmed) return false;

  return post.blocks.every((block) => {
    if (block.type === "image" && isGoogleDriveUrl(block.media.url)) return Boolean(block.media.publicAccessConfirmed);
    if (block.type === "youtube" && isGoogleDriveUrl(block.url)) return Boolean(block.publicAccessConfirmed);
    return true;
  });
}

async function apiRequest<T>(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const result = (await response.json().catch(() => null)) as AdminResponse<T> | null;

  if (!response.ok || !result?.ok) {
    throw new Error(result?.message ?? "The blog CMS could not complete that action.");
  }

  return result;
}

function StatusPill({ status }: { status: BlogStatus }) {
  return <span className={`admin-status admin-status-${status}`}>{status}</span>;
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return <label className="admin-field"><span>{label}</span>{children}</label>;
}

function BlogPreview({ post }: { post: EditorPost }) {
  const hero = post.heroImage?.url ? imagePreviewUrl(post.heroImage.url) : "";

  return (
    <article className="blog-preview">
      {hero ? (
        <figure className="blog-preview-hero">
          <img src={hero} alt={post.heroImage?.alt ?? ""} />
          {post.heroImage?.caption ? <figcaption>{post.heroImage.caption}</figcaption> : null}
        </figure>
      ) : (
        <div className="blog-preview-empty">Hero image preview</div>
      )}
      <div className="blog-preview-meta">
        <span>{post.categorySlugs.join(" / ") || "category"}</span>
        <span>{programLabels[post.programAssociation]}</span>
      </div>
      <h1>{post.title || "Untitled blog draft"}</h1>
      <p className="blog-preview-excerpt">{post.excerpt || "Write a short excerpt that gives readers a reason to open the story."}</p>
      <div className="blog-preview-body">
        {post.blocks.length ? post.blocks.map((block) => <PreviewBlock block={block} key={block.id} />) : (
          <p className="blog-preview-placeholder">Add headings, paragraphs, images, YouTube links, quotes, and lists to build the blog body.</p>
        )}
      </div>
    </article>
  );
}

function PreviewBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === "heading") {
    return block.level === 3 ? <h3>{block.text}</h3> : <h2>{block.text}</h2>;
  }

  if (block.type === "paragraph") return <p>{block.text}</p>;

  if (block.type === "image") {
    return (
      <figure>
        <img src={imagePreviewUrl(block.media.url)} alt={block.media.alt ?? ""} />
        {block.media.caption ? <figcaption>{block.media.caption}</figcaption> : null}
      </figure>
    );
  }

  if (block.type === "youtube") {
    const embedUrl = videoEmbedUrl(block.url);
    return embedUrl ? (
      <div className="blog-preview-video">
        <iframe title={block.title || "Floydee blog video"} src={embedUrl} allowFullScreen />
      </div>
    ) : <p>{block.url}</p>;
  }

  if (block.type === "quote") {
    return <blockquote><p>{block.text}</p>{block.attribution ? <cite>{block.attribution}</cite> : null}</blockquote>;
  }

  const ListTag = block.style === "numbered" ? "ol" : "ul";
  return <ListTag>{block.items.map((item) => <li key={item}>{item}</li>)}</ListTag>;
}

function BlockEditor({
  block,
  index,
  onChange,
  onMove,
  onRemove,
  total
}: {
  block: BlogContentBlock;
  index: number;
  onChange: (block: BlogContentBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  total: number;
}) {
  const title = blockLabels[block.type];

  return (
    <section className="content-block-editor">
      <div className="content-block-toolbar">
        <div>
          <strong>{index + 1}. {title}</strong>
          <span>{blockDescriptions[block.type]}</span>
        </div>
        <div>
          <button className="admin-icon-button" disabled={index === 0} onClick={() => onMove(-1)} type="button" title="Move block up">Up</button>
          <button className="admin-icon-button" disabled={index === total - 1} onClick={() => onMove(1)} type="button" title="Move block down">Down</button>
          <button className="admin-icon-button danger" onClick={onRemove} type="button" title="Remove block">Remove</button>
        </div>
      </div>
      {block.type === "heading" ? (
        <div className="admin-form-grid compact">
          <Field label="Text"><input value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} /></Field>
          <Field label="Level">
            <select value={block.level} onChange={(event) => onChange({ ...block, level: Number(event.target.value) === 3 ? 3 : 2 })}>
              <option value={2}>Section heading</option>
              <option value={3}>Subheading</option>
            </select>
          </Field>
        </div>
      ) : null}
      {block.type === "paragraph" ? (
        <Field label="Paragraph"><textarea rows={5} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} /></Field>
      ) : null}
      {block.type === "image" ? (
        <MediaFields media={block.media} onChange={(media) => onChange({ ...block, media })} />
      ) : null}
      {block.type === "youtube" ? (
        <div className="admin-form-grid compact">
          <Field label="YouTube or Google Drive video URL"><input value={block.url} onChange={(event) => onChange({ ...block, url: event.target.value })} /></Field>
          <Field label="Video title"><input value={block.title ?? ""} onChange={(event) => onChange({ ...block, title: event.target.value })} /></Field>
          {isGoogleDriveUrl(block.url) ? (
            <PublicDriveConfirmation
              checked={Boolean(block.publicAccessConfirmed)}
              onChange={(publicAccessConfirmed) => onChange({ ...block, publicAccessConfirmed })}
            />
          ) : null}
        </div>
      ) : null}
      {block.type === "quote" ? (
        <div className="admin-form-grid compact">
          <Field label="Quote"><textarea rows={4} value={block.text} onChange={(event) => onChange({ ...block, text: event.target.value })} /></Field>
          <Field label="Attribution"><input value={block.attribution ?? ""} onChange={(event) => onChange({ ...block, attribution: event.target.value })} /></Field>
        </div>
      ) : null}
      {block.type === "list" ? (
        <div className="admin-form-grid compact">
          <Field label="Items, one per line">
            <textarea rows={5} value={block.items.join("\n")} onChange={(event) => onChange({ ...block, items: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} />
          </Field>
          <Field label="Style">
            <select value={block.style} onChange={(event) => onChange({ ...block, style: event.target.value === "numbered" ? "numbered" : "bullet" })}>
              <option value="bullet">Bulleted</option>
              <option value="numbered">Numbered</option>
            </select>
          </Field>
        </div>
      ) : null}
    </section>
  );
}

function MediaFields({ media, onChange }: { media: BlogImageMedia; onChange: (media: BlogImageMedia) => void }) {
  return (
    <div className="admin-form-grid compact">
      <Field label="Image URL or Google Drive image link"><input value={media.url} onChange={(event) => onChange({ ...media, url: event.target.value })} /></Field>
      <Field label="Alt text"><input value={media.alt ?? ""} onChange={(event) => onChange({ ...media, alt: event.target.value })} /></Field>
      <Field label="Caption"><input value={media.caption ?? ""} onChange={(event) => onChange({ ...media, caption: event.target.value })} /></Field>
      {isGoogleDriveUrl(media.url) ? (
        <PublicDriveConfirmation
          checked={Boolean(media.publicAccessConfirmed)}
          onChange={(publicAccessConfirmed) => onChange({ ...media, publicAccessConfirmed })}
        />
      ) : null}
    </div>
  );
}

function PublicDriveConfirmation({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="admin-drive-confirmation">
      <input checked={checked} onChange={(event) => onChange(event.target.checked)} type="checkbox" />
      <span><strong>Google Drive general access confirmed</strong>Anyone on the internet with the link can view.</span>
    </label>
  );
}

export function BlogAdminPage({ path = "/admin/blogs" }: { path?: string }) {
  const route = getAdminRoute(path);
  const [token, setToken] = useState(() => sessionStorage.getItem(sessionKey) ?? "");
  const [loginPasscode, setLoginPasscode] = useState("");
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editorPost, setEditorPost] = useState<EditorPost>(emptyPost);
  const [categoryForm, setCategoryForm] = useState({ description: "", name: "", programAssociation: "general" as BlogProgramAssociation, slug: "" });
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [categorySlugEdited, setCategorySlugEdited] = useState(false);

  const filteredPosts = useMemo(() => posts.filter((post) => {
    const matchesSearch = !search || `${post.title} ${post.excerpt}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || post.categorySlugs.includes(categoryFilter);
    return matchesSearch && matchesStatus && matchesCategory;
  }), [categoryFilter, posts, search, statusFilter]);

  const publishChecks = [
    ["Title", Boolean(editorPost.title.trim())],
    ["Slug", Boolean(editorPost.slug.trim())],
    ["Excerpt", Boolean(editorPost.excerpt.trim())],
    ["Category", editorPost.categorySlugs.length > 0],
    ["Content", editorPost.blocks.length > 0],
    ["Drive access", driveMediaConfirmed(editorPost)],
    ["Hero alt text", !editorPost.heroImage?.url || Boolean(editorPost.heroImage.alt?.trim())],
    ["SEO summary", Boolean(editorPost.seo.description?.trim())]
  ] as const;

  const readyCount = publishChecks.filter(([, ready]) => ready).length;
  const selectedCategories = categories.filter((category) => editorPost.categorySlugs.includes(category.slug));

  const loadContent = async (activeToken = token) => {
    if (!activeToken) return;
    const [categoryResult, postResult] = await Promise.all([
      apiRequest<{ categories: BlogCategory[] }>("/api/admin/blog-categories", activeToken),
      apiRequest<{ posts: BlogPost[] }>("/api/admin/blog-posts", activeToken)
    ]);
    setCategories(categoryResult.categories);
    setPosts(postResult.posts);
  };

  useEffect(() => {
    if (!token) return;
    loadContent().catch((error) => {
      setStatus(error instanceof Error ? error.message : "Could not load blog CMS content.");
      setCategories([]);
      setPosts([]);
    });
  }, [token]);

  const updateEditor = (patch: Partial<EditorPost>) => {
    setEditorPost((current) => ({ ...current, ...patch }));
  };

  const goToAdmin = (nextPath: string) => {
    window.history.pushState(null, "", nextPath);
    window.dispatchEvent(new PopStateEvent("popstate"));
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const startNewPost = () => {
    setEditorPost(emptyPost);
    setSlugEdited(false);
    goToAdmin("/admin/blogs/new");
  };

  const selectPost = (post: BlogPost) => {
    setEditorPost(post);
    setSlugEdited(true);
    goToAdmin(`/admin/blogs/edit/${post.id}`);
  };

  useEffect(() => {
    if (route.view === "editor" && !route.editId && editorPost.id) {
      setEditorPost(emptyPost);
      setSlugEdited(false);
    }

    if (route.editId && editorPost.id !== route.editId) {
      const selectedPost = posts.find((post) => post.id === route.editId);
      if (selectedPost) {
        setEditorPost(selectedPost);
        setSlugEdited(true);
      }
    }
  }, [editorPost.id, posts, route.editId, route.view]);

  const login = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    try {
      const result = await apiRequest<Record<string, never>>("/api/admin/session", "", {
        body: JSON.stringify({ passcode: loginPasscode }),
        method: "POST"
      });
      if (!result.token) throw new Error("Admin token was not returned.");
      sessionStorage.setItem(sessionKey, result.token);
      setToken(result.token);
      setLoginPasscode("");
      setStatus("Welcome to the Floydee blog creator.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  };

  const saveCategory = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setStatus("");
    const payload = {
      ...categoryForm,
      slug: categoryForm.slug || slugify(categoryForm.name)
    };

    try {
      if (editingCategoryId) {
        await apiRequest(`/api/admin/blog-categories/${editingCategoryId}`, token, {
          body: JSON.stringify(payload),
          method: "PATCH"
        });
        setStatus("Category updated.");
      } else {
        await apiRequest("/api/admin/blog-categories", token, {
          body: JSON.stringify(payload),
          method: "POST"
        });
        setStatus("Category created.");
      }
      setCategoryForm({ description: "", name: "", programAssociation: "general", slug: "" });
      setCategorySlugEdited(false);
      setEditingCategoryId("");
      await loadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Category could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const editCategory = (category: BlogCategory) => {
    setEditingCategoryId(category.id);
    setCategoryForm({
      description: category.description ?? "",
      name: category.name,
      programAssociation: category.programAssociation,
      slug: category.slug
    });
    setCategorySlugEdited(true);
  };

  const archiveCategory = async (category: BlogCategory) => {
    setBusy(true);
    try {
      await apiRequest(`/api/admin/blog-categories/${category.id}`, token, {
        body: JSON.stringify({ status: "archived" }),
        method: "PATCH"
      });
      setStatus("Category archived.");
      await loadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Category could not be archived.");
    } finally {
      setBusy(false);
    }
  };

  const savePost = async (nextStatus: BlogStatus = editorPost.status) => {
    setBusy(true);
    setStatus("");
    const payload = {
      ...editorPost,
      slug: editorPost.slug || slugify(editorPost.title),
      status: nextStatus
    };

    try {
      const result = editorPost.id
        ? await apiRequest<{ post: BlogPost }>(`/api/admin/blog-posts/${editorPost.id}`, token, { body: JSON.stringify(payload), method: "PATCH" })
        : await apiRequest<{ post: BlogPost }>("/api/admin/blog-posts", token, { body: JSON.stringify(payload), method: "POST" });

      setEditorPost(result.post);
      if (!editorPost.id) goToAdmin(`/admin/blogs/edit/${result.post.id}`);
      setStatus(nextStatus === "published" ? "Blog published." : nextStatus === "archived" ? "Blog archived." : "Draft saved.");
      await loadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Blog post could not be saved.");
    } finally {
      setBusy(false);
    }
  };

  const addBlock = (type: BlogContentBlock["type"]) => {
    const block =
      type === "heading" ? { id: createId(), level: 2, text: "", type } :
      type === "paragraph" ? { id: createId(), text: "", type } :
      type === "image" ? { id: createId(), media: { alt: "", caption: "", url: "" }, type } :
      type === "youtube" ? { id: createId(), publicAccessConfirmed: false, title: "", url: "", type } :
      type === "quote" ? { attribution: "", id: createId(), text: "", type } :
      { id: createId(), items: [""], style: "bullet", type };

    updateEditor({ blocks: [...editorPost.blocks, block as BlogContentBlock] });
  };

  const addStarterOutline = (blocks: BlogContentBlock[]) => {
    updateEditor({ blocks: [...editorPost.blocks, ...cloneBlocks(blocks)] });
  };

  const duplicatePostAsDraft = (source: EditorPost = editorPost) => {
    const copyTitle = `Copy of ${source.title || "Untitled blog"}`;
    setEditorPost({
      ...source,
      blocks: cloneBlocks(source.blocks),
      id: undefined,
      publishedAt: undefined,
      slug: slugify(copyTitle),
      status: "draft",
      title: copyTitle
    });
    setSlugEdited(false);
    setStatus("Reference blog copied as a new draft.");
    goToAdmin("/admin/blogs/new");
  };

  const updateBlock = (index: number, block: BlogContentBlock) => {
    updateEditor({ blocks: editorPost.blocks.map((item, itemIndex) => itemIndex === index ? block : item) });
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    const next = [...editorPost.blocks];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const [block] = next.splice(index, 1);
    next.splice(target, 0, block);
    updateEditor({ blocks: next });
  };

  if (!token) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-panel" onSubmit={login}>
          <img src={floydeeLogo} alt="Floydee Future Foundation" />
          <p className="section-label">Blog Creator</p>
          <h1>Open the Floydee publishing desk.</h1>
          <p>Use the staff passcode to create categories, draft stories, and prepare posts for the foundation website.</p>
          <Field label="Admin passcode">
            <input autoComplete="current-password" type="password" value={loginPasscode} onChange={(event) => setLoginPasscode(event.target.value)} />
          </Field>
          <button className="button button-primary" disabled={busy} type="submit">{busy ? "Checking..." : "Enter CMS"}</button>
          <p className="form-status" role="status">{status}</p>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-cms-page">
      <header className="admin-cms-header">
        <div>
          <p className="section-label">Floydee Blog Creator</p>
          <h1>Write once. Route stories by program, category, and purpose.</h1>
        </div>
        <div className="admin-header-actions">
          <button className="button button-secondary" onClick={startNewPost} type="button">New blog</button>
          <button className="button button-text" onClick={() => { sessionStorage.removeItem(sessionKey); setToken(""); }} type="button">Sign out</button>
        </div>
      </header>

      <section className="admin-metrics" aria-label="Blog CMS summary">
        <article><strong>{posts.length}</strong><span>Total posts</span></article>
        <article><strong>{posts.filter((post) => post.status === "published").length}</strong><span>Published</span></article>
        <article><strong>{posts.filter((post) => post.status === "draft").length}</strong><span>Drafts</span></article>
        <article><strong>{categories.filter((category) => category.status === "active").length}</strong><span>Active categories</span></article>
      </section>

      <nav className="admin-subnav" aria-label="Blog admin sections">
        <button className={route.view === "library" ? "is-active" : ""} onClick={() => goToAdmin("/admin/blogs")} type="button">Library</button>
        <button className={route.view === "editor" ? "is-active" : ""} onClick={startNewPost} type="button">Write</button>
        <button className={route.view === "categories" ? "is-active" : ""} onClick={() => goToAdmin("/admin/blogs/categories")} type="button">Categories</button>
      </nav>

      {route.view === "library" ? (
        <section className="admin-page-shell">
          <div className="admin-panel-heading">
            <div>
              <h2>Blog library</h2>
              <span className="admin-helper">Choose a post to edit, or duplicate a reference post as a draft.</span>
            </div>
            <button className="button button-primary" onClick={startNewPost} type="button">Write new blog</button>
          </div>
          <div className="admin-filter-grid">
            <input placeholder="Search posts" value={search} onChange={(event) => setSearch(event.target.value)} />
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as BlogStatus | "all")}>
              <option value="all">All statuses</option>
              <option value="draft">Drafts</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All categories</option>
              {categories.filter((category) => category.status === "active").map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
            </select>
          </div>
          <div className="admin-reference-grid">
            {filteredPosts.map((post) => (
              <article className="admin-reference-card" key={post.id}>
                {post.heroImage?.url ? <img src={imagePreviewUrl(post.heroImage.url)} alt={post.heroImage.alt ?? ""} /> : <div className="admin-reference-empty">No image</div>}
                <div>
                  <div className="blog-preview-meta">
                    <span>{post.categorySlugs.join(" / ") || "No category"}</span>
                    <StatusPill status={post.status} />
                  </div>
                  <h3>{post.title || "Untitled draft"}</h3>
                  <p>{post.excerpt || "No excerpt yet."}</p>
                </div>
                <div className="admin-card-actions">
                  <button className="admin-small-button" onClick={() => selectPost(post)} type="button">Edit</button>
                  <button className="admin-small-button" onClick={() => duplicatePostAsDraft(post)} type="button">Duplicate draft</button>
                </div>
              </article>
            ))}
            {!filteredPosts.length ? <p className="admin-empty">No blog posts match this view.</p> : null}
          </div>
        </section>
      ) : null}

      {route.view === "editor" ? (
        <section className="admin-workspace admin-workspace-compose">
          <section className="admin-editor-panel">
          <div className="admin-panel-heading">
            <h2>{editorPost.id ? "Edit blog" : "Create blog"}</h2>
            <div className="admin-heading-actions">
              {editorPost.id ? <button className="admin-small-button" onClick={() => duplicatePostAsDraft()} type="button">Duplicate draft</button> : null}
              <StatusPill status={editorPost.status} />
            </div>
          </div>
          <div className="writing-brief">
            <strong>Writing focus</strong>
            <span>{selectedCategories.length ? selectedCategories.map((category) => category.name).join(" / ") : "Choose a category so this post can route to the right website section."}</span>
          </div>
          <div className="admin-form-grid two">
            <Field label="Title">
              <input value={editorPost.title} onChange={(event) => {
                const title = event.target.value;
                updateEditor({ slug: slugEdited ? editorPost.slug : slugify(title), title });
              }} />
            </Field>
            <Field label="Slug"><input value={editorPost.slug} onChange={(event) => { setSlugEdited(true); updateEditor({ slug: slugify(event.target.value) }); }} /></Field>
            <Field label="Excerpt"><textarea rows={3} value={editorPost.excerpt} onChange={(event) => updateEditor({ excerpt: event.target.value })} /></Field>
            <Field label="Author"><input value={editorPost.author ?? ""} onChange={(event) => updateEditor({ author: event.target.value })} /></Field>
            <Field label="Categories">
              <select multiple value={editorPost.categorySlugs} onChange={(event) => updateEditor({ categorySlugs: Array.from(event.target.selectedOptions).map((option) => option.value) })}>
                {categories.filter((category) => category.status === "active").map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
            </Field>
            <Field label="Program association">
              <select value={editorPost.programAssociation} onChange={(event) => updateEditor({ programAssociation: event.target.value as BlogProgramAssociation })}>
                {Object.entries(programLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Tags"><input value={arrayToInput(editorPost.tags)} onChange={(event) => updateEditor({ tags: inputToArray(event.target.value) })} placeholder="health, education, field update" /></Field>
            <Field label="Publish date"><input type="date" value={editorPost.publishedAt?.slice(0, 10) ?? ""} onChange={(event) => updateEditor({ publishedAt: event.target.value || undefined })} /></Field>
          </div>

          <section className="admin-editor-section">
            <div className="admin-panel-heading"><h3>Hero media</h3></div>
            <MediaFields media={editorPost.heroImage ?? { alt: "", caption: "", url: "" }} onChange={(heroImage) => updateEditor({ heroImage })} />
          </section>

          <section className="admin-editor-section">
            <div className="admin-panel-heading"><h3>SEO</h3><span className="admin-helper">Search title, summary, and keywords</span></div>
            <div className="admin-form-grid compact">
              <Field label="SEO title"><input value={editorPost.seo.title ?? ""} onChange={(event) => updateEditor({ seo: { ...editorPost.seo, title: event.target.value } })} /></Field>
              <Field label="SEO description"><textarea rows={3} value={editorPost.seo.description ?? ""} onChange={(event) => updateEditor({ seo: { ...editorPost.seo, description: event.target.value } })} /></Field>
              <Field label="SEO keywords"><input value={arrayToInput(editorPost.seo.keywords)} onChange={(event) => updateEditor({ seo: { ...editorPost.seo, keywords: inputToArray(event.target.value) } })} /></Field>
            </div>
          </section>

          <section className="admin-editor-section">
            <div className="admin-panel-heading"><h3>Content blocks</h3><span className="admin-helper">{editorPost.blocks.length} blocks</span></div>
            <div className="starter-outline-grid">
              {starterOutlines.map((outline) => (
                <button key={outline.name} onClick={() => addStarterOutline(outline.blocks)} type="button">
                  <strong>{outline.name}</strong>
                  <span>{outline.description}</span>
                </button>
              ))}
            </div>
            <div className="block-add-bar">
              {(["heading", "paragraph", "image", "youtube", "quote", "list"] as const).map((type) => <button className="admin-small-button" key={type} onClick={() => addBlock(type)} title={blockDescriptions[type]} type="button">{blockLabels[type]}</button>)}
            </div>
            <div className="content-block-stack">
              {editorPost.blocks.map((block, index) => (
                <BlockEditor
                  block={block}
                  index={index}
                  key={block.id}
                  onChange={(nextBlock) => updateBlock(index, nextBlock)}
                  onMove={(direction) => moveBlock(index, direction)}
                  onRemove={() => updateEditor({ blocks: editorPost.blocks.filter((_, itemIndex) => itemIndex !== index) })}
                  total={editorPost.blocks.length}
                />
              ))}
            </div>
          </section>

          <div className="admin-action-bar">
            <button className="button button-secondary" disabled={busy} onClick={() => savePost("draft")} type="button">Save draft</button>
            <button className="button button-primary" disabled={busy} onClick={() => savePost("published")} type="button">Publish</button>
            {editorPost.id ? <button className="button button-text" disabled={busy} onClick={() => savePost("archived")} type="button">Archive</button> : null}
            <p className="form-status" role="status">{status}</p>
          </div>
        </section>

        <aside className="admin-preview-panel">
          <section className="publish-checklist">
            <div className="admin-panel-heading">
              <h2>Publish readiness</h2>
              <span className="admin-helper">{readyCount}/{publishChecks.length}</span>
            </div>
            <div>
              {publishChecks.map(([label, ready]) => (
                <span className={ready ? "is-ready" : ""} key={label}>{ready ? "Ready" : "Needs"} {label}</span>
              ))}
            </div>
          </section>
          <BlogPreview post={editorPost} />
        </aside>
      </section>
      ) : null}

      {route.view === "categories" ? (
        <section className="admin-workspace admin-workspace-categories">
          <section className="category-manager admin-category-page">
            <div className="admin-panel-heading">
              <div>
                <h2>Categories</h2>
                <span className="admin-helper">Use categories to route stories into AAROHI, SAKHI, VIDYA, or general website sections.</span>
              </div>
              {editingCategoryId ? <button className="admin-small-button" onClick={() => { setEditingCategoryId(""); setCategorySlugEdited(false); setCategoryForm({ description: "", name: "", programAssociation: "general", slug: "" }); }} type="button">Cancel edit</button> : null}
            </div>
            <form className="admin-category-form" onSubmit={saveCategory}>
              <Field label="Name">
                <input value={categoryForm.name} onChange={(event) => {
                  const name = event.target.value;
                  setCategoryForm((current) => ({ ...current, name, slug: categorySlugEdited ? current.slug : slugify(name) }));
                }} />
              </Field>
              <Field label="Slug"><input value={categoryForm.slug} onChange={(event) => { setCategorySlugEdited(true); setCategoryForm((current) => ({ ...current, slug: slugify(event.target.value) })); }} /></Field>
              <Field label="Program">
                <select value={categoryForm.programAssociation} onChange={(event) => setCategoryForm((current) => ({ ...current, programAssociation: event.target.value as BlogProgramAssociation }))}>
                  {Object.entries(programLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
              </Field>
              <Field label="Description"><textarea rows={3} value={categoryForm.description} onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))} /></Field>
              <button className="button button-secondary" disabled={busy} type="submit">{editingCategoryId ? "Update category" : "Create category"}</button>
              <p className="form-status" role="status">{status}</p>
            </form>
            <div className="category-list">
              {categories.map((category) => (
                <article key={category.id}>
                  <div>
                    <strong>{category.name}</strong>
                    <span>{category.slug} / {programLabels[category.programAssociation]}</span>
                  </div>
                  <div>
                    <button className="admin-small-button" onClick={() => editCategory(category)} type="button">Edit</button>
                    {category.status === "active" ? <button className="admin-small-button danger" onClick={() => archiveCategory(category)} type="button">Archive</button> : <span className="admin-status admin-status-archived">archived</span>}
                  </div>
                </article>
              ))}
            </div>
          </section>
          <aside className="admin-guide-panel">
            <h2>Category guide</h2>
            <p>Attach one program association to each category. Public pages can later ask for posts by program or category without manual curation.</p>
            <div>
              {Object.entries(programLabels).map(([value, label]) => (
                <article key={value}>
                  <strong>{label}</strong>
                  <span>{categories.filter((category) => category.programAssociation === value && category.status === "active").length} active categories</span>
                </article>
              ))}
            </div>
          </aside>
        </section>
      ) : null}
    </main>
  );
}
