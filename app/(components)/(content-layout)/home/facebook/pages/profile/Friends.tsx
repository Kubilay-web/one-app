import Link from "next/link";

export default function Friends({ friends }) {
  return (
    <div className="profile_card">
      <div className="profile_card_header">
        Friends
        <div className="profile_header_link">See all friends</div>
      </div>
      {friends && (
        <div className="profile_card_count">
          {friends.length === 0
            ? ""
            : friends.length === 1
            ? "1 Friend"
            : `${friends.length} Friends`}
        </div>
      )}
      <div className="profile_card_grid">
        {friends &&
          friends.slice(0, 9).map((friend, i) => (
            <Link
              href={`/home/facebook/pages/profile/${friend.username}`}
              className={friend.username ? "profile_photo_card" : undefined}
              key={i}
            >
              <img src={friend.avatarUrl} alt="" />
              <span>{friend.username}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
