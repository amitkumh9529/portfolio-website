import React from 'react';
import { motion } from 'motion/react';
import { Database, Activity, Code2, Award } from 'lucide-react';

const metrics = [
  {
    id: 1,
    label: 'End-to-End Projects',
    value: '5+',
    icon: Database,
    color: 'text-brand-blue',
  },
  {
    id: 2,
    label: 'Records Processed',
    value: '10M+',
    icon: Activity,
    color: 'text-brand-purple',
  },
  {
    id: 3,
    label: 'Technologies Mastered',
    value: '8+',
    icon: Code2,
    color: 'text-green-400',
  },
  {
    id: 4,
    label: 'Data Engineering Certified',
    value: 'IBM',
    icon: Award,
    color: 'text-yellow-400',
  }
];

export function Metrics() {
  return (
    <section className="py-20 border-t border-white/5 bg-black/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
             <motion.div
               key={metric.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="glass-card p-6 rounded-2xl border-white/5 hover:border-white/10 transition-colors group"
             >
               <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-lg bg-white/5 ${metric.color} group-hover:bg-white/10 transition-colors`}>
                   <metric.icon className="w-6 h-6" />
                 </div>
                 <div>
                   <div className="text-2xl font-bold font-mono text-white">
                     {metric.value}
                   </div>
                   <div className="text-[10px] font-sans text-slate-500 uppercase tracking-wider mt-1">
                     {metric.label}
                   </div>
                 </div>
               </div>
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
