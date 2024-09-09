"use client";
import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { getKontingenUnpaid } from "@/utils/admin/adminFunctions";
import { KontingenState, PesertaState } from "@/utils/formTypes";

const TabelPembayaran = () => {
  const {
    getUnconfirmedKontingens,
    pesertas,
    kontingens,
    pesertasLoading,
    kontingensLoading,
  } = AdminContext();

  const getPesertasPayment = () => {
    let unpaid = 0;
    let unconfirmed = 0;
    let confirmed = 0;
    pesertas.map((peserta: PesertaState) => {
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

  const getKontingensPayment = () => {
    let unpaid = 0;
    let paid = 0;
    let unconfirmed = 0;
    let unconfirmedData: KontingenState[] = [];
    let confirmed = 0;
    kontingens.map((kontingen: KontingenState) => {
      if (getKontingenUnpaid(kontingen, pesertas) > 0) unpaid += 1;
      if (kontingen.unconfirmedPembayaranIds.length) {
        unconfirmed += 1;
        unconfirmedData.push(kontingen);
      }
      if (kontingen.confirmedPembayaranIds.length) {
        confirmed += 1;
      }
      if (kontingen.idPembayaran.length) {
        paid += 1;
      }
    });
    return { unpaid, unconfirmed, confirmed, paid };
  };

  return (
    <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit mt-2">
      <p className="font-semibold text-lg">Pembayaran</p>
      <div className="grid grid-cols-[repeat(3,_auto)] grid-rows-[repeat(4,_auto)] w-fit">
        <p className="font-semibold text-lg border-r-2 border-r-white">
          Keterangan
        </p>
        <p className="font-semibold text-lg border-r-2 border-r-white px-2">
          Peserta
        </p>
        <p className="font-semibold text-lg px-2">Kontingen</p>
        <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
          Confirmed
        </p>
        <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
          {pesertasLoading ? <InlineLoading /> : getPesertasPayment().confirmed}
        </p>
        <p className="text-2xl font-extrabold text-green-500">
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().confirmed
          )}
        </p>
        <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white px-2">
          Unconfirmed
        </p>
        <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
          {pesertasLoading ? (
            <InlineLoading />
          ) : (
            getPesertasPayment().unconfirmed
          )}
        </p>
        <button
          className="text-2xl font-extrabold text-yellow-500 hover:underline"
          onClick={getUnconfirmedKontingens}
        >
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().unconfirmed
          )}
        </button>
        <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
          Unpaid
        </p>
        <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
          {pesertasLoading ? <InlineLoading /> : getPesertasPayment().unpaid}
        </p>
        <p className="text-2xl font-extrabold text-red-500">
          {kontingensLoading ? (
            <InlineLoading />
          ) : (
            getKontingensPayment().unpaid
          )}
        </p>
      </div>
    </div>
  );
};
export default TabelPembayaran;
