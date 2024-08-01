import { DictionaryAPIResponse } from "./freeTalkAPI";
import next from "../../src/nextarrow.png"
import prev from "../../src/prevarrow.png"

export function generateTooltipContent(
  data: DictionaryAPIResponse | null | undefined,
  selectedText: string
) {
  if (!data) return ``;
  let content = "";
  if (data.message) {
    content = `<div style="text-align: center; margin: auto; font-size: 24px; font-weight: 450;">"${selectedText}" is not in the FreeTalk Dictionary</div>`;
  }
  const { term, meanings } = data;
  if (term) {
    content += `<div style="margin-bottom: 8px;">
        <div style="margin-left: 4px; font-size: 24px; font-weight: 450px;">${term}</div>
      </div>`;
  }
  if (meanings) {
    content += meanings
      .map(
        (meaning) => `
          <div style="display: flex; flex-direction: column; margin-bottom: 4px; margin-left: 4px;">
            <div style="font-weight: 450; font-size: 16px;">${meaning.pos}</div>
            <div style="text-align: left; font-size: 16px; font-weight: 390;">${meaning.definition}</div>
          </div>`
      )
      .join("");
  }
  return `<div style="display: flex; flex-direction: column; align-items: start; text-align: left; background-color: #F9F9F9; padding: 14px; color: #1E1C22; border: 2px solid #D8D8D8; border-radius: 10px;">
      ${content}
    </div>`;
}

export function generateTooltipContentOld(
  data: DictionaryAPIResponse | null | undefined,
  selectedText: string
) {
  if (!data) return ``;
  let content = "";
  let meaningsHTML = "";
  if (data.message) {
    return `<div style="text-align: center; margin: auto; font-size: 24px; font-weight: 700;">"${selectedText}" is not in the FreeTalk Dictionary</div>`;
  }
  const { term, meanings } = data;
  if (term) {
    content += ` <h3 style="font-size: 22px; margin: 0 0 12px 0; color: black; font-weight: 700;">
    ${term.charAt(0).toUpperCase() + term.slice(1)}
  </h3>`;
  }
  if (meanings) {
    meanings.forEach((meaning,index)=>{
      meaningsHTML += `
          <div class="carousel__photo ${index === 0 ? "": ""}" >
            <div  style="display:flex; justify-content: space-between; font-family: 'Product-Brand-Grotesque-Regular'; font-weight:700;">
              ${content}
              <p class="elementToFadeInAndOut fade-in" style="font-size: 16px; color: black; margin: 0; font-family: 'Product-Brand-Grotesque-Regular'; font-weight:700;">${meaning.pos}</p>
            </div>
            <p class="content elementToFadeInAndOut fade-in" style=" font-family: 'Product-Brand-Grotesque-Light';text-align: left; font-size: 16px; line-height: 1.2; font-weight: 390; color: black; margin: 0; padding-top:23px;">${meaning.definition}</p>
          </div>`;
    })
  }
  return `<div class="carousel-wrapper">
    <div class="carousel">
      ${meaningsHTML}
      <div style="display: flex; justify-content: center; align-items:center; position: relative; gap:10px; margin-top:10px;" >
      ${meanings && meanings.length > 1 ? `
        <div class="carousel__button--prev"><img src="${prev}" /></div>
          <div style="display: flex; gap:10px;">
            ${meanings.map((_, index)=>`<div class="dot ${index === 0 ? "active": ""}"></div>`).join('')}
          </div>
        <div class="carousel__button--next"><img src="${next}"/></div>
        ` :""}
      </div>
    </div>
  </div>`;
  // return `<div>
  //   ${content}
  // </div>`;
}
