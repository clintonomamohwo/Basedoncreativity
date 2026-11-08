import { useEffect, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowUpRight, BookOpen, CalendarDays, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { SEO } from './SEO';
import {
  fetchPublishedHoloSeoArticles,
  type HoloSeoArticle,
} from '../../lib/holoSeoArticles';
import './InsightsPage.css';

const PREVIEW_MODE = import.meta.env.VITE_HOLO_PREVIEW === 'true';
const SITE_ORIGIN = 'https://www.bochq.com';
const PAGE_CLASS_NAME = PREVIEW_MODE ? 'insights-page insights-page--preview' : 'insights-page';

function useInsightsArticles() {
  const [articles, setArticles] = useState<HoloSeoArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadArticles() {
      try {
        const result = PREVIEW_MODE
          ? (await import('../../lib/holoPreviewArticles')).default
          : await fetchPublishedHoloSeoArticles();
        if (isCurrent) setArticles(result);
      } catch (loadError) {
        console.error('Unable to load Insights articles:', loadError);
        if (isCurrent) setError(true);
      } finally {
        if (isCurrent) setLoading(false);
      }
    }

    void loadArticles();
    return () => {
      isCurrent = false;
    };
  }, []);

  return { articles, loading, error };
}

function PreviewNotice() {
  if (!PREVIEW_MODE) return null;
  return (
    <div className="insights-preview-notice" role="status">
      <span className="insights-preview-notice__marker" aria-hidden="true" />
      <div>
        <strong>Local preview · Unpublished</strong>
        <span>Draft content for review only. Noindex metadata is enabled.</span>
      </div>
    </div>
  );
}

function getSafeLink(href: string): { internalPath?: string; externalHref?: string } | null {
  try {
    const url = new URL(href, SITE_ORIGIN);
    if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) return null;
    if (url.protocol !== 'mailto:' && ['bochq.com', 'www.bochq.com'].includes(url.hostname)) {
      return { internalPath: `${url.pathname}${url.search}${url.hash}` };
    }
    return { externalHref: url.href };
  } catch {
    return null;
  }
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const tokenPattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let tokenIndex = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const key = `${keyPrefix}-${tokenIndex++}`;

    if (match[1]?.startsWith('[')) {
      const label = match[2] ?? '';
      const safeLink = getSafeLink(match[3] ?? '');
      if (safeLink?.internalPath) {
        nodes.push(<Link key={key} to={safeLink.internalPath}>{label}</Link>);
      } else if (safeLink?.externalHref) {
        nodes.push(
          <a key={key} href={safeLink.externalHref} target="_blank" rel="noopener noreferrer">
            {label}
          </a>,
        );
      } else {
        nodes.push(label);
      }
    } else if (match[4]) {
      nodes.push(<strong key={key}>{match[4]}</strong>);
    } else if (match[5]) {
      nodes.push(<em key={key}>{match[5]}</em>);
    } else if (match[6]) {
      nodes.push(<code key={key}>{match[6]}</code>);
    }
    cursor = tokenPattern.lastIndex;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function isMarkdownBlockStart(line: string) {
  return /^(#{1,6})\s+/.test(line) || /^[-*+]\s+/.test(line) || /^\d+\.\s+/.test(line) || /^>\s?/.test(line);
}

function SafeMarkdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      const level = Math.max(2, Math.min(6, heading[1].length - 1));
      const headingContent = renderInlineMarkdown(heading[2], `heading-${index}`);
      const key = `block-${index}`;
      blocks.push(
        level === 2 ? <h2 key={key}>{headingContent}</h2>
          : level === 3 ? <h3 key={key}>{headingContent}</h3>
            : level === 4 ? <h4 key={key}>{headingContent}</h4>
              : <h5 key={key}>{headingContent}</h5>,
      );
      index += 1;
      continue;
    }

    const listMatch = /^([-*+]\s+|\d+\.\s+)/.exec(line);
    if (listMatch) {
      const isOrdered = /^\d/.test(listMatch[1]);
      const items: ReactNode[] = [];
      while (index < lines.length) {
        const itemMatch = /^([-*+]\s+|\d+\.\s+)(.+)$/.exec(lines[index].trim());
        if (!itemMatch || /^\d/.test(itemMatch[1]) !== isOrdered) break;
        items.push(
          <li key={`item-${index}`}>{renderInlineMarkdown(itemMatch[2], `item-${index}`)}</li>,
        );
        index += 1;
      }
      blocks.push(isOrdered
        ? <ol key={`list-${index}`}>{items}</ol>
        : <ul key={`list-${index}`}>{items}</ul>);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quote.push(lines[index].trim().replace(/^>\s?/, ''));
        index += 1;
      }
      blocks.push(
        <blockquote key={`quote-${index}`}>
          {renderInlineMarkdown(quote.join(' '), `quote-${index}`)}
        </blockquote>,
      );
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isMarkdownBlockStart(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(
      <p key={`paragraph-${index}`}>
        {renderInlineMarkdown(paragraph.join(' '), `paragraph-${index}`)}
      </p>,
    );
  }

  return <div className="insights-markdown">{blocks}</div>;
}

function formatPublishedDate(date: string | null) {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }).format(parsed);
}

