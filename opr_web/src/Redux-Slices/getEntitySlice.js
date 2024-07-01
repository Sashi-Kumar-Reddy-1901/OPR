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
    setUnitCode:(state, action) =>{
      state.unitCode = action.payload
    },
    setLoginUserId:(state, action) =>{
     state.userId = action.payload
    }
  },
});

export const { callMethod, resetMethodCall,setEntityHeaders ,setUnitCode ,setLoginUserId} = getEntitySlice.actions;

export default getEntitySlice.reducer;
