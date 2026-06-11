import { FormEvent, useEffect, useState } from "react";
import type { BlogCategory, BlogCategoryKind, BlogContentBlock, BlogImageMedia, BlogPost, BlogProgramAssociation } from "@floydee/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "");
const pageSize = 9;
const storyCachePrefix = "floydee_story_cache_v1:";
const storyCacheTtlMs = 1000 * 60 * 60 * 24;

class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

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
  categoryKind: BlogCategoryKind | "";
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

const categoryKindLabels: Record<BlogCategoryKind, string> = {
  campaign: "Campaign",
  general: "General",
  workshop: "Workshop"
};

const programCtas: Record<BlogProgramAssociation, { href: string; label: string; text: string }> = {
  aarohi: { href: "/programs/aarohi", label: "Explore AAROHI", text: "Help open practical pathways into health information, screening, and care." },
  general: { href: "/partner-with-us", label: "Partner with Floydee", text: "Bring care, opportunity, and future-ready support into more communities." },
  sakhi: { href: "/programs/sakhi", label: "Explore SAKHI", text: "Support safe spaces where girls, women, and youth can be heard." },
  vidya: { href: "/programs/vidya", label: "Explore VIDYA", text: "Build pathways from education and exposure to confident employment." }
};

function readStoryCache<T>(path: string) {
  try {
    const cached = JSON.parse(localStorage.getItem(`${storyCachePrefix}${path}`) ?? "null") as { savedAt?: number; value?: T } | null;
    return cached?.savedAt && cached.value && Date.now() - cached.savedAt < storyCacheTtlMs ? cached.value : undefined;
  } catch {
    return undefined;
  }
}

function writeStoryCache<T>(path: string, value: T) {
  try {
    localStorage.setItem(`${storyCachePrefix}${path}`, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Storage can be unavailable in private browsing; live requests still work.
  }
}

function retryableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

async function getJson<T>(path: string, signal?: AbortSignal, allowCache = true): Promise<T & { fromCache?: boolean }> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`${apiBaseUrl}${path}`, { signal });
      const result = (await response.json().catch(() => null)) as (T & { message?: string; ok?: boolean }) | null;
      if (!response.ok || !result || result.ok === false) {
        throw new HttpError(result?.message ?? "Stories could not be loaded.", response.status);
      }
      writeStoryCache(path, result);
      return result;
    } catch (error) {
      if (signal?.aborted) throw error;
      lastError = error;
      if (error instanceof HttpError && !retryableStatus(error.status)) break;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 350 * (2 ** attempt) + Math.random() * 180));
    }
  }
  if (lastError instanceof HttpError && lastError.status === 404) throw lastError;
  const cached = allowCache ? readStoryCache<T>(path) : undefined;
  if (cached) return Object.assign(cached as T & { fromCache?: boolean }, { fromCache: true });
  throw lastError;
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

function imageSrcSet(media: BlogImageMedia) {
  return media.variants?.length ? media.variants.map((variant) => `${variant.url} ${variant.width}w`).join(", ") : undefined;
}

function StoryImage({
  eager = false,
  media,
  sizes
}: {
  eager?: boolean;
  media: BlogImageMedia;
  sizes: string;
}) {
  return (
    <img
      alt={media.alt ?? ""}
      decoding="async"
      fetchPriority={eager ? "high" : "auto"}
      height={media.height}
      loading={eager ? "eager" : "lazy"}
      onError={(event) => { event.currentTarget.classList.add("story-image-failed"); }}
      sizes={sizes}
      src={imageUrl(media.url)}
      srcSet={imageSrcSet(media)}
      width={media.width}
    />
  );
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
  const base = `${programLabels[post.programAssociation]} · ${categoryKindLabels[post.categoryKind]}`;
  if (post.categoryKind === "general" || !post.categorySlug) return base;
  const matched = categories.find((category) => (
    category.programAssociation === post.programAssociation &&
    category.kind === post.categoryKind &&
    category.slug === post.categorySlug
  ));
  return matched ? `${base} · ${matched.name}` : base;
}

