import { useState, useEffect, useRef } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Space+Grotesk:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  :root {
    --bg-void:    #04040a;
    --bg-deep:    #07070f;
    --bg-card:    #0f0f1c;
    --bg-elevated:#141424;
    --bg-hover:   #191928;

    --border-faint:  rgba(255,255,255,0.04);
    --border-subtle: rgba(255,255,255,0.07);
    --border-dim:    rgba(255,255,255,0.11);
    --border-active: rgba(255,255,255,0.2);

    --green:       #00ff88;
    --green-dim:   #008844;
    --green-glow:  rgba(0,255,136,0.18);
    --green-trace: rgba(0,255,136,0.06);

    --purple:      #8b5cf6;
    --purple-dim:  #6d28d9;
    --purple-glow: rgba(139,92,246,0.2);

    --cyan:        #06b6d4;
    --cyan-glow:   rgba(6,182,212,0.2);

    --red:         #ff4060;
    --red-mid:     #cc3050;
    --red-glow:    rgba(255,64,96,0.15);

    --amber:       #ffaa00;
    --amber-glow:  rgba(255,170,0,0.13);

    --blue:        #4da6ff;
    --blue-glow:   rgba(77,166,255,0.13);

    --text-bright: #eeeeff;
    --text-main:   #b0b0d0;
    --text-dim:    #6a6a90;
    --text-faint:  #3a3a58;
    --text-green:  #a0ffcc;

    --sidebar-w: 260px;
    --font-ui:   'Space Grotesk', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  [data-theme="light"] {
    --bg-void:    #f8f9fc;
    --bg-deep:    #ffffff;
    --bg-card:    #f3f4f8;
    --bg-elevated:#e8eaf0;
    --bg-hover:   #dfe2eb;

    --border-faint:  rgba(0,0,0,0.06);
    --border-subtle: rgba(0,0,0,0.1);
    --border-dim:    rgba(0,0,0,0.15);
    --border-active: rgba(0,0,0,0.25);

    --green:       #00b35c;
    --green-dim:   #008844;
    --green-glow:  rgba(0,179,92,0.15);
    --green-trace: rgba(0,179,92,0.05);

    --purple:      #7c3aed;
    --purple-dim:  #6d28d9;
    --purple-glow: rgba(124,58,237,0.15);

    --cyan:        #0891b2;
    --cyan-glow:   rgba(8,145,178,0.15);

    --red:         #dc2626;
    --red-mid:     #b91c1c;
    --red-glow:    rgba(220,38,38,0.12);

    --amber:       #d97706;
    --amber-glow:  rgba(217,119,6,0.12);

    --blue:        #2563eb;
    --blue-glow:   rgba(37,99,235,0.12);

    --text-bright: #0f172a;
    --text-main:   #334155;
    --text-dim:    #64748b;
    --text-faint:  #94a3b8;
    --text-green:  #059669;
  }

  * {
    cursor: none !important;
  }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--bg-elevated); border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: var(--green-dim); }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes scrollText {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  @keyframes dataPacketRun {
    0% {
      left: -100px;
      top: 20%;
    }
    25% {
      top: 50%;
    }
    50% {
      top: 30%;
    }
    75% {
      top: 60%;
    }
    100% {
      left: calc(100% + 100px);
      top: 40%;
    }
  }
  @keyframes particleFloat {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translate(var(--tx), var(--ty)) scale(0.3);
      opacity: 0;
    }
  }
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes glowPulse {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(139,92,246,.3);
      filter: brightness(1);
    }
    50% { 
      box-shadow: 0 0 40px rgba(139,92,246,.6);
      filter: brightness(1.2);
    }
  }
  @keyframes slideInFromLeft {
    from { transform: translateX(-30px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes rotateIn {
    from { transform: rotate(-180deg) scale(0); opacity: 0; }
    to { transform: rotate(0) scale(1); opacity: 1; }
  }
  @keyframes codeLineSlide {
    0% { transform: translateX(-100%); opacity: 0; }
    10% { transform: translateX(0); opacity: 1; }
    90% { transform: translateX(0); opacity: 1; }
    100% { transform: translateX(100%); opacity: 0; }
  }
  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
  @keyframes matrixRain {
    0% { transform: translateY(-100%); opacity: 0; }
    10% { opacity: 0.8; }
    90% { opacity: 0.8; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-2px, 2px); }
    40% { transform: translate(-2px, -2px); }
    60% { transform: translate(2px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }

  .shell {
    display: flex;
    width: 100vw;
    height: 100vh;
    background: var(--bg-void);
    color: var(--text-main);
    font-family: var(--font-ui);
    overflow: hidden;
    position: relative;
    transition: background 0.3s ease, color 0.3s ease;
  }

  /* CUSTOM CURSOR */
  .cursor {
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid var(--purple);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transition: transform 0.15s ease, border-color 0.2s ease;
    mix-blend-mode: difference;
  }
  .cursor-dot {
    position: fixed;
    width: 6px;
    height: 6px;
    background: var(--purple);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99999;
    transition: transform 0.08s ease;
    box-shadow: 0 0 10px var(--purple);
  }
  .cursor.hover {
    transform: scale(1.5);
    border-color: var(--green);
  }
  .cursor-dot.hover {
    background: var(--green);
    box-shadow: 0 0 15px var(--green);
  }
  .cursor-trail {
    position: fixed;
    width: 4px;
    height: 4px;
    background: var(--purple);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    opacity: 0.5;
  }

  /* PARTICLE BACKGROUND */
  .particle-bg {
    position: fixed;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
  }
  .particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--purple);
    border-radius: 50%;
    opacity: 0;
    animation: particleFloat linear infinite;
  }

  /* SCANLINE EFFECT */
  .scanline {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(to bottom, transparent, rgba(139,92,246,0.3), transparent);
    pointer-events: none;
    z-index: 9999;
    animation: scanline 8s linear infinite;
    opacity: 0.3;
  }

  /* DATA PACKET ANIMATION */
  .data-packet-container {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 10;
    overflow: hidden;
  }
  .data-packet {
    position: absolute;
    width: 60px;
    height: 60px;
    animation: dataPacketRun 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
  .packet-core {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .packet-icon {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    filter: drop-shadow(0 0 20px rgba(139,92,246,0.8));
    animation: rotateIn 0.6s ease-out;
  }
  .packet-trail {
    position: absolute;
    right: 100%;
    top: 50%;
    width: 100px;
    height: 2px;
    background: linear-gradient(to left, rgba(139,92,246,0.8), transparent);
    transform: translateY(-50%);
  }
  .packet-trail::before,
  .packet-trail::after {
    content: '';
    position: absolute;
    right: 0;
    width: 30px;
    height: 1px;
    background: linear-gradient(to left, rgba(0,255,136,0.6), transparent);
  }
  .packet-trail::before {
    top: -4px;
  }
  .packet-trail::after {
    top: 4px;
  }
  .packet-glow {
    position: absolute;
    inset: -20px;
    background: radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%);
    animation: glowPulse 2s ease-in-out infinite;
  }
  .packet-ring {
    position: absolute;
    inset: -10px;
    border: 2px solid rgba(139,92,246,0.4);
    border-radius: 50%;
    animation: glowPulse 2s ease-in-out infinite reverse;
  }

  /* THEME TOGGLE */
  .theme-toggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--bg-card);
    border: 2px solid var(--border-dim);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  }
  .theme-toggle:hover {
    transform: scale(1.1) rotate(180deg);
    border-color: var(--purple);
    box-shadow: 0 0 20px var(--purple-glow);
  }

  /* SIDEBAR */
  .sidebar {
    width: var(--sidebar-w);
    min-width: var(--sidebar-w);
    height: 100vh;
    background: var(--bg-deep);
    border-right: 1px solid var(--border-subtle);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
    z-index: 100;
    backdrop-filter: blur(20px);
  }
  .sidebar::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 400px;
    background: radial-gradient(ellipse at top, rgba(139,92,246,0.08), transparent 70%);
    pointer-events: none;
  }
  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border-faint);
    flex-shrink: 0;
    position: relative;
    animation: slideInFromLeft 0.6s ease-out;
  }
  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, var(--purple), var(--purple-dim));
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    box-shadow: 0 0 20px rgba(139,92,246,.4), 0 4px 12px rgba(0,0,0,.3);
    animation: float 6s ease-in-out infinite;
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
  }
  .logo-icon::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent);
    animation: shimmer 3s infinite;
  }
  .logo-icon svg {
    width: 22px;
    height: 22px;
    filter: drop-shadow(0 0 4px rgba(139,92,246,.6));
  }
  .logo-text {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, var(--text-bright), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .logo-version {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--purple);
    background: var(--purple-glow);
    border: 1px solid rgba(139,92,246,.3);
    padding: 2px 6px;
    border-radius: 4px;
    margin-left: auto;
    flex-shrink: 0;
    font-weight: 600;
  }
  .sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 0 20px; }
  .nav-group-label {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: .16em;
    color: var(--text-faint);
    padding: 18px 20px 6px;
    font-weight: 600;
  }
  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 20px;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-dim);
    border-left: 3px solid transparent;
    transition: all .25s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
    background: none;
    border-top: none; border-right: none; border-bottom: none;
    width: 100%;
    text-align: left;
    position: relative;
  }
  .nav-item::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 0;
    background: linear-gradient(90deg, var(--purple-glow), transparent);
    transition: width .25s;
  }
  .nav-item:hover {
    color: var(--text-main);
    background: rgba(139,92,246,.05);
    transform: translateX(3px);
  }
  .nav-item:hover::before { width: 100%; }
  .nav-item.active {
    color: var(--purple);
    border-left-color: var(--purple);
    background: var(--purple-glow);
    font-weight: 600;
  }
  .nav-item.active::before { width: 100%; }
  .nav-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    opacity: .4;
    flex-shrink: 0;
    transition: all .25s;
  }
  .nav-item.active .nav-dot {
    opacity: 1;
    box-shadow: 0 0 8px currentColor;
  }
  .sidebar-foot {
    border-top: 1px solid var(--border-faint);
    padding: 14px 20px;
    flex-shrink: 0;
    background: linear-gradient(to top, rgba(139,92,246,.03), transparent);
  }
  .sys-status {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 0.62rem; color: var(--text-dim);
  }
  .sys-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green); box-shadow: 0 0 8px var(--green);
    animation: pulse 2s infinite;
  }

  /* MAIN */
  .main { 
    flex: 1; 
    min-width: 0; 
    height: 100vh; 
    overflow-y: auto; 
    background: var(--bg-void); 
    position: relative;
    z-index: 1;
  }

  /* ADVANCED ANIMATED CODE BANNER */
  .code-banner-wrapper {
    position: relative;
    margin: 50px 0 60px;
    perspective: 1000px;
  }
  .code-banner {
    position: relative;
    z-index: 10;
    height: 140px;
    background: linear-gradient(135deg, rgba(15,15,28,0.98), rgba(7,7,15,0.95));
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(139,92,246,.2), inset 0 1px 0 rgba(255,255,255,.05);
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
  }
  [data-theme="light"] .code-banner {
    background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(243,244,248,0.95));
    box-shadow: 0 20px 60px rgba(124,58,237,.15), inset 0 1px 0 rgba(0,0,0,.05);
  }
  .code-banner:hover {
    transform: translateY(-2px);
  }
  .code-banner-bg {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(139,92,246,0.1), transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(0,255,136,0.08), transparent 50%);
    pointer-events: none;
  }
  .code-banner-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139,92,246,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,.04) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    opacity: 0.5;
  }
  .code-banner-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 24px;
    border-bottom: 1px solid var(--border-faint);
    background: rgba(0,0,0,0.2);
  }
  [data-theme="light"] .code-banner-header {
    background: rgba(0,0,0,0.03);
  }
  .code-banner-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .code-banner-dots {
    display: flex;
    gap: 6px;
  }
  .code-banner-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  .code-banner-dot:nth-child(1) { background: #ff5f57; }
  .code-banner-dot:nth-child(2) { background: #ffbd2e; }
  .code-banner-dot:nth-child(3) { background: #28c840; }
  .code-banner-dot:hover {
    transform: scale(1.2);
    box-shadow: 0 0 10px currentColor;
  }
  .code-banner-stats {
    display: flex;
    gap: 16px;
    font-family: var(--font-mono);
    font-size: 0.62rem;
    color: var(--text-faint);
  }
  .code-banner-stat {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .code-banner-stat-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse 2s infinite;
  }
  .code-banner-content {
    position: relative;
    height: calc(100% - 50px);
    overflow: hidden;
  }
  .code-banner-lines {
    position: absolute;
    inset: 0;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .code-line {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    opacity: 0;
    animation: codeLineSlide 8s ease-in-out infinite;
  }
  .code-line:nth-child(1) { animation-delay: 0s; }
  .code-line:nth-child(2) { animation-delay: 2s; }
  .code-line:nth-child(3) { animation-delay: 4s; }
  .code-line:nth-child(4) { animation-delay: 6s; }
  .code-line-num {
    color: var(--text-faint);
    font-size: 0.7rem;
    min-width: 20px;
    text-align: right;
  }
  .code-line-content {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .code-keyword { color: var(--purple); font-weight: 700; }
  .code-function { color: var(--blue); }
  .code-string { color: var(--green); }
  .code-number { color: var(--amber); }
  .code-comment { color: var(--text-dim); font-style: italic; }
  .code-operator { color: var(--cyan); }
  .code-cursor {
    display: inline-block;
    width: 8px;
    height: 16px;
    background: var(--green);
    animation: blink 1s step-end infinite;
    margin-left: 2px;
  }
  .matrix-rain-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.15;
  }
  .matrix-char {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--green);
    animation: matrixRain linear infinite;
  }
  .code-banner-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .banner-particle {
    position: absolute;
    width: 3px;
    height: 3px;
    background: var(--purple);
    border-radius: 50%;
    opacity: 0;
    animation: particleFloat 15s ease-in-out infinite;
  }

  /* TERMINAL CODE BLOCK - Static version for code tabs */
  .terminal-code-block {
    position: relative;
    background: linear-gradient(135deg, rgba(15,15,28,0.98), rgba(7,7,15,0.95));
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-subtle);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(139,92,246,.15), inset 0 1px 0 rgba(255,255,255,.05);
    margin-bottom: 32px;
  }
  [data-theme="light"] .terminal-code-block {
    background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(243,244,248,0.95));
    box-shadow: 0 12px 40px rgba(124,58,237,.1), inset 0 1px 0 rgba(0,0,0,.05);
  }
  .terminal-code-bg {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(139,92,246,0.08), transparent 50%),
      radial-gradient(circle at 80% 50%, rgba(0,255,136,0.06), transparent 50%);
    pointer-events: none;
  }
  .terminal-code-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(139,92,246,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,.03) 1px, transparent 1px);
    background-size: 20px 20px;
    pointer-events: none;
    opacity: 0.4;
  }
  
  /* Matrix rain for terminal blocks */
  .terminal-matrix-rain {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    opacity: 0.12;
    z-index: 1;
  }
  .terminal-matrix-char {
    position: absolute;
    font-family: var(--font-mono);
    font-size: 0.65rem;
    color: var(--green);
    animation: matrixRain linear infinite;
  }
  
  /* Particles for terminal blocks */
  .terminal-particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;
  }
  .terminal-particle {
    position: absolute;
    width: 2px;
    height: 2px;
    background: var(--purple);
    border-radius: 50%;
    opacity: 0;
    animation: particleFloat 12s ease-in-out infinite;
  }
  
  .terminal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    border-bottom: 1px solid var(--border-faint);
    background: rgba(0,0,0,0.15);
    position: relative;
    z-index: 10;
  }
  [data-theme="light"] .terminal-header {
    background: rgba(0,0,0,0.03);
  }
  .terminal-dots {
    display: flex;
    gap: 6px;
  }
  .terminal-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    transition: all 0.3s ease;
  }
  .terminal-dot:nth-child(1) { background: #ff5f57; }
  .terminal-dot:nth-child(2) { background: #ffbd2e; }
  .terminal-dot:nth-child(3) { background: #28c840; }
  .terminal-dot:hover {
    transform: scale(1.2);
    box-shadow: 0 0 10px currentColor;
  }
  .terminal-title {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-dim);
    font-weight: 600;
    letter-spacing: 0.05em;
  }
  .terminal-tab-row {
    display: flex;
    background: var(--bg-deep);
    border-bottom: 1px solid var(--border-faint);
    overflow-x: auto;
    position: relative;
    z-index: 10;
  }
  .terminal-tab-btn {
    font-family: var(--font-mono);
    font-size: 0.67rem;
    padding: 10px 20px;
    color: var(--text-dim);
    border-bottom: 3px solid transparent;
    transition: all .2s;
    white-space: nowrap;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    letter-spacing: .04em;
    font-weight: 500;
    position: relative;
  }
  .terminal-tab-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--purple-glow);
    opacity: 0;
    transition: opacity .2s;
  }
  .terminal-tab-btn:hover::before { opacity: 0.5; }
  .terminal-tab-btn:hover { color: var(--text-main); }
  .terminal-tab-btn.on {
    color: var(--purple);
    border-bottom-color: var(--purple);
    background: var(--purple-glow);
    font-weight: 600;
  }
  .terminal-tab-btn.on::before { opacity: 1; }
  .terminal-code-content {
    position: relative;
    z-index: 10;
  }
  .terminal-copy-btn {
    position: absolute;
    top: 16px;
    right: 16px;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    color: var(--text-faint);
    background: var(--bg-card);
    border: 1px solid var(--border-dim);
    padding: 6px 12px;
    border-radius: 6px;
    transition: all .2s;
    letter-spacing: .05em;
    font-weight: 600;
    z-index: 20;
  }
  .terminal-copy-btn:hover {
    color: var(--purple);
    border-color: rgba(139,92,246,.4);
    background: var(--purple-glow);
    transform: translateY(-1px);
  }
  .terminal-copy-btn.done {
    color: var(--green);
    border-color: rgba(0,255,136,.4);
    background: var(--green-trace);
  }
  .terminal-pre {
    padding: 24px;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: 0.78rem;
    line-height: 1.85;
    color: var(--text-green);
    position: relative;
  }

  /* TOPBAR */
  .topbar {
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 58px;
    background: rgba(4,4,10,.96);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-faint);
    flex-shrink: 0;
  }
  [data-theme="light"] .topbar {
    background: rgba(255,255,255,.96);
  }
  .topbar-bc {
    display: flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-dim);
  }
  .topbar-bc .sep { color: var(--text-faint); }
  .topbar-bc .cur { color: var(--purple); font-weight: 600; }
  .topbar-btns { display: flex; gap: 10px; }
  .tb-btn {
    font-family: var(--font-mono); font-size: 0.65rem;
    padding: 7px 16px; border-radius: 22px;
    border: 1px solid var(--border-dim); color: var(--text-dim);
    background: none; 
    transition: all .25s cubic-bezier(0.4, 0, 0.2, 1); 
    letter-spacing: .04em;
    font-weight: 500;
    position: relative;
    overflow: hidden;
  }
  .tb-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--purple-glow), transparent);
    opacity: 0;
    transition: opacity .25s;
  }
  .tb-btn:hover::before { opacity: 1; }
  .tb-btn:hover {
    color: var(--purple);
    border-color: rgba(139,92,246,.4);
    transform: translateY(-1px);
  }
  .tb-btn.cta {
    background: linear-gradient(135deg, var(--purple), var(--purple-dim));
    color: white;
    border-color: transparent;
    font-weight: 700;
    box-shadow: 0 0 20px rgba(139,92,246,.3), 0 4px 12px rgba(0,0,0,.2);
  }
  .tb-btn.cta::before {
    background: linear-gradient(135deg, rgba(255,255,255,.1), transparent);
  }
  .tb-btn.cta:hover {
    box-shadow: 0 0 30px rgba(139,92,246,.5), 0 6px 20px rgba(0,0,0,.3);
    transform: translateY(-2px);
  }

  /* CONTENT */
  .content {
    padding: 60px 56px 100px;
    max-width: 1000px;
    animation: fadeIn .6s ease;
  }

  /* HERO */
  .hero {
    position: relative;
    padding-bottom: 60px;
    border-bottom: 1px solid var(--border-subtle);
  }
  .hero-grid {
    position: absolute; inset: -60px -56px 0;
    background-image:
      linear-gradient(rgba(139,92,246,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(139,92,246,.03) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 70% at 35% 40%, black, transparent);
    pointer-events: none;
  }
  .hero-glow {
    position: absolute; width: 600px; height: 400px;
    background: radial-gradient(ellipse, rgba(139,92,246,.12), transparent 70%);
    top: -80px; left: -140px; pointer-events: none;
    animation: float 8s ease-in-out infinite;
  }
  .hero-glow-2 {
    position: absolute; width: 400px; height: 300px;
    background: radial-gradient(ellipse, rgba(0,255,136,.08), transparent 70%);
    bottom: -60px; right: -100px; pointer-events: none;
    animation: float 10s ease-in-out infinite reverse;
  }
  .hero-logo-float {
    position: absolute;
    right: -50px;
    top: 50%;
    transform: translateY(-50%);
    width: 280px;
    height: 280px;
    opacity: 0.08;
    animation: float 12s ease-in-out infinite;
    pointer-events: none;
  }
  .hero-logo-float svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 40px rgba(139,92,246,.3));
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: var(--font-mono); font-size: 0.65rem;
    color: var(--purple); background: var(--purple-glow);
    border: 1px solid rgba(139,92,246,.3);
    padding: 5px 14px; border-radius: 22px; margin-bottom: 26px;
    letter-spacing: .06em; position: relative; font-weight: 600;
    animation: slideInFromLeft 0.8s ease-out 0.2s backwards;
  }
  .hero-tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--purple); box-shadow: 0 0 8px var(--purple);
    animation: pulse 1.6s infinite;
  }
  .hero-h1 {
    font-size: clamp(2.2rem, 4.2vw, 3.8rem);
    font-weight: 800;
    letter-spacing: -.05em;
    line-height: 1.08;
    color: var(--text-bright);
    margin-bottom: 20px;
    position: relative;
    animation: slideInFromLeft 0.8s ease-out 0.3s backwards;
  }
  .hero-h1 em {
    font-style: normal;
    background: linear-gradient(135deg, var(--purple), var(--green));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 40px rgba(139,92,246,.5);
  }
  .hero-sub {
    font-family: var(--font-mono);
    font-size: 0.88rem;
    color: var(--text-dim);
    line-height: 1.8;
    max-width: 600px;
    margin-bottom: 32px;
    position: relative;
    animation: slideInFromLeft 0.8s ease-out 0.4s backwards;
  }
  .base-chip {
    display: inline-flex; align-items: center;
    font-family: var(--font-mono); font-size: 0.76rem;
    background: var(--bg-card); border: 1px solid var(--border-dim);
    border-radius: 10px; overflow: hidden; position: relative;
    box-shadow: 0 4px 20px rgba(0,0,0,.2);
    animation: slideInFromLeft 0.8s ease-out 0.5s backwards;
  }
  .base-chip-label {
    padding: 10px 16px; background: var(--bg-elevated);
    color: var(--text-faint);
    font-size: 0.62rem; text-transform: uppercase;
    letter-spacing: .12em; border-right: 1px solid var(--border-dim);
    font-weight: 600;
  }
  .base-chip-val { padding: 10px 18px; color: var(--purple); font-weight: 600; }

  /* FEATURE STRIP */
  .feat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 60px;
  }
  .feat {
    background: linear-gradient(135deg, var(--bg-card), var(--bg-deep));
    border: 1px solid var(--border-faint);
    border-radius: 12px;
    padding: 22px 18px;
    transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  .feat::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, rgba(139,92,246,.08), transparent 60%);
    opacity: 0;
    transition: opacity .3s;
  }
  .feat::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(45deg, transparent, rgba(139,92,246,.08), transparent);
    transform: rotate(45deg);
    transition: transform .6s;
  }
  .feat:hover::after {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
  .feat:hover {
    border-color: rgba(139,92,246,.3);
    background: var(--bg-elevated);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(139,92,246,.15);
  }
  .feat:hover::before { opacity: 1; }
  .feat-icon {
    font-size: 1.4rem;
    margin-bottom: 12px;
    display: block;
    filter: drop-shadow(0 2px 8px rgba(139,92,246,.3));
    position: relative;
    z-index: 1;
  }
  .feat-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--text-bright);
    margin-bottom: 6px;
    letter-spacing: -.02em;
    position: relative;
    z-index: 1;
  }
  .feat-desc {
    font-family: var(--font-mono);
    font-size: 0.68rem;
    color: var(--text-dim);
    line-height: 1.65;
    position: relative;
    z-index: 1;
  }

  /* SECTION HEADER */
  .sec-head { margin-bottom: 26px; }
  .sec-eye {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: .18em;
    color: var(--purple);
    margin-bottom: 6px;
    font-weight: 600;
  }
  .sec-h2 {
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -.04em;
    color: var(--text-bright);
  }
  .sec-rule {
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, var(--purple), var(--green));
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(139,92,246,.4);
    margin-top: 12px;
  }

  /* Compact remaining styles for space */
  .ep-block{background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:14px;overflow:hidden;margin-bottom:32px;box-shadow:0 8px 32px rgba(0,0,0,.2);transition:all .3s}
  .ep-block:hover{box-shadow:0 12px 48px rgba(139,92,246,.15);transform:translateY(-2px)}
  .ep-bar{display:flex;align-items:center;gap:14px;padding:14px 22px;background:linear-gradient(135deg,var(--bg-elevated),var(--bg-card));border-bottom:1px solid var(--border-faint)}
  .m-tag{font-family:var(--font-mono);font-size:0.65rem;font-weight:700;padding:4px 10px;border-radius:6px;letter-spacing:.06em}
  .m-post{background:var(--blue-glow);color:var(--blue);border:1px solid rgba(77,166,255,.3)}
  .ep-path{font-family:var(--font-mono);font-size:0.86rem;color:var(--text-bright);font-weight:600}
  .ep-note{margin-left:auto;font-family:var(--font-mono);font-size:0.65rem;color:var(--text-faint)}
  
  .kw{color:#c084fc}.st{color:#86efac}.nm{color:#fbbf24}.cm{color:var(--text-dim);font-style:italic}.ky{color:#7dd3fc}.fn{color:#60a5fa}.bl{color:#fca5a5}.ur{color:var(--green)}.hd{color:#67e8f9}
  .tbl-wrap{padding:20px 22px}.tbl-lbl{font-family:var(--font-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:.16em;color:var(--text-faint);margin-bottom:14px;font-weight:600}
  table{width:100%;border-collapse:collapse}
  thead th{font-family:var(--font-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:.12em;color:var(--text-faint);text-align:left;padding:8px 14px;border-bottom:1px solid var(--border-faint);font-weight:700}
  tbody td{font-family:var(--font-mono);font-size:0.74rem;padding:12px 14px;border-bottom:1px solid var(--border-faint);vertical-align:top;color:var(--text-dim);transition:background .2s}
  tbody tr:last-child td{border-bottom:none}
  tbody tr:hover td{background:rgba(139,92,246,.04)}
  .p-name{color:var(--blue);font-weight:600}.p-type{color:var(--amber)}.p-def{color:var(--text-faint);font-style:italic}
  .p-req{font-size:0.56rem;background:var(--red-glow);color:var(--red);border:1px solid rgba(255,64,96,.3);padding:2px 6px;border-radius:4px;margin-left:6px;vertical-align:middle;white-space:nowrap;font-weight:700}
  .f-name{color:var(--blue);font-weight:600}
  .sc-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:36px}
  .sc{background:linear-gradient(135deg,var(--bg-card),var(--bg-deep));border:1px solid var(--border-faint);border-radius:10px;padding:16px;display:flex;align-items:center;gap:12px;transition:all .3s;position:relative;overflow:hidden}
  .sc::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at center,rgba(139,92,246,.05),transparent 70%);opacity:0;transition:opacity .3s}
  .sc:hover::before{opacity:1}
  .sc:hover{border-color:var(--border-dim);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.15)}
  .sc-code{font-family:var(--font-mono);font-size:1.1rem;font-weight:700;min-width:42px;position:relative;z-index:1}
  .c200{color:var(--green)}.c400{color:var(--amber)}.c429{color:var(--red)}.c504{color:var(--red-mid)}
  .sc-msg{font-family:var(--font-mono);font-size:0.68rem;color:var(--text-dim);line-height:1.5;position:relative;z-index:1}
  .guide{background:linear-gradient(135deg,var(--bg-card),var(--bg-deep));border:1px solid var(--border-faint);border-radius:14px;padding:28px;margin-bottom:18px;position:relative;overflow:hidden;transition:all .3s}
  .guide::after{content:'';position:absolute;bottom:0;right:0;width:180px;height:180px;background:radial-gradient(circle,rgba(139,92,246,.08),transparent 70%);pointer-events:none}
  .guide:hover{border-color:rgba(139,92,246,.25);transform:translateY(-2px);box-shadow:0 12px 40px rgba(139,92,246,.1)}
  .guide-num{font-family:var(--font-mono);font-size:0.6rem;color:var(--purple);background:var(--purple-glow);border:1px solid rgba(139,92,246,.25);padding:3px 10px;border-radius:5px;display:inline-block;margin-bottom:12px;letter-spacing:.1em;font-weight:700}
  .guide-title{font-size:1.05rem;font-weight:700;color:var(--text-bright);margin-bottom:10px;letter-spacing:-.02em}
  .guide-body{font-family:var(--font-mono);font-size:0.74rem;color:var(--text-dim);line-height:1.8;margin-bottom:16px}
  .guide-body code{color:var(--purple);background:var(--purple-glow);padding:2px 6px;border-radius:4px;font-weight:600}
  .guide-inner{background:var(--bg-deep);border:1px solid var(--border-faint);border-radius:10px;overflow:hidden}
  .warn{display:flex;gap:10px;align-items:flex-start;background:var(--amber-glow);border:1px solid rgba(255,170,0,.25);border-radius:10px;padding:12px 14px;margin-top:14px;font-family:var(--font-mono);font-size:0.72rem;color:var(--amber);line-height:1.7}
  .json-preview{background:var(--bg-deep);border:1px solid var(--border-faint);border-radius:10px;overflow:hidden;margin:0 22px 22px}
  .json-bar{display:flex;align-items:center;justify-content:space-between;padding:8px 14px;background:var(--bg-elevated);border-bottom:1px solid var(--border-faint)}
  .json-bar-lbl{font-family:var(--font-mono);font-size:0.6rem;color:var(--text-faint);letter-spacing:.1em;text-transform:uppercase;font-weight:600}
  .json-bar-ok{font-family:var(--font-mono);font-size:0.6rem;color:var(--green);background:var(--green-trace);border:1px solid rgba(0,255,136,.25);padding:2px 8px;border-radius:4px;font-weight:600}
  .key-notice{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-mono);font-size:0.68rem;color:var(--amber);background:var(--amber-glow);border:1px solid rgba(255,170,0,.25);padding:7px 14px;border-radius:8px;margin-bottom:20px}
  .divider{height:1px;background:linear-gradient(90deg,transparent,var(--border-dim),transparent);margin:56px 0;position:relative}
  .divider::before{content:'';position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:8px;height:8px;background:var(--purple);border-radius:50%;box-shadow:0 0 20px rgba(139,92,246,.6)}
  .cta-block{text-align:center;padding:56px 0 24px;border-top:1px solid var(--border-faint);margin-top:56px;position:relative}
  .cta-block::before{content:'';position:absolute;top:-100px;left:50%;transform:translateX(-50%);width:400px;height:200px;background:radial-gradient(ellipse,rgba(139,92,246,.12),transparent 70%);pointer-events:none}
  .cta-eye{font-family:var(--font-mono);font-size:0.6rem;text-transform:uppercase;letter-spacing:.18em;color:var(--text-faint);margin-bottom:12px;font-weight:600}
  .cta-h2{font-size:2.1rem;font-weight:800;letter-spacing:-.05em;color:var(--text-bright);margin-bottom:12px}
  .cta-h2 em{font-style:normal;background:linear-gradient(135deg,var(--purple),var(--green));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .cta-sub{font-family:var(--font-mono);font-size:0.76rem;color:var(--text-faint);margin-bottom:30px}
  .cta-btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .btn-p{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,var(--purple),var(--purple-dim));color:white;font-family:var(--font-mono);font-size:0.76rem;font-weight:700;padding:12px 26px;border-radius:10px;text-decoration:none;letter-spacing:.05em;box-shadow:0 0 24px rgba(139,92,246,.35),0 6px 16px rgba(0,0,0,.25);transition:all .3s cubic-bezier(0.4,0,0.2,1);border:none;position:relative;overflow:hidden}
  .btn-p::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.1),transparent);opacity:0;transition:opacity .3s}
  .btn-p:hover::before{opacity:1}
  .btn-p:hover{box-shadow:0 0 40px rgba(139,92,246,.6),0 8px 24px rgba(0,0,0,.35);transform:translateY(-3px)}
  .btn-s{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--text-dim);font-family:var(--font-mono);font-size:0.76rem;padding:12px 26px;border-radius:10px;text-decoration:none;letter-spacing:.05em;border:1px solid var(--border-dim);transition:all .3s;position:relative;overflow:hidden}
  .btn-s::before{content:'';position:absolute;inset:0;background:var(--purple-glow);opacity:0;transition:opacity .3s}
  .btn-s:hover::before{opacity:1}
  .btn-s:hover{color:var(--text-main);border-color:var(--border-active);transform:translateY(-1px)}
  .footer{border-top:1px solid var(--border-faint);padding:30px 56px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;background:linear-gradient(to top,rgba(139,92,246,.02),transparent)}
  .footer-copy{font-family:var(--font-mono);font-size:0.64rem;color:var(--text-faint)}
  .footer-copy em{font-style:normal;color:var(--red)}
  .footer-links{display:flex;gap:10px;flex-wrap:wrap}
  .footer-link{font-family:var(--font-mono);font-size:0.65rem;color:var(--text-faint);padding:6px 12px;border:1px solid var(--border-faint);border-radius:7px;background:none;transition:all .2s;text-decoration:none;display:inline-block;position:relative;overflow:hidden}
  .footer-link::before{content:'';position:absolute;inset:0;background:var(--purple-glow);opacity:0;transition:opacity .2s}
  .footer-link:hover::before{opacity:1}
  .footer-link:hover{color:var(--purple);border-color:rgba(139,92,246,.3)}

  @media (max-width: 960px) {
    .feat-grid { grid-template-columns: repeat(2,1fr); }
    .sc-row { grid-template-columns: repeat(2,1fr); }
    .content { padding: 48px 32px 80px; }
    .topbar { padding: 0 32px; }
    .footer { padding: 26px 32px; }
    .hero-logo-float { display: none; }
    .code-banner { height: 100px; }
  }
  @media (max-width: 640px) {
    .sidebar { display: none; }
    .feat-grid { grid-template-columns: 1fr; }
    .sc-row { grid-template-columns: 1fr; }
    .ep-note { display: none; }
    .content { padding: 32px 20px 80px; }
    .topbar { padding: 0 20px; }
    .data-packet { width: 40px; height: 40px; }
    .packet-icon { font-size: 20px; }
    .code-banner { height: 80px; }
  }
