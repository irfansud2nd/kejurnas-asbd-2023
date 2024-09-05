import { KontingenState } from "../formTypes";

export const filterKontingenById = (
  kontingens: KontingenState[],
  id: string
) => {
  return kontingens.find((item) => item.id == id) as KontingenState;
};
