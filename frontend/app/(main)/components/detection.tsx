"use client";

import { useState, useRef, useCallback } from "react";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImagePlus,
  Loader2,
  Upload,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Download,
  Share2,
  Info,
  X,
} from "lucide-react";
import { DetectionHistory, PredictionResult } from "@/types/detection";

const DetectionComponent = ({ id }: { id: string }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [history, setHistory] = useState<DetectionHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // Rate limiting
  const RATE_LIMIT = 30000; // 30 seconds
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const lastRequestTime = useRef<number>(0);

  // variable handle File
  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Please select a valid image file (PNG, JPG, JPEG, or WebP)");
        toast.error("Invalid file type");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size too large. Maximum size is 5MB");
        toast.error("File size too large");
        return;
      }

      setCurrentFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
      setPrediction(null);
      toast.success("Image uploaded successfully");
    },
    [MAX_FILE_SIZE]
  );

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const getPrediction = async () => {
    if (!currentFile) {
      toast.error("Please select an image first");
      return;
    }

    // Rate limiting check
    const currentTime = Date.now();
    if (currentTime - lastRequestTime.current < RATE_LIMIT) {
      const waitTime = Math.ceil(
        (RATE_LIMIT - (currentTime - lastRequestTime.current)) / 1000
      );
      setError(`Please wait ${waitTime} seconds before making another request`);
      toast.error(`Please wait ${waitTime} seconds`);
      return;
    }

    const formData = new FormData();
    formData.append("image", currentFile);

    setIsLoading(true);
    setError(null);
    lastRequestTime.current = currentTime;
    const startTime = Date.now();

    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_MODEL_ENDPOINT_URL!,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 60000,
        }
      );

      const processingTime = Date.now() - startTime;
      const data = response.data;

      if (data.error) {
        setError(data.error);
        toast.error(data.error);
        return;
      }

      const result: PredictionResult = {
        predicted: data.predicted,
        prediction: data.prediction,
        confidence: getConfidenceLevel(data.prediction),
        processingTime,
      };

      setPrediction(result);

      // Add to history
      if (preview) {
        const historyItem: DetectionHistory = {
          id: Date.now().toString(),
          preview,
          result,
          timestamp: new Date(),
        };
        setHistory((prev) => [historyItem, ...prev.slice(0, 4)]); // Keep last 5
      }

      toast.success("Prediction completed successfully");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceLevel = (probability: number): string => {
    if (probability >= 0.9) return "Very High";
    if (probability >= 0.75) return "High";
    if (probability >= 0.6) return "Medium";
    if (probability >= 0.45) return "Low";
    return "Very Low";
  };

  const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string }>;
      if (axiosError.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
        toast.error("Request timed out");
      } else {
        const errorMsg =
          axiosError.response?.data?.error || "Failed to get prediction";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } else {
      setError("An unexpected error occurred");
      toast.error("Unexpected error occurred");
    }
  };

  const resetDetection = () => {
    setPreview(null);
    setPrediction(null);
    setError(null);
    setCurrentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const downloadResult = () => {
    if (!prediction || !preview) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new window.Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // Add prediction text overlay
      if (ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, img.height - 60, img.width, 60);
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(
          `Prediction: ${prediction.predicted}`,
          10,
          img.height - 35
        );
        ctx.fillText(
          `Confidence: ${(prediction.prediction * 100).toFixed(1)}%`,
          10,
          img.height - 10
        );
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `brain-tumor-detection-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    };

    img.src = preview;
  };

  const shareResult = async () => {
    if (!prediction) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Brain Tumor Detection Result",
          text: `Prediction: ${prediction.predicted} (${(
            prediction.prediction * 100
          ).toFixed(1)}% confidence)`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      // Fallback: copy to clipboard
      const text = `Brain Tumor Detection Result:\nPrediction: ${
        prediction.predicted
      }\nConfidence: ${(prediction.prediction * 100).toFixed(1)}%`;
      navigator.clipboard.writeText(text);
      toast.success("Result copied to clipboard");
    }
  };

  return (
    <div id={id} className="w-full max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Upload Section */}
        <motion.div layout className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
              Upload Image
            </h2>
            {preview && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetDetection}
                className="flex items-center gap-2 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </motion.button>
            )}
          </div>

          {/* Drag & Drop Zone */}
          <motion.div
            ref={dropRef}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            whileHover={{ scale: 1.02 }}
            className={`relative w-full h-[400px] border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8"
                >
                  <motion.div
                    animate={dragActive ? { scale: 1.1 } : { scale: 1 }}
                    className={`p-4 rounded-full ${
                      dragActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <ImagePlus className="w-8 h-8 text-gray-700 dark:text-white" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-gray-700 dark:text-white mb-2">
                      {dragActive
                        ? "Drop your image here"
                        : "Upload Brain Scan Image"}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Drag & drop or click to select
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Supports PNG, JPG, JPEG, WebP (max 5MB)
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover rounded-xl"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={getPrediction}
              disabled={!currentFile || isLoading}
              className="flex-1 flex items-center text-black dark:text-white justify-center gap-2 px-4 py-3 bg-primary outline-2 outline-black dark:outline-white/40 rounded-lg font-medium disabled:opacity-80 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="text-gray-700 dark:text-white w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="text-gray-700 dark:text-white w-4 h-4" />
                  Detect Tumor
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors outline-2 outline-black dark:outline-white/40"
              title="View History"
            >
              <Info className=" text-gray-700 dark:text-white w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div layout className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white">
              Detection Results
            </h2>
            {prediction && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={downloadResult}
                  className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  title="Download Result"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareResult}
                  className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  title="Share Result"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </div>

          <motion.div
            layout
            className="h-[400px] border border-border rounded-xl overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4 p-8"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-12 h-12 text-primary" />
                  </motion.div>
                  <div className="text-center">
                    <p className="text-lg font-medium">Analyzing Brain Scan</p>
                    <p className="text-sm text-muted-foreground">
                      Our AI is processing your image...
                    </p>
                  </div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="h-1 bg-primary rounded-full"
                  />
                </motion.div>
              ) : error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center"
                >
                  <AlertCircle className="w-12 h-12 text-red-500" />
                  <div>
                    <p className="text-lg font-medium text-red-600">
                      Error Occurred
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {error}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    Dismiss
                  </motion.button>
                </motion.div>
              ) : prediction ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="h-full p-6 space-y-6 overflow-y-auto scrollbar-none"
                >
                  <div className="space-y-4">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">
                        Detection Complete
                      </h3>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Analysis Successful
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-4 bg-muted/50 rounded-lg"
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          Prediction
                        </p>
                        <p className="text-2xl font-bold">
                          {prediction.predicted}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="p-4 bg-muted/50 rounded-lg"
                      >
                        <p className="text-sm text-muted-foreground mb-1">
                          Confidence
                        </p>
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-bold">
                            {(prediction.prediction * 100).toFixed(1)}%
                          </p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              prediction.confidence === "Very High"
                                ? "bg-green-100 text-green-800"
                                : prediction.confidence === "High"
                                ? "bg-blue-100 text-blue-800"
                                : prediction.confidence === "Medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {prediction.confidence}
                          </span>
                        </div>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.prediction * 100}%` }}
                          transition={{ delay: 0.5, duration: 1 }}
                          className="h-2 bg-primary rounded-full mt-2"
                        />
                      </motion.div>

                      {prediction.processingTime && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="p-4 bg-muted/50 rounded-lg"
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                            Processing Time
                          </p>
                          <p className="text-lg font-semibold">
                            {(prediction.processingTime / 1000).toFixed(2)}s
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center"
                >
                  <div className="p-4 bg-muted rounded-full">
                    <Upload className="w-8 h-8 text-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700 dark:text-white">
                      Ready for Analysis
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Upload a brain scan image to get started
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* History Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-black dark:text-white">
                Detection History
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHistory(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {history.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-32">
                      <Image
                        src={item.preview}
                        alt="History item"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <p className="font-medium text-sm">
                        {item.result.predicted}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(item.result.prediction * 100).toFixed(1)}% confidence
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {history.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-muted-foreground"
              >
                No detection history yet
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DetectionComponent;
