import InlineLoading from "@/components/loading/InlineLoading";
import { AdminContext } from "@/context/AdminContext";
import { firestore } from "@/utils/firebase";
import { newToast, updateToast } from "@/utils/sharedFunctions";
import { doc, updateDoc } from "firebase/firestore";
import { useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateKontingen = () => {
  const { kontingens } = AdminContext();
  const kontingensToUpdate = kontingens.splice(
    kontingens.findIndex((item: any) => item.id == "0RRkbCN4dmxqdXcMnRq8"),
    1
  );

  const toastId = useRef(null);

  const updateAll = () => {
    const repeater = (index: number) => {
      if (index < 0) {
        updateToast(toastId, "success", "Updating Complete");
      } else {
        const selectedKontingen = kontingensToUpdate[index];
        if (index == kontingensToUpdate.length - 1) {
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
          unconfirmedPembayaranIds: selectedKontingen.unconfirmedPembayaran,
          confirmedPembayaranIds: selectedKontingen.confirmedPembayaran,
          pembayaran: true,
          biayaKontingen: true,
          confirmedPembayaran: true,
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
    repeater(kontingensToUpdate.length - 1);
  };

  return (
    <div>
      <ToastContainer />
      <button className="btn_green mb-1" onClick={updateAll}>
        Update all Kontingen{" "}
        {kontingensToUpdate.length ? (
          kontingensToUpdate[0].namaKontingen
        ) : (
          <InlineLoading />
        )}
      </button>
    </div>
  );
};
export default UpdateKontingen;
