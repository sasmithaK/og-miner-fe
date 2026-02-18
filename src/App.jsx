import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { width: 100%; height: 100%; overflow: hidden; }

  :root {
    --bg-void:#04040a;--bg-deep:#07070f;--bg-card:#0f0f1c;--bg-elevated:#141424;--bg-hover:#191928;
    --border-faint:rgba(255,255,255,0.04);--border-subtle:rgba(255,255,255,0.07);--border-dim:rgba(255,255,255,0.11);--border-active:rgba(255,255,255,0.2);
    --green:#00ff88;--green-dim:#008844;--green-glow:rgba(0,255,136,0.18);--green-trace:rgba(0,255,136,0.06);
    --purple:#8b5cf6;--purple-dim:#6d28d9;--purple-glow:rgba(139,92,246,0.2);
    --cyan:#06b6d4;--cyan-glow:rgba(6,182,212,0.2);
    --red:#ff4060;--red-mid:#cc3050;--red-glow:rgba(255,64,96,0.15);
    --amber:#ffaa00;--amber-glow:rgba(255,170,0,0.13);
    --blue:#4da6ff;--blue-glow:rgba(77,166,255,0.13);
    --text-bright:#eeeeff;--text-main:#b0b0d0;--text-dim:#6a6a90;--text-faint:#3a3a58;--text-green:#a0ffcc;
    --sidebar-w:260px;--font-ui:'Space Grotesk',sans-serif;--font-mono:'JetBrains Mono',monospace;
  }
  [data-theme="light"] {
    --bg-void:#f8f9fc;--bg-deep:#ffffff;--bg-card:#f3f4f8;--bg-elevated:#e8eaf0;--bg-hover:#dfe2eb;
    --border-faint:rgba(0,0,0,0.06);--border-subtle:rgba(0,0,0,0.1);--border-dim:rgba(0,0,0,0.15);--border-active:rgba(0,0,0,0.25);
    --green:#00b35c;--green-dim:#008844;--green-glow:rgba(0,179,92,0.15);--green-trace:rgba(0,179,92,0.05);
    --purple:#7c3aed;--purple-dim:#6d28d9;--purple-glow:rgba(124,58,237,0.15);
    --cyan:#0891b2;--cyan-glow:rgba(8,145,178,0.15);
    --red:#dc2626;--red-mid:#b91c1c;--red-glow:rgba(220,38,38,0.12);
    --amber:#d97706;--amber-glow:rgba(217,119,6,0.12);
    --blue:#2563eb;--blue-glow:rgba(37,99,235,0.12);
    --text-bright:#0f172a;--text-main:#334155;--text-dim:#64748b;--text-faint:#94a3b8;--text-green:#059669;
  }

  ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:var(--bg-elevated);border-radius:4px}
  ::-webkit-scrollbar-thumb:hover{background:var(--green-dim)}

  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes blink{50%{opacity:0}}

  .shell{display:flex;width:100vw;height:100vh;background:var(--bg-void);color:var(--text-main);font-family:var(--font-ui);overflow:hidden;transition:background .3s,color .3s}

  /* THEME TOGGLE */
  .theme-toggle{position:fixed;top:20px;right:20px;z-index:10000;width:46px;height:46px;border-radius:50%;background:var(--bg-card);border:1px solid var(--border-dim);display:flex;align-items:center;justify-content:center;font-size:1.2rem;transition:border-color .25s,box-shadow .25s;box-shadow:0 4px 16px rgba(0,0,0,.12);cursor:pointer}
  .theme-toggle:hover{border-color:var(--purple);box-shadow:0 0 16px var(--purple-glow)}

  /* SIDEBAR */
  .sidebar{width:var(--sidebar-w);min-width:var(--sidebar-w);height:100vh;background:var(--bg-deep);border-right:1px solid var(--border-subtle);display:flex;flex-direction:column;overflow:hidden;flex-shrink:0;position:relative;z-index:100}
  .sidebar::before{content:'';position:absolute;top:0;left:0;right:0;height:320px;background:radial-gradient(ellipse at top,rgba(139,92,246,.07),transparent 70%);pointer-events:none}
  .sidebar-logo{display:flex;align-items:center;gap:12px;padding:24px 20px 20px;border-bottom:1px solid var(--border-faint);flex-shrink:0;position:relative}
  .logo-icon{width:36px;height:36px;background:linear-gradient(135deg,var(--purple),var(--purple-dim));border-radius:8px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 18px rgba(139,92,246,.35),0 4px 12px rgba(0,0,0,.3);flex-shrink:0}
  .logo-icon svg{width:22px;height:22px;filter:drop-shadow(0 0 4px rgba(139,92,246,.5))}
  .logo-text{font-size:1.1rem;font-weight:800;letter-spacing:-.03em;background:linear-gradient(135deg,var(--text-bright),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .logo-version{font-family:var(--font-mono);font-size:.6rem;color:var(--purple);background:var(--purple-glow);border:1px solid rgba(139,92,246,.3);padding:2px 6px;border-radius:4px;margin-left:auto;flex-shrink:0;font-weight:600}
  .sidebar-nav{flex:1;overflow-y:auto;padding:12px 0 20px}
  .nav-group-label{font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.16em;color:var(--text-faint);padding:18px 20px 6px;font-weight:600}
  .nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;font-family:var(--font-mono);font-size:.75rem;color:var(--text-dim);border-left:3px solid transparent;transition:color .2s,background .2s,border-color .2s;background:none;border-top:none;border-right:none;border-bottom:none;width:100%;text-align:left;cursor:pointer}
  .nav-item:hover{color:var(--text-main);background:rgba(139,92,246,.05)}
  .nav-item.active{color:var(--purple);border-left-color:var(--purple);background:var(--purple-glow);font-weight:600}
  .nav-dot{width:5px;height:5px;border-radius:50%;background:currentColor;opacity:.4;flex-shrink:0;transition:opacity .2s}
  .nav-item.active .nav-dot{opacity:1;box-shadow:0 0 6px currentColor}
  .sidebar-foot{border-top:1px solid var(--border-faint);padding:14px 20px;flex-shrink:0}
  .sys-status{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:.62rem;color:var(--text-dim)}
  .sys-dot{width:7px;height:7px;border-radius:50%;background:var(--green);box-shadow:0 0 8px var(--green);animation:pulse 2.5s infinite}

  /* MAIN */
  .main{flex:1;min-width:0;height:100vh;overflow-y:auto;background:var(--bg-void);position:relative;z-index:1}

  /* CODE BANNER */
  .code-banner-wrapper{position:relative;margin:50px 0 60px}
  .code-banner{position:relative;z-index:10;height:140px;background:linear-gradient(135deg,rgba(15,15,28,.98),rgba(7,7,15,.95));border:1px solid var(--border-subtle);border-radius:20px;overflow:hidden;box-shadow:0 16px 48px rgba(139,92,246,.18),inset 0 1px 0 rgba(255,255,255,.05);transition:transform .25s,box-shadow .25s}
  [data-theme="light"] .code-banner{background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(243,244,248,.95));box-shadow:0 16px 48px rgba(124,58,237,.12),inset 0 1px 0 rgba(0,0,0,.05)}
  .code-banner:hover{transform:translateY(-2px);box-shadow:0 20px 56px rgba(139,92,246,.25),inset 0 1px 0 rgba(255,255,255,.06)}
  .code-banner-bg{position:absolute;inset:0;background:radial-gradient(circle at 20% 50%,rgba(139,92,246,.09),transparent 50%),radial-gradient(circle at 80% 50%,rgba(0,255,136,.07),transparent 50%);pointer-events:none}
  .code-banner-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(139,92,246,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.04) 1px,transparent 1px);background-size:20px 20px;pointer-events:none;opacity:.5}
  .code-banner-header{display:flex;align-items:center;justify-content:space-between;padding:12px 24px;border-bottom:1px solid var(--border-faint);background:rgba(0,0,0,.18);position:relative;z-index:2}
  [data-theme="light"] .code-banner-header{background:rgba(0,0,0,.03)}
  .code-banner-title{display:flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:.7rem;color:var(--text-dim);font-weight:600;letter-spacing:.05em}
  .code-banner-dots{display:flex;gap:6px}
  .code-banner-dot{width:10px;height:10px;border-radius:50%;transition:transform .2s}
  .code-banner-dot:nth-child(1){background:#ff5f57}.code-banner-dot:nth-child(2){background:#ffbd2e}.code-banner-dot:nth-child(3){background:#28c840}
  .code-banner-dot:hover{transform:scale(1.2)}
  .code-banner-stats{display:flex;gap:16px;font-family:var(--font-mono);font-size:.62rem;color:var(--text-faint)}
  .code-banner-stat{display:flex;align-items:center;gap:4px}
  .code-banner-stat-dot{width:4px;height:4px;border-radius:50%;background:var(--green);animation:pulse 2s infinite}
  .code-banner-content{position:relative;height:calc(100% - 50px);overflow:hidden;z-index:2}
  .code-banner-lines{position:absolute;inset:0;padding:0 24px;display:flex;flex-direction:column;justify-content:space-around}
  .code-line{display:flex;align-items:center;gap:12px;font-family:var(--font-mono);font-size:.82rem;opacity:.85}
  .code-line-num{color:var(--text-faint);font-size:.7rem;min-width:20px;text-align:right}
  .code-line-content{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
  .code-keyword{color:var(--purple);font-weight:700}.code-function{color:var(--blue)}.code-string{color:var(--green)}
  .code-number{color:var(--amber)}.code-comment{color:var(--text-dim);font-style:italic}.code-operator{color:var(--cyan)}
  .code-text{color:var(--text-dim)}
  .code-cursor{display:inline-block;width:8px;height:16px;background:var(--green);animation:blink 1s step-end infinite;margin-left:2px}

  /* TERMINAL */
  .terminal-code-block{position:relative;background:linear-gradient(135deg,rgba(15,15,28,.98),rgba(7,7,15,.95));border:1px solid var(--border-subtle);border-radius:16px;overflow:hidden;box-shadow:0 10px 36px rgba(139,92,246,.13),inset 0 1px 0 rgba(255,255,255,.05);margin-bottom:32px;transition:box-shadow .25s}
  [data-theme="light"] .terminal-code-block{background:linear-gradient(135deg,rgba(255,255,255,.98),rgba(243,244,248,.95));box-shadow:0 10px 36px rgba(124,58,237,.08),inset 0 1px 0 rgba(0,0,0,.05)}
  .terminal-code-block:hover{box-shadow:0 14px 44px rgba(139,92,246,.2),inset 0 1px 0 rgba(255,255,255,.06)}
  .terminal-code-bg{position:absolute;inset:0;background:radial-gradient(circle at 20% 50%,rgba(139,92,246,.06),transparent 50%),radial-gradient(circle at 80% 50%,rgba(0,255,136,.05),transparent 50%);pointer-events:none}
  .terminal-code-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(139,92,246,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.03) 1px,transparent 1px);background-size:20px 20px;pointer-events:none;opacity:.4}
  .terminal-header{display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid var(--border-faint);background:rgba(0,0,0,.15);position:relative;z-index:10}
  [data-theme="light"] .terminal-header{background:rgba(0,0,0,.03)}
  .terminal-dots{display:flex;gap:6px}
  .terminal-dot{width:10px;height:10px;border-radius:50%;transition:transform .2s}
  .terminal-dot:nth-child(1){background:#ff5f57}.terminal-dot:nth-child(2){background:#ffbd2e}.terminal-dot:nth-child(3){background:#28c840}
  .terminal-dot:hover{transform:scale(1.2)}
  .terminal-title{font-family:var(--font-mono);font-size:.68rem;color:var(--text-dim);font-weight:600;letter-spacing:.05em}
  .terminal-tab-row{display:flex;background:var(--bg-deep);border-bottom:1px solid var(--border-faint);overflow-x:auto;position:relative;z-index:10}
  .terminal-tab-btn{font-family:var(--font-mono);font-size:.67rem;padding:10px 20px;color:var(--text-dim);border-bottom:3px solid transparent;transition:color .2s,border-color .2s,background .2s;white-space:nowrap;background:none;border-top:none;border-left:none;border-right:none;letter-spacing:.04em;font-weight:500;cursor:pointer}
  .terminal-tab-btn:hover{color:var(--text-main);background:rgba(139,92,246,.04)}
  .terminal-tab-btn.on{color:var(--purple);border-bottom-color:var(--purple);background:var(--purple-glow);font-weight:600}
  .terminal-code-content{position:relative;z-index:10}
  .terminal-copy-btn{position:absolute;top:16px;right:16px;font-family:var(--font-mono);font-size:.6rem;color:var(--text-faint);background:var(--bg-card);border:1px solid var(--border-dim);padding:6px 12px;border-radius:6px;transition:color .2s,border-color .2s,background .2s,transform .2s;letter-spacing:.05em;font-weight:600;z-index:20;cursor:pointer}
  .terminal-copy-btn:hover{color:var(--purple);border-color:rgba(139,92,246,.4);background:var(--purple-glow);transform:translateY(-1px)}
  .terminal-copy-btn.done{color:var(--green);border-color:rgba(0,255,136,.4);background:var(--green-trace)}
  .terminal-pre{padding:24px;overflow-x:auto;font-family:var(--font-mono);font-size:.78rem;line-height:1.85;color:var(--text-green);position:relative}

  /* TOPBAR */
  .topbar{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:58px;background:rgba(4,4,10,.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border-faint);flex-shrink:0}
  [data-theme="light"] .topbar{background:rgba(255,255,255,.96)}
  .topbar-bc{display:flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:.7rem;color:var(--text-dim)}
  .topbar-bc .sep{color:var(--text-faint)}.topbar-bc .cur{color:var(--purple);font-weight:600}
  .topbar-btns{display:flex;gap:10px}
  .tb-btn{font-family:var(--font-mono);font-size:.65rem;padding:7px 16px;border-radius:22px;border:1px solid var(--border-dim);color:var(--text-dim);background:none;transition:color .2s,border-color .2s,background .2s,transform .2s;letter-spacing:.04em;font-weight:500;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center}
  .tb-btn:hover{color:var(--purple);border-color:rgba(139,92,246,.4);background:var(--purple-glow);transform:translateY(-1px)}
  .tb-btn.cta{background:linear-gradient(135deg,var(--purple),var(--purple-dim));color:white;border-color:transparent;font-weight:700;box-shadow:0 0 18px rgba(139,92,246,.28)}
  .tb-btn.cta:hover{box-shadow:0 0 28px rgba(139,92,246,.45);transform:translateY(-1px)}

  /* CONTENT */
  .content{padding:60px 56px 100px;max-width:1000px;animation:fadeIn .5s ease}

  /* HERO */
  .hero{position:relative;padding-bottom:60px;border-bottom:1px solid var(--border-subtle)}
  .hero-grid{position:absolute;inset:-60px -56px 0;background-image:linear-gradient(rgba(139,92,246,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(139,92,246,.03) 1px,transparent 1px);background-size:40px 40px;mask-image:radial-gradient(ellipse 80% 70% at 35% 40%,black,transparent);pointer-events:none}
  .hero-glow{position:absolute;width:560px;height:380px;background:radial-gradient(ellipse,rgba(139,92,246,.1),transparent 70%);top:-80px;left:-140px;pointer-events:none}
  .hero-glow-2{position:absolute;width:380px;height:260px;background:radial-gradient(ellipse,rgba(0,255,136,.06),transparent 70%);bottom:-60px;right:-100px;pointer-events:none}
  .hero-tag{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-mono);font-size:.65rem;color:var(--purple);background:var(--purple-glow);border:1px solid rgba(139,92,246,.3);padding:5px 14px;border-radius:22px;margin-bottom:26px;letter-spacing:.06em;position:relative;font-weight:600}
  .hero-tag-dot{width:6px;height:6px;border-radius:50%;background:var(--purple);box-shadow:0 0 8px var(--purple);animation:pulse 1.8s infinite}
  .hero-h1{font-size:clamp(2.2rem,4.2vw,3.8rem);font-weight:800;letter-spacing:-.05em;line-height:1.08;color:var(--text-bright);margin-bottom:20px;position:relative}
  .hero-h1 em{font-style:normal;background:linear-gradient(135deg,var(--purple),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .hero-sub{font-family:var(--font-mono);font-size:.88rem;color:var(--text-dim);line-height:1.8;max-width:600px;margin-bottom:28px;position:relative}
  .hero-links{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px}
  .hero-link{display:inline-flex;align-items:center;gap:7px;font-family:var(--font-mono);font-size:.68rem;font-weight:600;padding:8px 16px;border-radius:8px;text-decoration:none;border:1px solid var(--border-dim);color:var(--text-dim);background:var(--bg-card);transition:color .2s,border-color .2s,background .2s,transform .2s;letter-spacing:.04em}
  .hero-link:hover{color:var(--purple);border-color:rgba(139,92,246,.4);background:var(--purple-glow);transform:translateY(-1px)}
  .hero-link.primary{background:linear-gradient(135deg,var(--purple),var(--purple-dim));color:white;border-color:transparent;box-shadow:0 0 16px rgba(139,92,246,.3)}
  .hero-link.primary:hover{box-shadow:0 0 28px rgba(139,92,246,.5);color:white}
  .base-chip{display:inline-flex;align-items:center;font-family:var(--font-mono);font-size:.76rem;background:var(--bg-card);border:1px solid var(--border-dim);border-radius:10px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,.18)}
  .base-chip-label{padding:10px 16px;background:var(--bg-elevated);color:var(--text-faint);font-size:.62rem;text-transform:uppercase;letter-spacing:.12em;border-right:1px solid var(--border-dim);font-weight:600}
  .base-chip-val{padding:10px 18px;color:var(--purple);font-weight:600}

  /* FEATURE GRID */
  .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:60px}
  .feat{background:linear-gradient(135deg,var(--bg-card),var(--bg-deep));border:1px solid var(--border-faint);border-radius:12px;padding:22px 18px;transition:border-color .25s,background .25s,transform .25s,box-shadow .25s;position:relative;overflow:hidden}
  .feat:hover{border-color:rgba(139,92,246,.3);background:var(--bg-elevated);transform:translateY(-3px);box-shadow:0 10px 32px rgba(139,92,246,.13)}
  .feat-icon{font-size:1.4rem;margin-bottom:12px;display:block}
  .feat-title{font-size:.82rem;font-weight:700;color:var(--text-bright);margin-bottom:6px;letter-spacing:-.02em}
  .feat-desc{font-family:var(--font-mono);font-size:.68rem;color:var(--text-dim);line-height:1.65}

  /* SECTION HEADER */
  .sec-head{margin-bottom:26px}
  .sec-eye{font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.18em;color:var(--purple);margin-bottom:6px;font-weight:600}
  .sec-h2{font-size:1.6rem;font-weight:800;letter-spacing:-.04em;color:var(--text-bright)}
  .sec-rule{width:40px;height:3px;background:linear-gradient(90deg,var(--purple),var(--green));border-radius:2px;box-shadow:0 0 8px rgba(139,92,246,.35);margin-top:12px}

  /* EP BLOCKS */
  .ep-block{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:14px;overflow:hidden;margin-bottom:32px;box-shadow:0 6px 24px rgba(0,0,0,.18);transition:box-shadow .25s,transform .25s}
  .ep-block:hover{box-shadow:0 10px 36px rgba(139,92,246,.12);transform:translateY(-1px)}
  .ep-bar{display:flex;align-items:center;gap:12px;padding:14px 22px;background:linear-gradient(135deg,var(--bg-elevated),var(--bg-card));border-bottom:1px solid var(--border-faint);flex-wrap:wrap}
  .m-tag{font-family:var(--font-mono);font-size:.65rem;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:.06em;white-space:nowrap}
  .m-post{background:var(--blue-glow);color:var(--blue);border:1px solid rgba(77,166,255,.3)}
  .m-get{background:var(--green-trace);color:var(--green);border:1px solid rgba(0,255,136,.3)}
  .ep-path{font-family:var(--font-mono);font-size:.86rem;color:var(--text-bright);font-weight:600}
  .ep-note{margin-left:auto;font-family:var(--font-mono);font-size:.65rem;color:var(--text-faint)}
  .ep-desc{font-family:var(--font-mono);font-size:.74rem;color:var(--text-dim);padding:16px 22px;line-height:1.8}
  .ep-list{list-style:none;margin-top:10px;display:flex;flex-direction:column;gap:7px}
  .ep-list li{display:flex;align-items:flex-start;gap:8px;font-family:var(--font-mono);font-size:.72rem;color:var(--text-dim);line-height:1.65}
  .ep-list li::before{content:'→';color:var(--purple);flex-shrink:0;margin-top:1px}
  .ep-list strong{color:var(--text-main)}
  .ep-list code{color:var(--purple);background:var(--purple-glow);padding:1px 5px;border-radius:3px;font-size:.7rem;font-weight:600}

  /* TABLE */
  .kw{color:#c084fc}.st{color:#86efac}.nm{color:#fbbf24}.cm{color:var(--text-dim);font-style:italic}.ky{color:#7dd3fc}.fn{color:#60a5fa}.bl{color:#fca5a5}.ur{color:var(--green)}.hd{color:#67e8f9}
  .tbl-wrap{padding:20px 22px}
  .tbl-lbl{font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.16em;color:var(--text-faint);margin-bottom:14px;font-weight:600}
  table{width:100%;border-collapse:collapse}
  thead th{font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.12em;color:var(--text-faint);text-align:left;padding:8px 14px;border-bottom:1px solid var(--border-faint);font-weight:700}
  tbody td{font-family:var(--font-mono);font-size:.74rem;padding:12px 14px;border-bottom:1px solid var(--border-faint);vertical-align:top;color:var(--text-dim);transition:background .2s}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover td{background:rgba(139,92,246,.04)}
  .p-name{color:var(--blue);font-weight:600}.p-type{color:var(--amber)}.p-def{color:var(--text-faint);font-style:italic}
  .p-req{font-size:.56rem;background:var(--red-glow);color:var(--red);border:1px solid rgba(255,64,96,.3);padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;white-space:nowrap;font-weight:700}
  .p-beta{font-size:.56rem;background:var(--amber-glow);color:var(--amber);border:1px solid rgba(255,170,0,.3);padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;white-space:nowrap;font-weight:700}
  .f-name{color:var(--blue);font-weight:600}

  /* STATUS CODES */
  .sc-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:36px}
  .sc{background:linear-gradient(135deg,var(--bg-card),var(--bg-deep));border:1px solid var(--border-faint);border-radius:10px;padding:16px;display:flex;align-items:center;gap:12px;transition:border-color .2s,transform .2s,box-shadow .2s}
  .sc:hover{border-color:var(--border-dim);transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.14)}
  .sc-code{font-family:var(--font-mono);font-size:1.1rem;font-weight:700;min-width:42px}
  .c200{color:var(--green)}.c400{color:var(--amber)}.c429{color:var(--red)}.c504{color:var(--red-mid)}
  .sc-msg{font-family:var(--font-mono);font-size:.68rem;color:var(--text-dim);line-height:1.5}

  /* GUIDES */
  .guide{background:linear-gradient(135deg,var(--bg-card),var(--bg-deep));border:1px solid var(--border-faint);border-radius:14px;padding:28px;margin-bottom:18px;position:relative;overflow:hidden;transition:border-color .25s,transform .25s,box-shadow .25s}
  .guide:hover{border-color:rgba(139,92,246,.22);transform:translateY(-1px);box-shadow:0 10px 32px rgba(139,92,246,.08)}
  .guide-num{font-family:var(--font-mono);font-size:.6rem;color:var(--purple);background:var(--purple-glow);border:1px solid rgba(139,92,246,.25);padding:3px 10px;border-radius:5px;display:inline-block;margin-bottom:12px;letter-spacing:.1em;font-weight:700}
  .guide-title{font-size:1.05rem;font-weight:700;color:var(--text-bright);margin-bottom:10px;letter-spacing:-.02em}
  .guide-body{font-family:var(--font-mono);font-size:.74rem;color:var(--text-dim);line-height:1.8;margin-bottom:14px}
  .guide-body code{color:var(--purple);background:var(--purple-glow);padding:2px 6px;border-radius:4px;font-weight:600}
  .guide-list{list-style:none;display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
  .guide-list li{display:flex;align-items:flex-start;gap:10px;font-family:var(--font-mono);font-size:.73rem;color:var(--text-dim);line-height:1.65}
  .guide-list li::before{content:'▸';color:var(--purple);flex-shrink:0;margin-top:1px}
  .guide-list strong{color:var(--text-main)}
  .guide-list code{color:var(--purple);background:var(--purple-glow);padding:1px 5px;border-radius:3px;font-size:.68rem;font-weight:600}
  .warn{display:flex;gap:10px;align-items:flex-start;background:var(--amber-glow);border:1px solid rgba(255,170,0,.25);border-radius:10px;padding:12px 14px;margin-top:14px;font-family:var(--font-mono);font-size:.72rem;color:var(--amber);line-height:1.7}
  .info{display:flex;gap:10px;align-items:flex-start;background:var(--blue-glow);border:1px solid rgba(77,166,255,.25);border-radius:10px;padding:12px 14px;margin-top:14px;font-family:var(--font-mono);font-size:.72rem;color:var(--blue);line-height:1.7}

  .key-notice{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:.68rem;color:var(--amber);background:var(--amber-glow);border:1px solid rgba(255,170,0,.25);padding:7px 14px;border-radius:8px;margin-bottom:20px}
  .divider{height:1px;background:linear-gradient(90deg,transparent,var(--border-dim),transparent);margin:56px 0;position:relative}
  .divider::before{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:var(--purple);border-radius:50%;box-shadow:0 0 16px rgba(139,92,246,.55)}

  .cta-block{text-align:center;padding:56px 0 24px;border-top:1px solid var(--border-faint);margin-top:56px;position:relative}
  .cta-block::before{content:'';position:absolute;top:-80px;left:50%;transform:translateX(-50%);width:360px;height:180px;background:radial-gradient(ellipse,rgba(139,92,246,.1),transparent 70%);pointer-events:none}
  .cta-eye{font-family:var(--font-mono);font-size:.6rem;text-transform:uppercase;letter-spacing:.18em;color:var(--text-faint);margin-bottom:12px;font-weight:600}
  .cta-h2{font-size:2.1rem;font-weight:800;letter-spacing:-.05em;color:var(--text-bright);margin-bottom:12px}
  .cta-h2 em{font-style:normal;background:linear-gradient(135deg,var(--purple),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .cta-sub{font-family:var(--font-mono);font-size:.76rem;color:var(--text-faint);margin-bottom:30px}
  .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .btn-p{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--purple),var(--purple-dim));color:white;font-family:var(--font-mono);font-size:.76rem;font-weight:700;padding:12px 26px;border-radius:10px;text-decoration:none;letter-spacing:.05em;box-shadow:0 0 20px rgba(139,92,246,.3);transition:box-shadow .25s,transform .25s;border:none;cursor:pointer}
  .btn-p:hover{box-shadow:0 0 36px rgba(139,92,246,.55);transform:translateY(-2px)}
  .btn-s{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--text-dim);font-family:var(--font-mono);font-size:.76rem;padding:12px 26px;border-radius:10px;text-decoration:none;letter-spacing:.05em;border:1px solid var(--border-dim);transition:color .2s,border-color .2s,background .2s,transform .2s;cursor:pointer}
  .btn-s:hover{color:var(--text-main);border-color:var(--border-active);background:rgba(139,92,246,.04);transform:translateY(-1px)}

  .footer{border-top:1px solid var(--border-faint);padding:30px 56px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
  .footer-copy{font-family:var(--font-mono);font-size:.64rem;color:var(--text-faint)}
  .footer-copy a{color:var(--purple);text-decoration:none}.footer-copy a:hover{text-decoration:underline}
  .footer-links{display:flex;gap:10px;flex-wrap:wrap}
  .footer-link{font-family:var(--font-mono);font-size:.65rem;color:var(--text-faint);padding:6px 12px;border:1px solid var(--border-faint);border-radius:7px;background:none;transition:color .2s,border-color .2s,background .2s;text-decoration:none;display:inline-block;cursor:pointer}
  .footer-link:hover{color:var(--purple);border-color:rgba(139,92,246,.3);background:var(--purple-glow)}

  @media(max-width:960px){.feat-grid{grid-template-columns:repeat(2,1fr)}.sc-row{grid-template-columns:repeat(2,1fr)}.content{padding:48px 32px 80px}.topbar{padding:0 32px}.footer{padding:26px 32px}}
  @media(max-width:640px){.sidebar{display:none}.feat-grid{grid-template-columns:1fr}.sc-row{grid-template-columns:1fr}.ep-note{display:none}.content{padding:32px 20px 80px}.topbar{padding:0 20px}}
`;

const LogoSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
    <circle cx="50" cy="20" r="6" fill="currentColor"/><circle cx="80" cy="35" r="6" fill="currentColor"/>
    <circle cx="80" cy="65" r="6" fill="currentColor"/><circle cx="50" cy="80" r="6" fill="currentColor"/>
    <circle cx="20" cy="65" r="6" fill="currentColor"/><circle cx="20" cy="35" r="6" fill="currentColor"/>
    <circle cx="35" cy="50" r="6" fill="currentColor"/>
    <line x1="50" y1="20" x2="80" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="80" y1="35" x2="80" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="80" y1="65" x2="50" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="50" y1="80" x2="20" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="20" y1="65" x2="20" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="20" y1="35" x2="50" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="35" y1="50" x2="20" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <line x1="35" y1="50" x2="20" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
    <path d="M35 35 L65 35 L65 55 L50 65 L35 55 Z" stroke="currentColor" strokeWidth="3" fill="currentColor" opacity="0.7"/>
    <path d="M45 40 L50 38 L55 40 L55 50 L50 53 L45 50 Z" fill="#04040a"/>
  </svg>
);

function hi(code, lang) {
  const e = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  let c = e(code);
  if (lang === "json") {
    c = c.replace(/("[\w._\-]+")(\s*:)/g,'<span class="ky">$1</span>$2');
    c = c.replace(/:\s*("(?:[^"\\]|\\.)*")/g,': <span class="st">$1</span>');
    c = c.replace(/:\s*(true|false|null)/g,': <span class="bl">$1</span>');
    c = c.replace(/:\s*(\d+\.?\d*)/g,': <span class="nm">$1</span>');
    return c;
  }
  if (lang === "bash") {
    c = c.replace(/(curl)/g,'<span class="fn">$1</span>');
    c = c.replace(/( -X POST| -X GET| -H| -d| -o)/g,'<span class="hd">$1</span>');
    c = c.replace(/(https?:\/\/[^\s"\\]+)/g,'<span class="ur">$1</span>');
    c = c.replace(/(YOUR_SECRET_KEY|YOUR_RAPIDAPI_KEY)/g,'<span class="bl">$1</span>');
    c = c.replace(/"(X-RapidAPI[^"]+)"/g,'"<span class="st">$1</span>"');
    c = c.replace(/(#.*)/g,'<span class="cm">$1</span>');
    return c;
  }
  if (lang === "py") {
    c = c.replace(/\b(import|def|return|print|True|False|None|if|else|for|in)\b/g,'<span class="kw">$1</span>');
    c = c.replace(/("(?:[^"\\]|\\.)*")/g,'<span class="st">$1</span>');
    c = c.replace(/(#.*)/g,'<span class="cm">$1</span>');
    c = c.replace(/\b(requests|response|headers|payload|data|url|res|results)\b/g,'<span class="fn">$1</span>');
    return c;
  }
  if (lang === "js") {
    c = c.replace(/\b(const|await|async|return|useEffect|useState|if|else|new|import|from|let)\b/g,'<span class="kw">$1</span>');
    c = c.replace(/("(?:[^"\\]|\\.)*")/g,'<span class="st">$1</span>');
    c = c.replace(/(\/\/.*)/g,'<span class="cm">$1</span>');
    c = c.replace(/\b(fetch|JSON|console|response|headers|body|method|data|url|res)\b/g,'<span class="fn">$1</span>');
    c = c.replace(/\b(true|false|null|undefined)\b/g,'<span class="bl">$1</span>');
    return c;
  }
  return c;
}

// ── Code snippets ──────────────────────────────────────────────────────────────

const EXTRACT_CURL = `curl -X POST "https://og-miner-api.herokuapp.com/v1/extract" \\
     -H "Content-Type: application/json" \\
     -H "X-RapidAPI-Proxy-Secret: YOUR_SECRET_KEY" \\
     -d '{"url": "https://github.com"}'`;

const EXTRACT_PY = `import requests

url     = "https://og-miner-api.herokuapp.com/v1/extract"
headers = {
    "Content-Type":            "application/json",
    "X-RapidAPI-Proxy-Secret": "YOUR_SECRET_KEY"
}
payload = {"url": "https://github.com"}

res  = requests.post(url, json=payload, headers=headers)
data = res.json()
print(data["data"]["title"])
# → "GitHub: Let's build from here"`;

const EXTRACT_JS = `const res = await fetch(
  "https://og-miner-api.herokuapp.com/v1/extract",
  {
    method: "POST",
    headers: {
      "Content-Type":            "application/json",
      "X-RapidAPI-Proxy-Secret": "YOUR_SECRET_KEY"
    },
    body: JSON.stringify({ url: "https://github.com" })
  }
);
const { data } = await res.json();
console.log(data.title);
// "GitHub: Let's build from here"`;

const SCREENSHOT_JSON = `// POST /v1/screenshot
{
  "url":       "https://stripe.com",
  "full_page": true,
  "dark_mode": true,
  "viewport":  { "width": 1920, "height": 1080 }
}`;

const SPA_CURL = `curl -X POST "https://og-miner-api.herokuapp.com/v1/extract" \\
     -H "Content-Type: application/json" \\
     -H "X-RapidAPI-Proxy-Secret: YOUR_SECRET_KEY" \\
     -d '{
           "url": "https://www.instagram.com/p/...",
           "enable_javascript": true,
           "force_refresh": false
         }'`;

const SPA_JS = `const res = await fetch(
  "https://og-miner-api.herokuapp.com/v1/extract",
  {
    method: "POST",
    headers: {
      "Content-Type":            "application/json",
      "X-RapidAPI-Proxy-Secret": "YOUR_SECRET_KEY"
    },
    body: JSON.stringify({
      url:               "https://www.instagram.com/p/...",
      enable_javascript: true,   // 🤖 Headless Chromium via Playwright
      force_refresh:     false   // serve cache if available
    })
  }
);
const { data } = await res.json();
console.log(data.title);`;

const BATCH_JSON = `// POST /v1/batch/extract
{
  "urls": [
    "https://google.com",
    "https://apple.com",
    "https://github.com"
  ]
}

// Response — keyed by URL
{
  "https://google.com": { "data": { "title": "Google", "image": "...", ... } },
  "https://apple.com":  { "data": { "title": "Apple",  "image": "...", ... } },
  "https://github.com": { "data": { "title": "GitHub: Let's build from here", ... } }
}`;

const IMAGE_BASH = `# Resize to 600px wide, auto-height, converted to WebP
GET /v1/image?url=https://example.com/huge.png&width=600

# Full request with cURL
curl "https://og-miner-api.herokuapp.com/v1/image?url=https://example.com/photo.png&width=600" \\
     -H "X-RapidAPI-Proxy-Secret: YOUR_SECRET_KEY" \\
     -o optimized.webp
# → WebP output, 30-50% smaller than source`;

const RESP_JSON = `{
  "meta": {
    "url":        "https://github.com",
    "domain":     "github.com",
    "latency_ms": 245.5
  },
  "data": {
    "title":       "GitHub: Let's build from here",
    "description": "GitHub is where over 100M developers shape the future of software.",
    "image":       "https://github.githubassets.com/og.png",
    "favicon":     "https://github.com/favicon.ico",
    "site_name":   "GitHub",
    "author":      null,
    "oembed":      {},
    "json_ld":     []
  }
}`;

const CODE_LINES = [
  { num: 1, code: [{type:'keyword',text:'POST'},{type:'string',text:' /v1/extract'},{type:'operator',text:' · '},{type:'number',text:'200'},{type:'text',text:' OK ⚡ '},{type:'number',text:'48ms'}] },
  { num: 2, code: [{type:'keyword',text:'POST'},{type:'string',text:' /v1/screenshot'},{type:'operator',text:' · '},{type:'text',text:'full_page=true dark_mode=true'}] },
  { num: 3, code: [{type:'keyword',text:'POST'},{type:'string',text:' /v1/batch/extract'},{type:'operator',text:' · '},{type:'comment',text:'// 50 URLs · parallel · 0 failures'}] },
  { num: 4, code: [{type:'keyword',text:'GET'},{type:'string',text:' /v1/image'},{type:'operator',text:'?url=…&width=600'},{type:'comment',text:' // → WebP · -42% size'}] },
];

const NAV = [
  { group: "Overview", items: [
    { id: "intro",    label: "Introduction" },
    { id: "features", label: "Why OG Miner?" },
  ]},
  { group: "Endpoints", items: [
    { id: "ep-extract",    label: "POST /v1/extract" },
    { id: "ep-screenshot", label: "POST /v1/screenshot" },
    { id: "ep-batch",      label: "POST /v1/batch/extract" },
    { id: "ep-image",      label: "GET /v1/image" },
  ]},
  { group: "Reference", items: [
    { id: "params",   label: "Parameters" },
    { id: "response", label: "Response Schema" },
    { id: "errors",   label: "Error Codes" },
  ]},
  { group: "Guides", items: [
    { id: "g-spa",   label: "SPA / Headless Rendering" },
    { id: "g-batch", label: "Batch Processing" },
    { id: "g-image", label: "Image Proxy & Optimization" },
    { id: "g-geo",   label: "Geo-Targeting (Beta)" },
  ]},
  { group: "Get Started", items: [
    { id: "apikey", label: "Get API Key" },
  ]},
];

const STATUS = [
  { code: 200, cls: "c200", msg: "Success. Data extracted." },
  { code: 400, cls: "c400", msg: "Invalid URL or bad request." },
  { code: 429, cls: "c429", msg: "Rate limit exceeded." },
  { code: 504, cls: "c504", msg: "Timeout — target too slow." },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StaticCodeBanner() {
  return (
    <div className="code-banner-wrapper">
      <div className="code-banner">
        <div className="code-banner-bg" /><div className="code-banner-grid" />
        <div className="code-banner-header">
          <div className="code-banner-dots">
            <div className="code-banner-dot"/><div className="code-banner-dot"/><div className="code-banner-dot"/>
          </div>
          <div className="code-banner-title"><span>⚡</span><span>og-miner-live.log</span></div>
          <div className="code-banner-stats">
            <div className="code-banner-stat"><div className="code-banner-stat-dot"/><span>LIVE</span></div>
            <div className="code-banner-stat"><span>4 endpoints</span></div>
          </div>
        </div>
        <div className="code-banner-content">
          <div className="code-banner-lines">
            {CODE_LINES.map((line, i) => (
              <div key={i} className="code-line">
                <span className="code-line-num">{line.num}</span>
                <div className="code-line-content">
                  {line.code.map((part, j) => <span key={j} className={`code-${part.type}`}>{part.text}</span>)}
                  {i === CODE_LINES.length - 1 && <span className="code-cursor"/>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalCodeTabs({ tabs, title }) {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);
  const cur = tabs.find(t => t.id === active);
  const copy = () => { navigator.clipboard.writeText(cur.code).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div className="terminal-code-block">
      <div className="terminal-code-bg"/><div className="terminal-code-grid"/>
      <div className="terminal-header">
        <div className="terminal-dots"><div className="terminal-dot"/><div className="terminal-dot"/><div className="terminal-dot"/></div>
        <div className="terminal-title">{title||'code'}</div>
      </div>
      <div className="terminal-tab-row">
        {tabs.map(t=><button key={t.id} className={`terminal-tab-btn${active===t.id?" on":""}`} onClick={()=>setActive(t.id)}>{t.label}</button>)}
      </div>
      <div className="terminal-code-content">
        <button className={`terminal-copy-btn${copied?" done":""}`} onClick={copy}>{copied?"✓ COPIED":"COPY"}</button>
        <pre className="terminal-pre" dangerouslySetInnerHTML={{__html:hi(cur.code,cur.lang)}}/>
      </div>
    </div>
  );
}

function TerminalPre({ code, lang, title }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code).catch(()=>{}); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  return (
    <div className="terminal-code-block">
      <div className="terminal-code-bg"/><div className="terminal-code-grid"/>
      <div className="terminal-header">
        <div className="terminal-dots"><div className="terminal-dot"/><div className="terminal-dot"/><div className="terminal-dot"/></div>
        <div className="terminal-title">{title||'code'}</div>
      </div>
      <div className="terminal-code-content">
        <button className={`terminal-copy-btn${copied?" done":""}`} onClick={copy}>{copied?"✓ COPIED":"COPY"}</button>
        <pre className="terminal-pre" dangerouslySetInnerHTML={{__html:hi(code,lang)}}/>
      </div>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeId, setActiveId] = useState("intro");
  const [theme, setTheme]       = useState("dark");
  const mainRef = useRef(null);

  const scrollTo = id => {
    const el = document.getElementById(id);
    if (el && mainRef.current) mainRef.current.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    setActiveId(id);
  };

  useEffect(() => {
    const el = mainRef.current; if (!el) return;
    const ids = NAV.flatMap(g => g.items.map(i => i.id));
    const handler = () => {
      for (let i = ids.length-1; i >= 0; i--) {
        const sec = document.getElementById(ids[i]);
        if (sec && sec.offsetTop - 120 <= el.scrollTop) { setActiveId(ids[i]); break; }
      }
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  const bc = (() => {
    for (const g of NAV) for (const it of g.items)
      if (it.id === activeId) return { group: g.group, label: it.label };
    return { group: "Overview", label: "Introduction" };
  })();

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <button className="theme-toggle" onClick={() => setTheme(t => t==="dark"?"light":"dark")}>
          {theme==="dark"?"☀️":"🌙"}
        </button>

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon"><LogoSvg/></div>
            <span className="logo-text">OG Miner</span>
            <span className="logo-version">v1.0</span>
          </div>
          <nav className="sidebar-nav">
            {NAV.map(g => (
              <div key={g.group}>
                <div className="nav-group-label">{g.group}</div>
                {g.items.map(it => (
                  <button key={it.id} className={`nav-item${activeId===it.id?" active":""}`} onClick={() => scrollTo(it.id)}>
                    <span className="nav-dot"/>{it.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="sys-status"><div className="sys-dot"/>All systems operational</div>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main" ref={mainRef}>
          <div className="topbar">
            <div className="topbar-bc">
              <span>OG Miner</span><span className="sep">/</span>
              <span>{bc.group}</span><span className="sep">/</span>
              <span className="cur">{bc.label}</span>
            </div>
            <div className="topbar-btns">
              <a className="tb-btn" href="https://opengraph-api-216d0279de39.herokuapp.com/docs" target="_blank" rel="noreferrer">Swagger</a>
              <button className="tb-btn" onClick={() => scrollTo("ep-extract")}>Reference</button>
              <a className="tb-btn cta" href="https://rapidapi.com/kavindugunasena/api/og-miner-metadata-screenshot-api" target="_blank" rel="noreferrer">Get API Key</a>
            </div>
          </div>

          <div className="content">

            {/* ── HERO ── */}
            <div className="hero" id="intro" style={{ scrollMarginTop: 100 }}>
              <div className="hero-grid"/><div className="hero-glow"/><div className="hero-glow-2"/>
              <div className="hero-tag"><div className="hero-tag-dot"/>LIVE ON RAPIDAPI · v2.0</div>
              <h1 className="hero-h1">The Ultimate<br /><em>OpenGraph</em> Miner API</h1>
              <p className="hero-sub">
                Extract rich metadata, screenshots, and visual assets from any URL with a single request.
                Handles SPAs, redirects, and bot protection — automatically.
              </p>
              <div className="hero-links">
                <a className="hero-link primary" href="https://rapidapi.com/kavindugunasena/api/og-miner-metadata-screenshot-api" target="_blank" rel="noreferrer">⚡ Checkout on RapidAPI</a>
                <a className="hero-link" href="https://opengraph-api-216d0279de39.herokuapp.com/docs" target="_blank" rel="noreferrer">📄 Swagger Docs</a>
                <a className="hero-link" href="https://og-miner-fe.vercel.app/" target="_blank" rel="noreferrer">🌐 Live Demo</a>
              </div>
              <div className="base-chip">
                <span className="base-chip-label">Base URL</span>
                <span className="base-chip-val">https://og-miner-api.herokuapp.com/</span>
              </div>
            </div>

            <StaticCodeBanner/>

            {/* ── WHY OG MINER ── */}
            <div id="features" style={{ scrollMarginTop: 100, marginBottom: 60 }}>
              <div className="sec-head">
                <div className="sec-eye">// capabilities</div>
                <h2 className="sec-h2">Why OG Miner?</h2>
                <div className="sec-rule"/>
              </div>
              <div className="feat-grid">
                {[
                  { icon:"⚡", title:"Unmatched Speed",       desc:"Redis caching delivers sub-millisecond response times on repeat hits." },
                  { icon:"📸", title:"Visual Intelligence",   desc:"Capture full-page screenshots and resize images with a single param." },
                  { icon:"🤖", title:"Smart SPA Extraction",  desc:"Headless Chromium renders React, Vue, and Angular apps flawlessly." },
                  { icon:"🛡️",title:"Anti-Blocking",         desc:"Built-in proxy rotation and geo-targeting bypass regional restrictions." },
                  { icon:"📦", title:"Rich Structured Data",  desc:"OpenGraph, JSON-LD, Schema.org, oEmbed — all in one unified response." },
                  { icon:"🔄", title:"Parallel Batch",        desc:"Up to 50 URLs processed concurrently. One failure never breaks the batch." },
                ].map((f,i) => (
                  <div key={i} className="feat">
                    <span className="feat-icon">{f.icon}</span>
                    <div className="feat-title">{f.title}</div>
                    <div className="feat-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider"/>

            {/* ── ENDPOINTS ── */}
            <div style={{ marginBottom: 8 }}>
              <div className="sec-head">
                <div className="sec-eye">// api reference</div>
                <h2 className="sec-h2">Endpoints</h2>
                <div className="sec-rule"/>
              </div>
            </div>

            <div className="key-notice">⚠ &nbsp;Replace <strong>YOUR_SECRET_KEY</strong> with your key from RapidAPI</div>

            {/* /v1/extract */}
            <div id="ep-extract" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block">
                <div className="ep-bar">
                  <span className="m-tag m-post">POST</span>
                  <span className="ep-path">/v1/extract</span>
                  <span className="ep-note">Rich metadata extraction</span>
                </div>
                <div className="ep-desc">
                  The core endpoint. Intelligently aggregates data from multiple sources for the most complete picture of any URL.
                  <ul className="ep-list">
                    <li><strong>Multi-Source Parsing</strong> — prioritises <code>og:</code> tags, falls back to <code>twitter:</code>, then standard HTML <code>&lt;meta&gt;</code></li>
                    <li><strong>Schema.org / JSON-LD</strong> — extracts Product, Article, Recipe structured data; essential for SEO and e-commerce tooling</li>
                    <li><strong>oEmbed Discovery</strong> — auto-fetches YouTube, Vimeo, and other rich-media provider details</li>
                  </ul>
                </div>
              </div>
              <TerminalCodeTabs
                title="extract.sh"
                tabs={[
                  { id:"curl", label:"cURL",       code:EXTRACT_CURL, lang:"bash" },
                  { id:"py",   label:"Python",     code:EXTRACT_PY,   lang:"py"   },
                  { id:"js",   label:"JavaScript", code:EXTRACT_JS,   lang:"js"   },
                ]}
              />
            </div>

            {/* /v1/screenshot */}
            <div id="ep-screenshot" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block">
                <div className="ep-bar">
                  <span className="m-tag m-post">POST</span>
                  <span className="ep-path">/v1/screenshot</span>
                  <span className="ep-note">Full-page visual capture</span>
                </div>
                <div className="ep-desc">
                  Capture pixel-perfect screenshots of any webpage using a real headless browser.
                  <ul className="ep-list">
                    <li><strong>Full Page Capture</strong> — scrolls and stitches the entire page, ideal for archiving or visual auditing</li>
                    <li><strong>Viewport Control</strong> — simulate mobile devices or specific resolutions (e.g. 1920×1080)</li>
                    <li><strong>Dark Mode Simulation</strong> — forces <code>prefers-color-scheme: dark</code> to capture dark-themed designs</li>
                    <li><strong>Lazy Loading Handling</strong> — waits for network-idle state so all images and dynamic content render first</li>
                  </ul>
                </div>
              </div>
              <TerminalPre title="screenshot-request.json" code={SCREENSHOT_JSON} lang="json"/>
            </div>

            {/* /v1/batch/extract */}
            <div id="ep-batch" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block">
                <div className="ep-bar">
                  <span className="m-tag m-post">POST</span>
                  <span className="ep-path">/v1/batch/extract</span>
                  <span className="ep-note">Parallel bulk extraction</span>
                </div>
                <div className="ep-desc">
                  High-throughput analysis for bulk operations. Processes up to <strong style={{color:"var(--text-main)"}}>50 URLs concurrently</strong> using async non-blocking I/O. Individual failures are isolated — they return an error entry without affecting the rest of the batch. Results are returned as a dictionary keyed by URL.
                </div>
              </div>
              <TerminalPre title="batch-extract.json" code={BATCH_JSON} lang="json"/>
            </div>

            {/* /v1/image */}
            <div id="ep-image" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block">
                <div className="ep-bar">
                  <span className="m-tag m-get">GET</span>
                  <span className="ep-path">/v1/image</span>
                  <span className="ep-note">Proxy, resize &amp; convert</span>
                </div>
                <div className="ep-desc">
                  Securely deliver external images without exposing user IPs or triggering mixed-content warnings.
                  <ul className="ep-list">
                    <li><strong>Anonymity</strong> — the API fetches the image server-side so user IPs never touch third-party servers</li>
                    <li><strong>Intelligent Resizing</strong> — set <code>width</code> and height is auto-calculated preserving aspect ratio via LANCZOS resampling</li>
                    <li><strong>Format Conversion</strong> — automatically converts PNG/JPEG to <code>WebP</code>, reducing file size by 30–50%</li>
                  </ul>
                </div>
              </div>
              <TerminalPre title="image-proxy.sh" code={IMAGE_BASH} lang="bash"/>
            </div>

            <div className="divider"/>

            {/* ── PARAMS ── */}
            <div id="params" style={{ scrollMarginTop: 100 }}>
              <div className="sec-head">
                <div className="sec-eye">// reference</div>
                <h2 className="sec-h2">Parameters</h2>
                <div className="sec-rule"/>
              </div>
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap">
                  <div className="tbl-lbl">// POST /v1/extract — Request Body</div>
                  <table>
                    <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        { name:"url",               req:true,  beta:false, type:"string",  def:"—",     desc:"The target URL to scrape." },
                        { name:"enable_javascript", req:false, beta:false, type:"bool",    def:"false", desc:"Launch headless Chromium (Playwright) to fully render JS-heavy SPAs." },
                        { name:"force_refresh",     req:false, beta:false, type:"bool",    def:"false", desc:"Bypass the Redis cache and fetch fresh data from the source." },
                        { name:"country",           req:false, beta:true,  type:"string",  def:"—",     desc:"Geo-target the request. E.g. \"US\", \"EU\"." },
                        { name:"proxy",             req:false, beta:true,  type:"string",  def:"—",     desc:"BYOP — route through your own proxy URL (BrightData, Oxylabs, etc)." },
                      ].map((p,i) => (
                        <tr key={i}>
                          <td><span className="p-name">{p.name}</span>{p.req&&<span className="p-req">REQUIRED</span>}{p.beta&&<span className="p-beta">BETA</span>}</td>
                          <td><span className="p-type">{p.type}</span></td>
                          <td><span className="p-def">{p.def}</span></td>
                          <td>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap">
                  <div className="tbl-lbl">// POST /v1/screenshot — Request Body</div>
                  <table>
                    <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        { name:"url",       req:true,  type:"string", def:"—",     desc:"The target URL to capture." },
                        { name:"full_page", req:false, type:"bool",   def:"false", desc:"Scroll and stitch the entire page height." },
                        { name:"dark_mode", req:false, type:"bool",   def:"false", desc:"Force prefers-color-scheme: dark before capture." },
                        { name:"viewport",  req:false, type:"object", def:"—",     desc:"{ width, height } in pixels. E.g. { width: 1920, height: 1080 }." },
                      ].map((p,i) => (
                        <tr key={i}>
                          <td><span className="p-name">{p.name}</span>{p.req&&<span className="p-req">REQUIRED</span>}</td>
                          <td><span className="p-type">{p.type}</span></td>
                          <td><span className="p-def">{p.def}</span></td>
                          <td>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap">
                  <div className="tbl-lbl">// GET /v1/image — Query Params</div>
                  <table>
                    <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        { name:"url",   req:true,  type:"string",  def:"—", desc:"Absolute URL of the image to proxy and optimize." },
                        { name:"width", req:false, type:"integer", def:"—", desc:"Target width in pixels. Height is auto-calculated to preserve aspect ratio." },
                      ].map((p,i) => (
                        <tr key={i}>
                          <td><span className="p-name">{p.name}</span>{p.req&&<span className="p-req">REQUIRED</span>}</td>
                          <td><span className="p-type">{p.type}</span></td>
                          <td><span className="p-def">{p.def}</span></td>
                          <td>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── RESPONSE ── */}
            <div id="response" style={{ scrollMarginTop: 100 }}>
              <div className="sec-head">
                <div className="sec-eye">// reference</div>
                <h2 className="sec-h2">Response Schema</h2>
                <div className="sec-rule"/>
              </div>
              <TerminalPre title="response.json" code={RESP_JSON} lang="json"/>
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap">
                  <div className="tbl-lbl">// Response Fields — /v1/extract</div>
                  <table>
                    <thead><tr><th>Field</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        ["meta.url",         "Resolved URL after following all redirects."],
                        ["meta.domain",      "Root domain extracted from the URL."],
                        ["meta.latency_ms",  "Total server-side fetch-and-parse time in milliseconds."],
                        ["data.title",       "Best available title — OG → Twitter Card → HTML <title>."],
                        ["data.description", "Page description from OG or meta tags."],
                        ["data.image",       "Absolute URL to the social preview image."],
                        ["data.favicon",     "Absolute URL to the site favicon."],
                        ["data.site_name",   "Publisher name from og:site_name."],
                        ["data.oembed",      "Rich embed info — video ID, width, height (YouTube, Vimeo, etc)."],
                        ["data.json_ld",     "Structured data array: Recipe, Product, Article, Event schemas."],
                      ].map(([f,d],i) => <tr key={i}><td><span className="f-name">{f}</span></td><td>{d}</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* ── ERRORS ── */}
            <div id="errors" style={{ scrollMarginTop: 100, marginBottom: 56 }}>
              <div className="sec-head">
                <div className="sec-eye">// reference</div>
                <h2 className="sec-h2">Error Codes</h2>
                <div className="sec-rule"/>
              </div>
              <div className="sc-row">
                {STATUS.map((s,i) => (
                  <div key={i} className="sc">
                    <div className={`sc-code ${s.cls}`}>{s.code}</div>
                    <div className="sc-msg">{s.msg}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider"/>

            {/* ── GUIDES ── */}
            <div style={{ marginBottom: 8 }}>
              <div className="sec-head">
                <div className="sec-eye">// guides</div>
                <h2 className="sec-h2">Guides & Use Cases</h2>
                <div className="sec-rule"/>
              </div>
            </div>

            {/* SPA */}
            <div id="g-spa" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 01</span>
                <h3 className="guide-title">Headless Rendering for SPAs</h3>
                <p className="guide-body">Standard HTTP requests return empty HTML shells for Instagram, TikTok, React, Vue, and Angular apps. OG Miner launches a real <code>Chromium</code> instance via Playwright and waits for full DOM hydration before extracting metadata.</p>
                <ul className="guide-list">
                  <li><strong>Real Browser</strong> — executes JavaScript exactly as a user's browser would, no empty shells</li>
                  <li><strong>DOM Hydration</strong> — waits for the hydration phase to complete, so metadata reflects actual rendered content</li>
                  <li><strong>Resource Blocking</strong> — ads, trackers, and heavy media are blocked to speed up rendering and reduce bandwidth</li>
                </ul>
                <div className="warn"><span>⚠</span><span>Headless requests take <strong>2–5 seconds</strong> longer and may use additional credits on paid plans. Use <code>force_refresh: false</code> to serve cached results wherever possible.</span></div>
              </div>
              <TerminalCodeTabs
                title="spa-rendering.sh"
                tabs={[
                  { id:"curl", label:"cURL",       code:SPA_CURL, lang:"bash" },
                  { id:"js",   label:"JavaScript", code:SPA_JS,   lang:"js"   },
                ]}
              />
            </div>

            {/* Batch */}
            <div id="g-batch" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 02</span>
                <h3 className="guide-title">Batch Processing at Scale</h3>
                <p className="guide-body">Send up to <code>50 URLs</code> in a single <code>POST /v1/batch/extract</code> request. The API processes them in parallel using async non-blocking I/O for maximum throughput.</p>
                <ul className="guide-list">
                  <li><strong>Parallel Execution</strong> — async/await I/O, all URLs processed concurrently</li>
                  <li><strong>Resiliency</strong> — a 404 or timeout on one URL returns an error entry without failing the whole batch</li>
                  <li><strong>Unified Response</strong> — results keyed by URL, easy to map back to your source data</li>
                </ul>
              </div>
              <TerminalPre title="batch-extract.json" code={BATCH_JSON} lang="json"/>
            </div>

            {/* Image proxy */}
            <div id="g-image" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 03</span>
                <h3 className="guide-title">Image Proxy & Optimization</h3>
                <p className="guide-body">Serve external OG images to your users without mixed-content warnings or IP leaks. The API fetches, resizes, and converts images server-side before delivering them.</p>
                <ul className="guide-list">
                  <li><strong>Anonymity</strong> — user IPs never touch third-party servers; prevents tracking pixel exposure</li>
                  <li><strong>Intelligent Resizing</strong> — define <code>width</code> and the API calculates height automatically via LANCZOS resampling — no distortion</li>
                  <li><strong>Auto WebP Conversion</strong> — heavy PNG/JPEG files are converted to WebP, typically 30–50% smaller for faster page loads</li>
                </ul>
              </div>
              <TerminalPre title="image-proxy.sh" code={IMAGE_BASH} lang="bash"/>
            </div>

            {/* Geo */}
            <div id="g-geo" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 04 · BETA</span>
                <h3 className="guide-title">Geo-Targeting & BYOP</h3>
                <p className="guide-body">Preview content as it appears in specific regions, or route requests through your own proxy infrastructure for enterprise-grade flexibility.</p>
                <ul className="guide-list">
                  <li><strong>Geo-Targeting</strong> — pass <code>country: "US"</code> or <code>country: "EU"</code> to simulate regional content; useful for localization testing or bypassing geo-blocks</li>
                  <li><strong>BYOP — Corporate Firewalls</strong> — tunnel through your own proxy to access internal staging environments or behind-the-firewall tools</li>
                  <li><strong>BYOP — Residential IPs</strong> — plug in BrightData, Oxylabs, or any premium residential provider for high-stealth scraping</li>
                </ul>
                <div className="info"><span>ℹ</span><span>Geo-targeting and BYOP are currently in <strong>Beta</strong>. Contact support via RapidAPI for access or to report issues.</span></div>
              </div>
            </div>

            {/* ── CTA ── */}
            <div className="cta-block" id="apikey" style={{ scrollMarginTop: 100 }}>
              <div className="cta-eye">// ready to ship?</div>
              <h2 className="cta-h2">Start Mining <em>Metadata</em></h2>
              <p className="cta-sub">Available on RapidAPI · Free tier included · No credit card required</p>
              <div className="cta-btns">
                <a className="btn-p" href="https://rapidapi.com/kavindugunasena/api/og-miner-metadata-screenshot-api" target="_blank" rel="noreferrer">⚡ GET API KEY →</a>
                <a className="btn-s" href="https://opengraph-api-216d0279de39.herokuapp.com/docs" target="_blank" rel="noreferrer">📄 Swagger Docs</a>
                <a className="btn-s" href="https://og-miner-fe.vercel.app/" target="_blank" rel="noreferrer">🌐 Live Demo</a>
              </div>
            </div>
          </div>

          <footer className="footer">
            <div className="footer-copy">
              © 2026 OG Miner &nbsp;·&nbsp;
              API by <a href="https://github.com/sasmithaK" target="_blank" rel="noreferrer">sasmithaK</a> &nbsp;·&nbsp;
              UI by <a href="https://github.com/isaraSE" target="_blank" rel="noreferrer">isaraSE</a>
            </div>
            <div className="footer-links">
              <a className="footer-link" href="https://github.com/sasmithaK" target="_blank" rel="noreferrer">⌥ sasmithaK</a>
              <a className="footer-link" href="https://github.com/isaraSE" target="_blank" rel="noreferrer">⌥ isaraSE</a>
              <a className="footer-link" href="https://rapidapi.com/kavindugunasena/api/og-miner-metadata-screenshot-api" target="_blank" rel="noreferrer">⚡ RapidAPI</a>
              <a className="footer-link" href="https://opengraph-api-216d0279de39.herokuapp.com/docs" target="_blank" rel="noreferrer">📄 Swagger</a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}