`;

// Logo SVG component
const LogoSvg = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" opacity="0.3"/>
    <circle cx="50" cy="20" r="6" fill="currentColor"/>
    <circle cx="80" cy="35" r="6" fill="currentColor"/>
    <circle cx="80" cy="65" r="6" fill="currentColor"/>
    <circle cx="50" cy="80" r="6" fill="currentColor"/>
    <circle cx="20" cy="65" r="6" fill="currentColor"/>
    <circle cx="20" cy="35" r="6" fill="currentColor"/>
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
  const e = (s) => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  let c = e(code);
  if (lang === "json") {
    c = c.replace(/("[\w._]+")(\s*:)/g, '<span class="ky">$1</span>$2');
    c = c.replace(/:\s*("(?:[^"\\]|\\.)*")/g, ': <span class="st">$1</span>');
    c = c.replace(/:\s*(true|false|null)/g, ': <span class="bl">$1</span>');
    c = c.replace(/:\s*(\d+\.?\d*)/g, ': <span class="nm">$1</span>');
    return c;
  }
  if (lang === "bash") {
    c = c.replace(/(curl)/g, '<span class="fn">$1</span>');
    c = c.replace(/( -X POST| -H| -d)/g, '<span class="hd">$1</span>');
    c = c.replace(/(https?:\/\/[^\s"\\]+)/g, '<span class="ur">$1</span>');
    c = c.replace(/(YOUR_RAPIDAPI_KEY)/g, '<span class="bl">$1</span>');
    c = c.replace(/"(X-RapidAPI[^"]+)"/g, '"<span class="st">$1</span>"');
    return c;
  }
  if (lang === "py") {
    c = c.replace(/\b(import|def|return|print|True|False|None|if|else)\b/g, '<span class="kw">$1</span>');
    c = c.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="st">$1</span>');
    c = c.replace(/(#.*)/g, '<span class="cm">$1</span>');
    c = c.replace(/\b(requests|response|headers|payload|data|url|res)\b/g, '<span class="fn">$1</span>');
    return c;
  }
  if (lang === "js") {
    c = c.replace(/\b(const|await|async|return|useEffect|useState|if|else|new|import|from)\b/g, '<span class="kw">$1</span>');
    c = c.replace(/("(?:[^"\\]|\\.)*")/g, '<span class="st">$1</span>');
    c = c.replace(/(\/\/.*)/g, '<span class="cm">$1</span>');
    c = c.replace(/\b(fetch|JSON|console|response|headers|body|method|data|url|res)\b/g, '<span class="fn">$1</span>');
    c = c.replace(/\b(true|false|null|undefined)\b/g, '<span class="bl">$1</span>');
    return c;
  }
  return c;
}

const CURL = `curl -X POST "https://og-miner.p.rapidapi.com/v1/extract" \\
     -H "Content-Type: application/json" \\
     -H "X-RapidAPI-Key: YOUR_RAPIDAPI_KEY" \\
     -H "X-RapidAPI-Host: og-miner.p.rapidapi.com" \\
     -d '{
           "url": "https://www.github.com",
           "enable_javascript": false
         }'`;

