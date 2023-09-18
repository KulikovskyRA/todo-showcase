import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  errorStatus: false,
  errorMessage: '',
};

const errorSlice = createSlice({
  name: 'errorSlice',
  initialState,
  reducers: {
    errorCreate(state, action) {
      state.errorStatus = true;
      state.errorMessage = action.payload.errorMessage;
    },
    errorRemove(state) {
      state.errorStatus = false;
      state.errorMessage = '';
    },
  },
});

export default errorSlice.reducer;

export const { errorCreate, errorRemove } = errorSlice.actions;
