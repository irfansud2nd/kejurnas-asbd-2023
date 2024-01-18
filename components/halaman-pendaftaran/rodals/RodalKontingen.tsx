import { KontingenState } from "@/utils/formTypes";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const RodalKontingen = ({
  modalVisible,
  setModalVisible,
  dataToDelete,
  cancelDelete,
  deleteData,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dataToDelete: KontingenState;
  cancelDelete: () => void;
  deleteData: () => void;
}) => {
  return (
    <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
      <div className="h-full w-full">
        {dataToDelete.idPembayaran.length ? (
          <div className="h-full w-full flex flex-col justify-between">
            <h1 className="font-semibold text-red-500">
              Tidak dapat menghapus kontingen
            </h1>
            <p>
              Maaf, kontingen yang pesertanya sudah diselesaikan pembayarannya
              tidak dapat dihapus
            </p>
            <button
              onClick={cancelDelete}
              className="self-end btn_green btn_full"
              type="button"
            >
              Ok
            </button>
          </div>
        ) : (
          <div className="h-full w-full flex flex-col justify-between">
            <h1 className="font-semibold text-red-500">Hapus kontingen</h1>
            <p>
              {dataToDelete.officials.length !== 0 ||
              dataToDelete.officials.length !== 0 ? (
                <span>
                  jika anda memilih untuk menghapus kontingen ini,{" "}
                  {dataToDelete.officials.length} Official dan{" "}
                  {dataToDelete.pesertas.length} Peserta yang tergabung di dalam
                  kontingen {dataToDelete.namaKontingen} akan ikut terhapus
                  <br />
                </span>
              ) : null}
              Apakah anda yakin akan menghapus Kontingen?
            </p>
            <div className="self-end flex gap-2">
              <button
                className="btn_red btn_full"
                onClick={deleteData}
                type="button"
              >
                Yakin
              </button>
              <button
                className="btn_green btn_full"
                onClick={cancelDelete}
                type="button"
              >
                Batal
              </button>
            </div>
          </div>
        )}
      </div>
    </Rodal>
  );
};
export default RodalKontingen;
