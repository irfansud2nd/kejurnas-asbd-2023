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
import { deletePerson, getFileUrl } from "@/utils/formFunctions";
import FormKontingen from "../forms/FormKontingen";
import InlineLoading from "@/components/loading/InlineLoading";
import { controlToast } from "@/utils/functions";
import { deleteData as deleteFirebaseData } from "@/utils/actions";
import { toastError } from "@/utils/functions";
import {
  createKontingen,
  deleteKontingen,
  updateKontingen,
} from "@/utils/kontingen/kontingenFunctions";
import { filterPesertaByIdKontingen } from "@/utils/peserta/pesertaFunctions";
import { filterOfficialByIdKontingen } from "@/utils/official/officialFunctions";

const Kontingen = () => {
  const [data, setData] = useState<KontingenState>(kontingenInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [kontingenToDelete, setDataToDelete] = useState(kontingenInitialValue);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    pesertas,
    officials,
    addKontingens,
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

    let kontingen = data;

    if (updating) {
      kontingen = await updateKontingen(data, toastId);
    } else {
      kontingen = await createKontingen(data, toastId);
    }

    addKontingens([kontingen]);
    reset();
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
  const deleteData = async () => {
    setModalVisible(false);
    let pesertasToDelete = filterPesertaByIdKontingen(
      pesertas,
      kontingenToDelete.id
    );
    let officialsToDelete = filterOfficialByIdKontingen(
      officials,
      kontingenToDelete.id
    );
    try {
      await deleteKontingen(
        kontingenToDelete,
        pesertasToDelete,
        officialsToDelete,
        toastId
      );

      pesertasToDelete.map((peserta) => {
        deletePeserta(peserta.id);
      });
      officialsToDelete.map((official) => {
        deleteOfficial(official.id);
      });

      deleteKontingenContext(kontingenToDelete.id);
    } catch (error) {
      throw error;
    } finally {
      reset();
    }
  };

  return (
    <div className="h-fit">
      {/* <ToastContainer /> */}
      <RodalKontingen
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        dataToDelete={kontingenToDelete}
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
