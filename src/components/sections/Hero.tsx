import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, Tooltip } from 'recharts';

const mockData = Array.from({ length: 20 }).map((_, i) => ({
  time: i,
  throughput: Math.floor(Math.random() * 5000) + 10000,
  latency: Math.floor(Math.random() * 50) + 10,
}));

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background abstract elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-brand-purple/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-blue/10 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col space-y-8"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block px-4 py-1.5 rounded-full glass-card text-brand-blue font-mono text-sm border-brand-blue/30"
            >
              $ echo "Hello, World" &gt; data_engineer.log
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white leading-tight">
              Amit Halder
            </h1>
            <h2 className="text-2xl lg:text-3xl font-sans text-gray-400 font-light">
              <span className="text-white font-medium">Data Engineer</span> | Python • SQL • Spark • AWS
            </h2>
          </div>

          <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
            Building scalable data platforms, real-time pipelines, and analytics systems that transform raw data into measurable business value.
          </p>

          <div className="flex flex-wrap gap-3 pt-4">
            <a href="#projects" className="px-6 py-2.5 rounded-full bg-brand-blue text-black font-bold text-[10px] uppercase tracking-wider hover:bg-brand-blue/90 transition-colors flex items-center gap-2">
              View Projects <ArrowRight className="w-3 h-3" />
            </a>
            <a href="#" className="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/20">
              <Download className="w-3 h-3" /> Resume.pdf
            </a>
            <a href="#contact" className="px-6 py-2.5 rounded-full bg-white/10 text-white font-bold text-[10px] uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center gap-2 border border-brand-purple/30 group">
              <Mail className="w-3 h-3 group-hover:text-brand-purple transition-colors" /> Contact Me
            </a>
          </div>
        </motion.div>

        {/* Right side animated dashboard */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           className="relative"
        >
          <div className="glass-card rounded-2xl p-6 border-brand-blue/20">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-sm text-gray-300">pipeline_status: ACTIVE</span>
              </div>
              <span className="font-mono text-xs text-brand-blue">us-east-1</span>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-xl p-4 bg-black/40">
                  <div className="text-xs text-gray-500 font-mono mb-1">RECORDS_PROCESSED/s</div>
                  <div className="text-2xl font-bold text-white font-mono">14,239</div>
                  <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    ↑ 12% vs last hour
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4 bg-black/40">
                  <div className="text-xs text-gray-500 font-mono mb-1">AVG_LATENCY</div>
                  <div className="text-2xl font-bold text-white font-mono">42ms</div>
                  <div className="text-xs text-brand-purple mt-1 flex items-center gap-1">
                    Optimal range
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4 bg-black/40 h-48">
                <div className="text-xs text-gray-500 font-mono mb-2">THROUGHPUT_METRICS</div>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockData}>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#00D4FF', fontFamily: 'JetBrains Mono' }}
                      labelStyle={{ display: 'none' }}
                    />
                    <Line type="monotone" dataKey="throughput" stroke="#00D4FF" strokeWidth={2} dot={false} isAnimationActive={true} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Data flow visualization */}
              <div className="pt-2">
                <div className="text-xs text-gray-500 font-mono mb-3">DATA_FLOW_TOPOLOGY</div>
                <div className="flex items-center justify-between text-xs font-mono text-gray-400 relative">
                  {/* Lines behind nodes */}
                  <div className="absolute left-4 right-4 top-1/2 h-[1px] bg-white/10 -z-10" />
                  <svg className="absolute left-4 right-4 top-1/2 -mt-[0.5px] h-1 w-[calc(100%-2rem)] -z-10" preserveAspectRatio="none">
                    <line x1="0" y1="2" x2="100%" y2="2" stroke="#00D4FF" strokeWidth="1" className="data-flow-path" opacity="0.5" />
                  </svg>
                  
                  {['API', 'Kafka', 'Spark', 'S3', 'Snowflake'].map((node, i) => (
                    <div key={node} className="flex flex-col items-center gap-2 bg-[#0A0A0A] px-2 z-10">
                      <div className={`w-8 h-8 rounded-lg glass-card flex items-center justify-center ${i === 2 || i === 4 ? 'border-brand-purple/40 ring-1 ring-brand-purple/20' : 'border-white/10'}`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                      </div>
                      <span className="text-[10px]">{node}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
