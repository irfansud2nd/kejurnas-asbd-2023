"use client";
import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { firestore } from "@/utils/firebase";
import {
  collection,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
const TabelPembayaran = () => {
  const { getUnconfirmesKontingens } = AdminContext();

  const [peserta, setPeserta] = useState<{
    confirmed: number;
    unconfirmed: number;
    paid: number;
    unpaid: number;
  }>({
    confirmed: 0,
    unconfirmed: 0,
    paid: 0,
    unpaid: 0,
  });
  const [kontingen, setKontingen] = useState<{
    confirmed: number;
    unconfirmed: number;
    paid: number;
    unpaid: number;
  }>({
    confirmed: 0,
    unconfirmed: 0,
    paid: 0,
    unpaid: 0,
  });
  const [loading, setLoading] = useState(true);

  const getPesertaPayment = () => {
    let confirmed = 0;
    let unconfirmed = 0;
    let paid = 0;
    let unpaid = 0;

    setLoading(true);

    const stepController = (step: number) => {
      switch (step) {
        case 1:
          getCountFromServer(
            query(
              collection(firestore, "pesertas"),
              where("pembayaran", "==", true)
            )
          ).then((res) => {
            paid = res.data().count;
            stepController(2);
          });
          break;
        case 2:
          getCountFromServer(
            query(
              collection(firestore, "pesertas"),
              where("pembayaran", "==", false)
            )
          ).then((res) => {
            unpaid = res.data().count;
            stepController(3);
          });
          break;
        case 3:
          getCountFromServer(
            query(
              collection(firestore, "pesertas"),
              where("confirmedPembayaran", "==", true)
            )
          ).then((res) => {
            confirmed = res.data().count;
            stepController(4);
          });
          break;
        case 4:
          getCountFromServer(
            query(
              collection(firestore, "pesertas"),
              where("confirmedPembayaran", "==", false),
              where("pembayaran", "==", true)
            )
          ).then((res) => {
            unconfirmed = res.data().count;
            stepController(5);
          });
          break;
        case 5:
          setPeserta({ confirmed, unconfirmed, paid, unpaid });
          getKontingenPayment();
          break;
      }
    };
    stepController(1);
  };

  const getKontingenPayment = () => {
    let confirmed = 0;
    let unconfirmed = 0;
    let paid = 0;
    let unpaid = 0;
    const stepController = (step: number) => {
      switch (step) {
        case 1:
          getCountFromServer(
            query(
              collection(firestore, "kontingens"),
              where("pembayaran", "==", true)
            )
          ).then((res) => {
            paid = res.data().count;
            stepController(2);
          });
          break;
        case 2:
          getCountFromServer(
            query(
              collection(firestore, "kontingens"),
              where("pembayaran", "==", false)
            )
          ).then((res) => {
            unpaid = res.data().count;
            stepController(3);
          });
          break;
        case 3:
          getCountFromServer(
            query(
              collection(firestore, "kontingens"),
              where("confirmedPembayaran", "==", true)
            )
          ).then((res) => {
            confirmed = res.data().count;
            stepController(4);
          });
          break;
        case 4:
          getCountFromServer(
            query(
              collection(firestore, "kontingens"),
              where("unconfirmedPembayaran", "==", true)
            )
          ).then((res) => {
            unconfirmed = res.data().count;
            stepController(5);
          });
          break;
        case 5:
          setKontingen({ confirmed, unconfirmed, paid, unpaid });
          setLoading(false);
          break;
      }
    };
    stepController(1);
  };

  const refresh = () => {
    getPesertaPayment();
    getKontingenPayment();
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md w-fit mt-2">
      <p className="font-semibold text-lg">Pembayaran</p>
      <button className="btn_green w-fit mx-auto" onClick={refresh}>
        Refresh
      </button>
      <div className="grid grid-cols-[repeat(3,_auto)] grid-rows-[repeat(4,_auto)] w-fit">
        <p className="font-semibold text-lg border-r-2 border-r-white">
          Keterangan
        </p>
        <p className="font-semibold text-lg border-r-2 border-r-white px-2">
          Peserta
        </p>
        <p className="font-semibold text-lg px-2">Kontingen</p>
        <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
          Confirmed
        </p>
        <p className="text-2xl font-extrabold text-green-500 border-r-2 border-r-white">
          {loading ? <InlineLoading /> : peserta.confirmed}
        </p>
        <p className="text-2xl font-extrabold text-green-500">
          {loading ? <InlineLoading /> : kontingen.confirmed}
        </p>
        <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white px-2">
          Unconfirmed
        </p>
        <p className="text-2xl font-extrabold text-yellow-500  border-r-2 border-r-white">
          {loading ? <InlineLoading /> : peserta.unconfirmed}
        </p>
        <button
          className="text-2xl font-extrabold text-yellow-500 hover:underline"
          onClick={getUnconfirmesKontingens}
        >
          {loading ? <InlineLoading /> : kontingen.unconfirmed}
        </button>
        <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
          Unpaid
        </p>
        <p className="text-2xl font-extrabold text-red-500  border-r-2 border-r-white">
          {loading ? <InlineLoading /> : peserta.unpaid}
        </p>
        <p className="text-2xl font-extrabold text-red-500">
          {loading ? <InlineLoading /> : kontingen.unpaid}
        </p>
      </div>
    </div>
  );
};
export default TabelPembayaran;
