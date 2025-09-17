"use client";

import { useState } from "react";
import { reactPost } from "../../functions/post";
import { useSession } from "@/app/SessionProvider";

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
export default function ReactsPopup({ visible, setVisible, reactHandler }) {
  const { user } = useSession();

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
            <div
              className="react"
              key={i}
              onClick={() => reactHandler(react.name)}
            >
              <img src={react.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
