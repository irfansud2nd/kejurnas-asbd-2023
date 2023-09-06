import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore, storage } from "./firebase";
import {
  ErrorOfficial,
  ErrorPeserta,
  KontingenState,
  OfficialState,
  PesertaState,
} from "./formTypes";
import { newToast, updateToast } from "./sharedFunctions";
import { Id } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

// KATEGORI GENERATOR - START
// ALPHABET
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];
// GENERATOR
export const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebas?: {
    namaKelasBawah?: string;
    bataKelasBawah?: string;
    namaKelasAtas?: string;
    bataKelasAtas?: string;
  }
) => {
  const repeatValue = alphabet.indexOf(endAlphabet);
  let kategoriArr: string[] = [];
  let startKategori: number = 0;

  if (bebas?.namaKelasBawah) {
    kategoriArr.push(
      `Kelas ${bebas.namaKelasBawah} (Dibawah ${
        bebas.bataKelasBawah ? bebas.bataKelasBawah : start
      } KG)`
    );
  }

  startKategori = start;
  for (let i = 0; i <= repeatValue; i++) {
    kategoriArr.push(
      `Kelas ${alphabet[i]} (${startKategori}-${startKategori + step} KG)`
    );
    startKategori += step;
  }
  const endNumber = startKategori;
  if (bebas?.namaKelasAtas)
    kategoriArr.push(
      `Kelas ${bebas.namaKelasAtas} (Diatas ${
        bebas.bataKelasAtas ? bebas.bataKelasAtas : endNumber
      } KG)`
    );
  return kategoriArr;
};
// KATEGORI GENERATOR - END

// LIMIT IMAGE - START
export const limitImage = (
  file: File,
  toastId: React.MutableRefObject<Id | null>
) => {
  if (file) {
    const maxSize = 1 * 1024 * 1024; //1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      newToast(
        toastId,
        "error",
        "File yang dipilih tidak valid (harus png, jpg, jpeg)"
      );
      return false;
    }
    if (file.size > maxSize) {
      newToast(toastId, "error", "File yang dipilih terlalu besar (Maks. 1MB)");
      return false;
    }
    return true;
  }
};
// LIIMIT IMAGE - END

// ERROR MESSAGE GENERATOR - START
// ERROR MESSAGE OFFICIAL
export const getInputErrorOfficial = (
  data: OfficialState | DocumentData,
  imageUrl: string | null,
  error: ErrorOfficial,
  setError: React.Dispatch<React.SetStateAction<ErrorOfficial>>
) => {
  setError({
    ...error,
    namaLengkap: data.namaLengkap == "" ? "Tolong lengkapi Nama Lengkap" : null,
    jenisKelamin:
      data.jenisKelamin == "" ? "Tolong lengkapi Jenis Kelamin" : null,
    idKontingen:
      data.idKontingen == "" ? "Tolong lengkapi Nama Kontingen" : null,
    jabatan: data.jabatan == "" ? "Tolong lengkapi Jabatan" : null,
    pasFoto: imageUrl ? null : "Tolong lengkapi Pas Foto",
  });
  if (
    data.namaLengkap &&
    data.jenisKelamin &&
    data.idKontingen &&
    data.jabatan &&
    imageUrl
  ) {
    return true;
  } else {
    return false;
  }
};

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
      data.NIK.length != 0 && data.NIK.length != 16 ? "NIK tidak valid" : null,
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
    data.kategoriPertandingan
  ) {
    return true;
  } else {
    return false;
  }
};

// ERROR MESSAGE GENERATOR - END

