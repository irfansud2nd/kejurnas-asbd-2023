import { MyContext } from "@/context/Context";
import { firestore } from "@/utils/firebase";
import { KontingenState } from "@/utils/formTypes";
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
import { useState, useRef } from "react";
import Rodal from "rodal";
import "rodal/lib/rodal.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from "@/context/AdminContext";
import Link from "next/link";

const KonfirmasiButton = ({
  idPembayaran,
  infoPembayaran,
  data,
}: {
  idPembayaran: string;
  infoPembayaran: {
    idPembayaran: string;
    nominal: string;
    noHp: string;
    waktu: string;
    buktiUrl: string;
  };
  data: KontingenState;
}) => {
  const [rodalVisible, setRodalVisible] = useState(false);
  const [pesertasToConfirm, setPesertasToConfirm] = useState<string[]>([]);

  const { user } = MyContext();
  const { refreshKontingens } = AdminContext();

  const toastId = useRef(null);

  const konfirmasiHandler = () => {
    setRodalVisible(true);
    getPesertasToConfirm();
  };

  const getPesertasToConfirm = () => {
    let container: any[] = [];
    getDocs(
      query(
        collection(firestore, "pesertas"),
        where("idPembayaran", "==", idPembayaran)
      )
    )
      .then((res) =>
        res.forEach((doc) => {
          container.push(doc.data().id);
        })
      )
      .finally(() => {
        setPesertasToConfirm(container);
      });
  };

  const konfirmasi = () => {
    const time = Date.now();
    konfirmasiPeserta(pesertasToConfirm.length - 1, time);
  };

  const konfirmasiPeserta = (index: number, time: number) => {
    newToast(toastId, "loading", "Mengkonfirmasi Pembayaran");
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
  };

  const konfirmasiKontingen = (time: number) => {
    updateDoc(doc(firestore, "kontingens", data.id), {
      pembayaran: arrayRemove(idPembayaran),
    })
      .then(() => {
        updateDoc(doc(firestore, "kontingens", data.id), {
          unconfirmedPembayaran:
            data.idPembayaran.length != data.confirmedPembayaranIds.length,
          confirmedPembayaran:
            data.idPembayaran.length != data.confirmedPembayaranIds.length,
          unconfirmedPembayaranIds: arrayRemove(idPembayaran),
          confirmedPembayaranIds: arrayUnion(idPembayaran),
          infoKonfirmasi: arrayUnion({
            idPembayaran: idPembayaran,
            nama: user.displayName,
            email: user.email,
            waktu: time,
          }),
        })
          .then(() => {
            setRodalVisible(false);
            refreshKontingens();
            updateToast(toastId, "success", "Konfirmasi berhasil");
          })
          .catch((error) => alert(error));
      })
      .catch((error) => alert(error));
  };

  const resetKonfirmasi = () => {
    setRodalVisible(false);
    setPesertasToConfirm([]);
  };
  return (
    <>
      <ToastContainer />
      <Rodal
        visible={rodalVisible}
        onClose={resetKonfirmasi}
        customStyles={{
          height: "fit-content",
          width: "fit-content",
          maxHeight: "100vh",
          maxWidth: "100vw",
          overflowY: "auto",
          overflowX: "auto",
        }}
      >
        <h1>Konfirmasi Pembayaran</h1>
        <p>Jumlah Peserta: {pesertasToConfirm.length}</p>
        <p>Jumlah Nominal: {infoPembayaran.nominal}</p>
        <div className="w-[300px] h-[400px] border-2 border-custom-navy relative">
          {infoPembayaran.buktiUrl ? (
            <img
              src={infoPembayaran.buktiUrl}
              alt="bukti pembayaran"
              className="w-[300px] h-[400px] object-contain"
            />
          ) : null}
        </div>
        <div className="flex w-full justify-center gap-2 mt-1">
          {pesertasToConfirm.length && (
            <button className="btn_green btn_full" onClick={konfirmasi}>
              Konfirmasi
            </button>
          )}
          <button className="btn_red btn_full" onClick={resetKonfirmasi}>
            Batal
          </button>
        </div>
      </Rodal>
      <div className="border-b w-fit hover:border-b-custom-gold hover:text-custom-gold transition">
        <button
          onClick={konfirmasiHandler}
          className="hover:text-green-500 hover:underline transition"
        >
          Konfirmasi
        </button>
      </div>
    </>
  );
};
export default KonfirmasiButton;
