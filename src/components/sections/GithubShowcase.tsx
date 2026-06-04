import React from 'react';
import { motion } from 'motion/react';
import { Github, Star, GitFork, BookOpen } from 'lucide-react';

export function GithubShowcase() {
  // Mock contribution graph
  const weeks = Array.from({ length: 52 });
  const days = Array.from({ length: 7 });
  
  return (
    <section className="py-24 bg-black/40 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-12">
          <Github className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-display font-bold text-white">
            GitHub Activity
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 glass-card rounded-2xl p-6 border-white/10"
          >
            <h3 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">Contribution Graph</h3>
            
            <div className="flex gap-[3px] overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
              {weeks.map((_, i) => (
                <div key={i} className="flex flex-col gap-[3px]">
                  {days.map((_, j) => {
                    const intensity = Math.random();
                    let bg = "bg-white/5";
                    if (intensity > 0.8) bg = "bg-brand-blue";
                    else if (intensity > 0.6) bg = "bg-brand-blue/70";
                    else if (intensity > 0.4) bg = "bg-brand-blue/40";
                    else if (intensity > 0.2) bg = "bg-brand-blue/20";
                    return (
                      <div key={j} className={`w-3 h-3 rounded-[2px] ${bg}`} title="Contribution" />
                    )
                  })}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
              <div>
                 <div className="text-2xl font-bold font-mono text-white">482</div>
                 <div className="text-xs text-gray-500 font-mono">Contributions</div>
              </div>
              <div>
                 <div className="text-2xl font-bold font-mono text-white">Python</div>
                 <div className="text-xs text-gray-500 font-mono">Top Language</div>
              </div>
              <div>
                 <div className="text-2xl font-bold font-mono text-white">12</div>
                 <div className="text-xs text-gray-500 font-mono">Repositories</div>
              </div>
              <div>
                 <div className="text-2xl font-bold font-mono text-white">4</div>
                 <div className="text-xs text-gray-500 font-mono">OSS PRs</div>
              </div>
            </div>
          </motion.div>

          {/* Featured Repo */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 border-white/10 flex flex-col"
          >
             <h3 className="text-sm font-mono text-gray-400 mb-6 uppercase tracking-wider">Top Repository</h3>
             
             <div className="bg-black/50 p-4 rounded-xl border border-white/5 flex-grow">
               <div className="flex items-center gap-2 text-brand-purple font-mono font-bold text-lg mb-2">
                 <BookOpen className="w-5 h-5" /> spark-etl-framework
               </div>
               <p className="text-sm text-gray-400 font-sans mb-4">
                 A modular, scalable PySpark framework for building production-grade ETL pipelines with built-in data quality checks.
               </p>
               
               <div className="flex items-center gap-4 text-xs font-mono text-gray-500 mt-auto">
                 <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400"/> Python</div>
                 <div className="flex items-center gap-1"><Star className="w-3 h-3"/> 24</div>
                 <div className="flex items-center gap-1"><GitFork className="w-3 h-3"/> 5</div>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
