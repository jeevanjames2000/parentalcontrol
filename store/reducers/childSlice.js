import { createSlice } from "@reduxjs/toolkit";

const childSlice = createSlice({
  name: "child",
  initialState: {
    deviceId: null,
    location: null,
    contacts: [],
    deviceInfo: {},
    appUsage: [],
    isConnected: false,
  },
  reducers: {
    setChildData: (state, action) => {
      state.deviceId = action.payload.deviceId;
      state.location = action.payload.location;
      state.contacts = action.payload.contacts;
      state.deviceInfo = action.payload.deviceInfo;
      state.appUsage = action.payload.appUsage;
      state.isConnected = true;
    },
    resetChildData: (state) => {
      state.deviceId = null;
      state.location = null;
      state.contacts = [];
      state.deviceInfo = {};
      state.appUsage = [];
      state.isConnected = false;
    },
  },
});

export const { setChildData, resetChildData } = childSlice.actions;
export default childSlice.reducer;
