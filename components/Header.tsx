import { SearchIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="flex items-center p-2 max-w-6xl mx-auto">
      <Image
        className="rounded-lg"
        src="https://links.papareact.com/b3z"
        width={40}
        height={40}
        alt="logo"
      />
      <div className="flex-1 flex items-center">
        <form
          action=""
          className="flex items-center space-x-1 bg-gray-100 p-2 rounded-md mx-2 max-w-96"
        >
          <SearchIcon className="h-4 text-gray-600" />
          <input
            type="text"
            placeholder="search"
            className="bg-transparent outline-none flex-1"
          />
        </form>
      </div>
    </div>
  );
};

export default Header;
