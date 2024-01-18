"use client";
import IsAuthorized from "@/components/admin/IsAuthorized";
import PembayaranAdmin from "@/components/admin/PembayaranAdmin";
import { useEffect } from "react";

const KonfirmasiPembayaranPage = ({
  params,
}: {
  params: { idPembayaran: string };
}) => {
  const { idPembayaran } = params;

  useEffect(() => {
    window.document.title = `Pembayaran - ${idPembayaran}`;
  }, []);

  return (
    <IsAuthorized>
      <PembayaranAdmin idPembayaran={idPembayaran} />
    </IsAuthorized>
  );
};
export default KonfirmasiPembayaranPage;
