import React, { useState } from 'react';
import ImagePreview from './ImagePreview';
import KernelResults from './KernelResults';
import ImageUpload from './ImageUpload';
import { Alert } from './ui/alert';
import { useAuth } from '@clerk/clerk-react';
import { getServerUrl } from '@/utils';

const ApiResponseHandler: React.FC = () => {
    const [apiResponse, setApiResponse] = useState<string | null>(null);
    const [kernelResults, setKernelResults] = useState<any[]>([]);
    const [kernelHeaders, setKernelHeaders] = useState<any[]>([]);
    const [kernelStats, setKernelStats] = useState<{}>({});
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();

    const handleImageUpload = async (image: File) => {
        const formData = new FormData();
        formData.append('image', image);
        try {
            const response = await fetch(getServerUrl('/api/dashboard/analyze'), {
                method: 'POST',
                body: formData,
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload image');
            }
            setApiResponse(data.image_base64);
            setKernelResults(data.data?.kernel_data ?? []);
            setKernelHeaders(data.data?.kernel_headers ?? []);
            setKernelStats(data.data?.statistics ?? {});
            setError(null);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setApiResponse(null);
            setKernelResults([]);
            setKernelHeaders(["kernel_id"]);
        }
    };

    return (
        <div>
            <ImageUpload onImageUpload={handleImageUpload} />
            {error && <Alert>{error}</Alert>}
            {apiResponse && <ImagePreview imageBase64={apiResponse} />}
            {Object.keys(kernelStats).length > 0 && <KernelResults tableName='Kernel Stats' headers={["metric_name", "metric_value"]} data={Object.keys(kernelStats).map(kernelStatId => {
                return {
                    metric_name: kernelStatId,
                    metric_value: kernelStats[kernelStatId],
                };
            })} />}
            {kernelResults.length > 0 && (
                <KernelResults tableName='Kernel Grain Info' headers={kernelHeaders} data={kernelResults} />
            )}
        </div>
    );
};

export default ApiResponseHandler;