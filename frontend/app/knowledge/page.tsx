"use client";

import { motion, Variants } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  BookOpen,
  Stethoscope,
  Target,
  Zap,
  Shield,
  Heart,
} from "lucide-react";

const KnowledgePage = () => {
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

  const accordionVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0.0, 0.2, 1],
      },
    },
  };

  const accordionData = [
    {
      value: "1",
      title: "Brain Tumor",
      icon: Brain,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            A brain tumor is a growth of abnormal cells in the brain or near the
            brain. These tumors can develop in many parts of the brain,
            including the brainstem, the sinuses, the skull base, and the
            protective lining.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              Abnormal Cell Growth
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Various Locations
            </Badge>
            <Badge variant="secondary" className="text-xs">
              Requires Diagnosis
            </Badge>
          </div>
        </div>
      ),
    },
    {
      value: "2",
      title: "Types of Brain Tumor",
      icon: BookOpen,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Brain tumors have many types, with the most common being Glioma,
            Meningioma, and Pituitary tumors. Each type has different
            characteristics and treatment approaches.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="font-semibold text-red-600 text-sm">Glioma</div>
              <div className="text-xs text-muted-foreground">
                From glial cells
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="font-semibold text-blue-600 text-sm">
                Meningioma
              </div>
              <div className="text-xs text-muted-foreground">
                Protective membranes
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <div className="font-semibold text-purple-600 text-sm">
                Pituitary
              </div>
              <div className="text-xs text-muted-foreground">Hormone gland</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "Glioma",
      title: "Glioma Brain Tumor",
      icon: Target,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950/20",
      borderColor: "border-red-200 dark:border-red-800",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Glioma is a type of brain tumor that originates from glial cells,
            which support the nervous system. The exact cause of glioma is
            unknown, but genetic factors, family history, and radiation exposure
            can increase the risk.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Symptoms
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Worsening headaches</li>
                <li>• Seizures and nausea</li>
                <li>• Vision problems</li>
                <li>• Body weakness</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Treatment
              </h4>
              <p className="text-sm text-muted-foreground">
                Surgical tumor removal, radiation therapy, and chemotherapy,
                depending on the tumor&apos;s size, location, and severity.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "Meningioma",
      title: "Meningioma Brain Tumor",
      icon: Shield,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Meningioma is a benign tumor that grows in the meninges, the
            protective membranes covering the brain and spinal cord. Its cause
            is not fully understood, but risk factors may include radiation
            exposure, hormones, and genetic mutations.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Symptoms
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Gradual onset headaches</li>
                <li>• Vision problems</li>
                <li>• Seizures</li>
                <li>• Body weakness</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Treatment
              </h4>
              <p className="text-sm text-muted-foreground">
                Regular monitoring for small tumors, surgery to remove the
                tumor, and radiation therapy if surgery is not possible.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "Pituitary",
      title: "Pituitary Brain Tumor",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Pituitary adenoma is a benign tumor that grows in the pituitary
            gland, which controls hormone production in the body. While the
            exact cause is unknown, genetic mutations and hormonal factors are
            believed to play a role.
          </p>
          <div className="space-y-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Symptoms
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Vision problems and headaches</li>
                <li>• Fatigue and hormonal disorders</li>
                <li>• Gigantism or Cushing&apos;s syndrome</li>
                <li>• Various endocrine effects</li>
              </ul>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Treatment
              </h4>
              <p className="text-sm text-muted-foreground">
                Medication to regulate hormones, surgery to remove the tumor,
                and radiation therapy when necessary.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      value: "Treatment",
      title: "Brain Tumor Treatment",
      icon: Heart,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed mb-4">
            Treatment approaches vary based on tumor type, size, location, and
            patient condition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Surgery",
                description:
                  "Effective for tumor removal, especially for accessible tumors.",
                icon: "🔬",
              },
              {
                title: "Radiation Therapy",
                description:
                  "Often used post-surgery or when the tumor cannot be surgically removed.",
                icon: "⚡",
              },
              {
                title: "Chemotherapy",
                description:
                  "Utilized to target cancerous cells, often alongside other treatments.",
                icon: "💊",
              },
              {
                title: "Targeted Therapy",
                description:
                  "A newer approach focusing on specific tumor characteristics.",
                icon: "🎯",
              },
              {
                title: "Immunotherapy",
                description:
                  "Boosting the body&apos;s immune system to fight the tumor.",
                icon: "🛡️",
              },
              {
                title: "Supportive Care",
                description:
                  "Managing symptoms and improving quality of life during treatment.",
                icon: "❤️",
              },
            ].map((treatment, index) => (
              <motion.div
                key={treatment.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg">{treatment.icon}</span>
                  <h4 className="font-semibold text-foreground">
                    {treatment.title}
                  </h4>
                </div>
                <p className="text-sm text-muted-foreground">
                  {treatment.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ),
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
          {/* Main Content */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Accordion type="single" collapsible className="space-y-4">
                  {accordionData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.value}
                        variants={accordionVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 1 + index * 0.1 }}
                      >
                        <AccordionItem
                          value={item.value}
                          className="border border-border rounded-xl overflow-hidden bg-muted/20 hover:bg-muted/40 transition-all duration-300"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline group">
                            <div className="flex items-center gap-4 text-left">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className={`p-3 rounded-xl ${item.bgColor} ${item.borderColor} border`}
                              >
                                <IconComponent
                                  className={`w-5 h-5 ${item.color}`}
                                />
                              </motion.div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-blue-700 dark:group-hover:text-blue-500 transition-colors">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Click to expand and learn more
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-6">
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className="pt-4 border-t border-border/50"
                            >
                              {item.content}
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      </motion.div>
                    );
                  })}
                </Accordion>
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Ready to use our AI-powered detection system?
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
                className="px-8 py-3 bg-blue-600 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-blue-500 transition-all inline-flex items-center gap-2"
              >
                Start Detection
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default KnowledgePage;
