const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getServerUrl = (apiEndpoint: string): string => {
    const baseUrl = API_BASE_URL || 'http://localhost:3000';
    return new URL(apiEndpoint, baseUrl).toString();
}

export { getServerUrl };