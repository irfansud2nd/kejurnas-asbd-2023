import { navs } from "@/utils/constants";
import { HiMenu } from "react-icons/hi";
import { useState } from "react";
import Link from "next/link";
import { AiFillHome } from "react-icons/ai";
import { MyContext } from "@/context/Context";

const PendaftaranNav = ({
  nav,
  setNav,
}: {
  nav: string;
  setNav: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="w-full mx-auto hidden min-[440px]:block px-2 sm:px-10 md:px-20">
        <div className="flex justify-around bg-black backdrop-blur-sm bg-opacity-70 rounded-full py-1 md:py-2">
          {navs.map((item) => (
            <button
              className={`pendaftaran_nav_button ${
                nav == item && "pendaftaran_nav_button_active"
              }`}
              key={item}
              onClick={() => setNav(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`min-[440px]:hidden grid ${
          showMenu ? "grid-rows-[auto_1fr]" : "grid-rows-1"
        } transition bg-black backdrop-blur-sm bg-opacity-70 rounded-md py-1 px-3 box-border mx-3 text-white capitalize`}
        onClick={() => setShowMenu((prev) => !prev)}
      >
        <button className="flex gap-2 capitalize items-center">
          <HiMenu /> {nav}
        </button>
        <div
          className={`flex flex-col items-start w-full ${
            !showMenu && "hidden"
          }`}
        >
          {navs.map((item) => (
            <button
              key={item}
              onClick={() => setNav(item)}
              className={`capitalize
              ${item == nav && "hidden"}
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};
export default PendaftaranNav;
