import { FormContext } from "@/context/FormContext";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { useState, useEffect } from "react";
import ContactPerson from "./ContactPerson";
import { getGroupedUnpaidPeserta } from "@/utils/formFunctions";

const InfoPembayaran = ({
  totalBiaya,
  setTotalBiaya,
}: {
  totalBiaya: number;
  setTotalBiaya: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [totalPeserta, setTotalPeserta] = useState({
    nonAsbd: 0,
    asbdTunggal: 0,
    asbdRegu: 0,
  });
  const {
    pesertas,
    kontingen,
  }: { pesertas: PesertaState[]; kontingen: KontingenState } = FormContext();

  //   GROUPING PESERTA
  useEffect(() => {
    if (pesertas.length) {
      setTotalPeserta({
        nonAsbd: getGroupedUnpaidPeserta(pesertas).nonAsbd,
        asbdTunggal: getGroupedUnpaidPeserta(pesertas).asbdTunggal,
        asbdRegu: getGroupedUnpaidPeserta(pesertas).asbdRegu,
      });
    }
  }, [pesertas]);

  //   GET TOTAL BIAYA
  useEffect(() => {
    const total =
      totalPeserta.nonAsbd * 325000 +
      totalPeserta.asbdTunggal * 250000 +
      totalPeserta.asbdRegu * 225000;

    if (kontingen.idPembayaran.length <= 0) {
      setTotalBiaya(total + 125000);
    } else {
      setTotalBiaya(total);
    }
  }, [totalPeserta, kontingen.idPembayaran.length]);

  return (
    <div className="w-full bg-white rounded-md p-2 grid lg:grid-cols-2 gap-2">
      <div className="overflow-x-auto flex flex-col justify-between">
        <table className="w-fit border-x-2 border-black mx-auto">
          <thead>
            <tr>
              <th>Jenis</th>
              <th>Kuantitas</th>
              <th>Biaya</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
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
            {!kontingen.idPembayaran.length && (
              <tr>
                <td>Biaya Kontingen</td>
                <td>1</td>
                <td>Rp. 125.000</td>
                <td>Rp. 125.000</td>
              </tr>
            )}
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
        <div className="bg-gray-200 font-bold text-lg text-center w-fit mx-auto px-2 py-1 mt-2 rounded-md">
          Gunakan 3 digit terakhir No HP anda pada nominal transfer
        </div>
      </div>
      <ContactPerson />
    </div>
  );
};
export default InfoPembayaran;
