import { configureStore } from "@reduxjs/toolkit";
import densityDataReducer from "./densityDataReducer";

const store = configureStore({
  reducer: {
    densityData: densityDataReducer,
  },
});

export default store;
