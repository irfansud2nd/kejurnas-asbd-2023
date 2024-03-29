import { AdminContext } from "@/context/AdminContext";
import DashboardAdmin from "./DashboardAdmin";
import TabelAdmin from "./TabelAdmin";
import IdCard from "./id-card/IdCard";

const Authorized = () => {
  const { mode } = AdminContext();
  return (
    <div className="p-2">{mode ? <TabelAdmin /> : <DashboardAdmin />}</div>
  );
};
export default Authorized;
