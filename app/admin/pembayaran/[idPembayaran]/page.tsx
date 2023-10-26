"use client";
import IsAuthorized from "@/components/halaman-pendaftaran/admin/IsAuthorized";
import PembayaranAdmin from "@/components/halaman-pendaftaran/admin/PembayaranAdmin";
import FullLoading from "@/components/loading/FullLoading";
import { formatTanggal } from "@/utils/adminFunctions";
import { firestore } from "@/utils/firebase";
import {
  jenisPertandingan,
  kontingenInitialValue,
} from "@/utils/formConstants";
import { getGroupedPeserta } from "@/utils/formFunctions";
import { KontingenState, PesertaState } from "@/utils/formTypes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";

const KonfirmasiPembayaranPage = ({
  params,
}: {
  params: { idPembayaran: string };
}) => {
  const { idPembayaran } = params;

  return (
    <IsAuthorized>
      <PembayaranAdmin idPembayaran={idPembayaran} />
    </IsAuthorized>
  );
};
export default KonfirmasiPembayaranPage;
