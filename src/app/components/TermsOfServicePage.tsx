import React from 'react';
import { motion } from 'motion/react';

const SUB_SECTION_STYLE = {
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.9rem',
  color: '#FFC857',
  fontWeight: 700,
  marginTop: '1.5rem',
  marginBottom: '0.65rem',
};

const BODY_STYLE = {
  color: 'rgba(255,255,255,0.75)',
  fontFamily: "'Source Sans 3', sans-serif",
  lineHeight: 1.65,
  marginBottom: '0.85rem',
};

const BULLET_LIST = (items: string[]) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 0', display: 'flex', flexDirection: 'column' as const, gap: '0.5rem' }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <span style={{ color: '#FFC857', marginTop: '0.1rem', flexShrink: 0 }}>•</span>
        <span style={BODY_STYLE as React.CSSProperties}>{item}</span>
      </li>
    ))}
  </ul>
);

const SECTIONS = [
  {
    number: '1.',
    title: 'Acceptable Use',
    content: (
      <>
        <p style={BODY_STYLE as React.CSSProperties}>
          You agree to use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site:
        </p>
        {BULLET_LIST([
          'In any way that violates any applicable federal, provincial, local, or international law or regulation.',
          'For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way by exposing them to inappropriate content, asking for personally identifiable information, or otherwise.',
          'To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.',
          'To impersonate or attempt to impersonate BOC, a BOC employee, another user, or any other person or entity.',
          'To engage in any other conduct that restricts or inhibits anyone\'s use or enjoyment of the Site, or which, as determined by us, may harm BOC or users of the Site, or expose them to liability.',
        ])}
      </>
    ),
  },
  {
    number: '2.',
    title: 'Intellectual Property Rights',
    content: (
      <>
        <p style={BODY_STYLE as React.CSSProperties}>
          The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by BOC, its licensors, or other providers of such material and are protected by Canadian and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>
        <p style={BODY_STYLE as React.CSSProperties}>
          This includes all content, designs, animations, publications, and merchandise produced by BOC and its subsidiaries (Creativity Base Studios, Creativity Base Press, and Creativity Base Network). You must not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Site without our prior written consent.
        </p>
      </>
    ),
  },
  {
    number: '3.',
    title: 'User-Submitted Content',
    content: (
      <>
        <p style={BODY_STYLE as React.CSSProperties}>
          If you submit any content to us, including messages, feedback, suggestions, or other materials through our contact form or other means ("User Submissions"), you grant BOC a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Submissions throughout the world in any media.
        </p>
        <p style={BODY_STYLE as React.CSSProperties}>
          You represent and warrant that you own or control all rights in and to the User Submissions and have the right to grant the license granted above to us and our affiliates and service providers, and each of their and our respective licensees, successors, and assigns.
        </p>
      </>
    ),
  },
  {
    number: '4.',
    title: 'E-Commerce and Purchases (Future Provisions)',
    content: (
      <>
        <p style={BODY_STYLE as React.CSSProperties}>
          While our shop is not currently live, the following terms will apply to all future purchases made through the Site:
        </p>

        <h4 style={SUB_SECTION_STYLE as React.CSSProperties}>Product Descriptions and Pricing</h4>
        <p style={BODY_STYLE as React.CSSProperties}>
          We strive to ensure that all product descriptions, images, and pricing information on the Site are accurate. However, we do not warrant that product descriptions or other content on the Site are accurate, complete, reliable, current, or error-free. If a product offered by BOC is not as described, your sole remedy is to return it in unused condition. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update information or cancel orders if any information on the Site is inaccurate at any time without prior notice (including after you have submitted your order).
        </p>

        <h4 style={SUB_SECTION_STYLE as React.CSSProperties}>Payment Processing</h4>
        <p style={BODY_STYLE as React.CSSProperties}>
          All payments will be processed securely through our third-party payment processors. By submitting your payment information, you grant us the right to provide such information to these third parties for purposes of facilitating the completion of your purchases. You represent and warrant that you have the legal right to use any credit card(s) or other payment method(s) utilized in connection with any transaction.
        </p>

        <h4 style={SUB_SECTION_STYLE as React.CSSProperties}>Order Fulfillment and Shipping</h4>
        <p style={BODY_STYLE as React.CSSProperties}>
          We will make reasonable efforts to fulfill and ship orders promptly. Shipping times and costs will be calculated and displayed at checkout. We are not responsible for delays caused by shipping carriers or customs clearance processes. Risk of loss and title for items purchased from BOC pass to you upon delivery of the items to the carrier.
        </p>

        <h4 style={SUB_SECTION_STYLE as React.CSSProperties}>Refund and Return Policy</h4>
        <p style={BODY_STYLE as React.CSSProperties}>
          Our return and refund policy will be detailed on the Site once the shop is live. Generally, we will accept returns of unused and undamaged merchandise within a specified period (e.g., 30 days) from the date of purchase, subject to certain conditions and exceptions. Digital products and custom items may be non-refundable.
        </p>
      </>
    ),
  },
  {
    number: '5.',
    title: 'Limitation of Liability',
    content: (
      <p style={BODY_STYLE as React.CSSProperties}>
        In no event will BOC, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the Site, any websites linked to it, any content on the Site or such other websites, including any direct, indirect, special, incidental, consequential, or punitive damages, including but not limited to, personal injury, pain and suffering, emotional distress, loss of revenue, loss of profits, loss of business or anticipated savings, loss of use, loss of goodwill, loss of data, and whether caused by tort (including negligence), breach of contract, or otherwise, even if foreseeable.
      </p>
    ),
  },
  {
    number: '6.',
    title: 'Governing Law and Jurisdiction',
    content: (
      <>
        <p style={BODY_STYLE as React.CSSProperties}>
          All matters relating to the Site and these Terms, and any dispute or claim arising therefrom or related thereto (in each case, including non-contractual disputes or claims), shall be governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without giving effect to any choice or conflict of law provision or rule.
        </p>
        <p style={BODY_STYLE as React.CSSProperties}>
          Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Site shall be instituted exclusively in the courts of the Province of Ontario, Canada. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
        </p>
      </>
    ),
  },
  {
    number: '7.',
    title: 'Termination',
    content: (
      <p style={BODY_STYLE as React.CSSProperties}>
        We may terminate or suspend your access to all or part of the Site for any or no reason, including without limitation, any violation of these Terms. Upon termination, your right to use the Site will immediately cease.
      </p>
    ),
  },
  {
    number: '8.',
    title: 'Modifications to Terms',
    content: (
      <p style={BODY_STYLE as React.CSSProperties}>
        We may revise and update these Terms from time to time in our sole discretion. All changes are effective immediately when we post them and apply to all access to and use of the Site thereafter. Your continued use of the Site following the posting of revised Terms means that you accept and agree to the changes. You are expected to check this page from time to time so you are aware of any changes, as they are binding on you.
      </p>
    ),
  },
  {
    number: '9.',
    title: 'Contact Us',
    content: (
      <>
        <p style={BODY_STYLE as React.CSSProperties}>
          If you have any questions about these Terms, please contact us at:
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

export function TermsOfServicePage() {
  return (
    <main
      style={{ background: '#1A1F4B', minHeight: '100vh' }}
      className="px-4 md:px-6 py-24 md:py-32"
    >
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
            Terms of Service
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
            Welcome to <strong style={{ color: '#ffffff' }}>Based on Creativity</strong> ("BOC," "we," "us," or "our"). We are a digital media company and the parent company of Creativity Base Studios, Creativity Base Press, and Creativity Base Network. Our tagline is "Built in the quiet. Born in the light."
            <br /><br />
            These Terms of Service ("Terms") govern your access to and use of our website at{' '}
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
            , including any content, functionality, and services offered on or through the Site. By accessing or using the Site, you agree to be bound by these Terms. If you do not agree to these Terms, you must not access or use the Site.
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
    </main>
  );
}