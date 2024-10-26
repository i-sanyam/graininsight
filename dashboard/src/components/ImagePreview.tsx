import React from "react";

interface ImagePreviewProps {
	imageBase64: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageBase64 }) => {
	return (
		<img src={`data:image/jpeg;base64,${imageBase64}`} alt="API Response" />
	);
};

export default ImagePreview;
