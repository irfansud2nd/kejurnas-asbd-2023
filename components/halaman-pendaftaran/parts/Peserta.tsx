import {
  errorPesertaInitialValue,
  jenisPertandingan,
  pesertaInitialValue,
} from "@/utils/formConstants";
import { ErrorPeserta, PesertaState } from "@/utils/formTypes";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RodalPeserta from "../rodals/RodalPeserta";
import { MyContext } from "@/context/Context";
import { FormContext } from "@/context/FormContext";
import TabelPeserta from "../tabels/TabelPeserta";
import InlineLoading from "@/components/loading/InlineLoading";
import FormPeserta from "../forms/FormPeserta";
import {
  deletePerson,
  getInputErrorPeserta,
  limitImage,
  sendPerson,
  updatePerson,
  updatePersonImage,
} from "@/utils/formFunctions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";

const Peserta = () => {
  const [data, setData] = useState<PesertaState>(pesertaInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [dataToDelete, setDataToDelete] = useState(pesertaInitialValue);
  const [imageSelected, setImageSelected] = useState<File | null>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorPeserta>(
    errorPesertaInitialValue
  );
  const [kuotaKelas, setKuotaKelas] = useState<number>(8);
  const [kuotaLoading, setKuotaLoading] = useState(false);
  const [prevData, setPrevData] = useState<PesertaState>(pesertaInitialValue);

  const { user, disable, setDisable } = MyContext();
  const { kontingen, refreshPesertas, kontingenLoading } = FormContext();
  const toastId = useRef(null);

  // SET KONTINGEN AND USER INFO
  useEffect(() => {
    if (kontingen?.id && !kontingenLoading && user) {
      setData({
        ...data,
        idKontingen: kontingen.id,
        creatorEmail: user.email,
        creatorUid: user.uid,
      });
    }
  }, [kontingen, user, kontingenLoading]);

  // RESETER
  const reset = () => {
    setImageSelected(null);
    setImagePreviewSrc("");
    clearInputImage();
    setData({
      ...pesertaInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingen?.id,
    });
    setSubmitClicked(false);
    refreshPesertas();
    setErrorMessage(errorPesertaInitialValue);
    setModalVisible(false);
    setDataToDelete(pesertaInitialValue);
    setUpdating(false);
    setPrevData(pesertaInitialValue);
  };

  // CLEAR INPUT IMAGE
  const clearInputImage = () => {
    const image: HTMLInputElement | null = document.querySelector(
      "input[type=file]"
    ) as HTMLInputElement;
    if (image) {
      image.value = "";
    }
  };

  // DATA LISTENER FOR CEK KUOTA
  useEffect(() => {
    if (
      (data.tingkatanPertandingan == "SMA" ||
        data.tingkatanPertandingan == "Dewasa") &&
      data.jenisPertandingan != jenisPertandingan[2]
    ) {
      cekKuota();
    } else {
      setKuotaKelas(16);
    }
  }, [
    data.tingkatanPertandingan,
    data.kategoriPertandingan,
    data.jenisKelamin,
    data.jenisPertandingan,
  ]);

  // CEK KUOTA TINGKATAN SMA DAN DEWASA
  const cekKuota = async () => {
    let kuota = 8;
    setKuotaLoading(true);
    const q = query(
      collection(firestore, "pesertas"),
      where("tingkatanPertandingan", "==", data.tingkatanPertandingan),
      where("kategoriPertandingan", "==", data.kategoriPertandingan),
      where("jenisKelamin", "==", data.jenisKelamin)
    );
    return getDocs(q)
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          kuota -= 1;
        });
        if (
          updating &&
          prevData.kategoriPertandingan == data.kategoriPertandingan &&
          prevData.jenisKelamin == data.jenisKelamin &&
          prevData.jenisPertandingan == data.jenisPertandingan
        ) {
          kuota += 1;
        }
        return kuota;
      })
      .finally(() => {
        setKuotaKelas(kuota);
        setKuotaLoading(false);
      });
  };

  // IMAGE CHANGE HANDLER
  const imageChangeHandler = (file: File) => {
    if (limitImage(file, toastId)) {
      setImageSelected(file);
    }
  };

  //   SET IMAGE PREVIEW
  useEffect(() => {
    if (imageSelected) {
      setImagePreviewSrc(URL.createObjectURL(imageSelected));
    } else {
      setImagePreviewSrc("");
    }
  }, [imageSelected]);

  // SUBMIT HANDLER
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitClicked(true);
    if (
      (data.tingkatanPertandingan == "SMA" ||
        data.tingkatanPertandingan == "Dewasa") &&
      data.jenisPertandingan != jenisPertandingan[2]
    ) {
      newToast(toastId, "loading", "Cek Kuota Kategori");
      cekKuota().then((res) => {
        if (res) {
          updateToast(toastId, "success", "Kuota Tersedia");
          sendPeserta();
        } else {
          updateToast(
            toastId,
            "error",
            `Kuota Kategori yang dipilih sudah habis (Maks. 8 Orang)`
          );
        }
      });
    } else {
      sendPeserta();
    }
  };

  // SEND PESERTA
  const sendPeserta = () => {
    if (
      getInputErrorPeserta(data, imagePreviewSrc, errorMessage, setErrorMessage)
    ) {
      if (!updating) {
        if (imageSelected) {
          sendPerson("peserta", data, imageSelected, kontingen, toastId, reset);
        }
      } else {
        updateControl();
      }
    }
  };

  // ERROR REMOVER
  useEffect(() => {
    if (submitClicked) {
      getInputErrorPeserta(
        data,
        imagePreviewSrc,
        errorMessage,
        setErrorMessage
      );
    }
  }, [data, imageSelected, submitClicked]);

  // UPDATE CONTROLLER
  const updateControl = () => {
    if (imageSelected) {
      updatePersonImage("peserta", data, toastId, imageSelected, reset);
    } else {
      updatePerson("peserta", data, toastId, reset);
    }
  };

  // EDIT BUTTON HANDLER
  const handleEdit = (data: PesertaState) => {
    setData(data);
    setUpdating(true);
    setPrevData(data);
  };

  // SET IMAGE PREVIEW ON UPDATE
  useEffect(() => {
    if (updating && data.downloadFotoUrl) {
      setImagePreviewSrc(data.downloadFotoUrl);
    }
  }, [updating, data.downloadFotoUrl]);

  // DELETE BUTTON HANDLER
  const handleDelete = (data: PesertaState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DATA DELETER
  const deleteData = () => {
    setModalVisible(false);
    deletePerson("pesertas", dataToDelete, kontingen, toastId, reset);
  };

  return (
    <div className="h-fit">
      <ToastContainer />
      <RodalPeserta
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        dataToDelete={dataToDelete}
        cancelDelete={reset}
        deleteData={deleteData}
      />
      {kontingenLoading ? (
        <p className="w-full bg-white rounded-md p-2">
          Memuat Data Official <InlineLoading />
        </p>
      ) : (
        <>
          <div className="w-full bg-white rounded-md p-2">
            <TabelPeserta handleEdit={handleEdit} handleDelete={handleDelete} />
          </div>
          <FormPeserta
            data={data}
            setData={setData}
            submitHandler={submitHandler}
            imageChangeHandler={imageChangeHandler}
            imagePreviewSrc={imagePreviewSrc}
            errorMessage={errorMessage}
            kuotaKelas={kuotaKelas}
            kuotaLoading={kuotaLoading}
            reset={reset}
            updating={updating}
          />
        </>
      )}
    </div>
  );
};
export default Peserta;
