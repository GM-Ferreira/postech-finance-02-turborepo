import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";

export interface UserData {
  name: string;
  email: string;
}

export type UserState = UserData;

const initialState: UserState = {
  name: "",
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserData>) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
    },
    clearUser: (state) => {
      state.name = "";
      state.email = "";
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
  },
});

export const selectIsLoggedIn = createSelector(
  (state: { user: UserState }) => state.user,
  (user) => Boolean(user.name && user.email)
);

export const selectUser = (state: { user: UserState }) => state.user;

export const { setUser, clearUser, setUserName } = userSlice.actions;
export default userSlice.reducer;
