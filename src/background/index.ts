import * as browsers from 'webextension-polyfill';

export const getMeaning = async (searchWord: string) => {
  console.log('API call started for:', searchWord);

  try {
    const response = await fetch(`https://dictionary.freetalk.fun/v3/words/${searchWord}.json`);
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Response data:', data);

    // Validate the response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Return a proper error object that matches expected structure
    return {
      error: `Failed to fetch meaning: ${errorMessage}`,
      term: searchWord,
      meanings: []
    };
  }
};

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.type === "openPopup") {
    getMeaning(message.payload.text)
      .then(result => {
        console.log('Sending result to content script:', result);
        sendResponse(result);
      })
      .catch(error => {
        console.error('Error in getMeaning:', error);
        sendResponse({
          error: 'Failed to get meaning',
          term: message.payload.text,
          meanings: []
        });
      });

    return true; // Keep message channel open for async response
  }
});

export { };