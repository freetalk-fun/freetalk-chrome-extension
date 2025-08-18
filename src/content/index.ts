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

export function generateTooltipContent(data: any) {
  console.log(data);

  const term = data?.term;
  const meanings = data?.meanings;

  // word not found 
  if (!meanings || meanings.length === 0) {
    const notFoundDiv = document.createElement("div");
    notFoundDiv.style.textAlign = "center";
    notFoundDiv.style.margin = "auto";
    notFoundDiv.style.fontSize = "24px";
    notFoundDiv.style.fontWeight = "700";
    notFoundDiv.textContent = "This is not in the FreeTalk Dictionary!";
    return notFoundDiv;
  }

  // Carousel wrapper
  const wrapper = document.createElement("div");
  wrapper.className = "carousel-wrapper";
  wrapper.style.fontFamily = "Product-Brand-Grotesque, Roboto, Helvetica, Arial, sans-serif";


  // Carousel
  const carousel = document.createElement("div");
  carousel.className = "carousel";
  wrapper.appendChild(carousel);

  // Slides
  meanings.forEach((meaning: any, index: number) => {
    const slide = document.createElement("div");
    slide.className = "carousel__content";
    if (index === 0) slide.classList.add("active");

    // Header row
    const headerRow = document.createElement("div");
    headerRow.style.display = "flex";
    headerRow.style.justifyContent = "space-between";
    headerRow.style.fontWeight = "700";

    if (term) {
      const termHeader = document.createElement("h3");
      termHeader.style.fontSize = "22px";
      termHeader.style.margin = "0 0 12px 0";
      termHeader.style.color = "black";
      termHeader.style.fontWeight = "700";
      termHeader.textContent = term.charAt(0).toUpperCase() + term.slice(1);
      headerRow.appendChild(termHeader);
    }

    const pos = document.createElement("p");
    pos.style.fontSize = "16px";
    pos.style.color = "black";
    pos.style.margin = "0";
    pos.textContent = meaning.pos;
    headerRow.appendChild(pos);

    slide.appendChild(headerRow);

    // Definition
    const def = document.createElement("p");
    def.style.textAlign = "left";
    def.style.fontSize = "16px";
    def.style.lineHeight = "1.2";
    def.style.fontWeight = "390";
    def.style.color = "black";
    def.style.margin = "0";
    def.style.paddingTop = "23px";
    def.textContent = meaning.definition;
    slide.appendChild(def);

    carousel.appendChild(slide);
  });

  // Controls (if more than one meaning)
  if (meanings.length > 1) {
    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.justifyContent = "center";
    controls.style.alignItems = "center";
    controls.style.position = "relative";
    controls.style.gap = "10px";
    controls.style.marginTop = "10px";

    // Prev button
    const prevBtn = document.createElement("div");
    prevBtn.className = "carousel__button--prev";
    const prevImg = document.createElement("img");
    prevImg.src = prev;
    prevBtn.appendChild(prevImg);
    controls.appendChild(prevBtn);

    // Dots
    const dotsContainer = document.createElement("div");
    dotsContainer.style.display = "flex";
    dotsContainer.style.gap = "10px";
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



document.querySelector("body")?.addEventListener("dblclick", async (event) => {


  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (selection?.type === "Range" && selection.rangeCount > 0 && selectedText) {

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
          text: selectedText.toLowerCase(),
        },
      });

      console.log("Received data:", data);

      const tooltipHTML = generateTooltipContent(data);

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