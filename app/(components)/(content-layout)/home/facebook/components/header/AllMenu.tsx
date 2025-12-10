"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";  // next/link'ten Link bileşenini import ediyoruz
import { menu, create } from "../../data/allMenu";
import AllMenuItem from "./AllMenuItem";
import "../../styles/icons/icons.css";
import "./style.css";

export default function AllMenu({ onClose }) {
  // Menü dışına tıklamayı algılamak için referans oluşturuyoruz
  const menuRef = useRef(null);

  useEffect(() => {
    // Dış tıklamayı kontrol eden fonksiyon
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose?.(); // dışına tıklanırsa menüyü kapat
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Bileşen unmount olduğunda event listener'ı kaldır
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    // Menü container’ını referansa bağla
    <div className="all_menu" ref={menuRef}>
      <div className="all_menu_header">Menu</div>
      <div className="all_menu_wrap scrollbar">
        <div className="all_left">
          <div className="all_menu_search">
            <i className="amm_s_ic"></i>
            <input type="text" placeholder="Search Menu" />
          </div>

          <div className="all_menu_group">
            <div className="all_menu_group_header">Social</div>
            {menu.slice(0, 7).map((item, i) => (
              <Link href={item.link} key={i} className="menu-item-link">
                <AllMenuItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                />
              </Link>
            ))}
          </div>

          <div className="all_menu_group">
            <div className="all_menu_group_header">Shopping</div>
            {menu.slice(9, 11).map((item, i) => (
              <Link href={item.link} key={i} className="menu-item-link">
                <AllMenuItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                />
              </Link>
            ))}
          </div>

          <div className="all_menu_group">
            <div className="all_menu_group_header">Personal</div>
            {menu.slice(11, 15).map((item, i) => (
              <Link href={item.link} key={i} className="menu-item-link">
                <AllMenuItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                />
              </Link>
            ))}
          </div>

          <div className="all_menu_group">
            <div className="all_menu_group_header">Professional</div>
            {menu.slice(15, 17).map((item, i) => (
              <Link href={item.link} key={i} className="menu-item-link">
                <AllMenuItem
                  name={item.name}
                  description={item.description}
                  icon={item.icon}
                />
              </Link>
            ))}
          </div>
        </div>

        <div className="all_right">
          <div className="all_right_header">Create</div>
          {create.map((item) => (
            <Link href={item.link} key={item.name} className="all_right_item">
              <div className="all_right_circle">
                <i className={item.icon}></i>
              </div>
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
