import { createSlice } from "@reduxjs/toolkit";

interface User {
  id: string,
  name: string,
  image: string,
  countUsage: number,
  counterLimit: number,
}

const initialState: User = {
  id: "",
  name: "",
  image: "",
  countUsage: 0,
  counterLimit: 0,
}

const mockAlex: User = {
  id: "string",
  name: "Алексей А.",
  image: "./images/UserLogo.png",
  countUsage: 34,
  counterLimit: 100,
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    id: "",
    name: "",
    image: "",
    countUsage: 0,
    counterLimit: 0,
  },
  reducers: {
    logIn(state) {
      state = { ...mockAlex }
    },

    logOut(state) {
      state = { ...initialState }
    }
  }
})

export const { logIn, logOut } = authSlice.actions

export default authSlice.reducer