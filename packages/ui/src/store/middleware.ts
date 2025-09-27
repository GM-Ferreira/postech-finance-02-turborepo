import { createListenerMiddleware } from "@reduxjs/toolkit";

import { setUser, clearUser, setUserName, UserState } from "./userSlice";

declare global {
  interface Window {
    __isUpdatingFromExternal?: () => boolean;
  }
}

export const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  actionCreator: setUser,
  effect: (action) => {
    if (typeof window !== "undefined") {
      const isFromExternal = window.__isUpdatingFromExternal?.();

      if (!isFromExternal) {
        localStorage.setItem(
          "redux-user-state",
          JSON.stringify(action.payload)
        );

        window.dispatchEvent(
          new CustomEvent("redux-user-changed", {
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

        console.log("💾 Salvando mudança de nome no localStorage:", userState);
        localStorage.setItem("redux-user-state", JSON.stringify(userState));

        window.dispatchEvent(
          new CustomEvent("redux-user-changed", {
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
      localStorage.removeItem("redux-user-state");

      window.dispatchEvent(
        new CustomEvent("redux-user-changed", {
          detail: null,
        })
      );
    }
  },
});
