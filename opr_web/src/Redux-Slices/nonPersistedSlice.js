import { createSlice } from '@reduxjs/toolkit';

const nonPersistedSlice = createSlice({
  name: 'nonPersisted',
  initialState: {
    rowData: {},
  },
  reducers: {
    setRowData: (state, action) => {
      state.rowData = action.payload;
    },
    clearRowData: (state) => {
      state.rowData = {};
    },
  },
});

export const { setRowData, clearRowData } = nonPersistedSlice.actions;
export default nonPersistedSlice.reducer;
