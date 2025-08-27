export interface PredictionResult {
  predicted: string;
  prediction: number;
  confidence?: string;
  processingTime?: number;
}

export interface DetectionHistory {
  id: string;
  preview: string;
  result: PredictionResult;
  timestamp: Date;
}
