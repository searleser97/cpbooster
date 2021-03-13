import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: "Clone Test Cases Automatically",
    imageUrl: "img/undraw_docusaurus_mountain.svg",
    description: (
      <>
        Automatically clone sample testcases files with corresponding source code files with
        template loaded into a desired directory
      </>
    )
  },

  {
    title: "Create Files With Template",
    imageUrl: "img/undraw_docusaurus_tree.svg",
    description: <>Create source files with the corresponding template loaded</>
  },
  {
    title: "Test",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        Test your code against sample testcases quickly and with a pretty output.
        <br />
        Supported Veredicts: <b>AC, WA, TLE, RTE, CE</b>
      </>
    )
  },
  {
    title: "Debug",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        Run code with your own debugging flags easily. Input can be from the keyboard or from a test
        case file.
      </>
    )
  },
  {
    title: "Add Test Cases",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        Add a test case for the specified source code file. It will prompt you for the input and the
        expected output
      </>
    )
  },
  {
    title: "Submit",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>Submit your code to online judges pretty fast by just running a single command.</>
    )
  },
  {
    title: "Vim Plugin",
    imageUrl: "img/undraw_docusaurus_react.svg",
    description: (
      <>
        Vim users can install{" "}
        <Link to="https://github.com/searleser97/cpbooster.vim">cpbooster.vim</Link> plugin to boost
        their speed even more.
      </>
    )
  }
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
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
    <Layout title={`${siteConfig.title}`} description="Competitive Programming Booster">
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <h1 className={clsx(styles.boldInGreen, styles.title, "hero__title")}>
            <b>cpb</b>ooster
          </h1>
          <p className={clsx(styles.boldInGreen, styles.subtitle, "hero__subtitle")}>
            <b>C</b>ompetitive <b>P</b>rogramming <b>B</b>ooster
          </p>
          <div className={styles.buttons}>
            <Link className={clsx(styles.getStartedButton)} to={useBaseUrl("docs/")}>
              Get Started
            </Link>
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
