import { Outlet } from 'react-router';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

export function Root() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}