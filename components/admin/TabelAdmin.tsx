import { AdminContext } from "@/context/AdminContext";
import TabelPesertaAdmin from "./tabels/TabelPesertaAdmin";
import TabelKontingenAdmin from "./tabels/TabelKontingenAdmin";
import TabelOfficialAdmin from "./tabels/TabelOfficialAdmin";
import { kontingenInitialValue } from "@/utils/formConstants";
import IdCard from "./id-card/IdCard";
import CustomTabel from "./tabels/CustomTabel";
import TabelPembayaranKontingen from "./tabels/TabelPembayaranKontingen";

const TabelAdmin = () => {
  const {
    mode,
    setMode,
    selectedKontingen,
    setSelectedKontingen,
    setUncofirmedKontingens,
    resetKategori,
  } = AdminContext();
  return (
    <div>
      <button
        className="btn_green mb-1"
        onClick={() => {
          setMode("");
          resetKategori();
          setSelectedKontingen(kontingenInitialValue);
          setUncofirmedKontingens([]);
        }}
      >
        Dashboard
      </button>

      {selectedKontingen && (
        <h1 className="capitalize mb-1 text-3xl font-extrabold p-1 w-fit bg-black text-white">
          Kontingen {selectedKontingen.namaKontingen}
        </h1>
      )}
      {mode == "custom" && <CustomTabel />}
      {mode == "id" && <IdCard />}
      {mode == "kontingen" && <TabelKontingenAdmin />}
      {(mode == "peserta" || selectedKontingen) && <TabelPesertaAdmin />}
      {(mode == "official" || selectedKontingen) && <TabelOfficialAdmin />}
      {mode == "pembayaran" && <TabelPembayaranKontingen />}
    </div>
  );
};
export default TabelAdmin;
