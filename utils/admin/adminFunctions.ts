// DATA FETCHER - START

import { KontingenState, OfficialState, PesertaState } from "../formTypes";
import { getGroupedPeserta } from "../peserta/pesertaFunctions";

// DATA FETCHER BY ID KONTINGEN - START
export const getPesertasByKontingen = (
  pesertas: PesertaState[],
  idKontingen: string
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
export const getOfficialsByKontingen = (
  officials: OfficialState[],
  idKontingen: string
) => {
  let result: OfficialState[] = [];

  officials.map((official) => {
    if (official.idKontingen == idKontingen) result.push(official);
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

// DATA FETCHER BY ID KONTINGEN - END

export const getKontingenUnpaid = (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  byPeserta: boolean = false
) => {
  let paidNominal = 0;

  kontingen.infoPembayaran.map((info) => {
    paidNominal += Math.floor(Number(info.nominal.replace(/\D/g, "")) / 1000);
  });

  const filteredPesertas = getPesertasByKontingen(pesertas, kontingen.id);
  const { nonAsbd, asbdTunggal, asbdRegu } =
    getGroupedPeserta(filteredPesertas);
  let nominalToPay =
    nonAsbd * 325000 + asbdTunggal * 250000 + asbdRegu * 225000 + 125000;

  if (byPeserta) {
    paidNominal = 0;
    let paidPesertas: PesertaState[] = [];
    filteredPesertas.map((peserta) => {
      if (peserta.idPembayaran) {
        paidPesertas.push(peserta);
      }
    });
    const { nonAsbd, asbdTunggal, asbdRegu } = getGroupedPeserta(paidPesertas);
    paidNominal += nonAsbd * 325 + asbdTunggal * 250 + asbdRegu * 225 + 125;
  }

  return nominalToPay - paidNominal * 1000;
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
