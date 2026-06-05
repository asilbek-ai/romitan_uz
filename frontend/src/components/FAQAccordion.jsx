import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (!faqs || faqs.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <i className="mb-2 text-4xl fas fa-question-circle"></i>
        <p>Hozircha savollar mavjud emas</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={faq._id || index} className="overflow-hidden bg-white rounded-xl shadow-sm">
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full flex justify-between items-center p-5 text-left font-medium hover:bg-gray-50 transition"
          >
            <span className="text-lg">{faq.question}</span>
            {openIndex === index ? (
              <FiChevronUp className="text-primary" />
            ) : (
              <FiChevronDown className="text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-5 pt-0 border-t text-gray-600">
                  <p>{faq.answer}</p>
                  {faq.answerRu && (
                    <p className="mt-2 text-sm text-gray-500">{faq.answerRu}</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}