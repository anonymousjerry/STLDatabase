import { ModalProvider } from '../context/ModalContext';
import { GoogleAdSense } from "next-google-adsense";

import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <GoogleAdSense publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID} />
      <Component {...pageProps} />
    </ModalProvider>
  );
}