import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Link, useParams } from 'react-router';
import {
  fetchPortfolioProjects,
  resolveMediaAlt,
  resolveMediaUrl,
  type SanityPortfolioProject,
} from '../../lib/sanityContent';
import { FALLBACK_PROJECTS, mapSanityProject, type PortfolioProject } from '../../lib/portfolioProjects';
import { COLORS, FONTS, GRAIN_SVG_PATTERN } from '../../lib/constants';
import { retryWithBackoff } from '../../lib/retry';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NotFoundPage } from './NotFoundPage';
import { SEO } from './SEO';

interface DetailImage {
  src: string;
  alt: string;
}

interface WorkDetail {
  id: string;
  title: string;
  client?: string;
  classification: PortfolioProject['classification'];
  status: PortfolioProject['status'];
  category?: string;
  date?: string;
  description?: string;
  tags: string[];
  heroImage?: string;
  heroImageAlt: string;
  gallery: DetailImage[];
}

function detailFromSanity(project: SanityPortfolioProject): WorkDetail {
  const displayProject = mapSanityProject(project, 0);
  const heroImage = resolveMediaUrl(project.thumbnail, 2200);
  const gallery = (project.images || [])
    .map((image, index) => ({
      src: resolveMediaUrl(image, 1800),
      alt: resolveMediaAlt(image, `${project.title} project image ${index + 1}`),
    }))
    .filter((image) => Boolean(image.src));

  return {
    id: project.slug || project._id,
    title: project.title,
    client: project.client,
    classification: displayProject.classification,
    status: displayProject.status,
    category: project.category,
    date: project.date,
    description: project.description,
    tags: project.tags || [],
    heroImage: heroImage || gallery[0]?.src,
    heroImageAlt:
      resolveMediaAlt(project.thumbnail, `${project.title} project artwork`) ||
      gallery[0]?.alt ||
      `${project.title} project artwork`,
    gallery,
  };
}

function detailFromFallback(project: PortfolioProject): WorkDetail {
  return {
    id: project.id,
    title: project.title,
    classification: project.classification,
    status: project.status,
    category: project.category,
    date: project.year === 'TBA' ? undefined : project.year,
    description: project.summary,
    tags: project.discipline.split(' · '),
    heroImage: project.image,
    heroImageAlt: project.imageAlt || project.title,
    gallery: [],
  };
}

function formatCategory(category: string) {
  return category
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatYear(date?: string) {
  if (!date) return undefined;
  if (/^\d{4}-\d{4}$/.test(date)) return date;
  const year = date.match(/^\d{4}/)?.[0];
  return year || date;
}

function ProjectHero({ project }: { project: WorkDetail }) {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pt-28 md:px-10 md:pt-36">
      <Link
        to="/work"
        className="mb-8 inline-flex items-center gap-2 text-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
        style={{ color: 'rgba(250,243,224,0.72)', fontFamily: FONTS.body }}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        All work
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75 }}
        className="relative overflow-hidden rounded-2xl md:rounded-3xl"
        style={{
          minHeight: 'clamp(360px, 54vw, 650px)',
          background: 'linear-gradient(135deg, #222956 0%, #0F1530 100%)',
          border: '1px solid rgba(255,200,87,0.18)',
        }}
      >
        {project.heroImage && (
          <ImageWithFallback
            src={project.heroImage}
            alt={project.heroImageAlt}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ minHeight: 'inherit' }}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(9,14,37,0.91) 0%, rgba(9,14,37,0.58) 55%, rgba(9,14,37,0.15) 100%), linear-gradient(0deg, rgba(9,14,37,0.68), transparent 68%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{ backgroundImage: GRAIN_SVG_PATTERN }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex min-h-[360px] flex-col justify-end p-6 sm:p-10 md:min-h-[54vw] md:p-16 lg:min-h-[650px]">
          <p
            className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.28em]"
            style={{ color: COLORS.gold, fontFamily: FONTS.body }}
          >
            {project.classification} · {project.status}
          </p>
          <h1
            className="max-w-4xl break-words leading-[1.08]"
            style={{
              color: '#fff',
              fontFamily: FONTS.heading,
              fontSize: 'clamp(2.25rem, 8vw, 6.25rem)',
              fontWeight: 700,
              letterSpacing: '-0.045em',
            }}
          >
            {project.title}
          </h1>
        </div>
      </motion.div>
    </section>
  );
}