// DATA SENDER - START
// SEND PERSON
export const sendPerson = async (
  tipe: "peserta" | "official",
  data: PesertaState | OfficialState | DocumentData,
  imageSelected: File,
  kontingen: KontingenState,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  newToast(toastId, "loading", `Mengunggah foto ${data.namaLengkap}`);
  // UPLOAD IMAGE
  const newDocRef = doc(collection(firestore, `${tipe}s`));
  const url = `${tipe}s/${newDocRef.id}-image`;
  return uploadBytes(ref(storage, url), imageSelected)
    .then((snapshot) => {
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        // UPLOAD PERSON
        updateToast(
          toastId,
          "loading",
          `Mendaftarkan ${data.namaLengkap} sebagai ${tipe}`
        );
        setDoc(newDocRef, {
          ...data,
          id: newDocRef.id,
          waktuPendaftaran: Date.now(),
          downloadFotoUrl: downloadUrl,
          fotoUrl: url,
        })
          .then(() => {
            // ADD PERSON TO KONTINGEN
            updateToast(
              toastId,
              "loading",
              `Mendaftarkan ${data.namaLengkap} sebagai ${tipe} kontingen ${kontingen.namaKontingen}`
            );
            updateDoc(doc(firestore, "kontingens", data.idKontingen), {
              [`${tipe}s`]: arrayUnion(newDocRef.id),
            })
              .then(() => {
                // FINISH
                updateToast(
                  toastId,
                  "success",
                  `${data.namaLengkap} berhasil didaftarkan sebagai ${tipe} kontingen ${kontingen.namaKontingen}`
                );
                callback && callback();
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `${data.namaLengkap} gagal didaftarkan sebagai ${tipe} kontingen ${kontingen.namaKontingen}. ${error.code}`
                );
              });
          })
          .catch((error) => {
            updateToast(
              toastId,
              "error",
              `${data.namaLengkap} gagal didaftarkan sebagai ${tipe}. ${error.code}`
            );
            return error;
          });
      });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Foto ${data.namaLengkap} gagal diunggah. ${error.code}`
      );
    });
};
// DATA SENDER - END

// DATA UPDATER - START
// UPDATE PERSON
export const updatePerson = async (
  tipe: "peserta" | "official",
  data: OfficialState | PesertaState | DocumentData,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  newToast(toastId, "loading", `Meniympan perubahan data ${data.namaLengkap}`);
  let dir;
  tipe == "peserta" ? (dir = "pesertas") : (dir = "officials");
  return updateDoc(doc(firestore, `${tipe}s`, data.id), {
    ...data,
    waktuPerubahan: Date.now(),
  })
    .then(() => {
      updateToast(
        toastId,
        "success",
        `Perubahan data ${data.namaLengkap} berhasil disimpan`
      );
      callback && callback();
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `Perubahan data ${data.namaLengkap} gagal disimpan. ${error.code}`
      );
    });
};

// UPDATE PERSON AND IMAGE
export const updatePersonImage = async (
  tipe: "peserta" | "official",
  data: OfficialState | PesertaState | DocumentData,
  toastId: React.MutableRefObject<Id | null>,
  imageSelected: File,
  callback?: () => void
) => {
  // DELETE OLD IMAGE
  newToast(toastId, "loading", "Menghapus Foto Lama");
  return deleteObject(ref(storage, data.fotoUrl))
    .then(() => {
      // UPLOAD NEW IMAGE
      updateToast(toastId, "loading", "Mengunggah Foto Baru");
      uploadBytes(ref(storage, data.fotoUrl), imageSelected)
        .then((snapshot) => {
          // UPLOAD PERSON
          getDownloadURL(snapshot.ref).then((downloadUrl) => {
            updateToast(
              toastId,
              "loading",
              `Meniympan perubahan data ${data.namaLengkap}`
            );
            updateDoc(doc(firestore, `${tipe}s`, data.id), {
              ...data,
              downloadFotoUrl: downloadUrl,
              waktuPerubahan: Date.now(),
            })
              .then(() => {
                // FINISH
                updateToast(
                  toastId,
                  "success",
                  `Perubahan data ${data.namaLengkap} berhasil disimpan`
                );
                callback && callback();
              })
              .catch((error) => {
                updateToast(
                  toastId,
                  "error",
                  `Perubahan data ${data.namaLengkap} gagal disimpan. ${error.code}`
                );
              });
          });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `Gagal mengunngag foto baru. ${error.code}`
          );
        });
    })
    .catch((error) => {
      updateToast(toastId, "error", `Gagal Menghapus Foto Lama. ${error.code}`);
    });
};
// DATA UPDATER - END

// DATA FETCHER - START
// GET KONTINGEN
export const getKontingen = async (userUID: string) => {
  try {
    let result: DocumentData | KontingenState | null = null;
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "kontingens"),
        where("creatorUid", "==", userUID)
      )
    );
    querySnapshot.forEach((doc) => (result = doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data kontingen, ${error.code}`);
  }
};

// GET OFFICIALS
export const getOfficials = async (userUID: string) => {
  try {
    let result: DocumentData | OfficialState[] | [] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "officials"),
        where("creatorUid", "==", userUID)
      )
    );
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data official, ${error.code}`);
  }
};

// GET PESERTAS
export const getPesertas = async (userUID: string) => {
  try {
    let result: DocumentData | OfficialState[] | [] = [];
    const querySnapshot = await getDocs(
      query(
        collection(firestore, "pesertas"),
        where("creatorUid", "==", userUID)
      )
    );
    querySnapshot.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error: any) {
    throw new Error(`Gagal mendapatkan data peserta, ${error.code}`);
  }
};
// DATA FETCHER - END

// DELETER - START
// PERSON DELETER
export const deletePerson = async (
  query: "officials" | "pesertas",
  data: PesertaState | OfficialState | DocumentData,
  kontingen: KontingenState,
  toastId: React.MutableRefObject<Id | null>,
  callback?: () => void
) => {
  // DELETE IMAGE
  newToast(toastId, "loading", `Menghapus foto ${data.namaLengkap}`);
  return deleteObject(ref(storage, data.fotoUrl))
    .then(() => {
      // DELETE PERSON FROM KONTINGEN
      updateToast(
        toastId,
        "loading",
        `Menghapus ${data.namaLengkap} dari Kontingen ${kontingen.namaKontingen}`
      );
      updateDoc(doc(firestore, "kontingens", data.idKontingen), {
        [`${query}`]: arrayRemove(data.id),
      })
        .then(() => {
          // DELETE DATA
          updateToast(
            toastId,
            "loading",
            `Menghapus Data ${data.namaLengkap} `
          );
          deleteDoc(doc(firestore, query, data.id))
            .then(() => {
              updateToast(
                toastId,
                "success",
                `Data ${data.namaLengkap} berhasil dihapus`
              );
              callback && callback();
            })
            .catch((error) => {
              updateToast(
                toastId,
                "error",
                `Data ${data.namaLengkap} gagal dihapus. ${error.code}`
              );
            });
        })
        .catch((error) => {
          updateToast(
            toastId,
            "error",
            `${data.namaLengkap} gagal dihapus dari kontingen ${kontingen.namaKontingen}. ${error.code}`
          );
        });
    })
    .catch((error) => {
      updateToast(
        toastId,
        "error",
        `gagal Menghapus foto ${data.namaLengkap}. ${error.code}`
      );
    });
};
// DELETER - END