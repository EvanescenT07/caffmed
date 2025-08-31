"use client";

import { motion, Variants } from "framer-motion";
import {
  Brain,
  Zap,
  Shield,
  Target,
  ImagePlus,
  Upload,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  const scrollToDetection = () => {
    const detectionElement = document.getElementById("detection");
    if (detectionElement) {
      detectionElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const tumorData = [
    {
      icon: Brain,
      title: "Glioma",
      description: "Advanced detection of glioma tumors with high precision",
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      accuracy: "94.2%",
    },
    {
      icon: Target,
      title: "Meningioma",
      description: "Precise meningioma identification and classification",
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      accuracy: "96.8%",
    },
    {
      icon: Zap,
      title: "Pituitary",
      description: "Fast pituitary tumor analysis and detection",
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      accuracy: "95.1%",
    },
    {
      icon: Shield,
      title: "No Tumor",
      description: "Healthy brain verification and confirmation",
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      accuracy: "97.3%",
    },
  ];

  const stepsData = [
    {
      step: "1",
      title: "Upload Image",
      description: "Select or drag & drop your brain MRI scan",
      icon: Upload,
    },
    {
      step: "2",
      title: "AI Analysis",
      description: "Our CNN model processes your image",
      icon: Zap,
    },
    {
      step: "3",
      title: "Get Results",
      description: "Receive detailed detection results",
      icon: CheckCircle,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/80 border border-border"
          >
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Medical Detection
          </Badge>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white leading-tight">
              Brain Tumor Detection
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-border" />
              <span className="text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium">
                By Deep Learning CNN Algorithm
              </span>
              <div className="h-px w-12 bg-border" />
            </div>
          </div>

          {/* Description */}
          <p className="max-w-4xl mx-auto text-base md:text-lg text-gray-700 dark:text-white leading-relaxed">
            Detecting brain tumors with precision is now more accessible than
            ever. Our cutting-edge deep learning model leverages{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              Convolutional Neural Networks (CNNs)
            </span>{" "}
            to classify brain MRI scans into four distinct categories with{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              high accuracy and efficiency
            </span>
            .
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Feature Showcase */}
          <motion.div layout className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-black dark:text-white font-bold">
                Detection Categories
              </h2>
              <Badge
                variant="outline"
                className="text-gray-700 dark:text-white text-xs"
              >
                4 Types
              </Badge>
            </div>

            <motion.div className="h-fit border border-border rounded-xl overflow-hidden bg-card">
              <div className="h-full p-6 space-y-6">
                {tumorData.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg hover:bg-muted/80 transition-all duration-300 cursor-pointer group"
                  >
                    <div
                      className={`p-3 rounded-xl ${feature.bgColor} border border-border/50 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-black dark:text-white">
                          {feature.title}
                        </h3>
                        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                          {feature.accuracy}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Start Section */}
          <motion.div layout className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl text-black dark:text-white font-bold">
                Get Started
              </h2>
              <Badge
                variant="outline"
                className="text-gray-700 dark:text-white text-xs"
              >
                Easy
              </Badge>
            </div>

            <motion.div className="h-fit border border-border rounded-xl overflow-hidden bg-card">
              <div className="h-full p-6 space-y-6">
                {/* Quick Demo Area */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative h-32 border-2 border-dashed border-border rounded-xl cursor-pointer transition-all duration-300 hover:border-primary/50 bg-muted/30"
                  onClick={scrollToDetection}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                    <div className="p-3 bg-muted rounded-full">
                      <ImagePlus className="w-6 h-6 text-gray-700 dark:text-white" />
                    </div>
                    <p className="text-sm font-medium text-black dark:text-gray-100">
                      Try Sample Detection
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Click to start
                    </p>
                  </div>
                </motion.div>

                {/* Steps */}
                <div className="space-y-4">
                  {stepsData.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.2 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white rounded-full text-sm font-bold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-700 dark:text-white">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {step.description}
                        </p>
                      </div>
                      <step.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="text-center pt-8">
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Ready to analyze your brain scan? Get started in seconds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  onClick={scrollToDetection}
                  className="px-8 py-3 bg-primary text-gray-700 dark:text-white hover:bg-primary/90 font-medium cursor-pointer"
                >
                  Upload Your Scan
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 border-border hover:bg-muted/50 text-gray-700 dark:text-white font-medium"
                >
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
