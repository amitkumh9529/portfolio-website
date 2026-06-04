import React from 'react';
import { motion } from 'motion/react';
import { Award, ShieldCheck } from 'lucide-react';

const certs = [
  { name: "IBM Data Engineering Professional Certificate", issuer: "IBM" },
  { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services" },
  { name: "Databricks Lakehouse Fundamentals", issuer: "Databricks" },
  { name: "Snowflake SnowPro Core Fundamentals", issuer: "Snowflake" },
];

export function Certifications() {
  return (
    <section className="py-24 bg-black/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Professional Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certs.map((cert, idx) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-brand-blue/30 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform flex-shrink-0">
                  <Award className="w-5 h-5 text-brand-purple" />
                </div>
                <div>
                  <p className="text-sm text-white font-bold">{cert.name}</p>
                  <p className="text-[10px] text-slate-400 opacity-60 flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3 text-green-400" /> {cert.issuer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
