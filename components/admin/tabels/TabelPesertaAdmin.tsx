import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { formatTanggal } from "@/utils/admin/adminFunctions";
import { jenisPertandingan } from "@/utils/formConstants";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { compare, findNamaKontingen } from "@/utils/sharedFunctions";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deletePerson } from "@/utils/formFunctions";
import { filterKontingenById } from "@/utils/kontingen/kontingenFunctions";

const TabelPesertaAdmin = () => {
  const {
    pesertas,
    kontingens,
    refreshPesertas,
    pesertasLoading,
    selectedKontingen,
    selectedPesertas,
    selectedKategori,
  } = AdminContext();

  const tabelHead = [
    "No",
    "Nama Lengkap",
    "NIK",
    "Jenis Kelamin",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Umur",
    "Berat Badan",
    "Tinggi Badan",
    "Alamat Lengkap",
    "Tingkatan",
    "Jenis Pertandingan",
    "Kategori Pertandingan",
    "Nama Kontingen",
    "Pas Foto",
    "Status Pembayaran",
    "Waktu Pembayaran",
    "Konfirmai Pembayaran",
    "Delete",
    "Email Pendaftar",
    "Waktu Pendaftaran",
    "Waktu Perubahan",
  ];

  const tabelRef = useRef(null);

  const [showRodal, setShowRodal] = useState(false);
  const [fotoUrl, setFotoUrl] = useState("");
  const [pesertasToMap, setPesertasToMap] = useState<PesertaState[]>(pesertas);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: selectedKategori.tingkatan
      ? `Tabel Peserta ${selectedKategori.tingkatan} ${selectedKategori.jenis}${
          selectedKategori.sabuk ? ` ${selectedKategori.sabuk}` : " "
        }${selectedKategori.jurus ? ` ${selectedKategori.jurus} ` : ""}${
          selectedKategori.kategori
        } ${selectedKategori.gender} ${selectedPesertas.length} Peserta`
      : "Tabel Peserta",
    sheet: "Data Peserta",
  });

  const toastId = useRef(null);

  const deleteHandler = (peserta: PesertaState) => {
    if (confirm("Apakah anda yakin")) {
      deletePerson(
        "peserta",
        peserta,
        filterKontingenById(kontingens, peserta.idKontingen),
        toastId
      );
    }
  };

  useEffect(() => {
    if (selectedKontingen.id || selectedKategori.tingkatan) {
      setPesertasToMap(selectedPesertas);
    } else {
      setPesertasToMap(pesertas);
    }
  }, [selectedPesertas]);

  return (
    <div>
      {/* <ToastContainer /> */}

      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Peserta{" "}
        {/* {selectedKategori.tingkatan && (
          <p className="inline-block">
            <span>{selectedKategori.tingkatan} - </span>
            <span>{selectedKategori.jenis} - </span>
            {selectedKategori.sabuk && <span>{selectedKategori.sabuk} - </span>}
            {selectedKategori.jurus && <span>{selectedKategori.jurus} - </span>}
            <span>{selectedKategori.kategori} - </span>
            <span>{selectedKategori.gender} - </span>
            <span>{selectedPesertas.length} Peserta</span>
          </p>
        )} */}
      </h1>

      {/* BUTTONS */}
      <div className="flex gap-1 mb-1 items-center">
        {!selectedKontingen.id && (
          <button className="btn_green" onClick={refreshPesertas}>
            Refresh
          </button>
        )}
        {pesertasLoading && <InlineLoading />}
        <button className="btn_green" onClick={onDownload}>
          Download
        </button>
      </div>
      {/* BUTTONS */}

      {/* RODAL */}
      <Rodal
        visible={showRodal}
        onClose={() => {
          setFotoUrl("");
          setShowRodal(false);
        }}
        customStyles={{ width: "fit-content", height: "fit-content" }}
      >
        <div className="flex justify-center mb-2">
          <Link href={fotoUrl} target="_blank" className="btn_green btn_full">
            Open in new tab
          </Link>
        </div>
        <div className="w-[400px] h-[300px] relative">
          {/* <Image src={fotoUrl} alt="kk" fill className="object-contain" /> */}
          <img
            src={fotoUrl}
            alt="pas foto"
            className="w-full h-full absolute object-contain"
          />
        </div>
      </Rodal>
      {/* RODAL */}

      <table className="w-full" ref={tabelRef}>
        <thead>
          <tr>
            {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pesertasToMap.map((peserta: PesertaState, i: number) => (
            <tr key={peserta.id} className="border_td">
              <td>{i + 1}</td>
              <td className="capitalize">{peserta.namaLengkap}</td>
              <td>
                <span className="text-transparent">"</span>
                {peserta.NIK.toString()}
                <span className="text-transparent">"</span>
              </td>
              <td>{peserta.jenisKelamin}</td>
              <td>{peserta.tempatLahir}</td>
              <td className="whitespace-nowrap">
                {formatTanggal(peserta.tanggalLahir)}
              </td>
              <td className="whitespace-nowrap">{peserta.umur} tahun</td>
              <td>{peserta.beratBadan} KG</td>
              <td>{peserta.tinggiBadan} CM</td>
              <td>{peserta.alamatLengkap}</td>
              <td>{peserta.tingkatanPertandingan}</td>
              <td>{peserta.jenisPertandingan}</td>
              <td className="whitespace-nowrap">
                {peserta.jenisPertandingan === jenisPertandingan[2]
                  ? "Sabuk " +
                    peserta.sabuk +
                    " | " +
                    peserta.jurus +
                    " | " +
                    peserta.kategoriPertandingan
                  : peserta.kategoriPertandingan}
                {peserta.jenisPertandingan === jenisPertandingan[2] &&
                  peserta.kategoriPertandingan.split(" ")[0] != "Tunggal" &&
                  ` | Tim ${peserta.namaTim}`}
              </td>
              <td>{findNamaKontingen(kontingens, peserta.idKontingen)}</td>
              <td className="whitespace-nowrap">
                <button
                  className="hover:text-green-500 hover:underline transition"
                  onClick={() => {
                    setShowRodal(true);
                    setFotoUrl(peserta.downloadFotoUrl);
                  }}
                >
                  Show
                </button>
                <br />
                {/* <span className="hidden">{peserta.downloadFotoUrl}</span> */}
              </td>
              <td>{peserta.pembayaran ? "Dibayar" : "Belum dibayar"}</td>
              <td>{formatTanggal(peserta.infoPembayaran.waktu)}</td>
              <td>{peserta.confirmedPembayaran ? "Yes" : "No"}</td>
              <td>
                {peserta.pembayaran ? (
                  "-"
                ) : (
                  <button
                    className="btn_red"
                    onClick={() => deleteHandler(peserta)}
                  >
                    Delete
                  </button>
                )}
              </td>
              <td>{peserta.creatorEmail}</td>
              <td>{formatTanggal(peserta.waktuPendaftaran)}</td>
              <td className="whitespace-nowrap">
                {formatTanggal(peserta.waktuPerubahan)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TabelPesertaAdmin;
