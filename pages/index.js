import Head from "next/head";
import DaniHome from "../danielas-home.jsx";

export default function Page() {
  return (
    <>
      <Head>
        <title>Daniela&apos;s Home</title>
        <meta
          name="description"
          content="A cozy pixel-art home game for Daniela — explore rooms, play mini-games, and decorate your world!"
        />
        <meta property="og:title" content="Daniela's Home" />
        <meta
          property="og:description"
          content="A cozy pixel-art home game for Daniela — explore rooms, play mini-games, and decorate your world!"
        />
      </Head>
      <DaniHome />
    </>
  );
}
