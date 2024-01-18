import { KontingenState } from "@/utils/formTypes";
import FormPembayaran from "../forms/FormPembayaran";
import InfoPembayaran from "../pembayaran/InfoPembayaran";
import InfoTerdaftar from "../pembayaran/InfoTerdaftar";
import { useState } from "react";
import { FormContext } from "@/context/FormContext";
import InlineLoading from "@/components/loading/InlineLoading";

const Pembayaran = () => {
  const { kontingens } = FormContext();
  const [totalBiaya, setTotalBiaya] = useState(0);
  const [kontingenToPay, setKontingenToPay] = useState<KontingenState>(
    kontingens[0]
  );
  if (!kontingens.length) {
    return (
      <div className="w-full bg-white rounded-md p-2 grid lg:grid-cols-2 gap-2">
        <p className="text-red-500 font-bold">Belum ada kontingen terdaftar</p>
      </div>
    );
  }

  if (!kontingenToPay) {
    return (
      <div className="w-full bg-white rounded-md p-2 grid lg:grid-cols-2 gap-2">
        <p>
          Memuat Data <InlineLoading />
        </p>
      </div>
    );
  }
  return (
    <div className="h-fit">
      <InfoTerdaftar />
      <InfoPembayaran
        totalBiaya={totalBiaya}
        setTotalBiaya={setTotalBiaya}
        kontingenToPay={kontingenToPay}
        setKontingenToPay={setKontingenToPay}
      />
      <FormPembayaran totalBiaya={totalBiaya} kontingenToPay={kontingenToPay} />
    </div>
  );
};
export default Pembayaran;
