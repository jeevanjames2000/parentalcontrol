import { createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
  name: "main",
  initialState: {
    contacts: [],
    location: null,
    deviceId: null,
    isConnected: false,
  },
  reducers: {
    setChildData: (state, action) => {
      state.contacts = action.payload.contacts || [];
      state.location = action.payload.location || null;
      state.deviceId = action.payload.deviceId || null;
      state.isConnected = true;
    },
    resetChildData: (state) => {
      state.contacts = [];
      state.location = null;
      state.deviceId = null;
      state.isConnected = false;
    },
  },
});

export const { setChildData, resetChildData } = mainSlice.actions;
export default mainSlice.reducer;
