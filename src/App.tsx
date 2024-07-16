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

    const calculateRows = (text: string) => {
        return text.split('\n').length;
    };

    const handleBackClick = async () => {
        if(aiAnalysis){
            setAiAnalysis(null);
            return;
        }

        if(extractedText){
            setExtractedText("");
            return;
        }

        setImageSrc(null);
    };

    const handleAIAnalysis = async () => {
        if (extractedText) {
            setAiAnalysis("{\"\": \"In-Progress...\"}");
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
                <>
                    <h2> Upload Invoice </h2>
                    <ImageUploader onImageUpload={handleImageUpload}/>
                </>
            }

            {imageSrc && !extractedText && (
                <div className="image-container" id="image-container">
                    <h2> Invoice Preview </h2>
                    <img id="uploaded-image" src={imageSrc} alt="Uploaded"/>
                    <div className={"back-end"}>
                        <button onClick={handleExtractText}>Extract Text</button>
                        <button style={{backgroundColor: "black"}} onClick={handleBackClick}>X</button>
                    </div>

                </div>
            )}

            {extractedText && (
                <div className="extracted-details">
                    {imageSrc && extractedText && !aiAnalysis &&
                        <>
                            <h2> OCR Text </h2>
                            <textarea value={extractedText} readOnly rows={calculateRows(extractedText) + 1} cols={50}/>
                            {extractedText !== "In-Progress..." &&
                                <div className={"back-end"}>
                                    <button onClick={handleAIAnalysis}>Analyze with AI</button>
                                    <button style={{backgroundColor: "black"}} onClick={handleBackClick}>BACK</button>
                                </div>
                            }
                        </>
                    }
                    {renderAnalysisGrid()}
                    { imageSrc && extractedText && aiAnalysis && !aiAnalysis.includes("In-Progress...") &&
                        <div className={"back-end"}>
                            <button onClick={handleAIAnalysis}>Re-Analyze with AI</button>
                            <button style={{backgroundColor: "black"}} onClick={handleBackClick}>BACK</button>
                        </div>
                    }
                </div>
            )}
        </div>
    );
};

export default App;
