import React from 'react';
import { motion } from 'motion/react';

const timeline = [
  {
    year: '2026',
    title: 'Advanced Data Engineering & Portfolio',
    description: 'Developed complex portfolio projects demonstrating streaming and lakehouse architectures. Prepared for rigorous technical interviews focusing on system design and ETL scaling.'
  },
  {
    year: '2025',
    title: 'Cloud & Orchestration Mastery',
    description: 'Mastered AWS infrastructure, deployed Databricks clusters, and orchestrated complex DAGs using Apache Airflow. Built End-to-End pipelines.'
  },
  {
    year: '2024',
    title: 'Foundations of Data Engineering',
    description: 'Established a strong foundation in Python scripting, advanced SQL query optimization, and foundational data modeling concepts.'
  }
];

export function Timeline() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-16 text-center">
          Learning & Experience Journey
        </h2>
        
        <div className="relative border-l border-white/10 ml-4 md:ml-1/2 space-y-12 pb-8">
          {timeline.map((item, idx) => (
            <motion.div 
              key={item.year}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:w-1/2 md:pr-12 md:text-right md:ml-0 md:absolute md:left-[-50%] md:top-0">
                <div className="text-[10px] font-mono text-brand-purple mb-2 uppercase tracking-wider">{item.year}_TARGET</div>
              </div>
              <div className="absolute w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_8px_#8B5CF6] left-[-4.5px] top-1.5 md:left-[-4.5px]" />
              <div className="md:w-1/2 md:pl-12 md:ml-[50%] p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                <h3 className="text-sm font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-[10px] text-slate-400 font-sans opacity-80 italic">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