const PY = `import requests

url     = "https://og-miner.p.rapidapi.com/v1/extract"
headers = {
    "Content-Type":    "application/json",
    "X-RapidAPI-Key":  "YOUR_RAPIDAPI_KEY",
    "X-RapidAPI-Host": "og-miner.p.rapidapi.com"
}
payload = {
    "url": "https://www.github.com",
    "enable_javascript": False
}
res  = requests.post(url, json=payload, headers=headers)
data = res.json()
print(data["data"]["title"])
# → "GitHub: Let's build from here"`;

const JS = `const res = await fetch(
  "https://og-miner.p.rapidapi.com/v1/extract",
  {
    method: "POST",
    headers: {
      "Content-Type":    "application/json",
      "X-RapidAPI-Key":  "YOUR_RAPIDAPI_KEY",
      "X-RapidAPI-Host": "og-miner.p.rapidapi.com"
    },
    body: JSON.stringify({
      url: "https://www.github.com",
      enable_javascript: false
    })
  }
);
const { data } = await res.json();
console.log(data.title);
// "GitHub: Let's build from here"`;

const LINK_CODE = `// React — Link Preview Card
const LinkCard = ({ url }) => {
  const [meta, setMeta] = useState(null);

  useEffect(() => {
    fetchMeta(url).then(setMeta);
  }, [url]);

  if (!meta) return <Skeleton />;

  return (
    <div className="card">
      <img src={meta.image} alt={meta.title} />
      <h3>{meta.title}</h3>
      <p>{meta.description}</p>
      <span className="domain">{meta.domain}</span>
    </div>
  );
};`;

