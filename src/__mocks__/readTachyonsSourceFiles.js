function readSourceFiles() {
  return [
    {
      fileName: "no-underscore-file.css",
      content: ".foo { display: block; }"
    },
    {
      fileName: "_two-classes.css",
      content: `
        .bar { display: none; }
        .bar--2 { display: none !important; }
      `
    },
    {
      fileName: "_two-selectors.css",
      content: `
        .one, .two { display: none; }
      `
    },
    {
      fileName: "_with-media-query.css",
      content: `
      .f7 { font-size: .75rem; }

      @media (--breakpoint-not-small){
        .f-6-ns,
        .f-headline-ns { font-size: 6rem; }
      }
    `
    },
    {
      fileName: "_box-sizing.css",
      content: `
      html,
      .border-box {
        box-sizing: border-box;
      }
      `
    },
    {
      fileName: "_pseudo-selectors.css",
      content: `
      .stripe-light:nth-child(odd) {
        background-color: var(--white-10);
      }

      .stripe-dark:nth-child(odd) {
        background-color: var(--black-10);
      }
      `
    }
  ];
}

module.exports = readSourceFiles;
