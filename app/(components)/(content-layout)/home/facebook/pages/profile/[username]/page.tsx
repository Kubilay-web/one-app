"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; // Pages router
import axios from "axios";
import { useSession } from "@/app/SessionProvider";
import Header from "../../../components/header/page";
import Cover from "../Cover/page";
import ProfielPictureInfos from "../ProfielPictureInfos";

import ProfileMenu from "../ProfileMenu";
import PplYouMayKnow from "../PplYouMayKnow";
import CreatePost from "../../../components/createPost/page";
import GridPosts from "../GridPosts";
import "../style.css";
import Post from "../../../components/post/page";
import Photos from "../Photos";
import Friends from "../Friends";
import Intro from "../../../components/intro/page";
import Link from "next/link";

export default function ProfilePage({ setVisible }) {
  const { user } = useSession();
  const router = useRouter();
  const params = useParams(); // <-- Burada parametreleri alıyoruz
  const username = params?.username; // Dinamik parametre

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/social/profiles/${username}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (res.data.ok === false) {
          router.push("/apps/facebook/facebook/pages/home"); // Profil yoksa yönlendir
        } else {
          setProfile(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, user?.token, router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile found</div>;

  const visitor = username !== user.username;

  return (
    <div className="profile">
      <div className="header-container">
        <Header page="profile" />
      </div>

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
                <Intro
                  detailss={profile.details}
                  visitor={visitor}
                  username={username}
                />
                <Photos user={user} token={user.token} username={username} />
                <Friends friends={profile.friends} />
                <div className="relative_fb_copyright">
                  <Link href="/">Privacy</Link>
                  <span>. </span>
                  <Link href="/">Terms</Link>
                  <span>. </span>
                  <Link href="/">Advertising</Link>
                  <span>. </span>
                  <Link href="/">Ad Choices</Link>
                  <span>. </span>
                  Cookies <span>. </span>
                  <Link href="/">More</Link>
                  <span>. </span>
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
