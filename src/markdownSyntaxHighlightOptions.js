const Prism = require("prismjs");
const PrismLoader = require("prismjs/components/index.js");
const PrismAlias = require("./PrismNormalizeAlias");
const HighlightLinesGroup = require("./HighlightLinesGroup");

module.exports = function(options = {}) {
  return function(str, language) {
    if(!language) {
      // empty string means defer to the upstream escaping code built into markdown lib.
      return "";
    }

    let split = language.split("/");
    if( split.length ) {
      language = split.shift();
    }

    let html;
    if(language === "text") {
      html = str;
    } else {
      let alias = PrismAlias(language);
      if(!Prism.languages[ alias ]) {
        PrismLoader(alias);
      }
      html = Prism.highlight(str, Prism.languages[ alias ], language);
    }

    let hasHighlightNumbers = split.length > 0;
    let highlights = new HighlightLinesGroup(split.join("/"), "/");
    let lines = html.split("\n").slice(0, -1); // The last line is empty.

    lines = lines.map(function(line, j) {
      if(options.alwaysWrapLineHighlights || hasHighlightNumbers) {
        let lineContent = highlights.getLineMarkup(j, line);
        return lineContent;
      }
      return line;
    });

    return `<pre class="language-${language}"><code class="language-${language}">${lines.join("<br>")}</code></pre>`;
  };
};
