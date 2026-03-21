import { motion } from 'motion/react';
import { Instagram, Twitter, Linkedin, Dribbble } from 'lucide-react';
import { useNavigate } from 'react-router';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer
      className="py-12 md:py-20 px-4 md:px-6"
      style={{ background: '#0F1530' }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '2rem',
                  color: '#FFC857',
                  fontWeight: 700,
                }}
              >
                Based on Creativity
              </h3>
              <p
                className="mb-8 max-w-md leading-relaxed"
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
              >
                We transform visions into extraordinary digital experiences. 
                Every pixel, every interaction, crafted with intention.
              </p>
              <div className="flex gap-4">
                {[
                  { icon: Instagram, href: 'https://www.instagram.com/basedoncreativity' },
                  { icon: Twitter, href: '#' },
                  { icon: Linkedin, href: 'https://www.linkedin.com/company/based-on-creativity/' },
                  { icon: Dribbble, href: '#' },
                ].map(({ icon: Icon, href }, index) => (
                  <motion.a
                    key={index}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -4, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(255, 200, 87, 0.1)',
                      border: '1px solid rgba(255, 200, 87, 0.3)',
                    }}
                  >
                    <Icon size={20} style={{ color: '#FFC857' }} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          {[
            {
              title: 'Explore',
              links: [
                { label: 'Work', path: '/work' },
                { label: 'Services', path: '/services' },
                { label: 'Studio', path: '/studio' },
                { label: 'The Vault', path: '/vault' },
              ],
            },
            {
              title: 'Company',
              links: [
                { label: 'About', path: '/about' },
                { label: 'Stories', path: '/stories' },
                { label: 'Library', path: '/library' },
                { label: 'Contact', path: '/contact' },
              ],
            },
          ].map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.1 * sectionIndex,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h4
                className="mb-6"
                style={{
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontWeight: 700,
                  color: '#ffffff',
                }}
              >
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <motion.button
                      onClick={() => navigate(link.path)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.3 }}
                      className="inline-block"
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: "'Source Sans 3', sans-serif",
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        textAlign: 'left',
                      }}
                    >
                      {link.label}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
        >
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.5)',
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '0.875rem',
            }}
          >
            © {currentYear} Based on Creativity. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center items-center">
            {[
              { label: 'STORIES', path: '/stories' },
              { label: 'FAQ', path: '/faq' },
              { label: 'COMMUNITY', path: '/community' },
              { label: 'LIBRARY', path: '/library' },
              { label: 'PARTNERS', path: '/partners' },
              { label: 'Privacy Policy', path: '#', isExternal: true },
              { label: 'Terms of Service', path: '#', isExternal: true },
            ].map((link) => (
              <motion.button
                key={link.label}
                onClick={() => {
                  if (link.isExternal) {
                    // For external links, do nothing or handle separately
                    return;
                  }
                  navigate(link.path);
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: '0.875rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: link.isExternal ? 'default' : 'pointer',
                  padding: 0,
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}