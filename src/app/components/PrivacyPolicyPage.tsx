import { motion } from 'motion/react';
import { SEO } from './SEO';

const SECTIONS = [
  {
    number: '1.',
    title: 'Information We Collect',
    content: (
      <>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '1rem' }}>
          We collect information to provide you with a better experience, respond to your inquiries, and process future transactions.
        </p>
        <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1rem', color: '#FFC857', fontWeight: 700, marginBottom: '0.75rem' }}>
          Information You Provide to Us
        </h4>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '0.75rem' }}>
          When you interact with our Site, we may collect the following personal information:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'Contact Information: Name, email address, and message content when you use our contact form.',
            'Account and Order Information (Future E-Commerce): When our shop launches, we will collect information necessary to process your orders, including your billing address, shipping address, and phone number.',
            'Payment Information (Future E-Commerce): Payment details (such as credit card numbers) will be collected and processed securely by our third-party payment processors. We do not store full credit card numbers on our servers.',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFC857', marginTop: '0.1rem', flexShrink: 0 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>{item}</span>
            </li>
          ))}
        </ul>
        <h4 style={{ fontFamily: "'Space Mono', monospace", fontSize: '1rem', color: '#FFC857', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
          Information Collected Automatically
        </h4>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '0.75rem' }}>
          When you visit our Site, we may automatically collect certain information about your device and usage through cookies and standard web analytics. This may include:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'IP address',
            'Browser type and version',
            'Operating system',
            'Pages visited and time spent on the Site',
            'Referring website addresses',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFC857', marginTop: '0.1rem', flexShrink: 0 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: '2.',
    title: 'How We Use Your Information',
    content: (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          'To Respond to Inquiries: We use the information provided through our contact form to answer your questions and communicate with you.',
          'To Process Transactions (Future E-Commerce): We will use your order and payment information to fulfill your purchases, process payments, arrange for shipping, and provide you with invoices and order confirmations.',
          'To Improve Our Site: We use analytics data to understand how visitors interact with our Site, which helps us improve its functionality and user experience.',
          'To Protect Our Rights: We may use your information to detect, prevent, and address technical issues, fraud, or other illegal activities.',
        ].map((item, i) => (
          <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#FFC857', marginTop: '0.1rem', flexShrink: 0 }}>•</span>
            <span style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>{item}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    number: '3.',
    title: 'Cookies and Analytics',
    content: (
      <>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '1rem' }}>
          Our Site uses cookies and similar tracking technologies to track activity and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site, including future shopping cart functionalities.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>
          We may also use third party analytics services to monitor and analyze the use of our Site. These services collect and analyze information such as how often users visit the Site, what pages they visit, and what other sites they used prior to coming to our Site.
        </p>
      </>
    ),
  },
  {
    number: '4.',
    title: 'Third Party Services and Payment Processors',
    content: (
      <>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '1rem' }}>
          We do not sell, trade, or otherwise transfer your personal information to outside parties for marketing purposes. However, we may share your information with trusted third-party service providers who assist us in operating our website, conducting our business, or servicing you.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>
          For future e-commerce transactions, we will partner with third-party payment processors and shipping providers. These third parties have access to your personal information only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose. Their use of your personal information is governed by their respective privacy policies.
        </p>
      </>
    ),
  },
  {
    number: '5.',
    title: 'Data Retention',
    content: (
      <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>
        We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations (for example, keeping records of ecommerce transactions for tax purposes), resolve disputes, and enforce our policies.
      </p>
    ),
  },
  {
    number: '6.',
    title: 'Your Rights',
    content: (
      <>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '0.75rem' }}>
          Depending on your location, you may have certain rights regarding your personal information, including:
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            'The right to access the personal information we hold about you.',
            'The right to request that we correct any inaccuracies in your personal information.',
            'The right to request that we delete your personal information.',
          ].map((item, i) => (
            <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <span style={{ color: '#FFC857', marginTop: '0.1rem', flexShrink: 0 }}>•</span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>{item}</span>
            </li>
          ))}
        </ul>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>
          To exercise any of these rights, please contact us using the information provided below.
        </p>
      </>
    ),
  },
  {
    number: '7.',
    title: "Children's Privacy",
    content: (
      <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>
        Our Site and the content produced by our subsidiaries, such as Creativity Base Studios, may attract younger audiences. However, we do not knowingly collect personally identifiable information from children under the age of 13 in compliance with the Children's Online Privacy Protection Act (COPPA). If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we take steps to remove that information from our servers.
      </p>
    ),
  },
  {
    number: '8.',
    title: 'Changes to This Privacy Policy',
    content: (
      <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65 }}>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Effective Date" at the top. You are advised to review this Privacy Policy periodically for any changes.
      </p>
    ),
  },
  {
    number: '9.',
    title: 'Contact Us',
    content: (
      <>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.65, marginBottom: '0.75rem' }}>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <a
          href="mailto:contact@bochq.com"
          style={{
            color: '#FFC857',
            fontFamily: "'Source Sans 3', sans-serif",
            fontWeight: 600,
            textDecoration: 'none',
          }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          contact@bochq.com
        </a>
      </>
    ),
  },
];

export function PrivacyPolicyPage() {
  return (
    <div
      style={{ background: '#1A1F4B', minHeight: '100vh' }}
      className="px-4 md:px-6 py-24 md:py-32"
    >
      <SEO title="Privacy Policy | Based on Creativity" description="Read the Based on Creativity privacy policy to understand how personal information is collected, used, stored, and protected." path="/privacy" />
      <div className="max-w-[800px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.125rem',
              fontStyle: 'italic',
              color: '#FFC857',
              marginBottom: '1rem',
            }}
          >
            Legal &amp; Transparency
          </p>
          <h1
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 'clamp(1.75rem, 5vw, 3rem)',
              fontWeight: 700,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            Privacy Policy
          </h1>

          {/* Gold divider */}
          <div style={{ width: '64px', height: '3px', background: '#FFC857', borderRadius: '2px', marginBottom: '1.5rem' }} />

          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: '0.9375rem',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
            }}
          >
            Effective Date: March 23, 2026
          </p>
        </motion.div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(255,200,87,0.06)',
            border: '1px solid rgba(255,200,87,0.15)',
            borderRadius: '12px',
            padding: '1.5rem 2rem',
            marginBottom: '3rem',
          }}
        >
          <p
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              color: 'rgba(255,255,255,0.8)',
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            Welcome to <strong style={{ color: '#ffffff' }}>Based on Creativity</strong> ("BOC," "we," "us," or "our"). We are a digital media company and the parent company of Creativity Base Studios, Creativity Base Press, and Creativity Base Network. This Privacy Policy explains how we collect, use, and protect your information when you visit our website at{' '}
            <a
              href="https://bochq.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#FFC857', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              bochq.com
            </a>
            , use our contact forms, or interact with our future ecommerce features. By using our Site, you agree to the practices described in this policy.
          </p>
        </motion.div>

        {/* Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {SECTIONS.map((section, index) => (
            <motion.section
              key={section.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
                <span
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.875rem',
                    color: '#FFC857',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {section.number}
                </span>
                <h2
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    margin: 0,
                  }}
                >
                  {section.title}
                </h2>
              </div>
              <div
                style={{
                  borderLeft: '2px solid rgba(255,200,87,0.2)',
                  paddingLeft: '1.5rem',
                }}
              >
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: '4rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.125rem',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            © 2026 Based on Creativity. All rights reserved.
          </p>
        </motion.div>

      </div>
    </div>
  );
}