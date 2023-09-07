"use client";
import Authorized from "@/components/halaman-pendaftaran/admin/Authorized";
import FullLoading from "@/components/loading/FullLoading";
import { AdminContextProvider } from "@/context/AdminContext";
import { MyContext } from "@/context/Context";
import Link from "next/link";
import { useEffect } from "react";

const AdminPage = () => {
  const {
    user,
    userLoading,
    adminLoading,
    adminAuthorized,
    checkAdminAuthorized,
    googleLogin,
  } = MyContext();

  const loginHandler = async () => {
    try {
      await googleLogin();
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    if (user) checkAdminAuthorized(user);
  }, [user]);

  return (
    <main className="w-full bg-white h-full">
      {userLoading || adminLoading ? (
        <FullLoading />
      ) : adminAuthorized && adminAuthorized.length ? (
        <AdminContextProvider>
          <Authorized />
        </AdminContextProvider>
      ) : (
        // back to homepage
        <div className="w-full h-full text-center flex justify-center items-center">
          <div className="bg-black text-white font-semibold text-xl w-fit px-3 py-2 rounded-md">
            <h1 className="text-red-500 mb-3">AUTHORIZED PERSONEL ONLY</h1>
            {user ? (
              <Link href="/" className="btn_red">
                Kembali ke Halaman Utama
              </Link>
            ) : (
              <button className="btn_red" onClick={loginHandler}>
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
};
export default AdminPage;
