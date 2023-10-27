"use client";
import { MyContext } from "@/context/Context";
import { FiArrowRightCircle } from "react-icons/fi";
import Link from "next/link";
import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newToast } from "@/utils/sharedFunctions";
import InlineLoading from "./loading/InlineLoading";

const LoginButton = () => {
  const { user, userLoading, googleLogin } = MyContext();

  const toastId = useRef(null);

  const loginHandler = async () => {
    try {
      await googleLogin();
    } catch (error: any) {
      newToast(toastId, "error", `Gagal login ${error.code}`);
    }
  };

  if (userLoading) {
    return (
      <div className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px] flex gap-1 justify-center items-center">
        Loading... <InlineLoading />
      </div>
    );
  } else if (user) {
    return (
      <Link
        href="/halaman-pendaftaran"
        className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px] flex gap-1 justify-center items-center"
      >
        {/* Halaman Pendaftaran */}
        Edit Peserta & Pembayaran
        <FiArrowRightCircle className="inline" />
      </Link>
    );
  }
  return (
    <button
      className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px]"
      onClick={loginHandler}
    >
      <ToastContainer />
      Login dengan Google
    </button>
  );
};
export default LoginButton;
