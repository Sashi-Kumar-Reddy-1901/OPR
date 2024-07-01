import { createSlice } from "@reduxjs/toolkit";

const nonPersistedSlice = createSlice({
  name: "nonPersisted",
  initialState: {
    rowData: {},
    triggerEffect: false,
  },
  reducers: {
    setRowData: (state, action) => {
      state.rowData = action.payload;
    },
    clearRowData: (state) => {
      state.rowData = {};
    },
    setTriggerEffect: (state) => {
      state.triggerEffect = !state.triggerEffect;
    },
  },
});

export const { setRowData, clearRowData, setTriggerEffect } = nonPersistedSlice.actions;
export default nonPersistedSlice.reducer;
