import { MyContext } from "@/context/Context";
import { FormContext } from "@/context/FormContext";
import { updateData } from "@/utils/actions";
import { totalToNominal, validateImage } from "@/utils/formFunctions";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { sendFile, toastError } from "@/utils/functions";
import { filterKontingenById } from "@/utils/kontingen/kontingenFunctions";
import { createPembayaran } from "@/utils/pembayaran/pembayaranFunctions";
import { filterPesertaByIdKontingen } from "@/utils/peserta/pesertaFunctions";
import { controlToast } from "@/utils/sharedFunctions";
import { useState, useRef, useEffect } from "react";
import { BiCopy } from "react-icons/bi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FormPembayaran = ({
  totalBiaya,
  kontingenToPay,
}: {
  totalBiaya: number;
  kontingenToPay: KontingenState;
}) => {
  const [imageSelected, setImageSelected] = useState<File>();
  const [imagePreviewSrc, setImagePreviewSrc] = useState("");
  const [noHp, setNoHp] = useState("");
  const [errorMessage, setErrorMessage] = useState({
    bukti: "",
    noHp: "",
  });
  const [submitClicked, setSubmitClicked] = useState(false);
  const [unpaidPeserta, setUnpaidPeserta] = useState<PesertaState[]>([]);

  const { disable, setDisable } = MyContext();
  const { kontingens, pesertas, addKontingens, addPesertas } = FormContext();
  const toastId = useRef(null);

  useEffect(() => {
    getUnpaidPeserta();
  }, [pesertas, kontingenToPay]);

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

    if (!unpaidPeserta.length && kontingenToPay.biayaKontingen) {
      toastError(toastId, "Tidak ada peserta yang harus dibayar", true);
      reset();
      return;
    }
    if (getErrorMessage()) sendPembayaran();
  };

  // SEND PEMBAYARAN
  const sendPembayaran = async () => {
    if (!imageSelected) return;
    setDisable(true);

    const { kontingen: updatedKontingen, pesertas: updatedPesertas } =
      await createPembayaran(
        imageSelected,
        noHp,
        totalToNominal(totalBiaya, noHp),
        kontingenToPay,
        unpaidPeserta,
        toastId
      );

    addKontingens([updatedKontingen]);
    addPesertas(updatedPesertas);

    setDisable(false);
  };

  // ERROR REMOVER
  useEffect(() => {
    if (submitClicked) getErrorMessage();
  }, [noHp, imageSelected, submitClicked]);

  // GENERATE UNPAID PESERTA
  const getUnpaidPeserta = (override?: boolean) => {
    let unpaidPeserta: PesertaState[] = [];
    pesertas.map((peserta) => {
      if (!peserta.pembayaran && peserta.idKontingen == kontingenToPay.id)
        unpaidPeserta.push(peserta);
    });
    setUnpaidPeserta(unpaidPeserta);
  };

  return (
    <>
      {/* <ToastContainer /> */}

      <div className="bg-white w-full rounded-md p-2 mt-2">
        <p className="text-center text-xl bg-red-500 w-fit rounded-md mx-auto px-2 text-white mb-2">
          Pembayaran untuk <b>{kontingenToPay.namaKontingen}</b>
        </p>
        <form
          className="flex flex-wrap justify-center gap-x-3 gap-y-2"
          onSubmit={(e) => submitHandler(e)}
        >
          {/* BUKTI */}
          <div className="input_container max-w-[150px]">
            <label className="input_label text-center leading-none mb-2">
              Bukti Pembayaran
            </label>
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
                <img
                  src={imagePreviewSrc}
                  alt="preview"
                  className="w-full h-full absolute object-cover rounded-sm"
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
      </div>
    </>
  );
};
export default FormPembayaran;
