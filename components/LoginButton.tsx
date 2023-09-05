"use client";
import { MyContext } from "@/context/Context";
import { FiArrowRightCircle } from "react-icons/fi";
import Link from "next/link";
import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { newToast } from "@/utils/sharedFunctions";

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
      <div className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px]">
        Loading...
      </div>
    );
  } else if (user) {
    return (
      <Link
        href="/halaman-pendaftaran"
        className="bg-white px-2 py-1 hover:bg-red-500 hover:text-white transition w-[200px]"
      >
        Halaman Pendaftaran <FiArrowRightCircle className="inline mb-1" />
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
