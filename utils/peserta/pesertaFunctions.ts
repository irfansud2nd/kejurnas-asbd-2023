import { DocumentData } from "firebase/firestore";
import { ErrorPeserta, PesertaState } from "../formTypes";
import { jenisPertandingan } from "../formConstants";

// ERROR MESSAGE PESERTA
export const getInputErrorPeserta = (
  data: PesertaState | DocumentData,
  imageUrl: string | null,
  error: ErrorPeserta,
  setError: React.Dispatch<React.SetStateAction<ErrorPeserta>>
) => {
  setError({
    ...error,
    pasFoto: imageUrl ? null : "Tolong lengkapi Pas Foto",
    namaLengkap: data.namaLengkap == "" ? "Tolong lengkapi Nama Lengkap" : null,
    NIK:
      data.NIK.length != 0 && data.NIK.length != 16
        ? "NIK tidak valid (16 Digit)"
        : null,
    jenisKelamin:
      data.jenisKelamin == "" ? "Tolong lengkapi Jenis Kelamin" : null,
    alamatLengkap:
      data.alamatLengkap == "" ? "Tolong lengkapi Alamat Lengkap" : null,
    tempatLahir: data.tempatLahir == "" ? "Tolong lengkapi Tempat Lahir" : null,
    tanggalLahir:
      data.tanggalLahir == "" ? "Tolong lengkapi Tanggal Lahir" : null,
    tinggiBadan: data.tinggiBadan == "" ? "Tolong lengkapi Tinggi Badan" : null,
    beratBadan: data.beratBadan == "" ? "Tolong lengkapi Berat Badan" : null,
    idKontingen:
      data.idKontingen == "" ? "Tolong lengkapi Nama Kontingen" : null,
    tingkatanPertandingan:
      data.tingkatanPertandingan == ""
        ? "Tolong lengkapi Tingkatan Pertandingan"
        : null,
    jenisPertandingan:
      data.jenisPertandingan == ""
        ? "Tolong lengkapi Jenis Pertandingan"
        : null,
    kategoriPertandingan:
      data.kategoriPertandingan == ""
        ? "Tolong lengkapi kategori Pertandingan"
        : null,
    namaTim:
      (data.kategoriPertandingan.split(" ")[0] == "Regu" ||
        data.kategoriPertandingan.split(" ")[0] == "Ganda") &&
      data.namaTim == ""
        ? "Tolong lengkapi nama Tim"
        : null,
  });
  if (
    imageUrl &&
    data.namaLengkap &&
    (data.NIK.length == 0 || data.NIK.length == 16) &&
    data.jenisKelamin &&
    data.alamatLengkap &&
    data.tempatLahir &&
    data.tanggalLahir &&
    data.tinggiBadan &&
    data.beratBadan &&
    data.idKontingen &&
    data.tingkatanPertandingan &&
    data.jenisPertandingan &&
    data.kategoriPertandingan &&
    (data.namaTim ||
      (data.kategoriPertandingan.split(" ")[0] !== "Regu" &&
        data.kategoriPertandingan.split(" ")[0] !== "Ganda"))
  ) {
    return true;
  } else {
    return false;
  }
};

// GROUPING UNPAID PESERTA
export const getGroupedUnpaidPeserta = (pesertas: PesertaState[]) => {
  let nonAsbd = 0;
  let asbdTunggal = 0;
  let asbdRegu = 0;

  pesertas.map((peserta) => {
    if (!peserta.pembayaran) {
      if (peserta.jenisPertandingan == jenisPertandingan[2]) {
        if (peserta.kategoriPertandingan.split(" ")[0] == "Tunggal") {
          asbdTunggal += 1;
        } else {
          asbdRegu += 1;
        }
      } else {
        nonAsbd += 1;
      }
    }
  });

  return { nonAsbd, asbdTunggal, asbdRegu };
};

// GET GROUPED PESERTA
export const getGroupedPeserta = (pesertas: PesertaState[]) => {
  let nonAsbd = 0;
  let asbdTunggal = 0;
  let asbdRegu = 0;

  pesertas.map((peserta) => {
    if (peserta.jenisPertandingan == jenisPertandingan[2]) {
      if (peserta.kategoriPertandingan.split(" ")[0] == "Tunggal") {
        asbdTunggal += 1;
      } else {
        asbdRegu += 1;
      }
    } else {
      nonAsbd += 1;
    }
  });

  return { nonAsbd, asbdTunggal, asbdRegu };
};

export const filterPesertaByIdKontingen = (
  pesertas: PesertaState[],
  idKontignen: string
) => {
  return pesertas.filter((item) => item.idKontingen == idKontignen);
};
