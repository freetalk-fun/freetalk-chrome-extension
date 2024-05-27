/* eslint-disable no-restricted-globals */
import * as browser from 'webextension-polyfill'
import { getMeaning } from '../helpers/freeTalkAPI';

browser.runtime.onInstalled.addListener(() => {
    // Initialize message listener
    browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.type === "openPopup") {
        // Open popup
        console.log("ACTION CALLED", message.payload.text);
        console.log(await browser.windows.getAll());
        const result = await getMeaning(message.payload.text);
        console.log(result);
        return result;
      }
    });
  });


export {}
