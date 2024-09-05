"use client";
import { FormContext } from "@/context/FormContext";

import TabelKontingen from "../tabels/TabelKontingen";
import { KontingenState } from "@/utils/formTypes";
import { kontingenInitialValue } from "@/utils/formConstants";
import { useEffect, useRef, useState } from "react";
import { MyContext } from "@/context/Context";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RodalKontingen from "../rodals/RodalKontingen";
import { deletePerson } from "@/utils/formFunctions";
import FormKontingen from "../forms/FormKontingen";
import InlineLoading from "@/components/loading/InlineLoading";
import { controlToast } from "@/utils/sharedFunctions";

const Kontingen = () => {
  const [data, setData] = useState<KontingenState>(kontingenInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dataToDelete, setDataToDelete] = useState(kontingenInitialValue);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    kontingens,
    refreshKontingens,
    refreshOfficials,
    refreshPesertas,
  }: {
    kontingens: KontingenState[];
    refreshKontingens: () => void;
    refreshOfficials: () => void;
    refreshPesertas: () => void;
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
  const sendKontingen = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.namaKontingen !== "") {
      if (!updating) {
        // ADD NEW KONTINGEN
        setDisable(true);
        controlToast(toastId, "loading", "Mendaftarkan Kontingen", true);
        const newDocRef = doc(collection(firestore, "kontingens"));
        setDoc(newDocRef, {
          ...data,
          id: newDocRef.id,
          waktuPendaftaran: Date.now(),
        })
          .then(() => {
            controlToast(toastId, "success", "Kontingen berhasil didaftarkan");
          })
          .catch((error) =>
            controlToast(
              toastId,
              "error",
              `Gagal mendaftarkan kontingen. ${error.code}`
            )
          )
          .finally(() => {
            reset();
            refreshKontingens();
          });
      } else {
        // UPDATE DATA
        setDisable(true);
        controlToast(toastId, "loading", "Mengubah Data Kontingen", true);
        setDoc(doc(firestore, "kontingens", data.id), {
          ...data,
          waktuPerubahan: Date.now(),
        })
          .then(() => {
            controlToast(toastId, "success", "Data berhasil dirubah");
          })
          .catch((error) =>
            controlToast(toastId, "error", `Gagal mengubah data. ${error.code}`)
          )
          .finally(() => {
            reset();
            refreshKontingens();
          });
      }
    } else {
      setErrorMessage("Tolong lengkapi Nama Kontingen");
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
  const deleteOfficials = (officialIndex: number) => {
    if (officialIndex >= 0) {
      const id = dataToDelete.officials[officialIndex];
      deletePerson(
        "officials",
        {
          namaLengkap: `${dataToDelete.officials.length} official`,
          idKontingen: dataToDelete.id,
          fotoUrl: `officials/${id}-image`,
          id: id,
        },
        dataToDelete,
        toastId,
        () => afterDeleteOfficial(officialIndex)
      );
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
  const deletePesertas = (pesertaIndex: number) => {
    if (pesertaIndex >= 0) {
      const id = dataToDelete.pesertas[pesertaIndex];
      deletePerson(
        "pesertas",
        {
          namaLengkap: `${dataToDelete.pesertas.length} peserta`,
          idKontingen: dataToDelete.id,
          fotoUrl: `pesertas/${id}-image`,
          id: id,
        },
        dataToDelete,
        toastId,
        () => afterDeletePeserta(pesertaIndex)
      );
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
  const deleteKontingen = () => {
    controlToast(toastId, "loading", "Menghapus Kontingen", true);
    deleteDoc(doc(firestore, "kontingens", dataToDelete.id))
      .then(() =>
        controlToast(toastId, "success", "Kontingen berhasil dihapus")
      )
      .catch((error) => {
        controlToast(
          toastId,
          "error",
          `Gagal menghapus kontingen. ${error.code}`
        );
      })
      .finally(() => {
        refreshKontingens();
        refreshOfficials();
        refreshPesertas();
        reset();
      });
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