const SPA_CODE = `// For JS-heavy SPAs: Instagram, TikTok, React apps
const res = await fetch(endpoint, {
  method: "POST",
  headers: headers,
  body: JSON.stringify({
    url: "https://www.instagram.com/p/example/",
    enable_javascript: true,   // 🤖 Headless Playwright
    force_refresh: false       // serve from cache if available
  })
});
// Note: JS rendering takes 2-5s and uses extra credits`;

const RESP_JSON = `{
  "meta": {
    "url":        "https://github.com",
    "domain":     "github.com",
    "latency_ms": 245.5
  },
  "data": {
    "title":       "GitHub: Let's build from here",
    "description": "GitHub is where over 100M developers...",
    "image":       "https://github.githubassets.com/og.png",
    "favicon":     "https://github.com/favicon.ico",
    "site_name":   "GitHub",
    "author":      null,
    "oembed":      {},
    "json_ld":     []
  }
}`;

// Advanced Code Lines for Banner
const CODE_LINES = [
  { num: 1, code: [{ type: 'keyword', text: 'const' }, { type: 'text', text: ' response = ' }, { type: 'keyword', text: 'await' }, { type: 'function', text: ' fetch' }, { type: 'text', text: '(' }, { type: 'string', text: '"https://og-miner.p.rapidapi.com/v1/extract"' }, { type: 'text', text: ')' }] },
  { num: 2, code: [{ type: 'keyword', text: 'async' }, { type: 'function', text: ' extractMetadata' }, { type: 'text', text: '(url) => { ' }, { type: 'keyword', text: 'return' }, { type: 'function', text: ' parse' }, { type: 'text', text: '(url) }' }] },
  { num: 3, code: [{ type: 'comment', text: '// OpenGraph extraction with caching layer' }] },
  { num: 4, code: [{ type: 'keyword', text: 'POST' }, { type: 'string', text: ' /v1/extract' }, { type: 'operator', text: ' → ' }, { type: 'number', text: '200' }, { type: 'text', text: ' OK ' }, { type: 'operator', text: '⚡' }, { type: 'number', text: ' 45ms' }] },
];

