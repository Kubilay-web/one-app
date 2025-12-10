"use client";

import { useEffect, useRef, useState } from "react";
import { Return, Search } from "../../svg";
import useClickOutside from "../../helpers/clickOutside";
import {
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  search,
} from "../../functions/user";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";


interface SearchMenuProps {
  color: string;
  setShowSearchMenu: (visible: boolean) => void;
  token: string;
  userId: string;
}

export default function SearchMenu({
  color,
  setShowSearchMenu,
  token,
  userId,
}: SearchMenuProps) {
  const [iconVisible, setIconVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [searchHistory, setSearchHistory] = useState<any[]>([]);
  const menu = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useClickOutside(menu, () => {
    setShowSearchMenu(false);
  });

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    const res = await getSearchHistory(token, userId);
    setSearchHistory(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    input.current?.focus();
  }, []);

  const searchHandler = async () => {
    if (searchTerm.trim() === "") {
      setResults([]);
    } else {
      const res = await search(searchTerm, token);
      setResults(Array.isArray(res) ? res : []);
    }
  };

  const addToSearchHistoryHandler = async (searchUser: string) => {
    await addToSearchHistory(searchUser, token);
    getHistory();
  };

  const handleRemove = async (searchUser: string) => {
    await removeFromSearch(searchUser, token);
    getHistory();
  };

  return (
    <div className="header_left search_area scrollbar" ref={menu}>
      <div className="search_wrap">
        <div className="header_logo">
          <div
            className="circle hover1"
            onClick={() => setShowSearchMenu(false)}
          >
            <Return color={color} />
          </div>
        </div>
        <div className="search" onClick={() => input.current?.focus()}>
          {iconVisible && <Search color={color} />}
          <input
            type="text"
            placeholder="Search Facebook"
            ref={input}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyUp={searchHandler}
            onFocus={() => setIconVisible(false)}
            onBlur={() => setIconVisible(true)}
          />
        </div>
      </div>

      {results.length === 0 && searchHistory.length > 0 && (
        <div className="search_history_header">
          <span>Recent searches</span>
          <a>Edit</a>
        </div>
      )}

      <div className="search_history scrollbar">
        {results.length === 0 &&
          searchHistory
            .slice()
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((user) => (
              <div className="search_user_item hover1" key={user.id}>
                <Link
                  className="flex"
                  href={`/profile/${user.user.username}`}
                  onClick={() => addToSearchHistoryHandler(user.user.id)}
                >
                  <img src={user.user.avatarurl} alt="" />
                  <span>{user.user.username}</span>
                </Link>
                <FaTimes
                  style={{ cursor: "pointer", color: "red", fontSize: "18px" }}
                  onClick={() => handleRemove(user.user.id)}
                />
              </div>
            ))}
      </div>

      <div className="search_results scrollbar">
        {results.length > 0 &&
          results.map((user) => (
            <Link
              href={`/home/facebook/pages/profile/${user.username}`}
              className="search_user_item hover1"
              onClick={() => addToSearchHistoryHandler(user.id)}
              key={user.id}
            >
              <img src={user.avatarUrl} alt="" />
              <span>{user.username}</span>
            </Link>
          ))}
      </div>
    </div>
  );
}