function ArticleCard({ article, index }: { article: HoloSeoArticle; index: number }) {
  const publishedDate = formatPublishedDate(article.publishedAt);
  return (
    <Link className="insights-card" to={`/insights/${encodeURIComponent(article.slug)}`}>
      <div className="insights-card__topline">
        <span>{String(index + 1).padStart(2, '0')} / INSIGHT</span>
        <ArrowUpRight size={18} aria-hidden="true" />
      </div>
      <h2>{article.title}</h2>
      <p>{article.excerpt}</p>
      <div className="insights-card__bottom">
        <span>{publishedDate ?? (PREVIEW_MODE ? 'Unpublished draft' : 'Read the article')}</span>
        <span className="insights-card__read">Read article <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

export function InsightsPage() {
  const { articles, loading, error } = useInsightsArticles();

  return (
    <div className={PAGE_CLASS_NAME}>
      <SEO
        title={PREVIEW_MODE ? 'Insights Preview | Based on Creativity' : 'Insights | Based on Creativity'}
        description="Practical perspectives on brand identity, websites, creative work, and workflow automation from Based on Creativity."
        path="/insights"
        robots={PREVIEW_MODE ? 'noindex, nofollow' : 'index, follow'}
      />
      <PreviewNotice />
      <header className="insights-hero">
        <div className="insights-hero__inner">
          <div className="insights-eyebrow"><Sparkles size={14} aria-hidden="true" /> THOUGHTS FOR THE WORK AHEAD</div>
          <h1>Ideas for the work <em>ahead.</em></h1>
          <p>Clear, practical perspectives for growing teams shaping their brands, websites, and ways of working.</p>
          <div className="insights-hero__meta"><BookOpen size={16} aria-hidden="true" /> {loading ? 'Gathering articles' : `${articles.length} ${articles.length === 1 ? 'article' : 'articles'}`}</div>
        </div>
      </header>

      <section className="insights-listing" aria-labelledby="insights-list-heading">
        <div className="insights-listing__heading">
          <div>
            <span className="insights-eyebrow">FROM THE STUDIO</span>
            <h2 id="insights-list-heading">Notes on making things matter.</h2>
          </div>
          <p>Useful ideas, considered slowly and shared plainly.</p>
        </div>

        {loading ? (
          <p className="insights-status" role="status">Loading articles…</p>
        ) : error ? (
          <p className="insights-status" role="alert">We couldn’t load Insights right now. Please try again shortly.</p>
        ) : articles.length ? (
          <div className="insights-grid">
            {articles.map((article, index) => <ArticleCard key={article.holoArticleId || article.slug} article={article} index={index} />)}
          </div>
        ) : (
          <p className="insights-status">No published articles yet. Please check back soon.</p>
        )}
      </section>
    </div>
  );
}

export function InsightArticlePage() {
  const { slug } = useParams();
  const { articles, loading, error } = useInsightsArticles();
  const article = articles.find((item) => item.slug === slug);
  const imageUrl = article?.featuredImage?.startsWith('https://') ? article.featuredImage : undefined;
  const publishedDate = article ? formatPublishedDate(article.publishedAt) : null;
  const pageTitle = article?.metaTitle || article?.title || 'Insight | Based on Creativity';
  const pageDescription = article?.metaDescription || article?.excerpt || 'Practical perspectives from Based on Creativity.';

  return (
    <div className={PAGE_CLASS_NAME}>
      <SEO
        title={PREVIEW_MODE ? `${pageTitle} | Preview` : pageTitle}
        description={pageDescription}
        path={`/insights/${slug ?? ''}`}
        type="article"
        image={imageUrl}
        robots={PREVIEW_MODE ? 'noindex, nofollow' : 'index, follow'}
      />
      <PreviewNotice />
      {loading ? (
        <div className="insights-status insights-article-state" role="status">Loading article…</div>
      ) : error ? (
        <div className="insights-status insights-article-state" role="alert">We couldn’t load this article right now. Please try again shortly.</div>
      ) : !article ? (
        <div className="insights-status insights-article-state">
          <h1>Article not found</h1>
          <p>This article may have moved or is not currently published.</p>
          <Link to="/insights" className="insights-back-link"><ArrowLeft size={16} aria-hidden="true" /> Back to Insights</Link>
        </div>
      ) : (
        <article className="insights-article">
          <div className="insights-article__intro">
            <Link to="/insights" className="insights-back-link"><ArrowLeft size={16} aria-hidden="true" /> All insights</Link>
            <div className="insights-eyebrow">BASED ON CREATIVITY · INSIGHTS</div>
            <h1>{article.title}</h1>
            <p className="insights-article__excerpt">{article.excerpt}</p>
            {publishedDate && (
              <p className="insights-article__date"><CalendarDays size={15} aria-hidden="true" /> Published {publishedDate}</p>
            )}
          </div>
          {imageUrl && <img className="insights-article__image" src={imageUrl} alt={`Featured image for ${article.title}`} />}
          <SafeMarkdown content={article.contentMarkdown} />
          <aside className="insights-article__closing">
            <span className="insights-eyebrow">HAVE A PROJECT IN MIND?</span>
            <p>Explore the ways we can help make your next idea real.</p>
            <Link to="/contact" className="insights-contact-link">Start a conversation <ArrowUpRight size={16} aria-hidden="true" /></Link>
          </aside>
        </article>
      )}
    </div>
  );
}
