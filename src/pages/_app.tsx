import type { AppProps } from 'next/app'
import '../style/base.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
