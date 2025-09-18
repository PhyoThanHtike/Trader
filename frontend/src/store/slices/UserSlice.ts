import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  userName: "",
  email: "",
  role: "",
  profilePicture: "",
};

interface user {
  userId: string;
  email: string;
  userName: string;
  role: string;
  profilePicture: string;
}

const UserSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser: (state: any, action: PayloadAction<user>) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.profilePicture = action.payload.profilePicture;
    },
    setLogOutUser: () => {
      return initialState;
    },
  },
});

export const { setUser, setLogOutUser } = UserSlice.actions;
export default UserSlice.reducer;
