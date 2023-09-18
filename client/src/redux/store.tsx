import {
  configureStore,
  combineReducers,
  AnyAction,
  ThunkAction,
} from '@reduxjs/toolkit';

import todoSlice from './todoSlice';
import errorSlice from './errorSlice';

const rootReducer = combineReducers({
  todoSlice,
  errorSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   AnyAction
// >;

// export type ThunkActionCreator<PayloadType = void, ReturnType = void> = (
//   payload: PayloadType
// ) => AppThunk<ReturnType>;
