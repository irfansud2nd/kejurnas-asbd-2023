import { useEffect, useRef, useState } from "react";
import RodalOfficial from "../rodals/RodalOfficial";
import {
  errorOfficialInitialValue,
  officialInitialValue,
} from "@/utils/formConstants";
import { ErrorOfficial, OfficialState } from "@/utils/formTypes";
import { MyContext } from "@/context/Context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FormContext } from "@/context/FormContext";
import TabelOfficial from "../tabels/TabelOfficial";
import FormOfficial from "../forms/FormOfficial";
import {
  deletePerson,
  getInputErrorOfficial,
  limitImage,
  sendPerson,
  updatePerson,
  updatePersonImage,
} from "@/utils/formFunctions";
import InlineLoading from "@/components/loading/InlineLoading";

const Official = () => {
  const [data, setData] = useState<OfficialState>(officialInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [dataToDelete, setDataToDelete] = useState(officialInitialValue);
  const [imageSelected, setImageSelected] = useState<File | null>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorOfficial>(
    errorOfficialInitialValue
  );

  const { user, disable, setDisable } = MyContext();
  const { kontingen, refreshOfficials, kontingenLoading } = FormContext();
  const toastId = useRef(null);

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
    setData({
      ...officialInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingen?.id,
    });
    setImageSelected(null);
    refreshOfficials();
    setModalVisible(false);
    setDataToDelete(officialInitialValue);
    setUpdating(false);
    setSubmitClicked(false);
    setErrorMessage(errorOfficialInitialValue);
    clearInputImage();
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
      getInputErrorOfficial(
        data,
        imagePreviewSrc,
        errorMessage,
        setErrorMessage
      )
    ) {
      if (!updating) {
        if (imageSelected) {
          sendPerson(
            "official",
            data,
            imageSelected,
            kontingen,
            toastId,
            reset
          );
        }
      } else {
        updateControl();
      }
    }
  };

  // ERROR REMOVER
  useEffect(() => {
    if (submitClicked) {
      getInputErrorOfficial(
        data,
        imagePreviewSrc,
        errorMessage,
        setErrorMessage
      );
    }
  }, [data, imageSelected, submitClicked]);

  //   SET IMAGE PREVIEW ON UPDATE
  useEffect(() => {
    if (updating && data.downloadFotoUrl) {
      setImagePreviewSrc(data.downloadFotoUrl);
    }
  }, [updating, data.downloadFotoUrl]);

  // UPDATE CONTROLLER
  const updateControl = () => {
    if (imageSelected) {
      updatePersonImage("official", data, toastId, imageSelected, reset);
    } else {
      updatePerson("official", data, toastId, reset);
    }
  };

  // EDIT BUTTON HANDLER
  const handleEdit = (data: OfficialState) => {
    setData(data);
    setUpdating(true);
  };

  // DELETE BUTTON HANDLER
  const handleDelete = (data: OfficialState) => {
    setModalVisible(true);
    setDataToDelete(data);
  };

  // DELETE OFFICIAL START
  const deleteData = () => {
    setModalVisible(false);
    deletePerson("officials", dataToDelete, kontingen, toastId, reset);
  };

  return (
    <div className="h-fit">
      <ToastContainer />
      <RodalOfficial
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
            <TabelOfficial
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            />
          </div>
          <FormOfficial
            data={data}
            setData={setData}
            submitHandler={submitHandler}
            imageChangeHandler={imageChangeHandler}
            imagePreviewSrc={imagePreviewSrc}
            setImageSelected={setImageSelected}
            errorMessage={errorMessage}
            reset={reset}
            updating={updating}
          />
        </>
      )}
    </div>
  );
};
export default Official;
