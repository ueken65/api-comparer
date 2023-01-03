import type { AppProps } from 'next/app'
import Script from 'next/script'
import '../style/base.css'

const GA_TRACKING_ID = 'G-F49QZWH4ST'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script async strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        strategy="afterInteractive"
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
        }}
      ></Script>
      <Component {...pageProps} />
    </>
  )
}
