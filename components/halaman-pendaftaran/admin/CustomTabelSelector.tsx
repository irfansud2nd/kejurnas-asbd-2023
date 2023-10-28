import { AdminContext } from "@/context/AdminContext";
import {
  jenisKelamin,
  jenisPertandingan,
  kategoriAsbd,
  tingkatanKategori,
  tingkatanKategoriJurusAsbd,
} from "@/utils/formConstants";
import { useEffect, useState } from "react";

const CustomTabelSelector = () => {
  const [tingkatan, setTingkatan] = useState(tingkatanKategori[0].tingkatan);
  const [kategori, setKategori] = useState(
    tingkatanKategori[0].kategoriTanding[0]
  );
  const [gender, setGender] = useState<string>(jenisKelamin[0]);
  const [jenis, setJenis] = useState<string>(jenisPertandingan[0]);
  const [sabuk, setSabuk] = useState<string>(
    tingkatanKategoriJurusAsbd[0].sabuk
  );
  const [jurus, setJurus] = useState<string>(
    tingkatanKategoriJurusAsbd[0].jurus[0]
  );

  const { selectedKategori, setSelectedKategori, selectedPesertas } =
    AdminContext();

  useEffect(() => {
    if (jenis == jenisPertandingan[0]) {
      setKategori(
        tingkatanKategori[
          tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
        ].kategoriTanding[0]
      );
    }
    if (jenis == jenisPertandingan[1]) {
      if (gender == jenisKelamin[0]) {
        setKategori(
          tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
          ].kategoriSeni.putra[0]
        );
      } else {
        setKategori(
          tingkatanKategori[
            tingkatanKategori.findIndex((item) => item.tingkatan == tingkatan)
          ].kategoriSeni.putri[0]
        );
      }
    }
    if (jenis == jenisPertandingan[2]) {
      if (gender == jenisKelamin[0]) {
        setKategori(kategoriAsbd.putra[0]);
      } else {
        setKategori(kategoriAsbd.putra[0]);
      }
    }
    setJurus(
      tingkatanKategoriJurusAsbd[
        tingkatanKategoriJurusAsbd.findIndex((item) => item.sabuk == sabuk)
      ].jurus[0]
    );
  }, [tingkatan, jenis, gender, sabuk]);

  useEffect(() => {
    if (kategori.includes(jenisKelamin[0])) {
      setGender(jenisKelamin[0]);
    } else if (kategori.includes(jenisKelamin[1])) {
      setGender(jenisKelamin[1]);
    } else {
      setGender(jenisKelamin[0]);
    }
  }, [kategori]);

  const changeSelectedKategory = () => {
    if (jenis != jenisPertandingan[2]) {
      setSelectedKategori({
        tingkatan,
        jenis,
        sabuk: "",
        jurus: "",
        kategori,
        gender,
      });
    } else {
      setSelectedKategori({
        tingkatan,
        sabuk,
        jenis,
        jurus,
        kategori,
        gender,
      });
    }
  };

  return (
    <>
      <div className="bg-black text-black p-2 rounded-md w-fit mt-2">
        <p className="text-xl font-semibold text-white">Custom Table</p>
        <div className="flex gap-2">
          {/* TINGKATAN */}
          <select
            value={tingkatan}
            className="text-black"
            onChange={(e) => setTingkatan(e.target.value)}
          >
            {tingkatanKategori.map((item) => (
              <option value={item.tingkatan}>{item.tingkatan}</option>
            ))}
          </select>
          {/* JENIS PERTANDINGAN */}
          <select value={jenis} onChange={(e) => setJenis(e.target.value)}>
            {jenisPertandingan.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
          {/* SABUK */}
          {jenis == jenisPertandingan[2] && (
            <select value={sabuk} onChange={(e) => setSabuk(e.target.value)}>
              {tingkatanKategoriJurusAsbd.map((item) => (
                <option value={item.sabuk}>{item.sabuk}</option>
              ))}
            </select>
          )}
          {/* JURUS */}
          {jenis == jenisPertandingan[2] && (
            <select value={jurus} onChange={(e) => setJurus(e.target.value)}>
              {tingkatanKategoriJurusAsbd[
                tingkatanKategoriJurusAsbd.findIndex(
                  (item) => item.sabuk == sabuk
                )
              ].jurus.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </select>
          )}
          {/* JENIS KELAMIN */}
          <select
            value={gender}
            className="text-black"
            onChange={(e) => setGender(e.target.value)}
            //   disabled={kategori.includes("Putra") || kategori.includes("Putri")}
          >
            {jenisKelamin.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
          {/* KATEGORI PERTANDINGAN */}
          <select
            value={kategori}
            className="text-black"
            onChange={(e) => setKategori(e.target.value)}
          >
            {jenis == jenisPertandingan[0] &&
              tingkatanKategori[
                tingkatanKategori.findIndex(
                  (item) => item.tingkatan == tingkatan
                )
              ].kategoriTanding.map((item) => (
                <option value={item}>{item}</option>
              ))}
            {jenis == jenisPertandingan[1] &&
              tingkatanKategori[
                tingkatanKategori.findIndex(
                  (item) => item.tingkatan == tingkatan
                )
              ].kategoriSeni.putra.map((item) => (
                <option value={item}>{item}</option>
              ))}
            {jenis == jenisPertandingan[1] &&
              tingkatanKategori[
                tingkatanKategori.findIndex(
                  (item) => item.tingkatan == tingkatan
                )
              ].kategoriSeni.putri.map((item) => (
                <option value={item}>{item}</option>
              ))}
            {jenis == jenisPertandingan[2] &&
              kategoriAsbd.putra.map((item) => (
                <option value={item}>{item}</option>
              ))}
            {jenis == jenisPertandingan[2] &&
              kategoriAsbd.putri.map((item) => (
                <option value={item}>{item}</option>
              ))}
          </select>
        </div>
        {/* <p className="text-white">
          {tingkatan} | {jenis} | {sabuk} | {jurus} | {gender} | {kategori}
        </p> */}
        <button
          className="btn_green btn_full mt-1 text-black"
          onClick={changeSelectedKategory}
        >
          Generate Table
        </button>
      </div>
      {selectedKategori.tingkatan && (
        <div>
          <p className="font-bold text-lg">Hasil Pencarian</p>
          <p>
            Tingkatan: <b>{selectedKategori.tingkatan}</b>
          </p>
          <p>
            Jenis Pertandingan: <b>{selectedKategori.jenis}</b>
          </p>
          {selectedKategori.sabuk && (
            <p>
              Sabuk : <b>{selectedKategori.sabuk}</b>
            </p>
          )}
          {selectedKategori.jurus && (
            <p>
              Jurus : <b>{selectedKategori.jurus}</b>
            </p>
          )}
          <p>
            Kategori : <b>{selectedKategori.kategori}</b>
          </p>
          <p>
            Gender : <b>{selectedKategori.gender}</b>
          </p>
          <p>
            Jumlah Peserta : <b>{selectedPesertas.length} Peserta</b>
          </p>
        </div>
      )}
    </>
  );
};
export default CustomTabelSelector;
