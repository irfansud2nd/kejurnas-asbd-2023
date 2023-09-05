"use client";
import FormPendaftaran from "@/components/halaman-pendaftaran/FormPendaftaran";
import PendaftaranNav from "@/components/halaman-pendaftaran/PendaftaranNav";
import FullLoading from "@/components/loading/FullLoading";
import { MyContext } from "@/context/Context";
import { FormContextProvider } from "@/context/FormContext";
import Image from "next/image";
import { useState } from "react";

const PendaftaranPage = () => {
  const [nav, setNav] = useState("kontingen");
  const { userLoading, user } = MyContext();

  return (
    <div className="min-h-full w-full py-2">
      <Image
        src="/images/bg-bw.png"
        fill
        className="object-cover -z-10"
        alt="bg-bw"
      />
      <FormContextProvider>
        {userLoading ? (
          <FullLoading />
        ) : user ? (
          <>
            <PendaftaranNav nav={nav} setNav={setNav} />
            <FormPendaftaran nav={nav} />
          </>
        ) : (
          "Login dulu..."
        )}
      </FormContextProvider>
    </div>
  );
};
export default PendaftaranPage;
