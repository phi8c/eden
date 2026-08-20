import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import chatReducer from "./slices/chatSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: appReducer,
      chat: chatReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
