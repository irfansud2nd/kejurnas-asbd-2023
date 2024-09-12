import { FirebaseError } from "firebase/app";
import { ServerAction, ToastId } from "./constants";
import { uploadFile } from "./actions";
import { controlToast } from "./sharedFunctions";

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
