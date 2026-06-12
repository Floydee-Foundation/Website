import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import type {
  BlogCategory,
  BlogCategoryKind,
  BlogChannel,
  BlogContentBlock,
  BlogImageMedia,
  BlogPost,
  BlogProgramAssociation,
  BlogStatus
} from "@floydee/shared";
import floydeeLogo from "./assets/floydee-logo.png";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "");
const sessionKey = "floydee_blog_admin_token";
const sessionExpiredEvent = "floydee-blog-admin-session-expired";
const sessionExpiredMessage = "Your admin session expired. Enter the staff passcode again to continue.";

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
  categoryKind: "general",
  categorySlug: undefined,
  categorySlugs: [],
  channels: [],
  eventDate: undefined,
  excerpt: "",
  featured: false,
  heroImage: undefined,
  location: "",
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

const categoryKindLabels: Record<BlogCategoryKind, string> = {
  campaign: "Campaign",
  general: "General",
  workshop: "Workshop"
};

const channelLabels: Record<BlogChannel, string> = {
  media: "Media",
  news: "News"
};

const namedCategoryKinds: BlogCategoryKind[] = ["workshop", "campaign"];

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

function listInputToItems(value: string) {
  return value.split("\n");
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

function mediaInternalized(media?: BlogImageMedia) {
  return !media?.url || (media.storageProvider === "vercel-blob" && media.importStatus === "ready");
}

function driveMediaConfirmed(post: EditorPost) {
  if (!mediaInternalized(post.heroImage)) return false;

  return post.blocks.every((block) => {
    if (block.type === "image") return mediaInternalized(block.media);
    if (block.type === "youtube" && isGoogleDriveUrl(block.url)) return Boolean(block.publicAccessConfirmed);
    return true;
  });
}

function expireAdminSession() {
  sessionStorage.removeItem(sessionKey);
  window.dispatchEvent(new Event(sessionExpiredEvent));
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

  if (response.status === 401 && token) expireAdminSession();

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

function BlogPreview({ categories, post }: { categories: BlogCategory[]; post: EditorPost }) {
  const hero = post.heroImage?.url ? imagePreviewUrl(post.heroImage.url) : "";
  const category = categories.find((item) => item.programAssociation === post.programAssociation && item.kind === post.categoryKind && item.slug === post.categorySlug);

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
        <span>{programLabels[post.programAssociation]}</span>
        <span>{categoryKindLabels[post.categoryKind]}</span>
        {category ? <span>{category.name}</span> : null}
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
  return <ListTag>{block.items.filter((item) => item.trim()).map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ListTag>;
}

function BlockEditor({
  block,
  imageName,
  index,
  onChange,
  onMove,
  onRemove,
  token,
  total
}: {
  block: BlogContentBlock;
  imageName: string;
  index: number;
  onChange: (block: BlogContentBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
  token: string;
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
        <MediaFields imageName={imageName} media={block.media} onChange={(media) => onChange({ ...block, media })} token={token} />
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
            <textarea rows={5} value={block.items.join("\n")} onChange={(event) => onChange({ ...block, items: listInputToItems(event.target.value) })} />
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

function MediaFields({ imageName, media, onChange, token }: { imageName: string; media: BlogImageMedia; onChange: (media: BlogImageMedia) => void; token: string }) {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const sourceUrl = media.sourceUrl ?? (media.storageProvider === "vercel-blob" ? "" : media.url);

  const importDrive = async () => {
    setBusy(true);
    setStatus("Importing and optimizing image...");
    try {
      const result = await apiRequest<{ media: BlogImageMedia }>("/api/admin/media/import-drive", token, {
        body: JSON.stringify({
          alt: media.alt,
          caption: media.caption,
          name: imageName,
          publicAccessConfirmed: media.publicAccessConfirmed,
          sourceUrl
        }),
        method: "POST"
      });
      onChange(result.media);
      setStatus("Optimized WebP image stored internally.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Image could not be imported.");
    } finally {
      setBusy(false);
    }
  };

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setStatus("Uploading and optimizing image...");
    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/media/upload`, {
        body: file,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type || "application/octet-stream",
          "X-Image-Name": slugify(imageName)
        },
        method: "POST"
      });
      const result = (await response.json().catch(() => null)) as AdminResponse<{ media: BlogImageMedia }> | null;
      if (response.status === 401) expireAdminSession();
      if (!response.ok || !result?.ok) throw new Error(result?.message ?? "Image could not be uploaded.");
      onChange({ ...result.media, alt: media.alt, caption: media.caption });
      setStatus("Optimized WebP image stored internally.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Image could not be uploaded.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-form-grid compact admin-media-fields">
      <Field label="Google Drive image link"><input value={sourceUrl} onChange={(event) => onChange({ alt: media.alt, caption: media.caption, publicAccessConfirmed: false, sourceUrl: event.target.value, url: event.target.value })} /></Field>
      <Field label="Alt text"><input value={media.alt ?? ""} onChange={(event) => onChange({ ...media, alt: event.target.value })} /></Field>
      <Field label="Caption"><input value={media.caption ?? ""} onChange={(event) => onChange({ ...media, caption: event.target.value })} /></Field>
      {isGoogleDriveUrl(sourceUrl) ? (
        <PublicDriveConfirmation
          checked={Boolean(media.publicAccessConfirmed)}
          onChange={(publicAccessConfirmed) => onChange({ ...media, publicAccessConfirmed })}
        />
      ) : null}
      <div className="admin-media-actions">
        <button className="button button-secondary" disabled={busy || !isGoogleDriveUrl(sourceUrl) || !media.publicAccessConfirmed} onClick={importDrive} type="button">Import &amp; optimize</button>
        <label className="button button-text">Upload image<input accept="image/jpeg,image/png,image/webp,image/avif,image/tiff,image/gif" disabled={busy} onChange={(event) => upload(event.target.files?.[0])} type="file" /></label>
      </div>
      {media.storageProvider === "vercel-blob" && media.importStatus === "ready" ? (
        <div className="admin-media-ready">
          <img src={media.url} alt="" />
          <span>Internal WebP · {media.width}×{media.height} · {media.variants?.length ?? 1} responsive sizes</span>
        </div>
      ) : null}
      <p className="form-status" role="status">{status}</p>
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
  const [categoryForm, setCategoryForm] = useState({
    description: "",
    kind: "workshop" as BlogCategoryKind,
    name: "",
    programAssociation: "general" as BlogProgramAssociation,
    slug: ""
  });
  const [editingCategoryId, setEditingCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");
  const [programFilter, setProgramFilter] = useState<BlogProgramAssociation | "all">("all");
  const [categoryKindFilter, setCategoryKindFilter] = useState<BlogCategoryKind | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const [categorySlugEdited, setCategorySlugEdited] = useState(false);

  const filteredPosts = useMemo(() => posts.filter((post) => {
    const matchesSearch = !search || `${post.title} ${post.excerpt} ${post.location ?? ""}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || post.status === statusFilter;
    const matchesProgram = programFilter === "all" || post.programAssociation === programFilter;
    const matchesKind = categoryKindFilter === "all" || post.categoryKind === categoryKindFilter;
    const matchesCategory = categoryFilter === "all" || post.categorySlug === categoryFilter;
    return matchesSearch && matchesStatus && matchesProgram && matchesKind && matchesCategory;
  }), [categoryFilter, categoryKindFilter, posts, programFilter, search, statusFilter]);

  const visibleNamedCategories = useMemo(() => categories.filter((category) => (
    category.status === "active" &&
    namedCategoryKinds.includes(category.kind) &&
    category.programAssociation === editorPost.programAssociation &&
    category.kind === editorPost.categoryKind
  )), [categories, editorPost.categoryKind, editorPost.programAssociation]);

  const filteredNameOptions = useMemo(() => categories.filter((category) => (
    category.status === "active" &&
    namedCategoryKinds.includes(category.kind) &&
    (programFilter === "all" || category.programAssociation === programFilter) &&
    (categoryKindFilter === "all" || category.kind === categoryKindFilter)
  )), [categories, categoryKindFilter, programFilter]);

  const publishChecks = [
    ["Title", Boolean(editorPost.title.trim())],
    ["Slug", Boolean(editorPost.slug.trim())],
    ["Excerpt", Boolean(editorPost.excerpt.trim())],
    ["Program", Boolean(editorPost.programAssociation)],
    ["Category type", Boolean(editorPost.categoryKind)],
    ["Name", editorPost.categoryKind === "general" || Boolean(editorPost.categorySlug || newCategoryName.trim())],
    ["Content", editorPost.blocks.length > 0],
    ["Internal media", driveMediaConfirmed(editorPost)],
    ["Hero alt text", !editorPost.heroImage?.url || Boolean(editorPost.heroImage.alt?.trim())],
    ["SEO summary", Boolean(editorPost.seo.description?.trim())]
  ] as const;

  const readyCount = publishChecks.filter(([, ready]) => ready).length;
  const selectedCategory = categories.find((category) => (
    category.programAssociation === editorPost.programAssociation &&
    category.kind === editorPost.categoryKind &&
    category.slug === editorPost.categorySlug
  ));

  const loadContent = async (activeToken = token) => {
    if (!activeToken) return;

    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const [categoryResult, postResult] = await Promise.all([
          apiRequest<{ categories: BlogCategory[] }>("/api/admin/blog-categories", activeToken),
          apiRequest<{ posts: BlogPost[] }>("/api/admin/blog-posts", activeToken)
        ]);
        setCategories(categoryResult.categories);
        setPosts(postResult.posts);
        return;
      } catch (error) {
        if (attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
    }
  };

  useEffect(() => {
    if (!token) return;
    loadContent().catch((error) => {
      setStatus(error instanceof Error ? error.message : "Could not load blog CMS content.");
      setCategories([]);
      setPosts([]);
    });
  }, [token]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setToken("");
      setStatus(sessionExpiredMessage);
    };

    window.addEventListener(sessionExpiredEvent, handleSessionExpired);
    return () => window.removeEventListener(sessionExpiredEvent, handleSessionExpired);
  }, []);

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
    setNewCategoryName("");
    setSlugEdited(false);
    goToAdmin("/admin/blogs/new");
  };

  const selectPost = (post: BlogPost) => {
    setEditorPost(post);
    setNewCategoryName("");
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
        setNewCategoryName("");
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
      setCategoryForm({ description: "", kind: "workshop", name: "", programAssociation: "general", slug: "" });
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
      kind: namedCategoryKinds.includes(category.kind) ? category.kind : "workshop",
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

  const removeNameFromDropdown = async (category: BlogCategory) => {
    setBusy(true);
    setStatus("");
    try {
      await apiRequest(`/api/admin/blog-categories/${category.id}`, token, {
        body: JSON.stringify({ status: "archived" }),
        method: "PATCH"
      });
      updateEditor({ categorySlug: undefined });
      setNewCategoryName("");
      setStatus(`${category.name} removed from the ${categoryKindLabels[category.kind].toLowerCase()} dropdown.`);
      await loadContent();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Name could not be removed from the dropdown.");
    } finally {
      setBusy(false);
    }
  };

  const savePost = async (nextStatus: BlogStatus = editorPost.status) => {
    setBusy(true);
    setStatus("");
    const payload = {
      ...editorPost,
      categoryName: editorPost.categoryKind === "general" ? "" : newCategoryName.trim(),
      categorySlug: editorPost.categoryKind === "general" ? "" : editorPost.categorySlug,
      slug: editorPost.slug || slugify(editorPost.title),
      status: nextStatus
    };

    try {
      const result = editorPost.id
        ? await apiRequest<{ post: BlogPost }>(`/api/admin/blog-posts/${editorPost.id}`, token, { body: JSON.stringify(payload), method: "PATCH" })
        : await apiRequest<{ post: BlogPost }>("/api/admin/blog-posts", token, { body: JSON.stringify(payload), method: "POST" });

      setEditorPost(result.post);
      setNewCategoryName("");
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
      categorySlug: source.categoryKind === "general" ? undefined : source.categorySlug,
      featured: false,
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
            <select value={programFilter} onChange={(event) => { setProgramFilter(event.target.value as BlogProgramAssociation | "all"); setCategoryFilter("all"); }}>
              <option value="all">All programs</option>
              {Object.entries(programLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select value={categoryKindFilter} onChange={(event) => { setCategoryKindFilter(event.target.value as BlogCategoryKind | "all"); setCategoryFilter("all"); }}>
              <option value="all">All category types</option>
              {Object.entries(categoryKindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="all">All names</option>
              {filteredNameOptions.map((category) => <option key={`${category.programAssociation}-${category.kind}-${category.slug}`} value={category.slug}>{programLabels[category.programAssociation]} / {categoryKindLabels[category.kind]} / {category.name}</option>)}
            </select>
          </div>
          <div className="admin-reference-grid">
            {filteredPosts.map((post) => (
              <article className="admin-reference-card" key={post.id}>
                {post.heroImage?.url ? <img src={imagePreviewUrl(post.heroImage.url)} alt={post.heroImage.alt ?? ""} /> : <div className="admin-reference-empty">No image</div>}
                <div>
                  <div className="blog-preview-meta">
                    <span>{programLabels[post.programAssociation]}</span>
                    <span>{categoryKindLabels[post.categoryKind]}</span>
                    {post.channels.map((channel) => <span key={channel}>{channelLabels[channel]}</span>)}
                    <StatusPill status={post.status} />
                  </div>
                  <h3>{post.title || "Untitled draft"}</h3>
                  <p>{post.excerpt || "No excerpt yet."}</p>
                  {post.location || post.eventDate ? <p className="admin-reference-event">{post.location || "Location not set"}{post.eventDate ? ` · ${post.eventDate}` : ""}</p> : null}
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
            <span>
              {programLabels[editorPost.programAssociation]} / {categoryKindLabels[editorPost.categoryKind]}
              {editorPost.categoryKind !== "general" ? ` / ${selectedCategory?.name ?? (newCategoryName.trim() || "Choose or add a name")}` : ""}
            </span>
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
            <Field label="Program">
              <select value={editorPost.programAssociation} onChange={(event) => {
                updateEditor({ categorySlug: undefined, programAssociation: event.target.value as BlogProgramAssociation });
                setNewCategoryName("");
              }}>
                {Object.entries(programLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            <Field label="Category type">
              <select value={editorPost.categoryKind} onChange={(event) => {
                const categoryKind = event.target.value as BlogCategoryKind;
                updateEditor({ categoryKind, categorySlug: undefined });
                setNewCategoryName("");
              }}>
                {Object.entries(categoryKindLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </Field>
            {editorPost.categoryKind !== "general" ? (
              <>
                <Field label={`${categoryKindLabels[editorPost.categoryKind]} name`}>
                  <div className="admin-select-remove-row">
                    <select value={editorPost.categorySlug ?? ""} onChange={(event) => {
                      updateEditor({ categorySlug: event.target.value || undefined });
                      setNewCategoryName("");
                    }}>
                      <option value="">Add a new name or select existing</option>
                      {visibleNamedCategories.map((category) => <option key={`${category.programAssociation}-${category.kind}-${category.slug}`} value={category.slug}>{category.name}</option>)}
                    </select>
                    <button
                      aria-label={selectedCategory ? `Remove ${selectedCategory.name} from dropdown` : "Remove selected name from dropdown"}
                      className="admin-remove-name-button"
                      disabled={busy || !selectedCategory}
                      onClick={() => selectedCategory ? removeNameFromDropdown(selectedCategory) : undefined}
                      title={selectedCategory ? `Remove ${selectedCategory.name} from dropdown` : "Select a name to remove"}
                      type="button"
                    >
                      X
                    </button>
                  </div>
                </Field>
                <Field label={`New ${categoryKindLabels[editorPost.categoryKind].toLowerCase()} name`}>
                  <input
                    disabled={Boolean(editorPost.categorySlug)}
                    value={newCategoryName}
                    onChange={(event) => {
                      setNewCategoryName(event.target.value);
                      updateEditor({ categorySlug: undefined });
                    }}
                    placeholder={editorPost.categorySlug ? "Using existing name" : "Type a new name"}
                  />
                </Field>
              </>
            ) : null}
            <Field label="Tags"><input value={arrayToInput(editorPost.tags)} onChange={(event) => updateEditor({ tags: inputToArray(event.target.value) })} placeholder="health, education, field update" /></Field>
            <Field label="Publish date"><input type="date" value={editorPost.publishedAt?.slice(0, 10) ?? ""} onChange={(event) => updateEditor({ publishedAt: event.target.value || undefined })} /></Field>
            <Field label="Location"><input value={editorPost.location ?? ""} onChange={(event) => updateEditor({ location: event.target.value })} placeholder="Kolkata, West Bengal" /></Field>
            <Field label="Event date"><input type="date" value={editorPost.eventDate ?? ""} onChange={(event) => updateEditor({ eventDate: event.target.value || undefined })} /></Field>
          </div>
          <div className="admin-channel-controls" aria-label="Publishing channels">
            {(Object.entries(channelLabels) as Array<[BlogChannel, string]>).map(([channel, label]) => (
              <label className="admin-drive-confirmation" key={channel}>
                <input
                  checked={editorPost.channels.includes(channel)}
                  onChange={(event) => updateEditor({
                    channels: event.target.checked
                      ? [...editorPost.channels, channel]
                      : editorPost.channels.filter((item) => item !== channel)
                  })}
                  type="checkbox"
                />
                <span><strong>Show in {label}</strong>Published posts appear on the {label.toLowerCase()} archive.</span>
              </label>
            ))}
          </div>
          <label className="admin-drive-confirmation admin-featured-control">
            <input checked={Boolean(editorPost.featured)} onChange={(event) => updateEditor({ featured: event.target.checked })} type="checkbox" />
            <span><strong>Feature on Stories</strong>When published, this becomes the lead story and replaces the current featured post.</span>
          </label>

          <section className="admin-editor-section">
            <div className="admin-panel-heading"><h3>Hero media</h3></div>
            <MediaFields imageName={`${editorPost.slug || editorPost.title || "story"}-hero`} media={editorPost.heroImage ?? { alt: "", caption: "", url: "" }} onChange={(heroImage) => updateEditor({ heroImage })} token={token} />
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
                  imageName={`${editorPost.slug || editorPost.title || "story"}-${index + 1}`}
                  index={index}
                  key={block.id}
                  onChange={(nextBlock) => updateBlock(index, nextBlock)}
                  onMove={(direction) => moveBlock(index, direction)}
                  onRemove={() => updateEditor({ blocks: editorPost.blocks.filter((_, itemIndex) => itemIndex !== index) })}
                  token={token}
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
          <BlogPreview categories={categories} post={editorPost} />
        </aside>
      </section>
      ) : null}

      {route.view === "categories" ? (
        <section className="admin-workspace admin-workspace-categories">
          <section className="category-manager admin-category-page">
            <div className="admin-panel-heading">
              <div>
                <h2>Campaign and workshop names</h2>
                <span className="admin-helper">Create named campaign and workshop options under a parent program. General has no name.</span>
              </div>
              {editingCategoryId ? <button className="admin-small-button" onClick={() => { setEditingCategoryId(""); setCategorySlugEdited(false); setCategoryForm({ description: "", kind: "workshop", name: "", programAssociation: "general", slug: "" }); }} type="button">Cancel edit</button> : null}
            </div>
            <form className="admin-category-form" onSubmit={saveCategory}>
              <Field label="Name">
                <input value={categoryForm.name} onChange={(event) => {
                  const name = event.target.value;
                  setCategoryForm((current) => ({ ...current, name, slug: categorySlugEdited ? current.slug : slugify(name) }));
                }} />
              </Field>
              <Field label="Slug"><input value={categoryForm.slug} onChange={(event) => { setCategorySlugEdited(true); setCategoryForm((current) => ({ ...current, slug: slugify(event.target.value) })); }} /></Field>
              <Field label="Type">
                <select value={categoryForm.kind} onChange={(event) => setCategoryForm((current) => ({ ...current, kind: event.target.value as BlogCategoryKind }))}>
                  {namedCategoryKinds.map((kind) => <option key={kind} value={kind}>{categoryKindLabels[kind]}</option>)}
                </select>
              </Field>
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
              {categories.filter((category) => namedCategoryKinds.includes(category.kind)).map((category) => (
                <article key={category.id}>
                  <div>
                    <strong>{category.name}</strong>
                    <span>{programLabels[category.programAssociation]} / {categoryKindLabels[category.kind]} / {category.slug}</span>
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
            <p>Attach each campaign or workshop name to a parent program. General posts use only the program and category type.</p>
            <div>
              {Object.entries(programLabels).map(([value, label]) => (
                <article key={value}>
                  <strong>{label}</strong>
                  <span>{categories.filter((category) => category.programAssociation === value && category.status === "active" && namedCategoryKinds.includes(category.kind)).length} active names</span>
                </article>
              ))}
            </div>
          </aside>
        </section>
      ) : null}
    </main>
  );
}
