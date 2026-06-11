import { FormEvent, useEffect, useState } from "react";
import type { BlogCategory, BlogContentBlock, BlogPost, BlogProgramAssociation } from "@floydee/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "");
const pageSize = 9;

type BlogListResponse = {
  message?: string;
  ok: boolean;
  page: number;
  pageSize: number;
  posts: BlogPost[];
  total: number;
  totalPages: number;
};

type Filters = {
  categorySlug: string;
  page: number;
  programSlug: string;
  q: string;
  sort: "latest" | "oldest";
};

const programLabels: Record<BlogProgramAssociation, string> = {
  aarohi: "AAROHI",
  general: "Foundation",
  sakhi: "SAKHI",
  vidya: "VIDYA"
};

const programCtas: Record<BlogProgramAssociation, { href: string; label: string; text: string }> = {
  aarohi: { href: "/programs/aarohi", label: "Explore AAROHI", text: "Help open practical pathways into health information, screening, and care." },
  general: { href: "/partner-with-us", label: "Partner with Floydee", text: "Bring care, opportunity, and future-ready support into more communities." },
  sakhi: { href: "/programs/sakhi", label: "Explore SAKHI", text: "Support safe spaces where girls, women, and youth can be heard." },
  vidya: { href: "/programs/vidya", label: "Explore VIDYA", text: "Build pathways from education and exposure to confident employment." }
};

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { signal });
  const result = (await response.json().catch(() => null)) as (T & { message?: string; ok?: boolean }) | null;
  if (!response.ok || !result || result.ok === false) throw new Error(result?.message ?? "Stories could not be loaded.");
  return result;
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

function imageUrl(url: string) {
  const driveId = googleDriveFileId(url);
  return driveId ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w2000` : url;
}

function videoEmbedUrl(url: string) {
  const driveId = googleDriveFileId(url);
  if (driveId) return `https://drive.google.com/file/d/${driveId}/preview`;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id = host === "youtu.be" ? parsed.pathname.slice(1) : parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : "";
  } catch {
    return "";
  }
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function blockText(block: BlogContentBlock) {
  if (block.type === "heading" || block.type === "paragraph" || block.type === "quote") return block.text;
  if (block.type === "list") return block.items.join(" ");
  return "";
}

function readingTime(post: BlogPost) {
  const words = `${post.title} ${post.excerpt} ${post.blocks.map(blockText).join(" ")}`.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

function categoryName(post: BlogPost, categories: BlogCategory[]) {
  const matched = categories.filter((category) => post.categorySlugs.includes(category.slug));
  return matched.find((category) => category.programAssociation === post.programAssociation)?.name
    ?? matched[0]?.name
    ?? programLabels[post.programAssociation];
}

function postMeta(post: BlogPost, categories: BlogCategory[]) {
  return `${categoryName(post, categories)} · ${formatDate(post.publishedAt)} · ${readingTime(post)} min read`;
}

function parseFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const requestedPage = Number.parseInt(params.get("page") ?? "", 10);
  return {
    categorySlug: params.get("category") ?? "",
    page: Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    programSlug: params.get("program") ?? "",
    q: params.get("q") ?? "",
    sort: params.get("sort") === "oldest" ? "oldest" : "latest"
  };
}

function filtersToSearch(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.programSlug) params.set("program", filters.programSlug);
  if (filters.sort === "oldest") params.set("sort", "oldest");
  if (filters.page > 1) params.set("page", String(filters.page));
  return params.toString();
}

function setMeta(name: string, value: string, property = false) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${property ? "property" : "name"}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(element);
  }
  element.content = value;
}

function useArticleMeta(post?: BlogPost) {
  useEffect(() => {
    if (!post) return;
    const title = post.seo.title || `${post.title} | Floydee Future Foundation`;
    const description = post.seo.description || post.excerpt;
    const canonicalUrl = `${window.location.origin}/stories/${post.slug}`;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    document.title = title;
    canonical.href = canonicalUrl;
    setMeta("description", description);
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:type", "article", true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:image", post.heroImage?.url ? imageUrl(post.heroImage.url) : "", true);

    return () => {
      canonical?.remove();
      document.title = "Floydee Future Foundation";
      setMeta("og:type", "website", true);
    };
  }, [post]);
}