function ProjectMetadata({ project }: { project: WorkDetail }) {
  const year = formatYear(project.date);
  const items = [
    project.client ? { label: 'Client', value: project.client } : null,
    { label: 'Project status', value: project.status },
    project.category ? { label: 'Category', value: formatCategory(project.category) } : null,
    year ? { label: 'Year', value: year } : null,
  ].filter((item): item is { label: string; value: string } => Boolean(item));

  if (!items.length) return null;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-y py-6 sm:grid-cols-3 md:gap-10 md:py-8" style={{ borderColor: 'rgba(255,200,87,0.18)' }}>
      {items.map(({ label, value }) => (
        <div key={label} className="min-w-0">
          <dt className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,200,87,0.65)', fontFamily: FONTS.body }}>
            {label}
          </dt>
          <dd className="break-words text-base md:text-lg" style={{ color: 'rgba(250,243,224,0.9)', fontFamily: FONTS.body }}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProjectGallery({ project }: { project: WorkDetail }) {
  if (!project.gallery.length) return null;

  return (
    <section className="mt-16 md:mt-24" aria-labelledby="project-gallery-title">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-[0.625rem] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,200,87,0.65)', fontFamily: FONTS.body }}>
            Project imagery
          </p>
          <h2 id="project-gallery-title" className="text-2xl md:text-3xl" style={{ color: '#fff', fontFamily: FONTS.heading, fontWeight: 700 }}>
            In detail
          </h2>
        </div>
        <span className="text-xs" style={{ color: 'rgba(250,243,224,0.42)', fontFamily: FONTS.body }}>
          {project.gallery.length} {project.gallery.length === 1 ? 'image' : 'images'}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
        {project.gallery.map((image, index) => (
          <figure
            key={`${image.src}-${index}`}
            className="overflow-hidden rounded-xl"
            style={{ border: '1px solid rgba(255,200,87,0.14)', background: 'rgba(255,255,255,0.025)' }}
          >
            <ImageWithFallback
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}

function ProjectDetail({ project }: { project: WorkDetail }) {
  const description = project.description?.trim();
  const seoDescription = description || `Explore ${project.title}, selected work from Based on Creativity.`;

  return (
    <>
      <SEO
        title={`${project.title} | Work | Based on Creativity`}
        description={seoDescription.slice(0, 300)}
        path={`/work/${encodeURIComponent(project.id)}`}
        image={project.heroImage}
      />
      <div className="relative overflow-hidden" style={{ background: '#1A1F4B' }}>
        <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: 'radial-gradient(ellipse 70% 38% at 50% 0%, rgba(255,200,87,0.08), transparent)' }} />
        <ProjectHero project={project} />

        <div className="relative mx-auto max-w-5xl px-4 pb-24 pt-12 md:px-10 md:pb-32 md:pt-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.62fr)] md:gap-16">
            <section aria-labelledby="project-overview-title">
              <p className="mb-3 text-[0.625rem] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,200,87,0.65)', fontFamily: FONTS.body }}>
                Overview
              </p>
              <h2 id="project-overview-title" className="mb-5 text-2xl md:text-3xl" style={{ color: '#fff', fontFamily: FONTS.heading, fontWeight: 700 }}>
                The project
              </h2>
              {description ? (
                <p className="max-w-2xl whitespace-pre-line text-base leading-8 md:text-lg" style={{ color: 'rgba(250,243,224,0.72)', fontFamily: FONTS.body }}>
                  {description}
                </p>
              ) : (
                <p className="max-w-2xl text-base leading-8 md:text-lg" style={{ color: 'rgba(250,243,224,0.58)', fontFamily: FONTS.body }}>
                  Project details will be shared here when they are available.
                </p>
              )}
            </section>

            {project.tags.length > 0 && (
              <aside aria-label="Project disciplines">
                <p className="mb-4 text-[0.625rem] font-semibold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,200,87,0.65)', fontFamily: FONTS.body }}>
                  Disciplines
                </p>
                <ul className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li key={tag} className="rounded-full px-3 py-2 text-xs" style={{ color: 'rgba(250,243,224,0.78)', background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,200,87,0.18)', fontFamily: FONTS.body }}>
                      {tag}
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </div>

          <div className="mt-12 md:mt-16">
            <ProjectMetadata project={project} />
          </div>

          <ProjectGallery project={project} />

          <div className="mt-16 flex flex-col items-start justify-between gap-5 border-t pt-8 sm:flex-row sm:items-center" style={{ borderColor: 'rgba(255,200,87,0.18)' }}>
            <Link
              to="/work"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              style={{ color: COLORS.gold, fontFamily: FONTS.body }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to all work
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg px-6 py-3 text-xs font-bold uppercase tracking-[0.08em] transition-colors hover:bg-amber-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
              style={{ color: '#0A1628', background: COLORS.gold, fontFamily: FONTS.heading }}
            >
              Start a conversation
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function WorkDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<WorkDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fallback = projectId
      ? FALLBACK_PROJECTS.find((item) => item.id === projectId || item.aliases?.includes(projectId))
      : undefined;

    setProject(fallback ? detailFromFallback(fallback) : null);
    setIsLoading(true);

    if (!projectId) {
      setIsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    retryWithBackoff(() => fetchPortfolioProjects(), {
      maxRetries: 2,
      initialDelay: 700,
    })
      .then((projects) => {
        if (cancelled) return;
        const match = projects?.find(
          (item) => item.slug === projectId || item._id === projectId,
        );
        if (match) {
          setProject(detailFromSanity(match));
        } else if (!fallback) {
          setProject(null);
        }
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error('Error fetching portfolio project:', projectId, error);
        }
        if (!cancelled && !fallback) setProject(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (project) return <ProjectDetail project={project} />;
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4" style={{ background: '#1A1F4B' }} aria-live="polite" aria-busy="true">
        <p style={{ color: 'rgba(250,243,224,0.68)', fontFamily: FONTS.body }}>Loading project…</p>
      </div>
    );
  }
  return <NotFoundPage />;
}
