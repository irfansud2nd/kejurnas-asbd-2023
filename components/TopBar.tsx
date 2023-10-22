import Image from "next/image";
import logo_ipsi from "@/public/images/logo-ipsi.png";
import logo_kemenpora from "@/public/images/logo-kemenpora.png";
import logo_al_azhar from "@/public/images/logo-al_azhar.png";
import logo_asbd from "@/public/images/logo-asbd.png";
import Profile from "./Profile";
import Link from "next/link";

const TopBar = () => {
  return (
    <div className="grid grid-cols-10 sm:grid-cols-12 w-full h-[40px] sm:h-[50px] md:h-[60px] bg-black p-1 items-center gap-2 shadow-xl text-white">
      <div className="col-span-2 lg:col-span-1">
        <Profile />
      </div>
      <Link
        href="/"
        className="hidden sm:block col-span-6 lg:col-span-7 text-lg md:text-xl font-bold"
      >
        <span className="hidden md:inline">Kejuraan Nasional</span>{" "}
        <span className="hidden sm:inline md:hidden">Kejurnas</span> ASBD 2023
      </Link>
      <div className="w-full h-full col-span-2 sm:col-span-1 relative flex justify-end">
        {/* <div className="w-full h-full col-span-2 sm:col-span-1 relative"> */}
        {/* <Image
          src={logo_ipsi}
          alt="logo_ipsi"
          fill
          className="w-fit h-full object-contain object-right"
        /> */}
        <img
          src={logo_ipsi.src}
          alt="logo_ipsi"
          className="w-fit h-full absolute object-contain object-right"
        />
      </div>
      <div className="w-full h-full col-span-2 sm:col-span-1 relative flex justify-end">
        {/* <div className="w-full h-full col-span-2 sm:col-span-1 relative"> */}
        {/* <Image
          src={logo_kemenpora}
          alt="logo_kemenpora"
          fill
          className="w-fit h-full object-contain object-right"
        /> */}
        <img
          src={logo_kemenpora.src}
          alt="logo_kemenpora"
          className="w-fit h-full absolute object-contain object-right"
        />
      </div>
      <div className="w-full h-full col-span-2 sm:col-span-1 relative flex justify-end">
        {/* <div className="w-full h-full col-span-2 sm:col-span-1 relative"> */}
        {/* <Image
          src={logo_asbd}
          alt="logo-asbd"
          fill
          className="w-fit h-full object-contain object-right"
        /> */}
        <img
          src={logo_asbd.src}
          alt="logo_ipsi"
          className="w-fit h-full absolute object-contain object-right"
        />
      </div>
      <div className="w-full h-full col-span-2 sm:col-span-1 relative flex justify-end">
        {/* <div className="w-full h-full col-span-2 sm:col-span-1 relative"> */}
        {/* <Image
          src={logo_al_azhar}
          alt="logo_al_azhar"
          fill
          className="w-fit h-full object-contain object-right"
        /> */}
        <img
          src={logo_al_azhar.src}
          alt="logo_al_azhar"
          className="w-fit h-full absolute object-contain object-right"
        />
      </div>
    </div>
  );
};
export default TopBar;
