"use client";
import { MyContext } from "@/context/Context";
import Image from "next/image";
import { useRef } from "react";
import { BsGoogle } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InlineLoading from "./loading/InlineLoading";
import { controlToast } from "@/utils/functions";
const Profile = () => {
  const { user, userLoading, googleLogin, logout } = MyContext();

  const toastId = useRef(null);

  const loginHandler = async () => {
    try {
      await googleLogin();
    } catch (error: any) {
      controlToast(toastId, "error", error.code, true);
    }
  };
  const logoutHandler = async () => {
    try {
      await logout();
    } catch (error: any) {
      controlToast(toastId, "error", error.code, true);
    }
  };
  return (
    <>
      {/* <ToastContainer /> */}

      <button
        className="w-fit h-full bg-red-500 text-white rounded-full p-1 flex justify-around items-center hover:bg-white hover:text-red-500 group transition"
        onClick={() => (user ? logoutHandler() : loginHandler())}
      >
        {userLoading ? (
          <p className="whitespace-nowrap px-1">
            <InlineLoading /> Loading
          </p>
        ) : (
          <>
            {user ? (
              user.photoURL ? (
                <div className="w-6 h-6 relative rounded-full">
                  {/* <Image
                    src={user.photoURL}
                    alt="profile image"
                    fill
                    className="object-contain rounded-full"
                  /> */}
                  <img
                    src={user.photoURL}
                    referrerPolicy="no-referrer"
                    alt="profile image"
                    className="w-6 h-6 object-contain rounded-full"
                  />
                </div>
              ) : (
                <FaUserCircle className="w-5 h-5 " />
              )
            ) : (
              <BsGoogle className="w-5 h-5" />
            )}
            <p className="font-semibold text-center px-1">
              {user ? "Logout" : "Login"}
            </p>
          </>
        )}
      </button>
    </>
  );
};
export default Profile;
