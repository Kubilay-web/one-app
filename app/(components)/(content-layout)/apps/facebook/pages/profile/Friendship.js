"use client";

import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unfollow,
  unfriend,
} from "../../functions/user";
import { useSession } from "@/app/SessionProvider";

export default function Friendship({ friendshipp, profileid }) {
  const [friendship, setFriendship] = useState(friendshipp);
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);

  const menu = useRef(null);
  const menu1 = useRef(null);

  const { user } = useSession();

  useClickOutside(menu, () => setFriendsMenu(false));
  useClickOutside(menu1, () => setRespondMenu(false));

  useEffect(() => {
    setFriendship(friendshipp);
  }, [friendshipp]);

  // ---- Handlers ----
  const addFriendHandler = async () => {
    setFriendship(prev => ({ ...prev, requestSent: true, following: true }));
    await addFriend(profileid, user.token);
  };

  const cancelRequestHandler = async () => {
    setFriendship(prev => ({ ...prev, requestSent: false, following: false }));
    await cancelRequest(profileid, user.token);
  };

  const followHandler = async () => {
    setFriendship(prev => ({ ...prev, following: true }));
    await follow(profileid, user.token);
  };

  const unfollowHandler = async () => {
    setFriendship(prev => ({ ...prev, following: false }));
    await unfollow(profileid, user.token);
  };

  const acceptRequestHandler = async () => {
    setFriendship(prev => ({
      ...prev,
      friends: true,
      following: true,
      requestSent: false,
      requestReceived: false,
    }));
    await acceptRequest(profileid, user.token);
  };

  const unfriendHandler = async () => {
    setFriendship(prev => ({
      ...prev,
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    }));
    await unfriend(profileid, user.token);
  };

  const deleteRequestHandler = async () => {
    setFriendship(prev => ({
      ...prev,
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    }));
    await deleteRequest(profileid, user.token);
  };

  return (
    <div className="friendship">
      {/* Arkadaşsa */}
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(!friendsMenu)}>
            <img src="/facebook/icons/friends.png" alt="" />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu" ref={menu}>
              <div className="open_cover_menu_item hover1">
                <img src="/facebook/icons/favoritesOutline.png" alt="" />
                Favorites
              </div>
              <div className="open_cover_menu_item hover1">
                <img src="/facebook/icons/editFriends.png" alt="" />
                Edit Friend list
              </div>
              {friendship?.following ? (
                <div className="open_cover_menu_item hover1" onClick={unfollowHandler}>
                  <img src="/facebook/icons/unfollowOutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div className="open_cover_menu_item hover1" onClick={followHandler}>
                  <img src="/facebook/icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div className="open_cover_menu_item hover1" onClick={unfriendHandler}>
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent && !friendship?.requestReceived && (
          <button className="blue_btn" onClick={addFriendHandler}>
            <img src="/facebook/icons/addFriend.png" alt="" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}

      {/* İstek gönderildiyse */}
      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={cancelRequestHandler}>
          <img src="/facebook/icons/cancelRequest.png" className="invert" alt="" />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(!respondMenu)}>
              <img src="/facebook/icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={menu1}>
                <div className="open_cover_menu_item hover1" onClick={acceptRequestHandler}>
                  Confirm
                </div>
                <div className="open_cover_menu_item hover1" onClick={deleteRequestHandler}>
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Takip / Mesaj */}
      <div className="flex">
        {friendship?.following ? (
          <button className="gray_btn" onClick={unfollowHandler}>
            <img src="/facebook/icons/follow.png" alt="" />
            <span>Following</span>
          </button>
        ) : (
          <button className="blue_btn" onClick={followHandler}>
            <img src="/facebook/icons/follow.png" className="invert" alt="" />
            <span>Follow</span>
          </button>
        )}
        <button className={friendship?.friends ? "blue_btn" : "gray_btn"}>
          <img
            src="/facebook/icons/message.png"
            className={friendship?.friends ? "invert" : ""}
            alt=""
          />
          <span>Message</span>
        </button>
      </div>
    </div>
  );
}
