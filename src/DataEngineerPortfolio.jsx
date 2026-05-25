import { useState, useEffect, useRef, useCallback } from "react";

const TYPED_STRINGS = ["Data Engineer","Pipeline Architect","Big Data Builder","Cloud Architect","ETL Specialist"];

const SKILLS = [
  { cat: "Languages", color: "#00d9ff", bg: "rgba(0,217,255,0.08)", items: ["Python","SQL","Scala","Bash"] },
  { cat: "Processing", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", items: ["Apache Spark","PySpark","Hadoop","Pandas","Polars"] },
  { cat: "Streaming", color: "#10b981", bg: "rgba(16,185,129,0.08)", items: ["Apache Kafka","Spark Streaming","Flink","Kinesis"] },
  { cat: "Cloud", color: "#8b5cf6", bg: "rgba(139,92,246,0.08)", items: ["AWS","S3","Glue","Lambda","Redshift","EMR","GCS"] },
  { cat: "Orchestration", color: "#f43f5e", bg: "rgba(244,63,94,0.08)", items: ["Airflow","dbt","Prefect","Dagster"] },
  { cat: "Databases", color: "#06b6d4", bg: "rgba(6,182,212,0.08)", items: ["Snowflake","PostgreSQL","MongoDB","Redis","DynamoDB"] },
  { cat: "DevOps", color: "#84cc16", bg: "rgba(132,204,22,0.08)", items: ["Docker","Terraform","GitHub Actions","Kubernetes","CI/CD"] },
];

const PROJECTS = [
  {
    title: "Real-Time Ride Analytics Pipeline",
    tagline: "Sub-second event processing at 2M events/hr",
    problem: "Legacy batch system created 6-hour data lag preventing dynamic pricing decisions.",
    pipeline: ["Ride Events","Kafka Cluster","Spark Streaming","Delta Lake","Snowflake","Power BI"],
    metrics: ["2M+ events/hr","<500ms latency","99.9% uptime","60% cost reduction"],
    tech: ["Kafka","Spark Streaming","Delta Lake","Snowflake","Power BI","AWS EMR"],
    color: "#00d9ff",
  },
  {
    title: "AWS YouTube ETL Pipeline",
    tagline: "Multi-channel analytics across 50+ content channels",
    problem: "Manual CSV exports were error-prone and couldn't scale across 50+ YouTube channels.",
    pipeline: ["YouTube API","AWS Lambda","S3 Data Lake","AWS Glue","Athena","QuickSight"],
    metrics: ["50+ channels","Daily refresh","3× faster queries","Zero manual ops"],
    tech: ["AWS Glue","Lambda","S3","Athena","Airflow","CloudWatch"],
    color: "#f59e0b",
  },
  {
    title: "E-commerce Data Warehouse",
    tagline: "Single source of truth for 50M+ records",
    problem: "8 business units using conflicting metric definitions caused executive reporting chaos.",
    pipeline: ["Shopify/Stripe","Airbyte","Snowflake Raw","dbt Models","Snowflake Prod","Metabase"],
    metrics: ["50M+ records","15 dbt models","1 source of truth","4hr SLA"],
    tech: ["dbt","Snowflake","Airflow","Python","Airbyte","Metabase"],
    color: "#8b5cf6",
  },
  {
    title: "Fraud Detection Streaming",
    tagline: "95% detection accuracy with ML inference at edge",
    problem: "Rule-based system had 40% false-positive rate blocking legitimate transactions.",
    pipeline: ["Txn Events","Kafka","PySpark","Feature Store","ML Model","Alert System"],
    metrics: ["95% accuracy","<100ms inference","−40% false positives","1B+ transactions"],
    tech: ["Kafka","PySpark","MLflow","Redis","FastAPI","Grafana"],
    color: "#f43f5e",
  },
];

const TIMELINE = [
  { year:"2024", title:"Data Engineering Intern", org:"FinTech Startup", type:"work", desc:"Built AWS Glue ETL pipelines processing 500GB+ daily. Cut Snowflake query time 40% via clustering keys.", tech:["AWS Glue","Snowflake","Airflow"] },
  { year:"2024", title:"AWS Certified Data Engineer", org:"Amazon Web Services", type:"cert", desc:"Passed AWS Certified Data Engineer – Associate with score 890/1000.", tech:[] },
  { year:"2023", title:"Freelance Data Engineer", org:"Independent", type:"work", desc:"Delivered 3 end-to-end pipeline projects for e-commerce clients using dbt and Airflow.", tech:["dbt","Airflow","PostgreSQL"] },
  { year:"2023", title:"Open Source Contributor", org:"Apache Airflow", type:"oss", desc:"Merged 2 PRs: improved operator docs and fixed DAG scheduling edge case (500+ stars repo).", tech:["Python","Airflow"] },
  { year:"2022", title:"Databricks Certified Developer", org:"Databricks", type:"cert", desc:"Apache Spark 3.0 certification — PySpark optimization and Delta Lake.", tech:[] },
  { year:"2022", title:"Data Engineering Zoomcamp", org:"DataTalks.Club", type:"edu", desc:"9-week intensive covering Kafka, Spark, dbt, Airflow and the full GCP data stack.", tech:["Kafka","Spark","GCP"] },
];

const CERTS = [
  { name:"AWS Data Engineer", level:"Associate", org:"Amazon Web Services", color:"#f59e0b", abbr:"AWS" },
  { name:"Databricks Spark Dev", level:"Apache Spark 3.0", org:"Databricks", color:"#ef4444", abbr:"DBX" },
  { name:"SnowPro Core", level:"Core Certification", org:"Snowflake", color:"#06b6d4", abbr:"❄" },
  { name:"GCP Data Engineer", level:"Professional", org:"Google Cloud", color:"#10b981", abbr:"GCP" },
  { name:"Confluent Kafka", level:"Developer Certified", org:"Confluent", color:"#8b5cf6", abbr:"CFK" },
];

const BLOGS = [
  { title:"Spark Performance: From Hours to Minutes", excerpt:"Partition optimization, broadcast joins, and AQE that cut our job runtime 70%.", tags:["Spark","Performance"], date:"Dec 2024", min:"8 min" },
  { title:"Building Production Kafka Architecture", excerpt:"Consumer groups, partition strategies, and zero-downtime rebalancing at scale.", tags:["Kafka","Streaming"], date:"Nov 2024", min:"12 min" },
  { title:"dbt Modeling Patterns That Scale", excerpt:"How we served 50+ analysts with consistent, tested metrics using staging layers.", tags:["dbt","Snowflake"], date:"Oct 2024", min:"10 min" },
  { title:"Airflow DAG Design at Scale", excerpt:"TaskFlow API, dynamic tasks, and SLA monitoring from 2 years in production.", tags:["Airflow","Python"], date:"Sep 2024", min:"7 min" },
];

const ARCH_NODES = [
  { id:"src", label:"Data Sources", sub:"APIs · DBs · Streams", x:60, y:180, color:"#64748b" },
  { id:"ingest", label:"Kafka", sub:"Event Streaming", x:190, y:120, color:"#10b981" },
  { id:"batch", label:"S3 / GCS", sub:"Raw Data Lake", x:190, y:240, color:"#f59e0b" },
  { id:"proc", label:"Spark / PySpark", sub:"Distributed Processing", x:330, y:180, color:"#00d9ff" },
  { id:"orch", label:"Airflow", sub:"Orchestration", x:330, y:60, color:"#f43f5e" },
  { id:"store", label:"Snowflake / Delta", sub:"Analytics Storage", x:470, y:180, color:"#8b5cf6" },
  { id:"trans", label:"dbt", sub:"Transformations", x:470, y:60, color:"#f59e0b" },
  { id:"bi", label:"BI / APIs", sub:"Power BI · Metabase", x:600, y:180, color:"#06b6d4" },
  { id:"mon", label:"Grafana", sub:"Monitoring", x:470, y:300, color:"#84cc16" },
];

const ARCH_EDGES = [
  ["src","ingest"],["src","batch"],["ingest","proc"],["batch","proc"],
  ["orch","proc"],["proc","store"],["trans","store"],["orch","trans"],
  ["store","bi"],["proc","mon"],["store","mon"],
];

// =================== CANVAS HERO ===================
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const NUM = 55;
    const particles = Array.from({ length: NUM }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
      pulse: Math.random() * Math.PI * 2,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.25;
            const t = (Math.sin(particles[i].pulse) + 1) / 2;
            const r = Math.floor(0 + t * 0); const g = Math.floor(140 + t * 77); const b = Math.floor(200 + t * 55);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      particles.forEach(p => {
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(0,200,255,0.6)`);
        glow.addColorStop(1, `rgba(0,200,255,0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,217,255,0.8)`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.6 }} />;
}

// =================== HOOKS ===================
function useTyping(strings, speed = 80, pause = 1800) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("typing");
  const [charIdx, setCharIdx] = useState(0);
  useEffect(() => {
    const current = strings[idx];
    if (phase === "typing") {
      if (charIdx < current.length) {
        const t = setTimeout(() => { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, speed);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setPhase("deleting"), pause);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, speed / 2);
        return () => clearTimeout(t);
      } else {
        setIdx(i => (i + 1) % strings.length);
        setPhase("typing");
      }
    }
  }, [text, phase, charIdx, idx]);
  return text;
}

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

function useCounter(target, visible, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(prog * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, target]);
  return val;
}

// =================== UI PRIMITIVES ===================
function Badge({ children, color = "#00d9ff" }) {
  return (
    <span style={{
      display:"inline-block", padding:"3px 10px", borderRadius:99,
      fontSize:11, fontWeight:600, letterSpacing:"0.04em",
      background:`${color}18`, color, border:`1px solid ${color}30`,
      fontFamily:"'JetBrains Mono',monospace",
    }}>{children}</span>
  );
}

function SectionTag({ children }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
      <div style={{ width:24, height:1, background:"#00d9ff" }} />
      <span style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#00d9ff", fontWeight:600 }}>{children}</span>
    </div>
  );
}

function GradientText({ children, style = {} }) {
  return (
    <span style={{
      background:"linear-gradient(135deg, #00d9ff 0%, #8b5cf6 100%)",
      WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
      backgroundClip:"text", ...style
    }}>{children}</span>
  );
}

// =================== SECTIONS ===================

function Navbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  const links = ["About","Skills","Projects","Architecture","Experience","Blog","Contact"];
  const scroll = (id) => { document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior:"smooth" }); setOpen(false); };
  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100,
      transition:"all 0.3s ease",
      background: scrolled ? "rgba(7,7,16,0.92)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:14, color:"#00d9ff", fontWeight:700 }}>
          {"<"}<span style={{ color:"#f1f5f9" }}>Alex Chen</span>{" />"}
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {links.map(l => (
            <button key={l} onClick={() => scroll(l)}
              style={{
                background:"none", border:"none", cursor:"pointer",
                padding:"6px 14px", borderRadius:8,
                color:"#94a3b8", fontSize:13, fontWeight:500,
                transition:"all 0.2s",
              }}
              onMouseEnter={e => { e.target.style.color="#00d9ff"; e.target.style.background="rgba(0,217,255,0.08)"; }}
              onMouseLeave={e => { e.target.style.color="#94a3b8"; e.target.style.background="none"; }}
            >{l}</button>
          ))}
        </div>
        <a href="#" style={{
          padding:"8px 20px", borderRadius:99,
          background:"linear-gradient(135deg,#00d9ff,#8b5cf6)",
          color:"#fff", fontSize:13, fontWeight:600, textDecoration:"none",
          boxShadow:"0 0 20px rgba(0,217,255,0.25)",
        }}>Hire Me</a>
      </div>
    </nav>
  );
}

function Hero() {
  const typed = useTyping(TYPED_STRINGS);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);
  return (
    <section style={{
      position:"relative", minHeight:"100vh", display:"flex",
      alignItems:"center", justifyContent:"center",
      overflow:"hidden", background:"#070710",
    }}>
      <ParticleCanvas />
      {/* Grid overlay */}
      <div style={{
        position:"absolute", inset:0,
        backgroundImage:`linear-gradient(rgba(0,217,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.03) 1px, transparent 1px)`,
        backgroundSize:"60px 60px",
      }} />
      {/* Radial gradient */}
      <div style={{
        position:"absolute", inset:0,
        background:"radial-gradient(ellipse 80% 60% at 50% 50%, rgba(0,217,255,0.06) 0%, transparent 70%)",
      }} />
      <div style={{ position:"relative", zIndex:1, textAlign:"center", padding:"0 24px", maxWidth:860 }}>
        <div style={{
          display:"inline-flex", alignItems:"center", gap:8,
          background:"rgba(0,217,255,0.08)", border:"1px solid rgba(0,217,255,0.2)",
          borderRadius:99, padding:"6px 16px", marginBottom:32,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          opacity: mounted ? 1 : 0, transition:"all 0.6s ease",
        }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#00d9ff", boxShadow:"0 0 8px #00d9ff" }} />
          <span style={{ fontSize:12, color:"#00d9ff", fontWeight:600, letterSpacing:"0.1em" }}>OPEN TO OPPORTUNITIES</span>
        </div>
        <h1 style={{
          fontFamily:"'Syne',sans-serif", fontSize:"clamp(40px,7vw,80px)", fontWeight:800,
          lineHeight:1.1, marginBottom:16, color:"#f1f5f9",
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          opacity: mounted ? 1 : 0, transition:"all 0.7s ease 0.1s",
        }}>
          Alex Chen
          <br />
          <GradientText>
            {typed}<span style={{ animation:"blink 1s step-end infinite", color:"#00d9ff" }}>|</span>
          </GradientText>
        </h1>
        <p style={{
          fontSize:"clamp(16px,2.2vw,20px)", color:"#94a3b8", maxWidth:620, margin:"0 auto 40px",
          lineHeight:1.7, fontWeight:400,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          opacity: mounted ? 1 : 0, transition:"all 0.7s ease 0.2s",
        }}>
          Building <strong style={{ color:"#f1f5f9" }}>scalable data pipelines</strong> and <strong style={{ color:"#f1f5f9" }}>distributed systems</strong> that transform raw data into business intelligence. Passionate about real-time streaming, cloud architecture, and elegant ETL design.
        </p>
        <div style={{
          display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap",
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          opacity: mounted ? 1 : 0, transition:"all 0.7s ease 0.35s",
        }}>
          {[
            { label:"View Projects", primary:true, href:"#projects" },
            { label:"Download Resume", primary:false, href:"#" },
            { label:"Contact Me", primary:false, href:"#contact" },
          ].map(({ label, primary, href }) => (
            <a key={label} href={href}
              style={{
                padding:"13px 28px", borderRadius:99, fontSize:14, fontWeight:600,
                textDecoration:"none", transition:"all 0.25s",
                ...(primary ? {
                  background:"linear-gradient(135deg,#00d9ff,#8b5cf6)",
                  color:"#fff", boxShadow:"0 0 30px rgba(0,217,255,0.3)",
                } : {
                  background:"rgba(255,255,255,0.04)",
                  color:"#94a3b8",
                  border:"1px solid rgba(255,255,255,0.1)",
                })
              }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; if(!primary) e.currentTarget.style.borderColor="rgba(0,217,255,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; }}
            >{label}</a>
          ))}
        </div>
        <div style={{
          marginTop:60, display:"flex", justifyContent:"center", gap:40,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          opacity: mounted ? 1 : 0, transition:"all 0.7s ease 0.5s",
        }}>
          {[["4+","Projects Built"],["2M+","Events/sec Processed"],["3","Cloud Certifications"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontSize:28, fontWeight:800, fontFamily:"'Syne',sans-serif", color:"#f1f5f9" }}>{n}</div>
              <div style={{ fontSize:11, color:"#64748b", letterSpacing:"0.05em", marginTop:2 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{
        position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:8, color:"#475569",
      }}>
        <span style={{ fontSize:11, letterSpacing:"0.1em" }}>SCROLL</span>
        <div style={{ width:1, height:40, background:"linear-gradient(#475569, transparent)", animation:"pulse 2s ease infinite" }} />
      </div>
    </section>
  );
}

function About() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const STATS = [{ n:4, s:"+" }, { n:15, s:"+" }, { n:3, s:"" }, { n:60, s:"%" }];
  const STAT_LABELS = ["Projects Shipped","dbt Models Built","Cloud Certs","Pipeline Cost Saved"];
  const c1 = useCounter(4, visible);
  const c2 = useCounter(15, visible);
  const c3 = useCounter(3, visible);
  const c4 = useCounter(60, visible);
  const COUNTS = [c1,c2,c3,c4];

  const STRENGTHS = [
    ["Data Modeling","#00d9ff"],["ETL/ELT Pipelines","#8b5cf6"],["PySpark","#f59e0b"],
    ["Kafka Streaming","#10b981"],["Apache Airflow","#f43f5e"],["Snowflake","#06b6d4"],
    ["AWS Cloud","#8b5cf6"],["SQL Optimization","#00d9ff"],["Batch + Streaming","#84cc16"],
  ];

  return (
    <section id="about" ref={ref} style={{ padding:"100px 24px", background:"#070710" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTag>About Me</SectionTag>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <div style={{ transform: visible ? "translateX(0)" : "translateX(-40px)", opacity: visible ? 1 : 0, transition:"all 0.7s ease" }}>
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, lineHeight:1.2, marginBottom:24, color:"#f1f5f9" }}>
              I turn data chaos into<br /><GradientText>scalable systems</GradientText>
            </h2>
            <p style={{ color:"#94a3b8", lineHeight:1.8, marginBottom:16, fontSize:15 }}>
              I'm a data engineer obsessed with building robust, scalable pipelines that turn raw, noisy data into reliable business insights. My focus is on distributed computing, real-time streaming architectures, and cloud-native ETL design.
            </p>
            <p style={{ color:"#94a3b8", lineHeight:1.8, marginBottom:28, fontSize:15 }}>
              From designing Kafka topologies that handle millions of events per second to optimizing Snowflake queries that cut warehouse costs by 60%, I approach every data challenge with a systems-thinking mindset and an eye for operational excellence.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {STRENGTHS.map(([s, c]) => (
                <Badge key={s} color={c}>{s}</Badge>
              ))}
            </div>
          </div>
          <div style={{ transform: visible ? "translateX(0)" : "translateX(40px)", opacity: visible ? 1 : 0, transition:"all 0.7s ease 0.15s" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:24 }}>
              {COUNTS.map((c, i) => (
                <div key={i} style={{
                  padding:"28px 24px", borderRadius:16,
                  background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)",
                  textAlign:"center",
                }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:40, fontWeight:800, color:"#f1f5f9", lineHeight:1 }}>
                    {c}{STATS[i].s}
                  </div>
                  <div style={{ fontSize:12, color:"#64748b", marginTop:8, letterSpacing:"0.04em" }}>{STAT_LABELS[i]}</div>
                </div>
              ))}
            </div>
            <div style={{
              padding:20, borderRadius:14,
              background:"rgba(0,217,255,0.05)", border:"1px solid rgba(0,217,255,0.15)",
              fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#94a3b8",
            }}>
              <div style={{ color:"#475569", marginBottom:8 }}>{"// Current stack"}</div>
              <div><span style={{ color:"#00d9ff" }}>const</span> <span style={{ color:"#f1f5f9" }}>stack</span> <span style={{ color:"#94a3b8" }}>=</span> {"{"}</div>
              <div style={{ paddingLeft:16 }}><span style={{ color:"#8b5cf6" }}>orchestration</span>: <span style={{ color:"#10b981" }}>"Airflow + dbt"</span>,</div>
              <div style={{ paddingLeft:16 }}><span style={{ color:"#8b5cf6" }}>processing</span>: <span style={{ color:"#10b981" }}>"PySpark + Kafka"</span>,</div>
              <div style={{ paddingLeft:16 }}><span style={{ color:"#8b5cf6" }}>warehouse</span>: <span style={{ color:"#10b981" }}>"Snowflake"</span>,</div>
              <div style={{ paddingLeft:16 }}><span style={{ color:"#8b5cf6" }}>cloud</span>: <span style={{ color:"#10b981" }}>"AWS"</span>,</div>
              {"}"};
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const [hovered, setHovered] = useState(null);
  return (
    <section id="skills" ref={ref} style={{ padding:"100px 24px", background:"#050508" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTag>Technical Skills</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:48 }}>
          The <GradientText>engineering toolkit</GradientText>
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:20 }}>
          {SKILLS.map((cat, i) => (
            <div key={cat.cat}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding:24, borderRadius:16,
                background: hovered === i ? cat.bg : "rgba(255,255,255,0.02)",
                border:`1px solid ${hovered === i ? cat.color + "40" : "rgba(255,255,255,0.07)"}`,
                transition:"all 0.3s ease",
                transform: visible ? "translateY(0)" : "translateY(30px)",
                opacity: visible ? 1 : 0,
                transitionDelay:`${i * 0.06}s`,
                cursor:"default",
              }}>
              <div style={{ marginBottom:14 }}>
                <div style={{ fontSize:10, letterSpacing:"0.12em", color: cat.color, fontWeight:700, marginBottom:6 }}>{cat.cat.toUpperCase()}</div>
                <div style={{ width:32, height:2, background:`linear-gradient(90deg,${cat.color},transparent)`, borderRadius:1 }} />
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {cat.items.map(sk => (
                  <span key={sk} style={{
                    padding:"4px 10px", borderRadius:6,
                    background:`${cat.color}12`, color: cat.color,
                    fontSize:12, fontWeight:500, fontFamily:"'JetBrains Mono',monospace",
                    border:`1px solid ${cat.color}20`,
                  }}>{sk}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const [expanded, setExpanded] = useState(null);
  return (
    <section id="projects" ref={ref} style={{ padding:"100px 24px", background:"#070710" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <SectionTag>Featured Projects</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:52 }}>
          Enterprise-grade <GradientText>pipelines</GradientText>
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(520px,1fr))", gap:24 }}>
          {PROJECTS.map((p, i) => (
            <div key={p.title}
              style={{
                borderRadius:20, overflow:"hidden",
                background:"rgba(255,255,255,0.02)",
                border:`1px solid rgba(255,255,255,0.07)`,
                transition:"all 0.3s ease",
                transform: visible ? "translateY(0)" : "translateY(40px)",
                opacity: visible ? 1 : 0,
                transitionDelay:`${i * 0.1}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=p.color+"40"; e.currentTarget.style.transform="translateY(-4px)"; e.currentTarget.style.boxShadow=`0 20px 60px ${p.color}15`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}
            >
              {/* Top accent */}
              <div style={{ height:3, background:`linear-gradient(90deg,${p.color},${p.color}00)` }} />
              <div style={{ padding:28 }}>
                {/* Header */}
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:11, color:p.color, fontWeight:700, letterSpacing:"0.1em", marginBottom:6 }}>DATA PIPELINE</div>
                    <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#f1f5f9", lineHeight:1.3 }}>{p.title}</h3>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <a href="#" style={{ width:32, height:32, borderRadius:8, background:"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", color:"#94a3b8", fontSize:14, transition:"all 0.2s" }}
                      onMouseEnter={e => { e.currentTarget.style.background=p.color+"20"; e.currentTarget.style.color=p.color; }}
                      onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="#94a3b8"; }}
                    >↗</a>
                  </div>
                </div>
                <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6, marginBottom:16 }}>{p.tagline}</p>

                {/* Pipeline flow */}
                <div style={{
                  padding:16, borderRadius:12, marginBottom:16,
                  background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.05)",
                  overflowX:"auto",
                }}>
                  <div style={{ fontSize:10, color:"#475569", marginBottom:10, letterSpacing:"0.1em" }}>PIPELINE FLOW</div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                    {p.pipeline.map((step, si) => (
                      <div key={si} style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <span style={{
                          padding:"4px 10px", borderRadius:6, fontSize:11, fontWeight:600,
                          fontFamily:"'JetBrains Mono',monospace",
                          background:`${p.color}15`, color:p.color,
                          border:`1px solid ${p.color}25`, whiteSpace:"nowrap",
                        }}>{step}</span>
                        {si < p.pipeline.length - 1 && (
                          <span style={{ color: p.color, fontSize:12, opacity:0.5 }}>→</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, marginBottom:16 }}>
                  {p.metrics.map(m => (
                    <div key={m} style={{
                      padding:"8px 6px", textAlign:"center", borderRadius:8,
                      background:`${p.color}08`, border:`1px solid ${p.color}18`,
                    }}>
                      <div style={{ fontSize:11, fontWeight:700, color:p.color, fontFamily:"'JetBrains Mono',monospace", lineHeight:1.2 }}>{m}</div>
                    </div>
                  ))}
                </div>

                {/* Tech stack */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {p.tech.map(t => <Badge key={t} color="#475569">{t}</Badge>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const [animated, setAnimated] = useState(false);
  useEffect(() => { if (visible) setTimeout(() => setAnimated(true), 300); }, [visible]);

  const getNode = (id) => ARCH_NODES.find(n => n.id === id);

  return (
    <section id="architecture" ref={ref} style={{ padding:"100px 24px", background:"#050508" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTag>Architecture</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:16 }}>
          System <GradientText>architecture showcase</GradientText>
        </h2>
        <p style={{ color:"#64748b", fontSize:14, marginBottom:48 }}>Interactive data engineering reference architecture with animated flow visualization</p>
        <div style={{
          borderRadius:20, padding:32,
          background:"rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.07)",
          transform: visible ? "translateY(0)" : "translateY(30px)",
          opacity: visible ? 1 : 0, transition:"all 0.7s ease",
        }}>
          <svg viewBox="0 0 680 360" style={{ width:"100%", height:"auto" }}>
            <defs>
              <marker id="arrowBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="rgba(0,217,255,0.6)" />
              </marker>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Animated edges */}
            {ARCH_EDGES.map(([from, to], i) => {
              const a = getNode(from); const b = getNode(to);
              if (!a || !b) return null;
              const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
              return (
                <line key={`${from}-${to}`}
                  x1={a.x + 35} y1={a.y + 20} x2={b.x + 35} y2={b.y + 20}
                  stroke="rgba(0,217,255,0.35)" strokeWidth="1.5"
                  strokeDasharray="6 4"
                  markerEnd="url(#arrowBlue)"
                  style={{
                    strokeDashoffset: animated ? 0 : len * 2,
                    transition: `stroke-dashoffset ${1.2 + i * 0.15}s ease`,
                  }}
                />
              );
            })}

            {/* Nodes */}
            {ARCH_NODES.map((node, i) => (
              <g key={node.id}
                style={{
                  transform: animated ? "scale(1)" : "scale(0.8)",
                  transformOrigin:`${node.x + 35}px ${node.y + 20}px`,
                  transition: `all 0.5s ease ${i * 0.08}s`,
                  opacity: animated ? 1 : 0,
                }}
              >
                <rect x={node.x} y={node.y - 10} width={90} height={44}
                  rx="8" fill={`${node.color}18`} stroke={`${node.color}50`} strokeWidth="1"
                />
                <text x={node.x + 45} y={node.y + 7} textAnchor="middle"
                  fill={node.color} fontSize="10" fontWeight="700" fontFamily="'JetBrains Mono',monospace">
                  {node.label}
                </text>
                <text x={node.x + 45} y={node.y + 20} textAnchor="middle"
                  fill="#475569" fontSize="8.5" fontFamily="sans-serif">
                  {node.sub}
                </text>
              </g>
            ))}
          </svg>

          {/* Legend */}
          <div style={{ display:"flex", gap:24, marginTop:20, flexWrap:"wrap" }}>
            {[["Sources","#64748b"],["Streaming","#10b981"],["Processing","#00d9ff"],["Storage","#8b5cf6"],["Serving","#06b6d4"],["Monitoring","#84cc16"]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:8, height:8, borderRadius:2, background:c }} />
                <span style={{ fontSize:11, color:"#64748b" }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const TYPE_STYLES = {
    work: { color:"#00d9ff", label:"Work" },
    cert: { color:"#f59e0b", label:"Cert" },
    freelance: { color:"#8b5cf6", label:"Freelance" },
    oss: { color:"#10b981", label:"Open Source" },
    edu: { color:"#f43f5e", label:"Education" },
  };
  return (
    <section id="experience" ref={ref} style={{ padding:"100px 24px", background:"#070710" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <SectionTag>Experience</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:52 }}>
          The <GradientText>journey so far</GradientText>
        </h2>
        <div style={{ position:"relative" }}>
          <div style={{ position:"absolute", left:16, top:0, bottom:0, width:1, background:"linear-gradient(#00d9ff, #8b5cf6, transparent)" }} />
          {TIMELINE.map((item, i) => {
            const ts = TYPE_STYLES[item.type] || TYPE_STYLES.work;
            return (
              <div key={i} style={{
                paddingLeft:48, marginBottom:40, position:"relative",
                transform: visible ? "translateX(0)" : "translateX(-30px)",
                opacity: visible ? 1 : 0, transition:`all 0.6s ease ${i * 0.1}s`,
              }}>
                <div style={{
                  position:"absolute", left:9, top:4, width:16, height:16,
                  borderRadius:"50%", background:"#070710",
                  border:`2px solid ${ts.color}`,
                  boxShadow:`0 0 10px ${ts.color}60`,
                }} />
                <div style={{
                  padding:20, borderRadius:14,
                  background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
                  transition:"border-color 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=ts.color+"30"}
                  onMouseLeave={e => e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"}
                >
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                    <div>
                      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#f1f5f9" }}>{item.title}</h3>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{item.org}</div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <Badge color={ts.color}>{ts.label}</Badge>
                      <span style={{ fontSize:12, color:"#475569", fontFamily:"'JetBrains Mono',monospace" }}>{item.year}</span>
                    </div>
                  </div>
                  <p style={{ fontSize:13, color:"#94a3b8", lineHeight:1.6, marginBottom: item.tech.length ? 10 : 0 }}>{item.desc}</p>
                  {item.tech.length > 0 && (
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {item.tech.map(t => <Badge key={t} color={ts.color}>{t}</Badge>)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <section id="certifications" style={{ padding:"100px 24px", background:"#050508" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }} ref={ref}>
        <SectionTag>Certifications</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:48 }}>
          Cloud <GradientText>credentials</GradientText>
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:16 }}>
          {CERTS.map((c, i) => (
            <div key={c.name}
              style={{
                padding:24, borderRadius:16, textAlign:"center",
                background:"rgba(255,255,255,0.02)", border:`1px solid rgba(255,255,255,0.07)`,
                transform: visible ? "translateY(0)" : "translateY(30px)",
                opacity: visible ? 1 : 0, transition:`all 0.5s ease ${i*0.1}s`,
                cursor:"default",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=c.color+"40"; e.currentTarget.style.background=c.color+"08"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
            >
              <div style={{
                width:52, height:52, borderRadius:14, margin:"0 auto 16px",
                background:`${c.color}18`, border:`1px solid ${c.color}30`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:16, fontWeight:800, color:c.color, fontFamily:"'JetBrains Mono',monospace",
              }}>{c.abbr}</div>
              <div style={{ fontSize:13, fontWeight:700, color:"#f1f5f9", lineHeight:1.3, marginBottom:6 }}>{c.name}</div>
              <div style={{ fontSize:11, color:c.color, marginBottom:4 }}>{c.level}</div>
              <div style={{ fontSize:11, color:"#475569" }}>{c.org}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GithubStats() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const weeks = 52; const days = 7;
  const grid = Array.from({ length: weeks }, (_, wi) =>
    Array.from({ length: days }, (_, di) => {
      const r = Math.random();
      const recency = wi / weeks;
      const val = r < 0.35 ? 0 : r < 0.55 ? 1 : r < 0.72 ? 2 : r < 0.87 ? 3 : 4;
      return val * (0.4 + recency * 0.6) > 1.5 ? Math.round(val * (0.4 + recency * 0.6)) : val;
    })
  );
  const COLORS = ["#0d1117","#0e4429","#006d32","#26a641","#39d353"];

  return (
    <section id="github" ref={ref} style={{ padding:"100px 24px", background:"#070710" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTag>Activity</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:48 }}>
          GitHub <GradientText>& LeetCode stats</GradientText>
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Contribution graph */}
          <div style={{
            gridColumn:"1/-1", padding:28, borderRadius:16,
            background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
            transform: visible ? "translateY(0)" : "translateY(20px)", opacity: visible ? 1 : 0, transition:"all 0.6s ease",
          }}>
            <div style={{ fontSize:13, color:"#94a3b8", marginBottom:16, fontWeight:600 }}>alexchen · 847 contributions in the last year</div>
            <div style={{ display:"flex", gap:3, overflowX:"auto", paddingBottom:4 }}>
              {grid.map((week, wi) => (
                <div key={wi} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                  {week.map((val, di) => (
                    <div key={di} style={{
                      width:11, height:11, borderRadius:2,
                      background: COLORS[Math.min(val, 4)],
                      border:"1px solid rgba(255,255,255,0.05)",
                    }} title={`${val} contributions`} />
                  ))}
                </div>
              ))}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:12 }}>
              <span style={{ fontSize:11, color:"#475569" }}>Less</span>
              {COLORS.map((c,i) => <div key={i} style={{ width:11, height:11, borderRadius:2, background:c, border:"1px solid rgba(255,255,255,0.05)" }} />)}
              <span style={{ fontSize:11, color:"#475569" }}>More</span>
            </div>
          </div>

          {/* GitHub Stats */}
          {[
            { label:"Total Stars Earned", val:"128", icon:"⭐", color:"#f59e0b" },
            { label:"Total Commits (2024)", val:"347", icon:"📦", color:"#00d9ff" },
            { label:"Pull Requests", val:"42", icon:"🔀", color:"#8b5cf6" },
            { label:"Issues Opened", val:"19", icon:"🐛", color:"#10b981" },
          ].map(({ label, val, icon, color }, i) => (
            <div key={label} style={{
              padding:24, borderRadius:14,
              background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
              transform: visible ? "translateY(0)" : "translateY(20px)",
              opacity: visible ? 1 : 0, transition:`all 0.6s ease ${0.1+i*0.1}s`,
              display:"flex", alignItems:"center", gap:16,
            }}>
              <div style={{ width:44, height:44, borderRadius:12, background:`${color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
              <div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:28, fontWeight:800, color:"#f1f5f9" }}>{val}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>{label}</div>
              </div>
            </div>
          ))}

          {/* LeetCode */}
          <div style={{
            gridColumn:"1/-1", padding:28, borderRadius:16,
            background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
            transform: visible ? "translateY(0)" : "translateY(20px)", opacity: visible ? 1 : 0, transition:"all 0.6s ease 0.5s",
          }}>
            <div style={{ fontSize:13, color:"#94a3b8", marginBottom:20, fontWeight:600 }}>🔢 LeetCode Problem Solving</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {[{ level:"Easy", solved:124, total:800, color:"#10b981" },{ level:"Medium", solved:68, total:1700, color:"#f59e0b" },{ level:"Hard", solved:14, total:700, color:"#f43f5e" }].map(({ level, solved, total, color }) => (
                <div key={level}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8 }}>
                    <span style={{ fontSize:12, color, fontWeight:700 }}>{level}</span>
                    <span style={{ fontSize:12, color:"#94a3b8" }}>{solved}/{total}</span>
                  </div>
                  <div style={{ height:6, borderRadius:3, background:"rgba(255,255,255,0.05)" }}>
                    <div style={{ height:"100%", borderRadius:3, background:`linear-gradient(90deg,${color},${color}80)`, width:`${(solved/total*100).toFixed(1)}%`, transition:"width 1s ease" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Blog() {
  const ref = useRef(null);
  const visible = useInView(ref);
  return (
    <section id="blog" ref={ref} style={{ padding:"100px 24px", background:"#050508" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <SectionTag>Writing</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:48 }}>
          Technical <GradientText>deep dives</GradientText>
        </h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
          {BLOGS.map((b, i) => (
            <div key={b.title}
              style={{
                padding:24, borderRadius:16,
                background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)",
                cursor:"pointer", transition:"all 0.3s",
                transform: visible ? "translateY(0)" : "translateY(30px)",
                opacity: visible ? 1 : 0, transitionDelay:`${i*0.1}s`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,217,255,0.25)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.07)"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <div style={{ display:"flex", gap:6, marginBottom:14, flexWrap:"wrap" }}>
                {b.tags.map(t => <Badge key={t} color="#00d9ff">{t}</Badge>)}
              </div>
              <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#f1f5f9", lineHeight:1.4, marginBottom:10 }}>{b.title}</h3>
              <p style={{ fontSize:13, color:"#64748b", lineHeight:1.6, marginBottom:16 }}>{b.excerpt}</p>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:11, color:"#475569" }}>{b.date}</span>
                <span style={{ fontSize:11, color:"#475569" }}>📖 {b.min} read</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const ref = useRef(null);
  const visible = useInView(ref);
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => { e.preventDefault(); setSent(true); };
  const inputStyle = {
    width:"100%", padding:"12px 16px", borderRadius:10,
    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
    color:"#f1f5f9", fontSize:14, outline:"none", fontFamily:"inherit",
    transition:"border-color 0.2s",
  };
  return (
    <section id="contact" ref={ref} style={{ padding:"100px 24px", background:"#070710" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>
        <SectionTag>Contact</SectionTag>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:800, color:"#f1f5f9", marginBottom:16 }}>
          Let's build something <GradientText>great</GradientText>
        </h2>
        <p style={{ color:"#64748b", marginBottom:44, fontSize:15 }}>Open to full-time data engineering roles, freelance pipeline projects, and technical discussions.</p>
        <div style={{
          padding:36, borderRadius:20,
          background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.08)",
          transform: visible ? "translateY(0)" : "translateY(30px)", opacity: visible ? 1 : 0, transition:"all 0.7s ease",
        }}>
          {sent ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:"#f1f5f9", marginBottom:8 }}>Message sent!</div>
              <div style={{ color:"#64748b" }}>I'll get back to you within 24 hours.</div>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <input name="name" value={form.name} onChange={handle} placeholder="Your name" required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor="rgba(0,217,255,0.4)"}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"}
                />
                <input name="email" type="email" value={form.email} onChange={handle} placeholder="your@email.com" required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor="rgba(0,217,255,0.4)"}
                  onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"}
                />
              </div>
              <textarea name="message" value={form.message} onChange={handle} placeholder="Tell me about your project or role..." required rows={5}
                style={{ ...inputStyle, resize:"vertical", lineHeight:1.6 }}
                onFocus={e => e.target.style.borderColor="rgba(0,217,255,0.4)"}
                onBlur={e => e.target.style.borderColor="rgba(255,255,255,0.1)"}
              />
              <button type="submit" style={{
                padding:"13px 32px", borderRadius:99,
                background:"linear-gradient(135deg,#00d9ff,#8b5cf6)",
                color:"#fff", fontSize:14, fontWeight:700, border:"none", cursor:"pointer",
                boxShadow:"0 0 30px rgba(0,217,255,0.25)", transition:"all 0.25s",
              }}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.02)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >Send Message →</button>
            </form>
          )}
          {/* Socials */}
          <div style={{ display:"flex", gap:12, marginTop:28, paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.07)" }}>
            {[
              { label:"GitHub", href:"https://github.com", color:"#f1f5f9" },
              { label:"LinkedIn", href:"https://linkedin.com", color:"#0077b5" },
              { label:"Twitter/X", href:"https://x.com", color:"#94a3b8" },
            ].map(({ label, href, color }) => (
              <a key={label} href={href} style={{
                padding:"8px 18px", borderRadius:8, fontSize:13, fontWeight:600, textDecoration:"none",
                color, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)",
                transition:"all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=color+"60"; e.currentTarget.style.background=color+"12"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.background="rgba(255,255,255,0.04)"; }}
              >{label}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      padding:"32px 24px", borderTop:"1px solid rgba(255,255,255,0.06)",
      background:"#050508",
    }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
        <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:13, color:"#475569" }}>
          {"<"}<span style={{ color:"#00d9ff" }}>Alex Chen</span>{" />"} · Data Engineer
        </div>
        <div style={{ fontSize:12, color:"#334155" }}>
          Built with React · TypeScript · Tailwind CSS · Framer Motion
        </div>
        <div style={{ fontSize:12, color:"#334155" }}>© {new Date().getFullYear()} All rights reserved</div>
      </div>
    </footer>
  );
}

// =================== GLOBAL STYLES ===================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'DM Sans', system-ui, sans-serif; background: #070710; color: #f1f5f9; -webkit-font-smoothing: antialiased; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #070710; }
  ::-webkit-scrollbar-thumb { background: rgba(0,217,255,0.3); border-radius: 2px; }
  @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
  @keyframes pulse { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
`;

export default function Portfolio() {
  return (
    <div style={{ background:"#070710", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{STYLES}</style>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Architecture />
      <Experience />
      <Certifications />
      <GithubStats />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}
