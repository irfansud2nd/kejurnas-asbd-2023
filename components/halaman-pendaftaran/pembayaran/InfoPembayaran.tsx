import { FormContext } from "@/context/FormContext";
import { jenisPertandingan } from "@/utils/formConstants";
import { PesertaState } from "@/utils/formTypes";
import { useState, useEffect } from "react";
import ContactPerson from "./ContactPerson";

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
  const { pesertas }: { pesertas: PesertaState[] } = FormContext();

  //   GROUPING PESERTA
  useEffect(() => {
    if (pesertas.length) {
      getTotalPeserta();
    }
  }, [pesertas]);

  const getTotalPeserta = () => {
    let nonAsbd = 0;
    let asbdTunggal = 0;
    let asbdRegu = 0;

    pesertas.map((peserta) => {
      if (!peserta.pembayaran) {
        if (peserta.jenisPertandingan == jenisPertandingan[2]) {
          if (peserta.kategoriPertandingan.split(" ")[0] == "Tunggal") {
            asbdTunggal += 1;
          } else {
            asbdRegu += 1;
          }
        } else {
          nonAsbd += 1;
        }
      }
    });

    setTotalPeserta({
      nonAsbd: nonAsbd,
      asbdTunggal: asbdTunggal,
      asbdRegu: asbdRegu,
    });
  };

  //   GET TOTAL BIAYA
  useEffect(() => {
    const total =
      totalPeserta.nonAsbd * 325000 +
      totalPeserta.asbdTunggal * 250000 +
      totalPeserta.asbdRegu * 225000 +
      125000;
    setTotalBiaya(total);
  }, [totalPeserta]);

  return (
    <div className="w-full bg-white rounded-md p-2 grid lg:grid-cols-2 gap-2">
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
            <tr>
              <td>Biaya Kontingen</td>
              <td>1</td>
              <td>Rp. 125.000</td>
              <td>Rp. 125.000</td>
            </tr>
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
      <ContactPerson />
    </div>
  );
};
export default InfoPembayaran;