const MATRIX_CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

// Particle background component
function ParticleBackground() {
  useEffect(() => {
    const particles = [];
    const container = document.querySelector('.particle-bg');
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = startX + (Math.random() - 0.5) * 100;
      const endY = startY + (Math.random() - 0.5) * 100;
      const duration = 10 + Math.random() * 20;
      const delay = Math.random() * 5;
      
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;
      particle.style.setProperty('--tx', `${endX - startX}vw`);
      particle.style.setProperty('--ty', `${endY - startY}vh`);
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      container?.appendChild(particle);
      particles.push(particle);
    }
    
    return () => particles.forEach(p => p.remove());
  }, []);
  
  return <div className="particle-bg" />;
}

// Data packet animation component
function DataPacket() {
  return (
    <div className="data-packet-container">
      <div className="data-packet">
        <div className="packet-core">
          <div className="packet-glow" />
          <div className="packet-ring" />
          <div className="packet-trail" />
          <div className="packet-icon">📦</div>
        </div>
      </div>
    </div>
  );
}

// Custom Cursor Component
function CustomCursor() {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      dotX += (mouseX - dotX) * 0.25;
      dotY += (mouseY - dotY) * 0.25;

      if (cursor) {
        cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
      }
      if (cursorDot) {
        cursorDot.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`;
      }

      if (Math.random() > 0.8) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${cursorX}px`;
        trail.style.top = `${cursorY}px`;
        document.body.appendChild(trail);
        
        setTimeout(() => trail.remove(), 500);
      }

      requestAnimationFrame(animate);
    };

    const handleMouseEnter = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('nav-item')) {
        setIsHovering(true);
      }
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);
    
    animate();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className={`cursor ${isHovering ? 'hover' : ''}`} />
      <div ref={cursorDotRef} className={`cursor-dot ${isHovering ? 'hover' : ''}`} />
    </>
  );
}

