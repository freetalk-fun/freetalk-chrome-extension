import * as browser from "webextension-polyfill";
import tippy from "tippy.js";
import next from "../../src/assets/nextarrow.png";
import prev from "../../src/assets/prevarrow.png";

const freetalkClass = document.createElement("style");
const sliderScript = document.createElement("script");

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

  .carousel-wrapper {
    overflow: hidden;
  }
  .carousel-wrapper * {
    box-sizing: border-box;
  }
  .carousel {
    transform-style: preserve-3d;
  }
  .carousel__photo {
    opacity: 0;
    position: absolute;
    top:0;
    width: 100%;
    margin: auto;
    padding: 0 30px;
    z-index: 7000;
    // transition: transform .5s, opacity 1s, z-index .5s;
  }

  .carousel__photo.initial,
  .carousel__photo.active {
    opacity: 1;
    position: relative;
    z-index: 9000;
  }

  .carousel__photo.prev,
  .carousel__photo.next {
    z-index: 8000;
  }

  // .carousel__photo.prev {
  //   transform: translateX(-100%); /* Move 'prev' item to the left */
  // }
  
  // .carousel__photo.next {
  //   transform: translateX(100%); /* Move 'next' item to the right */
  // }
  .carousel__button--prev,
  .carousel__button--next {
    width: 12px;
    cursor: pointer; 
    z-index: 10000;
    padding-top:3px
  }
  .dot {
    height: 10px;
    width: 10px;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;
  }
  .dot.active{
    background-color: #000;
  }

  .elementToFadeInAndOut {
    opacity: 0;
  }

  .fade-in {
    -webkit-animation: fadeIn 1s forwards;
    animation: fadeIn 1s forwards;
  }

  @-webkit-keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

