import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { fetchPortfolioProjects, resolveMediaAlt, resolveMediaUrl, type SanityPortfolioProject } from '@/lib/sanityContent';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SEO } from './SEO';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'Completed' | 'In Development';

interface Project {
  id: string;
  index: string;
  title: string;
  category: string;
  discipline: string;
  status: Status;
  year: string;
  summary: string;
  image: string;
  imageAlt: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'boc-brand-identity',
    index: '01',
    title: 'BOC Brand Identity',
    category: 'Identity',
    discipline: 'Brand Design · Visual System · Typography',
    status: 'Completed',
    year: '2024',
    summary:
      'A full brand identity system for Based on Creativity — logo suite, colour philosophy, type system, motion principles, and the complete design language that underpins everything the company produces.',
    image:
      'https://images.unsplash.com/photo-1732096260253-f2030340e1ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFuZCUyMGlkZW50aXR5JTIwZGVzaWduJTIwbHV4dXJ5JTIwZ29sZCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NjIzMTQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'BOC Brand Identity — gold luxury design system',
  },
  {
    id: 'bochq-website',
    index: '02',
    title: 'bochq.com',
    category: 'Web',
    discipline: 'Web Design · React · Editorial UI',
    status: 'Completed',
    year: '2024–2025',
    summary:
      'The official company website for Based on Creativity — a luxury editorial platform built in React with cinematic transitions, a custom design system, and an architecture that supports all BOC subsidiaries.',
    image:
      'https://images.unsplash.com/photo-1740721455292-e5cd29544381?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwbWluaW1hbCUyMHdlYnNpdGUlMjBkZXNpZ24lMjBsYXB0b3AlMjBzY3JlZW58ZW58MXx8fHwxNzc0NjIzMTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'bochq.com — dark editorial web platform on screen',
  },
  {
    id: 'first-animated-series',
    index: '03',
    title: 'First Animated Series',
    category: 'Animation',
    discipline: 'Animation · Character Design · Narrative',
    status: 'In Development',
    year: 'TBA',
    summary:
      'The debut animated series from Creativity Base Studios — an original world built from the ground up with original characters, cultural depth, and a visual language designed to travel across borders.',
    image:
      'https://images.unsplash.com/photo-1558982423-f8e8a5c75426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltYXRlZCUyMGZpbG0lMjBwcm9kdWN0aW9uJTIwY2luZW1hdGljJTIwZGFya3xlbnwxfHx8fDE3NzQ2MjMxNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'Animated series — cinematic dark film production',
  },
  {
    id: 'first-publication',
    index: '04',
    title: 'First Publication',
    category: 'Publishing',
    discipline: 'Editorial · Publishing · Illustration',
    status: 'In Development',
    year: 'TBA',
    summary:
      'The inaugural title from Creativity Base Press — a written and illustrated work that extends BOC\'s storytelling beyond the screen and into the hands of readers.',
    image:
      'https://images.unsplash.com/photo-1765922931332-224f9101941c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZGl0b3JpYWwlMjBib29rJTIwcHVibGlzaGluZyUyMGNyZWF0aXZlJTIwZGFyayUyMG1vb2R5fGVufDF8fHx8MTc3NDYyMzE0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    imageAlt: 'First Publication — editorial book dark moody',
  },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Status }) {
  const isComplete = status === 'Completed';
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{
        background: isComplete ? 'rgba(212,168,83,0.15)' : 'rgba(255,255,255,0.07)',
        border: isComplete ? '1px solid rgba(212,168,83,0.4)' : '1px solid rgba(255,255,255,0.15)',
        fontFamily: "'Source Sans 3', sans-serif",
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: isComplete ? '#D4A853' : 'rgba(250,243,224,0.55)',
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isComplete ? '#D4A853' : 'rgba(250,243,224,0.4)' }}
      />
      {status}
    </span>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(212,168,83,0.12)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(212,168,83,0.35)';
        el.style.boxShadow = '0 0 48px rgba(212,168,83,0.08), 0 24px 64px rgba(0,0,0,0.4)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = 'rgba(212,168,83,0.12)';
        el.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/9' }}>
        <ImageWithFallback
          src={project.image}
          alt={project.imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 ease-out"
          style={{ transform: 'scale(1.02)' }}
        />
        {/* Dark overlay — lightens slightly on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: 'linear-gradient(180deg, rgba(10,22,40,0.25) 0%, rgba(10,22,40,0.65) 100%)' }}
        />
        {/* Index number top-left */}
        <div className="absolute top-4 left-5">
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              color: 'rgba(212,168,83,0.7)',
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
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#D4A853',
          }}
        >
          {project.category} · {project.year}
        </p>

        {/* Title */}
        <h3
          className="mb-3 leading-tight"
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)',
            letterSpacing: '-0.01em',
            color: '#FAF3E0',
          }}
        >
          {project.title}
        </h3>

        {/* Discipline line */}
        <p
          className="mb-4"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
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
            background: 'linear-gradient(90deg, rgba(212,168,83,0.3), transparent)',
          }}
        />

        {/* Summary */}
        <p
          className="flex-1 leading-relaxed mb-6"
          style={{
            fontFamily: "'Source Sans 3', sans-serif",
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
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#D4A853',
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
  );
}

// ─── Metadata Strip ───────────────────────────────────────────────────────────

function formatProjectYear(date?: string) {
  if (!date) return 'TBA';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? 'TBA' : String(parsed.getFullYear());
}

function getProjectStatus(project: SanityPortfolioProject): Status {
  if (!project.date) return 'In Development';
  const parsed = new Date(project.date);
  if (Number.isNaN(parsed.getTime())) return 'In Development';
  return parsed <= new Date() ? 'Completed' : 'In Development';
}

