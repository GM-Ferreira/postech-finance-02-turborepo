import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  name: string;
  email: string;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  name: '',
  email: '',
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    clearUser: (state) => {
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const { setUser, clearUser, setUserName } = userSlice.actions;
export default userSlice.reducer;