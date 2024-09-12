import { createData, deleteData, getNewDocId, updateData } from "../actions";
import { ToastId } from "../constants";
import { deletePersons } from "../formFunctions";
import { KontingenState, OfficialState, PesertaState } from "../formTypes";
import { toastError } from "../functions";
import { controlToast } from "../sharedFunctions";

export const filterKontingenById = (
  kontingens: KontingenState[],
  id: string
) => {
  return kontingens.find((item) => item.id == id) as KontingenState;
};

export const createKontingen = async (
  kontingen: KontingenState,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Mendaftarkan Kontingen", true);

    let newKontingen = { ...kontingen };

    if (!newKontingen.namaKontingen.length)
      throw new Error("Tolong lengkapi nama kontingen");

    newKontingen.id = await getNewDocId("kontingens");
    newKontingen.waktuPendaftaran = Date.now();

    const { result, error } = await createData("kontingens", newKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Kontingen berhasil didaftarkan");
    return result as KontingenState;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const updateKontingen = async (
  kontingen: KontingenState,
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Memperbaharui Kontingen", true);

    let newKontingen = { ...kontingen };

    if (!newKontingen.namaKontingen.length)
      throw new Error("Tolong lengkapi nama kontingen");

    newKontingen.waktuPerubahan = Date.now();

    const { result, error } = await updateData("kontingens", newKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Kontingen berhasil diperbaharui");
    return result as KontingenState;
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const deleteKontingen = async (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  officials: OfficialState[],
  toastId: ToastId
) => {
  try {
    if (kontingen.idPembayaran.length)
      throw new Error(
        "Kontingen yang telah melakukan pembayaran tidak dapat dihapus"
      );

    controlToast(toastId, "loading", "Menghapus kontingen", true);

    // DELETE PESERTAS
    if (pesertas.length) {
      controlToast(toastId, "loading", "Menghapus peserta");
      await deletePersons("peserta", pesertas);
    }

    // DELETE OFFIICALS
    if (officials.length) {
      controlToast(toastId, "loading", "Menghapus official");
      await deletePersons("official", officials);
    }

    // DELETE KONTINGEN
    const { error } = await deleteData("kontingens", kontingen.id);
    if (error) throw error;

    controlToast(toastId, "success", "Kontingen berhasil dihapus");
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};
