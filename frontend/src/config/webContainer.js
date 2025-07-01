import { WebContainer } from "@webcontainer/api";

let webContainerInstance = null;
let bootPromise = null;

export const getWebContainer = async () => {
  // Already initialized
  if (webContainerInstance) {
    return webContainerInstance;
  }

  // If a boot is already in progress, wait for it
  if (bootPromise) {
    return bootPromise;
  }

  // Start booting and remember the Promise
  bootPromise = WebContainer.boot();

  // Wait for boot to complete
  webContainerInstance = await bootPromise;

  return webContainerInstance;
};
