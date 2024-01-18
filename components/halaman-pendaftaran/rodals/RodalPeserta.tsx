import { PesertaState } from "@/utils/formTypes";
import Rodal from "rodal";

const RodalPeserta = ({
  modalVisible,
  setModalVisible,
  dataToDelete,
  cancelDelete,
  deleteData,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dataToDelete: PesertaState;
  cancelDelete: () => void;
  deleteData: () => void;
}) => {
  return (
    <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col justify-between">
          <h1 className="font-semibold text-red-500">Hapus Official</h1>
          <p>
            {dataToDelete.pembayaran
              ? "Maaf peserta yang sudah membayar biaya pendaftaran tidak dapat dihapus"
              : `Apakah anda yakin akan menghapus ${dataToDelete.namaLengkap} dari Peserta?`}
          </p>
          <div className="self-end flex gap-2">
            {!dataToDelete.pembayaran && (
              <button
                className="btn_red btn_full"
                onClick={deleteData}
                type="button"
              >
                Yakin
              </button>
            )}
            <button
              className="btn_green btn_full"
              onClick={cancelDelete}
              type="button"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </Rodal>
  );
};
export default RodalPeserta;
