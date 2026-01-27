import { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Camera, Upload, Loader2, FileText, AlertCircle } from "lucide-react";

function OCRScanner({ onScanComplete }) {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult("");
            setError("");
        }
    };

    const handleScan = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append("image", image);

        setLoading(true);
        setError("");
        setResult("");

        try {
            const response = await axios.post(
                "http://localhost:5000/api/medicine/scan",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                setResult(response.data.ocrText);
                if (onScanComplete) {
                    onScanComplete(response.data.ocrText);
                }
            } else {
                setError("OCR processing failed.");
            }
        } catch (err) {
            console.error(err);
            const backendError = err.response?.data?.error;
            setError(backendError || "Failed to connect to OCR server. Ensure backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5 text-teal-600" />
                    AI Medicine Scanner
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="flex-1"
                        />
                        <Button
                            onClick={handleScan}
                            disabled={!image || loading}
                            className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Scanning...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Scan
                                </>
                            )}
                        </Button>
                    </div>

                    {preview && (
                        <div className="relative rounded-lg overflow-hidden border border-gray-200 h-48 bg-gray-50 flex items-center justify-center">
                            <img src={preview} alt="Preview" className="h-full object-contain" />
                        </div>
                    )}

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200">
                            <div className="flex items-center gap-2 font-medium text-gray-700">
                                <FileText className="w-4 h-4" />
                                Extracted Text:
                            </div>
                            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono max-h-40 overflow-y-auto">
                                {result}
                            </pre>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default OCRScanner;
