"use client";
import { FormContext } from "@/context/FormContext";

import TabelKontingen from "../tabels/TabelKontingen";
import { KontingenState } from "@/utils/formTypes";
import { kontingenInitialValue } from "@/utils/formConstants";
import { useEffect, useRef, useState } from "react";
import { MyContext } from "@/context/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RodalKontingen from "../rodals/RodalKontingen";
import { deletePersonFinal, getFileUrl } from "@/utils/formFunctions";
import FormKontingen from "../forms/FormKontingen";
import InlineLoading from "@/components/loading/InlineLoading";
import { controlToast } from "@/utils/sharedFunctions";
import {
  createData,
  deleteData as deleteFirebaseData,
  getNewDocId,
  updateData,
} from "@/utils/actions";
import { toastError } from "@/utils/functions";

const Kontingen = () => {
  const [data, setData] = useState<KontingenState>(kontingenInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataToDelete, setDataToDelete] = useState(kontingenInitialValue);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    kontingens,
    addKontingens,
    pesertas,
    officials,
    deleteKontingen: deleteKontingenContext,
    deleteOfficial,
    deletePeserta,
  } = FormContext();
  const { user, setDisable } = MyContext();
  const toastId = useRef(null);

  // SET USER
  useEffect(() => {
    if (user) {
      setData({ ...data, creatorEmail: user.email, creatorUid: user.uid });
    }
  }, [user]);

  // SEND KONTINGEN
  const sendKontingen = async (e: React.FormEvent) => {
    e.preventDefault();

    setDisable(true);
    controlToast(
      toastId,
      "loading",
      `${updating ? "Memperbaharui" : "Mendaftarkan"} Kontingen`,
      true
    );

    try {
      if (data.namaKontingen == "")
        throw { message: "Tolong lengkapi Nama Kontingen" };

      let kontingen = { ...data };

      if (!updating) {
        // CREATE NEW KONTINGEN
        kontingen.id = await getNewDocId("kontingens");
        kontingen.waktuPendaftaran = Date.now();

        console.log("create data");
        const { error } = await createData("kontingens", kontingen);
        console.log("data created");

        if (error) throw error;
      } else {
        // UPDATE KONTINGEN
        kontingen.waktuPerubahan = Date.now();

        const { error } = await updateData("kontingens", kontingen);
        if (error) throw error;
      }

      controlToast(
        toastId,
        "success",
        `Kontingen berhasil di${updating ? "perbaharui" : "daftarkan"}`
      );

      addKontingens([kontingen]);
    } catch (error) {
      toastError(toastId, error);
    } finally {
      reset();
    }
  };

  // ERROR REMOVER
  useEffect(() => {
    if (errorMessage && data.namaKontingen) setErrorMessage("");
  }, [data.namaKontingen]);

  // RESETER
  const reset = () => {
    setDisable(false);
    setDataToDelete(kontingenInitialValue);
    setModalVisible(false);
    setUpdating(false);
    setData({
      ...kontingenInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
    });
    setErrorMessage("");
  };

  // EDIT BUTTON HANDLER
  const handleEdit = (data: KontingenState) => {
    setData(data);
    setUpdating(true);
  };

  // DELETE BUTTON HANDLER
  const handleDelete = (data: KontingenState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE KONTINGEN START
  const deleteData = () => {
    setModalVisible(false);
    deleteOfficials(dataToDelete.officials.length - 1);
  };

  // DELETE OFFICIALS IN KONTINGEN
  const deleteOfficials = async (officialIndex: number) => {
    if (officialIndex >= 0) {
      const id = dataToDelete.officials[officialIndex];
      await deletePersonFinal(
        "official",
        {
          id,
          idKontingen: dataToDelete.id,
          fotoUrl: getFileUrl("official", id),
        },
        dataToDelete,
        toastId
      );
      afterDeleteOfficial(officialIndex);
      deleteOfficial(id);
    } else {
      deletePesertas(dataToDelete.pesertas.length - 1);
    }
  };

  const afterDeleteOfficial = (officialIndex: number) => {
    if (officialIndex != 0) {
      deleteOfficials(officialIndex - 1);
    } else {
      deletePesertas(dataToDelete.pesertas.length - 1);
    }
  };

  // DELETE PESERTAS IN KONTINGEN
  const deletePesertas = async (pesertaIndex: number) => {
    if (pesertaIndex >= 0) {
      const id = dataToDelete.pesertas[pesertaIndex];
      await deletePersonFinal(
        "peserta",
        {
          id,
          idKontingen: dataToDelete.id,
          fotoUrl: getFileUrl("peserta", id),
        },
        dataToDelete,
        toastId
      );
      afterDeletePeserta(pesertaIndex);
      deletePeserta(id);
    } else {
      deleteKontingen();
    }
  };

  const afterDeletePeserta = (pesertaIndex: number) => {
    if (pesertaIndex != 0) {
      deletePesertas(pesertaIndex - 1);
    } else {
      deleteKontingen();
    }
  };

  // DELETE KONTINGEN FINAL
  const deleteKontingen = async () => {
    controlToast(toastId, "loading", "Menghapus Kontingen", true);
    try {
      const { error } = await deleteFirebaseData("kontingens", dataToDelete.id);
      if (error) throw error;
      controlToast(toastId, "success", "Kontingen berhasil dihapus");
      deleteKontingenContext(dataToDelete.id);
    } catch (error) {
      toastError(toastId, error);
    } finally {
      reset();
    }
  };

  return (
    <div className="h-fit">
      <ToastContainer />
      <RodalKontingen
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        dataToDelete={dataToDelete}
        cancelDelete={reset}
        deleteData={deleteData}
      />
      <div className="w-full bg-white rounded-md p-2">
        <TabelKontingen handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      {data.creatorUid ? (
        <>
          <FormKontingen
            sendKontingen={sendKontingen}
            data={data}
            setData={setData}
            reset={reset}
            errorMessage={errorMessage}
            updating={updating}
          />
        </>
      ) : (
        <p className="bg-white rounded-md p-2 mt-2">
          Memuat Data <InlineLoading />
        </p>
      )}
    </div>
  );
};
export default Kontingen;
