import { createSlice } from "@reduxjs/toolkit";
import video1 from "../assets/video-1.mp4"
import video2 from "../assets/video-2.mp4"
import video3 from "../assets/video-3.mp4"
import Audio1 from "../assets/Champions-Anthem-Audio.mp3"
import Audio2 from "../assets/Jee-Ni-Lagda-Audio.mp3"

const data = [{
    url: video1,
    mediaType: "video",
    name: "video1.mp4"
},{
    url: video2,
    mediaType: "video",
    name: "video2.mp4"
},{
    url: video3,
    mediaType: "video",
    name: "video3.mp4"
},{
    url: Audio1,
    mediaType: "audio",
    name: "Champions-Anthem-Audio.mp3"
},{
    url: Audio2,
    mediaType: "audio",
    name: "Jee-Ni-Lagda-Audio.mp3"
}]

const dataSlice = createSlice({
    name: "link",
    initialState: data,
    reducers: {}
})

export default dataSlice