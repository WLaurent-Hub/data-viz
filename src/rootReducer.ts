import { combineReducers } from "@reduxjs/toolkit";
import densityDataReducer from "./densityDataReducer";

const rootReducer = combineReducers({
  densityData: densityDataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
