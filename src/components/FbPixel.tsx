'use client';

import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

const FbPixel = () => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('Window is defined');
      const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
      console.log('Pixel ID:', pixelId);

      if (pixelId) {
        import('react-facebook-pixel')
          .then((FacebookPixel) => {
            FacebookPixel.default.init(pixelId);
            FacebookPixel.default.pageView();

            const handleRouteChange = () => {
              console.log('Route changed, tracking page view');
              FacebookPixel.default.pageView();
            };

            router.events.on('routeChangeComplete', handleRouteChange);
            return () => {
              router.events.off('routeChangeComplete', handleRouteChange);
            };
          })
          .catch((error) => {
            console.error('Error importing react-facebook-pixel:', error);
          });
      } else {
        console.error('Facebook Pixel ID is not defined');
      }
    } else {
      console.log('Window is undefined');
    }
  }, [router.events]);

  return null; // No need to render a div
};

export default FbPixel;
