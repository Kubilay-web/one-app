import { Feeling, LiveVideo, Photo } from "../../svg";
import Post from "../post/page";
import "./style.css";

export default function CreatePost({ user, setVisible, posts, showMyPostsOnly, setShowMyPostsOnly }) {
  const myPosts = posts?.filter((p) => p.userId === user?.id);

  return (
    <div className="createPost bg-white dark:bg-neutral-800 rounded-md shadow-sm">
      <div className="createPost_header bg-white dark:bg-neutral-800">
        <img src={user?.avatarUrl} alt="profile" />
        <div
          className="open_post hover2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          onClick={() => setVisible(true)}
        >
          What's on your mind, {user?.username}?
        </div>
      </div>

      <div className="create_splitter bg-neutral-200 dark:bg-neutral-600 h-px my-2" />

      <div className="createPost_body bg-white dark:bg-neutral-800">
        <div className="createPost_icon hover1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
          <LiveVideo color="#f3425f" />
          Live Video
        </div>
        <div className="createPost_icon hover1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
          <Photo color="#4bbf67" />
          Photo/Video
        </div>
        <div
          className={`createPost_icon hover1 rounded-md transition-colors cursor-pointer ${
            showMyPostsOnly
              ? "bg-neutral-200 dark:bg-neutral-600"
              : "hover:bg-neutral-100 dark:hover:bg-neutral-700"
          }`}
          onClick={() => setShowMyPostsOnly((prev) => !prev)}
        >
          <Feeling color="#f7b928" />
          Feeling/Activity
        </div>
      </div>

      {/* kendi postlarını küçük bir panelde göstermek istersen */}
      {showMyPostsOnly && (
        <div className="myPosts p-3 bg-neutral-100 dark:bg-neutral-700 rounded-md mt-2">
          {myPosts?.length > 0 ? (
            myPosts.map((post) => (
              <Post key={post.id} post={post} user={user} />
            ))
          ) : (
            <p className="text-sm text-neutral-500">Henüz hiç postun yok.</p>
          )}
        </div>
      )}
    </div>
  );
}
