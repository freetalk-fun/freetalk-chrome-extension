import * as browsers from 'webextension-polyfill'
import { getMeaning } from '../helpers/freeTalkAPI';

browsers.runtime.onInstalled.addListener(() => {
    // Initialize message listener
    browsers.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
      if (message.type === "openPopup") {
        // Open popup
        console.log("ACTION CALLED", message.payload.text);
        // browsers.tabs.query({
        //   active: true, currentWindow: true,
        // }).then((tabs)=>{
        //   browsers.tabs.executeScript(tabs[0].id!, {
        //     code:"console.log('Finalllyyy!!!')"
        //   })
        // })
        // console.log(await browsers.windows.getAll());
        const result = await getMeaning(message.payload.text);
        console.log(result);
        // Open popup
        // browsers.browserAction.openPopup();
        return result;
      }
    });
  });


export {}
