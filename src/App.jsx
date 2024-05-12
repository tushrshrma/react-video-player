import React from "react";
import "./App.css";
import Player from "./components/Player/Player";
import Item from "./components/Item/Item";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setData } from "./store/playerSlice";

const App = () => {
  const data = useSelector((store) => store.data);
  const dispatch = useDispatch();

  const handleClick = (data) => {
    dispatch(setData(data));
  };

  const handleButtons = (btn, url) => {
    const currentIndex = data.findIndex((item) => item.url === url);
    let newIndex

    if (btn === "next" || btn === "n") {
      newIndex = currentIndex + 1
      }
    else {
      newIndex = currentIndex - 1
    }
    dispatch(setData(data[newIndex]))
  };

  return (
    <div className="home">
      <ul className="content">
        {data.map((item, i) => (
          <Item data={item} handleClick={handleClick} key={i} />
        ))}
      </ul>
      <Player handleButtons={handleButtons} />
    </div>
  );
};

export default App;

