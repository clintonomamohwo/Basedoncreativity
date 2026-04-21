import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import bocLogo from '../../assets/boc_logo.png';

function useFavicon() {
  useEffect(() => {
    // Favicon
    let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/png';
    link.href = bocLogo;

    // Apple touch icon
    let appleLink = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!appleLink) {
      appleLink = document.createElement('link');
      appleLink.rel = 'apple-touch-icon';
      document.head.appendChild(appleLink);
    }
    appleLink.href = bocLogo;

  }, []);
}

export function Root() {
  useFavicon();

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
      <ScrollRestoration />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}