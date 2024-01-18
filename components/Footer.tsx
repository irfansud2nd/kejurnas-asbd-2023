import { BsGlobe, BsInstagram, BsYoutube } from "react-icons/bs";
import { BiLogoFacebookSquare } from "react-icons/bi";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="w-full h-fit flex justify-center items-center py-2 bg-black text-white">
      <div className="w-full flex flex-wrap justify-around gap-x-3 gap-y-1">
        <Link
          className="hover:text-red-500 border-b border-b-transparent hover:border-b-red-500 transition-all"
          target="_blank"
          href="https://www.instagram.com/asbdindonesia"
        >
          <BsInstagram className="inline mr-1 mb-0.5" /> ASBDIndonesia
        </Link>
        <Link
          className="hover:text-red-500 border-b border-b-transparent hover:border-b-red-500 transition-all"
          target="_blank"
          href="https://web.facebook.com/PencakSilatAlAzhar"
        >
          <BiLogoFacebookSquare className="inline mr-1 mb-0.5" /> Al-Azhar Seni
          Bela Diri
        </Link>
        <Link
          className="hover:text-red-500 border-b border-b-transparent hover:border-b-red-500 transition-all"
          target="_blank"
          href="https://www.youtube.com/@ASBDTV1970"
        >
          <BsYoutube className="inline mr-1 mb-0.5" /> ASBDTV1970
        </Link>
        <Link
          className="hover:text-red-500 border-b border-b-transparent hover:border-b-red-500 transition-all"
          target="_blank"
          href="https://silatalazhar.com/"
        >
          <BsGlobe className="inline mr-1 mb-0.5" /> silatalazhar.com
        </Link>
      </div>
    </div>
  );
};
export default Footer;
