import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { getKontingenUnpaid } from "@/utils/adminFunctions";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import TabelKuota from "./dashboard/TabelKuota";
import TabelPembayaran from "./dashboard/TabelPembayaran";
import InfoTerdaftar from "./dashboard/InfoTerdaftar";

const DashboardAdmin = () => {
  const {
    kontingens,
    pesertas,
    officials,
    kontingensLoading,
    pesertasLoading,
    officialsLoading,
    refreshKontingens,
    refreshOfficials,
    refreshPesertas,
    refreshAll,
    setMode,
    getUnconfirmesKontingens,
  } = AdminContext();

  const getPesertasPayment = (pesertas: PesertaState[]) => {
    let unpaid = 0;
    let unconfirmed = 0;
    let confirmed = 0;
    pesertas.map((peserta) => {
      if (!peserta.pembayaran) {
        unpaid += 1;
      }
      if (!peserta.confirmedPembayaran && peserta.pembayaran) {
        unconfirmed += 1;
      }
      if (peserta.confirmedPembayaran) {
        confirmed += 1;
      }
    });
    return { unpaid, unconfirmed, confirmed };
  };

  return (
    <div className="w-full h-full bg-gray-200 rounded-md p-2">
      <h1 className="text-4xl font-extrabold">Dashboard Admin</h1>
      <div className="flex gap-2">
        <button className="btn_green" onClick={refreshAll}>
          Refresh All
        </button>
        <button className="btn_green" onClick={() => setMode("id")}>
          ID Card
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
