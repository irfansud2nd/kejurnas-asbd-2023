import {
  errorPesertaInitialValue,
  jenisPertandingan,
  pesertaInitialValue,
} from "@/utils/formConstants";
import { ErrorPeserta, KontingenState, PesertaState } from "@/utils/formTypes";
import { useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RodalPeserta from "../rodals/RodalPeserta";
import { MyContext } from "@/context/Context";
import { FormContext } from "@/context/FormContext";
import TabelPeserta from "../tabels/TabelPeserta";
import FormPeserta from "../forms/FormPeserta";
import {
  deletePersonFinal,
  sendPersonFinal,
  updatePersonFinal,
  validateImage,
} from "@/utils/formFunctions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/utils/firebase";
import { controlToast } from "@/utils/sharedFunctions";
import { getInputErrorPeserta } from "@/utils/peserta/pesertaFunctions";
import { filterKontingenById } from "@/utils/kontingen/kontingenFunctions";

const Peserta = () => {
  const [data, setData] = useState<PesertaState>(pesertaInitialValue);
  const [prevData, setPrevData] = useState<PesertaState>(pesertaInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [dataToDelete, setDataToDelete] = useState(pesertaInitialValue);
  const [imageSelected, setImageSelected] = useState<File | undefined>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorPeserta>(
    errorPesertaInitialValue
  );
  const [kuotaKelas, setKuotaKelas] = useState<number>(32);
  const [kuotaLoading, setKuotaLoading] = useState(false);

  const { user } = MyContext();
  const { kontingens, kontingensLoading, addKontingens, addPesertas } =
    FormContext();
  const toastId = useRef(null);

  // SET KONTINGEN AND USER INFO
  useEffect(() => {
    if (kontingens.length && !kontingensLoading && user) {
      setData({
        ...data,
        idKontingen: kontingens[0].id,
        creatorEmail: user.email,
        creatorUid: user.uid,
      });
    }
  }, [kontingens, user, kontingensLoading]);

  // RESETER
  const reset = () => {
    setImageSelected(undefined);
    setImagePreviewSrc("");
    clearInputImage();
    setData({
      ...pesertaInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingens[0].id,
    });
    setSubmitClicked(false);
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
      setKuotaKelas(32);
    }
  }, [
    data.tingkatanPertandingan,
    data.kategoriPertandingan,
    data.jenisKelamin,
    data.jenisPertandingan,
  ]);

  // CEK KUOTA TINGKATAN SMA DAN DEWASA
  const cekKuota = async () => {
    let kuota = 32;
    let kuotaGanda = kuota * 2;
    let kuotaRegu = kuota * 3;
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
          if (data.kategoriPertandingan.includes("Regu")) {
            kuotaRegu -= 1;
          } else if (data.kategoriPertandingan.includes("Ganda")) {
            kuotaGanda -= 1;
          } else {
            kuota -= 1;
          }
        });
        if (
          updating &&
          prevData.kategoriPertandingan == data.kategoriPertandingan &&
          prevData.jenisKelamin == data.jenisKelamin &&
          prevData.jenisPertandingan == data.jenisPertandingan
        ) {
          if (data.kategoriPertandingan.includes("Regu")) {
            kuotaRegu += 1;
          } else if (data.kategoriPertandingan.includes("Ganda")) {
            kuotaGanda += 1;
          } else {
            kuota += 1;
          }
        }
        if (data.kategoriPertandingan.includes("Regu")) {
          return kuotaRegu;
        } else if (data.kategoriPertandingan.includes("Ganda")) {
          return kuotaGanda;
        } else {
          return kuota;
        }
      })
      .finally(() => {
        if (data.kategoriPertandingan.includes("Regu")) {
          setKuotaKelas(kuotaRegu);
        } else if (data.kategoriPertandingan.includes("Ganda")) {
          setKuotaKelas(kuotaGanda);
        } else {
          setKuotaKelas(kuota);
        }
        // setKuotaKelas(kuota);
        setKuotaLoading(false);
      });
  };

  // IMAGE CHANGE HANDLER
  const imageChangeHandler = (file: File) => {
    if (validateImage(file, toastId)) {
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
      data.tingkatanPertandingan == "SMA" ||
      data.tingkatanPertandingan == "Dewasa"
    ) {
      controlToast(toastId, "loading", "Cek Kuota Kategori");
      cekKuota().then((res) => {
        if (res) {
          controlToast(toastId, "success", "Kuota Tersedia");
          sendPeserta();
        } else {
          controlToast(
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
  const sendPeserta = async () => {
    if (
      !getInputErrorPeserta(
        data,
        imagePreviewSrc,
        errorMessage,
        setErrorMessage
      )
    )
      return;

    if (!updating && imageSelected) {
      const { person, kontingen } = await sendPersonFinal(
        "peserta",
        data,
        imageSelected,
        filterKontingenById(kontingens, data.idKontingen),
        toastId
      );

      addPesertas([person as PesertaState]);
      addKontingens([kontingen]);
    } else {
      const { person, kontingen } = await updatePersonFinal(
        "peserta",
        data,
        toastId,
        {
          image: imageSelected,
          kontingen: {
            new: filterKontingenById(kontingens, data.idKontingen),
            prev: filterKontingenById(kontingens, prevData.idKontingen),
          },
        }
      );

      addPesertas([person as PesertaState]);
      if (kontingen) addKontingens([kontingen.prev, kontingen.new]);
    }

    reset();
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

  // EDIT BUTTON HANDLER
  const handleEdit = (data: PesertaState) => {
    setData(data);
    setPrevData(data);
    setUpdating(true);
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
  const deleteData = async () => {
    setModalVisible(false);
    const { person, kontingen } = await deletePersonFinal(
      "peserta",
      dataToDelete,
      filterKontingenById(kontingens, dataToDelete.idKontingen),
      toastId
    );

    addPesertas([person as PesertaState]);
    addKontingens([kontingen]);

    reset();
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
      <div className="w-full bg-white rounded-md p-2">
        <TabelPeserta handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      {/* {updating && ( */}
      <FormPeserta
        data={data}
        prevData={prevData}
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
      {/* )} */}
    </div>
  );
};
export default Peserta;