function postMeta(post: BlogPost, categories: BlogCategory[]) {
  return `${categoryName(post, categories)} · ${formatDate(post.publishedAt)} · ${readingTime(post)} min read`;
}

function parseFilters(): Filters {
  const params = new URLSearchParams(window.location.search);
  const requestedPage = Number.parseInt(params.get("page") ?? "", 10);
  return {
    categorySlug: params.get("category") ?? "",
    categoryKind: (["workshop", "campaign", "general"].includes(params.get("type") ?? "") ? params.get("type") : "") as BlogCategoryKind | "",
    page: Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
    programSlug: params.get("program") ?? "",
    q: params.get("q") ?? "",
    sort: params.get("sort") === "oldest" ? "oldest" : "latest"
  };
}

function filtersToSearch(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.categoryKind) params.set("type", filters.categoryKind);
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
        {post.heroImage?.url ? <StoryImage media={post.heroImage} sizes="(max-width: 760px) 100vw, (max-width: 1080px) 50vw, 33vw" /> : <span>{programLabels[post.programAssociation]}</span>}
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
        {post.heroImage?.url ? <StoryImage eager media={post.heroImage} sizes="(max-width: 1080px) 100vw, 65vw" /> : <span>{programLabels[post.programAssociation]}</span>}
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

function StoriesSkeleton() {
  return (
    <div aria-label="Loading stories" className="stories-grid stories-skeleton-grid" role="status">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="story-skeleton" key={index}>
          <span className="story-skeleton-media" />
          <span /><span /><span />
        </div>
      ))}
    </div>
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
  const [notice, setNotice] = useState("");
  const [retryTick, setRetryTick] = useState(0);

  const isUnfiltered = !filters.q && !filters.categoryKind && !filters.categorySlug && !filters.programSlug && filters.sort === "latest";
  const showFeatured = isUnfiltered && filters.page === 1 && featured;
  const nameOptions = categories.filter((category) => (
    (!filters.programSlug || category.programAssociation === filters.programSlug) &&
    (filters.categoryKind === "workshop" || filters.categoryKind === "campaign") &&
    category.kind === filters.categoryKind
  ));

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
    const retry = () => setRetryTick((current) => current + 1);
    const retryWhenVisible = () => {
      if (document.visibilityState === "visible") retry();
    };
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retryWhenVisible);
    return () => {
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retryWhenVisible);
    };
  }, []);

  useEffect(() => {
    if (!notice && status !== "error") return;
    const timer = window.setTimeout(() => setRetryTick((current) => current + 1), 15_000);
    return () => window.clearTimeout(timer);
  }, [notice, status]);

  useEffect(() => {
    const controller = new AbortController();
    getJson<{ categories: BlogCategory[]; ok: boolean }>("/api/blog-categories", controller.signal)
      .then((result) => {
        setCategories(result.categories);
        if (result.fromCache) setNotice("Showing saved story information while connectivity recovers.");
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [retryTick]);

  useEffect(() => {
    const controller = new AbortController();
    setStatus(posts.length ? "refreshing" : "loading");
    setMessage("");
    setNotice("");

    const load = async () => {
      let lead = featured;
      if (isUnfiltered && !lead) {
        const leadResult = await getJson<BlogListResponse>("/api/blog-posts?featured=true&pageSize=1", controller.signal).catch(() => null);
        lead = leadResult?.posts[0];
        if (!lead) {
          const fallbackResult = await getJson<BlogListResponse>("/api/blog-posts?pageSize=24", controller.signal).catch(() => null);
          lead = fallbackResult?.posts.find((post) => post.heroImage?.url) ?? fallbackResult?.posts[0];
        }
      }

      const params = new URLSearchParams({
        page: String(filters.page),
        pageSize: String(pageSize),
        sort: filters.sort
      });
      if (filters.q) params.set("q", filters.q);
      if (filters.programSlug) params.set("programSlug", filters.programSlug);
      if (filters.categoryKind) params.set("categoryKind", filters.categoryKind);
      if (filters.categorySlug) params.set("categorySlug", filters.categorySlug);
      if (isUnfiltered && lead) params.set("excludeSlug", lead.slug);

      const result = await getJson<BlogListResponse>(`/api/blog-posts?${params}`, controller.signal);
      setFeatured(lead);
      setPosts(result.posts);
      setPagination({ page: result.page, total: result.total, totalPages: result.totalPages });
      setNotice(result.fromCache ? "Showing saved stories while connectivity recovers." : "");
      setStatus("ready");
    };

    load().catch((error) => {
      if (controller.signal.aborted) return;
      setMessage(error instanceof Error ? error.message : "Stories could not be loaded.");
      if (posts.length) {
        setNotice("Stories could not refresh. Showing the last available view while we reconnect.");
        setStatus("ready");
      } else {
        setStatus("error");
      }
    });
    return () => controller.abort();
  }, [filters, retryTick]);

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

  const resultLabel = status === "loading" ? "Loading stories" : status === "refreshing" ? "Updating stories" : `${pagination.total} ${pagination.total === 1 ? "story" : "stories"} found`;

  return (
    <main className="page stories-page">
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
          <label><span>Program</span><select value={filters.programSlug} onChange={(event) => updateFilters({ categorySlug: "", page: 1, programSlug: event.target.value })}><option value="">All programs</option>{(["aarohi", "sakhi", "vidya", "general"] as const).map((program) => <option key={program} value={program}>{programLabels[program]}</option>)}</select></label>
          <label><span>Category</span><select value={filters.categoryKind} onChange={(event) => updateFilters({ categoryKind: event.target.value as Filters["categoryKind"], categorySlug: "", page: 1 })}><option value="">All categories</option>{(["workshop", "campaign", "general"] as const).map((kind) => <option key={kind} value={kind}>{categoryKindLabels[kind]}</option>)}</select></label>
          {filters.categoryKind === "workshop" || filters.categoryKind === "campaign" ? (
            <label><span>Name</span><select value={filters.categorySlug} onChange={(event) => updateFilters({ categorySlug: event.target.value, page: 1 })}><option value="">All names</option>{nameOptions.map((category) => <option key={`${category.programAssociation}-${category.kind}-${category.slug}`} value={category.slug}>{category.name}</option>)}</select></label>
          ) : null}
          <label><span>Sort by</span><select value={filters.sort} onChange={(event) => updateFilters({ page: 1, sort: event.target.value as Filters["sort"] })}><option value="latest">Latest first</option><option value="oldest">Oldest first</option></select></label>
          {(filters.q || filters.categoryKind || filters.categorySlug || filters.programSlug || filters.sort === "oldest") ? <button className="stories-clear" onClick={() => { setSearchText(""); updateFilters({ categoryKind: "", categorySlug: "", page: 1, programSlug: "", q: "", sort: "latest" }); }} type="button">Clear filters</button> : null}
        </form>

        {notice ? <div aria-live="polite" className="stories-connectivity"><span className="stories-loader" />{notice}<button onClick={() => setRetryTick((current) => current + 1)} type="button">Retry now</button></div> : null}
        {status === "loading" ? <StoriesSkeleton /> : null}
        {status === "error" ? <div className="stories-connectivity stories-connectivity-empty"><span className="stories-loader" /><span>Reconnecting to stories. {message}</span><button onClick={() => setRetryTick((current) => current + 1)} type="button">Retry now</button></div> : null}
        {status === "ready" && !posts.length ? <div className="stories-state"><h3>No stories match this view.</h3><p>Try a broader search or clear the current filters.</p><button className="button button-secondary" onClick={() => { setSearchText(""); updateFilters({ categoryKind: "", categorySlug: "", page: 1, programSlug: "", q: "", sort: "latest" }); }} type="button">Show all stories</button></div> : null}
        {(status === "ready" || status === "refreshing") && posts.length ? <div className={`stories-grid${status === "refreshing" ? " is-refreshing" : ""}`}>{posts.map((post) => <StoryCard categories={categories} key={post.id} post={post} />)}</div> : null}

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
  if (block.type === "image") return <figure><StoryImage media={block.media} sizes="(max-width: 760px) 100vw, 900px" />{block.media.caption ? <figcaption>{block.media.caption}</figcaption> : null}</figure>;
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
  const [retryTick, setRetryTick] = useState(0);
  useArticleMeta(post);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    Promise.all([
      getJson<{ ok: boolean; post: BlogPost }>(`/api/blog-posts/${encodeURIComponent(slug)}`, controller.signal),
      getJson<{ categories: BlogCategory[]; ok: boolean }>("/api/blog-categories", controller.signal).catch(() => null)
    ]).then(async ([postResult, categoryResult]) => {
      setPost(postResult.post);
      setCategories(categoryResult?.categories ?? []);
      const paths = [
        postResult.post.categoryKind !== "general" && postResult.post.categorySlug
          ? `/api/blog-posts?programSlug=${postResult.post.programAssociation}&categoryKind=${postResult.post.categoryKind}&categorySlug=${encodeURIComponent(postResult.post.categorySlug)}&excludeSlug=${encodeURIComponent(slug)}&pageSize=3`
          : "",
        `/api/blog-posts?programSlug=${postResult.post.programAssociation}&excludeSlug=${encodeURIComponent(slug)}&pageSize=3`
      ].filter(Boolean);
      const relatedResults = await Promise.all(paths.map((path) => getJson<BlogListResponse>(path, controller.signal).catch(() => null)));
      const unique = new Map<string, BlogPost>();
      relatedResults.forEach((result) => result?.posts.forEach((item) => unique.set(item.slug, item)));
      setRelated(Array.from(unique.values()).slice(0, 3));
      setMessage(postResult.fromCache ? "Showing a saved copy while connectivity recovers." : "");
      setStatus("ready");
    }).catch((error) => {
      if (controller.signal.aborted) return;
      setMessage(error instanceof Error ? error.message : "This story could not be loaded.");
      setStatus(error instanceof HttpError && error.status === 404 ? "not-found" : "error");
    });
    return () => controller.abort();
  }, [retryTick, slug]);

  useEffect(() => {
    const retry = () => setRetryTick((current) => current + 1);
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, []);

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
  if (status === "not-found") return <main className="page"><div className="stories-state story-article-state"><p className="section-label">Story not found</p><h1>This story is not available.</h1><p>{message}</p><a className="button button-primary" href="/stories">Explore stories</a></div></main>;
  if (status === "error" || !post) return <main className="page"><div className="stories-connectivity stories-connectivity-empty story-article-state"><span className="stories-loader" /><span>Reconnecting to this story. {message}</span><button onClick={() => setRetryTick((current) => current + 1)} type="button">Retry now</button></div></main>;

  const cta = programCtas[post.programAssociation];
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(post.title);

  return (
    <main className="page story-article-page">
      <ReadingProgress />
      {message ? <div className="stories-connectivity story-article-notice">{message}</div> : null}
      <article>
        <header className={`story-article-hero${post.heroImage?.url ? "" : " story-article-hero-text"}`}>
          <div className="story-article-heading">
            <a className="story-back-link" href="/stories">← All stories</a>
            <p className="story-meta">{postMeta(post, categories)}</p>
            <h1>{post.title}</h1>
            <p className="story-article-excerpt">{post.excerpt}</p>
            <div className="story-byline"><strong>{post.author || "Floydee Team"}</strong><span>{formatDate(post.publishedAt)}</span><span>{readingTime(post)} min read</span></div>
          </div>
          {post.heroImage?.url ? <figure><StoryImage eager media={post.heroImage} sizes="(max-width: 1080px) 100vw, 50vw" />{post.heroImage.caption ? <figcaption>{post.heroImage.caption}</figcaption> : null}</figure> : <div className="story-article-program">{programLabels[post.programAssociation]}</div>}
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
