import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Clone Contests",
    imageUrl: "img/demos/clone.gif",
    description: (
      <>
        Automatically clone sample testcases and create source files preloaded with your favorite
        template,
      </>
    ),
    to: "docs/clone"
  },
  {
    title: "Test",
    imageUrl: "img/demos/test_wa.gif",
    description: (
      <>
        Test your code against sample testcases quickly and with a pretty output.
        <br />
        Supported Veredicts: <b>AC, WA, TLE, RTE, CE</b>
      </>
    ),
    to: "docs/test"
  },
  {
    title: "Debug",
    imageUrl: "img/demos/debug_keyboard.gif",
    description: (
      <>
        Run code with your own debugging flags easily. Input can be from the keyboard or from a test
        case file.
      </>
    ),
    to: "docs/debug"
  },
  {
    title: "Add Test Cases",
    imageUrl: "img/demos/add-test-case.gif",
    description: (
      <>
        Add a test case for the specified source code file. It will prompt you for the input and the
        expected output
      </>
    ),
    to: "docs/add-test-case"
  },
  {
    title: "Submit",
    imageUrl: "img/demos/submit.gif",
    description: (
      <>Submit your code to online judges pretty fast by just running a single command.</>
    ),
    to: "docs/submit"
  },
  {
    title: "Create Files With Template",
    imageUrl: "img/demos/create.gif",
    description: <>Create source files with the corresponding template loaded</>,
    to: "docs/create"
  },
  {
    title: "Flat File Structure",
    imageUrl: "img/demos/flat-file-structure.gif",
    description: (
      <>
        Having a flat file structure gives us <b>speed!</b>. See{" "}
        <a href="/docs/clone#why-flat-file-structure">Why Flat File Structure?</a>.
      </>
    ),
    to: "/docs/clone#why-flat-file-structure"
  },
  {
    title: "Vim Plugin",
    imageUrl: "img/vim-icon.png",
    description: (
      <>
        Vim users can install{" "}
        <Link to="https://github.com/searleser97/cpbooster.vim">cpbooster.vim</Link> plugin to boost
        their speed even more.
      </>
    ),
    to: "https://github.com/searleser97/cpbooster.vim",
    className: styles.vim_img
  }
  //{
  //title: "Neovim Plugin",
  //imageUrl: "img/nvim-icon.png",
  //description: (
  //<>
  //Vim users can install{" "}
  //<Link to="https://github.com/searleser97/cpbooster.vim">cpbooster.vim</Link> plugin to boost
  //their speed even more.
  //</>
  //),
  //to: "https://github.com/searleser97/cpbooster.vim"
  //}
];

function Feature({ imageUrl, title, description, to, className }) {
  const imgUrl = useBaseUrl(imageUrl);
  const toUrl = useBaseUrl(to);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className={clsx("text--center")}>
          <a href={toUrl}>
            <img className={clsx(className)} src={imgUrl} alt={title} />
          </a>
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout description={`${siteConfig.title}`}>
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className={clsx("featuresRow_src-pages- row", styles.container)}>
          <div className={clsx("col col--4")}>
            <h1 className={clsx(styles.boldInGreen, styles.title, "hero__title")}>
              <b>cpb</b>ooster
            </h1>
            <p className={clsx(styles.boldInGreen, styles.subtitle, "hero__subtitle")}>
              <b>C</b>ompetitive
              <br />
              <b>P</b>rogramming
              <br />
              <b>B</b>ooster
            </p>
            <div className={styles.buttons}>
              <Link className={clsx(styles.getStartedButton)} to={useBaseUrl("docs/About")}>
                Get Started
              </Link>
            </div>
          </div>
          <div className={clsx("text--center", "col col--6", styles.demo_gif)}>
            <img src="https://searleser97.gitlab.io/competitive-programming-notes/cpbooster/cpbooster.gif" />
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className={clsx(styles.featuresRow, "row")}>
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
