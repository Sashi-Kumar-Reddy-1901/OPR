import { createSlice } from "@reduxjs/toolkit";

export const getEntitySlice = createSlice({
  name: "getEntity",
  initialState: {
    shouldCallMethod: false,
  },
  reducers: {
    callMethod: (state) => {
      state.shouldCallMethod = true;
    },
    resetMethodCall: (state) => {
      state.shouldCallMethod = false;
    },
    setEntityHeaders: (state, action) => {
      state.columnHeader = action.payload;
    },
    setEntityRowData: (state, action) => {
      state.rowData = action.payload;
    },
    setUnitCode:(state, action) =>{
      state.unitCode = action.payload
    }
  },
});

export const { callMethod, resetMethodCall,setEntityHeaders,setEntityRowData ,setUnitCode} = getEntitySlice.actions;

export default getEntitySlice.reducer;
