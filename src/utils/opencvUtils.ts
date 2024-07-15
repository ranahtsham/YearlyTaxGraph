// src/utils/opencvUtils.ts
import Tesseract from 'tesseract.js';

declare global {
    interface Window {
        cv: any;
        Module: any;
    }
}

export async function loadOpenCV(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://docs.opencv.org/4.10.0/opencv.js`;
        script.async = true;
        script.onload = () => {
            window.Module = {
                onRuntimeInitialized() {
                    resolve();
                }
            };
        };
        script.onerror = (error) => {
            reject(error);
        };
        document.body.appendChild(script);
    });
}

function matToCanvas(mat: any): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = mat.cols;
    canvas.height = mat.rows;
    const ctx = canvas.getContext('2d');

    // Convert mat to RGBA if it is not already
    if (mat.channels() === 1) {
        const cv = window.cv;
        const rgbaMat = new cv.Mat();
        cv.cvtColor(mat, rgbaMat, cv.COLOR_GRAY2RGBA);
        mat = rgbaMat;
    }

    const imgData = new ImageData(new Uint8ClampedArray(mat.data), mat.cols, mat.rows);
    ctx?.putImageData(imgData, 0, 0);
    return canvas;
}

export async function extractTextFromImage(imageElement: HTMLImageElement): Promise<{ text: string, canvas: HTMLCanvasElement }> {
    let text = "";
    let canvas: HTMLCanvasElement;

    if (!window.cv) {
        console.error('OpenCV.js not loaded');
        return { text, canvas: document.createElement('canvas') };
    }

    const cv = window.cv;
    const src = cv.imread(imageElement);
    const gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    const dst = new cv.Mat();
    cv.adaptiveThreshold(gray, dst, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

    canvas = matToCanvas(dst);

    try {
        const { data: { text: ocrText } } = await Tesseract.recognize(canvas, 'eng', {
            logger: m => console.log(m)
        });
        text = ocrText;
    } catch (error) {
        console.error('Tesseract.js error:', error);
    }

    src.delete();
    gray.delete();
    dst.delete();

    return { text, canvas };
}
