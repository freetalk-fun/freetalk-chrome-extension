import * as browser from "webextension-polyfill";
import tippy from "tippy.js";
import { generateTooltipContentOld } from "../helpers/generateTooltipContent";

const freetalkClass = document.createElement("style");
const sliderScript = document.createElement("script");
// const fontUrl = browser.runtime.getURL('public/Brandon-font/Brandon_Grotesque_Web_Bold.ttf')

sliderScript.textContent = 'console.log("CALEED")';

// document.querySelector("head")?.appendChild(sliderScript);

const rules = `
    .tippy-box[data-theme="freetalk"] {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
    z-index: 100;
    // transition: transform .5s, opacity 1s, z-index .5s;
  }

  .carousel__photo.initial,
  .carousel__photo.active {
    opacity: 1;
    position: relative;
    z-index: 900;
  }

  .carousel__photo.prev,
  .carousel__photo.next {
    z-index: 800;
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
    z-index: 1001;
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
  // Targets the previous, current, and next items
  // This assumes there are at least three items.
  items[totalItems - 1].classList.add("prev");
  items[0].classList.add("active");
  items[1].classList.add("next");
}
// Set event listeners
function setEventListeners() {
  let next = document.getElementsByClassName("carousel__button--next")[0],
    prev = document.getElementsByClassName("carousel__button--prev")[0];
  next.addEventListener("click", moveNext);
  prev.addEventListener("click", movePrev);
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
  console.log("Called", slide);
  // Check if carousel is moving, if not, allow interaction
  if (!moving) {
    // temporarily disable interactivity
    disableInteraction();
    // Update the "old" adjacent slides with "new" ones
    console.log("Moving!");
    var newPrevious = slide - 1,
      newNext = slide + 1,
      oldPrevious = slide - 2 < 0 ? 0 : slide - 2,
      oldNext = slide + 2 >= totalItems ? totalItems - 1 : slide + 2;
    console.log({ oldPrevious, oldNext, newPrevious, newNext, slide });

    // Test if carousel has more than three items
    if (totalItems > 1) {
      // Checks and updates if the new slides are out of bounds
      if (newPrevious <= 0) {
        oldPrevious = totalItems - 1;
      } else if (newNext >= totalItems - 1) {
        oldNext = 0;
      }
      console.log({ oldPrevious, oldNext, newPrevious, newNext, slide });

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
      console.log(items);
      console.log({ oldPrevious, oldNext, newPrevious, newNext, slide });
      items[oldPrevious].className = itemClassName;
      items[oldNext].className = itemClassName;
      // Add new classes
      items[newPrevious].className = itemClassName + " prev";
      items[slide].className = itemClassName + " active";
      items[newNext].className = itemClassName + " next";
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
    const data = await browser.runtime.sendMessage({
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
    initCarousel();
  }
});

export {};
