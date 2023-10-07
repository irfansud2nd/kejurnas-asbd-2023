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

const seniSd = {
  putra: [
    "Tunggal Putra",
    "Ganda Tangan Kosong Putra",
    "Ganda Senjata Putra",
    "Regu A 1-6 Putra",
  ],
  putri: [
    "Tunggal Putri",
    "Ganda Tangan Kosong Putri",
    "Ganda Senjata Putri",
    "Regu A 1-6 Putri",
  ],
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

const seniSdIII = {
  putra: [
    "Tunggal Tangan Kosong Putra",
    "Tunggal Full Putra",
    "Ganda Tangan Kosong Putra",
    "Ganda Senjata Putra",
    "Regu A 1-6 Putra",
  ],
  putri: [
    "Tunggal Tangan Kosong Putri",
    "Tunggal Full Putri",
    "Ganda Tangan Kosong Putri",
    "Ganda Senjata Putri",
    "Regu A 1-6 Putri",
  ],
};

// KATEGORI GENERATOR - START
// ALPHABET
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "X",
  "Y",
  "Z",
];
// GENERATOR
export const generateKategoriPertandingan = (
  endAlphabet: string,
  start: number,
  step: number,
  bebas?: {
    namaKelasBawah?: string;
    bataKelasBawah?: string;
    namaKelasAtas?: string;
    bataKelasAtas?: string;
  }
) => {
  const repeatValue = alphabet.indexOf(endAlphabet);
  let kategoriArr: string[] = [];
  let startKategori: number = 0;

  if (bebas?.namaKelasBawah) {
    kategoriArr.push(
      `Kelas ${bebas.namaKelasBawah} (Dibawah ${
        bebas.bataKelasBawah ? bebas.bataKelasBawah : start
      } KG)`
    );
  }

  startKategori = start;
  for (let i = 0; i <= repeatValue; i++) {
    kategoriArr.push(
      `Kelas ${alphabet[i]} (${startKategori}-${startKategori + step} KG)`
    );
    startKategori += step;
  }
  const endNumber = startKategori;
  if (bebas?.namaKelasAtas)
    kategoriArr.push(
      `Kelas ${bebas.namaKelasAtas} (Diatas ${
        bebas.bataKelasAtas ? bebas.bataKelasAtas : endNumber
      } KG)`
    );
  return kategoriArr;
};
// KATEGORI GENERATOR - END

// TINGKATAN DAN KATEGORI TANDING OPTION
export const tingkatanKategori = [
  {
    tingkatan: "SD I",
    kategoriTanding: generateKategoriPertandingan("P", 16, 2, {
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniSd,
  },
  {
    tingkatan: "SD II",
    kategoriTanding: generateKategoriPertandingan("P", 16, 2, {
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniSd,
  },
  {
    tingkatan: "SD III",
    kategoriTanding: generateKategoriPertandingan("S", 26, 2, {
      namaKelasBawah: "<A",
      namaKelasAtas: "Bebas",
    }),
    kategoriSeni: seniSdIII,
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
    jurus: ["Jurus Baku/Kombinasi"],
  },
  {
    sabuk: "Hijau",
    jurus: ["Jurus Baku/Kombinasi"],
  },
  {
    sabuk: "Biru",
    jurus: ["Jurus Baku/Kombinasi"],
  },
  {
    sabuk: "Violet",
    jurus: ["Jurus Baku/Kombinasi"],
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
  namaTim: null,
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
  namaTim: "",
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
