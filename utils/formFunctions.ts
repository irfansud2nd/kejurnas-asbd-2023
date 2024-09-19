import { DocumentData, collection, doc } from "firebase/firestore";
import { KontingenState, OfficialState, PesertaState } from "./formTypes";
import { controlToast, isFileValid, sendFile, toastError } from "./functions";
import {
  createData,
  deleteData,
  deleteFile,
  getNewDocId,
  updateData,
} from "./actions";
import { managePersonOnKontingen } from "./kontingen/kontingenActions";
import { ToastId } from "./constants";

// VALIDATE IMAGE
export const validateImage = (file: File, toastId: ToastId) => {
  if (file) {
    const warning = isFileValid(file);
    if (warning) {
      controlToast(toastId, "error", warning, true);
      return false;
    }
    return true;
  }
};

// GET FILE URL
export const getFileUrl = (
  type: "peserta" | "official" | "pembayaran",
  docId: string
) => {
  let folder = type + "s";
  if (type == "pembayaran") folder = "buktiPembayarans";
  return `${folder}/${docId}-image`;
};

// SEND PERSON
export const createPerson = async (
  type: "peserta" | "official",
  person: PesertaState | OfficialState | DocumentData,
  image: File,
  kontingen: KontingenState,
  toastId: ToastId
) => {
  try {
    const id = await getNewDocId(type + "s");

    // UPLOAD IMAGE
    const fileUrl = getFileUrl(type, id);
    controlToast(toastId, "loading", `Mengunggah foto ${type}`, true);
    const downloadUrl = await sendFile(image, fileUrl);

    // UPLOAD PERSON
    controlToast(toastId, "loading", `Mendaftarkan ${type}`);
    const { result: newPerson, error: personError } = await createData(
      type + "s",
      {
        ...person,
        id,
        waktuPendaftaran: Date.now(),
        downloadFotoUrl: downloadUrl,
        fotoUrl: fileUrl,
      }
    );
    if (personError) throw personError;

    // ADD PERSON TO KONTINGEN
    controlToast(toastId, "loading", `Menambahkan ${type} ke kontingen`);
    const { result: updatedKontingen, error: kontingenError } =
      await managePersonOnKontingen(kontingen, type, id);

    if (kontingenError) throw kontingenError;

    controlToast(toastId, "success", `Pendaftaran berhasil`);
    return { kontingen: updatedKontingen, person: newPerson };
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

// UPDATE PERSON
export const updatePerson = async (
  type: "peserta" | "official",
  person: PesertaState | OfficialState,
  toastId?: ToastId,
  options?: {
    image?: File;
    kontingen?: {
      prev: KontingenState;
      new: KontingenState;
    };
  }
) => {
  let updatedPerson = { ...person };
  let kontingen = options?.kontingen;

  toastId && controlToast(toastId, "loading", `Memperbaharui ${type}`, true);

  try {
    // UPDATE IMAGE
    if (options?.image) {
      toastId && controlToast(toastId, "loading", "Memperbaharui foto");
      updatedPerson.downloadFotoUrl = await sendFile(
        options.image,
        updatedPerson.fotoUrl
      );
    }

    // UPDATE KONTINGEN
    if (options?.kontingen && kontingen?.new.id != kontingen?.prev.id) {
      toastId && controlToast(toastId, "loading", "Memperbaharui kontingen");

      const { result: prevKontingen, error: prevKontingenError } =
        await managePersonOnKontingen(
          options.kontingen.prev,
          type,
          updatedPerson.id,
          true
        );

      if (prevKontingenError) throw prevKontingenError;

      const { result: newKontingen, error: newKontingenError } =
        await managePersonOnKontingen(
          options.kontingen.new,
          type,
          updatedPerson.id
        );

      if (newKontingenError) throw prevKontingenError;

      kontingen = { prev: prevKontingen, new: newKontingen };
    }

    // UPDATE PERSON
    toastId && controlToast(toastId, "loading", `Memperbaharui ${type}`);
    const { error } = await updateData(type + "s", updatedPerson);

    if (error) throw error;

    toastId && controlToast(toastId, "success", "Data berhasil diperbaharui");
    return { person: updatedPerson, kontingen };
  } catch (error) {
    toastId && toastError(toastId, error);
    throw error;
  }
};

// DELETE PERSON
export const deletePerson = async (
  type: "official" | "peserta",
  person: PesertaState | OfficialState | DocumentData,
  kontingen?: KontingenState,
  toastId?: ToastId
) => {
  try {
    toastId && controlToast(toastId, "loading", `Menghapus ${type}`, true);
    if ((person as PesertaState).idPembayaran.length)
      throw new Error(
        "Peserta yang telah melakukan pembayaran tidak dapat dihapus"
      );

    // DELETE IMAGE
    toastId && controlToast(toastId, "loading", "Menghapus foto", true);
    const { error: fileError } = await deleteFile(person.fotoUrl);
    if (fileError) throw fileError;

    // DELETE PERSON FROM KONTINGEN
    let updatedKontingen;
    if (kontingen) {
      toastId &&
        controlToast(toastId, "loading", `Menghapus ${type} dari kontingen`);

      const { result, error: kontingenError } = await managePersonOnKontingen(
        kontingen,
        type,
        person.id,
        true
      );
      if (kontingenError) throw kontingenError;

      updatedKontingen = result;
    }

    // DELETE PERSON
    toastId && controlToast(toastId, "loading", `Menghapus ${type}`);
    await deleteData(type + "s", person.id);

    toastId && controlToast(toastId, "success", "Data berhasil dihapus");

    return { kontingen: updatedKontingen, person };
  } catch (error) {
    toastId && toastError(toastId, error);
    throw error;
  }
};

export const deletePersons = async (
  type: "official" | "peserta",
  persons: (PesertaState | OfficialState)[]
) => {
  try {
    const deletePromises = persons.map(async (person) => {
      await deletePerson(type, person);
    });

    Promise.all(deletePromises);
  } catch (error) {
    throw error;
  }
};

export const updatePersons = async (
  type: "official" | "peserta",
  persons: (PesertaState | OfficialState)[]
) => {
  try {
    const updatePromises = persons.map(async (person) => {
      await updatePerson(type, person);
    });

    Promise.all(updatePromises);
  } catch (error) {
    throw error;
  }
};

export const totalToNominal = (total: number, noHp: string) => {
  return `Rp. ${(total / 1000).toLocaleString("id")}.${noHp
    .split("")
    .slice(-3)
    .join("")}`;
};
