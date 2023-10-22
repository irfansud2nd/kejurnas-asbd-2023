import Image from "next/image";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import Link from "next/link";
import LoginButton from "@/components/LoginButton";
import Head from "next/head";
import { Metadata } from "next";
import DownloadButton from "@/components/DownloadButton";
import bw from "@/public/images/bg-bw.png";
import { BsTicketPerforated } from "react-icons/bs";

export const metadata: Metadata = {
  title: "Kerjurnas ASBD 2023",
};

export default function Home() {
  return (
    <main className="w-full h-full bg-red-500 bg-opacity-70 flex items-center">
      <Head>
        <title>Kerjurnas ASBD 2023</title>
      </Head>
      <div className="bg-black bg-opacity-50 backdrop-blur-sm w-full h-fit shadow-2xl flex flex-col justify-center items-center text-white my-auto p-2 text-center">
        <h1 className="text-4xl font font-extrabold mb-2 ">
          Kejuaraan Nasional ASBD 2023
        </h1>
        <p>
          <FaRegCalendarAlt className="inline mb-1 mr-1" /> 03 - 05 November
          2023
          <span className="hidden min-[480px]:inline"> | </span>
          <br className="min-[480px]:hidden" />
          <Link
            href="https://goo.gl/maps/CLbG5HzMxTNuxnoH7"
            target="_blank"
            className="border-b border-b-transparent hover:border-b-white"
          >
            <IoLocationSharp className="inline mb-1 mr-1" />
            Sport Jabar, Arcamanik, Kota Bandung
          </Link>
        </p>
        <div className="flex flex-wrap justify-center gap-x-20 gap-y-2 text-black mt-10">
          <LoginButton />
          <DownloadButton />
          <Link
            href="https://www.loket.com/event/kejuaraan-nasional-asbd-2023"
            target="_blank"
            className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px] flex justify-center items-center"
          >
            Pembelian Tiket Penonton
            <span className="text-xl">
              <BsTicketPerforated />
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}
