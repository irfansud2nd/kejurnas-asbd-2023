import { AdminContext } from "@/context/AdminContext";
import TabelPesertaAdmin from "./tabels/TabelPesertaAdmin";
import TabelKontingenAdmin from "./tabels/TabelKontingenAdmin";
import TabelOfficialAdmin from "./tabels/TabelOfficialAdmin";
import { kontingenInitialValue } from "@/utils/formConstants";
import IdCard from "./id-card/IdCard";

const TabelAdmin = () => {
  const { mode, setMode, selectedKontingen, setSelectedKontingen, refreshAll } =
    AdminContext();
  return (
    <div>
      <button
        className="btn_green mb-1"
        onClick={() => {
          setMode("");
          refreshAll();
          setSelectedKontingen(kontingenInitialValue);
        }}
      >
        Dashboard
      </button>

      {selectedKontingen.id && (
        <h1 className="capitalize mb-1 text-3xl font-extrabold p-1 w-fit bg-black text-white">
          Kontingen {selectedKontingen.namaKontingen}
        </h1>
      )}
      {mode == "id" && <IdCard />}
      {mode == "kontingen" && <TabelKontingenAdmin />}
      {(mode == "peserta" || selectedKontingen.id) && <TabelPesertaAdmin />}
      {(mode == "official" || selectedKontingen.id) && <TabelOfficialAdmin />}
    </div>
  );
};
export default TabelAdmin;
