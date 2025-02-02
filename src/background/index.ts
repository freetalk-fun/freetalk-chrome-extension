import * as browsers from 'webextension-polyfill';
// import { DIRECTUS_URL } from "../environment";

// function getData(value: string): Promise<string | undefined> {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.get(["token"], (result) => {
//       if (chrome.runtime.lastError) {
//         return reject(chrome.runtime.lastError);
//       }
//       console.log("Get TOKEN:", result.token);
//       resolve(result.token); // Explicitly resolve with the correct type
//     });
//   });
// }

// export const getMeaning = async (searchWord: string) => {
//   try {
//     const token = await getData("token");
//     const response = await fetch(`${DIRECTUS_URL}/flows/trigger/99c028f4-0581-4323-9921-64ecff032d19`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ term: searchWord }),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching meaning:', error);
//     return;
//   }
// };


export const getMeaning = async (searchWord: string) => {
  try {
    const response = await fetch(`https://api.freetalk.fun/search-term?term=${encodeURIComponent(searchWord)}`, {
      method: 'GET',
      headers: {
        'auth-token': `my-secret-token`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching meaning:', error);
    return { error: 'Failed to fetch meaning' };
  }
};


browsers.runtime.onInstalled.addListener(() => {
    // Initialize message listener
    browsers.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.type === "openPopup") {
        console.log("BG ACTION CALLED", message.payload.text);
        const result = await getMeaning(message.payload.text);
        console.log(result);
        return result;
      }
    });
  });

export {}