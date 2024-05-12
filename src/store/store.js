import { configureStore } from "@reduxjs/toolkit";
import data from "./data";
import playerSlice from "./playerSlice";

const store = configureStore({
    reducer: {
        data : data.reducer,
        playerData: playerSlice.reducer
    }
})

export default store