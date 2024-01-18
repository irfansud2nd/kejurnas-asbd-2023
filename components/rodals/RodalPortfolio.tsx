"use client";
import Link from "next/link";
import { useState } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const RodalPortfolio = () => {
  const [showRodal, setShowRodal] = useState(true);
  return (
    <Rodal
      visible={showRodal}
      onClose={() => setShowRodal(false)}
      customStyles={{ height: "300px" }}
    >
      <div className="w-full h-full flex flex-col justify-between items-center text-justify py-4 overflow-y-auto">
        <h1 className="font-bold text-lg text-center border-b-2 border-green-500">
          Informasi Web Kejurnas ASBD 2023
        </h1>
        <p>
          Web ini sudah tidak beroperasi sebagai web pendaftaran Kejuaraan
          Nasional ASBD 2023 dan dialihfungsikan menjadi portfolio pribadi milik
          pengembang. Atas perhatian dan pengertiannya, saya ucapkan terimakasih
        </p>
        <Link
          href="https://sud-dev.vercel.app/"
          className="font-semibold hover:text-green-500 transition-all"
        >
          sud.dev
        </Link>
        <button className="btn_green" onClick={() => setShowRodal(false)}>
          OK
        </button>
      </div>
    </Rodal>
  );
};
export default RodalPortfolio;
