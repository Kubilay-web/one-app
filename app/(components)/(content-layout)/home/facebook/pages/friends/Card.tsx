import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function Card({ user, type }) {
  console.log("user--->", user.username);
  const [friendship, setFriendship] = useState({
    friends: false,
    following: false,
    requestSent: false,
    requestReceived: false,
  });

  const cancelRequestHandler = async () => {
    setFriendship({ ...friendship, requestSent: false, following: false });
    await axios.post(
      `/api/social/friendship/cancel`,
      { username: user.username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  const acceptRequestHandler = async () => {
    setFriendship({
      friends: true,
      following: true,
      requestSent: false,
      requestReceived: false,
    });
    await axios.post(
      `/api/social/friendship/accept`,
      { username: user.username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  const deleteRequestHandler = async () => {
    setFriendship({
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    });
    await axios.post(
      `/api/social/friendship/delete`,
      { username: user.username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  return (
    <div className="req_card">
      <Link href={`/home/facebook/pages/profile/${user.username}`}>
        <img src={user.picture} alt="" />
      </Link>
      <div className="req_name">{user.username}</div>
      {type === "sent" ? (
        <button onClick={() => cancelRequestHandler()} className="blue_btn">
          Cancel Request
        </button>
      ) : type === "request" ? (
        <>
          <button className="blue_btn" onClick={() => acceptRequestHandler()}>
            Confirm
          </button>
          <button className="gray_btn" onClick={() => deleteRequestHandler()}>
            Delete
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
