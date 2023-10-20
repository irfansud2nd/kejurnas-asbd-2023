import { AdminContext } from "@/context/AdminContext";
import { firestore } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateKontingen = () => {
  const { kontingens } = AdminContext();

  const toastId = useRef(null);

  const updateAll = () => {
    const repeater = (index: number) => {
      if (index < 0) {
        updateToast(toastId, "success", "Updating Complete");
      } else {
        const selectedKontingen = kontingens[index];
        if (index == kontingens.length - 1) {
          newToast(
            toastId,
            "loading",
            `Updating kontingen ${index}, ${selectedKontingen.namaKontingen}`
          );
        } else {
          updateToast(
            toastId,
            "loading",
            `Updating kontingen ${index}, ${selectedKontingen.namaKontingen}`
          );
        }
        updateDoc(doc(firestore, "kontingens", selectedKontingen.id), {
          unconfirmedPembayaran: false,
        })
          .then(() => repeater(index - 1))
          .catch((error) =>
            updateToast(
              toastId,
              "error",
              `Gagal update kontingen ${index}, ${selectedKontingen.namaKontingen}. ${error.code}`
            )
          );
      }
    };
    repeater(kontingens.length - 1);
  };
  return (
    <div>
      <ToastContainer />
      <button className="btn_green" onClick={updateAll}>
        Update all Kontingen
      </button>
    </div>
  );
};
export default UpdateKontingen;
