// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

const initialState = {
  modulesRoles: [],
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setModulesRoles: (state, action) => {
      state.modulesRoles = action.payload;
    },
  },
});

export const { setModulesRoles } = userSlice.actions;

const persistConfig = {
  key: "user",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

export default persistedReducer;