function StoryCard({ categories, post }: { categories: BlogCategory[]; post: BlogPost }) {
  return (
    <article className={`story-card${post.heroImage?.url ? "" : " story-card-text"}`}>
      <a className="story-card-media" href={`/stories/${post.slug}`} aria-label={`Read ${post.title}`}>
        {post.heroImage?.url ? <img src={imageUrl(post.heroImage.url)} alt={post.heroImage.alt ?? ""} /> : <span>{programLabels[post.programAssociation]}</span>}
      </a>
      <div className="story-card-copy">
        <p className="story-meta">{postMeta(post, categories)}</p>
        <h2><a href={`/stories/${post.slug}`}>{post.title}</a></h2>
        <p>{post.excerpt}</p>
        <a className="story-read-link" href={`/stories/${post.slug}`}>Read story <span aria-hidden="true">→</span></a>
      </div>
    </article>
  );
}

function FeaturedStory({ categories, post }: { categories: BlogCategory[]; post: BlogPost }) {
  return (
    <section className={`stories-feature${post.heroImage?.url ? "" : " stories-feature-text"}`} aria-labelledby="featured-story-title">
      <div className="stories-feature-media">
        {post.heroImage?.url ? <img src={imageUrl(post.heroImage.url)} alt={post.heroImage.alt ?? ""} /> : <span>{programLabels[post.programAssociation]}</span>}
      </div>
      <div className="stories-feature-copy">
        <p className="section-label">Featured story</p>
        <p className="story-meta">{postMeta(post, categories)}</p>
        <h2 id="featured-story-title">{post.title}</h2>
        <p>{post.excerpt}</p>
        <a className="button button-primary" href={`/stories/${post.slug}`}>Read story</a>
      </div>
    </section>
  );
}

