/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: "cpbooster",
  tagline: "Competitive Programming Booster",
  url: "https://searleser97.io",
  baseUrl: "/cpbooster/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "searleser97", // Usually your GitHub org/user name.
  projectName: "cpbooster", // Usually your repo name.
  themeConfig: {
    colorMode: {
      defaultMode: "dark"
    },
    navbar: {
      title: "cpbooster",
      items: [
        {
          type: "doc",
          position: "left",
          docId: "about",
          label: "Docs"
        },
        {
          href: "https://github.com/searleser97/cpbooster",
          position: "right",
          className: "header-github-link"
        }
      ]
    },
    footer: {
      style: "dark",
      copyright: `Copyright © ${new Date().getFullYear()} cpbooster. Built with Docusaurus.`
    }
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/facebook/docusaurus/edit/master/website/"
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/facebook/docusaurus/edit/master/website/blog/"
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],
  headTags: [
    {
      tagName: "script",
      attributes: {
        async: "1",
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5705416960449352",
        crossorigin: "anonymous"
      }
    }
  ]
};
