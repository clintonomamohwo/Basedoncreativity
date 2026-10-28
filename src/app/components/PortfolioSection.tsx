import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { COLORS, FONTS } from '../../lib/constants';
import { FALLBACK_PROJECTS } from '../../lib/portfolioProjects';
import type { PortfolioProject } from '../../lib/portfolioProjects';

const featuredProjects = FALLBACK_PROJECTS;

function statusLabel(project: PortfolioProject) {
  return project.status === 'Concept'
    ? 'Concept project'
    : project.status === 'In Development'
      ? 'In development'
      : project.status;
}

function ProjectCard({ project, index }: { project: PortfolioProject; index: number }) {
  return (
    <Link
      to={`/work/${encodeURIComponent(project.id)}`}
      aria-label={`View ${project.title} — ${project.classification}, ${statusLabel(project)}`}
      className="group block rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
    >
      <motion.article
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-48px' }}
        transition={{ duration: 0.65, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -5 }}
        className="h-full overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.035)',
          border: '1px solid rgba(255,200,87,0.16)',
          boxShadow: '0 12px 36px rgba(0,0,0,0.2)',
        }}
      >
        <div
          className="relative flex min-h-[220px] items-center justify-center overflow-hidden p-8 md:min-h-[260px]"
          style={{
            background: project.image
              ? 'linear-gradient(135deg, #F6E6B4 0%, #FAF3E0 100%)'
              : 'radial-gradient(ellipse at 70% 25%, rgba(255,200,87,0.18), transparent 55%), linear-gradient(145deg, #222956, #101630)',
          }}
        >
          {project.image ? (
            <img
              src={project.image}
              alt={project.imageAlt || ''}
              className="max-h-[170px] max-w-[75%] object-contain md:max-h-[195px]"
              loading="lazy"
            />
          ) : (
            <div className="max-w-sm text-center">
              <p
                className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.24em]"
                style={{ color: 'rgba(255,200,87,0.7)', fontFamily: FONTS.body }}
              >
                {project.classification} · {statusLabel(project)}
              </p>
              <p
                className="text-2xl font-bold leading-tight md:text-3xl"
                style={{ color: COLORS.cream, fontFamily: FONTS.heading }}
              >
                {project.title}
              </p>
            </div>
          )}
          <span
            className="absolute left-5 top-5 text-xs font-semibold tracking-[0.2em]"
            style={{ color: project.image ? 'rgba(26,31,75,0.6)' : 'rgba(255,200,87,0.62)', fontFamily: FONTS.body }}
            aria-hidden="true"
          >
            {project.index}
          </span>
        </div>

        <div className="flex h-full flex-col p-6 md:p-7">
          <p
            className="mb-3 text-[0.67rem] font-semibold uppercase tracking-[0.17em]"
            style={{ color: COLORS.gold, fontFamily: FONTS.body }}
          >
            {project.category} · {project.year}
          </p>
          <h3
            className="mb-3 text-xl font-bold leading-tight md:text-2xl"
            style={{ color: COLORS.cream, fontFamily: FONTS.heading }}
          >
            {project.title}
          </h3>
          <p
            className="mb-5 text-[0.72rem] font-semibold uppercase tracking-[0.13em]"
            style={{ color: 'rgba(255,200,87,0.68)', fontFamily: FONTS.body }}
          >
            {project.classification} · {statusLabel(project)}
          </p>
          <p
            className="mb-6 flex-1 text-sm leading-relaxed md:text-base"
            style={{ color: 'rgba(250,243,224,0.68)', fontFamily: FONTS.body }}
          >
            {project.summary}
          </p>
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] transition-all group-hover:gap-3"
            style={{ color: COLORS.gold, fontFamily: FONTS.heading }}
          >
            View project detail <ArrowUpRight size={15} aria-hidden="true" />
          </span>
        </div>
      </motion.article>
    </Link>
  );
}

export function PortfolioSection() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-28" style={{ background: '#1A1F4B' }}>
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10 text-center md:mb-14"
        >
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: 'rgba(255,200,87,0.65)', fontFamily: FONTS.body }}
          >
            BOC-owned work and projects
          </p>
          <h2
            className="mb-5 text-3xl font-bold md:text-6xl"
            style={{ color: COLORS.cream, fontFamily: FONTS.heading, letterSpacing: '-0.035em' }}
          >
            Selected <span style={{ color: COLORS.gold }}>Work</span>
          </h2>
          <p
            className="mx-auto max-w-2xl text-base leading-relaxed md:text-lg"
            style={{ color: 'rgba(255,255,255,0.68)', fontFamily: FONTS.body }}
          >
            These examples are BOC-owned. Completed work, concepts, and projects in development are labelled so each stage is clear.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <div className="mt-10 text-center md:mt-14">
          <Link
            to="/work"
            className="inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm font-bold uppercase tracking-[0.08em] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300"
            style={{ color: '#1A1F4B', background: COLORS.gold, fontFamily: FONTS.heading }}
          >
            View all work <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
