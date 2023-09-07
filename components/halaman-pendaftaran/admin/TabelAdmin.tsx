import { AdminContext } from "@/context/AdminContext";
import TabelPesertaAdmin from "./tabels/TabelPesertaAdmin";
import TabelKontingenAdmin from "./tabels/TabelKontingenAdmin";
import TabelOfficialAdmin from "./tabels/TabelOfficialAdmin";

const TabelAdmin = () => {
  const { mode, setMode } = AdminContext();
  return (
    <div>
      <button className="btn_green mb-1" onClick={() => setMode("")}>
        Dashboard
      </button>
      {mode == "peserta" && <TabelPesertaAdmin />}
      {mode == "kontingen" && <TabelKontingenAdmin />}
      {mode == "official" && <TabelOfficialAdmin />}
    </div>
  );
};
export default TabelAdmin;
