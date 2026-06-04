import React from 'react';
import { motion } from 'motion/react';

const skillCategories = [
  {
    title: "Programming",
    skills: ["Python", "SQL"]
  },
  {
    title: "Data Processing",
    skills: ["Apache Spark", "PySpark", "Pandas"]
  },
  {
    title: "Orchestration",
    skills: ["Apache Airflow"]
  },
  {
    title: "Streaming",
    skills: ["Apache Kafka"]
  },
  {
    title: "Cloud & Warehouse",
    skills: ["AWS", "Databricks", "Snowflake"]
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-black/40 border-y border-white/5 relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-brand-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Technical Stack
          </h2>
          <p className="text-gray-400 font-sans max-w-2xl mx-auto">
            Modern tools and platforms I use to build robust data ecosystems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 border-white/10 hover:border-brand-blue/30 transition-all group"
            >
              <h3 className="text-lg font-mono font-semibold text-brand-purple mb-4 group-hover:text-brand-blue transition-colors">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map(skill => (
                  <span 
                    key={skill}
                    className="px-2 py-1 bg-brand-blue/10 text-brand-blue text-[10px] border border-brand-blue/20 rounded-md font-sans uppercase tracking-wide hover:bg-brand-blue/20 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
