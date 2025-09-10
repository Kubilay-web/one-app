"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession } from "@/app/SessionProvider"; // Session provider'dan kullanıcı verisi alınır.
import Header from "../../components/header/page";
import Cover from "./Cover/page";
import ProfielPictureInfos from "./ProfielPictureInfos";
import ProfileMenu from "./ProfileMenu";
import PplYouMayKnow from "./PplYouMayKnow";
import CreatePost from "../../components/createPost/page";
import GridPosts from "./GridPosts";
import "./style.css";
import Post from "../../components/post/page";
import Photos from "./Photos"
import Friends from "./Friends"
import Link from "next/link";

export default function Profile({ setVisible }) {
  const { user } = useSession(); // Kullanıcı verisini alıyoruz.
  const router = useRouter();
  const username = user?.username; // Kullanıcının profil adı
  const [profile, setProfile] = useState(null); // Profil verisini saklamak için state
  const [loading, setLoading] = useState(true); // Yükleniyor durumunu kontrol etmek için
  const [error, setError] = useState(""); // Hata mesajlarını saklamak için state

  // useEffect ile profil verisini çekeceğiz.
  useEffect(() => {
    if (!username) return; // Eğer username yoksa, veri çekmeye başlama.

    const fetchProfile = async () => {
      try {
        setLoading(true); // Veri çekme başlamadan önce loading'i true yapıyoruz
        setError(""); // Eğer önceki hatalar varsa sıfırlıyoruz

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/profiles/${username}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`, // Kullanıcı token'ı ile doğrulama yapıyoruz
            },
          }
        );

        if (res.data.ok === false) {
          router.push("/apps/facebook"); // Eğer profil geçersizse kullanıcıyı yönlendiriyoruz
        } else {
          setProfile(res.data); // Profil verisini state'e kaydediyoruz
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred"); // Hata durumunda mesajı gösteriyoruz
      } finally {
        setLoading(false); // Veri çekme işlemi tamamlandığında loading'i false yapıyoruz
      }
    };

    fetchProfile(); // Profil verisini çekme işlemini başlatıyoruz
  }, [username, user?.token, router]); // username, token ya da router değişirse tekrar çalışır

  // Eğer veri yükleniyorsa
  if (loading) {
    return <div>Loading...</div>;
  }

  // Eğer hata varsa
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Eğer profil verisi yoksa
  if (!profile) {
    return <div>No profile found</div>;
  }

  // `userName` değerini al
  var userName = user.username;

  // `visitor` değişkenini, kullanıcı adıyla karşılaştırarak belirle
  var visitor = userName !== user.username; // Eğer farklıysa true, aynıysa false

  // Sonucu konsola yazdır
  console.log(visitor);

  return (
    <div className="profile">
      <Header page="profile" />
      <div className="profile_top">
        <div className="profile_container">
          <Cover cover={profile.cover} visitor={visitor} />
          <ProfielPictureInfos profile={profile} visitor={visitor} />
          <ProfileMenu />
        </div>
      </div>
      <div className="profile_bottom">
        <div className="profile_container">
          <div className="bottom_container">
            <PplYouMayKnow />
            <div className="profile_grid">
              <div className="profile_left">
                <Photos user={user} token={user.token} />
                <Friends friends={profile.friends} />
                <div className="relative_fb_copyright">
                  <Link href="/">Privacy </Link>
                  <span>. </span>
                  <Link href="/">Terms </Link>
                  <span>. </span>
                  <Link href="/">Advertising </Link>
                  <span>. </span>
                  <Link href="/">
                    Ad Choices <i className="ad_choices_icon"></i>{" "}
                  </Link>
                  <span>. </span>
                  <Link href="/"></Link>Cookies <span>. </span>
                  <Link href="/">More </Link>
                  <span>. </span> <br />
                  Meta © 2022
                </div>
              </div>
              <div className="profile_right">
                {!visitor && (
                  <CreatePost user={user} profile setVisible={setVisible} />
                )}
                <GridPosts />

                <div className="posts">
                  {profile.postsocial && profile.postsocial.length ? (
                    profile.postsocial.map((post) => (
                      <Post post={post} user={user} key={post.id} />
                    ))
                  ) : (
                    <div className="no_posts">No posts available</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
