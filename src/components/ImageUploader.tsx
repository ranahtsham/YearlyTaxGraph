// ImageUploader.tsx

import React from 'react';

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            onImageUpload(files[0]);
        }
    };

    return (
        <div className="file-upload">
            <label className="file-upload-label">
                Choose File
                <input type="file" onChange={handleFileChange} accept="image/*" />
            </label>
        </div>
    );
};

export default ImageUploader;
