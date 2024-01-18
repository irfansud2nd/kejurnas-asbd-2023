import { AdminContext } from "@/context/AdminContext";
import {
  formatTanggal,
  getKontingenUnpaid,
  getOfficialsByKontingen,
  getPesertasByKontingen,
} from "@/utils/adminFunctions";
import { KontingenState } from "@/utils/formTypes";
import KonfirmasiButton from "../KonfirmasiButton";
import { useDownloadExcel } from "react-export-table-to-excel";
import { useRef, useState, useEffect } from "react";
import InlineLoading from "@/components/loading/InlineLoading";
import { compare, newToast, updateToast } from "@/utils/sharedFunctions";
import UpdateKontingen from "../UpdateKontingen";
import Link from "next/link";
import { kontingenInitialValue } from "@/utils/formConstants";
import { deleteDoc, doc } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { deletePerson } from "@/utils/formFunctions";
import RodalKontingen from "@/components/halaman-pendaftaran/rodals/RodalKontingen";

const TabelKontingenAdmin = () => {
  const [kontingensToMap, setKontingensToMap] = useState<KontingenState[]>([]);
  const [dataToDelete, setDataToDelete] = useState(kontingenInitialValue);
  const [deleteRodal, setDeleteRodal] = useState(false);

  const {
    kontingens,
    unconfirmedKongtingens,
    setSelectedKontingen,
    selectedKontingen,
    refreshKontingens,
    kontingensLoading,
    pesertas,
    officials,
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

  const tabelRef = useRef(null);
  const toastId = useRef(null);
  const { onDownload } = useDownloadExcel({
    currentTableRef: tabelRef.current,
    filename: "Tabel Kontingen",
    sheet: "Data Kontingen",
  });

  useEffect(() => {
    if (selectedKontingen.id) {
      setKontingensToMap([selectedKontingen]);
    } else if (unconfirmedKongtingens.length) {
      setKontingensToMap(unconfirmedKongtingens);
    } else {
      setKontingensToMap(kontingens);
    }
  }, [selectedKontingen, unconfirmedKongtingens]);

  // DELETE BUTTON HANDLER
  const handleDelete = (data: KontingenState) => {
    setDeleteRodal(true);
    setDataToDelete(data);
  };

  // DELETE KONTINGEN START
  const deleteData = () => {
    setDeleteRodal(false);
    deleteOfficials(dataToDelete.officials.length - 1);
  };

  // DELETE OFFICIALS IN KONTINGEN
  const deleteOfficials = (officialIndex: number) => {
    if (officialIndex >= 0) {
      const id = dataToDelete.officials[officialIndex];
      deletePerson(
        "officials",
        {
          namaLengkap: `${dataToDelete.officials.length} official`,
          idKontingen: dataToDelete.id,
          fotoUrl: `officials/${id}-image`,
          id: id,
        },
        dataToDelete,
        toastId,
        () => afterDeleteOfficial(officialIndex)
      );
    } else {
      deletePesertas(dataToDelete.pesertas.length - 1);
    }
  };

  const afterDeleteOfficial = (officialIndex: number) => {
    if (officialIndex != 0) {
      deleteOfficials(officialIndex - 1);
    } else {
      deletePesertas(dataToDelete.pesertas.length - 1);
    }
  };

  // DELETE PESERTAS IN KONTINGEN
  const deletePesertas = (pesertaIndex: number) => {
    if (pesertaIndex >= 0) {
      const id = dataToDelete.pesertas[pesertaIndex];
      deletePerson(
        "pesertas",
        {
          namaLengkap: `${dataToDelete.pesertas.length} peserta`,
          idKontingen: dataToDelete.id,
          fotoUrl: `pesertas/${id}-image`,
          id: id,
        },
        dataToDelete,
        toastId,
        () => afterDeletePeserta(pesertaIndex)
      );
    } else {
      deleteKontingen();
    }
  };

  const afterDeletePeserta = (pesertaIndex: number) => {
    if (pesertaIndex != 0) {
      deletePesertas(pesertaIndex - 1);
    } else {
      deleteKontingen();
    }
  };

  // DELETE KONTINGEN FINAL
  const deleteKontingen = () => {
    newToast(toastId, "loading", "Menghapus Kontingen");
    deleteDoc(doc(firestore, "kontingens", dataToDelete.id))
      .then(() => updateToast(toastId, "success", "Kontingen berhasil dihapus"))
      .catch((error) => {
        updateToast(
          toastId,
          "error",
          `Gagal menghapus kontingen. ${error.code}`
        );
      })
      .finally(() => {
        refreshKontingens();
        cancelDelete();
      });
  };

  const cancelDelete = () => {
    setDeleteRodal(false);
    setDataToDelete(kontingenInitialValue);
  };

  return (
    <div>
      <h1 className="capitalize mb-1 text-3xl font-bold border-b-2 border-black w-fit">
        Tabel Kontingen
      </h1>

      {/* <UpdateKontingen /> */}

      {/* DELETE RODAL */}
      <RodalKontingen
        modalVisible={deleteRodal}
        setModalVisible={setDeleteRodal}
        dataToDelete={dataToDelete}
        cancelDelete={cancelDelete}
        deleteData={deleteData}
      />

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
            {/* {tabelHead.map((item) => (
              <th key={item}>{item}</th>
            ))} */}
            <th>No</th>
            <th>ID Kontingen</th>
            <th>Nama Kontingen</th>
            <th>Peserta</th>
            <th>Official</th>
            <th>Pembayaran</th>
            <th>
              Belum Lunas
              <br />
              Kontingen
            </th>
            <th>
              Belum Lunas
              <br />
              Peserta
            </th>
            <th>Delete</th>
            <th>Konfirmasi</th>
            <th>Email Pendaftar</th>
            <th>Waktu Pendaftaran</th>
            <th>Waktu Perubahan</th>
          </tr>
        </thead>
        <tbody>
          {kontingensToMap
            .sort(compare("namaKontingen", "asc"))
            .map((kontingen: KontingenState, i: number) => (
              <tr
                key={kontingen.id}
                className={`border_td ${
                  getPesertasByKontingen(pesertas, kontingen.id).length == 0 &&
                  "text-red-500"
                }`}
              >
                <td>{i + 1}</td>
                <td>{kontingen.id}</td>
                <td className="hover:text-green-500 hover:underline transition cursor-pointer">
                  <button onClick={() => setSelectedKontingen(kontingen)}>
                    {kontingen.namaKontingen.toUpperCase()}
                  </button>
                </td>
                <td>{getPesertasByKontingen(pesertas, kontingen.id).length}</td>
                <td>
                  {getOfficialsByKontingen(officials, kontingen.id).length}
                </td>
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
                                <Link
                                  href={`admin/pembayaran/${idPembayaran}`}
                                  target="_blank"
                                  className="hover:text-green-500 hover:underline transition"
                                >
                                  Confirmed by{" "}
                                  {
                                    kontingen.infoKonfirmasi[
                                      kontingen.infoKonfirmasi.findIndex(
                                        (info) =>
                                          info.idPembayaran == idPembayaran
                                      )
                                    ].email
                                  }
                                </Link>
                              ) : (
                                <Link
                                  href={`admin/pembayaran/${idPembayaran}`}
                                  target="_blank"
                                  className="hover:text-green-500 hover:underline transition"
                                >
                                  Konfirmasi
                                </Link>
                              )}
                            </span>
                          </li>
                        ))
                      : "-"}
                  </ul>
                </td>
                <td className="whitespace-nowrap">
                  Rp.{" "}
                  {getKontingenUnpaid(kontingen, pesertas).toLocaleString("id")}
                </td>
                <td className="whitespace-nowrap">
                  Rp.{" "}
                  {getKontingenUnpaid(kontingen, pesertas, true).toLocaleString(
                    "id"
                  )}
                </td>
                <td>
                  {getPesertasByKontingen(pesertas, kontingen.id).length ==
                  0 ? (
                    <button
                      className="btn_red"
                      onClick={() => handleDelete(kontingen)}
                    >
                      Delete
                    </button>
                  ) : (
                    "-"
                  )}
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
