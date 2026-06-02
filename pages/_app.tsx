import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>EduFlow - персональные рекомендации курсов</title>
        <meta name="description" content="MVP интерфейса персонализированных рекомендаций образовательных курсов." />
      </Head>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
