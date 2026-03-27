import { motion } from 'motion/react';
import { ArrowRight, Mail, Phone, MapPin } from 'lucide-react';

export function ContactSection() {
  return (
    <section
      className="py-16 md:py-32 px-4 md:px-6 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1A1F4B 0%, #2A2F5B 100%)',
      }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFC857' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-[1400px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2
              className="mb-6 leading-tight"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 'clamp(1.75rem, 7vw, 4.5rem)',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              Let's Create
              <br />
              Something{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #FFC857 0%, #FFD88A 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Extraordinary
              </span>
            </h2>
            <p
              className="text-lg mb-10 leading-relaxed"
              style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontFamily: "'Source Sans 3', sans-serif",
              }}
            >
              Ready to elevate your brand? Let's start a conversation about bringing
              your vision to life with creativity that makes an impact.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group px-10 py-5 rounded-full flex items-center justify-center gap-3 w-full sm:w-auto"
              style={{
                background: '#FFC857',
                color: '#1A1F4B',
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(0.9375rem, 3vw, 1.125rem)',
                boxShadow: '0 8px 32px rgba(255, 200, 87, 0.4)',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Start Your Project
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={20} />
              </motion.div>
            </motion.button>
          </motion.div>

          {/* Right Content - Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            {[
              {
                icon: Mail,
                label: 'Email',
                value: 'hello@basedoncreativity.com',
              },
              {
                icon: Phone,
                label: 'Phone',
                value: '+1 (555) 123-4567',
              },
              {
                icon: MapPin,
                label: 'Location',
                value: 'Toronto, ON',
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + index * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-4 p-6 rounded-2xl backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div
                    className="p-3 rounded-xl"
                    style={{
                      background: 'rgba(255, 200, 87, 0.15)',
                      border: '1px solid rgba(255, 200, 87, 0.3)',
                    }}
                  >
                    <Icon size={24} style={{ color: '#FFC857' }} />
                  </div>
                  <div>
                    <div
                      className="text-sm mb-1"
                      style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontFamily: "'Source Sans 3', sans-serif",
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        color: '#ffffff',
                        fontFamily: "'Source Sans 3', sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {item.value}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}