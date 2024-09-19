import { FirebaseError } from "firebase/app";
import { ServerAction, ToastId } from "./constants";
import { uploadFile } from "./actions";
import { toast } from "react-toastify";

export const action = {
  success: <T>(result: T): ServerAction<T> => {
    return { result, error: null };
  },
  error: <T>(error: any): ServerAction<T> => {
    return { result: null, error: error as FirebaseError };
  },
};

export const isFileValid = (file: File): string | undefined => {
  if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type))
    return "Format file tidak valid (harus png, jpg, jpeg)";

  if (file.size > 1024 * 1024)
    return "File yang dipilih terlalu besar (Maks. 1MB)";
};

export const sendFile = async (file: File, directory: string) => {
  const warning = isFileValid(file);
  if (warning) throw new Error(warning);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("directory", directory);

  try {
    const { result: downloadUrl, error } = await uploadFile(formData);

    if (error) throw error;

    return downloadUrl;
  } catch (error) {
    throw error;
  }
};

export const toastError = (
  toastId: ToastId,
  error: any,
  isNew: boolean = false
) => {
  let message = (error as FirebaseError)?.message;
  if (typeof error == "string") message = error;
  controlToast(toastId, "error", message, isNew);
};

export const fetchData = async <T>(
  asyncFunction: () => Promise<ServerAction<T>>
): Promise<T> => {
  try {
    const { result, error } = await asyncFunction();

    if (error) throw error;

    return result;
  } catch (error) {
    throw error;
  }
};

// CONTROL TOAST
export const controlToast = (
  ref: ToastId,
  type: "success" | "error" | "loading",
  message: string,
  isNew: boolean = false
) => {
  if (isNew) {
    if (type == "loading") {
      ref.current = toast.loading(message, {
        position: "top-center",
        theme: "colored",
      });
    } else {
      ref.current = toast[type](message, {
        position: "top-center",
        autoClose: 5000,
        closeButton: true,
        theme: "colored",
      });
    }
  } else {
    if (ref.current) {
      if (type === "loading") {
        toast.update(ref.current, {
          render: message,
        });
      } else {
        toast.update(ref.current, {
          render: message,
          type: type,
          isLoading: false,
          autoClose: 3000,
          closeButton: true,
        });
      }
    }
  }
};

//COMPARE FOR DATA SORTER
export const compare = (query: string, type: "asc" | "desc") => {
  return (a: any, b: any) => {
    if (a[query] < b[query]) {
      return type == "asc" ? -1 : 1;
    }
    if (a[query] > b[query]) {
      return type == "asc" ? 1 : -1;
    }
    return 0;
  };
};
