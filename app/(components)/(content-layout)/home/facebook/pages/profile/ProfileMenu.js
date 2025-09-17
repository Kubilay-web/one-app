import Link from "next/link"
import { Dots } from "../../svg";

export default function ProfileMenu() {
  return (
    <div className="profile_menu_wrap">
      <div className="profile_menu">
        <Link href="/" className="profile_menu_active">
          Posts
        </Link>
        <Link href="/" className="hover1">
          About
        </Link>
        <Link href="/" className="hover1">
          Friends
        </Link>
        <Link href="/" className="hover1">
          Photos
        </Link>
        <Link href="/" className="hover1">
          Videos
        </Link>
        <Link href="/" className="hover1">
          Check-ins
        </Link>
        <Link href="/" className="hover1">
          More
        </Link>
        <div className="p10_dots">
          <Dots />
        </div>
      </div>
    </div>
  );
}
