// src/App.tsx
import React, { useState, useEffect } from 'react';
import { loadOpenCV, extractTextFromImage } from './utils/opencvUtils';
import ImageUploader from './components/ImageUploader';
import './App.css';

const App: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string>("");

    useEffect(() => {
        loadOpenCV()
            .then(() => console.log('OpenCV loaded'))
            .catch((error) => console.error('Failed to load OpenCV', error));
    }, []);

    const handleImageUpload = (imageFile: File) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.result) {
                setImageSrc(reader.result as string);
            }
        };
        reader.readAsDataURL(imageFile);
    };

    const handleExtractText = async () => {
        const imageElement = document.getElementById('uploaded-image') as HTMLImageElement;
        if (imageElement) {
            const { text, canvas } = await extractTextFromImage(imageElement);
            setExtractedText(text);

            // Replace the image with the processed canvas
            const container = document.getElementById('image-container');
            if (container) {
                container.innerHTML = ''; // Clear the container
                container.appendChild(canvas); // Append the canvas
            }
        } else {
            console.error('Image element not found');
        }
    };

    return (
        <div className="App">
            <h1>OCR with OpenCV.js and Tesseract.js in React</h1>
            <ImageUploader onImageUpload={handleImageUpload}/>
            {imageSrc && (
                <div className="image-container" id="image-container">
                    <img id="uploaded-image" src={imageSrc} alt="Uploaded"/>
                    <button onClick={handleExtractText}>Extract Text</button>
                </div>
            )}
            <textarea value={extractedText} readOnly rows={10} cols={50}/>
        </div>
    );
};

export default App;
