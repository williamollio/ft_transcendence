import { AxiosError } from "axios";

export interface Response<T = unknown> {
  data: T;
  error?: AxiosError;
}

export async function resolve<T>(promise: Promise<any>): Promise<Response<T>> {
  const resolved: Response<T> = {
    data: null as any,
    error: undefined,
  };

  try {
    resolved.data = await promise;
  } catch (e) {
    resolved.error = e as AxiosError;
  }

  return resolved;
}
