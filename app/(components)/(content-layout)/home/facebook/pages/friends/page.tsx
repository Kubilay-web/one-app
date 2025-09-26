"use client"

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../../components/header/page";
import { getFriendsPageInfos } from "../../functions/user";
import Card from "./Card";
import { FaUserFriends, FaRegHeart, FaUsers, FaBell } from "react-icons/fa"; // react-icons'dan ikonlar
import "./style.css";
import { useSession } from "@/app/SessionProvider";

export default function Friends() {
  const { user } = useSession()

  // useState kullanarak loading, error ve data durumlarını yönetiyoruz
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    getData(); // Bileşen mount edildiğinde veri çekiyoruz
  }, []);

  // Arkadaş verisini çeken fonksiyon
  const getData = async () => {
    setLoading(true);
    setError(""); // Her yeni istek öncesi hata durumunu sıfırlıyoruz

    try {
      const response = await getFriendsPageInfos(user.token);
      if (response.status === "ok") {
        setData(response.data);
      } else {
        setError(response.data); // API'den gelen hatayı set ediyoruz
      }
    } catch (err) {
      setError("Something went wrong while fetching the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Header page="friends" /> */}
      <div className="friends">
        <div className="friends_left">
          <div className="friends_left_header">
            <h3>Friends</h3>
            <div className="small_circle">
              <FaRegHeart className="settings_filled_icon" />
            </div>
          </div>
          <div className="friends_left_wrap">
            <div className="mmenu_item active_friends">
              <div className="small_circle" style={{ background: "#1876f2" }}>
                <FaUserFriends className="friends_home_icon invert" />
              </div>
              <span>Home</span>
            </div>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <FaUsers className="friends_requests_icon" />
              </div>
              <span>Friend Requests</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <FaBell className="friends_requests_icon" />
              </div>
              <span>Sent Requests</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <FaUsers className="friends_suggestions_icon" />
              </div>
              <span>Suggestions</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <FaUserFriends className="all_friends_icon" />
              </div>
              <span>All Friends</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                <FaBell className="birthdays_icon" />
              </div>
              <span>Birthdays</span>
              <div className="rArrow">
                <i className="right_icon"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="friends_right">
          {/* Yükleniyor ve hata mesajlarını gösteriyoruz */}
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          {/* Friend Requests Section */}
          <div className="friends_right_wrap">
            <div className="friends_left_header">
              <h3>Friend Requests</h3>
              <a className="see_link hover3">See all</a>
            </div>
            <div className="flex_wrap">
              {data.requests &&
                data.requests.map((user) => (
                  <Card user={user} key={user.id} type="request" />
                ))}
            </div>
          </div>

          {/* Sent Requests Section */}
          <div className="friends_right_wrap">
            <div className="friends_left_header">
              <h3>Sent Requests</h3>
              <a className="see_link hover3">See all</a>
            </div>
            <div className="flex_wrap">
              {data.sentRequests &&
                data.sentRequests.map((user) => (
                  <Card user={user} key={user._id} type="sent" />
                ))}
            </div>
          </div>

          {/* Friends Section */}
          <div className="friends_right_wrap">
            <div className="friends_left_header">
              <h3>Friends</h3>
              <a className="see_link hover3">See all</a>
            </div>
            <div className="flex_wrap">
              {data.friends &&
                data.friends.map((user) => (
                  <Card user={user} key={user.id} type="friends" />
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
