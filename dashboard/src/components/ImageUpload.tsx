import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUploadProps {
  onImageUpload: (image: File) => void;
  resetResultPreview: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, resetResultPreview }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImage(file);
    resetResultPreview();
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (selectedImage) {
      onImageUpload(selectedImage);
    }
  };

  return (
    <div className="image-upload">
      <div>
        <h2>Upload an Image</h2>
      </div>
      <Input type="file" accept="image/*" onChange={handleImageChange} />
      {preview && <img height="100x" width="100px" src={preview} alt="Image Preview" />}
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
};

export default ImageUpload;