`;

let itemClassName = "carousel__photo";
let dotsClassName = "dot";
let items = document.getElementsByClassName(itemClassName);
let totalItems = items.length;
let slide = 0;
let moving = true;
let dots = document.getElementsByClassName(dotsClassName);

// Set classes
function setInitialClasses() {
  if (totalItems >= 3) {
    if (items[totalItems - 1]) items[totalItems - 1].classList.add("prev");
    if (items[0]) items[0].classList.add("active");
    if (items[1]) items[1].classList.add("next");
  } else if (totalItems === 2) {
    if (items[0]) items[0].classList.add("active");
    if (items[1]) items[1].classList.add("next");
  } else if (totalItems === 1) {
    if (items[0]) items[0].classList.add("active");
  }
}

// Set event listeners
function setEventListeners() {
  const next = document.getElementsByClassName("carousel__button--next")[0];
  const prev = document.getElementsByClassName("carousel__button--prev")[0];
  
  if (next) {
    next.addEventListener("click", moveNext);
  }
  
  if (prev) {
    prev.addEventListener("click", movePrev);
  }
}

// Next navigation handler
function moveNext() {
  // Check if moving
  if (!moving) {
    dots[slide].className = dotsClassName;
    if (slide === totalItems - 1) {
      slide = 0;
    } else {
      slide++;
    }
    dots[slide].className = dotsClassName + " active";
    moveCarouselTo(slide);
    applyFadeInAnimation()
  }
}

// Previous navigation handler
function movePrev() {
  if (!moving) {
    dots[slide].className = dotsClassName;
    if (slide === 0) {
      slide = totalItems - 1;
    } else {
      slide--;
    }
    dots[slide].className = dotsClassName + " active";
    moveCarouselTo(slide);
    applyFadeInAnimation()
  }
}

function applyFadeInAnimation() {
  const elementsToFadeIn = document.querySelectorAll('.carousel__photo .elementToFadeInAndOut');
  elementsToFadeIn.forEach((el, index) => {
    el.classList.remove('fade-in'); // Reset the animation
    //@ts-ignore
    void el.offsetWidth; // Trigger reflow
    //@ts-ignore
    el.classList.add('fade-in');
  });
}

function disableInteraction() {
  // Set 'moving' to true for the same duration as our transition.
  // (0.5s = 500ms)
  moving = true;
  // setTimeout runs its function once after the given time
  setTimeout(function () {
    moving = false;
  }, 500);
}

function moveCarouselTo(slide: number) {
  // Check if carousel is moving, if not, allow interaction
  if (!moving) {
    // temporarily disable interactivity
    disableInteraction();
    // Update the "old" adjacent slides with "new" ones
    var newPrevious = slide - 1,
      newNext = slide + 1,
      oldPrevious = slide - 2 < 0 ? 0 : slide - 2,
      oldNext = slide + 2 >= totalItems ? totalItems - 1 : slide + 2;
    // Test if carousel has more than three items
    if (totalItems > 1) {
      // Checks and updates if the new slides are out of bounds
      if (newPrevious <= 0) {
        oldPrevious = totalItems - 1;
      } else if (newNext >= totalItems - 1) {
        oldNext = 0;
      }

      // Checks and updates if slide is at the beginning/end
      if (slide === 0) {
        newPrevious = totalItems - 1;
        oldPrevious = totalItems - 2;
        oldNext = slide + 1;
      } else if (slide === totalItems - 1) {
        newPrevious = slide - 1;
        newNext = 0;
        oldNext = 1;
      }
      // Now we've worked out where we are and where we're going,
      // by adding/removing classes we'll trigger the transitions.
      // Reset old next/prev elements to default classes
      if (items[oldPrevious]) items[oldPrevious].className = itemClassName;
      if (items[oldNext]) items[oldNext].className = itemClassName;
      // Add new classes
      if (items[newPrevious]) items[newPrevious].className = itemClassName + " prev";
      if (items[slide]) items[slide].className = itemClassName + " active";
      if (items[newNext]) items[newNext].className = itemClassName + " next";
    }
  }
}

function initCarousel() {
  slide = 0;
  items = document.getElementsByClassName(itemClassName);
  dots = document.getElementsByClassName(dotsClassName);
  totalItems = items.length;
  setInitialClasses();
  setEventListeners();
  // Set moving to false so that the carousel becomes interactive
  moving = false;
}

export function generateTooltipContent(data: any) {
  const term = data?.term;
  const meanings = data?.meanings;

  console.log("term within genContent:", term);
  console.log("meanings within genContent:", meanings);

  if (!meanings) {
    return `<div style="text-align: center; margin: auto; font-size: 24px; font-weight: 700;">This is not in the FreeTalk Dictionary!</div>`;;
  }

  let termHeader = "";
  let meaningsHTML = "";
  
  if (term) {
    termHeader += `<h3 style="font-size: 22px; margin: 0 0 12px 0; color: black; font-weight: 700;">
                  ${term.charAt(0).toUpperCase() + term.slice(1)}
                </h3>`;
  }
  
  if (meanings) {
    meanings.forEach((meaning: any, index: number) => {
      meaningsHTML += `
          <div class="carousel__photo ${index === 0 ? "active" : ""}" >
            <div style="display:flex; justify-content: space-between; font-family: Product-Brand-Grotesque-Regular; font-weight:700;">
              ${termHeader}
              <p class="elementToFadeInAndOut fade-in" style="font-size: 16px; color: black; margin: 0; font-family: Product-Brand-Grotesque-Regular; font-weight:700;">${meaning.pos}</p>
            </div>
            <p class="content elementToFadeInAndOut fade-in" style="font-family:Product-Brand-Grotesque-Light;text-align: left; font-size: 16px; line-height: 1.2; font-weight: 390; color: black; margin: 0; padding-top:23px;">${meaning.definition}</p>
          </div>`;
    });
  }
  
  return `<div class="carousel-wrapper">
            <div class="carousel">
              ${meaningsHTML}
              <div style="display: flex; justify-content: center; align-items:center; position: relative; gap:10px; margin-top:10px;" >
              ${meanings && meanings.length > 1 ? `
                <div class="carousel__button--prev"><img src="${prev}" /></div>
                  <div style="display: flex; gap:10px;">
                    ${meanings.map((_: any, index: number) => `<div class="dot ${index === 0 ? "active" : ""}"></div>`).join('')}
                  </div>
                <div class="carousel__button--next"><img src="${next}"/></div>
                ` : ""}
              </div>
            </div>
          </div>`;
}

// ...existing code...

document.querySelector("body")?.addEventListener("dblclick", async (event) => {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  const targetElement = event.target;

  if (
    selection?.type === "Range" &&
    selection.rangeCount > 0 &&
    targetElement &&
    selectedText &&
    selectedText !== ""
  ) {
    // Create a container for the shadow DOM
    const shadowContainer = document.createElement("div");
    shadowContainer.style.position =  "absolute";
    shadowContainer.style.top = "0";
    shadowContainer.style.left = "0";
    shadowContainer.style.width = "100%";
    shadowContainer.style.height = "100%";
    shadowContainer.style.zIndex = "10000";
    document.body.appendChild(shadowContainer);

    // Function to update the tooltip's position
    const updateTooltipPosition = () => {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      // Get mouse coordinates
      const mouseY = event.clientY;
      const mouseX = event.clientX;
      console.log('Mouse Y:', mouseY);
      console.log('Mouse X:', mouseX);
      shadowContainer.style.top = `${mouseY + window.scrollY - 25}px`;
      shadowContainer.style.left = `${mouseX}px`;
      console.log('tooltipElement.style.top:', shadowContainer.style.top);
      console.log('tooltipElement.style.left:', shadowContainer.style.left);
    };

    // Create the shadow root
    const shadowRoot = shadowContainer.attachShadow({ mode: "open" });

    // Apply the popup CSS to the shadow DOM
    const styleElement = document.createElement("style");
    styleElement.textContent = rules;
    shadowRoot.appendChild(styleElement);

    // Create the tooltip element
    const tooltipElement = document.createElement("div");
    tooltipElement.id = "tooltip";
    tooltipElement.style.pointerEvents = "auto";
    tooltipElement.style.position = "absolute"; // Ensure absolute positioning
    shadowRoot.appendChild(tooltipElement);

    try {
      // GET DATA AND TRIGGER TOOLTIP
      const data = await browser.runtime.sendMessage({
        type: "openPopup",
        payload: {
          text: selectedText.toLowerCase(),
        },
      });

      const instance = tippy(tooltipElement, {
        content: generateTooltipContent(data),
        hideOnClick: true,
        interactive: true,
        allowHTML: true,
        theme: "freetalk",
        trigger: "manual",
        onHidden(instance) {
          instance.destroy();
          shadowContainer.remove();
          window.removeEventListener("scroll", updateTooltipPosition);
        },
      });

      // Position the tooltip below the selected text
      updateTooltipPosition();
      instance.show();

      // Add scroll event listener to update the tooltip's position on scroll
      // window.addEventListener("scroll", updateTooltipPosition);
    } catch (error) {
      console.error("Error sending message to background script:", error);
      shadowContainer.remove();
    }
  }

  initCarousel();
});

export {};