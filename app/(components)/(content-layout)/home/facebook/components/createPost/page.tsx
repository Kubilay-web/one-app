import { Feeling, LiveVideo, Photo } from "../../svg";
import "./style.css";

export default function CreatePost({ user, setVisible }) {
  return (
    <div className="createPost bg-white dark:bg-neutral-800 rounded-md shadow-sm">
      <div className="createPost_header bg-white dark:bg-neutral-800">
        <img src={user?.avatarUrl} alt="" />
        <div
          className="open_post hover2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          onClick={() => setVisible(true)}
        >
          What's on your mind, {user?.username}
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
        <div className="createPost_icon hover1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors">
          <Feeling color="#f7b928" />
          Feeling/Activity
        </div>
      </div>
    </div>
  );
}
