import Layout from "@/components/layout/Layout";
import "@/styles/globals.css";
import "@/styles/tailwind.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>BudgetBoss</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
