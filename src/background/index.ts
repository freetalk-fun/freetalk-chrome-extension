import * as browsers from 'webextension-polyfill';
// import { DIRECTUS_URL } from "../environment";

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

browsers.runtime.onMessage.addListener((message) => {
  if (message.type === "openPopup") {
    console.log("BG ACTION CALLED", message.payload.text);
    return getMeaning(message.payload.text);
  }
});


export { }