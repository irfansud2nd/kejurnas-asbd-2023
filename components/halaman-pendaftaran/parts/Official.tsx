import { useEffect, useRef, useState } from "react";
import RodalOfficial from "../rodals/RodalOfficial";
import {
  errorOfficialInitialValue,
  officialInitialValue,
} from "@/utils/formConstants";
import {
  ErrorOfficial,
  KontingenState,
  OfficialState,
} from "@/utils/formTypes";
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
} from "@/utils/formFunctions";

const Official = () => {
  const [data, setData] = useState<OfficialState>(officialInitialValue);
  const [prevData, setPrevData] = useState<OfficialState>(officialInitialValue);
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
  const {
    kontingens,
    refreshOfficials,
    officialsLoading,
    kontingensLoading,
    refreshKontingens,
  } = FormContext();
  const toastId = useRef(null);

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
    setData({
      ...officialInitialValue,
      creatorEmail: user.email,
      creatorUid: user.uid,
      idKontingen: kontingens[0].id,
    });
    setImageSelected(null);
    refreshKontingens();
    refreshOfficials();
    setModalVisible(false);
    setDataToDelete(officialInitialValue);
    setUpdating(false);
    setPrevData(officialInitialValue);
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
            kontingens[
              kontingens.findIndex(
                (item: KontingenState) => item.id == data.idKontingen
              )
            ],
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
      // updatePersonImage("official", data, toastId, imageSelected, reset);
      updatePerson("official", prevData, data, toastId, reset, imageSelected);
    } else {
      updatePerson("official", prevData, data, toastId, reset);
    }
  };

  // EDIT BUTTON HANDLER
  const handleEdit = (data: OfficialState) => {
    setData(data);
    setPrevData(data);
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
    deletePerson(
      "officials",
      dataToDelete,
      kontingens[
        kontingens.findIndex(
          (item: KontingenState) => item.id == data.idKontingen
        )
      ],
      toastId,
      reset
    );
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
      <div className="w-full bg-white rounded-md p-2">
        <TabelOfficial handleEdit={handleEdit} handleDelete={handleDelete} />
      </div>
      {updating && (
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
      )}
    </div>
  );
};
export default Official;
