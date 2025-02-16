import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// Function to execute an HTTP request
export async function executeHttpRequest(
  config: AxiosRequestConfig
): Promise<AxiosResponse> {
  return axios(config);
}
