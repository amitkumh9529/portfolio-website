import React from 'react';
import { motion } from 'motion/react';
import { Network, Server, Database, Cloud } from 'lucide-react';

export function Architectures() {
  return (
    <section className="py-24 bg-black/50 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Data Architectures I've Built
          </h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto">
            Interactive blueprints of production systems.
          </p>
        </div>

        <div className="space-y-12">
          {/* Batch Architecture */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 border-brand-purple/20"
          >
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Server className="text-brand-purple w-5 h-5" /> Batch Processing Lakehouse
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
              {/* Lines */}
              <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-white/10 -z-10" />
              <svg className="hidden md:block absolute top-1/2 left-[10%] right-[10%] -mt-[1px] h-2 w-[80%] -z-10" preserveAspectRatio="none">
                <line x1="0" y1="4" x2="100%" y2="4" stroke="#8B5CF6" strokeWidth="2" className="data-flow-path" opacity="0.6" />
              </svg>
              
              {[
                { name: 'Source Systems', icon: Database },
                { name: 'Airflow', icon: Server },
                { name: 'Apache Spark', icon: ZapIcon },
                { name: 'AWS S3', icon: Cloud },
                { name: 'Snowflake', icon: Database },
                { name: 'BI Tools', icon: Network },
              ].map((node, i) => (
                <div key={node.name} className="flex flex-col items-center group">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center mb-2 group-hover:border-brand-purple/50 group-hover:scale-110 transition-all z-10 relative">
                    <div className="absolute inset-0 bg-brand-purple/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <node.icon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 whitespace-nowrap text-center">{node.name}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Streaming Architecture */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-8 border-brand-blue/20"
          >
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Network className="text-brand-blue w-5 h-5" /> Real-Time Event Streaming
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
              <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-white/10 -z-10" />
              <svg className="hidden md:block absolute top-1/2 left-[15%] right-[15%] -mt-[1px] h-2 w-[70%] -z-10" preserveAspectRatio="none">
                <line x1="0" y1="4" x2="100%" y2="4" stroke="#00D4FF" strokeWidth="2" className="data-flow-path" opacity="0.6" />
              </svg>
              
              {[
                { name: 'Applications', icon: Server },
                { name: 'Apache Kafka', icon: Network },
                { name: 'Spark Streaming', icon: ZapIcon },
                { name: 'Snowflake', icon: Database },
                { name: 'Dashboard', icon: Cloud },
              ].map((node, i) => (
                <div key={node.name} className="flex flex-col items-center group">
                  <div className="w-14 h-14 rounded-xl bg-slate-900 border border-white/20 flex items-center justify-center mb-2 group-hover:border-brand-blue/50 group-hover:scale-110 transition-all z-10 relative">
                    <div className="absolute inset-0 bg-brand-blue/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <node.icon className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 whitespace-nowrap text-center">{node.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        
        </div>
      </div>
    </section>
  );
}

// Temporary Zap icon wrapper to avoid missing import
function ZapIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
