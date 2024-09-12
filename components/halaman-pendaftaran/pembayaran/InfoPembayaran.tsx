import { FormContext } from "@/context/FormContext";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { useState, useEffect } from "react";
import ContactPerson from "./ContactPerson";
import { findNamaKontingen } from "@/utils/sharedFunctions";
import { getPesertasByKontingen } from "@/utils/admin/adminFunctions";
import { getGroupedUnpaidPeserta } from "@/utils/peserta/pesertaFunctions";

const InfoPembayaran = ({
  totalBiaya,
  setTotalBiaya,
  kontingenToPay,
  setKontingenToPay,
}: {
  totalBiaya: number;
  setTotalBiaya: React.Dispatch<React.SetStateAction<number>>;
  kontingenToPay: KontingenState;
  setKontingenToPay: React.Dispatch<React.SetStateAction<KontingenState>>;
}) => {
  const [totalPeserta, setTotalPeserta] = useState({
    nonAsbd: 0,
    asbdTunggal: 0,
    asbdRegu: 0,
  });
  const {
    pesertas,
    kontingens,
  }: { pesertas: PesertaState[]; kontingens: KontingenState[] } = FormContext();

  //   GROUPING PESERTA
  useEffect(() => {
    if (pesertas.length) {
      const selectedPesertas = getPesertasByKontingen(
        pesertas,
        kontingenToPay.id
      );
      const { nonAsbd, asbdTunggal, asbdRegu } =
        getGroupedUnpaidPeserta(selectedPesertas);
      setTotalPeserta({
        nonAsbd,
        asbdTunggal,
        asbdRegu,
      });
    }
  }, [pesertas, kontingenToPay]);

  //   GET TOTAL BIAYA
  useEffect(() => {
    let total =
      totalPeserta.nonAsbd * 325000 +
      totalPeserta.asbdTunggal * 250000 +
      totalPeserta.asbdRegu * 225000;

    if (!kontingenToPay.biayaKontingen) {
      total += 125000;
    }

    setTotalBiaya(total);
  }, [totalPeserta, kontingens]);

  return (
    <div className="w-full bg-white rounded-md p-2 grid lg:grid-cols-2 gap-2">
      <div className="overflow-x-auto flex flex-col justify-between">
        <div className="flex justify-center gap-1 mb-1">
          <p>Jumlah Pembayaran : </p>
          <select
            value={kontingenToPay.id}
            onChange={(e) =>
              setKontingenToPay(
                kontingens[
                  kontingens.findIndex((item) => item.id == e.target.value)
                ]
              )
            }
          >
            {kontingens.map((kontingen) => (
              <option value={kontingen.id}>
                {findNamaKontingen(kontingens, kontingen.id)}
              </option>
            ))}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-fit border-x-2 border-black mx-auto">
            <thead>
              <tr>
                <th>Jenis</th>
                <th>Kuantitas</th>
                <th>Biaya</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="whitespace-nowrap">
              <tr className="whitespace-nowrap">
                <td>Peserta Non Jurus ASBD</td>
                <td>{totalPeserta.nonAsbd}</td>
                <td>Rp. 325.000</td>
                <td>
                  Rp. {(totalPeserta.nonAsbd * 325000).toLocaleString("id")}
                </td>
              </tr>
              <tr>
                <td>Peserta Jurus ASBD Tunggal</td>
                <td>{totalPeserta.asbdTunggal}</td>
                <td>Rp. 250.000</td>
                <td>
                  Rp. {(totalPeserta.asbdTunggal * 250000).toLocaleString("id")}
                </td>
              </tr>
              <tr>
                <td>Peserta Jurus ASBD Regu</td>
                <td>{totalPeserta.asbdRegu}</td>
                <td>Rp. 225.000</td>
                <td>
                  Rp. {(totalPeserta.asbdRegu * 225000).toLocaleString("id")}
                </td>
              </tr>
              {!kontingenToPay.biayaKontingen.length ? (
                <tr>
                  <td>Biaya Kontingen</td>
                  <td>1</td>
                  <td>Rp. 125.000</td>
                  <td>Rp. 125.000</td>
                </tr>
              ) : null}
              <tr className="border-y-2 border-black">
                <td colSpan={3} className="border-r-2 border-black">
                  Total Biaya
                </td>
                <td className="whitespace-nowrap">
                  Rp. {totalBiaya.toLocaleString("id")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-gray-200 font-bold text-lg text-center w-fit mx-auto px-2 py-1 mt-2 rounded-md">
          Gunakan 3 digit terakhir No HP anda pada nominal transfer
        </div>
      </div>
      <ContactPerson />
    </div>
  );
};
export default InfoPembayaran;
