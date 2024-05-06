/* eslint-disable no-restricted-globals */
import { action, runtime, scripting, tabs, windows } from 'webextension-polyfill'

runtime.onInstalled.addListener(() => {
    // Initialize message listener
    runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "openPopup") {
        // Open popup
        windows.create({
            type: "popup",
            url: 'index.html',
            width: 300,
            height: 300,
            top: Math.round(window.screen.height / 2 - 150),
            left: Math.round(window.screen.width / 2 - 150),
        })
      }
    });
    tabs.onActivated.addListener(async (tab) => {
      const tabId = tab.tabId;
      // Execute content script in the active tab
      await scripting.executeScript({
        target: { tabId: tabId },
        files: ['./static/js/content.js']
      });
    });
  });


export {}
