import { DocumentData } from "firebase/firestore";
import { ErrorOfficial, OfficialState } from "../formTypes";

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

export const filterOfficialByIdKontingen = (
  officials: OfficialState[],
  idKontingen: string
) => {
  return officials.filter((item) => item.idKontingen == idKontingen);
};