export function StoriesHubPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [filters, setFilters] = useState<Filters>(parseFilters);
  const [searchText, setSearchText] = useState(filters.q);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featured, setFeatured] = useState<BlogPost>();
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 });
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const isUnfiltered = !filters.q && !filters.categorySlug && !filters.programSlug && filters.sort === "latest";
  const showFeatured = isUnfiltered && filters.page === 1 && featured;

  useEffect(() => {
    const handlePopState = () => {
      const next = parseFilters();
      setFilters(next);
      setSearchText(next.q);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    getJson<{ categories: BlogCategory[]; ok: boolean }>("/api/blog-categories", controller.signal)
      .then((result) => setCategories(result.categories))
      .catch(() => setCategories([]));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    setMessage("");

    const load = async () => {
      let lead = featured;
      if (isUnfiltered && !lead) {
        const leadResult = await getJson<BlogListResponse>("/api/blog-posts?featured=true&pageSize=1", controller.signal);
        lead = leadResult.posts[0];
        if (!lead) {
          const fallbackResult = await getJson<BlogListResponse>("/api/blog-posts?pageSize=24", controller.signal);
          lead = fallbackResult.posts.find((post) => post.heroImage?.url) ?? fallbackResult.posts[0];
        }
      }

      const params = new URLSearchParams({
        page: String(filters.page),
        pageSize: String(pageSize),
        sort: filters.sort
      });
      if (filters.q) params.set("q", filters.q);
      if (filters.categorySlug) params.set("categorySlug", filters.categorySlug);
      if (filters.programSlug) params.set("programSlug", filters.programSlug);
      if (isUnfiltered && lead) params.set("excludeSlug", lead.slug);

      const result = await getJson<BlogListResponse>(`/api/blog-posts?${params}`, controller.signal);
      setFeatured(lead);
      setPosts(result.posts);
      setPagination({ page: result.page, total: result.total, totalPages: result.totalPages });
      setStatus("ready");
    };

    load().catch((error) => {
      if (controller.signal.aborted) return;
      setPosts([]);
      setMessage(error instanceof Error ? error.message : "Stories could not be loaded.");
      setStatus("error");
    });
    return () => controller.abort();
  }, [filters]);

  const updateFilters = (patch: Partial<Filters>) => {
    const next = { ...filters, ...patch };
    const search = filtersToSearch(next);
    window.history.pushState(null, "", `/stories${search ? `?${search}` : ""}`);
    setFilters(next);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    updateFilters({ page: 1, q: searchText.trim() });
  };

  const resultLabel = status === "loading" ? "Loading stories" : `${pagination.total} ${pagination.total === 1 ? "story" : "stories"} found`;

  return (
    <main className="page stories-page">
      <section className="stories-intro">
        <div>
          <p className="section-label">Stories</p>
          <h1>Real voices. Practical change.</h1>
        </div>
        <p>Explore stories, field notes, resources, and progress from Floydee programs, partners, and communities.</p>
      </section>

      {showFeatured ? <FeaturedStory categories={categories} post={featured} /> : null}

      <section className="stories-library" aria-labelledby="stories-library-title">
        <div className="stories-library-heading">
          <div>
            <p className="section-label">From the field</p>
            <h2 id="stories-library-title">{filters.q ? `Results for “${filters.q}”` : "Explore every story"}</h2>
          </div>
          <p aria-live="polite" className="stories-result-count">{resultLabel}</p>
        </div>

        <form className="stories-filters" onSubmit={submitSearch}>
          <label className="stories-search">
            <span>Search stories</span>
            <div><input onChange={(event) => setSearchText(event.target.value)} placeholder="Search stories" value={searchText} /><button type="submit">Search</button></div>
          </label>
          <label><span>Category</span><select value={filters.categorySlug} onChange={(event) => updateFilters({ categorySlug: event.target.value, page: 1 })}><option value="">All categories</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
          <label><span>Program</span><select value={filters.programSlug} onChange={(event) => updateFilters({ page: 1, programSlug: event.target.value })}><option value="">All programs</option>{(["aarohi", "sakhi", "vidya", "general"] as const).map((program) => <option key={program} value={program}>{programLabels[program]}</option>)}</select></label>
          <label><span>Sort by</span><select value={filters.sort} onChange={(event) => updateFilters({ page: 1, sort: event.target.value as Filters["sort"] })}><option value="latest">Latest first</option><option value="oldest">Oldest first</option></select></label>
          {(filters.q || filters.categorySlug || filters.programSlug || filters.sort === "oldest") ? <button className="stories-clear" onClick={() => { setSearchText(""); updateFilters({ categorySlug: "", page: 1, programSlug: "", q: "", sort: "latest" }); }} type="button">Clear filters</button> : null}
        </form>

        {status === "loading" ? <div className="stories-state"><span className="stories-loader"></span><h3>Gathering stories from the field.</h3></div> : null}
        {status === "error" ? <div className="stories-state"><h3>Stories are temporarily unavailable.</h3><p>{message}</p><button className="button button-secondary" onClick={() => setFilters({ ...filters })} type="button">Try again</button></div> : null}
        {status === "ready" && !posts.length ? <div className="stories-state"><h3>No stories match this view.</h3><p>Try a broader search or clear the current filters.</p><button className="button button-secondary" onClick={() => { setSearchText(""); updateFilters({ categorySlug: "", page: 1, programSlug: "", q: "", sort: "latest" }); }} type="button">Show all stories</button></div> : null}
        {status === "ready" && posts.length ? <div className="stories-grid">{posts.map((post) => <StoryCard categories={categories} key={post.id} post={post} />)}</div> : null}

        {status === "ready" && pagination.totalPages > 1 ? (
          <nav aria-label="Stories pagination" className="stories-pagination">
            <button disabled={pagination.page <= 1} onClick={() => updateFilters({ page: pagination.page - 1 })} type="button">Previous</button>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <button disabled={pagination.page >= pagination.totalPages} onClick={() => updateFilters({ page: pagination.page + 1 })} type="button">Next</button>
          </nav>
        ) : null}
      </section>
    </main>
  );
}

function ArticleBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === "heading") return block.level === 3 ? <h3>{block.text}</h3> : <h2>{block.text}</h2>;
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "quote") return <blockquote><p>{block.text}</p>{block.attribution ? <cite>{block.attribution}</cite> : null}</blockquote>;
  if (block.type === "list") {
    const List = block.style === "numbered" ? "ol" : "ul";
    return <List>{block.items.map((item) => <li key={item}>{item}</li>)}</List>;
  }
  if (block.type === "image") return <figure><img src={imageUrl(block.media.url)} alt={block.media.alt ?? ""} />{block.media.caption ? <figcaption>{block.media.caption}</figcaption> : null}</figure>;
  const embed = videoEmbedUrl(block.url);
  return embed ? <div className="story-article-video"><iframe allowFullScreen src={embed} title={block.title || "Floydee story video"} /></div> : null;
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(available > 0 ? Math.min(100, Math.max(0, (window.scrollY / available) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return <div aria-hidden="true" className="story-progress"><span style={{ width: `${progress}%` }} /></div>;
}

export function StoryArticlePage({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost>();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  useArticleMeta(post);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    Promise.all([
      getJson<{ ok: boolean; post: BlogPost }>(`/api/blog-posts/${encodeURIComponent(slug)}`, controller.signal),
      getJson<{ categories: BlogCategory[]; ok: boolean }>("/api/blog-categories", controller.signal)
    ]).then(async ([postResult, categoryResult]) => {
      setPost(postResult.post);
      setCategories(categoryResult.categories);
      const matchedCategories = categoryResult.categories.filter((category) => postResult.post.categorySlugs.includes(category.slug));
      const firstCategory = matchedCategories.find((category) => category.programAssociation === postResult.post.programAssociation)?.slug
        ?? matchedCategories[0]?.slug;
      const paths = [
        firstCategory ? `/api/blog-posts?categorySlug=${encodeURIComponent(firstCategory)}&excludeSlug=${encodeURIComponent(slug)}&pageSize=3` : "",
        `/api/blog-posts?programSlug=${postResult.post.programAssociation}&excludeSlug=${encodeURIComponent(slug)}&pageSize=3`
      ].filter(Boolean);
      const relatedResults = await Promise.all(paths.map((path) => getJson<BlogListResponse>(path, controller.signal).catch(() => null)));
      const unique = new Map<string, BlogPost>();
      relatedResults.forEach((result) => result?.posts.forEach((item) => unique.set(item.slug, item)));
      setRelated(Array.from(unique.values()).slice(0, 3));
      setStatus("ready");
    }).catch((error) => {
      if (controller.signal.aborted) return;
      setMessage(error instanceof Error ? error.message : "This story could not be loaded.");
      setStatus("error");
    });
    return () => controller.abort();
  }, [slug]);

  const shareUrl = post ? `${window.location.origin}/stories/${post.slug}` : window.location.href;
  const share = async () => {
    if (!post) return;
    try {
      if (navigator.share) await navigator.share({ text: post.excerpt, title: post.title, url: shareUrl });
      else {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus("Link copied");
      }
    } catch {
      setShareStatus("");
    }
  };

  if (status === "loading") return <main className="page"><div className="stories-state story-article-state"><span className="stories-loader"></span><h1>Opening story.</h1></div></main>;
  if (status === "error" || !post) return <main className="page"><div className="stories-state story-article-state"><p className="section-label">Story not found</p><h1>This story is not available.</h1><p>{message}</p><a className="button button-primary" href="/stories">Explore stories</a></div></main>;

  const cta = programCtas[post.programAssociation];
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <main className="page story-article-page">
      <ReadingProgress />
      <article>
        <header className={`story-article-hero${post.heroImage?.url ? "" : " story-article-hero-text"}`}>
          <div className="story-article-heading">
            <a className="story-back-link" href="/stories">← All stories</a>
            <p className="story-meta">{postMeta(post, categories)}</p>
            <h1>{post.title}</h1>
            <p className="story-article-excerpt">{post.excerpt}</p>
            <div className="story-byline"><strong>{post.author || "Floydee Team"}</strong><span>{formatDate(post.publishedAt)}</span><span>{readingTime(post)} min read</span></div>
          </div>
          {post.heroImage?.url ? <figure><img src={imageUrl(post.heroImage.url)} alt={post.heroImage.alt ?? ""} />{post.heroImage.caption ? <figcaption>{post.heroImage.caption}</figcaption> : null}</figure> : <div className="story-article-program">{programLabels[post.programAssociation]}</div>}
        </header>

        <div className="story-article-layout">
          <aside className="story-share" aria-label="Share this story">
            <span>Share</span>
            <button onClick={share} type="button">Share</button>
            <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} rel="noreferrer" target="_blank">WhatsApp</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} rel="noreferrer" target="_blank">LinkedIn</a>
            <button onClick={async () => { await navigator.clipboard.writeText(shareUrl); setShareStatus("Link copied"); }} type="button">Copy link</button>
            <small aria-live="polite">{shareStatus}</small>
          </aside>
          <div className="story-article-body">{post.blocks.map((block) => <ArticleBlock block={block} key={block.id} />)}</div>
        </div>
      </article>

      <section className="story-program-cta">
        <div><p className="section-label">{programLabels[post.programAssociation]}</p><h2>Turn this story into the next step.</h2><p>{cta.text}</p></div>
        <a className="button button-primary" href={cta.href}>{cta.label}</a>
      </section>

      {related.length ? <section className="story-related" aria-labelledby="related-stories-title"><div><p className="section-label">Keep reading</p><h2 id="related-stories-title">Related stories</h2></div><div className="stories-grid">{related.map((item) => <StoryCard categories={categories} key={item.id} post={item} />)}</div></section> : null}
    </main>
  );
}
