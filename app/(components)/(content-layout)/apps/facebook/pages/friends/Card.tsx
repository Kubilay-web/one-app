import Link from "next/link";

export default function Card({ user, type }) {
  return (
    <div className="req_card">
      <Link href={`/profile/${user.username}`}>
        <img src={user.picture} alt="" />
      </Link>
      <div className="req_name">
        {user.username}
      </div>
      {type === "sent" ? (
        <button className="blue_btn">Cancel Request</button>
      ) : type === "request" ? (
        <>
          <button className="blue_btn">Confirm</button>
          <button className="gray_btn">Delete</button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
