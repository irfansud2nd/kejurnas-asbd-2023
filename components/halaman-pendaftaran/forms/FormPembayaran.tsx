import { MyContext } from "@/context/Context";
import { FormContext } from "@/context/FormContext";
import { firestore, storage } from "@/utils/firebase";
import { limitImage } from "@/utils/formFunctions";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { BiCopy } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormPembayaran = ({ totalBiaya }: { totalBiaya: number }) => {
  const [imageSelected, setImageSelected] = useState<File>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [noHp, setNoHp] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    bukti: "",
    noHp: "",
  });
  const [submitClicked, setSubmitClicked] = useState(false);
  const [unpaidPeserta, setUnpaidPeserta] = useState<string[]>([]);

  const { disable, setDisable } = MyContext();
  const {
    kontingen,
    pesertas,
    refreshPesertas,
    refreshKontingen,
  }: {
    kontingen: KontingenState;
    pesertas: PesertaState[];
    refreshPesertas: () => void;
    refreshKontingen: () => void;
  } = FormContext();
  const toastId = useRef(null);

  useEffect(() => {
    getUnpaidPeserta();
  }, [pesertas]);

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

  // RESET
  const reset = () => {
    setSubmitClicked(false);
    setImageSelected(undefined);
    setImagePreviewSrc("");
    setNoHp("");
    setErrorMessage({
      bukti: "",
      noHp: "",
    });
    clearInputImage();
    refreshPesertas();
    refreshKontingen();
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

  // GET ERROR MESSAGE
  const getErrorMessage = () => {
    setErrorMessage({
      bukti: imageSelected ? "" : "Tolong Lengkapi Bukti Pembayaran",
      noHp: noHp ? "" : "Tolong Lengkapii Nomor HP",
    });
    if (imageSelected && noHp) return true;
    return false;
  };

  // SUBMIT HANDLER
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitClicked(true);
    if (unpaidPeserta.length) {
      if (getErrorMessage()) {
        sendPembayaran();
      }
    } else {
      newToast(toastId, "error", "Tidak ada peserta yang harus dibayar");
      reset();
    }
  };

  // SEND PEMBAYARAN
  const sendPembayaran = () => {
    if (!imageSelected) return;
    newToast(toastId, "loading", "sending image");
    setDisable(true);
    const time = Date.now();
    const idPembayaran = `${kontingen.id}-${time}`;
    const url = `buktiPembayarans/${idPembayaran}.${
      imageSelected.type.split("/")[1]
    }`;
    uploadBytes(ref(storage, url), imageSelected).then((snapshot) =>
      getDownloadURL(snapshot.ref).then((downloadUrl) => {
        updateToast(toastId, "loading", "sending url to pesertas");
        sendUrlToPesertas(
          downloadUrl,
          unpaidPeserta.length - 1,
          time,
          idPembayaran
        );
      })
    );
  };

  // SEND URL TO ALL PESERTA
  const sendUrlToPesertas = (
    url: string,
    pesertasIndex: number,
    time: number,
    idPembayaran: string
  ) => {
    const id = unpaidPeserta[pesertasIndex];
    if (pesertasIndex >= 0) {
      updateDoc(doc(firestore, "pesertas", id), {
        pembayaran: true,
        idPembayaran: idPembayaran,
        infoPembayaran: {
          noHp: noHp,
          waktu: time,
          buktiUrl: url,
        },
      })
        .then(() => {
          sendUrlToPesertasRepeater(url, pesertasIndex - 1, time, idPembayaran);
        })
        .catch((error) =>
          updateToast(
            toastId,
            "error",
            `Gagal menyimpan data pembayaran ke peserta. ${error.code}`
          )
        );
    } else {
      updateToast(toastId, "loading", "sending url to kontingen");
      sendUrlToKontingen(url, time, idPembayaran);
    }
  };

  const sendUrlToPesertasRepeater = (
    url: string,
    pesertasIndex: number,
    time: number,
    idPembayaran: string
  ) => {
    if (pesertasIndex < 0) {
      updateToast(toastId, "loading", "sending url to kontingen");
      sendUrlToKontingen(url, time, idPembayaran);
    } else {
      sendUrlToPesertas(url, pesertasIndex, time, idPembayaran);
    }
  };

  // SEND URL TO ALL KONTINGEN
  const sendUrlToKontingen = (
    url: string,
    time: number,
    idPembayaran: string
  ) => {
    const id = kontingen.id;
    if (id) {
      updateDoc(doc(firestore, "kontingens", id), {
        idPembayaran: arrayUnion(idPembayaran),
        unconfirmedPembayaran: arrayUnion(idPembayaran),
        infoPembayaran: arrayUnion({
          idPembayaran: idPembayaran,
          nominal: `Rp. ${(totalBiaya / 1000).toLocaleString("id")}.${noHp
            .split("")
            .slice(-3)
            .join("")}`,
          noHp: noHp,
          waktu: time,
          buktiUrl: url,
        }),
      })
        .then(() => {
          updateToast(
            toastId,
            "success",
            "Berhasil menyimpan bukti pembayaran"
          );
          reset();
        })
        .catch((error) =>
          updateToast(
            toastId,
            "error",
            `Gagal menyimpan data pembayaran ke kontingen ${error.code}`
          )
        )
        .finally(() => {
          setDisable(false);
        });
    } else {
      newToast(toastId, "error", "id undefined");
    }
  };

  // ERROR REMOVER
  useEffect(() => {
    if (submitClicked) getErrorMessage();
  }, [noHp, imageSelected, submitClicked]);

  // GENERATE UNPAID PESERTA
  const getUnpaidPeserta = (override?: boolean) => {
    let unpaidPeserta: string[] = [];
    pesertas.map((peserta) => {
      if (!peserta.pembayaran) unpaidPeserta.push(peserta.id);
    });
    setUnpaidPeserta(unpaidPeserta);
  };

  return (
    <>
      <ToastContainer />
      <form
        className="bg-white w-full rounded-md p-2 mt-2 flex flex-wrap justify-center gap-x-3 gap-y-2"
        onSubmit={(e) => submitHandler(e)}
      >
        {/* BUKTI */}
        <div className="input_container max-w-[150px]">
          <label className="input_label text-center">Bukti Pembayaran</label>
          <p className="-mt-2 text-sm text-gray-600 text-center">Maks. 1MB</p>
          <div
            className={`
            ${
              errorMessage.bukti
                ? "border-red-500"
                : disable
                ? "border-gray-200"
                : "border-black"
            }
            bg-white w-[150px] h-[200px] relative border-2 rounded-md`}
          >
            {imagePreviewSrc && (
              <Image
                src={imagePreviewSrc}
                alt="preview"
                fill
                className="object-cover rounded-md"
              />
            )}
          </div>
          <input
            disabled={disable}
            accept=".jpg, .jpeg, .png"
            type="file"
            multiple={false}
            onChange={(e) =>
              e.target.files && imageChangeHandler(e.target.files[0])
            }
            className="input_file mt-1 w-full text-transparent"
          />
          <p className="text-red-500 text-center">{errorMessage.bukti}</p>
        </div>
        {/* BUKTI */}

        {/* NO HP AND NOMINAL */}
        <div className="input_container">
          <label className="input_label">Nomor HP</label>
          <input
            disabled={disable}
            value={noHp}
            type="text"
            onChange={(e) => setNoHp(e.target.value.replace(/[^0-9]/g, ""))}
            className={`
                ${errorMessage.noHp ? "input_error" : "input"}
                `}
          />
          <p className="text-red-500">{errorMessage.noHp}</p>
          <label>
            Nominal Transfer{" "}
            <button
              className="ml-1 bg-gray-200 p-1 rounded-md text-sm"
              onClick={() =>
                navigator.clipboard.writeText(
                  (totalBiaya / 1000).toString() +
                    noHp.split("").slice(-3).join("")
                )
              }
              type="button"
            >
              <BiCopy />
            </button>
          </label>
          <input
            type="text"
            disabled
            value={
              "Rp. " +
              (totalBiaya / 1000).toLocaleString("id") +
              "." +
              noHp.split("").slice(-3).join("")
            }
          />
          <div className="flex gap-2 w-full justify-center mt-2 min-[421px]:justify-end h-full items-end">
            <button className="btn_red" type="button" onClick={reset}>
              Batal
            </button>
            <button className="btn_green">Simpan</button>
          </div>
        </div>
        {/* NO HP AND NOMINAL */}
      </form>
    </>
  );
};
export default FormPembayaran;
