// src/Store/Store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "../Redux-Slices/userSlice"; // Adjust the import path accordingly
import getEntityReducer from "../Redux-Slices/getEntitySlice";
import nonPersistedReducer from "../Redux-Slices/nonPersistedSlice";
const rootReducer = combineReducers({
  user: userReducer,
  method: getEntityReducer,
  nonPersisted: nonPersistedReducer,
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["nonPersisted"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
        ],
        // Optionally, you can ignore specific paths in the state
        ignoredPaths: ["register", "rehydrate"],
      },
    }),
});

export const persistor = persistStore(store);
