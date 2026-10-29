import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUser = () => async (dispatch) => {
    try {
        const res = await axios.get("https://smart-mess-backend.vercel.app/api/user/profile", { withCredentials: true });
        dispatch(setUser(res.data.user));
    } catch (err) {
        console.error("Auto-login failed: ", err.message);
    }
};

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            // console.log(action.payload);
            state.user = action.payload;
            // console.log(state.user);
        },
        logoutUser: (state) => {
            state.user = null;
        },
    },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
