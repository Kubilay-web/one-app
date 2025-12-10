import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { BsEmojiSmile } from "react-icons/bs";

export default function EmojiPickerBackgrounds({
  text,
  user,
  setText,
  type2,
  background,
  setBackground,
}) {
  const [picker, setPicker] = useState(false);
  const [showBgs, setShowBgs] = useState(false);
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition]);


  const handleEmoji = (emojiObject) => {
  const ref = textRef.current;
  ref.focus();
  const start = text.substring(0, ref.selectionStart);
  const end = text.substring(ref.selectionStart);
  const newText = start + emojiObject.emoji + end; // emojiObject.emoji mevcut
  setText(newText);
  setCursorPosition(start.length + emojiObject.emoji.length);
};

  const postBackgrounds = [
    "/facebook/images/postbackgrounds/1.jpg",
    "/facebook/images/postbackgrounds/2.jpg",
    "/facebook/images/postbackgrounds/3.jpg",
    "/facebook/images/postbackgrounds/4.jpg",
    "/facebook/images/postbackgrounds/5.jpg",
    "/facebook/images/postbackgrounds/6.jpg",
    "/facebook/images/postbackgrounds/7.jpg",
    "/facebook/images/postbackgrounds/8.jpg",
    "/facebook/images/postbackgrounds/9.jpg",
  ];
  const backgroundHanlder = (i) => {
    bgRef.current.style.backgroundImage = `url(${postBackgrounds[i]})`;
    setBackground(postBackgrounds[i]);
    bgRef.current.classList.add("bgHandler");
  };
  const removeBackground = (i) => {
    bgRef.current.style.backgroundImage = "";
    setBackground("");
    bgRef.current.classList.remove("bgHandler");
  };
  return (
    <div className={type2 ? "images_input" : ""}>
      <div className={!type2 ? "flex_center" : ""} ref={bgRef}>
        <textarea
          ref={textRef}
          maxLength="250"
          value={text}
          placeholder={`What's on your mind, ${user.username}`}
          className={`post_input ${type2 ? "input2" : ""}`}
          onChange={(e) => setText(e.target.value)}
          style={{
            paddingTop: `${
              background
                ? Math.abs(textRef.current.value.length * 0.1 - 32)
                : "0"
            }%`,
          }}
        ></textarea>
      </div>
      <div className={!type2 ? "post_emojis_wrap" : ""}>
        {picker && (
          <div
            className={`comment_emoji_picker ${
              type2 ? "movepicker2" : "rlmove"
            }`}
          >
            <Picker onEmojiClick={handleEmoji} />
          </div>
        )}
        {!type2 && (
          <img
            src="/facebook/icons/colorful.png"
            alt=""
            onClick={() => {
              setShowBgs((prev) => !prev);
            }}
          />
        )}
        {!type2 && showBgs && (
          <div className="post_backgrounds">
            <div
              className="no_bg"
              onClick={() => {
                removeBackground();
              }}
            ></div>
            {postBackgrounds.map((bg, i) => (
              <img
                src={bg}
                key={i}
                alt=""
                onClick={() => {
                  backgroundHanlder(i);
                }}
              />
            ))}
          </div>
        )}

        <BsEmojiSmile
          className={`emoji_icon_large ${type2 ? "moveleft" : ""}`}
          size={24}
          onClick={() => setPicker((prev) => !prev)}
        />
      </div>
    </div>
  );
}
