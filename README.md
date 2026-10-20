# Amit Halder | Senior Data Engineer Portfolio

A modern, high-performance personal portfolio website for **Amit Halder**, Senior Data Engineer. Featuring responsive frosted glassmorphism aesthetics and an interactive **300-frame scroll-driven canvas background animation** that scrubs smoothly with inertial physics.

![Portfolio Preview](679ef4554f2f0f691fb8c0f1dd1a65ba.jpg)

---

## 🌟 Key Features

- **Smooth Scroll-Driven Background Animation**:
  - 300 high-resolution frames rendered onto an HTML5 `<canvas>`.
  - Linear Interpolation (LERP) physics engine for fluid momentum scrubbing across wheel, trackpad, and touch events.
  - Nearest-frame fallback to prevent blank flashes.
  - Automatic `object-fit: cover` scaling with High-DPI / Retina display support.
- **Modern Glassmorphic UI**:
  - Dark crimson & obsidian palette tailored to match the photographic backdrop.
  - Frosted glass cards (`backdrop-filter: blur()`) with subtle glow borders and hover elevation.
- **Complete Data Engineering Showcase**:
  - **Hero Section**: Pulsing role badge, bold headline, dual CTAs, tech stack badges, and a floating interactive PySpark streaming code card.
  - **About Me**: Narrative bio paired with a **2×2 glowing stats matrix** (Years Experience, Pipelines Deployed, Happy Clients, Data SLA & Uptime).
  - **Technologies I Master (Skills)**: 9 core competencies with animated progress bars (PySpark, SQL, Kafka, Snowflake, Airflow, dbt, AWS, Docker, Git).
  - **Featured Projects**: Interactive architecture mockups and diagrams for Streaming Ingestion, Lakehouse Migration, and ML Feature Store.
  - **Social & Contact**: Testimonial quote card, direct email/phone links, and social profile buttons.

---

## 🚀 Running Locally

You can run the portfolio locally using any static web server:

### Option 1: Python HTTP Server (Built-in)
```bash
# Navigate to project directory
cd portfolio

# Start server on port 8000
python -m http.server 8000
```
Then open your browser and navigate to:
👉 `http://localhost:8000/`

### Option 2: Node.js (npx serve)
```bash
npx serve .
```

---

## 📁 Project Structure

```
portfolio/
├── ezgif-8a5442510b989641-jpg/   # 300 sequential animation frames (frame_0001.jpg to frame_0300.jpg)
├── index.html                    # Semantic HTML5 layout and SVG icons
├── style.css                     # Glassmorphic design system and responsive styles
├── script.js                     # Canvas frame renderer, preloader, and LERP scroll loop
├── 679ef4554f2f0f691fb8c0f1dd1a65ba.jpg # Design reference preview
├── .gitignore                    # Git ignore rules
└── README.md                     # Documentation
```

---

## 📜 License
© 2026 Amit Halder. All rights reserved.
