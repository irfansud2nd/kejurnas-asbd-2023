"use client";
import FullLoading from "@/components/loading/FullLoading";
import { formatTanggal } from "@/utils/admin/adminFunctions";
import {
  jenisPertandingan,
  kontingenInitialValue,
} from "@/utils/formConstants";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { useEffect, useRef, useState } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import { MyContext } from "@/context/Context";
import { controlToast } from "@/utils/sharedFunctions";
import { getGroupedPeserta } from "@/utils/peserta/pesertaFunctions";
import { fetchData, toastError } from "@/utils/functions";
import { getKontingenByIdPembayaran } from "@/utils/kontingen/kontingenActions";
import { getPesertasByIdPembayaran } from "@/utils/peserta/pesertaActions";
import { updateData } from "@/utils/actions";

const PembayaranAdmin = ({ idPembayaran }: { idPembayaran: string }) => {
  const [kontingen, setKontingen] = useState(kontingenInitialValue);
  const [pesertas, setPesertas] = useState<PesertaState[]>([]);
  const [nominalToConfirm, setNominalToConfirm] = useState<string>("");
  const [overrideNominal, setOverrideNominal] = useState<string>("");
  const [pesertasToConfirm, setPesertasToConfirm] = useState<PesertaState[]>(
    []
  );
  const [pesertaToDeletePayment, setPesertaToDeletePayment] = useState<
    PesertaState[]
  >([]);
  const [biayaKontingen, setBiayaKontingen] = useState("");
  const [infoPembayaran, setInfoPembayaran] = useState<{
    idPembayaran: string;
    noHp: string;
    waktu: number;
    buktiUrl: string;
    nominal: string;
  }>();
  const [cancelPaymentKontingen, setCancelPatmentKontingen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = MyContext();

  const toastId = useRef(null);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const kontingen = await fetchData(() =>
        getKontingenByIdPembayaran(idPembayaran)
      );
      setKontingen(kontingen);

      const pesertas = await fetchData(() =>
        getPesertasByIdPembayaran(idPembayaran)
      );
      setPesertas(pesertas);
    } catch (error) {
      toastError(toastId, error);
    } finally {
      setLoading(false);
    }
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

  const handleCheck = (peserta: PesertaState, konfirmasi: boolean) => {
    if (
      konfirmasi &&
      !pesertasToConfirm.find((item) => item.id == peserta.id)
    ) {
      setPesertasToConfirm((prev) => [...prev, peserta]);
    } else {
      const arr = pesertasToConfirm.filter((item) => item.id != peserta.id);
      setPesertasToConfirm(arr);
    }
  };

  useEffect(() => {
    if (pesertasToConfirm.length || biayaKontingen) {
      let container: PesertaState[] = [];
      let total = 0;
      let nominal = "";
      pesertas.map((peserta) => {
        if (pesertasToConfirm.find((item) => item.id == peserta.id)) {
          {
            container.push(peserta);
          }
        }
      });

      const { nonAsbd, asbdTunggal, asbdRegu } = getGroupedPeserta(container);

      total += nonAsbd * 325000 + asbdTunggal * 250000 + asbdRegu * 225000;

      if (biayaKontingen && kontingen.biayaKontingen == idPembayaran) {
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
    let container: PesertaState[] = [];
    if (pesertas.length) {
      pesertas.map((peserta) => {
        if (peserta.confirmedPembayaran) container.push(peserta);
      });
    }
    setPesertasToConfirm(container);
    if (kontingen.id) {
      setBiayaKontingen(kontingen.biayaKontingen);
    }
  }, [pesertas, kontingen]);

  const confirmPayment = async () => {
    const time = Date.now();

    controlToast(toastId, "loading", "Mengkonfirmasi Pembayaran", true);

    try {
      await confirmPesertas(pesertasToConfirm, time);

      const pesertaToDeletePayment = pesertas.filter(
        (peserta) =>
          !pesertasToConfirm.find(
            (pesertaToConfirm) => pesertaToConfirm.id == peserta.id
          )
      );

      setPesertaToDeletePayment(pesertaToDeletePayment);

      await confirmKontingen(kontingen, time);

      controlToast(toastId, "success", "Konfirmasi berhasil");
    } catch (error) {
      toastError(toastId, error);
      throw error;
    }
  };

  const confirmPesertas = async (pesertas: PesertaState[], time: number) => {
    try {
      const updatePromises = pesertas.map(async (peserta) => {
        const { result, error } = await updateData("pesertas", {
          ...peserta,
          confirmedPembayaran: true,
          infoKonfirmasi: {
            nama: user.displayName,
            email: user.email,
            waktu: time,
          },
        });

        if (error) throw error;
      });

      await Promise.all(updatePromises);
    } catch (error) {
      throw error;
    }
  };

  const confirmKontingen = async (kontingen: KontingenState, time: number) => {
    try {
      if (!infoPembayaran) throw { message: "Info pembayaran tidak lengkap" };

      let updatedKontingen: KontingenState = { ...kontingen };

      updatedKontingen.biayaKontingen = biayaKontingen;

      updatedKontingen.unconfirmedPembayaran =
        updatedKontingen.idPembayaran.length >=
        updatedKontingen.confirmedPembayaranIds.length;

      updatedKontingen.confirmedPembayaran =
        !updatedKontingen.unconfirmedPembayaran;

      updatedKontingen.unconfirmedPembayaranIds =
        updatedKontingen.unconfirmedPembayaranIds.filter(
          (id) => id != idPembayaran
        );

      updatedKontingen.confirmedPembayaranIds = [
        ...updatedKontingen.confirmedPembayaranIds,
        idPembayaran,
      ];

      updatedKontingen.infoPembayaran = updatedKontingen.infoPembayaran.filter(
        (item) => item.idPembayaran != idPembayaran
      );

      updatedKontingen.infoPembayaran = [
        ...updatedKontingen.infoPembayaran,
        {
          idPembayaran: idPembayaran,
          nominal: nominalToConfirm,
          noHp: infoPembayaran.noHp,
          waktu: infoPembayaran.waktu,
          buktiUrl: infoPembayaran.buktiUrl,
        },
      ];

      updatedKontingen.infoKonfirmasi = [
        ...updatedKontingen.infoKonfirmasi,
        {
          idPembayaran: idPembayaran,
          nama: user.displayName,
          email: user.email,
          waktu: time,
        },
      ];

      const { result, error } = await updateData(
        "kontingens",
        updatedKontingen
      );
      if (error) throw error;

      return result;
    } catch (error) {
      throw error;
    }
  };

  const cancelPayment = () => {
    controlToast(toastId, "loading", "Membatalkan Pembayaran", true);
    if (confirm("Apakah anda Yakin")) {
      setPesertaToDeletePayment(pesertas);
      setCancelPatmentKontingen(true);
    } else {
      setPesertaToDeletePayment([]);
      setCancelPatmentKontingen(false);
    }
  };

  useEffect(() => {
    if (pesertaToDeletePayment.length) {
      const deletePayment = async () => {
        try {
          await deletePaymentPeserta(pesertaToDeletePayment);
          if (deletePaymentKontingen) deletePaymentKontingen();
        } catch (error) {
          toastError(toastId, error);
          throw error;
        }
      };

      deletePayment();
    }
  }, [pesertaToDeletePayment]);

  const deletePaymentPeserta = async (pesertas: PesertaState[]) => {
    try {
      if (!pesertas.length) throw { message: "No pesertas to delete payment" };

      const updatePromises = pesertaToDeletePayment.map(async (peserta) => {
        let data: PesertaState = { ...peserta };
        peserta.idPembayaran = "";
        peserta.pembayaran = false;
        peserta.infoPembayaran = {
          noHp: "",
          waktu: 0,
          buktiUrl: "",
        };

        const { error } = await updateData("pesertas", data);
        if (error) throw error;
      });

      await Promise.all(updatePromises);
    } catch (error) {
      throw error;
    }
  };

  if (loading || !kontingen.id || !infoPembayaran?.idPembayaran) {
    return <FullLoading />;
  }

  const deletePaymentKontingen = async () => {
    try {
      let data: KontingenState = { ...kontingen };

      data.pembayaran = false;

      data.biayaKontingen =
        kontingen.biayaKontingen == idPembayaran ? "" : biayaKontingen;

      data.idPembayaran = data.idPembayaran.filter(
        (item) => item != idPembayaran
      );

      data.unconfirmedPembayaranIds = data.unconfirmedPembayaranIds.filter(
        (item) => item != idPembayaran
      );

      data.infoPembayaran = data.infoPembayaran.filter(
        (item) => item.idPembayaran != idPembayaran
      );

      const { error } = await updateData("kontingens", data);
      if (error) throw error;

      controlToast(toastId, "success", "Pembayaran Berhasil dibatalkan");
    } catch (error) {
      throw error;
    }
  };

  const checkAll = () => {
    let container: string[] = [];
    if (pesertas.length == pesertasToConfirm.length && biayaKontingen) {
      setPesertasToConfirm([]);
      setBiayaKontingen("");
    } else {
      setPesertasToConfirm(pesertas);
      setBiayaKontingen(
        kontingen.biayaKontingen ? kontingen.biayaKontingen : idPembayaran
      );
    }
  };

  return (
    <div className="bg-white m-2 p-2">
      <ToastContainer />
      <h1 className="font-bold text-xl">
        Konfirmasi Pembayaran - {kontingen.namaKontingen.toUpperCase()}
      </h1>
      <p>{biayaKontingen}</p>
      <p>{kontingen.biayaKontingen}</p>
      <div className="flex gap-2">
        <div className="flex flex-col gap-1 items-end">
          {/* TABEL PESERTA */}
          <table className="h-fit">
            <thead>
              <tr className="border-x-black border-x">
                <th>No</th>
                <th>ID Kontingen</th>
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
                  <td colSpan={7}>BIAYA PENDAFTARAN KONTINGEN</td>
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
                  <td>{peserta.idKontingen}</td>
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
                    {pesertasToConfirm.find((item) => item.id == peserta.id) ? (
                      <button
                        onClick={() => handleCheck(peserta, true)}
                        className="text-red-500"
                      >
                        <ImCheckboxUnchecked />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCheck(peserta, false)}
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
