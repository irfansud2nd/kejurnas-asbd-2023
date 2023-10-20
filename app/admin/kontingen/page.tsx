"use client";
import IsAuthorized from "@/components/halaman-pendaftaran/admin/IsAuthorized";
import TabelKontingenAdmin from "@/components/halaman-pendaftaran/admin/tabels/TabelKontingenAdmin";
import { AdminContextProvider } from "@/context/AdminContext";

const KontingensPage = () => {
  return (
    <div className="p-2 m-2 bg-white rounded-md">
      <IsAuthorized>
        <AdminContextProvider>
          <TabelKontingenAdmin />
        </AdminContextProvider>
      </IsAuthorized>
    </div>
  );
};
export default KontingensPage;
