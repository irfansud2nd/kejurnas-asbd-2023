// DATA FETCHER - START

import {
  DocumentData,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { KontingenState, OfficialState, PesertaState } from "./formTypes";
import { firestore } from "./firebase";
import Peserta from "@/components/halaman-pendaftaran/parts/Peserta";
import { getGroupedUnpaidPeserta } from "./formFunctions";

// GET KONTINGEN
export const getAllKontingen = async () => {
  try {
    let result: DocumentData | KontingenState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "kontingens"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data kontingen, ${error.code}`);
  }
};

// GET OFFICIALS
export const getAllOfficial = async () => {
  try {
    let result: DocumentData | OfficialState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "officials"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data official, ${error.code}`);
  }
};

// GET PESERTAS
export const getAllPeserta = async () => {
  try {
    let result: DocumentData | PesertaState[] | [] = [];
    const querySnapshot = await getDocs(collection(firestore, "pesertas"));
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data peserta, ${error.code}`);
  }
};
// DATA FETCHER - END

// DATA FETCHER BY ID KONTINGEN
export const getPesertasByKontingen = (
  idKontingen: string,
  pesertas: PesertaState[]
) => {
  let result: PesertaState[] = [];

  pesertas.map((peserta) => {
    if (peserta.idKontingen == idKontingen) result.push(peserta);
  });

  return result;

  //   try {
  //     let result: DocumentData | PesertaState[] | [] = [];
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(firestore, "pesertas"),
  //         where("idKontingen", "==", idKontingen)
  //       )
  //     );
  //     querySnapshot.forEach((doc) => result.push(doc.data()));
  //     return result;
  //   } catch (error: any) {
  //     throw new Error(`Gagal mendapatkan data peserta, ${error.code}`);
  //   }
};

export const getKontingenUnpaid = (
  kontingen: KontingenState,
  pesertas: PesertaState[]
) => {
  let paidNominal = 0;

  kontingen.infoPembayaran.map((info) => {
    paidNominal += Number(info.nominal.replace("Rp. ", "").replace(".", ""));
  });

  const filteredPesertas = getPesertasByKontingen(kontingen.id, pesertas);
  const nominalToPay =
    getGroupedUnpaidPeserta(filteredPesertas).nonAsbd * 325000 +
    getGroupedUnpaidPeserta(filteredPesertas).asbdTunggal * 250000 +
    getGroupedUnpaidPeserta(filteredPesertas).asbdRegu * 225000 +
    125000;

  return nominalToPay - paidNominal;
};

export const formatTanggal = (
  tgl: string | number | undefined,
  withHour?: boolean
) => {
  if (tgl) {
    const date = new Date(tgl);
    if (withHour) {
      return `${date.getDate()} ${date.toLocaleString("id", {
        month: "short",
      })}, ${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
    } else {
      return `${date.getDate()} ${date.toLocaleString("id", {
        month: "short",
      })}, ${date.getFullYear()}`;
    }
  } else {
    return "-";
  }
};

// FIND NAMA KONTINGEN
export const findNamaKontingen = (
  dataKontingen: KontingenState[],
  idKontingen: string
) => {
  const index = dataKontingen.findIndex(
    (kontingen) => kontingen.id == idKontingen
  );
  return dataKontingen[index]
    ? dataKontingen[index].namaKontingen
    : "kontingen not found";
};