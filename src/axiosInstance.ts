import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance = axios.create({
  timeout: 60_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    console.log(error);
    const status = error.response?.status;
    const message =
      (error.response?.data as { message?: string })?.message ?? error.message;

    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject({ message, status });
  },
);

export default axiosInstance;
