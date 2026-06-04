import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const reasons = [
  "Strong foundation in Python and advanced SQL.",
  "Proven experience building batch (Airflow) and streaming (Kafka) pipelines.",
  "Deep understanding of cloud data platforms (AWS, Snowflake, Databricks).",
  "Ability to take full end-to-end ownership of data projects.",
  "Strong understanding of data modeling, schema design, and robust ETL principles."
];

export function Recruiter() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-blue/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="glass-card bg-black/60 rounded-3xl p-8 lg:p-16 border-white/10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-6">
                 Why Hire Me?
               </h2>
               <p className="text-gray-400 font-sans text-lg mb-8">
                 I don't just write scripts; I design resilient data systems. I bring a combination of modern tooling experience and a disciplined engineering mindset.
               </p>
            </div>
            
            <div className="space-y-4">
              {reasons.map((reason, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                >
                  <CheckCircle2 className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300 font-sans text-sm">{reason}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
