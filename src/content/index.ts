import { runtime } from "webextension-polyfill";

document.addEventListener("dblclick", () => {
  runtime.sendMessage({ action: "openPopup" });
});

export {};
