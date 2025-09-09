export default function MenuItem({ icon, title, subtitle, img }) {
  return (
    <li className="hover1">
      {icon ? (
        <span className="menu_item_icon">{icon}</span> // React iconlarını burada render ediyoruz
      ) : (
        <img src={img} alt="" /> // Eğer resim ise img ile render ediyoruz
      )}
      <div className="post_menu_text">
        <span>{title}</span>
        {/* Subtitle varsa ve boş değilse render et */}
        {subtitle && subtitle.trim() !== "" && (
          <span className="menu_post_col">{subtitle}</span>
        )}
      </div>
    </li>
  );
}
