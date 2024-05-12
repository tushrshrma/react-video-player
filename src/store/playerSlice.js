import { createSlice } from "@reduxjs/toolkit";

const playerSlice = createSlice({
    name: "player",
    initialState: {
      url: "",
      mediaType: "",
      name: ""  
    },
    reducers: {
        setData: (state, action) => {
          
          return {
            url: action.payload.url,
            mediaType: action.payload.mediaType,
            name: action.payload.name
          }
        },
    }
})

export const { setData } = playerSlice.actions

export default playerSlice