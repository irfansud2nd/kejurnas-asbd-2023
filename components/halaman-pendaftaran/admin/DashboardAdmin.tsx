import { AdminContext } from "@/context/AdminContext";
import TabelKuota from "./dashboard/TabelKuota";
import TabelPembayaran from "./dashboard/TabelPembayaran";
import InfoTerdaftar from "./dashboard/InfoTerdaftar";

const DashboardAdmin = () => {
  const { refreshAll, setMode } = AdminContext();

  return (
    <div className="w-full h-full bg-gray-200 rounded-md p-2">
      <h1 className="text-4xl font-extrabold">Dashboard Admin</h1>
      <div className="flex gap-2">
        <button className="btn_green" onClick={refreshAll}>
          Refresh All
        </button>
        <button className="btn_green" onClick={() => setMode("custom")}>
          Custom Table
        </button>
        <button className="btn_green" onClick={() => setMode("id")}>
          ID Card
        </button>
        <button className="btn_green" onClick={() => setMode("pembayaran")}>
          Tabel Pembayaran
        </button>
      </div>

      {/* FIRST ROW */}
      <InfoTerdaftar />

      {/* SECOND ROW */}
      <TabelPembayaran />

      {/* THIRD ROW */}
      <TabelKuota />
    </div>
  );
};
export default DashboardAdmin;
