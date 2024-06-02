'use client'

import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import FacebookPixel from 'react-facebook-pixel';


const FbPixel = () => {
    const router = useRouter();
    useEffect(() => {
        if (typeof window !== 'undefined') {
          console.log('Window is defined');
          const pixelId = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;
          console.log('Pixel ID:', pixelId);
          if (pixelId) {
            FacebookPixel.init(pixelId);
            FacebookPixel.pageView();
      
            const handleRouteChange = () => {
              console.log('Route changed, tracking page view');
              FacebookPixel.pageView();
            };
      
            router.events.on('routeChangeComplete', handleRouteChange);
            return () => {
              router.events.off('routeChangeComplete', handleRouteChange);
            };
          } else {
            console.error('Facebook Pixel ID is not defined');
          }
        } else {
          console.log('Window is undefined');
        }
      }, [router.events]);
  return (
    <div>
      
    </div>
  )
}

export default FbPixel
