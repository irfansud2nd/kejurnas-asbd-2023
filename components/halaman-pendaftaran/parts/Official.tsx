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
  createPerson,
  updatePerson,
  validateImage,
} from "@/utils/formFunctions";
import { getInputErrorOfficial } from "@/utils/official/officialFunctions";
import { filterKontingenById } from "@/utils/kontingen/kontingenFunctions";

const Official = () => {
  const [data, setData] = useState<OfficialState>(officialInitialValue);
  const [prevData, setPrevData] = useState<OfficialState>(officialInitialValue);
  const [updating, setUpdating] = useState<boolean>(false);
  const [officialToDelete, setDataToDelete] = useState(officialInitialValue);
  const [imageSelected, setImageSelected] = useState<File | undefined>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ErrorOfficial>(
    errorOfficialInitialValue
  );

  const { user, disable, setDisable } = MyContext();
  const {
    kontingens,
    kontingensLoading,
    addKontingens,
    addOfficials,
    deleteOfficial,
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
    setImageSelected(undefined);
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
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitClicked(true);
    if (
      !getInputErrorOfficial(
        data,
        imagePreviewSrc,
        errorMessage,
        setErrorMessage
      )
    )
      return;
    if (!updating && imageSelected) {
      const { person, kontingen } = await createPerson(
        "official",
        data,
        imageSelected,
        filterKontingenById(kontingens, data.idKontingen),
        toastId
      );

      addOfficials([person as OfficialState]);
      addKontingens([kontingen]);
    } else {
      const { person, kontingen } = await updatePerson(
        "official",
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

      addOfficials([person as OfficialState]);
      if (kontingen) addKontingens([kontingen.prev, kontingen.new]);
    }

    reset();
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
  const deleteData = async () => {
    setModalVisible(false);
    const { person, kontingen } = await deletePerson(
      "official",
      officialToDelete,
      filterKontingenById(kontingens, officialToDelete.idKontingen),
      toastId
    );

    deleteOfficial(officialToDelete.id);
    kontingen && addKontingens([kontingen]);

    reset();
  };

  return (
    <div className="h-fit">
      {/* <ToastContainer /> */}

      <RodalOfficial
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        dataToDelete={officialToDelete}
        cancelDelete={reset}
        deleteData={deleteData}
      />
      <div className="w-full bg-white rounded-md p-2">
        <TabelOfficial handleEdit={handleEdit} handleDelete={handleDelete} />
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
    </div>
  );
};
export default Official;
