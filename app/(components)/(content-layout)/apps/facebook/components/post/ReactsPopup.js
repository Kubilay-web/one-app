import { useState } from "react";

const reactsArray = [
  {
    name: "like",
    image: "/facebook/reacts/like.gif",
  },
  {
    name: "love",
    image: "/facebook/reacts/love.gif",
  },
  {
    name: "haha",
    image: "/facebook/reacts/haha.gif",
  },
  {
    name: "wow",
    image: "/facebook/reacts/wow.gif",
  },
  {
    name: "sad",
    image: "/facebook/reacts/sad.gif",
  },
  {
    name: "angry",
    image: "/facebook/reacts/angry.gif",
  },
];
export default function ReactsPopup({ visible, setVisible }) {
  return (
    <>
      {visible && (
        <div
          className="reacts_popup"
          onMouseOver={() => {
            setTimeout(() => {
              setVisible(true);
            }, 500);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisible(false);
            }, 500);
          }}
        >
          {reactsArray.map((react, i) => (
            <div className="react" key={i}>
              <img src={react.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
