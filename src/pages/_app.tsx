import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AnimatePresence } from 'framer-motion';
import { ManagedUIContext } from '@contexts/ui.context';
import ManagedModal from '@components/common/modal/managed-modal';
import ManagedDrawer from '@components/ui/drawer/managed-drawer';
import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ToastContainer } from 'react-toastify';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import DefaultSeo from '@components/common/default-seo';
import FacebookPixel from 'react-facebook-pixel';

// Load Open Sans and satisfy typeface font
import '@fontsource/open-sans';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/satisfy';
// external
import 'react-toastify/dist/ReactToastify.css';
// base css file
import '@styles/scrollbar.css';
import '@styles/swiper-carousel.css';
import '@styles/custom-plugins.css';
import '@styles/tailwind.css';
import { getDirection } from '@utils/get-direction';
import PageLoader from '@components/ui/page-loader/page-loader';
import ErrorMessage from '@components/ui/error-message';
import { SettingsProvider } from '@contexts/settings.context';
import { useSettings } from '@framework/settings';
import type { NextPage } from 'next';
import PrivateRoute from '@lib/private-route';
import SocialLoginProvider from '@providers/social-login-provider';
import { SessionProvider } from 'next-auth/react';
import Maintenance from '@components/maintenance/layout';
import '../assets/styles/animation.css';

import Script from 'next/script';
import * as fbq from '../lib/fpixel';

function handleExitComplete() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0 });
  }
}

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
  authenticate?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const AppSettings: React.FC<{ children?: React.ReactNode }> = (
  props,
) => {
  const { data, isLoading: loading, error } = useSettings();
  if (loading) return <PageLoader />;
  if (error) return <ErrorMessage message={error.message} />;
  return <SettingsProvider initialValue={data?.options} {...props} />;
};

function CustomApp({
  Component,
  pageProps: {
    //@ts-ignore
    session,
    ...pageProps
  },
}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  const authProps = Component.authenticate ?? false;

  const [queryClient] = useState(() => new QueryClient());

  const router = useRouter();
  const dir = getDirection(router.locale);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(() => {
    // This pageview only triggers the first time (it's important for Pixel to have real information)
    fbq.pageview();

    const handleRouteChange = () => {
      fbq.pageview();
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      
      <AnimatePresence initial={false} onExitComplete={handleExitComplete}>
        <SessionProvider session={session}>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <AppSettings>
                <ManagedUIContext>
                  <DefaultSeo />
                  <Maintenance>
                  <Script
        id="fb-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/all.js');
            fbq('init', 'TEST24841');
          `,
        }}
      />
                    {Boolean(authProps) ? (
                      <PrivateRoute>
                        {getLayout(<Component {...pageProps} />)}
                      </PrivateRoute>
                    ) : (
                      getLayout(<Component {...pageProps} />)
                    )}
                  </Maintenance>
                  <ToastContainer autoClose={2000} theme="colored" />
                  <SocialLoginProvider />
                  <ManagedModal />
                  <ManagedDrawer />
                </ManagedUIContext>
              </AppSettings>
            </Hydrate>
            {/* <ReactQueryDevtools /> */}
          </QueryClientProvider>
        </SessionProvider>
      </AnimatePresence>
    </>
  );
}

export default appWithTranslation(CustomApp);
