import { MyContext } from "@/context/Context";
import ErrorMessage from "../ErrorMessage";
import { FormKontingenProps } from "@/utils/formTypes";

const FormKontingen = ({
  sendKontingen,
  errorMessage,
  data,
  setData,
  reset,
  updating,
}: FormKontingenProps) => {
  const { disable } = MyContext();
  return (
    <form
      onSubmit={(e) => sendKontingen(e)}
      className="bg-white rounded-md p-2 mt-2"
    >
      <div className="input_container">
        <label>Nama Kontingen</label>
        <div className="flex gap-y-2 gap-x-5">
          <input
            type="text"
            disabled={disable}
            className={errorMessage ? "input_error" : ""}
            value={data.namaKontingen}
            onChange={(e) =>
              setData({ ...data, namaKontingen: e.target.value })
            }
          />

          <div className="flex gap-3">
            <button
              disabled={disable}
              className="btn_red btn_full"
              onClick={reset}
              type="button"
            >
              Batal
            </button>
            <button
              disabled={disable}
              className="btn_green btn_full"
              type="submit"
            >
              {updating ? "Perbaharui" : "Simpan"}
            </button>
          </div>
        </div>
        <ErrorMessage message={errorMessage} />
      </div>
    </form>
  );
};
export default FormKontingen;
