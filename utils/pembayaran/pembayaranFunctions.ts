import { deleteFile, updateData } from "../actions";
import { ToastId } from "../constants";
import { getFileUrl, totalToNominal, updatePersons } from "../formFunctions";
import { KontingenState, PesertaState } from "../formTypes";
import { sendFile, toastError } from "../functions";
import { controlToast } from "../sharedFunctions";

export const confirmPayment = async (
  infoPembayaran: {
    idPembayaran: string;
    noHp: string;
    waktu: number;
    buktiUrl: string;
    nominal: string;
  },
  kontingen: KontingenState,
  pesertas: {
    toConfirm: PesertaState[];
    toUnpaid: PesertaState[];
  },
  biayaKontingen: string,
  nominalToConfirm: string,
  user: any,
  toastId: ToastId
) => {
  const now = Date.now();

  try {
    controlToast(toastId, "loading", "Mengkonfirmasi pembayaran", true);

    // CONFIRM PAYMEN ON PESERTAS
    if (pesertas.toConfirm.length) {
      controlToast(toastId, "loading", "Mengkonfirmasi pembayaran peserta");

      const confirmPesertas = pesertas.toConfirm.map(async (peserta) => {
        let data: PesertaState = { ...peserta };

        data.confirmedPembayaran = true;
        data.infoKonfirmasi = {
          nama: user.displayName,
          email: user.email,
          waktu: now,
        };

        const { error } = await updateData("pesertas", data);

        if (error) throw error;
      });

      await Promise.all(confirmPesertas);
    }

    // DELETE PAYMENT ON PESERTAS
    if (pesertas.toUnpaid.length) {
      await unpaidPesertas(pesertas.toUnpaid, toastId);
    }

    // CONFIRM PAYMENT ON KONTINGEN
    controlToast(toastId, "loading", "Mengkonfirmasi pembayaran kontingen");
    let updatedKontingen: KontingenState = { ...kontingen };

    updatedKontingen.biayaKontingen = biayaKontingen;

    updatedKontingen.confirmedPembayaranIds = [
      ...updatedKontingen.confirmedPembayaranIds,
      infoPembayaran.idPembayaran,
    ];

    updatedKontingen.unconfirmedPembayaran =
      updatedKontingen.idPembayaran.length >
      updatedKontingen.confirmedPembayaranIds.length;

    updatedKontingen.confirmedPembayaran =
      !updatedKontingen.unconfirmedPembayaran;

    updatedKontingen.unconfirmedPembayaranIds =
      updatedKontingen.unconfirmedPembayaranIds.filter(
        (id) => id != infoPembayaran.idPembayaran
      );

    updatedKontingen.infoPembayaran = updatedKontingen.infoPembayaran.filter(
      (item) => item.idPembayaran != infoPembayaran.idPembayaran
    );

    updatedKontingen.infoPembayaran = [
      ...updatedKontingen.infoPembayaran,
      {
        idPembayaran: infoPembayaran.idPembayaran,
        nominal: nominalToConfirm,
        noHp: infoPembayaran.noHp,
        waktu: infoPembayaran.waktu,
        buktiUrl: infoPembayaran.buktiUrl,
      },
    ];

    updatedKontingen.infoKonfirmasi = [
      ...updatedKontingen.infoKonfirmasi,
      {
        idPembayaran: infoPembayaran.idPembayaran,
        nama: user.displayName,
        email: user.email,
        waktu: now,
      },
    ];

    const { error } = await updateData("kontingens", updatedKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Pembayran berhasil diKonfirmasi");
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};

export const unpaidPesertas = async (
  pesertas: PesertaState[],
  toastId: ToastId
) => {
  try {
    controlToast(toastId, "loading", "Membatalkan pembayaran peserta");
    const promises = pesertas.map(async (peserta) => {
      let data: PesertaState = { ...peserta };

      data.idPembayaran = "";
      data.pembayaran = false;
      data.infoPembayaran = {
        noHp: "",
        waktu: 0,
        buktiUrl: "",
      };

      const { error } = await updateData("pesertas", data);
      if (error) throw error;
    });

    await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

export const cancelPayment = async (
  kontingen: KontingenState,
  pesertas: PesertaState[],
  idPembayaran: string,
  toastId: ToastId
) => {
  try {
    // DELETE PAYMENT ON PESERTA
    controlToast(toastId, "loading", "Membatalkan pembayaran", true);
    if (pesertas.length) {
      await unpaidPesertas(pesertas, toastId);
    }

    // DELETE FILE
    controlToast(toastId, "loading", "Menghapus bukti pembayaran");
    const { error: fileError } = await deleteFile(
      getFileUrl("pembayaran", idPembayaran)
    );
    if (fileError) throw fileError;

    // DELETE PAYMENT ON KONTINGEN
    controlToast(toastId, "loading", "Membatalkan pembayaran kontingen");
    let updatedKontingen: KontingenState = { ...kontingen };

    updatedKontingen.pembayaran = false;

    updatedKontingen.biayaKontingen =
      updatedKontingen.biayaKontingen == idPembayaran
        ? ""
        : updatedKontingen.biayaKontingen;

    updatedKontingen.idPembayaran = updatedKontingen.idPembayaran.filter(
      (item) => item != idPembayaran
    );

    updatedKontingen.unconfirmedPembayaranIds =
      updatedKontingen.unconfirmedPembayaranIds.filter(
        (item) => item != idPembayaran
      );

    updatedKontingen.unconfirmedPembayaran =
      updatedKontingen.unconfirmedPembayaranIds.length > 0;

    updatedKontingen.confirmedPembayaran =
      !updatedKontingen.unconfirmedPembayaran;

    updatedKontingen.infoPembayaran = updatedKontingen.infoPembayaran.filter(
      (item) => item.idPembayaran != idPembayaran
    );

    const { error } = await updateData("kontingens", updatedKontingen);
    if (error) throw error;

    controlToast(
      toastId,
      "success",
      "Pembayaran kontingen berhasil dibatalkan"
    );
  } catch (error) {
    toastError(toastId, error);
  }
};

export const createPembayaran = async (
  image: File,
  noHp: string,
  nominal: string,
  kontingen: KontingenState,
  pesertas: PesertaState[],
  toastId: ToastId
) => {
  try {
    const now = Date.now();
    const idPembayaran = kontingen.id + "-" + now;
    const url = getFileUrl("pembayaran", idPembayaran);
    controlToast(toastId, "loading", "Menyimpan pembayaran", true);

    // UPLOAD IMAGE
    controlToast(toastId, "loading", "Menyimpan bukti pembayaran");
    const downloadUrl = await sendFile(image, url);

    // CREATE PAYMENT ON PESERTAS
    let updatedPesertas = pesertas;
    if (pesertas.length) {
      controlToast(toastId, "loading", "Menyimpan pembayaran peserta");
      updatedPesertas = pesertas.map((peserta) => {
        let updatedPeserta = { ...peserta };

        updatedPeserta.pembayaran = true;
        updatedPeserta.idPembayaran = idPembayaran;
        updatedPeserta.infoPembayaran = {
          noHp,
          waktu: now,
          buktiUrl: downloadUrl,
        };

        return updatedPeserta;
      });

      await updatePersons("peserta", updatedPesertas);
    }

    // CREATE PAYMENT ON KONTINGEN
    controlToast(toastId, "loading", "Menyimpan pembayaran kontingen");
    let updatedKontingen = { ...kontingen };

    updatedKontingen.pembayaran = true;

    updatedKontingen.biayaKontingen = updatedKontingen.biayaKontingen.length
      ? updatedKontingen.biayaKontingen
      : idPembayaran;
    updatedKontingen.unconfirmedPembayaran = true;

    updatedKontingen.confirmedPembayaran = false;

    updatedKontingen.idPembayaran = [
      ...updatedKontingen.idPembayaran,
      idPembayaran,
    ];

    updatedKontingen.unconfirmedPembayaranIds = [
      ...updatedKontingen.unconfirmedPembayaranIds,
      idPembayaran,
    ];

    updatedKontingen.infoPembayaran = [
      ...updatedKontingen.infoPembayaran,
      {
        idPembayaran,
        nominal: nominal,
        noHp,
        waktu: now,
        buktiUrl: downloadUrl,
      },
    ];

    const { result, error } = await updateData("kontingens", updatedKontingen);
    if (error) throw error;

    controlToast(toastId, "success", "Pembayaran berhasil disimpan");

    return { kontingen: updatedKontingen, pesertas: updatedPesertas };
  } catch (error) {
    toastError(toastId, error);
    throw error;
  }
};
