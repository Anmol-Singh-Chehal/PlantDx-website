import { createSlice } from "@reduxjs/toolkit";

const getStoredToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

const getStoredUser = () => {
  const user =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

const initialState = {
  token: getStoredToken(),
  user: getStoredUser(),
  isAuthenticated: !!getStoredToken(),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    setCredentials: (state, action) => {
      const {
        access_token,
        user,
        rememberMe,
      } = action.payload;

      state.token = access_token;
      state.user = user;
      state.isAuthenticated = true;

      // Clear old credentials from both storages
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Store according to Remember Me
      if (rememberMe) {
        localStorage.setItem("token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", access_token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }
    },

    updateUser: (state, action) => {
      state.user = action.payload;

      if (localStorage.getItem("token")) {
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload)
        );
      } else if (sessionStorage.getItem("token")) {
        sessionStorage.setItem(
          "user",
          JSON.stringify(action.payload)
        );
      }
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    },
  },
});

export const {
  setCredentials,
  updateUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;