"use client";

import { useRef, useState } from "react";
import Picker from "emoji-picker-react";
import { FaSmile, FaCamera, FaTimes } from "react-icons/fa";
import { MdGif } from "react-icons/md";
import { ClipLoader } from "react-spinners";
import axios from "axios";

export default function CreateComment({ user, postId, onNewComment, postOwnerId  }) {
  const [picker, setPicker] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [commentImage, setCommentImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);
  const imgInput = useRef<HTMLInputElement>(null);

    // Postları tutacak state
    const [posts, setPosts] = useState([]);

  const handleEmoji = (emojiObject) => {
    const ref = textRef.current;
    if (!ref) return;
    const start = text.substring(0, ref.selectionStart || 0);
    const end = text.substring(ref.selectionStart || 0);
    setText(start + emojiObject.emoji + end);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        file.type
      )
    ) {
      setError(`${file.name} format not supported.`);
      return;
    }
    if (file.size > 1024 * 1024 * 5) {
      setError(`${file.name} is too large, max 5MB.`);
      return;
    }
    setCommentImage(file);
  };



   const handleComment = async (e) => {
    if (e.key === "Enter" && !e.shiftKey && text.trim()) {
      e.preventDefault();
      setLoading(true);


      try {
        const formData = new FormData();
        formData.append("comment", text);
        formData.append("postId", postId);
        if (commentImage) formData.append("image", commentImage);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/comment`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${user.token}` },
            body: formData,
          }
        );
        const data = await res.json();
        setLoading(false);
        setText("");
        setCommentImage(null);

        // Yeni yorum ekledikten sonra postları güncelle
        if (data.message) setError(data.message);


          await axios.post("/api/notificationsocial", {
          fromUserId: user.id,
          toUserId: postOwnerId,
          type: "comment",
          message: `${user.username} gönderine yorum yaptı: "${text}"`,
          postId,
        });

        // Yeni yorum ekledikten sonra postları tekrar al
        if (onNewComment) {
          onNewComment(data.comment);  // Burada `onNewComment` callback fonksiyonunu çağırıyoruz
        }
      } catch {
        setLoading(false);
        setError("Failed to post comment. Please try again.");
      }
    }
  };



  return (
    <div className="create_comment_wrap">
      <div className="create_comment">
        <img src={user.avatarUrl} alt="" />
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
            onKeyDown={handleComment}
          />
          <div className="comment_circle" style={{ marginTop: 5 }}>
            <ClipLoader size={20} color="#1876f2" loading={loading} />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => setPicker((prev) => !prev)}
          >
            <FaSmile />
          </div>
          <div
            className="comment_circle_icon hover2"
            onClick={() => imgInput.current?.click()}
          >
            <FaCamera />
          </div>
          <div className="comment_circle_icon hover2">
            <MdGif />
          </div>
        </div>
      </div>
      {commentImage && (
        <div className="comment_img_preview">
          <img src={URL.createObjectURL(commentImage)} alt="comment image" />
          <div
            className="small_white_circle"
            onClick={() => setCommentImage(null)}
          >
            <FaTimes />
          </div>
        </div>
      )}
    </div>
  );
}
