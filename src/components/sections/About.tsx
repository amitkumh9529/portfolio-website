import React from 'react';
import { motion } from 'motion/react';
import { Terminal } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              <span className="text-brand-blue">SELECT</span> * <span className="text-brand-purple">FROM</span> data_engineering <br/>
              WHERE passion = true;
            </h2>
            <div className="space-y-4 text-gray-400 font-sans text-lg leading-relaxed">
              <p>
                I am a Data Engineer passionate about building scalable, resilient, and high-performance data infrastructure. My focus is on solving complex data problems by designing systems that can confidently process millions of records while maintaining strict data governance and reliability.
              </p>
              <p>
                From architecting robust batch processing workflows in Apache Airflow to constructing low-latency streaming pipelines with Kafka and Spark, I thrive in the modern data stack. 
              </p>
              <p>
                My goal is simple: to be a high-impact engineer who transforms chaotic, raw data streams into unified, pristine data assets for advanced analytics and machine learning.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex-1 p-5 rounded-3xl bg-black border border-white/10 font-mono text-[10px] sm:text-xs leading-relaxed shadow-2xl shadow-brand-purple/5">
              <div className="flex items-center gap-1.5 mb-4 border-b border-white/10 pb-3">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="ml-2 text-slate-500 text-[10px]">amit_halder_profile.py</span>
              </div>
              <div className="bg-transparent font-mono leading-loose overflow-x-auto text-slate-300">
                <span className="text-brand-purple">class</span> <span className="text-yellow-300">DataEngineer</span>:
                <br />
                <span className="pl-4 text-brand-purple">def</span> <span className="text-brand-blue">__init__</span>(<span className="text-orange-300">self</span>):
                <br />
                <span className="pl-8 text-orange-300">self</span>.name = <span className="text-green-300">"Amit Halder"</span>
                <br />
                <span className="pl-8 text-orange-300">self</span>.role = <span className="text-green-300">"Data Engineer"</span>
                <br />
                <span className="pl-8 text-orange-300">self</span>.mission = <span className="text-green-300">"Transforming data"</span>
                <br /><br />
                <span className="pl-4 text-brand-purple">def</span> <span className="text-brand-blue">get_focus</span>(<span className="text-orange-300">self</span>):
                <br />
                <span className="pl-8 text-brand-purple">return</span> [
                <br />
                <span className="pl-12 text-green-300">"Scalable Architectures"</span>,
                <br />
                <span className="pl-12 text-green-300">"Streaming & Batch Pipelines"</span>,
                <br />
                <span className="pl-12 text-green-300">"Cloud Data Platforms"</span>,
                <br />
                <span className="pl-8">]</span>
                <br /><br />
                <span className="text-gray-500"># System initialized successfully</span>
                <br />
                <span className="text-brand-blue animate-pulse">_</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
