import * as browser from "webextension-polyfill";
import tippy from "tippy.js";

const cssRules = [
  {
    selector: '.tippy-box[data-theme="freetalk"]',
    style: {
      fontFamily: 'Roboto, Helvetica, Arial, sans-serif', // Removed Product-Brand-Grotesque-Regular
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
      cursor: 'pointer',
      zIndex: '10000',
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
  // Handle error responses first
  if (data?.error) {
    console.warn('API returned error:', data.error);
    return createErrorContent(selectedWord || "unknown word");
  }

  // Handle missing or invalid data
  if (!data || typeof data !== 'object') {
    console.warn('Invalid data received:', data);
    return createErrorContent(selectedWord || "unknown word");
  }

  const { term, meanings } = data;

  // Use the saved selectedWord if term is undefined (error cases)
  const displayTerm = term || selectedWord || "unknown word";

  // Handle case where meanings is missing or empty
  if (!meanings || !Array.isArray(meanings) || meanings.length === 0) {
    return createErrorContent(displayTerm);
  }

  // Success case - process the meanings
  return createSuccessContent(meanings, displayTerm);
}

// Extract error content creation to separate function
function createErrorContent(displayTerm: string) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    font-size: 15px;
    color: #2E2E2E;
    max-width: 420px;
    line-height: 1.6;
    padding: 0;
    font-family: Roboto, Helvetica, Arial, sans-serif;
  `;

  // Main title matching success content style
  const title = document.createElement("h3");
  title.style.cssText = `
    margin: 0 0 16px 0; 
    font-size: 22px;
    font-weight: 600;
    color: #2E2E2E;
    line-height: 1.2;
  `;
  title.textContent = displayTerm;
  wrapper.appendChild(title);

  // Error message section
  const errorMessage = document.createElement("div");
  errorMessage.style.cssText = `
    margin-bottom: 16px;
    font-size: 15px;
    line-height: 1.5;
    color: #2E2E2E;
    font-weight: 500;
  `;
  errorMessage.textContent = "Word not found in dictionary";
  wrapper.appendChild(errorMessage);

  // Reasons section in connotation style
  const reasonsDiv = document.createElement("div");
  reasonsDiv.style.cssText = `
    margin-bottom: 16px;
    font-size: 13px;
    color: #6B7280;
    font-style: italic;
    padding: 8px 12px;
    background: #F9FAFB;
    border-left: 3px solid #E5E7EB;
    border-radius: 3px;
    line-height: 1.4;
  `;
  reasonsDiv.textContent = `This might be because there's an issue on the server, or "${displayTerm}" isn't in our dictionary yet. We will try to add it soon!`;
  wrapper.appendChild(reasonsDiv);

  return wrapper;
}

// Extract success content creation (your existing carousel logic)
function createSuccessContent(meanings: any[], termToDisplay: string) {
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
        list.style.display = "block";
        setTimeout(() => {
          list.style.opacity = "1";
        }, 10);
        arrow.textContent = "▼";
      } else {
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
      margin-bottom: 16px;
    `;

    // Left side: Term title with audio button
    const titleContainer = document.createElement("div");
    titleContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
    `;

    // Term title - back to original styling
    const title = document.createElement("h3");
    title.textContent = termToDisplay;
    title.style.cssText = `
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #2E2E2E;
      text-transform: capitalize;
      line-height: 1.2;
    `;
    titleContainer.appendChild(title);

    // Add speaker icon if audio is available
    if (meaning.audio_url) {
      const audioButton = document.createElement("button");
      audioButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: #374151;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>`;
      audioButton.title = `Play pronunciation${meaning.ipa ? ': ' + meaning.ipa : ''}`;
      audioButton.style.cssText = `
        background: #F3F4F6;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      `;

      // Preload audio immediately
      const audioUrl = `https://dictionary.freetalk.fun/v3/words/${meaning.audio_url}`;
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      console.log('Preloading audio from:', audioUrl);

      audioButton.addEventListener('mouseenter', () => {
        audioButton.style.background = '#E5E7EB';
      });
      audioButton.addEventListener('mouseleave', () => {
        audioButton.style.background = '#F3F4F6';
      });

      audioButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        audioButton.style.background = '#D1D5DB';
        
        audio.play().catch(error => {
          console.error('Audio playback failed:', error);
          audioButton.style.background = '#FEF2F2';
          audioButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: #DC2626;"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>`;
          setTimeout(() => {
            audioButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: #374151;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>`;
            audioButton.style.background = '#F3F4F6';
          }, 2000);
        });
      });

      audio.addEventListener('ended', () => {
        audioButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: #374151;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>`;
        audioButton.style.background = '#F3F4F6';
      });

      audio.addEventListener('error', () => {
        console.error('Audio failed to load');
        audioButton.style.background = '#FEF2F2';
        audioButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: #DC2626;"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>`;
        setTimeout(() => {
          audioButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="width: 24px; height: 24px; color: #374151;"><path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z"></path><path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z"></path></svg>`;
          audioButton.style.background = '#F3F4F6';
        }, 2000);
      });

      titleContainer.appendChild(audioButton);
    }

    headerDiv.appendChild(titleContainer);

    // Part of speech tags - fixed height and styling
    if (meaning.pos && meaning.pos.length > 0) {
      const posDiv = document.createElement("div");
      posDiv.className = "pos-tags";
      posDiv.style.cssText = `
        display: flex;
        gap: 4px;
        flex-shrink: 0;
        align-items: center;
      `;

      meaning.pos.forEach((pos: string) => {
        const posTag = document.createElement("span");
        posTag.textContent = pos;
        posTag.style.cssText = `
          display: inline-block;
          background: #E5E7EB;
          color: #6B7280;
          padding: 4px 12px;
          border-radius: 14px;
          font-size: 13px;
          font-style: italic;
          font-weight: 500;
          line-height: 1.3;
          height: fit-content;
        `;
        posDiv.appendChild(posTag);
      });

      headerDiv.appendChild(posDiv);
    }

    contentDiv.appendChild(headerDiv);

    // Explanation - made more prominent
    if (meaning.explanation) {
      const explanationDiv = document.createElement("div");
      explanationDiv.className = "explanation";
      explanationDiv.style.cssText = `
        margin-bottom: 16px;
        font-size: 15px;
        line-height: 1.5;
        color: #2E2E2E;
        font-weight: 500;
      `;
      explanationDiv.textContent = meaning.explanation;
      contentDiv.appendChild(explanationDiv);
    }

    // Connotation - made less prominent
    if (meaning.connotation) {
      const connotationDiv = document.createElement("div");
      connotationDiv.className = "connotation";
      connotationDiv.style.cssText = `
        margin-bottom: 16px;
        font-size: 13px;
        color: #6B7280;
        font-style: italic;
        padding: 8px 12px;
        background: #F9FAFB;
        border-left: 3px solid #E5E7EB;
        border-radius: 3px;
        line-height: 1.4;
      `;
      connotationDiv.textContent = meaning.connotation;
      contentDiv.appendChild(connotationDiv);
    }

    // Example sentences - keep existing logic but update styling
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
        font-size: 13px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #4B5563;
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;
      `;

      // Add arrow icon before "Examples:"
      const arrow = document.createElement("span");
      arrow.textContent = "▶";
      arrow.style.cssText = `
        margin-right: 6px;
        font-size: 10px;
        color: #6B7280;
        transition: transform 0.2s ease;
      `;
      examplesTitle.insertBefore(arrow, examplesTitle.firstChild);

      examplesSection.appendChild(examplesTitle);

      const examplesList = document.createElement("ul");
      examplesList.style.cssText = `
        margin: 0;
        padding-left: 16px;
        list-style-type: disc;
        display: none;
        opacity: 0;
        transition: opacity 0.2s ease;
      `;

      exampleSentences.forEach((sentence: string) => {
        const listItem = document.createElement("li");
        listItem.style.cssText = `
          margin-bottom: 6px;
          font-size: 13px;
          line-height: 1.4;
          color: #6B7280;
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

  // Add carousel controls if there are multiple meanings - MUCH cleaner styling
  if (meanings.length > 1) {
    const controls = document.createElement("div");
    controls.className = "carousel__controls";
    controls.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 12px;
      border-top: 1px solid #E5E7EB;
    `;

    // Previous button - cleaner, simpler styling
    const prevBtn = document.createElement("div");
    prevBtn.className = "carousel__button--prev";
    prevBtn.style.cssText = `
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      font-size: 12px;
      user-select: none;
      transition: color 0.2s ease;
    `;
    prevBtn.textContent = "◀";
    prevBtn.title = "Previous meaning";

    // Simple hover effect
    prevBtn.addEventListener('mouseenter', () => {
      prevBtn.style.color = '#6B7280';
    });
    prevBtn.addEventListener('mouseleave', () => {
      prevBtn.style.color = '#9CA3AF';
    });

    controls.appendChild(prevBtn);

    // Dots container - keep existing
    const dotsContainer = document.createElement("div");
    dotsContainer.className = "carousel__dots";
    dotsContainer.style.cssText = `
      display: flex;
      gap: 6px;
      align-items: center;
    `;

    meanings.forEach((_: unknown, index: number) => {
      const dot = document.createElement("div");
      dot.className = "dot";
      if (index === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
    controls.appendChild(dotsContainer);

    // Next button - matching previous button
    const nextBtn = document.createElement("div");
    nextBtn.className = "carousel__button--next";
    nextBtn.style.cssText = `
      width: 32px;
      height: 32px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9CA3AF;
      font-size: 12px;
      user-select: none;
      transition: color 0.2s ease;
    `;
    nextBtn.textContent = "▶";
    nextBtn.title = "Next meaning";

    // Simple hover effect
    nextBtn.addEventListener('mouseenter', () => {
      nextBtn.style.color = '#6B7280';
    });
    nextBtn.addEventListener('mouseleave', () => {
      nextBtn.style.color = '#9CA3AF';
    });

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

      // Reference to cleanup function, set after it's defined
      let cleanupRef: (() => void) | null = null;

      const updateTooltipPosition = () => {
        // Validate selection is still valid before accessing range
        if (!selection || selection.rangeCount === 0) {
          if (cleanupRef) cleanupRef();
          return;
        }
        
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        // Check if the word is scrolled off screen
        const isOffScreen = rect.bottom < 0 || rect.top > window.innerHeight;
        if (isOffScreen && cleanupRef) {
          cleanupRef();
          return;
        }
        
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
          instance.destroy();
          shadowContainer.remove();
          document.removeEventListener("click", handleClickOutside);
          window.removeEventListener("scroll", updateTooltipPosition);
          window.removeEventListener("keydown", handleEsc);
        }
      });

      instance.show();
      new Carousel(shadowRoot);

      // Cleanup function to remove tooltip and all listeners
      const cleanupTooltip = () => {
        shadowContainer.remove();
        document.removeEventListener("click", handleClickOutside);
        window.removeEventListener("keydown", handleEsc);
        window.removeEventListener("scroll", updateTooltipPosition);
      };
      
      // Set cleanup reference for scroll handler to use
      cleanupRef = cleanupTooltip;

      // Handle ESC key
      const handleEsc = (e: KeyboardEvent): void => {
        if (e.key === "Escape") {
          cleanupTooltip();
        }
      };

      // Handle clicks outside the tooltip
      const handleClickOutside = (e: MouseEvent): void => {
        if (!shadowContainer.contains(e.target as Node)) {
          cleanupTooltip();
        }
      };

      // Prevent clicks inside the tooltip from bubbling up
      ["click", "dblclick"].forEach(event =>
        shadowRoot.addEventListener(event, e => e.stopPropagation())
      );

      // Add event listeners
      document.addEventListener("click", handleClickOutside);
      window.addEventListener("keydown", handleEsc);
      window.addEventListener("scroll", updateTooltipPosition);
    } catch (error) {
      console.error("Error sending message to background script:", error);
      shadowContainer.remove();
    }
  }
});

export { };