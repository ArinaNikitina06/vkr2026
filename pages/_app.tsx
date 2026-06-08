import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { ToastContainer } from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Head>
        <title>EduFlow - персональные рекомендации курсов</title>
        <meta name="description" content="MVP интерфейса персонализированных рекомендаций образовательных курсов." />
      </Head>
      <Component {...pageProps} />
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
      />
    </SessionProvider>
  )
}
