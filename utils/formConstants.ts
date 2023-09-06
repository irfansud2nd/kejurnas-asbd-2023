import { generateKategoriPertandingan } from "./formFunctions";
import {
  ErrorOfficial,
  ErrorPeserta,
  KontingenState,
  OfficialState,
  PesertaState,
} from "./formTypes";

// JENIS PERTANDINGAN OPTION
export const jenisPertandingan = ["Tanding", "Seni", "Jurus ASBD"];

// KATEGORI SENI
// SENI TUNGGAL
const seniTunggal = {
  putra: ["Tunggal Putra"],
  putri: ["Tunggal Putri"],
};

// SENI LENGKAP
const seniLengkap = {
  putra: ["Tunggal Putra", "Ganda Putra", "Regu Putra"],
  putri: ["Tunggal Putri", "Ganda Putri", "Regu Putri"],
};

// SENI LENGKAP BANGET
const seniLengkapBanget = {
  putra: [
    "Tunggal Tangan Kosong Putra",
    "Tunggal Full Putra",
    "Ganda Putra",
    "Regu Putra",
  ],
  putri: [
    "Tunggal Tangan Kosong Putri",
    "Tunggal Full Putri",
    "Ganda Putri",
    "Regu Putri",
  ],
};

// SENI ALAT
const seniAlat = {
  putra: ["Tunggal Tangan Kosong Putra", "Tunggal Full Putra"],
  putri: ["Tunggal Tangan Kosong Putri", "Tunggal Full Putri"],
};

// TINGKATAN DAN KATEGORI TANDING OPTION
export const tingkatanKategori = [
  {
    tingkatan: "SD I",
    kategoriTanding: generateKategoriPertandingan("P", 16, 2, {
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SD II",
    kategoriTanding: generateKategoriPertandingan("P", 16, 2, {
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniTunggal,
  },
  {
    tingkatan: "SD III",
    kategoriTanding: generateKategoriPertandingan("S", 26, 2, {
      namaKelasBawah: "<A",
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniAlat,
  },
  {
    tingkatan: "SMP",
    kategoriTanding: generateKategoriPertandingan("T", 30, 3, {
      namaKelasBawah: "<A",
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniLengkapBanget,
  },
  {
    tingkatan: "SMA",
    kategoriTanding: generateKategoriPertandingan("P", 39, 4, {
      namaKelasBawah: "<39",
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniLengkapBanget,
  },
  {
    tingkatan: "Dewasa",
    kategoriTanding: generateKategoriPertandingan("J", 45, 5, {
      namaKelasBawah: "<45",
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniLengkap,
  },
];

// KATEGORI JURUS ASBD
export const kategoriAsbd = {
  putra: ["Tunggal Putra", "Regu 3 Putra"],
  putri: ["Tunggal Putri", "Regu 3 Putri"],
};

export const tingkatanKategoriJurusAsbd = [
  {
    sabuk: "Putih",
    jurus: ["Sikap Tempur 1"],
  },
  {
    sabuk: "Kuning",
    jurus: ["Jurus Baku", "Jurus Kombinasi"],
  },
  {
    sabuk: "Hijau",
    jurus: ["Jurus Baku", "Jurus Kombinasi"],
  },
  {
    sabuk: "Biru",
    jurus: ["Jurus Baku", "Jurus Kombinasi"],
  },
  {
    sabuk: "Violet",
    jurus: ["Jurus Baku", "Jurus Kombinasi"],
  },
];

// JENIS KELAMIN OPTION
export const jenisKelamin = ["Putra", "Putri"];
export const jenisKelaminDewasa = ["Pria", "Wanita"];

// JABATAN OPTION
export const jabatanOfficial = ["Official", "Manajer Tim", "Pelatih"];

// KONTINGEN STATE
export const kontingenInitialValue: KontingenState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaKontingen: "",
  pesertas: [],
  officials: [],
  idPembayaran: [],
  unconfirmedPembayaran: [],
  confirmedPembayaran: [],
  infoPembayaran: [],
  infoKonfirmasi: [],
};

// OFFICIAL STATE
export const officialInitialValue: OfficialState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  jenisKelamin: jenisKelaminDewasa[0],
  jabatan: jabatanOfficial[0],
  idKontingen: "",
  fotoUrl: "",
  downloadFotoUrl: "",
};

// ERROR OFFICIAL
export const errorOfficialInitialValue: ErrorOfficial = {
  namaLengkap: null,
  jenisKelamin: null,
  jabatan: null,
  idKontingen: null,
  pasFoto: null,
};

// ERROR PESERTA
export const errorPesertaInitialValue: ErrorPeserta = {
  namaLengkap: null,
  NIK: null,
  tempatLahir: null,
  tanggalLahir: null,
  beratBadan: null,
  tinggiBadan: null,
  jenisKelamin: null,
  alamatLengkap: null,
  idKontingen: null,
  tingkatanPertandingan: null,
  jenisPertandingan: null,
  kategoriPertandingan: null,
  pasFoto: null,
};

// PESERTA STATE
export const pesertaInitialValue: PesertaState = {
  id: "",
  creatorEmail: "",
  creatorUid: "",
  waktuPendaftaran: "",
  waktuPerubahan: "",
  namaLengkap: "",
  NIK: "",
  tempatLahir: "",
  tanggalLahir: "",
  umur: "",
  beratBadan: 0,
  tinggiBadan: 0,
  alamatLengkap: "",
  jenisKelamin: jenisKelamin[0],
  tingkatanPertandingan: tingkatanKategori[0].tingkatan,
  jenisPertandingan: jenisPertandingan[0],
  kategoriPertandingan: tingkatanKategori[0].kategoriTanding[0],
  sabuk: tingkatanKategoriJurusAsbd[0].sabuk,
  jurus: tingkatanKategoriJurusAsbd[0].jurus[0],
  idKontingen: "",
  fotoUrl: "",
  downloadFotoUrl: "",
  pembayaran: false,
  idPembayaran: "",
  confirmedPembayaran: false,
  infoPembayaran: {
    noHp: "",
    waktu: "",
    buktiUrl: "",
  },
  infoKonfirmasi: {
    nama: "",
    email: "",
    waktu: "",
  },
};