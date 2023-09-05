"use client";
import { useEffect, useRef } from "react";
import { AiFillHome } from "react-icons/ai";
import { newToast } from "@/utils/sharedFunctions";
import { FormContext } from "@/context/FormContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Kontingen from "./parts/Kontingen";
import Official from "./parts/Official";
import Peserta from "./parts/Peserta";
import Pembayaran from "./parts/Pembayaran";
import Link from "next/link";
import { MyContext } from "@/context/Context";

const FormPendaftaran = ({ nav }: { nav: string }) => {
  const { error } = FormContext();
  const { disable } = MyContext();

  const toastId = useRef(null);

  useEffect(() => {
    if (error) {
      newToast(toastId, "error", error.message);
    }
  }, [error]);

  const forms = [
    {
      name: "kontingen",
      component: <Kontingen />,
    },
    {
      name: "official",
      component: <Official />,
    },
    {
      name: "peserta",
      component: <Peserta />,
    },
    {
      name: "pembayaran",
      component: <Pembayaran />,
    },
  ];
  return (
    <div className="p-2 max-w-[100vw]">
      <ToastContainer />
      <div className="bg-red-500 bg-opacity-50 text-black w-full rounded-md p-2">
        <div className="flex w-full justify-between items-center mb-2">
          <h1 className="w-fit bg-black text-white text-lg sm:text-2xl font-bold rounded-md p-2">
            Form {nav != "pembayaran" && "Pendaftaran"}{" "}
            <span className="capitalize">
              {forms[forms.findIndex((form) => form.name == nav)].name}
            </span>
          </h1>
          <Link
            href={disable ? "" : "/"}
            className="text-white bg-black hover:text-red-500 hover:bg-white transition p-2 rounded-full text-xl sm:text-2xl"
          >
            <AiFillHome />
          </Link>
        </div>
        {forms[forms.findIndex((form) => form.name == nav)].component}
      </div>
    </div>
  );
};
export default FormPendaftaran;