function mapSanityProject(project: SanityPortfolioProject, index: number): Project {
  const fallback = FALLBACK_PROJECTS[index % FALLBACK_PROJECTS.length];
  const discipline = project.tags?.length
    ? project.tags.join(' · ')
    : project.client
      ? `${project.client} · ${project.category || 'Creative Direction'}`
      : `${project.category || 'Creative Work'} · Based on Creativity`;
  const image = resolveMediaUrl(project.thumbnail, 1600) || fallback.image;

  return {
    id: project.slug || project._id,
    index: String(index + 1).padStart(2, '0'),
    title: project.title,
    category: project.category || fallback.category,
    discipline,
    status: getProjectStatus(project),
    year: formatProjectYear(project.date),
    summary: project.description || fallback.summary,
    image,
    imageAlt: resolveMediaAlt(project.thumbnail, `${project.title} project artwork`) || fallback.imageAlt,
  };
}

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
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(212,168,83,0.5)',
            }}
          >
            {item}
          </span>
          {i < META_ITEMS.length - 1 && (
            <span
              className="mx-4"
              style={{ color: 'rgba(212,168,83,0.2)', fontSize: '0.75rem' }}
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
            background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.5) 40%, rgba(212,168,83,0.5) 60%, transparent)',
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
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'rgba(212,168,83,0.55)',
              }}
            >
              Commissions &amp; Collaborations
            </p>
            <h2
              className="mb-5 leading-tight"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 'clamp(1.75rem, 5vw, 2.75rem)',
                letterSpacing: '-0.01em',
                color: '#FAF3E0',
              }}
            >
              BOC is available for<br />
              <span style={{ color: '#D4A853' }}>selective work.</span>
            </h2>
            <p
              className="max-w-xl leading-relaxed"
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '1.0625rem',
                lineHeight: 1.65,
                color: 'rgba(250,243,224,0.65)',
              }}
            >
              We take on a small number of commissions and collaborative projects each year — brand identity, web, animation, editorial, and platform work. If your project aligns with the way we approach creativity, we want to hear from you.
            </p>
            <p
              className="mt-4 italic"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.125rem',
                color: 'rgba(212,168,83,0.7)',
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
                background: '#D4A853',
                color: '#0A1628',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#C9972E'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#D4A853'; }}
            >
              View Services
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => navigate('/contact')}
              className="flex items-center justify-center gap-3 rounded-lg px-7 py-4 w-full transition-all duration-200"
              style={{
                background: 'transparent',
                color: '#D4A853',
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: '0.8125rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1.5px solid rgba(212,168,83,0.45)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'rgba(212,168,83,0.08)';
                btn.style.borderColor = 'rgba(212,168,83,0.7)';
              }}
              onMouseLeave={(e) => {
                const btn = e.currentTarget as HTMLButtonElement;
                btn.style.background = 'transparent';
                btn.style.borderColor = 'rgba(212,168,83,0.45)';
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
  const [cmsProjects, setCmsProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;

    fetchPortfolioProjects()
      .then((projects) => {
        if (cancelled || !projects?.length) return;
        setCmsProjects(projects.map(mapSanityProject));
      })
      .catch(() => {
        if (!cancelled) {
          setCmsProjects([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const displayProjects = useMemo(
    () => (cmsProjects.length ? cmsProjects : FALLBACK_PROJECTS),
    [cmsProjects],
  );

  return (
    <>
      <SEO title="Work | Based on Creativity" description="Explore selected work from Based on Creativity, including brand identity systems, digital experiences, editorial design, and visual storytelling." path="/work" />
    <div
      className="relative"
      style={{ background: '#0A1628' }}
    >
      {/* Ambient background layers */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(212,168,83,0.07), transparent)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 80% 90%, rgba(212,168,83,0.04), transparent)' }} />
        {/* Grain */}
        <div
          className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="px-4 md:px-12 lg:px-20 pt-32 pb-14 md:pt-36 md:pb-16 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p
              className="mb-4"
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'rgba(212,168,83,0.6)',
              }}
            >
              Based on Creativity
            </p>
            <div className="h-px w-10 mb-10" style={{ background: '#D4A853' }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.1 }}
            className="mb-7 leading-none"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 'clamp(3.5rem, 12vw, 8rem)',
              letterSpacing: '-0.03em',
              color: '#FAF3E0',
            }}
          >
            Selected
            <br />
            <span style={{ color: '#D4A853' }}>Work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="max-w-xl leading-relaxed"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
              lineHeight: 1.65,
              color: 'rgba(250,243,224,0.65)',
            }}
          >
            BOC develops brand worlds, digital experiences, animation, and publishing projects — each one built from a single standard: that the work should outlast the moment it was made for.
          </motion.p>

          <MetaStrip />
        </section>

        {/* ── Horizontal rule ───────────────────────────────────────────── */}
        <div className="px-4 md:px-12 lg:px-20 max-w-5xl mx-auto mb-14">
          <div
            style={{
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212,168,83,0.4), rgba(212,168,83,0.1) 70%, transparent)',
            }}
          />
        </div>

        {/* ── Project Grid ─────────────────────────────────────────────── */}
        <section className="px-4 md:px-12 lg:px-20 pb-20 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                delay={i * 0.08}
              />
            ))}
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
              color: 'rgba(212,168,83,0.45)',
            }}
          >
            More work is in motion — not everything announced yet.
          </motion.p>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────── */}
        <CTASection />
      </div>
    </div>
    </>
  );
}
