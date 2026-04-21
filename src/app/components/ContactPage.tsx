import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SEO } from './SEO';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  ArrowRight,
  Send,
  CheckCircle,
  Sparkles,
  Clock,
  Globe,
} from "lucide-react";

const projectTypes = [
  "Brand Identity",
  "Web Design & Development",
  "Creative Direction",
  "Strategy & Growth",
  "Photography / Video",
  "Other / Let's Talk",
];

const budgetRanges = [
  "Under $5K",
  "$5K to $15K",
  "$15K to $30K",
  "$30K to $60K",
  "$60K+",
  "Not sure yet",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "admin@bochq.com",
    href: "mailto:admin@bochq.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (415) 000-0000",
    href: "tel:+14150000000",
  },
  {
    icon: MapPin,
    label: "Studio",
    value: "Toronto, ON",
    href: "#",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 2-3 days",
    href: null,
  },
  {
    icon: Globe,
    label: "Working With",
    value: "Clients Worldwide",
    href: null,
  },
];

const socials = [
  {
    icon: Instagram,
    label: "Instagram",
    href: "http://instagram.com/basedoncreativity",
  },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/based-on-creativity/",
  },
  {
    icon: Youtube,
    label: "YouTube",
    href: "https://www.youtube.com/@AmbivertKing",
  },
];

function GrainOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}

