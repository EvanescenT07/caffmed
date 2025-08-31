"use client";

import { motion, Variants } from "framer-motion";
import {
  Brain,
  Code,
  Database,
  Target,
  Lightbulb,
  TrendingUp,
  Award,
} from "lucide-react";

const AboutPage = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const techStackData = [
    {
      title: "Technology Stack",
      items: ["Next.js", "TensorFlow", "Python", "TypeScript"],
      icon: Code,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      title: "Model Architecture",
      items: [
        "CNN",
        "Deep Learning",
        "Image Classification",
        "Transfer Learning",
      ],
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      title: "Performance Metrics",
      items: [
        "95.8% Accuracy",
        "Fast Processing",
        "Reliable Results",
        "Real-time",
      ],
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
    },
  ];

  return (
    <div className="min-h-screen w-full pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-700 dark:text-white">
                About{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CaffMed
                </span>
              </h1>

              <div className="flex items-center justify-center gap-3">
                <div className="h-px w-12 bg-border" />
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                  CaffMed is a web application that uses machine learning to
                  detect brain tumors from MRI images with high precision and
                  reliability.
                </p>
                <div className="h-px w-12 bg-border" />
              </div>
            </div>
          </motion.div>

          {/* Main Story Section */}
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto">
            <motion.div
              variants={cardVariants}
              className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm"
            >
              <div className="space-y-8">
                {/* Story Header */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-center space-y-4"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-700 dark:text-white">
                      Our Journey
                    </h2>
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />
                </motion.div>

                {/* Story Content */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="space-y-6"
                >
                  {/* Centered container for story cards */}
                  <div className="max-w-4xl mx-auto">
                    {/* Text Content - Now centered */}
                    <div className="space-y-6">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 bg-muted/30 rounded-xl border border-border/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <Database className="w-5 h-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                            The Beginning
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                          It all started as a casual attempt to learn machine
                          learning. I began searching for interesting and
                          challenging datasets to try out. Eventually, I came
                          across a dataset about brain tumors, which seemed like
                          a great fit for a small project.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 bg-muted/30 rounded-xl border border-border/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-purple-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                            The Journey
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                          This dataset presented an opportunity to develop a
                          machine learning model that could predict or classify
                          the available data. From there, I began experimenting
                          with various techniques and algorithms to see how well
                          machine learning could work with this dataset.
                        </p>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 bg-muted/30 rounded-xl border border-border/50"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Award className="w-5 h-5 text-green-600" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                            The Result
                          </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                          What started as a simple trial-and-error process
                          gradually turned into an enjoyable learning
                          experience, sparking many ideas for further
                          exploration in technology and data science.
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Performance Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                  className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg mt-1">
                      <Target className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 dark:text-white mb-2">
                        Model Performance
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-justify">
                        While the model achieves great accuracy, there are rare
                        cases of misprediction on certain images, likely due to
                        the random nature or differing contexts of the data.
                        Despite this, the overall performance remains impressive
                        and reliable for medical assistance purposes.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Technical Specs */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {techStackData.map((spec, index) => (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 ${spec.bgColor} rounded-lg`}>
                    <spec.icon className={`w-5 h-5 ${spec.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-700 dark:text-white">
                    {spec.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {spec.items.map((item, itemIndex) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 1.8 + index * 0.1 + itemIndex * 0.05,
                      }}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Experience the power of AI-driven medical detection
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
