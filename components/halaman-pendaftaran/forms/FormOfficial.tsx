import { MyContext } from "@/context/Context";
import { FormOfficialProps } from "@/utils/formTypes";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { jabatanOfficial, jenisKelaminDewasa } from "@/utils/formConstants";
import { FormContext } from "@/context/FormContext";

const FormOfficial = ({
  data,
  setData,
  submitHandler,
  imageChangeHandler,
  imagePreviewSrc,
  errorMessage,
  reset,
  updating,
}: FormOfficialProps) => {
  const { disable } = MyContext();
  const { kontingen } = FormContext();

  return (
    <form
      className="bg-white rounded-md p-2 mt-2"
      onSubmit={(e) => submitHandler(e)}
    >
      <div className="w-full flex flex-wrap sm:flex-nowrap justify-center gap-3">
        {/* KOLOM KIRI */}
        {/* PAS FOT0 */}
        <div className="input_container max-w-[150px]">
          <label className="input_label text-center">Pas Foto</label>
          <p className="-mt-2 text-sm text-gray-600 text-center">Maks. 1MB</p>
          <div
            className={`
            ${
              errorMessage.pasFoto
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
          <p className="text-red-500 text-center">{errorMessage.pasFoto}</p>
        </div>
        {/* PAS FOT0 */}
        {/* KOLOM KIRI */}

        {/* KOLOM KANAN */}
        <div className="w-full flex flex-wrap justify-center sm:justify-normal gap-3 h-fit">
          {/* NAMA LENGKAP */}
          <div className="input_container">
            <label className="input_label">Nama Lengkap</label>
            <input
              disabled={disable}
              className={`
                  ${errorMessage.namaLengkap ? "input_error" : "input"}`}
              type="text"
              value={data.namaLengkap}
              onChange={(e) =>
                setData({ ...data, namaLengkap: e.target.value })
              }
            />
            <p className="text-red-500">{errorMessage.namaLengkap}</p>
          </div>
          {/* NAMA LENGKAP */}

          {/* JENIS KELAMIN */}
          <div className="input_container">
            <label className="input_label">Jenis Kelamin</label>
            <select
              disabled={disable}
              className={`
                  ${errorMessage.jenisKelamin ? "input_error" : "input"}
                  `}
              value={data.jenisKelamin}
              onChange={(e) =>
                setData({ ...data, jenisKelamin: e.target.value })
              }
            >
              {jenisKelaminDewasa.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
            <p className="text-red-500">{errorMessage.jenisKelamin}</p>
          </div>
          {/* JENIS KELAMIN */}

          {/* JABATAN */}
          <div className="input_container">
            <label className="input_label">Jabatan</label>
            <select
              disabled={disable}
              className={`
                  ${errorMessage.jabatan ? "input_error" : "input"}
                  `}
              value={data.jabatan}
              onChange={(e) => setData({ ...data, jabatan: e.target.value })}
            >
              {jabatanOfficial.map((item) => (
                <option value={item} className="capitalize" key={item}>
                  {item}
                </option>
              ))}
            </select>
            <p className="text-red-500">{errorMessage.jabatan}</p>
          </div>
          {/* JABATAN */}

          {/* NAMA KONTINGEN */}
          <div className="input_container">
            <label className="input_label">Nama Kontingen</label>
            <input type="text" disabled value={kontingen.namaKontingen} />
            <p className="text-red-500">{errorMessage.idKontingen}</p>
          </div>
          {/* NAMA KONTINGEN */}
        </div>
        {/* KOLOM KANAN */}
      </div>
      {/* BARIS 1 */}

      {/* BARIS 2 */}
      {/* BOTTONS */}
      <div className="mt-2 flex gap-2 justify-end self-end">
        <button
          disabled={disable}
          className="btn_red btn_full"
          onClick={reset}
          type="button"
        >
          Batal
        </button>
        <button disabled={disable} className="btn_green btn_full" type="submit">
          {updating ? "Perbaharui" : "Simpan"}
        </button>
      </div>
      {/* BUTTONS */}
      {/* BARIS 2 */}
    </form>
  );
};
export default FormOfficial;
