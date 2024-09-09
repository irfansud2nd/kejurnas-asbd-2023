// TABEL PROPS
export type TabelProps = {
  handleDelete?: (arg0?: any) => void;
  handleEdit?: (arg0?: any) => void;
};

// FORM KONTINGEN PROPS
export type FormKontingenProps = {
  sendKontingen: (e: React.FormEvent) => void;
  errorMessage: string;
  data: KontingenState;
  setData: React.Dispatch<React.SetStateAction<KontingenState>>;
  reset: () => void;
  updating: boolean;
};

// FORM OFFICIAL PROPS
export type FormOfficialProps = {
  submitHandler: (e: React.FormEvent) => void;
  data: OfficialState;
  imageChangeHandler: (file: File) => void;
  imagePreviewSrc: string;
  setImageSelected: React.Dispatch<React.SetStateAction<File | undefined>>;
  errorMessage: ErrorOfficial;
  setData: React.Dispatch<React.SetStateAction<OfficialState>>;
  reset: () => void;
  updating: boolean;
};

// FORM PESERTA PROPS
export type FormPesertaProps = {
  data: PesertaState;
  prevData: PesertaState;
  setData: React.Dispatch<React.SetStateAction<PesertaState>>;
  submitHandler: (e: React.FormEvent) => void;
  imageChangeHandler: (file: File) => void;
  imagePreviewSrc: string;
  errorMessage: ErrorPeserta;
  kuotaKelas: number;
  kuotaLoading: boolean;
  reset: () => void;
  updating: boolean;
};

// ERROR MESSAGE OFFICIAL
export type ErrorOfficial = {
  namaLengkap: string | null;
  jenisKelamin: string | null;
  jabatan: string | null;
  idKontingen: string | null;
  pasFoto: string | null;
};

// ERROR MESSAGE PESERTA
export type ErrorPeserta = {
  namaLengkap: string | null;
  NIK: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  beratBadan: string | null;
  tinggiBadan: string | null;
  jenisKelamin: string | null;
  alamatLengkap: string | null;
  idKontingen: string | null;
  tingkatanPertandingan: string | null;
  jenisPertandingan: string | null;
  kategoriPertandingan: string | null;
  pasFoto: string | null;
  namaTim: string | null;
};

// KONTINGEN STATE
export type KontingenState = {
  id: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaKontingen: string;
  pesertas: string[] | [];
  officials: string[] | [];
  pembayaran: boolean;
  biayaKontingen: string;
  confirmedPembayaran: boolean;
  unconfirmedPembayaran: boolean;
  idPembayaran: string[];
  unconfirmedPembayaranIds: string[];
  confirmedPembayaranIds: string[];
  infoPembayaran: {
    idPembayaran: string;
    noHp: string;
    waktu: number;
    buktiUrl: string;
    nominal: string;
  }[];
  infoKonfirmasi: {
    idPembayaran: string;
    nama: string;
    email: string;
    waktu: number;
  }[];
};

// OFFICIAL STATE
export type OfficialState = {
  id: string;
  creatorEmail: string;
  creatorUid: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  namaLengkap: string;
  jenisKelamin: string;
  jabatan: string;
  idKontingen: string;
  fotoUrl: string;
  downloadFotoUrl: string;
};

// PESERTA STATE
export type PesertaState = {
  id: string;
  waktuPendaftaran: number | string;
  waktuPerubahan: number | string;
  creatorEmail: string;
  creatorUid: string;
  namaLengkap: string;
  NIK: string;
  tempatLahir: string;
  tanggalLahir: string;
  umur: string;
  beratBadan: number;
  tinggiBadan: number;
  alamatLengkap: string;
  jenisKelamin: string;
  tingkatanPertandingan: string;
  jenisPertandingan: string;
  jurus: string;
  sabuk: string;
  namaTim: string;
  kategoriPertandingan: string;
  idKontingen: string;
  downloadFotoUrl: string;
  fotoUrl: string;
  pembayaran: boolean;
  idPembayaran: string;
  confirmedPembayaran: boolean;
  infoPembayaran: {
    noHp: string;
    waktu: number;
    buktiUrl: string;
  };
  infoKonfirmasi: {
    nama: string;
    email: string;
    waktu: number;
  };
};
