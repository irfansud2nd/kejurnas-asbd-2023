"use client";
import FullLoading from "@/components/loading/FullLoading";
import { formatTanggal } from "@/utils/adminFunctions";
import { firestore } from "@/utils/firebase";
import {
  jenisPertandingan,
  kontingenInitialValue,
} from "@/utils/formConstants";
import { getGroupedPeserta } from "@/utils/formFunctions";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import { MyContext } from "@/context/Context";

const PembayaranAdmin = ({ idPembayaran }: { idPembayaran: string }) => {
  const [kontingen, setKontingen] = useState(kontingenInitialValue);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [nominalToConfirm, setNominalToConfirm] = useState<string>("");
  const [overrideNominal, setOverrideNominal] = useState<string>("");
  const [pesertasToConfirm, setPesertasToConfirm] = useState<string[]>([]);
  const [pesertaToDeletePayment, setPesertaToDeletePayment] = useState<
    string[]
  >([]);
  const [biayaKontingen, setBiayaKontingen] = useState("");
  const [infoPembayaran, setInfoPembayaran] = useState<{
    idPembayaran: string;
    noHp: string;
    waktu: string;
    buktiUrl: string;
    nominal: string;
  }>();
  const [cancelPaymentKontingen, setCancelPatmentKontingen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = MyContext();

  const toastId = useRef(null);

  const getKontingen = async () => {
    return getDocs(
      query(
        collection(firestore, "kontingens"),
        where("idPembayaran", "array-contains", idPembayaran)
      )
    ).then((res) =>
      res.forEach((doc) => setKontingen(doc.data() as KontingenState))
    );
  };

  const getPesertas = async () => {
    let result: any[] = [];
    return getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", idPembayaran)
      )
    )
      .then((res) => res.forEach((doc) => result.push(doc.data())))
      .finally(() => setPesertas(result));
  };

  useEffect(() => {
    refresh();
  }, []);

  const refresh = () => {
    setLoading(true);
    getKontingen().then(() => getPesertas().then(() => setLoading(false)));
  };

  useEffect(() => {
    if (kontingen.id) {
      setInfoPembayaran(
        kontingen.infoPembayaran[
          kontingen.infoPembayaran.findIndex(
            (item) => item.idPembayaran == idPembayaran
          )
        ]
      );
    }
  }, [kontingen]);

  const handleCheck = (idPeserta: string, konfirmasi: boolean) => {
    if (konfirmasi && pesertasToConfirm.indexOf(idPeserta) < 0) {
      setPesertasToConfirm((prev) => [...prev, idPeserta]);
    } else {
      const arr = [...pesertasToConfirm];
      arr.splice(arr.indexOf(idPeserta), 1);
      setPesertasToConfirm(arr);
    }
  };

  useEffect(() => {
    if (pesertasToConfirm.length || biayaKontingen) {
      let container: PesertaState[] = [];
      let total = 0;
      let nominal = "";
      pesertas.map((peserta) => {
        if (pesertasToConfirm.indexOf(peserta.id) >= 0) {
          {
            container.push(peserta);
          }
        }
      });

      total +=
        getGroupedPeserta(container).nonAsbd * 325000 +
        getGroupedPeserta(container).asbdTunggal * 250000 +
        getGroupedPeserta(container).asbdRegu * 225000;

      if (biayaKontingen) {
        total += 125000;
      }

      if (overrideNominal) {
        nominal = `Rp. ${(Number(overrideNominal) / 1000).toLocaleString(
          "id"
        )}`;
      } else {
        nominal = `Rp. ${(total / 1000).toLocaleString("id")}`;
      }

      setNominalToConfirm(`${nominal}.${infoPembayaran?.noHp.slice(-3)}`);
    } else {
      setNominalToConfirm("-");
    }
  }, [pesertasToConfirm, biayaKontingen, overrideNominal]);

  useEffect(() => {
    let container: string[] = [];
    if (pesertas.length) {
      pesertas.map((peserta) => {
        if (peserta.confirmedPembayaran) container.push(peserta.id);
      });
    }
    setPesertasToConfirm(container);
    if (kontingen.id) {
      if (kontingen.biayaKontingen) setBiayaKontingen(idPembayaran);
    }
  }, [pesertas, kontingen]);

  const confirmPayment = () => {
    let unpaidContainer: string[] = [];
    const time = Date.now();
    konfirmasiPeserta(pesertasToConfirm.length - 1, time);
    pesertas.map((peserta) => {
      if (!pesertasToConfirm.includes(peserta.id)) {
        unpaidContainer.push(peserta.id);
      }
    });
    setPesertaToDeletePayment(unpaidContainer);
  };

  const konfirmasiPeserta = (index: number, time: number) => {
    if (index == pesertasToConfirm.length - 1)
      newToast(toastId, "loading", "Mengkonfirmasi Pembayaran");
    if (index < 0) {
      konfirmasiKontingen(time);
    } else {
      updateDoc(doc(firestore, "pesertas", pesertasToConfirm[index]), {
        confirmedPembayaran: true,
        infoKonfirmasi: {
          nama: user.displayName,
          email: user.email,
          waktu: time,
        },
      })
        .then(() =>
          index > 0
            ? konfirmasiPeserta(index - 1, time)
            : konfirmasiKontingen(time)
        )
        .catch((error) => alert(error));
    }
  };

  const cancelPayment = () => {
    newToast(toastId, "loading", "Membatalkan Pembayaran");
    if (confirm("Apakah anda Yakin")) {
      let container: string[] = [];
      pesertas.map((peserta) => container.push(peserta.id));
      setPesertaToDeletePayment(container);
      setCancelPatmentKontingen(true);
    } else {
      setPesertaToDeletePayment([]);
      setCancelPatmentKontingen(false);
    }
  };

  useEffect(() => {
    if (pesertaToDeletePayment.length) {
      deletePaymentPeserta(pesertaToDeletePayment.length - 1);
    }
  }, [pesertaToDeletePayment]);

  const deletePaymentPeserta = (index: number) => {
    if (index < 0) {
      if (cancelPaymentKontingen) {
        deletePaymentKontingen();
      } else {
        updateToast(toastId, "success", "Pembayaran Berhasil dibatalkan");
      }
    } else {
      updateDoc(doc(firestore, "pesertas", pesertaToDeletePayment[index]), {
        idPembayaran: "",
        pembayaran: false,
        infoPembayaran: {
          noHp: "",
          waktu: "",
          buktiUrl: "",
        },
      })
        .then(() => deletePaymentPeserta(index - 1))
        .catch((error) => alert(error));
    }
  };

  if (loading || !kontingen.id || !infoPembayaran?.idPembayaran) {
    return <FullLoading />;
  }

  const konfirmasiKontingen = (time: number) => {
    updateDoc(doc(firestore, "kontingens", kontingen.id), {
      pembayaran: arrayRemove(idPembayaran),
    })
      .then(() => {
        updateDoc(doc(firestore, "kontingens", kontingen.id), {
          biayaKontingen: biayaKontingen,
          unconfirmedPembayaran:
            kontingen.idPembayaran.length !=
            kontingen.confirmedPembayaranIds.length,
          confirmedPembayaran:
            kontingen.idPembayaran.length !=
            kontingen.confirmedPembayaranIds.length,
          unconfirmedPembayaranIds: arrayRemove(idPembayaran),
          confirmedPembayaranIds: arrayUnion(idPembayaran),
          infoPembayaran: arrayRemove({
            idPembayaran: idPembayaran,
            nominal: infoPembayaran.nominal,
            noHp: infoPembayaran.noHp,
            waktu: infoPembayaran.waktu,
            buktiUrl: infoPembayaran.buktiUrl,
          }),
          infoKonfirmasi: arrayUnion({
            idPembayaran: idPembayaran,
            nama: user.displayName,
            email: user.email,
            waktu: time,
          }),
        })
          .then(() => {
            updateDoc(doc(firestore, "kontingens", kontingen.id), {
              infoPembayaran: arrayUnion({
                idPembayaran: idPembayaran,
                nominal: nominalToConfirm,
                noHp: infoPembayaran.noHp,
                waktu: infoPembayaran.waktu,
                buktiUrl: infoPembayaran.buktiUrl,
              }),
            }).then(() =>
              updateToast(toastId, "success", "Konfirmasi berhasil")
            );
          })
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  const deletePaymentKontingen = () => {
    updateDoc(doc(firestore, "kontingens", kontingen.id), {
      pembayaran: false,
      biayaKontingen:
        kontingen.biayaKontingen == idPembayaran ? "" : biayaKontingen,
      idPembayaran: arrayRemove(idPembayaran),
      unconfirmedPembayaranIds: arrayRemove(idPembayaran),
      infoPembayaran: arrayRemove({
        idPembayaran: idPembayaran,
        nominal: infoPembayaran.nominal,
        noHp: infoPembayaran.noHp,
        waktu: infoPembayaran.waktu,
        buktiUrl: infoPembayaran.buktiUrl,
      }),
    })
      .then(() =>
        updateToast(toastId, "success", "Pembayaran Berhasil dibatalkan")
      )
      .catch((error) => alert(error));
  };

  const checkAll = () => {
    let container: string[] = [];
    if (pesertas.length == pesertasToConfirm.length && biayaKontingen) {
      setPesertasToConfirm([]);
      setBiayaKontingen("");
    } else {
      pesertas.map((peserta) => {
        container.push(peserta.id);
      });
      setPesertasToConfirm(container);
      setBiayaKontingen(idPembayaran);
    }
  };

  return (
    <div className="bg-white m-2 p-2">
      <ToastContainer />
      <h1 className="font-bold text-xl">
        Konfirmasi Pembayaran - {kontingen.namaKontingen}
      </h1>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 items-end">
          {/* TABEL PESERTA */}
          <table className="h-fit">
            <thead>
              <tr className="border-x-black border-x">
                <th>No</th>
                <th>Nama Peserta</th>
                <th>Jenis Kelamin</th>
                <th>Tingkatan</th>
                <th>Jenis Pertandingan</th>
                <th>Kelas Pertandingan</th>
                <th>Konfirmasi</th>
              </tr>
            </thead>
            <tbody>
              {(kontingen.biayaKontingen == "" ||
                kontingen.biayaKontingen == idPembayaran) && (
                <tr className="border_td">
                  <td colSpan={6}>BIAYA PENDAFTARAN KONTINGEN</td>
                  <td className="text-center">
                    <button
                      onClick={() =>
                        setBiayaKontingen((prev) => (prev ? "" : idPembayaran))
                      }
                      className={`text-${biayaKontingen ? "green" : "red"}-500`}
                    >
                      {biayaKontingen ? (
                        <ImCheckboxChecked />
                      ) : (
                        <ImCheckboxUnchecked />
                      )}
                    </button>
                  </td>
                </tr>
              )}
              {pesertas.map((peserta, i) => (
                <tr key={peserta.id} className="border_td">
                  <td>{i + 1}</td>
                  <td>{peserta.namaLengkap.toUpperCase()}</td>
                  <td>{peserta.tingkatanPertandingan}</td>
                  <td>{peserta.jenisKelamin}</td>
                  <td>{peserta.jenisPertandingan}</td>
                  <td className="whitespace-nowrap">
                    {peserta.jenisPertandingan === jenisPertandingan[2] ? (
                      <span>
                        Sabuk {peserta.sabuk} | {peserta.jurus}
                        <br />
                        {peserta.kategoriPertandingan}
                      </span>
                    ) : (
                      peserta.kategoriPertandingan
                    )}
                    {peserta.jenisPertandingan === jenisPertandingan[2] &&
                      !peserta.kategoriPertandingan.includes("Tunggal") &&
                      ` | Tim ${peserta.namaTim}`}
                  </td>
                  <td className="text-xl text-center pt-1">
                    {pesertasToConfirm.indexOf(peserta.id) < 0 ? (
                      <button
                        onClick={() => handleCheck(peserta.id, true)}
                        className="text-red-500"
                      >
                        <ImCheckboxUnchecked />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheck(peserta.id, false)}
                        className="text-green-500"
                      >
                        <ImCheckboxChecked />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className={`btn_${
              pesertas.length == pesertasToConfirm.length && biayaKontingen
                ? "red"
                : "green"
            }`}
            onClick={checkAll}
          >
            {pesertas.length == pesertasToConfirm.length && biayaKontingen
              ? "Uncheck All"
              : "Check All"}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {/* BUKTI PEMBAYARAN */}
          <img
            src={infoPembayaran.buktiUrl}
            className="w-full h-[400px] object-contain rounded-md border-2 border-black"
          />
          {/* CUSTOM NOMINAL */}
          <div>
            <p>Custom Nominal</p>
            <input
              type="text"
              onChange={(e) =>
                setOverrideNominal(e.target.value.replace(/[^0-9]/g, ""))
              }
              value={overrideNominal}
            />
          </div>
          {/* TABEL INFORMASI PEMBAYARAN */}
          <table>
            <thead>
              <tr>
                <th>Keterangan</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border_td">
                <td>ID Pembayaran</td>
                <td>{idPembayaran}</td>
              </tr>
              <tr className="border_td">
                <td>Nominal transaksi seharusnya</td>
                <td>{infoPembayaran.nominal}</td>
              </tr>
              <tr className="border_td">
                <td>Nominal transaksi yang akan dikonfirmasi</td>
                <td>{nominalToConfirm}</td>
              </tr>
              <tr className="border_td">
                <td>No HP</td>
                <td>{infoPembayaran.noHp}</td>
              </tr>
              <tr className="border_td">
                <td>Waktu pembayaran</td>
                <td>{formatTanggal(infoPembayaran.waktu, true)}</td>
              </tr>
              <tr className="border_td">
                <td>Status</td>
                {kontingen.confirmedPembayaranIds.includes(idPembayaran) ? (
                  <td className="bg-green-500 text-white">CONFIRMED</td>
                ) : (
                  <td className="bg-red-500 text-white">UNCONFIRMED</td>
                )}
              </tr>
            </tbody>
          </table>
          {/* BUTTONS */}
          <div className="flex gap-1">
            <button className="btn_green" onClick={confirmPayment}>
              Save Konfirmasi
            </button>
            <button
              className="btn_red disabled:border-none disabled:hover:text-gray-500"
              onClick={cancelPayment}
              disabled={kontingen.confirmedPembayaranIds.includes(idPembayaran)}
            >
              Batalkan Pembayaaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PembayaranAdmin;
