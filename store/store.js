import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import mainReducer from "./reducers/mainSlice";
import childSlice from "./reducers/childSlice";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
  main: mainReducer,
  child: childSlice,
});
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["child"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});
export const persistor = persistStore(store);
export default store;
