import Image from "next/image";
import logo_asbd from "@/public/images/logo-asbd.png";

const FullLoading = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {/* <Image
        src={logo_asbd}
        alt="logo_asbd"
        className="h-1/2 max-h-[400px] w-fit animate-pulse"
      /> */}
      <img
        src={logo_asbd.src}
        alt="logo-asbd"
        className="h-1/2 max-h-[400px] w-fit absolute animate-pulse"
      />
    </div>
  );
};
export default FullLoading;
