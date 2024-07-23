import React from 'react';
import { motion } from 'framer-motion';

const Step = ({ number, title, description, delay }) => (
  <motion.div 
    className="flex flex-col items-center text-center bg-gradient-to-b from-[#090979] to-[#00D4FF] p-8 rounded-lg shadow-lg"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <motion.div 
      className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-[#090979] mb-6 shadow-md"
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {number}
    </motion.div>
    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-200">{description}</p>
  </motion.div>
);

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: "Upload Your Sales Data",
      description: "Securely upload your historical sales data to our state-of-the-art platform."
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our advanced AI algorithms meticulously analyze your data and identify intricate patterns."
    },
    {
      number: 3,
      title: "Get Actionable Insights",
      description: "Receive precise predictions and strategic insights to revolutionize your sales approach."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-br from-[#020024] via-[#090979] to-[#00D4FF]">
      <div className="container mx-auto">
        <motion.h2 
          className="text-5xl font-bold mb-16 text-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <Step key={index} {...step} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;