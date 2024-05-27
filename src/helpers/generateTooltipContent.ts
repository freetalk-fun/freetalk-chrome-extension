import { DictionaryAPIResponse } from "./freeTalkAPI";

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
  if (data.message) {
    content = `<div style="text-align: center; margin: auto; font-size: 24px; font-weight: 700;">"${selectedText}" is not in the FreeTalk Dictionary</div>`;
  }
  const { term, meanings } = data;
  if (term) {
    content += ` <h3 style="font-size: 22px; margin: 0 0 12px 0; color: black; font-weight: 700;">
    ${term.charAt(0).toUpperCase() + term.slice(1)}
  </h3>`;
  }
  if (meanings && meanings[0]) {
    content += `
        <p style="font-weight: 450; font-size: 16px; color: black; margin: 0;"><b style="color: black;">POS:</b> ${meanings[0].pos}</p>
        <h4 style="font-size: 16px; color: black; margin: 0; font-weight: 700;">Explanation</h4>
        <p style="text-align: left; font-size: 16px; line-height: 1.2; font-weight: 390; color: black; margin: 0;">${meanings[0].definition}</p>`;
  }
  return `<div>
    ${content}
  </div>`;
}
