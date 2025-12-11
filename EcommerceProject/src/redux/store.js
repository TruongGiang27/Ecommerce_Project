import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // localStorage
import { persistReducer, persistStore } from "redux-persist";

import variantReducer from "./slices/variantSlice";
import customerInfoReducer from "./slices/customerInfoSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = {
  variant: variantReducer,
  customerInfo: customerInfoReducer,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: false,
  }),
});

export const persistor = persistStore(store);
