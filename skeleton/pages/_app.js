import '@/styles/globals.css'
import '../styles/tailwind.css'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
//By default, Next.js will automatically import the _app.js file for every page in your application.

