import React, { useState } from 'react';
import ImagePreview from './ImagePreview';
import ImageUpload from './ImageUpload';
import { Alert } from './ui/alert';
import { useAuth } from '@clerk/clerk-react';
import { getServerUrl } from '@/utils';
import DataTable from './ui/DataTable';

const ApiResponseHandler: React.FC = () => {
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [kernelResults, setKernelResults] = useState<any[]>([]);
    const [kernelHeaders, setKernelHeaders] = useState<any[]>([]);
    const [kernelStats, setKernelStats] = useState<{}>({});
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();

    const setApiResponse = (data: {
        image_base64: string;
        attachment_name: string;
        data: {
            kernel_data: any[];
            kernel_headers: string[];
            statistics: any;
        };
    } | null) => {
        setResultImage(data?.image_base64 ?? null);
        setKernelResults(data?.data?.kernel_data ?? []);
        setKernelHeaders(data?.data?.kernel_headers ?? ["kernel_id"]);
        setKernelStats(data?.data?.statistics ?? null);
    };

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
            setError(null);
            setApiResponse(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
            setApiResponse(null);
        }
    };

    return (
        <div>
            <ImageUpload onImageUpload={handleImageUpload} resetResultPreview={() => { setApiResponse(null) }} />
            {error && <Alert variant="destructive">{error}</Alert>}
            {resultImage && <ImagePreview imageBase64={resultImage} />}
            {kernelStats && Object.keys(kernelStats).length > 0 && <DataTable tableName='Kernel Stats' filterHeader="metric_name" headers={["metric_name", "metric_value"]} data={Object.entries(kernelStats).map(([kernelStatMetricId, kernelStatMetricValue]) => {
                return {
                    metric_name: kernelStatMetricId,
                    metric_value: kernelStatMetricValue,
                };
            })} />}
            {kernelResults.length > 0 && (
                <DataTable tableName='Kernel Grain Info' headers={kernelHeaders} data={kernelResults} />
            )}
        </div>
    );
};

export default ApiResponseHandler;