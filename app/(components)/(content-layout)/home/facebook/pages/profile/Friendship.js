import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
import axios from "axios";
import { useSession } from "@/app/SessionProvider";

export default function Friendship({ username }) {

  console.log("username--->",username)
  const [friendship, setFriendship] = useState({
    friends: false,
    following: false,
    requestSent: false,
    requestReceived: false,
  });

  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);

  const menu = useRef(null);
  const menu1 = useRef(null);
  useClickOutside(menu, () => setFriendsMenu(false));
  useClickOutside(menu1, () => setRespondMenu(false));

  const { user } = useSession();

  // Friendship durumunu backend'den al
  const fetchFriendship = async () => {
    try {
      const { data } = await axios.get(`/api/social/friendship/${username}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFriendship(data);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchFriendship();
  }, [username]);

  // Handlers
  const addFriendHandler = async () => {
    setFriendship({ ...friendship, requestSent: true, following: true });
    await axios.post(
      `/api/social/friendship/add`,
      { username: username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  const cancelRequestHandler = async () => {
    setFriendship({ ...friendship, requestSent: false, following: false });
    await axios.post(
      `/api/social/friendship/cancel`,
      { username: username },
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
      { username: username },
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
      { username: username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  const unfriendHandler = async () => {
    setFriendship({
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    });
    await axios.post(
      `/api/social/friendship/unfriend`,
      { username: username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  const followHandler = async () => {
    setFriendship({ ...friendship, following: true });
    await axios.post(
      `/api/social/friendship/follow`,
      { username: username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  const unfollowHandler = async () => {
    setFriendship({ ...friendship, following: false });
    await axios.post(
      `/api/social/friendship/unfollow`,
      { username: username },
      { headers: { Authorization: `Bearer ${user.token}` } }
    );
  };

  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
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
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => unfollowHandler()}
                >
                  <img src="/facebook/icons/unfollowOutlined.png" alt="" />
                  Unfollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => followHandler()}
                >
                  <img src="/facebook/icons/unfollowOutlined.png" alt="" />
                  Follow
                </div>
              )}
              <div
                className="open_cover_menu_item hover1"
                onClick={() => unfriendHandler()}
              >
                <i className="unfriend_outlined_icon"></i>
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <img src="/facebook/icons/addFriend.png" alt="" className="invert" />
            <span>Add Friend</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={() => cancelRequestHandler()}>
          <img
            src="/facebook/icons/cancelRequest.png"
            className="invert"
            alt=""
          />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <img src="/facebook/icons/friends.png" alt="" />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu" ref={menu1}>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHandler()}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => deleteRequestHandler()}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      <div className="flex">
        {friendship?.following ? (
          <button className="gray_btn" onClick={() => unfollowHandler()}>
            <img src="/facebook/icons/follow.png" alt="" />
            <span>Following</span>
          </button>
        ) : (
          <button className="blue_btn" onClick={() => followHandler()}>
            <img src="/facebook/icons/follow.png" className="invert" alt="" />
            <span>Follow</span>
          </button>
        )}
        <button className={friendship?.friends ? "blue_btn" : "gray_btn"}>
          <img
            src="/facebook/icons/message.png"
            className={friendship?.friends && "invert"}
            alt=""
          />
          <span>Message</span>
        </button>
      </div>
    </div>
  );
}
