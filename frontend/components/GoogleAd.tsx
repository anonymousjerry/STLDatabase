///component/googleAd.tsx
"use client"
import { useEffect } from 'react';

export default function GoogleAd() {
  useEffect(() => {
    function tryPush() {
      if (window.adsbygoogle && window.adsbygoogle.push) {
        try {
          window.adsbygoogle.push({});
          console.log("Adsbygoogle pushed");
        } catch (e) {
          console.error("Adsbygoogle push error", e);
        }
      } else {
        console.log("adsbygoogle not ready, retrying...");
        setTimeout(tryPush, 100); // retry after 100ms
      }
    }
    tryPush();
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.DATA_AD_CLIENT}
      data-ad-slot={process.env.DATA_AD_SLOT}
      data-ad-format="auto"
      data-adtest="on"
      data-full-width-responsive="true"
    />
    
  );
}
