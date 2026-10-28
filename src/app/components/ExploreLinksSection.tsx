import { ArrowUpRight, BookOpen, Clapperboard, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { COLORS, FONTS } from '../../lib/constants';
import { handleLinkHover } from '../../lib/prefetch';

const exploreCards = [
  {
    title: 'About',
    path: '/about',
    label: 'OUR POINT OF VIEW',
    description: 'The people, principles, and ideas behind BOC.',
    Icon: Compass,
    accent: '#FFC857',
  },
  {
    title: 'Studio',
    path: '/studio',
    label: 'HOW WE MAKE',
    description: 'A closer look at the craft behind the work.',
    Icon: Clapperboard,
    accent: '#F6E6B4',
  },
  {
    title: 'The Vault',
    path: '/vault',
    label: 'VISUAL EXPERIMENTS',
    description: 'An archive of moving images and creative artifacts.',
    Icon: Sparkles,
    accent: '#FFC857',
  },
  {
    title: 'Library',
    path: '/library',
    label: 'IDEAS IN MANY FORMS',
    description: 'Reflections and creative work across mediums.',
    Icon: BookOpen,
    accent: '#F6E6B4',
  },
];

export function ExploreLinksSection() {
  return (
    <section
      aria-labelledby="explore-links-heading"
      className="relative overflow-hidden px-4 py-16 md:px-8 md:py-20"
      style={{
        background: 'linear-gradient(145deg, #0F1530 0%, #1A1F4B 72%, #202653 100%)',
        borderBottom: '1px solid rgba(255,200,87,0.2)',
      }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-7 flex flex-col gap-3 md:mb-9 md:flex-row md:items-end md:justify-between">
          <div>
            <div
              className="mb-3 flex items-center gap-2"
              style={{
                color: COLORS.gold,
                fontFamily: FONTS.heading,
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.16em',
              }}
            >
              <span aria-hidden="true" style={{ width: 22, height: 1, background: COLORS.gold }} />
              MORE TO DISCOVER
            </div>
            <h2
              id="explore-links-heading"
              style={{
                color: '#FFF6D8',
                fontFamily: FONTS.heading,
                fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                fontWeight: 700,
                lineHeight: 1.25,
              }}
            >
              Explore the BOC world
            </h2>
          </div>
          <p
            className="max-w-md"
            style={{
              color: 'rgba(255,255,255,0.66)',
              fontFamily: FONTS.accent,
              fontSize: '1.12rem',
              fontStyle: 'italic',
              lineHeight: 1.5,
            }}
          >
            Meet the people, practice, and ideas behind every project.
          </p>
        </div>

        <div
          className="explore-card-rail"
          role="group"
          aria-label="Explore About, Studio, The Vault, and Library"
        >
          {exploreCards.map(({ title, path, label, description, Icon, accent }) => (
            <Link
              key={title}
              to={path}
              className="explore-card"
              onMouseEnter={() => handleLinkHover(path)}
              aria-label={`${title}: ${description}`}
              style={{
                minHeight: 208,
                padding: '21px 22px',
                border: '1px solid rgba(255,200,87,0.24)',
                borderRadius: 18,
                background: 'linear-gradient(150deg, rgba(255,255,255,0.075), rgba(255,200,87,0.035))',
                color: '#FFF6D8',
                textDecoration: 'none',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 220ms ease, border-color 220ms ease, background 220ms ease',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <span
                  aria-hidden="true"
                  className="flex h-11 w-11 items-center justify-center rounded-full"
                  style={{
                    color: accent,
                    background: 'rgba(255,200,87,0.1)',
                    border: '1px solid rgba(255,200,87,0.27)',
                  }}
                >
                  <Icon size={19} strokeWidth={1.6} />
                </span>
                <ArrowUpRight size={18} aria-hidden="true" style={{ color: 'rgba(255,200,87,0.76)' }} />
              </div>
              <div>
                <div
                  className="mb-2"
                  style={{
                    color: 'rgba(255,200,87,0.76)',
                    fontFamily: FONTS.heading,
                    fontSize: '0.58rem',
                    fontWeight: 700,
                    letterSpacing: '0.13em',
                  }}
                >
                  {label}
                </div>
                <h3
                  className="mb-2"
                  style={{
                    color: '#FFF6D8',
                    fontFamily: FONTS.heading,
                    fontSize: '1.08rem',
                    fontWeight: 700,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: 'rgba(255,255,255,0.68)',
                    fontFamily: FONTS.body,
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                >
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
