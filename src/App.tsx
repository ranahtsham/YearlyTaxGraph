import React, {useEffect, useState} from 'react';
import {extractTextFromImage, loadOpenCV} from './utils/opencvUtils';
import ImageUploader from './components/ImageUploader';
import { analyzeTextWithAI } from './utils/openaiUtils';
import './App.css';


const App: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [extractedText, setExtractedText] = useState<string>("");
    const [aiAnalysis, setAiAnalysis] = useState<any>(null);

    useEffect(() => {
        loadOpenCV()
            .then(() => console.log('OpenCV loaded'))
            .catch((error) => console.error('Failed to load OpenCV', error));
    }, [imageSrc]);

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
            setExtractedText("In-Progress...");
            const { text } = await extractTextFromImage(imageElement);
            setExtractedText(text);
            setAiAnalysis(null); // Reset previous AI analysis
        } else {
            console.error('Image element not found');
        }
    };

    const handleAIAnalysis = async () => {
        if (extractedText) {
            setAiAnalysis("{\"\": \"In-Progress\"}");
            try {
                const analysisResult = await analyzeTextWithAI(extractedText);
                setAiAnalysis(analysisResult);
            } catch (error) {
                console.error('Error analyzing text with AI:', error);
            }
        }
    };

    const renderAnalysisGrid = () => {
        if (!aiAnalysis) return null;

        // Parse aiAnalysis string to JSON object
        let analysisObject;
        try {
            analysisObject = JSON.parse(aiAnalysis);
        } catch (error) {
            console.error('Error parsing AI analysis:', error);
            return null;
        }

        return (
            <div className="analysis-grid">
                <h2>AI Analysis</h2>
                <div className="grid-container">
                    {Object.entries(analysisObject).map(([key, value]) => (
                        <div key={key} className="grid-item">
                            <div className="label">{key.toUpperCase()}</div>
                            <div className="value">{value as any}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    return (
        <div className="App">
            <h1>Invoice Data Extractor</h1>

            {!imageSrc &&
                <ImageUploader onImageUpload={handleImageUpload}/>
            }

            {imageSrc && !extractedText && (
                <div className="image-container" id="image-container">
                    <img id="uploaded-image" src={imageSrc} alt="Uploaded"/>
                    <button onClick={handleExtractText}>Extract Text</button>
                </div>
            )}

            {extractedText && (
                <>
                    <textarea value={extractedText} readOnly rows={10} cols={50}/>
                    <div>
                        <button onClick={handleAIAnalysis}>Analyze with AI</button>
                        {renderAnalysisGrid()}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;
