import * as browser from "webextension-polyfill";
import tippy from "tippy.js";
import next from "../../src/assets/nextarrow.png";
import prev from "../../src/assets/prevarrow.png";

const rules = `
  .tippy-box[data-theme="freetalk"] {
    font-family: Product-Brand-Grotesque-Regular, Roboto, Helvetica, sans-serif;
    background-color: #F9F9F9;
    color: #2E2E2E;
    border: 2px solid #d9d9d9;
    padding: 22px 50px 22px 50px;
    border-radius: 6px;
    min-width: 400px;
    max-width: 100%;
    white-space: normal;
    text-align: left;
    display: block;
    overflow: visible;
    z-index: 10000;
    visibility: visible; /* Ensure the tooltip is visible */
  }

  .carousel__photo {
    display: none; /* Hide all slides by default */
    opacity: 0; /* Ensure hidden slides are not visible */
    position: absolute;
    top: 0;
    width: 100%;
    margin: auto;
    z-index: 7000;
    transition: opacity 0.3s ease-in-out;
  }

  .carousel__photo.active {
    display: block;
    opacity: 1;
    position: relative;
    z-index: 9000;
  }

  .carousel__button--prev,
  .carousel__button--next {
    width: 12px;
    cursor: pointer;
    z-index: 10000;
    padding-top: 3px;
  }

  .dot {
    height: 10px;
    width: 10px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }

  .dot.active {
    background-color: #000;
  }
`;

class Carousel {
  private currentSlide: number = 0;
  private slides: NodeListOf<Element>;
  private dots: NodeListOf<Element>;

  constructor(private shadowRoot: ShadowRoot) {
    this.slides = shadowRoot.querySelectorAll(".carousel__photo");
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
      (slide as HTMLElement).style.display = i === index ? "block" : "none";
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
  const term = data?.term;
  const meanings = data?.meanings;

  if (!meanings || meanings.length === 0) {
    return `<div style="text-align: center; margin: auto; font-size: 24px; font-weight: 700;">This is not in the FreeTalk Dictionary!</div>`;
  }

  let termHeader = "";
  let meaningsHTML = "";

  if (term) {
    termHeader = `<h3 style="font-size: 22px; margin: 0 0 12px 0; color: black; font-weight: 700;">
                    ${term.charAt(0).toUpperCase() + term.slice(1)}
                  </h3>`;
  }

  meanings.forEach((meaning: any, index: number) => {
    meaningsHTML += `
      <div class="carousel__photo" style="display: ${index === 0 ? "block" : "none"};">
        <div style="display:flex; justify-content: space-between; font-family: Product-Brand-Grotesque-Regular; font-weight:700;">
          ${termHeader}
          <p style="font-size: 16px; color: black; margin: 0;">${meaning.pos}</p>
        </div>
        <p style="font-family:Product-Brand-Grotesque-Light;text-align: left; font-size: 16px; line-height: 1.2; font-weight: 390; color: black; margin: 0; padding-top:23px;">${meaning.definition}</p>
      </div>`;
  });

  const tooltipContent = `
    <div class="carousel-wrapper">
      <div class="carousel">
        ${meaningsHTML}
        <div style="display: flex; justify-content: center; align-items:center; position: relative; gap:10px; margin-top:10px;">
          ${meanings.length > 1 ? `
            <div class="carousel__button--prev"><img src="${prev}" /></div>
            <div style="display: flex; gap:10px;">
              ${meanings.map((_: unknown, index: number) => `<div class="dot ${index === 0 ? "active" : ""}"></div>`).join('')}
            </div>
            <div class="carousel__button--next"><img src="${next}"/></div>
          ` : ""}
        </div>
      </div>
    </div>`;

  console.log("Generated tooltip content:", tooltipContent);
  return tooltipContent;
}

document.querySelector("body")?.addEventListener("dblclick", async (event) => {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();

  if (selection?.type === "Range" && selection.rangeCount > 0 && selectedText) {
    const shadowContainer = document.createElement("div");
    shadowContainer.style.position = "absolute";
    shadowContainer.style.top = "0";
    shadowContainer.style.left = "0";
    shadowContainer.style.width = "100%";
    shadowContainer.style.height = "100%";
    shadowContainer.style.zIndex = "10000";
    document.body.appendChild(shadowContainer);

    const updateTooltipPosition = () => {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      shadowContainer.style.top = `${rect.top + window.scrollY - 25}px`;
      shadowContainer.style.left = `${rect.left}px`;
    };

    const shadowRoot = shadowContainer.attachShadow({ mode: "open" });

    const styleElement = document.createElement("style");
    styleElement.textContent = rules;
    shadowRoot.appendChild(styleElement);

    const tooltipElement = document.createElement("div");
    tooltipElement.id = "tooltip";
    tooltipElement.style.pointerEvents = "auto";
    tooltipElement.style.position = "absolute";
    shadowRoot.appendChild(tooltipElement);

    try {
      const data = await browser.runtime.sendMessage({
        type: "openPopup",
        payload: {
          text: selectedText.toLowerCase(),
        },
      });

      console.log("Received data:", data);

      const tooltipHTML = generateTooltipContent(data);

      const instance = tippy(tooltipElement, {
        content: tooltipHTML, // <-- GOOD: set real content at creation
        hideOnClick: true,
        interactive: true,
        allowHTML: true,
        theme: "freetalk",
        trigger: "manual",
        onCreate(instance) {
          updateTooltipPosition();
        },
        onHidden(instance) {
          instance.destroy();
          shadowContainer.remove();
          window.removeEventListener("scroll", updateTooltipPosition);
        },
      });

      instance.show();
      new Carousel(shadowRoot);

      window.addEventListener("scroll", updateTooltipPosition);
    } catch (error) {
      console.error("Error sending message to background script:", error);
      shadowContainer.remove();
    }
  }
});

export { };