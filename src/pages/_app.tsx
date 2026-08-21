import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import Layout from "../components/Layout";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>ChessMaster</title>
        <meta name="theme-color" content="#b91c1c" />
        <link rel="icon" href="/app-icon.svg" type="image/svg+xml" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
