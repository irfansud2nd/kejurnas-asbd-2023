import { OfficialState } from "@/utils/formTypes";
import Rodal from "rodal";
import "rodal/lib/rodal.css";

const RodalOfficial = ({
  modalVisible,
  setModalVisible,
  dataToDelete,
  cancelDelete,
  deleteData,
}: {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  dataToDelete: OfficialState;
  cancelDelete: () => void;
  deleteData: () => void;
}) => {
  return (
    <Rodal visible={modalVisible} onClose={() => setModalVisible(false)}>
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col justify-between">
          <h1 className="font-semibold text-red-500">Hapus Official</h1>
          <p>
            Apakah anda yakin akan menghapus {dataToDelete.namaLengkap} dari
            Official?
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
      </div>
    </Rodal>
  );
};
export default RodalOfficial;
