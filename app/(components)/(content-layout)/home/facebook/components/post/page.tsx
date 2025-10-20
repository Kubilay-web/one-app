"use client";

import Link from "next/link";
import "./style.css";
import Moment from "react-moment";
import { useEffect, useState } from "react";
import ReactsPopup from "./ReactsPopup";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { getReacts, reactPost } from "../../functions/post";
import Comment from "./Comment";

// React Icons
import { BsThreeDots } from "react-icons/bs";
import { GoGlobe } from "react-icons/go";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { FaRegCommentAlt } from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import axios from "axios";

export default function Post({ post, user }) {
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reacts, setReacts] = useState([]);
  const [check, setCheck] = useState();
  const [total, setTotal] = useState(0);
  const [comments, setComments] = useState(post?.comments || []);
  const [count, setCount] = useState(1);

  useEffect(() => {
    getPostReacts();
  }, [post]);

  useEffect(() => {
    setComments(post?.comments || []);
  }, [post]);

  const getPostReacts = async () => {
    const res = await getReacts(post.id, user.token);
    setReacts(res.reacts);
    setCheck(res.check);
    setTotal(res.total);
  };

  const reactHandler = async (type) => {
    reactPost(post.id, type, user.token);
    if (check === type) {
      setCheck(undefined);
      let index = reacts.findIndex((x) => x.react === check);
      if (index !== -1) {
        reacts[index].count = reacts[index].count - 1;
        setReacts([...reacts]);
        setTotal((prev) => prev - 1);
      }
    } else {
      setCheck(type);
      let index = reacts.findIndex((x) => x.react === type);
      let index1 = reacts.findIndex((x) => x.react === check);
      if (index !== -1) {
        reacts[index].count = reacts[index].count + 1;
        setReacts([...reacts]);
        setTotal((prev) => prev + 1);
      }
      if (index1 !== -1) {
        reacts[index1].count = reacts[index1].count - 1;
        setReacts([...reacts]);
        setTotal((prev) => prev - 1);
      }
    }
  };


  const showMore = () => {
    setCount((prev) => prev + 3);
  };


   // Yeni yorum ekledikten sonra postları güncelle
  const handleNewComment = (newComment) => {
    setComments((prev) => [newComment, ...prev]); // Yeni yorumu ekleyip güncelle
  };

  return (
    <div className="post">
      <div className="post_header">
        <Link
          href={`/home/facebook/pages/profile/${post.user?.username}`}
          className="post_header_left"
        >
          <img src={post.user?.avatarUrl} alt="" />
          <div className="header_col">
            <div className="post_profile_name">{post.user?.username}</div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
              . <GoGlobe className="text-gray-500" size={14} />
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <BsThreeDots className="text-gray-500" size={20} />
        </div>
      </div>

      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length > 0 && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                    ? "grid_2"
                    : post.images.length === 3
                      ? "grid_3"
                      : post.images.length === 4
                        ? "grid_4"
                        : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img src={image} key={i} alt="" className={`img-${i}`} />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      )}

      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs">
            {reacts &&
              reacts
                .slice(0, 3)
                .map((react) =>
                  react.count > 0 ? (
                    <img
                      key={react.react}
                      src={`/facebook/reacts/${react.react}.svg`}
                      alt={react.react}
                      style={{ width: "20px" }}
                    />
                  ) : null
                )}
          </div>
          <div className="reacts_count_num">{total > 0 && total}</div>
        </div>
        <div className="to_right">
          <div className="comments_count">{comments?.length} comments</div>
          <div className="share_count">1 share</div>
        </div>
      </div>

      <div className="post_actions">
        <ReactsPopup
          visible={visible}
          setVisible={setVisible}
          reactHandler={reactHandler}
        />

        <div
          className="post_action hover1"
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
          onClick={() => reactHandler(check ? check : "like")}
        >
          {check ? (
            <img
              src={`/facebook/reacts/${check}.svg`}
              alt=""
              className="small_react"
              style={{ width: "18px" }}
            />
          ) : (
            <AiOutlineLike className="text-gray-600" size={18} />
          )}
          <span
            style={{
              color: `${
                check === "like"
                  ? "#4267b2"
                  : check === "love"
                    ? "#f63459"
                    : ["haha", "sad", "wow"].includes(check)
                      ? "#f7b125"
                      : check === "angry"
                        ? "#e4605a"
                        : ""
              }`,
            }}
          >
            {check ? check : "Like"}
          </span>
        </div>

        <div className="post_action hover1">
          <FaRegCommentAlt className="text-gray-600" size={18} />
          <span>Comment</span>
        </div>
        <div className="post_action hover1">
          <RiShareForwardLine className="text-gray-600" size={18} />
          <span>Share</span>
        </div>
      </div>

      <div className="comments_wrap">
        <div className="comments_order"></div>
        <CreateComment
          postId={post.id}
          user={user}
          onNewComment={handleNewComment}
        />

        {comments &&
          comments
            .sort((a, b) => {
              return new Date(b.commentAt) - new Date(a.commentAt);
            })
            .slice(0, count)
            .map((comment, i) => <Comment comment={comment} key={i} />)}
        {count < comments.length && (
          <div className="view_comments" onClick={() => showMore()}>
            View more comments
          </div>
        )}
      </div>

      {showMenu && (
        <PostMenu
          userId={user.id}
          postUserId={post.user.id}
          imagesLength={post?.images?.length}
          setShowMenu={setShowMenu}
          token={user.token}
          postId={post.id}
          images={post?.images}
        />
      )}
    </div>
  );
}
