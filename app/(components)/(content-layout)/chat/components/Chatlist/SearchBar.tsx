import React, { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { useChatStore } from "@/app/chat-store/useChatSotre";

function SearchBar() {
  const [query, setQuery] = useState("");
  const searchContacts = useChatStore((state) => state.searchContacts);
  console.log(searchContacts);
  const clearContactSearch = useChatStore((state) => state.clearContactSearch);
  const searchResults = useChatStore((state) => state.searchResults);
  const setActiveChat = useChatStore((state) => state.setActiveChat);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log(value);
    setQuery(value);

    if (value.trim() === "") {
      clearContactSearch();
    } else {
      searchContacts(value);
    }
  };

  return (
    <div className="bg-colors-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-colors-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <BiSearchAlt2 className="text-panel-header-icon text-white cursor-pointer text-lg" />
        <input
          type="text"
          placeholder="Search or start a new chat"
          className="bg-transparent text-sm focus:outline-none w-full border-none
           !text-white placeholder:text-white placeholder:opacity-100"
        />
      </div>
      <BsFilter className="text-panel-header-icon text-white cursor-pointer text-lg pr-5 pl-3" />
    </div>
  );
}

export default SearchBar;
