import { runtime } from "webextension-polyfill";
import tippy from "tippy.js";
import { generateTooltipContentOld } from "../helpers/generateTooltipContent";

const freetalkClass = document.createElement("style");

const rules = `
    .tippy-box[data-theme="freetalk"] {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #F9F9F9;
      color: #2E2E2E;
      border: 2px solid #d9d9d9;
      padding: 10px;
      border-radius: 6px;
      min-width: 400px;
      max-width: 100%;
      white-space: normal;
      text-align: left;
    }

    /* Resetting default browser styles */
    .tippy-toolbox div, .tippy-toolbox span, .tippy-toolbox h1, .tippy-toolbox h2, .tippy-toolbox h3, .tippy-toolbox h4, .tippy-toolbox h5, .tippy-toolbox h6, .tippy-toolbox p, .tippy-toolbox blockquote, .tippy-toolbox pre,
    .tippy-toolbox a, .tippy-toolbox img, .tippy-toolbox strong, .tippy-toolbox sub, .tippy-toolbox sup, .tippy-toolbox b, .tippy-toolbox u, .tippy-toolbox i, .tippy-toolbox ol, .tippy-toolbox ul, .tippy-toolbox li,
    .tippy-toolbox form, .tippy-toolbox label,
    .tippy-toolbox tbody, .tippy-toolbox tfoot, .tippy-toolbox thead, .tippy-toolbox tr, .tippy-toolbox th, .tippy-toolbox td {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
      line-height:1;
  }

  .tippy-toolbox ol, .tippy-toolbox ul {
      list-style: none;
  }

  .tippy-toolbox blockquote, .tippy-toolbox q {
      quotes: none;
  }

  .tippy-toolbox blockquote:before, .tippy-toolbox blockquote:after,
  .tippy-toolbox q:before, .tippy-toolbox q:after {
      content: '';
      content: none;
  }

  .tippy-toolbox table {
      border-collapse: collapse;
      border-spacing: 0;
  }

  .tippy-toolbox h1, h2, h3, h4 {
    font-weight: 700;
  }
`;

document.querySelector("body")?.addEventListener("dblclick", async (event) => {
  const selection = document.getSelection();
  const selectedText = document.getSelection()?.toString().trim();

  console.log("Called", event, selection);
  const targetElement = event.target;

  if (
    selection?.type === "Range" &&
    targetElement &&
    selectedText &&
    selectedText !== ""
  ) {
    if (freetalkClass.textContent) {
      freetalkClass.textContent = rules;
    } else {
      freetalkClass.appendChild(document.createTextNode(rules));
    }
    console.log(freetalkClass);
    document.body.appendChild(freetalkClass);
    //@ts-ignore
    const innerHTML = targetElement.innerHTML;
    console.log(innerHTML);
    const highlightedHTML = innerHTML.replace(
      new RegExp(`(${selectedText})`, "gi"),
      '<span id="tooltip" style="width:auto;">$1</span>'
    );
    //@ts-ignore
    targetElement.innerHTML = highlightedHTML;
    const data = await runtime.sendMessage({
      type: "openPopup",
      payload: {
        text: selectedText,
      },
    });
    console.log(data);

    const instance = tippy("#tooltip", {
      content: generateTooltipContentOld(data, selectedText),
      hideOnClick: true,
      interactive: true,
      allowHTML: true,
      theme: "freetalk",
      trigger: "manual",
      onHidden(instance) {
        instance.destroy();
        let tooltipEl = document.getElementById("tooltip");
        let parentEl = tooltipEl?.parentElement;

        let spanText = tooltipEl?.textContent;

        parentEl?.replaceChild(
          document.createTextNode(spanText ?? ""),
          tooltipEl!
        );
      },
    });
    instance[0].show();
  }
});

export {};
