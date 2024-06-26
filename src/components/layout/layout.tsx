import Header from '@components/layout/header/header';
import Footer from '@components/layout/footer/footer';
import MobileNavigation from '@components/layout/mobile-navigation/mobile-navigation';
import Search from '@components/common/search';
import { useRouter } from 'next/router';
import { Suspense } from 'react';
import FacebookPixel from '@components/FacebookPixel';

const SiteLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const showMobileNavigation = !router.pathname.startsWith('/products/[slug]');
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className="relative flex-grow"
        style={{
          minHeight: '-webkit-fill-available',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer />
      {showMobileNavigation && <MobileNavigation />}
      <Search />

      <FacebookPixel />
    </div>
  );
};

export const getLayout = (page: React.ReactElement) => (
  <SiteLayout>{page}</SiteLayout>
);

export default SiteLayout;
