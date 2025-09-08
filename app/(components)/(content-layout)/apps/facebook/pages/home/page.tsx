import CreatePost from "../../components/createPost/page";
import Header from "../../components/header/page";
import LeftHome from "../../components/home/left/page";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories/page";
import "./style.css";
import { validateRequest } from "@/app/auth";
export default async function Home() {
  const { user } = await validateRequest();
  return (
    <div className="home">
      <Header />
      <div className="middle-container">
        <div className="home_middle">
          <div>
            <LeftHome user={user} />
          </div>
          <div>
            {" "}
            <Stories />
            <CreatePost user={user} />
          </div>
          <div>
            <RightHome user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
