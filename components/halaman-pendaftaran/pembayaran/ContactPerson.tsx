import Image from "next/image";
import { BiCopy } from "react-icons/bi";
import { BsWhatsapp } from "react-icons/bs";
import bri_logo from "@/public/images/bri.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ContactPerson = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-y-2 items-center justify-between text-lg font-semibold text-center">
      <p className="">Semua Pembayaran dibayarkan melalui rekening</p>
      <div className="flex gap-2">
        {/* <Image src={bri_logo} alt="logo-bri" className="w-28 h-fit" /> */}
        <img src="images/bri.svg" alt="logo-bri" className="w-28 h-fit" />
        <div className="flex flex-col justify-between">
          <p>130201000643502</p>
          <p>a.n. Gina Rosdiana</p>
        </div>
      </div>
      <p className="text-base font-normal">
        Setelah melakukan pembayaran konfirmasi melalui
      </p>
      <div className="grid grid-cols-[auto_auto_auto] grid-rows-2 gap-1">
        <p>Gina</p>
        <p>| 089656132790</p>
        <div className="flex gap-1">
          <Link
            target="_blank"
            href="https://wa.me/6289656132790"
            className="bg-green-500 text-white p-1 rounded-md flex w-fit"
          >
            <BsWhatsapp />
          </Link>
          <button
            className="ml-1 bg-gray-200 p-1 rounded-md"
            onClick={() => navigator.clipboard.writeText("6289656132790")}
          >
            <BiCopy />
          </button>
        </div>
        <p>Dede</p>
        <p>| 085759114495</p>
        <div className="flex gap-1">
          <Link
            target="_blank"
            href="https://wa.me/6285759114495"
            className="bg-green-500 text-white p-1 rounded-md flex w-fit"
          >
            <BsWhatsapp />
          </Link>
          <button
            className="ml-1 bg-gray-200 p-1 rounded-md"
            onClick={() => navigator.clipboard.writeText("6285759114495")}
          >
            <BiCopy />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ContactPerson;
