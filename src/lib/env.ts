const DEFAULT_API_URL = 'https://665de6d7e88051d60408c32d.mockapi.io';

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_URL;
