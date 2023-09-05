import FormPembayaran from "../forms/FormPembayaran";
import InfoPembayaran from "../pembayaran/InfoPembayaran";
import InfoTerdaftar from "../pembayaran/InfoTerdaftar";
import { useState } from "react";

const Pembayaran = () => {
  const [totalBiaya, setTotalBiaya] = useState(0);
  return (
    <div className="h-fit">
      <InfoTerdaftar />
      <InfoPembayaran totalBiaya={totalBiaya} setTotalBiaya={setTotalBiaya} />
      <FormPembayaran totalBiaya={totalBiaya} />
    </div>
  );
};
export default Pembayaran;
