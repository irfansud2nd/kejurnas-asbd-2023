import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { compare } from "@/utils/sharedFunctions";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";

const TabelPembayaranKontingen = () => {
  const { kontingens }: { kontingens: KontingenState[] } = AdminContext();
  const [paidKontingens, setPaidKontingens] = useState<
    {
      namaKontingen: string;
      totalBayar: number;
    }[]
  >([]);

  useEffect(() => {
    getPaidKontingens();
  }, []);

  const getTotalBayar = (kontingen: KontingenState) => {
    let totalBayar = 0;
    kontingen.infoPembayaran.map((item) => {
      if (
        kontingen.confirmedPembayaranIds.findIndex(
          (i) => i == item.idPembayaran
        ) >= 0
      ) {
        if (item.nominal.includes("Rp")) {
          let arr = [];
          arr = item.nominal.split("");
          arr.splice(-3, 3);
          totalBayar += parseFloat(arr.join("").replace(/[Rp.,\s]/g, ""));
        }
      }
    });
    return totalBayar * 1000;
  };

  const getPaidKontingens = () => {
    let result: {
      namaKontingen: string;
      totalBayar: number;
    }[] = [];
    kontingens.map((kontingen) => {
      if (kontingen.confirmedPembayaranIds.length > 0) {
        result.push({
          namaKontingen: kontingen.namaKontingen,
          totalBayar: getTotalBayar(kontingen),
        });
      }
    });
    setPaidKontingens(result);
  };

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Pembayaran",
  });

  const getNominalConfirmed = () => {
    let nominal = 0;
    paidKontingens.map((item) => (nominal += item.totalBayar));
    return nominal;
  };

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Pembayaran
      </h1>
      <button className="btn_green btn_full mb-1" onClick={onDownload}>
        Download
      </button>
      <p className="font-bold">
        Total Dana Masuk: Rp.{" "}
        {paidKontingens.length ? (
          getNominalConfirmed().toLocaleString("id")
        ) : (
          <InlineLoading />
        )}
      </p>
      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Kontingen</th>
            <th>Tanda Terima</th>
            {/* <th>Total Bayar</th>
            <th>Bukti Transfer</th>
            <th>Cek</th> */}
          </tr>
        </thead>
        <tbody>
          {paidKontingens
            .sort(compare("namaKontingen", "asc"))
            .map((item, i) => (
              <tr key={i} className="border_td">
                <td>{i + 1}</td>
                <td>{item.namaKontingen.toUpperCase()}</td>
                <td></td>
                {/* <td>Rp. {item.totalBayar.toLocaleString("id")}</td>
                <td></td>
                <td></td> */}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelPembayaranKontingen;
