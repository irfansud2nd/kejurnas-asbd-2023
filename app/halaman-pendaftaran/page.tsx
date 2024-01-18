"use client";
import LoginButton from "@/components/LoginButton";
import FormPendaftaran from "@/components/halaman-pendaftaran/FormPendaftaran";
import PendaftaranNav from "@/components/halaman-pendaftaran/PendaftaranNav";
import FullLoading from "@/components/loading/FullLoading";
import { MyContext } from "@/context/Context";
import { FormContextProvider } from "@/context/FormContext";
import { useState, useEffect } from "react";

const PendaftaranPage = () => {
  const [nav, setNav] = useState("kontingen");
  const { userLoading, user } = MyContext();

  useEffect(() => {
    document.title = "Halaman Pendaftaran - Kerjurnas ASBD 2023";
  }, []);

  return (
    <div className="min-h-full w-full py-2">
      <FormContextProvider>
        {userLoading ? (
          <FullLoading />
        ) : user ? (
          <>
            <PendaftaranNav nav={nav} setNav={setNav} />
            <FormPendaftaran nav={nav} />
          </>
        ) : (
          <div className="flex justify-center items-center w-full h-full">
            <LoginButton />
          </div>
        )}
      </FormContextProvider>
    </div>
  );
};
export default PendaftaranPage;
