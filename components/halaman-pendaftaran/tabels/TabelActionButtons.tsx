import { MyContext } from "@/context/Context";

const TabelActionButtons = ({
  handleDelete,
  handleEdit,
}: {
  handleDelete: () => void;
  handleEdit: () => void;
}) => {
  const { disable } = MyContext();
  return (
    <div className="flex gap-1">
      <button
        disabled={disable}
        className="hover:text-red-500 transition rounded-md px-2"
        onClick={handleDelete}
      >
        Delete
      </button>
      <button
        disabled={disable}
        className="hover:text-red-500 transition rounded-md px-2"
        onClick={handleEdit}
      >
        Edit
      </button>
    </div>
  );
};
export default TabelActionButtons;