export function ContactPage() {
  // Prevent horizontal scroll on mobile
  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";
    return () => {
      document.documentElement.style.overflowX = "";
      document.body.style.overflowX = "";
    };
  }, []);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSubmitting(false);
    setSubmitted(true);
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,200,87,0.04)",
    border: "1px solid rgba(255,200,87,0.18)",
    borderRadius: "10px",
    padding: "14px 18px",
    color: "#ffffff",
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "0.9375rem",
    outline: "none",
    transition:
      "border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
  };

  const inputFocused: React.CSSProperties = {
    border: "1px solid rgba(255,200,87,0.55)",
    background: "rgba(255,200,87,0.07)",
    boxShadow:
      "0 0 0 3px rgba(255,200,87,0.08), 0 0 20px rgba(255,200,87,0.06)",
  };

  return (
    <div className="relative min-h-screen bg-[#1A1F4B] overflow-x-hidden">
      <SEO title="Contact | Based on Creativity" description="Start a conversation with Based on Creativity about brand identity, digital design, creative direction, and collaborative storytelling projects." path="/contact" />
      {/* ── Background (absolute, scrolls with page) ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F4B] via-[#141830] to-[#1A1F4B]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(255,200,87,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(26,31,75,0.9),transparent_60%)]" />
        <GrainOverlay />
      </div>

      {/* ── Floating orbs (absolute, scroll with page) ── */}
      <motion.div
        style={{
          background:
            "radial-gradient(circle, rgba(255,200,87,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          position: "absolute",
          top: "8rem",
          right: "-40px",
          width: "min(360px, 70vw)",
          height: "min(360px, 70vw)",
          borderRadius: "9999px",
          pointerEvents: "none",
          zIndex: 1,
        }}
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.18, 0.26, 0.18],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        style={{
          background:
            "radial-gradient(circle, rgba(246,230,180,0.14) 0%, transparent 70%)",
          filter: "blur(80px)",
          position: "absolute",
          top: "60%",
          left: "-60px",
          width: "min(400px, 75vw)",
          height: "min(400px, 75vw)",
          borderRadius: "9999px",
          pointerEvents: "none",
          zIndex: 1,
        }}
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.1, 0.18, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* ── Main content ────────────────────────────────── */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-6 pt-28 pb-12 md:pt-36 md:pb-16">
        {/* ── Page header ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-16 md:mb-20"
        >
          <p
            className="text-sm tracking-[0.28em] uppercase mb-3"
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              color: "rgba(255,200,87,0.6)",
            }}
          >
            Let's create something extraordinary
          </p>
          <div className="h-px w-16 bg-[#FFC857]/30 mb-6" />

          <h1
            className="mb-6"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "clamp(1.75rem, 7vw, 4.5rem)",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Start a{" "}
            <span
              style={{
                color: "#FFC857",
                textShadow: "0 0 40px rgba(255,200,87,0.35)",
              }}
            >
              Conversation
            </span>
          </h1>

          <p
            className="max-w-xl"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.125rem, 3vw, 1.375rem)",
              color: "rgba(255,255,255,0.6)",
              fontStyle: "italic",
              lineHeight: 1.65,
            }}
          >
            Every great project begins with a single message.
            Tell us about your vision, your brand, your
            ambitions; we'll take it from there.
          </p>
        </motion.div>

        {/* ── Two-column grid ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 xl:gap-16 items-start">
          {/* ── LEFT: Contact form ───────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,200,87,0.13)",
                borderRadius: "20px",
                padding: "clamp(24px, 4vw, 48px)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 24px 80px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,200,87,0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Glass shimmer */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,200,87,0.3), transparent)",
                }}
              />

              <AnimatePresence mode="wait">
                {submitted ? (
                  /* ── Success state ── */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="flex flex-col items-center justify-center py-16 text-center gap-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 14,
                        delay: 0.1,
                      }}
                    >
                      <CheckCircle
                        size={64}
                        style={{
                          color: "#FFC857",
                          filter:
                            "drop-shadow(0 0 20px rgba(255,200,87,0.5))",
                        }}
                      />
                    </motion.div>
                    <div>
                      <h2
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "1.75rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          marginBottom: "12px",
                        }}
                      >
                        Message Received
                      </h2>
                      <p
                        style={{
                          fontFamily:
                            "'Cormorant Garamond', serif",
                          fontSize: "1.15rem",
                          color: "rgba(255,255,255,0.6)",
                          fontStyle: "italic",
                          lineHeight: 1.6,
                          maxWidth: "400px",
                        }}
                      >
                        Thank you for reaching out. We'll be in
                        touch within 24 hours to explore what we
                        can create together.
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        setSubmitted(false);
                        setForm({
                          name: "",
                          email: "",
                          company: "",
                          projectType: "",
                          budget: "",
                          message: "",
                        });
                      }}
                      whileHover={{
                        scale: 1.04,
                        boxShadow:
                          "0 0 30px rgba(255,200,87,0.3)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        marginTop: "8px",
                        padding: "12px 28px",
                        background: "transparent",
                        border:
                          "1px solid rgba(255,200,87,0.4)",
                        borderRadius: "999px",
                        color: "#FFC857",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "0.75rem",
                        letterSpacing: "0.12em",
                        cursor: "pointer",
                      }}
                    >
                      SEND ANOTHER
                    </motion.button>
                  </motion.div>
                ) : (
                  /* ── Form ── */
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-5"
                  >
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        {
                          id: "name",
                          label: "Full Name *",
                          placeholder: "Your name",
                          type: "text",
                          required: true,
                        },
                        {
                          id: "email",
                          label: "Email Address *",
                          placeholder: "you@company.com",
                          type: "email",
                          required: true,
                        },
                      ].map(
                        ({
                          id,
                          label,
                          placeholder,
                          type,
                          required,
                        }) => (
                          <div
                            key={id}
                            className="flex flex-col gap-2"
                          >
                            <label
                              htmlFor={id}
                              style={{
                                fontFamily:
                                  "'Space Mono', monospace",
                                fontSize: "0.7rem",
                                letterSpacing: "0.12em",
                                color: "rgba(255,200,87,0.7)",
                              }}
                            >
                              {label}
                            </label>
                            <input
                              id={id}
                              type={type}
                              required={required}
                              placeholder={placeholder}
                              value={
                                form[id as keyof typeof form]
                              }
                              onChange={(e) =>
                                handleChange(id, e.target.value)
                              }
                              onFocus={() => setFocused(id)}
                              onBlur={() => setFocused(null)}
                              style={{
                                ...inputBase,
                                ...(focused === id
                                  ? inputFocused
                                  : {}),
                              }}
                            />
                          </div>
                        ),
                      )}
                    </div>

                    {/* Row 2: Company (optional) */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="company"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          color: "rgba(255,200,87,0.7)",
                        }}
                      >
                        Company / Brand
                      </label>
                      <input
                        id="company"
                        type="text"
                        placeholder="Your company or brand name (optional)"
                        value={form.company}
                        onChange={(e) =>
                          handleChange(
                            "company",
                            e.target.value,
                          )
                        }
                        onFocus={() => setFocused("company")}
                        onBlur={() => setFocused(null)}
                        style={{
                          ...inputBase,
                          ...(focused === "company"
                            ? inputFocused
                            : {}),
                        }}
                      />
                    </div>

                    {/* Row 3: Project type */}
                    <div className="flex flex-col gap-3">
                      <label
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          color: "rgba(255,200,87,0.7)",
                        }}
                      >
                        PROJECT TYPE *
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {projectTypes.map((pt) => (
                          <motion.button
                            key={pt}
                            type="button"
                            onClick={() =>
                              handleChange("projectType", pt)
                            }
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              padding: "7px 16px",
                              borderRadius: "999px",
                              border:
                                form.projectType === pt
                                  ? "1px solid rgba(255,200,87,0.8)"
                                  : "1px solid rgba(255,200,87,0.2)",
                              background:
                                form.projectType === pt
                                  ? "rgba(255,200,87,0.14)"
                                  : "transparent",
                              color:
                                form.projectType === pt
                                  ? "#FFC857"
                                  : "rgba(255,255,255,0.5)",
                              fontFamily:
                                "'Source Sans 3', sans-serif",
                              fontSize: "0.8125rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow:
                                form.projectType === pt
                                  ? "0 0 12px rgba(255,200,87,0.18)"
                                  : "none",
                            }}
                          >
                            {pt}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Row 4: Budget */}
                    <div className="flex flex-col gap-3">
                      <label
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          color: "rgba(255,200,87,0.7)",
                        }}
                      >
                        ESTIMATED BUDGET
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {budgetRanges.map((b) => (
                          <motion.button
                            key={b}
                            type="button"
                            onClick={() =>
                              handleChange("budget", b)
                            }
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              padding: "7px 16px",
                              borderRadius: "999px",
                              border:
                                form.budget === b
                                  ? "1px solid rgba(255,200,87,0.8)"
                                  : "1px solid rgba(255,200,87,0.2)",
                              background:
                                form.budget === b
                                  ? "rgba(255,200,87,0.14)"
                                  : "transparent",
                              color:
                                form.budget === b
                                  ? "#FFC857"
                                  : "rgba(255,255,255,0.5)",
                              fontFamily:
                                "'Source Sans 3', sans-serif",
                              fontSize: "0.8125rem",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              boxShadow:
                                form.budget === b
                                  ? "0 0 12px rgba(255,200,87,0.18)"
                                  : "none",
                            }}
                          >
                            {b}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Row 5: Message */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="message"
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.7rem",
                          letterSpacing: "0.12em",
                          color: "rgba(255,200,87,0.7)",
                        }}
                      >
                        YOUR MESSAGE *
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        placeholder="Tell us about your project, your goals, and what you're hoping to achieve..."
                        value={form.message}
                        onChange={(e) =>
                          handleChange(
                            "message",
                            e.target.value,
                          )
                        }
                        onFocus={() => setFocused("message")}
                        onBlur={() => setFocused(null)}
                        style={{
                          ...inputBase,
                          resize: "vertical",
                          minHeight: "130px",
                          ...(focused === "message"
                            ? inputFocused
                            : {}),
                        }}
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={
                        !submitting
                          ? {
                              scale: 1.02,
                              boxShadow:
                                "0 0 40px rgba(255,200,87,0.45), 0 8px 32px rgba(0,0,0,0.4)",
                            }
                          : {}
                      }
                      whileTap={
                        !submitting ? { scale: 0.98 } : {}
                      }
                      style={{
                        marginTop: "4px",
                        width: "100%",
                        padding: "16px 32px",
                        background: submitting
                          ? "rgba(255,200,87,0.5)"
                          : "linear-gradient(135deg, #FFC857 0%, #FFD988 50%, #FFC857 100%)",
                        backgroundSize: "200% 200%",
                        border: "none",
                        borderRadius: "12px",
                        color: "#1A1F4B",
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: "0.875rem",
                        letterSpacing: "0.1em",
                        cursor: submitting
                          ? "not-allowed"
                          : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        boxShadow:
                          "0 4px 24px rgba(255,200,87,0.3)",
                        transition: "background 0.3s ease",
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {submitting ? (
                          <motion.span
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              style={{ display: "inline-flex" }}
                            >
                              <Sparkles size={16} />
                            </motion.span>
                            SENDING…
                          </motion.span>
                        ) : (
                          <motion.span
                            key="send"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            SEND MESSAGE
                            <Send size={16} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    <p
                      style={{
                        fontFamily:
                          "'Source Sans 3', sans-serif",
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.3)",
                        textAlign: "center",
                        marginTop: "-4px",
                      }}
                    >
                      We respond to every inquiry within 24
                      hours.
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── RIGHT: Contact info sidebar ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-6"
          >
            {/* Quick CTA card */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,200,87,0.12) 0%, rgba(255,200,87,0.04) 100%)",
                border: "1px solid rgba(255,200,87,0.25)",
                borderRadius: "16px",
                padding: "28px",
                backdropFilter: "blur(16px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,200,87,0.4), transparent)",
                }}
              />
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,200,87,0.6)",
                  marginBottom: "10px",
                }}
              >
                DIRECT INQUIRY
              </p>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.25rem",
                  color: "#ffffff",
                  fontStyle: "italic",
                  lineHeight: 1.55,
                  marginBottom: "18px",
                }}
              >
                "Prefer to jump straight in? Book a free
                30-minute discovery call."
              </p>
              <motion.a
                href="mailto:hello@basedoncreativIty.com"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 24px rgba(255,200,87,0.25)",
                }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 20px",
                  border: "1px solid rgba(255,200,87,0.45)",
                  borderRadius: "999px",
                  color: "#FFC857",
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.7rem",
                  letterSpacing: "0.12em",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                BOOK A CALL <ArrowRight size={13} />
              </motion.a>
            </div>

            {/* Contact details */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,200,87,0.1)",
                borderRadius: "16px",
                padding: "28px",
                backdropFilter: "blur(16px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,200,87,0.6)",
                  marginBottom: "20px",
                }}
              >
                GET IN TOUCH
              </p>
              <div className="flex flex-col gap-4">
                {contactInfo.map(
                  ({ icon: Icon, label, value, href }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3"
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "8px",
                          background: "rgba(255,200,87,0.08)",
                          border:
                            "1px solid rgba(255,200,87,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Icon
                          size={15}
                          style={{ color: "#FFC857" }}
                        />
                      </div>
                      <div>
                        <p
                          style={{
                            fontFamily:
                              "'Space Mono', monospace",
                            fontSize: "0.6rem",
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.35)",
                            marginBottom: "2px",
                          }}
                        >
                          {label.toUpperCase()}
                        </p>
                        {href ? (
                          <motion.a
                            href={href}
                            whileHover={{ color: "#FFC857" }}
                            style={{
                              fontFamily:
                                "'Source Sans 3', sans-serif",
                              fontSize: "0.9rem",
                              color: "rgba(255,255,255,0.75)",
                              textDecoration: "none",
                              transition: "color 0.2s",
                            }}
                          >
                            {value}
                          </motion.a>
                        ) : (
                          <p
                            style={{
                              fontFamily:
                                "'Source Sans 3', sans-serif",
                              fontSize: "0.9rem",
                              color: "rgba(255,255,255,0.75)",
                            }}
                          >
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Socials */}
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,200,87,0.1)",
                borderRadius: "16px",
                padding: "28px",
                backdropFilter: "blur(16px)",
              }}
            >
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "0.65rem",
                  letterSpacing: "0.18em",
                  color: "rgba(255,200,87,0.6)",
                  marginBottom: "18px",
                }}
              >
                FOLLOW THE STUDIO
              </p>
              <div className="flex flex-col gap-3">
                {socials.map(({ icon: Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{
                      x: 4,
                      color: "#FFC857",
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      color: "rgba(255,255,255,0.55)",
                      textDecoration: "none",
                      fontFamily: "'Source Sans 3', sans-serif",
                      fontSize: "0.9rem",
                      transition: "color 0.2s ease",
                    }}
                  >
                    <span
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "rgba(255,200,87,0.06)",
                        border:
                          "1px solid rgba(255,200,87,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={14} />
                    </span>
                    {label}
                    <ArrowRight
                      size={12}
                      style={{
                        marginLeft: "auto",
                        opacity: 0.4,
                      }}
                    />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Bottom quote ────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-12 md:mt-16 text-center px-4"
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              background: "rgba(255,200,87,0.3)",
              margin: "0 auto 20px",
            }}
          />
          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(1.35rem, 3vw, 2rem)",
              color: "rgba(255,255,255,0.45)",
              fontStyle: "italic",
              lineHeight: 1.55,
              maxWidth: "700px",
              margin: "0 auto",
            }}
          >
            "We don't just build brands; we build legacies."
          </blockquote>
          <p
            className="mt-4"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.65rem",
              letterSpacing: "0.2em",
              color: "rgba(255,200,87,0.4)",
            }}
          >
            BASED ON CREATIVITY
          </p>
        </motion.div>
      </div>
    </div>
  );
}
