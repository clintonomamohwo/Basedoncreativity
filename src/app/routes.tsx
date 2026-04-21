import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { ErrorPage } from './components/ErrorPage';

const HomePage = lazy(() => import('./components/HomePage').then((module) => ({ default: module.HomePage })));
const WorkPage = lazy(() => import('./components/WorkPage').then((module) => ({ default: module.WorkPage })));
const ServicesPage = lazy(() => import('./components/ServicesPage').then((module) => ({ default: module.ServicesPage })));
const StudioPage = lazy(() => import('./components/StudioPage').then((module) => ({ default: module.StudioPage })));
const VaultPage = lazy(() => import('./components/VaultPage').then((module) => ({ default: module.VaultPage })));
const AboutPage = lazy(() => import('./components/AboutPage').then((module) => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import('./components/ContactPage').then((module) => ({ default: module.ContactPage })));
const StoriesPage = lazy(() => import('./components/StoriesPage').then((module) => ({ default: module.StoriesPage })));
const StoryDetail = lazy(() => import('./components/StoryDetail').then((module) => ({ default: module.StoryDetail })));
const LibraryPage = lazy(() => import('./components/LibraryPage').then((module) => ({ default: module.LibraryPage })));
const FAQPage = lazy(() => import('./components/FAQPage').then((module) => ({ default: module.FAQPage })));
const CommunityPage = lazy(() => import('./components/CommunityPage').then((module) => ({ default: module.CommunityPage })));
const PartnersPage = lazy(() => import('./components/PartnersPage').then((module) => ({ default: module.PartnersPage })));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage').then((module) => ({ default: module.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import('./components/TermsOfServicePage').then((module) => ({ default: module.TermsOfServicePage })));
const NotFoundPage = lazy(() => import('./components/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: HomePage },
      { path: 'work', Component: WorkPage },
      { path: 'services', Component: ServicesPage },
      { path: 'studio', Component: StudioPage },
      { path: 'vault', Component: VaultPage },
      { path: 'about', Component: AboutPage },
      { path: 'contact', Component: ContactPage },
      { path: 'stories', Component: StoriesPage },
      { path: 'stories/:storyId', Component: StoryDetail },
      { path: 'library', Component: LibraryPage },
      { path: 'faq', Component: FAQPage },
      { path: 'community', Component: CommunityPage },
      { path: 'partners', Component: PartnersPage },
      { path: 'privacy', Component: PrivacyPolicyPage },
      { path: 'terms', Component: TermsOfServicePage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);