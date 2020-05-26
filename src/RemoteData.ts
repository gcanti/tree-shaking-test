import { RemoteData, success } from "@devexperts/remote-data-ts";

export const getCustomers = (): RemoteData<string, number> => {
  return success(1);
};
