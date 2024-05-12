import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import useFormat from "../../hooks/useFormat";
import { useSelector } from "react-redux";

const Player = ({ handleButtons }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playBackRate, setPlayBackRate] = useState(1);
  const [volume, setVolume] = useState(100);
  const [pip, setPip] = useState(false);
  const [tempVol, setTempVol] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [show, setShow] = useState(true);
  const mediaRef = useRef(null);
  const player = useRef(null);

  const data = useSelector((store) => store.playerData);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setShow(true);
  }, [data]);

  useEffect(() => {
    mediaRef.current.playbackRate = playBackRate;
    mediaRef.current.volume = Number(volume < 100 ? `0.${volume}` : `1`);
  }, [playBackRate, volume]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleKeyDown = (event) => {
    switch (event.key.toLowerCase()) {
      case " ":
        togglePlay();
        break;
      case "arrowright":
        skip("forward");
        break;
      case "arrowleft":
        skip("rewind");
        break;
      case "arrowup":
        setVolume((prev) => prev + 10);
        break;
      case "arrowdown":
        setVolume((prev) => {
          if(prev === 0){
            return 0;
          }else{
          return prev - 10
    }});
        break;
      case "m":
        setVolume(0);
        break;
      case "f":
        toggleFullscreen();
        setFullscreen(true);
        break;
      case "escape":
        document.exitFullscreen();
        setFullscreen(false);
        break;
      case "w":
        togglePip();
        break;
      case "p":
      case "n":
        handleButtons(event.key.toLowerCase() ? "n" : "p", data.url);
        break;
      default:
        return;
    }
  };

  function togglePlay() {
    console.log("event")
    if (data.url === "") return;
    const media = mediaRef.current;
    if (media.paused) {
      media.play();
      setIsPlaying(true)
    } else {
      media.pause();
      setIsPlaying(false)
    }
    // setIsPlaying(prev => !prev)
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      player.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  function skip(para) {
    const skipAmount = 10;
    if (para === "forward") {
      mediaRef.current.currentTime += skipAmount;
    } else {
      mediaRef.current.currentTime -= skipAmount;
    }
  }

  function setSpeed() {
    if (playBackRate < 4) {
      setPlayBackRate((prev) => (prev += 0.25));
    } else if (playBackRate === 4) {
      setPlayBackRate(0.5);
    }
  }

  function toggleVolume() {
    if (volume > 0) {
      setTempVol(volume);
      setVolume(0);
      return;
    }
    setVolume(tempVol);
  }

  function togglePip() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
      setPip(false);
    } else if (!document.pictureInPictureElement) {
      mediaRef.current.requestPictureInPicture();
      setPip(true);
    }
  }

  function handleProgressBarClick(event) {
    const clickedPosition = event.nativeEvent.offsetX;
    const barWidth = event.currentTarget.clientWidth;
    const clickedTime = (clickedPosition / barWidth) * duration;
    mediaRef.current.currentTime = clickedTime;
  }

  function showControls() {
    setShow(true);
  }
  function hideControls() {
    if (isPlaying === true) {
      setShow(false);
    }
  }

  return (
    <div className="container">
      <div ref={player} className="player">
        {data.mediaType === "video" ? (
          <video
            onTimeUpdate={() => {
              setCurrentTime(mediaRef.current.currentTime);
              if (mediaRef.current.currentTime === duration) {
                setIsPlaying(false);
              }
            }}
            onCanPlayThrough={() => setDuration(mediaRef.current.duration)}
            ref={mediaRef}
            src={data.url}
          />
        ) : (
          <audio
            onTimeUpdate={() => {
              setCurrentTime(mediaRef.current.currentTime);
              if (mediaRef.current.currentTime === duration) {
                setIsPlaying(false);
              }
            }}
            onCanPlayThrough={() => setDuration(mediaRef.current.duration)}
            ref={mediaRef}
            src={data.url}
          />
        )}
        <div
          onMouseLeave={hideControls}
          onMouseMove={showControls}
          style={{ opacity: show ? "1" : "0" }}
          className="overlay"
        >
          <div className="name">{data.name}</div>
          <div className="controls">
            <div className="timeline">
              <span onClick={handleProgressBarClick} className="bar btn">
                <span
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                  className="progress-bar"
                ></span>
              </span>
              <span className="duration">{`${useFormat(
                currentTime
              )}/${useFormat(duration)}`}</span>
            </div>
            <div className="section-1">
              <span
                onClick={() => handleButtons("previous", data.url)}
                className="previous btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="3vh"
                  viewBox="0 -960 960 960"
                  width="3vw"
                  fill="#FFFFFF"
                >
                  <path d="M220-240v-480h80v480h-80Zm520 0L380-480l360-240v480Z" />
                </svg>
              </span>
              <span onClick={() => skip("rewind")} className="rewind btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="3vh"
                  viewBox="0 -960 960 960"
                  width="3vw"
                  fill="#FFFFFF"
                >
                  <path d="M860-240 500-480l360-240v480Zm-400 0L100-480l360-240v480Z" />
                </svg>
              </span>
              {!isPlaying ? (
                <span onClick={togglePlay} className="play btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3vh"
                    viewBox="0 -960 960 960"
                    width="3vw"
                    fill="#ffff"
                  >
                    <path d="M320-200v-560l440 280-440 280Z" />
                  </svg>
                </span>
              ) : (
                <span onClick={togglePlay} className="pause btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3vh"
                    viewBox="0 -960 960 960"
                    width="3vw"
                    fill="#FFFFFF"
                  >
                    <path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z" />
                  </svg>
                </span>
              )}
              <span onClick={() => skip("forward")} className="forward btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="3vh"
                  viewBox="0 -960 960 960"
                  width="3vw"
                  fill="#FFFFFF"
                >
                  <path d="M100-240v-480l360 240-360 240Zm400 0v-480l360 240-360 240Z" />
                </svg>
              </span>
              <span
                onClick={() => handleButtons("next", data.url)}
                className="next btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="3vh"
                  viewBox="0 -960 960 960"
                  width="3vw"
                  fill="#FFFFFF"
                >
                  <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z" />
                </svg>
              </span>
            </div>
            <div className="section-2">
              <span
                style={{ fontSize: "15px" }}
                onClick={setSpeed}
                className="speed btn"
              >
                {playBackRate}x
              </span>
              {volume > 0 ? (
                <span onClick={toggleVolume} className="volume btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3vh"
                    viewBox="0 -960 960 960"
                    width="3vw"
                    fill="#e8eaed"
                  >
                    <path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z" />
                  </svg>
                </span>
              ) : (
                <span onClick={toggleVolume} className="mute btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3vh"
                    viewBox="0 -960 960 960"
                    width="3vw"
                    fill="#e8eaed"
                  >
                    <path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z" />
                  </svg>
                </span>
              )}
              <input
                className="btn"
                value={volume}
                onChange={(event) => setVolume(event.target.value)}
                min={0}
                max={100}
                type="range"
              />
              {!pip ? (
                <span onClick={togglePip} className="pip btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3vh"
                    viewBox="0 -960 960 960"
                    width="3vw"
                    fill="#e8eaed"
                  >
                    <path d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z" />
                  </svg>
                </span>
              ) : (
                <span onClick={togglePip} className="exit-pip btn">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="3vh"
                    viewBox="0 -960 960 960"
                    width="3vw"
                    fill="#e8eaed"
                  >
                    <path d="M160-160q-33 0-56.5-23.5T80-240v-280h80v280h640v-480H440v-80h360q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm523-140 57-57-124-123h104v-80H480v240h80v-103l123 123ZM80-600v-200h280v200H80Zm400 120Z" />
                  </svg>
                </span>
              )}
              <span onClick={toggleFullscreen} className="fullscreen btn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="3vh"
                  viewBox="0 -960 960 960"
                  width="3vw"
                  fill="#FFFFFF"
                >
                  <path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
