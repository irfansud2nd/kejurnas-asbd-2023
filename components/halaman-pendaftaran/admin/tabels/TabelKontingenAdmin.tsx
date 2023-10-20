import { AdminContext } from "@/context/AdminContext";
import { formatTanggal, getKontingenUnpaid } from "@/utils/adminFunctions";
import { KontingenState } from "@/utils/formTypes";
import KonfirmasiButton from "../KonfirmasiButton";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useRef } from "react";
import InlineLoading from "@/components/loading/InlineLoading";

const TabelKontingenAdmin = () => {
  const {
    kontingens,
    setSelectedKontingen,
    selectedKontingen,
    refreshKontingens,
    kontingensLoading,
    pesertas,
  } = AdminContext();

  const tabelHead = [
    "No",
    "ID Kontingen",
    "Nama Kontingen",
    "Peserta",
    "Official",
    "Pembayaran",
    "Belum Lunas",
    "Konfirmasi",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const getUnpaidPeserta = (kontingen: KontingenState) => {
    if (!kontingen.infoPembayaran || !kontingen.pesertas) return 0;
    let paidNominal = 0;
    kontingen.infoPembayaran.map(
      (info) => (paidNominal += Number(info.nominal.replace(/[^0-9]/g, "")))
    );
    return kontingen.pesertas.length - Math.floor(paidNominal / 300000);
  };

  const tabelRef = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Kontingen",
    sheet: "Data Kontingen",
  });

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Kontingen
      </h1>

      {/* <UpdateKontingen /> */}

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen.id && (
          <button className="btn_green" onClick={refreshKontingens}>
            Refresh
          </button>
        )}
        {kontingensLoading && <InlineLoading />}
        <button className="btn_green" onClick={onDownload}>
          Download
        </button>
      </div>
      {/* BUTTONS */}

      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {kontingens.map((kontingen: KontingenState, i: number) => (
            <tr key={kontingen.id} className="border_td">
              <td>{i + 1}</td>
              <td>{kontingen.id}</td>
              <td
                className="hover:text-green-500 hover:underline transition cursor-pointer"
                onClick={() => setSelectedKontingen(kontingen)}
              >
                {kontingen.namaKontingen}
              </td>
              <td>{kontingen.pesertas.length}</td>
              <td>{kontingen.officials.length}</td>
              <td>
                <ul>
                  {kontingen.idPembayaran
                    ? kontingen.idPembayaran.map((idPembayaran) => (
                        <li
                          key={idPembayaran}
                          className="border-b border-black last:border-none"
                        >
                          <span className="whitespace-nowrap">
                            {formatTanggal(
                              kontingen.infoPembayaran[
                                kontingen.infoPembayaran.findIndex(
                                  (info) => info.idPembayaran == idPembayaran
                                )
                              ].waktu,
                              true
                            )}{" "}
                            |{" "}
                            {
                              kontingen.infoPembayaran[
                                kontingen.infoPembayaran.findIndex(
                                  (info) => info.idPembayaran == idPembayaran
                                )
                              ].nominal
                            }
                          </span>
                          <br />
                          <span className="whitespace-nowrap">
                            {kontingen.confirmedPembayaranIds.indexOf(
                              idPembayaran
                            ) >= 0 ? (
                              `Confirmed by ${
                                kontingen.infoKonfirmasi[
                                  kontingen.infoKonfirmasi.findIndex(
                                    (info) => info.idPembayaran == idPembayaran
                                  )
                                ].email
                              }`
                            ) : (
                              <KonfirmasiButton
                                idPembayaran={idPembayaran}
                                infoPembayaran={
                                  kontingen.infoPembayaran[
                                    kontingen.infoPembayaran.findIndex(
                                      (info) =>
                                        info.idPembayaran == idPembayaran
                                    )
                                  ]
                                }
                                data={kontingen}
                              />
                            )}
                          </span>
                        </li>
                      ))
                    : "-"}
                </ul>
              </td>
              <td className="whitespace-nowrap">
                {/* {getKontingenUnpaid(kontingen, pesertas) < 0
                  ? "0"
                  : `Rp. ${getKontingenUnpaid(kontingen, pesertas)}`} */}
                Rp.{" "}
                {getKontingenUnpaid(kontingen, pesertas).toLocaleString("id")}
              </td>
              <td>
                {kontingen.unconfirmedPembayaranIds &&
                kontingen.unconfirmedPembayaranIds.length
                  ? "Butuh Konfimasi"
                  : "Selesai Konfirmasi"}
              </td>
              <td>{kontingen.creatorEmail}</td>
              <td>{formatTanggal(kontingen.waktuPendaftaran)}</td>
              <td>{formatTanggal(kontingen.waktuPerubahan)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelKontingenAdmin;