// Advanced Code Banner Component (with moving animation)
function AdvancedCodeBanner() {
  useEffect(() => {
    const container = document.querySelector('.matrix-rain-container');
    if (!container) return;

    const createMatrixChar = () => {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      char.style.left = `${Math.random() * 100}%`;
      char.style.animationDuration = `${2 + Math.random() * 3}s`;
      char.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(char);
      
      setTimeout(() => char.remove(), 5000);
    };

    const interval = setInterval(createMatrixChar, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = document.querySelector('.code-banner-particles');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'banner-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 100}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 100}px`);
      particle.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(particle);
    }
  }, []);

  return (
    <div className="code-banner-wrapper">
      <div className="code-banner">
        <div className="code-banner-bg" />
        <div className="code-banner-grid" />
        <div className="matrix-rain-container" />
        <div className="code-banner-particles" />
        
        <div className="code-banner-header">
          <div className="code-banner-dots">
            <div className="code-banner-dot" />
            <div className="code-banner-dot" />
            <div className="code-banner-dot" />
          </div>
          <div className="code-banner-title">
            <span>⚡</span>
            <span>og-miner-api.js</span>
          </div>
          <div className="code-banner-stats">
            <div className="code-banner-stat">
              <div className="code-banner-stat-dot" />
              <span>LIVE</span>
            </div>
            <div className="code-banner-stat">
              <span>45ms avg</span>
            </div>
          </div>
        </div>
        
        <div className="code-banner-content">
          <div className="code-banner-lines">
            {CODE_LINES.map((line, i) => (
              <div key={i} className="code-line">
                <span className="code-line-num">{line.num}</span>
                <div className="code-line-content">
                  {line.code.map((part, j) => (
                    <span key={j} className={`code-${part.type}`}>{part.text}</span>
                  ))}
                  {i === CODE_LINES.length - 1 && <span className="code-cursor" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// NEW: Terminal Code Tabs Component with Matrix Rain & Particles
function TerminalCodeTabs({ tabs, title }) {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);
  const matrixRef = useRef(null);
  const particlesRef = useRef(null);
  const cur = tabs.find(t => t.id === active);
  
  const copy = () => {
    navigator.clipboard.writeText(cur.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const container = matrixRef.current;
    if (!container) return;

    const createMatrixChar = () => {
      const char = document.createElement('div');
      char.className = 'terminal-matrix-char';
      char.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      char.style.left = `${Math.random() * 100}%`;
      char.style.animationDuration = `${2 + Math.random() * 3}s`;
      char.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(char);
      
      setTimeout(() => char.remove(), 5000);
    };

    const interval = setInterval(createMatrixChar, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'terminal-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 80}px`);
      particle.style.animationDelay = `${Math.random() * 4}s`;
      container.appendChild(particle);
    }
  }, []);

  return (
    <div className="terminal-code-block">
      <div className="terminal-code-bg" />
      <div className="terminal-code-grid" />
      <div className="terminal-matrix-rain" ref={matrixRef} />
      <div className="terminal-particles" ref={particlesRef} />
      
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot" />
          <div className="terminal-dot" />
          <div className="terminal-dot" />
        </div>
        <div className="terminal-title">{title || 'code'}</div>
      </div>
      
      <div className="terminal-tab-row">
        {tabs.map(t => (
          <button key={t.id} className={`terminal-tab-btn${active === t.id ? " on" : ""}`} onClick={() => setActive(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      
      <div className="terminal-code-content">
        <button className={`terminal-copy-btn${copied ? " done" : ""}`} onClick={copy}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
        <pre className="terminal-pre" dangerouslySetInnerHTML={{ __html: hi(cur.code, cur.lang) }} />
      </div>
    </div>
  );
}

// Simple Pre Block with terminal styling + Matrix Rain & Particles
function TerminalPre({ code, lang, title }) {
  const [copied, setCopied] = useState(false);
  const matrixRef = useRef(null);
  const particlesRef = useRef(null);
  
  const copy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    const container = matrixRef.current;
    if (!container) return;

    const createMatrixChar = () => {
      const char = document.createElement('div');
      char.className = 'terminal-matrix-char';
      char.textContent = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
      char.style.left = `${Math.random() * 100}%`;
      char.style.animationDuration = `${2 + Math.random() * 3}s`;
      char.style.animationDelay = `${Math.random() * 2}s`;
      container.appendChild(char);
      
      setTimeout(() => char.remove(), 5000);
    };

    const interval = setInterval(createMatrixChar, 250);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'terminal-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 80}px`);
      particle.style.setProperty('--ty', `${(Math.random() - 0.5) * 80}px`);
      particle.style.animationDelay = `${Math.random() * 4}s`;
      container.appendChild(particle);
    }
  }, []);

  return (
    <div className="terminal-code-block">
      <div className="terminal-code-bg" />
      <div className="terminal-code-grid" />
      <div className="terminal-matrix-rain" ref={matrixRef} />
      <div className="terminal-particles" ref={particlesRef} />
      
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot" />
          <div className="terminal-dot" />
          <div className="terminal-dot" />
        </div>
        <div className="terminal-title">{title || 'code'}</div>
      </div>
      
      <div className="terminal-code-content">
        <button className={`terminal-copy-btn${copied ? " done" : ""}`} onClick={copy}>
          {copied ? "✓ COPIED" : "COPY"}
        </button>
        <pre className="terminal-pre" dangerouslySetInnerHTML={{ __html: hi(code, lang) }} />
      </div>
    </div>
  );
}

const NAV = [
  { group: "Overview", items: [
    { id: "intro",    label: "Introduction" },
    { id: "features", label: "Features" },
  ]},
  { group: "API Reference", items: [
    { id: "endpoint", label: "POST /v1/extract" },
    { id: "params",   label: "Parameters" },
    { id: "response", label: "Response Schema" },
    { id: "errors",   label: "Error Codes" },
  ]},
  { group: "Guides", items: [
    { id: "g-link", label: "Link Preview Card" },
    { id: "g-spa",  label: "Handling SPAs" },
    { id: "g-err",  label: "Error Handling" },
  ]},
  { group: "Get Started", items: [
    { id: "apikey", label: "Get API Key" },
  ]},
];

const STATUS = [
  { code: 200, cls: "c200", msg: "Success. Metadata extracted." },
  { code: 400, cls: "c400", msg: "Invalid URL or Bad Request." },
  { code: 429, cls: "c429", msg: "Rate limit exceeded." },
  { code: 504, cls: "c504", msg: "Timeout. Target too slow." },
];

export default function App() {
  const [activeId, setActiveId] = useState("intro");
  const [theme, setTheme] = useState("dark");
  const mainRef = useRef(null);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    }
    setActiveId(id);
  };

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const ids = NAV.flatMap(g => g.items.map(i => i.id));
    const handler = () => {
      for (let i = ids.length - 1; i >= 0; i--) {
        const sec = document.getElementById(ids[i]);
        if (sec && sec.offsetTop - 120 <= el.scrollTop) { setActiveId(ids[i]); break; }
      }
    };
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const bc = (() => {
    for (const g of NAV) for (const it of g.items)
      if (it.id === activeId) return { group: g.group, label: it.label };
    return { group: "Overview", label: "Introduction" };
  })();

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <CustomCursor />
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <ParticleBackground />
        <DataPacket />
        <div className="scanline" />

        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <LogoSvg />
            </div>
            <span className="logo-text">OG Miner</span>
            <span className="logo-version">v1.0</span>
          </div>
          <nav className="sidebar-nav">
            {NAV.map(g => (
              <div key={g.group}>
                <div className="nav-group-label">{g.group}</div>
                {g.items.map(it => (
                  <button key={it.id} className={`nav-item${activeId === it.id ? " active" : ""}`} onClick={() => scrollTo(it.id)}>
                    <span className="nav-dot" />{it.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className="sys-status"><div className="sys-dot" />All systems operational</div>
          </div>
        </aside>

        <div className="main" ref={mainRef}>
          <div className="topbar">
            <div className="topbar-bc">
              <span>OG Miner</span><span className="sep">/</span>
              <span>{bc.group}</span><span className="sep">/</span>
              <span className="cur">{bc.label}</span>
            </div>
            <div className="topbar-btns">
              <button className="tb-btn" onClick={() => scrollTo("g-link")}>Guides</button>
              <button className="tb-btn" onClick={() => scrollTo("endpoint")}>Reference</button>
              <button className="tb-btn cta" onClick={() => scrollTo("apikey")}>Get API Key</button>
            </div>
          </div>

          <div className="content">
            <div className="hero" id="intro" style={{ scrollMarginTop: 100 }}>
              <div className="hero-grid" />
              <div className="hero-glow" />
              <div className="hero-glow-2" />
              <div className="hero-logo-float">
                <LogoSvg />
              </div>
              <div className="hero-tag"><div className="hero-tag-dot" />LIVE ON RAPIDAPI · v1.0</div>
              <h1 className="hero-h1">The <em>OpenGraph</em><br />Miner API</h1>
              <p className="hero-sub">
                Extract OpenGraph, JSON-LD, and oEmbed from any URL.<br />
                Handles redirects, SPAs, and bot protection automatically.
              </p>
              <div className="base-chip">
                <span className="base-chip-label">Base URL</span>
                <span className="base-chip-val">https://og-miner.p.rapidapi.com/</span>
              </div>
            </div>

            <AdvancedCodeBanner />

            <div id="features" style={{ scrollMarginTop: 100, marginBottom: 60 }}>
              <div className="sec-head">
                <div className="sec-eye">// capabilities</div>
                <h2 className="sec-h2">Features</h2>
                <div className="sec-rule" />
              </div>
              <div className="feat-grid">
                {[
                  { icon: "⚡", title: "High Performance",  desc: "FastAPI + Redis caching — sub-millisecond on repeat hits." },
                  { icon: "🤖", title: "Headless Browser",  desc: "Built-in Playwright renders JS-heavy SPAs and React apps." },
                  { icon: "🛡️", title: "Enterprise Ready", desc: "SSRF protection, rate limiting & User-Agent rotation built-in." },
                  { icon: "📦", title: "Rich Data",         desc: "JSON-LD, Favicons, Author data and oEmbed all included." },
                ].map((f, i) => (
                  <div key={i} className="feat">
                    <span className="feat-icon">{f.icon}</span>
                    <div className="feat-title">{f.title}</div>
                    <div className="feat-desc">{f.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div style={{ marginBottom: 8 }}>
              <div className="sec-head">
                <div className="sec-eye">// api reference</div>
                <h2 className="sec-h2">API Reference</h2>
                <div className="sec-rule" />
              </div>
            </div>

            <div className="key-notice">⚠ &nbsp;Replace <strong>YOUR_RAPIDAPI_KEY</strong> with your key from RapidAPI</div>

            <div id="endpoint" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block">
                <div className="ep-bar">
                  <span className="m-tag m-post">POST</span>
                  <span className="ep-path">/v1/extract</span>
                  <span className="ep-note">Main extraction endpoint</span>
                </div>
              </div>
              <TerminalCodeTabs 
                title="og-miner-api.sh"
                tabs={[
                  { id: "curl", label: "cURL",       code: CURL, lang: "bash" },
                  { id: "py",   label: "Python",     code: PY,   lang: "py"   },
                  { id: "js",   label: "JavaScript", code: JS,   lang: "js"   },
                ]} 
              />
            </div>

            <div id="params" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap">
                  <div className="tbl-lbl">// Request Parameters</div>
                  <table>
                    <thead><tr><th>Parameter</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        { name: "url",               req: true,  type: "string", def: "—",      desc: "The target URL to scrape." },
                        { name: "force_refresh",     req: false, type: "bool",   def: "false",  desc: "Skip cache and fetch fresh data from source." },
                        { name: "enable_javascript", req: false, type: "bool",   def: "false",  desc: "Use headless Playwright to render JS-heavy SPAs." },
                      ].map((p, i) => (
                        <tr key={i}>
                          <td><span className="p-name">{p.name}</span>{p.req && <span className="p-req">REQUIRED</span>}</td>
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

            <div id="response" style={{ scrollMarginTop: 100 }}>
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap"><div className="tbl-lbl">// Response Structure</div></div>
              </div>
              <TerminalPre 
                title="response.json"
                code={RESP_JSON}
                lang="json"
              />
              <div className="ep-block" style={{ marginBottom: 28 }}>
                <div className="tbl-wrap">
                  <div className="tbl-lbl">// Response Fields</div>
                  <table>
                    <thead><tr><th>Field</th><th>Description</th></tr></thead>
                    <tbody>
                      {[
                        ["meta.url",         "Resolved URL after following all redirects."],
                        ["meta.domain",      "Root domain extracted from the URL."],
                        ["meta.latency_ms",  "Total fetch-and-parse time, in milliseconds."],
                        ["data.title",       "Best title — OG → Twitter Card → HTML <title>."],
                        ["data.description", "Page description from OG or meta tags."],
                        ["data.image",       "Absolute URL to the social preview image."],
                        ["data.favicon",     "Absolute URL to the site favicon."],
                        ["data.site_name",   "Publisher name from og:site_name."],
                        ["data.oembed",      "Rich media — video ID, width, height (YouTube, Vimeo…)."],
                        ["data.json_ld",     "Structured data array: Recipe, Product, Event schemas."],
                      ].map(([f, d], i) => (
                        <tr key={i}><td><span className="f-name">{f}</span></td><td>{d}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div id="errors" style={{ scrollMarginTop: 100, marginBottom: 56 }}>
              <div className="tbl-lbl" style={{ marginBottom: 14 }}>// HTTP Status Codes</div>
              <div className="sc-row">
                {STATUS.map((s, i) => (
                  <div key={i} className="sc">
                    <div className={`sc-code ${s.cls}`}>{s.code}</div>
                    <div className="sc-msg">{s.msg}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider" />

            <div style={{ marginBottom: 8 }}>
              <div className="sec-head">
                <div className="sec-eye">// use cases</div>
                <h2 className="sec-h2">Guides & Use Cases</h2>
                <div className="sec-rule" />
              </div>
            </div>

            <div id="g-link" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 01</span>
                <h3 className="guide-title">Building a Link Preview Card</h3>
                <p className="guide-body">
                  Generate social media–style preview cards for your chat app or forum.
                  Pull <code>data.image</code>, <code>data.title</code>, and <code>data.description</code> to render rich unfurl cards instantly.
                </p>
              </div>
              <TerminalPre 
                title="LinkCard.jsx"
                code={LINK_CODE}
                lang="js"
              />
            </div>

            <div id="g-spa" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 02</span>
                <h3 className="guide-title">Handling Single Page Apps (SPAs)</h3>
                <p className="guide-body">
                  Standard scrapers fail on Instagram, TikTok, or React apps — they return empty HTML shells.
                  OG Miner solves this with the <code>enable_javascript</code> flag, spinning up a Playwright
                  headless browser to fully render the page before extracting metadata.
                </p>
              </div>
              <TerminalPre 
                title="spa-scraping.js"
                code={SPA_CODE}
                lang="js"
              />
              <div className="guide">
                <div className="warn">
                  <span>⚠</span>
                  <span>Headless requests take <strong>2–5 seconds</strong> longer and may use additional credits on paid plans. Use <code>force_refresh: false</code> to serve from cache wherever possible.</span>
                </div>
              </div>
            </div>

            <div id="g-err" style={{ scrollMarginTop: 100 }}>
              <div className="guide">
                <span className="guide-num">GUIDE 03</span>
                <h3 className="guide-title">Error Handling Best Practices</h3>
                <p className="guide-body">
                  Implement exponential backoff for <code style={{color:"var(--red)"}}>429</code> responses,
                  validate URLs client-side to avoid <code style={{color:"var(--amber)"}}>400</code> errors,
                  and set timeouts to gracefully handle <code style={{color:"var(--red-mid)"}}>504</code> timeouts from slow target sites.
                </p>
                <div className="sc-row" style={{ marginTop: 0, marginBottom: 0 }}>
                  {STATUS.map((s, i) => (
                    <div key={i} className="sc">
                      <div className={`sc-code ${s.cls}`}>{s.code}</div>
                      <div className="sc-msg">{s.msg}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="cta-block" id="apikey" style={{ scrollMarginTop: 100 }}>
              <div className="cta-eye">// ready to ship?</div>
              <h2 className="cta-h2">Get Your <em>API Key</em></h2>
              <p className="cta-sub">Available on RapidAPI · Free tier included</p>
              <div className="cta-btns">
                <a className="btn-p" href="https://rapidapi.com" target="_blank" rel="noreferrer">⚡ GET API KEY →</a>
                <a className="btn-s" href="https://github.com" target="_blank" rel="noreferrer">⭐ Star on GitHub</a>
              </div>
            </div>
          </div>

          <footer className="footer">
            <div className="footer-copy">
              © 2026 OG Miner &nbsp;·&nbsp; Docs v1.0 &nbsp;·&nbsp; built with <em>🧡</em> by sasmithaK
            </div>
            <div className="footer-links">
              <a className="footer-link" href="https://github.com" target="_blank" rel="noreferrer">⌥ GitHub</a>
              <a className="footer-link" href="https://linkedin.com" target="_blank" rel="noreferrer">↗ LinkedIn</a>
              <a className="footer-link" href="https://rapidapi.com" target="_blank" rel="noreferrer">⚡ RapidAPI</a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}