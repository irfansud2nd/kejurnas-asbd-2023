import InlineLoading from "@/components/loading/InlineLoading";
import { MyContext } from "@/context/Context";
import { FormContext } from "@/context/FormContext";
import {
  jenisKelamin,
  jenisPertandingan,
  kategoriAsbd,
  tingkatanKategori,
  tingkatanKategoriJurusAsbd,
} from "@/utils/formConstants";
import { FormPesertaProps } from "@/utils/formTypes";
import Image from "next/image";
import { useEffect } from "react";

const FormPeserta = ({
  data,
  setData,
  submitHandler,
  imageChangeHandler,
  imagePreviewSrc,
  errorMessage,
  kuotaKelas,
  kuotaLoading,
  reset,
  updating,
}: FormPesertaProps) => {
  const { disable } = MyContext();
  const { kontingen } = FormContext();

  // SANITIZE NIK
  const sanitizeNIK = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    if (sanitizedValue.length <= 16) {
      setData({ ...data, NIK: sanitizedValue.toString() });
    }
  };

  //  GENERATE AGE
  const calculateAge = (date: any) => {
    const birthDate = new Date(date);
    const currentDate = new Date();
    currentDate.getTime();
    let age: string | Date = new Date(
      currentDate.getTime() - birthDate.getTime()
    );
    age = `${age.getFullYear() - 1970} Tahun, ${age.getMonth()} Bulan`;
    setData({ ...data, tanggalLahir: date, umur: age });
  };

  // SANITIZE NUMBER
  const sanitizeNumber = (value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, "");
    return Number(sanitizedValue);
  };

  // DATA LISTENER TO CHANGE DEFAULT KATEGORI
  useEffect(() => {
    let kategoriDefault =
      data.jenisPertandingan == jenisPertandingan[0]
        ? tingkatanKategori[
            tingkatanKategori.findIndex(
              (item) => item.tingkatan == data.tingkatanPertandingan
            )
          ].kategoriTanding[0]
        : data.jenisKelamin == jenisKelamin[0]
        ? tingkatanKategori[
            tingkatanKategori.findIndex(
              (item) => item.tingkatan == data.tingkatanPertandingan
            )
          ].kategoriSeni.putra[0]
        : tingkatanKategori[
            tingkatanKategori.findIndex(
              (item) => item.tingkatan == data.tingkatanPertandingan
            )
          ].kategoriSeni.putri[0];

    if (data.idKontingen) {
      if (data.jenisPertandingan == jenisPertandingan[2]) {
        const sabukDefault = data.sabuk
          ? data.sabuk
          : tingkatanKategoriJurusAsbd[0].sabuk;
        const jurusDefault =
          tingkatanKategoriJurusAsbd[
            tingkatanKategoriJurusAsbd.findIndex(
              (item) => item.sabuk == data.sabuk
            )
          ].jurus[0];
        const kategoriDefaultAsbd =
          data.jenisKelamin == jenisKelamin[0]
            ? kategoriAsbd.putra[0]
            : kategoriAsbd.putri[0];
        setData({
          ...data,
          sabuk: sabukDefault,
          jurus: jurusDefault,
          kategoriPertandingan: kategoriDefaultAsbd,
        });
      } else {
        setData({
          ...data,
          kategoriPertandingan: kategoriDefault,
        });
      }
    }
  }, [
    data.tingkatanPertandingan,
    data.jenisPertandingan,
    data.jenisKelamin,
    data.idKontingen,
    data.sabuk,
  ]);

  return (
    <form
      onSubmit={(e) => submitHandler(e)}
      className="bg-white rounded-md p-2 mt-2"
    >
      <div className="grid grid-rows-[1fr_auto] gap-2">
        {/* BARIS 1 */}
        {/* <div className="w-full flex flex-wrap sm:flex-nowrap justify-center gap-3"> */}
        <div className="w-full flex flex-wrap justify-center min-[825px]:grid min-[825px]:grid-cols-[auto_1fr] gap-3">
          {/* KOLOM KIRI */}
          {/* PAS FOTO */}
          <div className="input_container max-w-[150px] ">
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
          {/* PAS FOTO */}
          {/* KOLOM KIRI */}

          {/* KOLOM KANAN */}
          <div className="w-full grid sm:grid-rows-5 md:grid-rows-4 lg:grid-rows-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 h-fit">
            {/* NAMA LENGKAP */}
            <div className="input_container">
              <label className="input_label">Nama Lengkap</label>
              <input
                disabled={disable}
                className={`${
                  errorMessage.namaLengkap ? "input_error" : "input"
                } capitalize`}
                type="text"
                value={data.namaLengkap}
                onChange={(e) =>
                  setData({
                    ...data,
                    namaLengkap: e.target.value.toLowerCase(),
                  })
                }
              />
              <p className="text-red-500">{errorMessage.namaLengkap}</p>
            </div>
            {/* NAMA LENGKAP */}

            {/* NIK */}
            <div className="input_container">
              <label className="input_label">NIK</label>
              <input
                disabled={disable}
                value={data.NIK}
                type="text"
                onChange={(e) => sanitizeNIK(e.target.value)}
                className={`
                ${errorMessage.NIK ? "input_error" : "input"}
                `}
              />
              <p className="text-red-500">{errorMessage.NIK}</p>
            </div>
            {/* NIK */}

            {/* JENIS KELAMIN */}
            <div className="input_container">
              <label className="input_label">Jenis Kelamin</label>
              <select
                disabled={disable}
                value={data.jenisKelamin}
                onChange={(e) =>
                  setData({ ...data, jenisKelamin: e.target.value })
                }
                className={`
                ${errorMessage.jenisKelamin ? "input_error" : "input"}
                `}
              >
                {jenisKelamin.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <p className="text-red-500">{errorMessage.jenisKelamin}</p>
            </div>
            {/* JENIS KELAMIN */}

            {/* ALAMAT LENGKAP */}
            <div className="input_container">
              <label className="input_label">Alamat Lengkap</label>
              <textarea
                disabled={disable}
                value={data.alamatLengkap}
                onChange={(e) =>
                  setData({
                    ...data,
                    alamatLengkap: e.target.value,
                  })
                }
                className={`
                ${errorMessage.alamatLengkap ? "input_error" : "input"}
                `}
              />
              <p className="text-red-500">{errorMessage.alamatLengkap}</p>
            </div>
            {/* ALAMAT LENGKAP */}

            {/* TEMPAT LAHIR */}
            <div className="input_container">
              <label className="input_label">Tempat Lahir</label>
              <input
                disabled={disable}
                value={data.tempatLahir}
                type="text"
                onChange={(e) =>
                  setData({
                    ...data,
                    tempatLahir: e.target.value,
                  })
                }
                className={`
                ${errorMessage.tempatLahir ? "input_error" : "input"}
                `}
              />
              <p className="text-red-500">{errorMessage.tempatLahir}</p>
            </div>
            {/* TEMPAT LAHIR */}

            {/* TANGGAL LAHIR */}
            <div className="input_container">
              <label className="input_label">Tanggal Lahir</label>
              <input
                disabled={disable}
                value={data.tanggalLahir}
                type="date"
                onChange={(e) => calculateAge(e.target.value)}
                className={`
                ${errorMessage.tanggalLahir ? "input_error" : "input"}
                `}
              />
              <p className="text-red-500">{errorMessage.tanggalLahir}</p>
            </div>
            {/* TANGGAL LAHIR */}

            {/* TINGGI BADAN */}
            <div className="input_container">
              <label className="input_label">
                Tinggi Badan <span className="text-sm text-gray-600">(CM)</span>
              </label>
              <input
                disabled={disable}
                value={data.tinggiBadan == 0 ? "" : data.tinggiBadan}
                type="text"
                onChange={(e) =>
                  setData({
                    ...data,
                    tinggiBadan: sanitizeNumber(e.target.value),
                  })
                }
                className={`
                ${errorMessage.tinggiBadan ? "input_error" : "input"}
                `}
              />
              <p className="text-red-500">{errorMessage.tinggiBadan}</p>
            </div>
            {/* TINGGI BADAN */}

            {/* BERAT BADAN */}
            <div className="input_container">
              <label className="input_label">
                Berat Badan <span className="text-sm text-gray-600">(KG)</span>
              </label>
              <input
                disabled={disable}
                value={data.beratBadan == 0 ? "" : data.beratBadan}
                type="text"
                step={0.1}
                onChange={(e) =>
                  setData({
                    ...data,
                    beratBadan: sanitizeNumber(e.target.value),
                  })
                }
                className={`
                ${errorMessage.beratBadan ? "input_error" : "input"}
                `}
              />
              <p className="text-red-500">{errorMessage.beratBadan}</p>
            </div>
            {/* BERAT BADAN */}

            {/* NAMA KONTINGEN */}
            <div className="input_container">
              <label className="input_label">Nama Kontingen</label>
              <input type="text" disabled value={kontingen.namaKontingen} />
              <p className="text-red-500">{errorMessage.idKontingen}</p>
            </div>
            {/* NAMA KONTINGEN */}

            {/* TINGKATAN */}
            <div className="input_container">
              <label className="input_label">Tingkatan</label>
              <select
                disabled={disable}
                value={data.tingkatanPertandingan}
                onChange={(e) => {
                  setData({
                    ...data,
                    tingkatanPertandingan: e.target.value,
                  });
                }}
                className={`
                ${errorMessage.tingkatanPertandingan ? "input_error" : "input"}
                `}
              >
                {tingkatanKategori.map((item) => (
                  <option value={item.tingkatan} key={item.tingkatan}>
                    {item.tingkatan}
                  </option>
                ))}
              </select>
              <p className="text-red-500">
                {errorMessage.tingkatanPertandingan}
              </p>
            </div>
            {/* TINGKATAN */}

            {/* JENIS PERTANDINGAN */}
            <div className="input_container">
              <label className="input_label">Jenis Pertaindingan</label>
              <select
                disabled={disable}
                value={data.jenisPertandingan}
                onChange={(e) =>
                  setData({
                    ...data,
                    jenisPertandingan: e.target.value,
                    kategoriPertandingan:
                      e.target.value == "Tanding"
                        ? tingkatanKategori[
                            tingkatanKategori.findIndex(
                              (i) => i.tingkatan == data.tingkatanPertandingan
                            )
                          ].kategoriTanding[0]
                        : tingkatanKategori[
                            tingkatanKategori.findIndex(
                              (i) => i.tingkatan == data.tingkatanPertandingan
                            )
                          ].kategoriTanding[0],
                  })
                }
                className={`
                 ${errorMessage.jenisPertandingan ? "input_error" : "input"}
                `}
              >
                {jenisPertandingan.map((item) => (
                  <option value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
              <p className="text-red-500">{errorMessage.jenisPertandingan}</p>
            </div>
            {/* JENIS PERTANDINGAN */}

            {/* KATEGORI TANDING */}
            {data.jenisPertandingan == "Jurus ASBD" && (
              <>
                {/* TINGKATAN SABUK */}
                <div className="input_container">
                  <label className="input_label">Tingkatan Sabuk</label>
                  <select
                    disabled={disable}
                    value={data.sabuk}
                    onChange={(e) => {
                      setData({
                        ...data,
                        sabuk: e.target.value,
                      });
                    }}
                    // className={`
                    // ${
                    //   errorMessage.kategoriPertandingan
                    //     ? "input_error"
                    //     : kuotaKelas
                    //     ? "input"
                    //     : "input_error"
                    // }
                    // input
                    // `}
                  >
                    {tingkatanKategoriJurusAsbd.map((item) => (
                      <option value={item.sabuk} key={item.sabuk}>
                        {item.sabuk}
                      </option>
                    ))}
                  </select>
                  <p className="text-red-500">
                    {errorMessage.kategoriPertandingan}
                  </p>
                  {/* {(data.tingkatanPertandingan == "SMA" ||
                  data.tingkatanPertandingan == "Dewasa") &&
                  (kuotaLoading ? (
                    <p className="text-end">
                      Memuat kuota kategori <InlineLoading />
                    </p>
                  ) : !kuotaKelas ? (
                    <p className="text-end text-red-500">
                      Kuota kategori habis
                    </p>
                  ) : (
                    <p className="text-end">
                      Sisa kuota kategori: {kuotaKelas} peserta
                    </p>
                  ))} */}
                </div>

                {/* JURUS */}
                {data.sabuk && (
                  <div className="input_container">
                    <label className="input_label">Jurus</label>
                    <select
                      disabled={disable}
                      value={data.kategoriPertandingan}
                      onChange={(e) => {
                        setData({
                          ...data,
                          jurus: e.target.value,
                        });
                      }}
                      //   className={`
                      // ${
                      //   errorMessage.kategoriPertandingan
                      //     ? "input_error"
                      //     : kuotaKelas
                      //     ? "input"
                      //     : "input_error"
                      // }
                      // input
                      // `}
                    >
                      {tingkatanKategoriJurusAsbd[
                        tingkatanKategoriJurusAsbd.findIndex(
                          (i) => i.sabuk == data.sabuk
                        )
                      ].jurus.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <p className="text-red-500">
                      {errorMessage.kategoriPertandingan}
                    </p>
                    {/* {(data.tingkatanPertandingan == "SMA" ||
                  data.tingkatanPertandingan == "Dewasa") &&
                  (kuotaLoading ? (
                    <p className="text-end">
                      Memuat kuota kategori <InlineLoading />
                    </p>
                  ) : !kuotaKelas ? (
                    <p className="text-end text-red-500">
                      Kuota kategori habis
                    </p>
                  ) : (
                    <p className="text-end">
                      Sisa kuota kategori: {kuotaKelas} peserta
                    </p>
                  ))} */}
                  </div>
                )}

                {/* KATEGORI */}
                <div className="input_container">
                  <label className="input_label">Kategori</label>
                  <select
                    disabled={disable}
                    value={data.kategoriPertandingan}
                    onChange={(e) => {
                      setData({
                        ...data,
                        kategoriPertandingan: e.target.value,
                      });
                    }}
                    //   className={`
                    // ${
                    //   errorMessage.kategoriPertandingan
                    //     ? "input_error"
                    //     : kuotaKelas
                    //     ? "input"
                    //     : "input_error"
                    // }
                    // input
                    // `}
                  >
                    {data.jenisKelamin == "Putra"
                      ? kategoriAsbd.putra.map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))
                      : kategoriAsbd.putri.map((item) => (
                          <option value={item} key={item}>
                            {item}
                          </option>
                        ))}
                  </select>
                  <p className="text-red-500">
                    {errorMessage.kategoriPertandingan}
                  </p>
                  {/* {(data.tingkatanPertandingan == "SMA" ||
                  data.tingkatanPertandingan == "Dewasa") &&
                  (kuotaLoading ? (
                    <p className="text-end">
                      Memuat kuota kategori <InlineLoading />
                    </p>
                  ) : !kuotaKelas ? (
                    <p className="text-end text-red-500">
                      Kuota kategori habis
                    </p>
                  ) : (
                    <p className="text-end">
                      Sisa kuota kategori: {kuotaKelas} peserta
                    </p>
                  ))} */}
                </div>
              </>
            )}

            {data.jenisPertandingan == "Tanding" && (
              <div className="input_container">
                <label className="input_label">Kategori Tanding</label>
                <select
                  disabled={disable}
                  value={data.kategoriPertandingan}
                  onChange={(e) => {
                    setData({
                      ...data,
                      kategoriPertandingan: e.target.value,
                    });
                  }}
                  className={`
                  ${
                    errorMessage.kategoriPertandingan
                      ? "input_error"
                      : kuotaKelas
                      ? "input"
                      : "input_error"
                  }
                  input
                  `}
                >
                  {tingkatanKategori[
                    tingkatanKategori.findIndex(
                      (i) => i.tingkatan == data.tingkatanPertandingan
                    )
                  ].kategoriTanding.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <p className="text-red-500">
                  {errorMessage.kategoriPertandingan}
                </p>
                {(data.tingkatanPertandingan == "SMA" ||
                  data.tingkatanPertandingan == "Dewasa") &&
                  (kuotaLoading ? (
                    <p className="text-end">
                      Memuat kuota kategori <InlineLoading />
                    </p>
                  ) : !kuotaKelas ? (
                    <p className="text-end text-red-500">
                      Kuota kategori habis
                    </p>
                  ) : (
                    <p className="text-end">
                      Sisa kuota kategori: {kuotaKelas} peserta
                    </p>
                  ))}
              </div>
            )}

            {data.jenisPertandingan == "Seni" && (
              <div className="input_container">
                <label className="input_label">Kategori Seni</label>
                <select
                  disabled={disable}
                  value={data.kategoriPertandingan}
                  onChange={(e) =>
                    setData({
                      ...data,
                      kategoriPertandingan: e.target.value,
                    })
                  }
                  className={`
                  ${errorMessage.kategoriPertandingan ? "input_error" : "input"}
                  input
                  `}
                >
                  {data.jenisKelamin == "Putra"
                    ? tingkatanKategori[
                        tingkatanKategori.findIndex(
                          (i) => i.tingkatan == data.tingkatanPertandingan
                        )
                      ].kategoriSeni.putra.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))
                    : tingkatanKategori[
                        tingkatanKategori.findIndex(
                          (i) => i.tingkatan == data.tingkatanPertandingan
                        )
                      ].kategoriSeni.putri.map((item) => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                </select>
                <p className="text-red-500">
                  {errorMessage.kategoriPertandingan}
                </p>
                {(data.tingkatanPertandingan == "SMA" ||
                  data.tingkatanPertandingan == "Dewasa") &&
                  (kuotaLoading ? (
                    <p className="text-end">
                      Memuat kuota kategori <InlineLoading />
                    </p>
                  ) : !kuotaKelas ? (
                    <p className="text-end text-red-500">
                      Kuota kategori habis
                    </p>
                  ) : (
                    <p className="text-end">
                      Sisa kuota kategori: {kuotaKelas} peserta
                    </p>
                  ))}
              </div>
            )}
            {/* KATEGORI TANDING */}
          </div>
          {/* KOLOM KANAN */}
        </div>
        {/* BARIS 1 */}

        {/* BARIS 2 */}
        {/* BUTTONS */}
        <div className="mt-2 flex gap-2 justify-end w-full">
          <button
            disabled={disable}
            className="btn_red btn_full"
            onClick={reset}
            type="button"
          >
            Batal
          </button>
          <button
            className="btn_green btn_full"
            type="submit"
            disabled={disable}
          >
            {updating ? "Perbaharui" : "Simpan"}
          </button>
        </div>
        {/* BUTTONS */}
        {/* BARIS 2 */}
      </div>
    </form>
  );
};
export default FormPeserta;
