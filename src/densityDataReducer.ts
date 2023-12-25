import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DensityDataState {
  densityData: any;
}

const initialState: DensityDataState = {
  densityData: null,
};

const densityDataSlice = createSlice({
  name: "densityData",
  initialState,
  reducers: {
    setDensityData: (state, action: PayloadAction<any>) => {
      state.densityData = action.payload;
    },
  },
});

export const { setDensityData } = densityDataSlice.actions;
export default densityDataSlice.reducer;
