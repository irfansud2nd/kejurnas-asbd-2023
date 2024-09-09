"use client";
import { useEffect, useRef, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { controlToast } from "@/utils/sharedFunctions";
import { FormContext } from "@/context/FormContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Kontingen from "./parts/Kontingen";
import Official from "./parts/Official";
import Peserta from "./parts/Peserta";
import Pembayaran from "./parts/Pembayaran";
import Link from "next/link";
import { MyContext } from "@/context/Context";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { toastError } from "@/utils/functions";

const FormPendaftaran = ({ nav }: { nav: string }) => {
  const [showRodal, setShowRodal] = useState(false);
  const { error } = FormContext();
  const { disable } = MyContext();

  const toastId = useRef(null);

  useEffect(() => {
    if (error) {
      toastError(toastId, error);
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
      <Rodal
        visible={showRodal}
        onClose={() => setShowRodal(false)}
        customStyles={{ height: "500px" }}
      >
        <div className="text-justify">
          <h1 className="font-bold text-lg text-center border-b-2 border-green-500">
            Info Kejuaraan Nasional ASBD 2023
          </h1>
          <p>
            Allhamdulillah Pendaftaran Kejuaraan Nasional ASBD 2023 telah resmi
            di tutup.
          </p>
          <p>
            Terimakasih atas antusiasme yang sangat luar biasa dari seluruh
            Keluarga Besar ASBD.
          </p>
          <p>
            Peserta yang terdaftar hanyalah peserta yang sudah menyelesaikan
            pembayaran sebelum:
          </p>
          <p className="text-center">
            <b>Senin, 30 Oktober 2023 Pukul 17:00 W.I.B</b>
          </p>
          <p>
            Manager/Official/Pelatih, tetap dapat melakukan edit data apabila
            ada data peserta yang masih keliru.
          </p>
          <p>
            Edit data hanya bisa dilakukan apa bila ada kelas pertandingan,
            kategori pertandingan atau jenis kelamin yang salah.
          </p>
          <p>Edit Data dapat dilakukan hingga:</p>
          <p className="text-center">
            <b>Senin, 30 Oktober 2023 Pukul 17:00 W.I.B</b>
          </p>
          <p>Atas Perhatianya Terima Kasih</p>
          <p className="text-center">- Panpel -</p>
        </div>
        <div className="flex justify-center">
          <button
            className="btn_green btn_full"
            onClick={() => setShowRodal(false)}
          >
            OK
          </button>
        </div>
      </Rodal>
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
