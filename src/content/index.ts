import * as browser from "webextension-polyfill";
import tippy from "tippy.js";
import next from "../../src/assets/nextarrow.png";
import prev from "../../src/assets/prevarrow.png";

const cssRules = [
  {
    selector: '.tippy-box[data-theme="freetalk"]',
    style: {
      fontFamily: 'Product-Brand-Grotesque-Regular, Roboto, Helvetica, sans-serif',
      backgroundColor: '#F9F9F9',
      color: '#2E2E2E',
      border: '2px solid #d9d9d9',
      padding: '22px 50px 22px 50px',
      borderRadius: '6px',
      minWidth: '400px',
      maxWidth: '100%',
      whiteSpace: 'normal',
      textAlign: 'left',
      display: 'block',
      overflow: 'visible',
      zIndex: '10000',
      visibility: 'visible',
    },
  },
  {
    selector: '.carousel__content',
    style: {
      display: 'none',
      opacity: '0',
      position: 'absolute',
      top: '0',
      width: '100%',
      margin: 'auto',
      zIndex: '7000',
      transition: 'opacity 0.3s ease-in-out',
    },
  },
  {
    selector: '.carousel__content.active',
    style: {
      display: 'block',
      opacity: '1',
      position: 'relative',
      zIndex: '9000',
    },
  },
  {
    selector: '.carousel__button--prev, .carousel__button--next',
    style: {
      width: '12px',
      cursor: 'pointer',
      zIndex: '10000',
      paddingTop: '3px',
    },
  },
  {
    selector: '.dot',
    style: {
      height: '10px',
      width: '10px',
      backgroundColor: '#bbb',
      borderRadius: '50%',
      display: 'inline-block',
    },
  },
  {
    selector: '.dot.active',
    style: {
      backgroundColor: '#000',
    },
  },
];

// Helper to inject styles into a shadow root
function injectStyles(shadowRoot: ShadowRoot, cssRules: any) {
  const style = document.createElement('style');
  let css = '';
  for (const rule of cssRules) {
    css += `${rule.selector} {`;
    for (const [key, value] of Object.entries(rule.style)) {
      // Convert camelCase to kebab-case
      const kebabKey = key.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
      css += `${kebabKey}: ${value};`;
    }
    css += '}';
  }
  style.textContent = css;
  shadowRoot.appendChild(style);
}

class Carousel {
  private currentSlide: number = 0;
  private slides: NodeListOf<Element>;
  private dots: NodeListOf<Element>;

  constructor(private shadowRoot: ShadowRoot) {
    this.slides = shadowRoot.querySelectorAll(".carousel__content");
    this.dots = shadowRoot.querySelectorAll(".dot");

    console.log("Slides found:", this.slides);
    console.log("Dots found:", this.dots);

    this.init();
  }

  private init() {
    this.showSlide(this.currentSlide);

    const nextButton = this.shadowRoot.querySelector(".carousel__button--next");
    const prevButton = this.shadowRoot.querySelector(".carousel__button--prev");

    nextButton?.addEventListener("click", () => this.nextSlide());
    prevButton?.addEventListener("click", () => this.prevSlide());
  }
  private showSlide(index: number) {
    this.slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    this.dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  private nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.showSlide(this.currentSlide);
  }

  private prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.showSlide(this.currentSlide);
  }
}

