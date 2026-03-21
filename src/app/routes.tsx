import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { HomePage } from './components/HomePage';
import { VaultPage } from './components/VaultPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { StoriesPage } from './components/StoriesPage';
import { StoryDetail } from './components/StoryDetail';
import { LibraryPage } from './components/LibraryPage';
import { WorkPage } from './components/WorkPage';
import { ServicesPage } from './components/ServicesPage';
import { StudioPage } from './components/StudioPage';
import { FAQPage } from './components/FAQPage';
import { CommunityPage } from './components/CommunityPage';
import { PartnersPage } from './components/PartnersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true,        Component: HomePage      },
      { path: 'work',       Component: WorkPage      },
      { path: 'services',   Component: ServicesPage  },
      { path: 'studio',     Component: StudioPage    },
      { path: 'vault',      Component: VaultPage     },
      { path: 'about',      Component: AboutPage     },
      { path: 'contact',    Component: ContactPage   },
      { path: 'stories',    Component: StoriesPage   },
      { path: 'stories/:storyId', Component: StoryDetail },
      { path: 'library',    Component: LibraryPage   },
      { path: 'faq',        Component: FAQPage       },
      { path: 'community',  Component: CommunityPage },
      { path: 'partners',   Component: PartnersPage  },
    ],
  },
]);