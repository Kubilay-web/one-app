import { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { FaSmile, FaCamera, FaGif, FaStickerMule } from "react-icons/fa"; // Import icons
import { FaTimes } from "react-icons/fa";
import { MdGif } from "react-icons/md";

export default function CreateComment({ user }) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState("");
  const [cursorPosition, setCursorPosition] = useState();
  const textRef = useRef(null);
  const imgInput = useRef(null);

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

  const handleImage = (e) => {
    let file = e.target.files[0];
    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/png" &&
      file.type !== "image/webp" &&
      file.type !== "image/gif"
    ) {
      setError(`${file.name} format is not supported.`);
      return;
    } else if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large max 5mb allowed.`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentImage(event.target.result);
    };
  };

  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user?.avatarUrl} alt="" />
        <div className="comment_input_wrap">
          {picker && (
            <div className="comment_emoji_picker">
              <Picker onEmojiClick={handleEmoji} />
            </div>
          )}
          <input
            type="file"
            hidden
            ref={imgInput}
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImage}
          />
          {error && (
            <div className="postError comment_error">
              <div className="postError_error">{error}</div>
              <button className="blue_btn" onClick={() => setError("")}>
                Try again
              </button>
            </div>
          )}
          <input
            type="text"
            ref={textRef}
            value={text}
            placeholder="Write a comment..."
            onChange={(e) => setText(e.target.value)}
          />
          <div
            className="comment_circle_icon hover2"
            onClick={() => setPicker((prev) => !prev)}
          >
            <FaSmile /> {/* Emoji icon */}
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current.click()}
          >
            <FaCamera /> {/* Camera icon */}
          </div>
          <div className="comment_circle_icon hover2">
            <MdGif /> {/* Gif icon */}
          </div>
          <div className="comment_circle_icon hover2">
            <FaStickerMule /> {/* Sticker icon */}
          </div>
        </div>
      </div>

      {commentImage && (
        <div className="comment_img_preview">
          <img src={commentImage} alt="comment image" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage("")}
          >
            <FaTimes />
          </div>
        </div>
      )}
    </div>
  );
}
