import { createListenerMiddleware } from "@reduxjs/toolkit";

import { setUser, clearUser, setUserName, UserState } from "./userSlice";
import { StorageService } from "../services/StorageService";

declare global {
  interface Window {
    __isUpdatingFromExternal?: () => boolean;
  }
}

export const localStorageMiddleware = createListenerMiddleware();

const storage = new StorageService();

localStorageMiddleware.startListening({
  actionCreator: setUser,
  effect: (action) => {
    if (typeof window !== "undefined") {
      const isFromExternal = window.__isUpdatingFromExternal?.();

      if (!isFromExternal) {
        storage.setUserData(action.payload);

        window.dispatchEvent(
          new CustomEvent("@bytebank/user-changed", {
            detail: action.payload,
          })
        );
      }
    }
  },
});

localStorageMiddleware.startListening({
  actionCreator: setUserName,
  effect: (action, listenerApi) => {
    if (typeof window !== "undefined") {
      const isFromExternal = window.__isUpdatingFromExternal?.();

      if (!isFromExternal) {
        const currentState = listenerApi.getState() as { user: UserState };
        const userState = currentState.user;

        storage.setUserData(userState);

        window.dispatchEvent(
          new CustomEvent("@bytebank/user-changed", {
            detail: userState,
          })
        );
      }
    }
  },
});

localStorageMiddleware.startListening({
  actionCreator: clearUser,
  effect: () => {
    if (typeof window !== "undefined") {
      storage.clearUserData();

      window.dispatchEvent(
        new CustomEvent("@bytebank/user-changed", {
          detail: null,
        })
      );
    }
  },
});
