import * as browsers from 'webextension-polyfill'
// import { getMeaning } from '../helpers/freeTalkAPI';

// export type Meaning = {
//   definition: string;
//   pos: string;
// };

// export type TermData = {
//   term: string;
//   meanings: Meaning[];
// };

// export type DictionaryAPIResponse = {
//   daily_limit: number;
//   term_data?: TermData;
//   message?: string
// };

export const getMeaning = async (searchWord: string) => {
  try {
      const result = await fetch(`https://api.freetalk.fun/search-term?term=${searchWord}`, {
          method: 'GET',
          headers: {
              "auth-token": "my-secret-token",
          },
      });
      return await result.json();
  } catch (error) {
      console.log(error)
      return;
  }
};

browsers.runtime.onInstalled.addListener(() => {
    // Initialize message listener
    browsers.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.type === "openPopup") {
        // Open popup
        console.log("BG ACTION CALLED", message.payload.text);
        const result = await getMeaning(message.payload.text);
        console.log(result);
        return result;
      }
    });
  });


export {}
