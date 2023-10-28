import { AdminContext } from "@/context/AdminContext";
import CustomTabelSelector from "../CustomTabelSelector";
import TabelPesertaAdmin from "./TabelPesertaAdmin";

const CustomTabel = () => {
  const { selectedPesertas, selectedKategori } = AdminContext();

  return (
    <div>
      <CustomTabelSelector />
      {selectedPesertas.length ? (
        <>
          <TabelPesertaAdmin />
        </>
      ) : (
        <p className="text-red-500 font-semibold">
          Belum ada peserta di kategori ini
        </p>
      )}
    </div>
  );
};
export default CustomTabel;
