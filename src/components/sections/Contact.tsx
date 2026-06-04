import React from 'react';
import { Mail, Github, Linkedin, FileTerminal } from 'lucide-react';
import { motion } from 'motion/react';

export function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 lg:p-12 border-brand-purple/20 relative"
        >
          {/* Abstract glow inside */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 rounded-full blur-[80px]" />
          
          <div className="text-center mb-10 relative z-10">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
              Initialize Connection
            </h2>
            <p className="text-gray-400 font-sans">
              Currently open to new opportunities. Let's discuss data infrastructure.
            </p>
          </div>

          <form className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">System Identity (Name)</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 transition-colors font-sans" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">Return Address (Email)</label>
                <input type="email" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-blue/50 transition-colors font-sans" placeholder="john@company.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-mono text-gray-500 uppercase">Payload (Message)</label>
              <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple/50 transition-colors font-sans resize-none" placeholder="We are looking for a Data Engineer..."></textarea>
            </div>

            <button type="button" className="w-full py-4 bg-brand-blue text-black hover:bg-brand-blue/90 transition-colors rounded-xl font-bold font-sans flex items-center justify-center gap-2 uppercase tracking-wide text-xs">
              <FileTerminal className="w-4 h-4" /> Execute send_message()
            </button>
          </form>

          <div className="pt-10 mt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
             <a href="#" className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                 <Mail className="w-4 h-4" />
               </div>
               <span className="text-xs font-mono">Email</span>
             </a>
             <a href="#" className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                 <Linkedin className="w-4 h-4" />
               </div>
               <span className="text-xs font-mono">LinkedIn</span>
             </a>
             <a href="#" className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                 <Github className="w-4 h-4" />
               </div>
               <span className="text-xs font-mono">GitHub</span>
             </a>
             <a href="#" className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-brand-blue">
                 <FileTerminal className="w-4 h-4" />
               </div>
               <span className="text-xs font-mono">Resume.pdf</span>
             </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
