/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { Metrics } from './components/sections/Metrics';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Architectures } from './components/sections/Architectures';
import { Timeline } from './components/sections/Timeline';
import { Certifications } from './components/sections/Certifications';
import { GithubShowcase } from './components/sections/GithubShowcase';
import { Recruiter } from './components/sections/Recruiter';
import { Contact } from './components/sections/Contact';

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Metrics />
      <About />
      <Skills />
      <Projects />
      <Architectures />
      <Timeline />
      <Certifications />
      <GithubShowcase />
      <Recruiter />
      <Contact />
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center">
        <p className="text-xs font-mono text-gray-600">
          © {new Date().getFullYear()} Amit Halder. Data Engineer.
        </p>
      </footer>
    </div>
  );
}
