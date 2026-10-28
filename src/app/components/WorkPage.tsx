import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { fetchPortfolioProjects } from '../../lib/sanityContent';
import {
  FALLBACK_PROJECTS,
  mapSanityProject,
  type PortfolioProject,
  type ProjectStatus,
} from '../../lib/portfolioProjects';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SEO } from './SEO';
import { COLORS, FONTS, GRAIN_SVG_PATTERN } from '../../lib/constants';
import { retryWithBackoff } from '../../lib/retry';

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  const isComplete = status === 'Completed';
  const isConcept = status === 'Concept';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        background: isComplete || isConcept ? 'rgba(255,200,87,0.15)' : 'rgba(255,255,255,0.07)',
        border: isComplete || isConcept ? '1px solid rgba(255,200,87,0.4)' : '1px solid rgba(255,255,255,0.15)',
        fontFamily: FONTS.body,
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isComplete || isConcept ? COLORS.gold : 'rgba(250,243,224,0.72)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isComplete || isConcept ? COLORS.gold : 'rgba(250,243,224,0.6)' }}
      />
      {status}
    </span>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, delay }: { project: PortfolioProject; delay: number }) {
  return (
    <Link
      to={`/work/${encodeURIComponent(project.id)}`}
      aria-label={`View project: ${project.title}`}
      className="block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
    >
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,200,87,0.12)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,200,87,0.05)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,200,87,0.45)';
        el.style.boxShadow = '0 0 64px rgba(255,200,87,0.15), 0 32px 72px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,200,87,0.3)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(255,200,87,0.12)';
        el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,200,87,0.05)';
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9', background: 'radial-gradient(ellipse at 72% 30%, rgba(255,200,87,0.16), transparent 52%), linear-gradient(145deg, #222956, #101630)' }}>
        {project.image ? (
          <ImageWithFallback
            src={project.image}
            alt={project.imageAlt || ''}
            className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${project.category === 'Branding' ? 'object-contain p-10' : 'object-cover'}`}
            style={{ transform: 'scale(1.02)' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
            <div>
              <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,200,87,0.7)', fontFamily: FONTS.body }}>
                {project.classification} · {project.status}
              </p>
              <p className="text-2xl font-bold leading-tight" style={{ color: '#FAF3E0', fontFamily: FONTS.heading }}>
                {project.title}
              </p>
            </div>
          </div>
        )}
        {/* Dark overlay - lightens slightly on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: 'linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.65) 100%)' }}
        />
        {/* Index number top-left */}
        <div className="absolute top-4 left-5">
          <span
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(255,200,87,0.7)',
            }}
          >
            {project.index}
          </span>
        </div>
        {/* Status badge top-right */}
        <div className="absolute top-4 right-4">
          <StatusBadge status={project.status} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 md:p-7">
        {/* Category row */}
        <p
          className="mb-3"
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: COLORS.gold,
          }}
        >
          {project.category} · {project.year} · {project.classification}
        </p>

        {/* Title */}
        <div className="mb-3 relative">
          <h3
            className="leading-tight"
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
              letterSpacing: '-0.01em',
              color: COLORS.gold,
            }}
          >
            {project.title}
          </h3>
          <div
            className="transition-all duration-500 ease-out group-hover:w-full"
            style={{
              height: '2px',
              width: '0',
              background: `linear-gradient(90deg, ${COLORS.gold}, transparent)`,
              marginTop: '6px',
            }}
          />
        </div>

        {/* Discipline line */}
        <p
          className="mb-4"
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.75rem',
            color: 'rgba(250,243,224,0.35)',
            letterSpacing: '0.05em',
          }}
        >
          {project.discipline}
        </p>

        {/* Gold rule */}
        <div
          className="mb-4"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, rgba(255,200,87,0.3), transparent)',
          }}
        />

        {/* Summary */}
        <p
          className="flex-1 leading-relaxed mb-6"
          style={{
            fontFamily: FONTS.body,
            fontSize: '0.9375rem',
            lineHeight: 1.65,
            color: 'rgba(250,243,224,0.68)',
          }}
        >
          {project.summary}
        </p>

        {/* Footer action */}
        <div className="flex items-center justify-between mt-auto">
          <span
            className="flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: COLORS.gold,
            }}
          >
            View Details
            <ArrowUpRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </div>
    </motion.article>
    </Link>
  );
}

// ─── Metadata Strip ───────────────────────────────────────────────────────────

const META_ITEMS = ['Identity', 'Web', 'Animation', 'Publishing'];

function MetaStrip() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="flex items-center gap-0 mt-10"
    >
      {META_ITEMS.map((item, i) => (
        <div key={item} className="flex items-center">
          <span
            style={{
              fontFamily: FONTS.body,
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,200,87,0.5)',
            }}
          >
            {item}
          </span>
          {i < META_ITEMS.length - 1 && (
            <span
              className="mx-4"
              style={{ color: 'rgba(255,200,87,0.2)', fontSize: '0.75rem' }}
            >
              /
            </span>
          )}
        </div>
      ))}
    </motion.div>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────────────────

function CTASection() {
  const navigate = useNavigate();
  return (
    <section className="px-4 md:px-12 lg:px-20 pb-28 md:pb-36 pt-4">
      <div className="max-w-5xl mx-auto">
        {/* Divider */}
        <div
          className="mb-16"
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,200,87,0.5) 40%, rgba(255,200,87,0.5) 60%, transparent)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-end"
        >
          {/* Left copy */}
          <div>
            <p
              className="mb-5"
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(255,200,87,0.55)',
              }}
            >
              Commissions &amp; Collaborations
            </p>
            <h2
              className="mb-5 leading-tight"
              style={{
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                letterSpacing: '-0.01em',
                color: COLORS.gold,
              }}
            >
              BOC is available for<br />
              <span style={{ color: COLORS.gold }}>selective work.</span>
            </h2>
            <p
              className="max-w-xl leading-relaxed"
              style={{
                fontFamily: FONTS.body,
                fontSize: '1.0625rem',
                lineHeight: 1.65,
                color: 'rgba(250,243,224,0.65)',
              }}
            >
              We take on a small number of commissions and collaborative projects each year - brand identity, web, animation, editorial, and platform work. If your project aligns with the way we approach creativity, we want to hear from you.
            </p>
            <p
              className="mt-4 italic"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.125rem',
                color: 'rgba(255,200,87,0.7)',
              }}
            >
              We are selective. That is intentional.
            </p>
          </div>

          {/* Right buttons */}
          <div className="flex flex-col gap-4 min-w-[200px]">
            <button
              onClick={() => navigate('/services')}
              className="flex items-center justify-center gap-3 rounded-lg px-7 py-4 w-full transition-colors duration-200"
              style={{
                background: COLORS.gold,
                color: '#0A1628',
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = COLORS.goldDark; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = COLORS.gold; }}
            >
              View Services
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="flex items-center justify-center gap-3 rounded-lg px-7 py-4 w-full transition-all duration-200"
              style={{
                background: 'transparent',
                color: COLORS.gold,
                fontFamily: FONTS.heading,
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: `1.5px solid ${COLORS.gold}73`,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = `${COLORS.gold}14`;
                btn.style.borderColor = `${COLORS.gold}b3`;
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'transparent';
                btn.style.borderColor = `${COLORS.gold}73`;
              }}
            >
              Start a Conversation
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────

export function WorkPage() {
  const [cmsProjects, setCmsProjects] = useState<PortfolioProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    retryWithBackoff(() => fetchPortfolioProjects(), {
      maxRetries: 3,
      initialDelay: 1000,
    })
      .then((projects) => {
        if (cancelled || !projects?.length) {
          return;
        }
        const published = projects
          .filter((project) => project.title?.trim() && project.description?.trim())
          .map(mapSanityProject);
        const publishedRoutes = new Set(
          published.flatMap((project) => [project.id, ...(project.aliases || [])]),
        );
        const localExamples = FALLBACK_PROJECTS.filter(
          (project) =>
            !publishedRoutes.has(project.id) &&
            !(project.aliases || []).some((alias) => publishedRoutes.has(alias)),
        );
        setCmsProjects([...published, ...localExamples]);
      })
      .catch((error) => {
        if (import.meta.env.DEV) {
          console.error('Error fetching portfolio projects after retries:', error);
        }
        if (!cancelled) {
          setCmsProjects([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayProjects = useMemo(
    () => {
      const projects = cmsProjects.length ? cmsProjects : FALLBACK_PROJECTS;
      if (import.meta.env.DEV) {
        console.log('Using data source:', cmsProjects.length ? 'Sanity CMS' : 'Fallback', '- Projects:', projects.length);
      }
      return projects;
    },
    [cmsProjects],
  );

  return (
    <>
      <SEO title="Work | Based on Creativity" description="Explore selected work from Based on Creativity, including brand identity systems, digital experiences, editorial design, and visual storytelling." path="/work" />
    <div
      className="relative"
      style={{ background: '#1A1F4B' }}
    >
      {/* Ambient background layers */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0.07, 0.12, 0.07],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,200,87,0.07), transparent)' }}
        />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 60% 40% at 80% 90%, rgba(255,200,87,0.04), transparent), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 24 24' fill='none' stroke='rgba(255,200,87,0.025)' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='7' height='7'/%3E%3Crect x='14' y='3' width='7' height='7'/%3E%3Crect x='14' y='14' width='7' height='7'/%3E%3Crect x='3' y='14' width='7' height='7'/%3E%3C/svg%3E\")",
          backgroundPosition: 'center, 15% 40%',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundSize: 'auto, 320px',
        }} />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: GRAIN_SVG_PATTERN,
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="px-4 md:px-12 lg:px-20 pt-32 pb-14 md:pt-36 md:pb-16 max-w-5xl mx-auto relative">
          {/* Decorative icon */}
          <motion.div
            animate={{
              y: [-10, 10, -10],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: '50%',
              right: '5%',
              transform: 'translateY(-50%)',
              width: '200px',
              height: '200px',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgba(255,200,87,0.04)' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='2' y='7' width='20' height='14' rx='2' ry='2'/%3E%3Cpath d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'/%3E%3C/svg%3E")`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              pointerEvents: 'none',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="mb-4"
              style={{
                fontFamily: FONTS.body,
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(255,200,87,0.6)',
              }}
            >
              Based on Creativity
            </p>
            <div className="h-px w-10 mb-10" style={{ background: COLORS.gold }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="mb-7 leading-none"
            style={{
              fontFamily: FONTS.heading,
              fontWeight: 700,
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            Selected
            <br />
            <span style={{ color: COLORS.gold }}>Work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="max-w-xl leading-relaxed"
            style={{
              fontFamily: FONTS.body,
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              lineHeight: 1.65,
              color: 'rgba(250,243,224,0.65)',
            }}
          >
            BOC develops brand worlds, digital experiences, animation, and publishing projects. Each one built from a single standard: that the work should outlast the moment it was made for.
          </motion.p>

          <MetaStrip />
        </section>

        {/* ── Horizontal rule ───────────────────────────────────────────── */}
        <div className="px-4 md:px-12 lg:px-20 max-w-5xl mx-auto mb-14">
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, rgba(255,200,87,0.4), rgba(255,200,87,0.1) 70%, transparent)',
            }}
          />
        </div>

        {/* ── Project Grid ─────────────────────────────────────────────── */}
        <section className="px-4 md:px-12 lg:px-20 pb-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,200,87,0.12)',
                      aspectRatio: '16/10',
                    }}
                  >
                    <div
                      className="w-full h-40 animate-pulse"
                      style={{ background: 'rgba(255,200,87,0.05)' }}
                    />
                    <div className="p-6">
                      <div
                        className="h-4 w-24 mb-3 rounded animate-pulse"
                        style={{ background: 'rgba(255,200,87,0.1)' }}
                      />
                      <div
                        className="h-6 w-3/4 mb-3 rounded animate-pulse"
                        style={{ background: 'rgba(255,200,87,0.15)' }}
                      />
                      <div
                        className="h-4 w-full mb-2 rounded animate-pulse"
                        style={{ background: 'rgba(255,200,87,0.08)' }}
                      />
                      <div
                        className="h-4 w-5/6 rounded animate-pulse"
                        style={{ background: 'rgba(255,200,87,0.08)' }}
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              displayProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  delay={i * 0.08}
                />
              ))
            )}
          </div>

          {/* Italicised note beneath grid */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mt-12 italic"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.125rem',
              color: 'rgba(255,200,87,0.45)',
            }}
          >
            More work is in motion - not everything announced yet.
          </motion.p>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <CTASection />
      </div>
    </div>
    </>
  );
}
