import InlineLoading from "@/components/loading/InlineLoading";
import Link from "next/link";

const TerdaftarCard = ({
  label,
  loading,
  total,
  link,
  refresh,
  showTable,
}: {
  label: string;
  loading: boolean;
  total: number;
  link: string;
  refresh: () => void;
  showTable: () => void;
}) => {
  return (
    <div className="flex flex-col gap-2 bg-black p-2 text-center text-white rounded-md">
      <p className="font-semibold text-lg">Total {label} terdaftar</p>
      <p className="text-2xl font-extrabold text-green-500">
        {loading ? <InlineLoading /> : total}
      </p>
      <div className="flex justify-center gap-2">
        <button onClick={refresh} className="btn_green">
          Refresh
        </button>
        {/* <Link href={link} className="btn_green">
          Show Table
        </Link> */}
        <button onClick={showTable} className="btn_green">
          Show Table
        </button>
      </div>
    </div>
  );
};
export default TerdaftarCard;
