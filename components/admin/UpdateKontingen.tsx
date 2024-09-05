import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { firestore } from "@/utils/firebase";
import { KontingenState } from "@/utils/formTypes";
import { controlToast } from "@/utils/sharedFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateKontingen = () => {
  const { kontingens } = AdminContext();
  let kontingensToUpdate: KontingenState[] = kontingens;

  const toastId = useRef(null);

  const updateAll = () => {
    const repeater = (index: number) => {
      if (index < 0) {
        controlToast(toastId, "success", "Updating Complete");
      } else {
        const selectedKontingen = kontingensToUpdate[index];
        if (index == kontingensToUpdate.length - 1) {
          controlToast(
            toastId,
            "loading",
            `Updating kontingen ${index}, ${selectedKontingen.namaKontingen}`,
            true
          );
        } else {
          controlToast(
            toastId,
            "loading",
            `Updating kontingen ${index}, ${selectedKontingen.namaKontingen}`
          );
        }
        updateDoc(doc(firestore, "kontingens", selectedKontingen.id), {
          biayaKontingen: selectedKontingen.biayaKontingen
            ? selectedKontingen.idPembayaran[0]
            : "",
        })
          .then(() => repeater(index - 1))
          .catch((error) =>
            controlToast(
              toastId,
              "error",
              `Gagal update kontingen ${index}, ${selectedKontingen.namaKontingen}. ${error.code}`
            )
          );
      }
    };
    repeater(kontingensToUpdate.length - 1);
  };

  return (
    <div>
      <ToastContainer />
      <button className="btn_green mb-1" onClick={updateAll}>
        Update all Kontingen{" "}
        {kontingensToUpdate.length ? (
          kontingensToUpdate.length
        ) : (
          <InlineLoading />
        )}
      </button>
    </div>
  );
};
export default UpdateKontingen;
