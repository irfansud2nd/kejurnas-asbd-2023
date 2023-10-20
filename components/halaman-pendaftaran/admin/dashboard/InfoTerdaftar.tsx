import InlineLoading from "@/components/loading/InlineLoading";
import { firestore } from "@/utils/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import Link from "next/link";
import { useState, useEffect } from "react";
import TerdaftarCard from "./TerdaftarCard";
import { AdminContext } from "@/context/AdminContext";
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

  const getKontingen = () => {
    setKontingen({ ...kontingen, loading: true });
    getCountFromServer(collection(firestore, "kontingens")).then((res) =>
      setKontingen({ loading: false, total: res.data().count })
    );
  };
  const getPeserta = () => {
    setPeserta({ ...kontingen, loading: true });
    getCountFromServer(collection(firestore, "pesertas")).then((res) =>
      setPeserta({ loading: false, total: res.data().count })
    );
  };
  const getOfficial = () => {
    setOfficial({ ...kontingen, loading: true });
    getCountFromServer(collection(firestore, "officials")).then((res) =>
      setOfficial({ loading: false, total: res.data().count })
    );
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