export function generateTooltipContent(data: any, selectedWord?: string) {
  const { term, meanings } = data;

  // Use the saved selectedWord if term is undefined (error cases)
  const displayTerm = term || selectedWord || "unknown word";

  if (!meanings || meanings.length === 0) {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      font-size: 15px;
      color: #1f2937;
      max-width: 420px;
      line-height: 1.6;
      padding: 4px 0;
      font-family: 'Product-Brand-Grotesque-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // Main title - professional styling
    const title = document.createElement("h3");
    title.style.cssText = `
      margin: 0 0 20px 0; 
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      line-height: 1.3;
      letter-spacing: -0.025em;
    `;
    title.textContent = `Cannot find "${displayTerm}" in our dictionary.`;
    wrapper.appendChild(title);

    // Reasons section - refined typography
    const reasonsTitle = document.createElement("p");
    reasonsTitle.style.cssText = `
      margin: 0 0 10px 0;
      font-size: 14px;
      font-weight: 600;
      color: #4b5563;
      letter-spacing: -0.01em;
    `;
    reasonsTitle.textContent = "This might be because:";
    wrapper.appendChild(reasonsTitle);

    const reasonsList = document.createElement("ul");
    reasonsList.style.cssText = `
      margin: 0 0 24px 0;
      padding-left: 18px;
      color: #6b7280;
      font-size: 14px;
      line-height: 1.5;
    `;

    const reason1 = document.createElement("li");
    reason1.style.cssText = `
      margin-bottom: 6px;
      font-weight: 400;
    `;
    reason1.textContent = "There's an issue on the server. Try in a few minutes!";
    reasonsList.appendChild(reason1);

    const reason2 = document.createElement("li");
    reason2.style.cssText = `
      margin-bottom: 6px;
      font-weight: 400;
    `;
    reason2.textContent = `The term "${displayTerm}" isn't in our dictionary yet.`;
    reasonsList.appendChild(reason2);

    wrapper.appendChild(reasonsList);

    // Call to action - professional styling
    const suggestion = document.createElement("p");
    suggestion.style.cssText = `
      margin: 0;
      color: #4b5563;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 400;
    `;
    suggestion.innerHTML = `Know this word? <a href="https://github.com/freetalk-fun/freetalk-dictionary-v2/issues" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500; border-bottom: 1px solid #2563eb; padding-bottom: 1px; transition: all 0.2s ease;">Make an issue on GitHub</a> and we'll add it.`;
    wrapper.appendChild(suggestion);

    return wrapper;
  }

  // Use displayTerm for the main content too
  const termToDisplay = term || displayTerm;

  // Shared state for examples toggle across all meanings
  let examplesOpen = false;
  const allExamplesSections: { list: HTMLElement, arrow: HTMLElement }[] = [];

  // Main wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "carousel-wrapper";

  // Carousel container
  const carousel = document.createElement("div");
  carousel.className = "carousel";
  wrapper.appendChild(carousel);

  // Function to toggle all examples sections
  const toggleAllExamples = () => {
    examplesOpen = !examplesOpen;

    allExamplesSections.forEach(({ list, arrow }) => {
      if (examplesOpen) {
        // Open examples
        list.style.display = "block";
        setTimeout(() => {
          list.style.opacity = "1";
        }, 10);
        arrow.textContent = "▼";
      } else {
        // Close examples
        list.style.opacity = "0";
        setTimeout(() => {
          list.style.display = "none";
        }, 200);
        arrow.textContent = "▶";
      }
    });
  };

  // Create carousel items for each meaning
  meanings.forEach((meaning: any, index: number) => {
    const contentDiv = document.createElement("div");
    contentDiv.className = "carousel__content";
    if (index === 0) contentDiv.classList.add("active");

    // Header section with term and part of speech
    const headerDiv = document.createElement("div");
    headerDiv.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 20px;
    `;

    // Term title
    const title = document.createElement("h3");
    title.textContent = termToDisplay; // Use termToDisplay instead of term
    title.style.cssText = `
      margin: 0;
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
      text-transform: capitalize;
    `;
    headerDiv.appendChild(title);

    // Part of speech tags (if available)
    if (meaning.pos && meaning.pos.length > 0) {
      const posDiv = document.createElement("div");
      posDiv.className = "pos-tags";
      posDiv.style.cssText = `
        display: flex;
        gap: 6px;
        flex-shrink: 0;
      `;

      meaning.pos.forEach((pos: string) => {
        const posTag = document.createElement("span");
        posTag.textContent = pos;
        posTag.style.cssText = `
          display: inline-block;
          background: #d1d5db;
          color: #374151;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 12px;
          font-style: italic;
          font-weight: 500;
        `;
        posDiv.appendChild(posTag);
      });

      headerDiv.appendChild(posDiv);
    }

    contentDiv.appendChild(headerDiv);

    // Explanation
    if (meaning.explanation) {
      const explanationDiv = document.createElement("div");
      explanationDiv.className = "explanation";
      explanationDiv.style.cssText = `
        margin-bottom: 16px;
        font-size: 16px;
        line-height: 1.5;
        color: #1f2937;
      `;
      explanationDiv.textContent = meaning.explanation;
      contentDiv.appendChild(explanationDiv);
    }

    // Connotation
    if (meaning.connotation) {
      const connotationDiv = document.createElement("div");
      connotationDiv.className = "connotation";
      connotationDiv.style.cssText = `
        margin-bottom: 20px;
        font-size: 14px;
        color: #6b7280;
        font-style: italic;
        padding: 12px 16px;
        background: #f3f4f6;
        border-left: 4px solid #d1d5db;
        border-radius: 4px;
        line-height: 1.4;
      `;
      connotationDiv.textContent = meaning.connotation;
      contentDiv.appendChild(connotationDiv);
    }

    // Example sentences
    const exampleSentences = [];
    for (let i = 1; i <= 6; i++) {
      const sentence = meaning[`s${i}`];
      if (sentence) {
        exampleSentences.push(sentence);
      }
    }

    if (exampleSentences.length > 0) {
      const examplesSection = document.createElement("div");
      examplesSection.style.cssText = `
        margin-top: 16px;
      `;

      const examplesTitle = document.createElement("h4");
      examplesTitle.textContent = "Examples:";
      examplesTitle.style.cssText = `
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #374151;
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
      `;

      // Add arrow icon before "Examples:"
      const arrow = document.createElement("span");
      arrow.textContent = "▶"; // Start with right arrow (closed)
      arrow.style.cssText = `
        margin-right: 8px;
        font-size: 12px;
        color: #6b7280;
        transition: transform 0.2s ease;
      `;
      examplesTitle.insertBefore(arrow, examplesTitle.firstChild);

      examplesSection.appendChild(examplesTitle);

      const examplesList = document.createElement("ul");
      examplesList.style.cssText = `
        margin: 0;
        padding-left: 20px;
        list-style-type: disc;
        display: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;

      exampleSentences.forEach((sentence: string) => {
        const listItem = document.createElement("li");
        listItem.style.cssText = `
          margin-bottom: 8px;
          font-size: 14px;
          line-height: 1.4;
          color: #4b5563;
        `;
        listItem.textContent = sentence;
        examplesList.appendChild(listItem);
      });

      examplesSection.appendChild(examplesList);

      // Store reference to this examples section
      allExamplesSections.push({ list: examplesList, arrow });

      // Add click handler that toggles ALL examples sections
      examplesTitle.addEventListener("click", toggleAllExamples);

      contentDiv.appendChild(examplesSection);
    }

    carousel.appendChild(contentDiv);
  });

  // Add carousel controls if there are multiple meanings
  if (meanings.length > 1) {
    const controls = document.createElement("div");
    controls.className = "carousel__controls";
    controls.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    `;

    // Previous button
    const prevBtn = document.createElement("div");
    prevBtn.className = "carousel__button--prev";
    const prevImg = document.createElement("img");
    prevImg.src = prev;
    prevBtn.appendChild(prevImg);
    controls.appendChild(prevBtn);

    // Dots container
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "carousel__dots";
    dotsContainer.style.cssText = `
      display: flex;
      gap: 8px;
      align-items: center;
    `;

    meanings.forEach((_: unknown, index: number) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (index === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
    controls.appendChild(dotsContainer);

    // Next button
    const nextBtn = document.createElement("div");
    nextBtn.className = "carousel__button--next";
    const nextImg = document.createElement("img");
    nextImg.src = next;
    nextBtn.appendChild(nextImg);
    controls.appendChild(nextBtn);

    carousel.appendChild(controls);
  }

  console.log("Generated tooltip content (DOM):", wrapper);
  return wrapper;
}

document.addEventListener("dblclick", async (event) => {
  // Check state fresh each time - this is the ONLY place we check
  try {
    const result = await chrome.storage.local.get(['dictionaryEnabled']);
    const isEnabled = result.dictionaryEnabled !== false;

    if (!isEnabled) {
      console.log('Dictionary disabled, skipping tooltip');
      return;
    }
  } catch (error) {
    console.log('Storage check failed, defaulting to enabled');
    // Continue with tooltip if storage fails
  }

  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (selection?.type === "Range" && selection.rangeCount > 0 && selectedText) {
    // Save the selected word for error cases
    const savedWord = selectedText.toLowerCase();

    // Create Shadow DOM add CSS
    const shadowContainer = document.createElement("div");
    shadowContainer.id = "freetalk-tooltip-anchor"; // Not sure I need this?
    shadowContainer.style.position = "absolute";
    shadowContainer.style.zIndex = "10000";
    document.body.appendChild(shadowContainer);
    const shadowRoot = shadowContainer.attachShadow({ mode: "open" });
    injectStyles(shadowRoot, cssRules);

    // Add Tooltip's anchor div
    const tooltipElement = document.createElement("div");
    tooltipElement.id = "tooltip";
    tooltipElement.style.position = "absolute";
    shadowRoot.appendChild(tooltipElement);

    // Add Tooltip
    try {
      const data = await browser.runtime.sendMessage({
        type: "openPopup",
        payload: {
          text: savedWord,
        },
      });

      console.log("Received data:", data);

      // Pass the saved word to generateTooltipContent
      const tooltipHTML = generateTooltipContent(data, savedWord);

      const updateTooltipPosition = () => {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        shadowContainer.style.top = `${rect.top + window.scrollY - 25}px`;
        shadowContainer.style.left = `${rect.left}px`;
      };

      const instance = tippy(tooltipElement, {
        content: tooltipHTML,
        hideOnClick: true,
        trigger: "click",
        interactive: true,
        allowHTML: true,
        theme: "freetalk",
        onCreate(instance) {
          updateTooltipPosition();
        },
        onHidden(instance) {
          // instance.destroy();
          shadowContainer.remove();
          window.removeEventListener("scroll", updateTooltipPosition);
          window.removeEventListener("keydown", handleEsc);
        }
      });

      instance.show();
      new Carousel(shadowRoot);

      // ...inside your try block, after showing the tooltip...
      const handleEsc = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          shadowContainer.remove();
          window.removeEventListener("keydown", handleEsc);
          window.removeEventListener("scroll", updateTooltipPosition);
        }
      };

      // Add this to prevent clicks inside the tooltip from bubbling up
      const preventTooltipClickPropagation = (shadowRoot: ShadowRoot): void => {
        ["click", "dblclick"].forEach(event =>
          shadowRoot.addEventListener(event, e => e.stopPropagation())
        );
      };

      preventTooltipClickPropagation(shadowRoot);

      document.addEventListener("click", () => { shadowContainer.remove() });
      window.addEventListener("keydown", handleEsc);
      window.addEventListener("scroll", updateTooltipPosition);
      // window.addEventListener("click", handleClickOutside);
    } catch (error) {
      console.error("Error sending message to background script:", error);
      shadowContainer.remove();
    }
  }
});

export { };