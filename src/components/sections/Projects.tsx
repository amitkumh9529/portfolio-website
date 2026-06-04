import React from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, FileText, Database, Activity, Zap } from 'lucide-react';

const projects = [
  {
    title: "Real-Time E-Commerce Analytics Pipeline",
    problem: "Business lacked real-time visibility into customer purchases, causing delayed inventory and marketing decisions.",
    solution: "Built a robust streaming architecture utilizing Kafka for message ingestion, Spark Streaming for micro-batch transformation, and Snowflake for analytical querying.",
    impact: "Reduced reporting latency from 24 hours to under 5 minutes, enabling dynamic pricing and intra-day inventory adjustments.",
    architecture: "API → Kafka → Spark Streaming → Snowflake",
    techStack: ["Python", "Kafka", "Apache Spark", "Snowflake", "AWS"],
    metrics: ["5ms event latency", "Millions of daily events", "99.9% Pipeline Uptime"],
    github: "#",
    demo: "#",
    docs: "#"
  },
  {
    title: "CDC Data Lakehouse Platform",
    problem: "Data synchronization between varied operational systems (PostgreSQL, MongoDB) and the central analytics warehouse was manual and error-prone.",
    solution: "Implemented a Change Data Capture (CDC) pipeline orchestrated by Airflow. Captured raw changes into S3 directly into a Lakehouse architecture handled by Snowflake.",
    impact: "Enabled near real-time analytics across business domains, completely replacing manual ETL extraction scripts and resolving data staleness.",
    architecture: "PostgreSQL (WAL) → CDC Layer → S3 → Airflow → Snowflake",
    techStack: ["SQL", "Airflow", "AWS S3", "Snowflake", "dbt"],
    metrics: ["100+ Tables Synced", "Zero-downtime migrations", "Fully automated"],
    github: "#",
    demo: "#",
    docs: "#"
  },
  {
    title: "Customer 360 Data Platform",
    problem: "Customer data was deeply siloed across multiple CRMs, resulting in conflicting reporting metrics and duplicated entities.",
    solution: "Engineered a centralized Master Data Management platform. Built PySpark jobs to ingest, deduplicate, and perform identity resolution from diverse data sources.",
    impact: "Provided a single source of truth for analytics teams, improving cross-selling conversion rates by surfacing integrated customer behavior insights.",
    architecture: "Multiple Sources → Spark (Entity Resolution) → Delta Lake → Analytics",
    techStack: ["PySpark", "Databricks", "Delta Lake", "Python", "SQL"],
    metrics: ["3 sources integrated", "Identity resolution algo", "Unified Schema"],
    github: "#",
    demo: "#",
    docs: "#"
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mb-16"
        >
          <div className="flex items-center gap-3 mb-4">
            <Database className="w-6 h-6 text-brand-blue" />
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              Featured Data Platforms
            </h2>
          </div>
          <p className="text-gray-400 font-sans max-w-2xl">
            A selection of production-grade architectures and ETL pipelines I have designed to solve complex business problems.
          </p>
        </motion.div>

        <div className="space-y-16">
           {projects.map((project, idx) => (
             <motion.div
               key={project.title}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 lg:p-10 relative group overflow-hidden"
             >
               {/* Hover gradient effect inside border */}
               <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 to-brand-purple/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
               
               <div className="relative z-10">
                 <div className="grid lg:grid-cols-3 gap-10">
                   
                   {/* Left Col: Titles & Links */}
                   <div className="lg:col-span-1 space-y-6">
                     <span className="px-3 py-1 rounded-full bg-brand-purple/20 text-brand-purple text-[10px] font-bold uppercase inline-block">Featured Production System</span>
                     <h3 className="text-2xl font-bold font-display text-white">
                       {project.title}
                     </h3>
                     
                     <div className="flex flex-wrap gap-2">
                       {project.techStack.map(tech => (
                         <span key={tech} className="px-2.5 py-1 text-xs font-mono bg-white/5 border border-white/10 rounded-md text-brand-blue">
                           {tech}
                         </span>
                       ))}
                     </div>
                     
                     <div className="pt-4 flex flex-col gap-3">
                       <a href={project.github} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
                         <Github className="w-4 h-4" /> View Repository
                       </a>
                       <a href={project.demo} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
                         <ExternalLink className="w-4 h-4" /> Live Demo
                       </a>
                       <a href={project.docs} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors w-fit">
                         <FileText className="w-4 h-4" /> Read Architecture Docs
                       </a>
                     </div>
                   </div>

                   {/* Right Col: Details */}
                   <div className="lg:col-span-2 space-y-8">
                     <div className="space-y-6">
                       <div>
                         <h4 className="text-sm font-mono text-gray-500 mb-2 flex items-center gap-2 uppercase">
                           <Activity className="w-4 h-4 text-orange-400" /> Business Problem
                         </h4>
                         <p className="text-gray-300 font-sans">{project.problem}</p>
                       </div>
                       <div>
                         <h4 className="text-sm font-mono text-gray-500 mb-2 flex items-center gap-2 uppercase">
                           <Zap className="w-4 h-4 text-brand-blue" /> Engineering Solution
                         </h4>
                         <p className="text-gray-300 font-sans">{project.solution}</p>
                       </div>
                       <div>
                         <h4 className="text-sm font-mono text-gray-500 mb-2 flex items-center gap-2 uppercase whitespace-nowrap">
                           Impact & Metrics
                         </h4>
                         <div className="p-4 bg-brand-blue/5 border border-brand-blue/10 rounded-xl">
                            <p className="text-white font-sans font-medium mb-3">{project.impact}</p>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {project.metrics.map(metric => (
                                <div key={metric} className="flex items-center gap-2 text-xs font-mono text-gray-400">
                                  <div className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                                  {metric}
                                </div>
                              ))}
                            </div>
                         </div>
                       </div>
                     </div>
                     
                     <div className="pt-4 border-t border-white/10 text-center">
                       <code className="text-xs font-mono text-gray-500 block">System Topology:</code>
                       <div className="text-sm font-mono text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mt-2">
                         {project.architecture}
                       </div>
                     </div>
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
