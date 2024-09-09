import { useState, useEffect } from "react";
import TerdaftarCard from "./TerdaftarCard";
import { AdminContext } from "@/context/AdminContext";
import { countFromCollection } from "@/utils/actions";
import { toastError } from "@/utils/functions";
const InfoTerdaftar = () => {
  const { setMode } = AdminContext();

  const [kontingen, setKontingen] = useState({
    loading: true,
    total: 0,
  });
  const [official, setOfficial] = useState({
    loading: true,
    total: 0,
  });
  const [peserta, setPeserta] = useState({
    loading: true,
    total: 0,
  });

  const getKontingen = async () => {
    setKontingen({ ...kontingen, loading: true });
    try {
      const { result, error } = await countFromCollection("kontingens");
      if (error) throw error;

      setKontingen({ loading: false, total: result });
    } catch (error) {
      alert(error);
    }
  };
  const getPeserta = async () => {
    setPeserta({ ...peserta, loading: true });
    try {
      const { result, error } = await countFromCollection("pesertas");
      if (error) throw error;

      setPeserta({ loading: false, total: result });
    } catch (error) {
      alert(error);
    }
  };
  const getOfficial = async () => {
    setOfficial({ ...official, loading: true });
    try {
      const { result, error } = await countFromCollection("officials");
      if (error) throw error;

      setOfficial({ loading: false, total: result });
    } catch (error) {
      alert(error);
    }
  };

  const refreshAll = () => {
    getKontingen();
    getPeserta();
    getOfficial();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <div className="flex gap-2 flex-wrap mt-2">
      <TerdaftarCard
        label="Kontingen"
        loading={kontingen.loading}
        total={kontingen.total}
        refresh={getKontingen}
        link="admin/kontingen"
        showTable={() => setMode("kontingen")}
      />
      <TerdaftarCard
        label="Official"
        loading={official.loading}
        total={official.total}
        refresh={getOfficial}
        link="admin/official"
        showTable={() => setMode("official")}
      />
      <TerdaftarCard
        label="Peserta"
        loading={peserta.loading}
        total={peserta.total}
        refresh={getPeserta}
        link="admin/peserta"
        showTable={() => setMode("peserta")}
      />
    </div>
  );
};
export default InfoTerdaftar;
