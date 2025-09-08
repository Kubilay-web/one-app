export default function Contact({ user }) {
  return (
    <div className="contact hover3">
      <div className="contact_img">
        <img src={user.avatarUrl} alt="" />
      </div>
      <span>
        {user.username}
      </span>
    </div>
  );
}
