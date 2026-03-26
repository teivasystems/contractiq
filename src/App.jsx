import { useState, useRef, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, PieChart, Pie, Cell } from "recharts";

/*
 * ═══════════════════════════════════════════════════════════════
 * ContractIQ — ServiceNow Next Experience / Polaris Theme
 * Full workspace mockup using framework design tokens & components
 * ═══════════════════════════════════════════════════════════════
 */

/* ── Polaris Design Tokens ─────────────────────────────────── */
const T = {
  white: "#ffffff", surface0: "#ffffff", surface1: "#f4f5f7",
  surface2: "#e9eaed", surface3: "#dfe0e4",
  headerBg: "#1b2a3e", workspaceTabBg: "#2d3a4a",
  chromeDivider: "#dadce0", chromeDividerSubtle: "#ecedf0",
  textPrimary: "#1e1e20", textSecondary: "#53535a",
  textTertiary: "#8b8d97", textOnDark: "#ffffff",
  textLink: "#0b60b0", textLinkHover: "#064a8a",
  brandPrimary: "#0b60b0", brandPrimaryHover: "#064a8a",
  brandTeal: "#4fd1c5", brandTealDark: "#29b6b0",
  positive: "#1a7d36", positiveBg: "#e6f4ea",
  warning: "#f0b323", warningBg: "#fff8e6",
  negative: "#c1272d", negativeBg: "#fde8e8",
  info: "#0b60b0", infoBg: "#e5f0fa",
  orange: "#e8712a", orangeLight: "#fff3ec", orangeBorder: "#f0883e",
  purple: "#6246ea", purpleLight: "#f0edff",
  elevLow: "0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.04)",
  elevMed: "0 2px 4px rgba(0,0,0,.07), 0 4px 12px rgba(0,0,0,.05)",
  rSm: "4px", rMd: "8px", rLg: "12px", rPill: "999px",
  s1: "4px", s2: "8px", s3: "12px", s4: "16px", s5: "20px",
  s6: "24px", s7: "32px", s8: "40px", s9: "48px",
  font: "'Source Sans 3', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
};

/* ── SVG Icons ─────────────────────────────────────────────── */
const I = ({ n, s = 18, c = "currentColor", sw = 2 }) => {
  const d = {
    home: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1h-2z",
    list: "M4 6h16M4 10h16M4 14h16M4 18h16",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    plus: "M12 4v16m8-8H4",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    help: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01",
    user: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    star: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    globe: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    chevDown: "M19 9l-7 7-7-7",
    chevRight: "M9 5l7 7-7 7",
    close: "M6 18L18 6M6 6l12 12",
    sparkle: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z",
    calendar: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5",
    filter: "M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z",
    chart: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    pencil: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125",
    flag: "M3 3v18m0-18l9 6-9 6",
    refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    check: "M4.5 12.75l6 6 9-13.5",
    chatBubble: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z",
    bookmark: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z",
    dotMenu: "M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z",
    externalLink: "M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25",
    upload: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5",
    download: "M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3",
    shield: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
    target: "M12 21a9 9 0 100-18 9 9 0 000 18zm0-4.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0-2.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z",
    bot: "M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm7.5-9.75h.008v.008H15zm-3 0h.008v.008H12zm-3 0h.008v.008H9z",
    arrowRight: "M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3",
    arrowUp: "M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18",
    arrowDown: "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3",
    send: "M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5",
    database: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125",
    layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    zap: "M13 2L3 14h9l-1 10 10-12h-9l1-10z",
    dollarSign: "M12 2v20m5-17H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7",
    users: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
    briefcase: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z",
    gradCap: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15v-3.75m0 0h-.008v.008H6.75v-.008zm0 0L12 8.25l5.25 3",
    loader: "M12 6V3m0 18v-3m-6-6H3m18 0h-3m-1.636-4.364L14.828 8.172m-5.656 7.656l-1.536 1.536m0-10.728l1.536 1.536m7.192 7.192l1.536 1.536",
    eye: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z",
    msgCircle: "M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    alertTriangle: "M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z",
    info: "M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z",
    checkCircle: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}><path d={d[n]||""} /></svg>;
};

/* ── Decorative Pattern ──────────────────────────────────── */
const DecoPattern = ({ variant = "dark" }) => {
  const isLight = variant === "light";
  return (
    <svg style={{ position: "absolute", top: 0, right: 0, width: 420, height: "100%", opacity: isLight ? 0.5 : 0.3, pointerEvents: "none" }} viewBox="0 0 420 300" fill="none">
      <circle cx="320" cy="60" r="50" stroke={isLight ? "#b8c9d9" : "rgba(255,255,255,.15)"} strokeWidth="1" />
      <circle cx="380" cy="140" r="30" stroke={isLight ? "#c5dbe8" : "rgba(255,255,255,.1)"} strokeWidth="1" />
      <circle cx="280" cy="180" r="70" stroke={isLight ? "#c0d4e3" : "rgba(255,255,255,.08)"} strokeWidth="1" />
      <circle cx="350" cy="250" r="20" stroke={isLight ? "#b8c9d9" : "rgba(255,255,255,.12)"} strokeWidth="1" />
      <circle cx="250" cy="40" r="8" fill={isLight ? "#b8c9d9" : "rgba(255,255,255,.15)"} />
      <circle cx="400" cy="200" r="5" fill={isLight ? "#c0d4e3" : "rgba(255,255,255,.12)"} />
      <circle cx="300" cy="120" r="4" fill={isLight ? "#9fb8cc" : "rgba(255,255,255,.2)"} />
      <line x1="280" y1="80" x2="350" y2="130" stroke={isLight ? "#c5dbe8" : "rgba(255,255,255,.06)"} strokeWidth="1" />
      <line x1="320" y1="160" x2="380" y2="100" stroke={isLight ? "#c5dbe8" : "rgba(255,255,255,.06)"} strokeWidth="1" />
      <circle cx="260" cy="90" r="3" fill={isLight ? "#e493a0" : "#e87e8f"} opacity="0.5" />
      <circle cx="370" cy="70" r="2.5" fill={isLight ? "#7ec8c8" : "#4fd1c5"} opacity="0.4" />
      <circle cx="310" cy="200" r="3.5" fill={isLight ? "#a0b4d0" : "rgba(255,255,255,.15)"} opacity="0.5" />
    </svg>
  );
};

/* ── ServiceNow Logo ─────────────────────────────────────── */
const SNLogo = () => (
  <svg width="26" height="26" viewBox="0 0 32 32">
    <circle cx="16" cy="6" r="3.5" fill="#81b5a1" />
    <circle cx="6" cy="12" r="3.5" fill="#81b5a1" />
    <circle cx="26" cy="12" r="3.5" fill="#81b5a1" />
    <circle cx="9" cy="23" r="3.5" fill="#81b5a1" />
    <circle cx="23" cy="23" r="3.5" fill="#81b5a1" />
    <circle cx="16" cy="16" r="3.5" fill="#fff" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════
   CHROME: SNHeader
   ═══════════════════════════════════════════════════════════ */
const SNHeader = ({ appName = "ContractIQ" }) => (
  <header style={{ height: 48, minHeight: 48, background: T.headerBg, display: "flex", alignItems: "center", padding: `0 ${T.s4}`, gap: T.s2, zIndex: 100, flexShrink: 0 }}>
    <div style={{ display: "flex", alignItems: "center", gap: T.s2, marginRight: T.s4 }}>
      <SNLogo />
      <span style={{ color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-.2px" }}>ServiceNow</span>
    </div>
    {["All", "Favorites", "History", "Admin"].map(l => (
      <button key={l} style={{ background: "none", border: "none", color: "rgba(255,255,255,.78)", fontSize: 13, fontWeight: 500, padding: `${T.s1} ${T.s3}`, cursor: "pointer", borderRadius: T.rSm, fontFamily: T.font }}>{l}</button>
    ))}
    <button style={{ background: "none", border: "none", color: "rgba(255,255,255,.45)", cursor: "pointer", padding: T.s1 }}><I n="dotMenu" s={18} c="rgba(255,255,255,.45)" /></button>
    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: T.s2, background: "rgba(255,255,255,.07)", padding: `5px ${T.s5}`, borderRadius: T.rPill, border: "1px solid rgba(255,255,255,.1)" }}>
        <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{appName}</span>
        <I n="star" s={14} c="rgba(255,255,255,.45)" />
      </div>
    </div>
    <div style={{ textAlign: "right", lineHeight: 1.3, marginRight: T.s3 }}>
      <div style={{ fontWeight: 600, color: "rgba(255,255,255,.78)", fontSize: 11 }}>Application scope: ContractIQ</div>
      <div style={{ color: "#e86060", fontSize: 11, fontWeight: 600 }}>Update set: ContractIQ v0.1</div>
    </div>
    <button style={{ background: "none", border: "none", cursor: "pointer", padding: T.s1 }}><I n="search" s={18} c="rgba(255,255,255,.65)" /></button>
    <div style={{ position: "relative" }}>
      <button style={{ background: "none", border: `2px solid ${T.negative}`, borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}><I n="globe" s={15} c="rgba(255,255,255,.75)" /></button>
      <span style={{ position: "absolute", top: -3, right: -5, background: T.negative, color: "#fff", fontSize: 9, fontWeight: 700, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>3</span>
    </div>
    {["plus", "chatBubble", "bookmark", "help", "bell"].map(icon => (
      <button key={icon} style={{ background: "none", border: "none", cursor: "pointer", padding: T.s1, borderRadius: T.rSm, display: "flex", alignItems: "center", justifyContent: "center" }}><I n={icon} s={18} c="rgba(255,255,255,.65)" /></button>
    ))}
    <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,.85)", border: "1px solid rgba(255,255,255,.2)", cursor: "pointer", marginLeft: 2 }}>KB</div>
  </header>
);

/* ═══════════════════════════════════════════════════════════
   CHROME: WorkspaceTabBar (teal underline on active)
   ═══════════════════════════════════════════════════════════ */
const WorkspaceTabBar = ({ tabs, active, onChange, badge }) => (
  <nav style={{ display: "flex", alignItems: "stretch", background: T.workspaceTabBg, height: 42, minHeight: 42, paddingLeft: T.s4, gap: 0, flexShrink: 0 }}>
    {tabs.map(t => {
      const isActive = active === t.id;
      return (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          background: isActive ? "rgba(255,255,255,.08)" : "none",
          border: "none", borderBottom: isActive ? `3px solid ${T.brandTeal}` : "3px solid transparent",
          color: isActive ? "#fff" : "rgba(255,255,255,.65)",
          fontSize: 14, fontWeight: isActive ? 600 : 400, padding: `0 ${T.s5}`,
          cursor: "pointer", fontFamily: T.font, transition: "all .15s",
          display: "flex", alignItems: "center", gap: T.s2,
        }}>
          {t.label}
          {t.id === "alerts" && badge > 0 && <span style={{ background: T.negative, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, minWidth: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{badge}</span>}
        </button>
      );
    })}
  </nav>
);

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS: Card, Badge, Btn, Progress
   ═══════════════════════════════════════════════════════════ */
const Card = ({ children, style: sx, noPad, onClick }) => (
  <div onClick={onClick} style={{
    background: T.surface0, borderRadius: T.rMd,
    border: `1px solid ${T.chromeDivider}`,
    boxShadow: T.elevLow,
    padding: noPad ? 0 : T.s5, cursor: onClick ? "pointer" : "default",
    transition: "box-shadow .15s", ...sx,
  }}
  onMouseEnter={e => { if (onClick) e.currentTarget.style.boxShadow = T.elevMed; }}
  onMouseLeave={e => { e.currentTarget.style.boxShadow = T.elevLow; }}
  >{children}</div>
);

const Badge = ({ children, variant = "info", style: sx }) => {
  const m = {
    info: { bg: T.infoBg, fg: T.brandPrimary },
    success: { bg: T.positiveBg, fg: T.positive },
    warning: { bg: T.warningBg, fg: "#a06c00" },
    critical: { bg: T.negativeBg, fg: T.negative },
    neutral: { bg: T.surface2, fg: T.textSecondary },
    brand: { bg: T.brandTealDark, fg: "#fff" },
    orange: { bg: T.orangeLight, fg: T.orange },
    purple: { bg: T.purpleLight, fg: T.purple },
    count: { bg: T.surface2, fg: T.textSecondary },
  };
  const c = m[variant] || m.info;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: T.rPill, fontSize: 12, fontWeight: 600, lineHeight: "20px", background: c.bg, color: c.fg, whiteSpace: "nowrap", ...sx }}>{children}</span>;
};

const Btn = ({ children, variant = "primary", small, icon, onClick, disabled, style: sx }) => {
  const base = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: T.s2, borderRadius: T.rMd, fontSize: small ? 12 : 14, fontWeight: 600, fontFamily: T.font, cursor: disabled ? "not-allowed" : "pointer", height: small ? 28 : 36, padding: small ? `0 ${T.s3}` : `0 ${T.s4}`, border: "1px solid transparent", transition: "all .15s", whiteSpace: "nowrap", opacity: disabled ? 0.5 : 1 };
  const vars = {
    primary: { background: T.headerBg, color: "#fff", borderColor: T.headerBg },
    secondary: { background: T.surface0, color: T.textPrimary, borderColor: T.chromeDivider },
    ghost: { background: "none", color: T.textSecondary, borderColor: "transparent" },
    outline: { background: T.surface0, color: T.brandPrimary, borderColor: T.brandPrimary },
    link: { background: "none", color: T.textLink, borderColor: "transparent", padding: "0 4px", height: "auto" },
    danger: { background: T.surface0, color: T.negative, borderColor: T.negative },
    teal: { background: T.brandTealDark, color: "#fff", borderColor: T.brandTealDark },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...vars[variant], ...sx }}>{icon && <I n={icon} s={small ? 13 : 15} />}{children}</button>;
};

const Progress = ({ value, max, height = 4 }) => {
  const pct = Math.min((value / max) * 100, 100);
  const c = pct > 85 ? T.negative : pct > 65 ? T.warning : T.positive;
  return <div style={{ background: T.surface2, borderRadius: 2, height, width: "100%" }}><div style={{ background: c, height: "100%", width: `${pct}%`, borderRadius: 2, transition: "width .6s" }} /></div>;
};

const SevIcon = ({ severity, size = 14 }) => severity === "critical" ? <I n="alertTriangle" s={size} c={T.negative} /> : severity === "warning" ? <I n="alertTriangle" s={size} c={T.warning} /> : <I n="info" s={size} c={T.brandPrimary} />;

/* ── Layout Helper: Main + Right Sidebar (280px) ── */
const WorkspaceLayout = ({ children, sidebar }) => {
  if (!sidebar) return <div>{children}</div>;
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: T.s4, alignItems: "start" }}><div>{children}</div><div style={{ display: "flex", flexDirection: "column", gap: T.s3 }}>{sidebar}</div></div>;
};

/* Spinner for processing */
function Spinner({ children }) {
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (!el) return; let a = 0, r; const f = () => { a = (a + 4) % 360; el.style.transform = `rotate(${a}deg)`; r = requestAnimationFrame(f); }; r = requestAnimationFrame(f); return () => cancelAnimationFrame(r); }, []);
  return <div ref={ref} style={{ display: "inline-flex" }}>{children}</div>;
}

/* ── Helpers ── */
const fN = n => { if (n >= 1e6) return (n / 1e6).toFixed(1) + "M"; if (n >= 1e3) return (n / 1e3).toFixed(0) + "K"; return n.toString(); };
const fC = n => "€" + n.toLocaleString();
const sColor = s => s === "healthy" ? T.positive : s === "warning" ? T.warning : T.negative;

/* ═══════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════ */
const CONTRACTS = [
  { id: "C001", name: "ServiceNow Enterprise Suite 2024-2027", number: "SNW-2024-ENT-4821", type: "Renewal", status: "Active", startDate: "2024-03-15", endDate: "2027-03-14", anniversary: "March 15", acv: 842000, tcv: 2526000, daysRemaining: 383, healthScore: 62 },
  { id: "C002", name: "Now Assist Add-On 2024", number: "SNW-2024-NA-1205", type: "Add-On", status: "Active", startDate: "2024-06-01", endDate: "2027-03-14", anniversary: "June 1", acv: 185000, tcv: 510000, daysRemaining: 383, healthScore: 41 },
];
const ENTITLEMENTS = [
  { id: "E001", contract: "C001", name: "ITSM Fulfiller Licenses", category: "User License", purchased: 250, used: 218, unit: "Users", expiry: "2027-03-14", resetCycle: "None", status: "healthy", iconName: "users" },
  { id: "E002", contract: "C001", name: "ITSM Approver Licenses", category: "User License", purchased: 500, used: 312, unit: "Users", expiry: "2027-03-14", resetCycle: "None", status: "healthy", iconName: "users" },
  { id: "E003", contract: "C001", name: "Custom Tables (App Engine)", category: "Capacity", purchased: 100, used: 73, unit: "Tables", expiry: "2027-03-14", resetCycle: "None", status: "warning", iconName: "database" },
  { id: "E004", contract: "C001", name: "Integration Hub Transactions", category: "Consumption", purchased: 500000, used: 387420, unit: "Transactions/yr", expiry: "2025-03-14", resetCycle: "Annual", status: "warning", iconName: "zap" },
  { id: "E005", contract: "C002", name: "Now Assist (Assists)", category: "Consumption", purchased: 200000, used: 48200, unit: "Assists/yr", expiry: "2025-06-01", resetCycle: "Annual", status: "critical", iconName: "zap" },
  { id: "E006", contract: "C001", name: "Learning Credits", category: "Training", purchased: 800, used: 120, unit: "Credits", expiry: "2025-03-14", resetCycle: "Annual", status: "critical", iconName: "gradCap" },
  { id: "E007", contract: "C001", name: "Expert Services Hours", category: "Service", purchased: 200, used: 45, unit: "Hours", expiry: "2027-03-14", resetCycle: "Term", status: "critical", iconName: "briefcase" },
  { id: "E008", contract: "C001", name: "Storage Allocation", category: "Capacity", purchased: 500, used: 234, unit: "GB", expiry: "2027-03-14", resetCycle: "None", status: "healthy", iconName: "database" },
  { id: "E009", contract: "C001", name: "PA Indicators", category: "Capacity", purchased: 50, used: 38, unit: "Indicators", expiry: "2027-03-14", resetCycle: "None", status: "warning", iconName: "chart" },
];
const ALERTS = [
  { id: "A001", severity: "critical", title: "Learning Credits expiring in 19 days", subtitle: "800 credits purchased, only 120 used (15%). €5,440 value at risk.", entitlement: "E006", date: "Feb 23", action: "Plan training sessions" },
  { id: "A002", severity: "critical", title: "Now Assist severely underutilized", subtitle: "Only 24% consumed with 97 days remaining.", entitlement: "E005", date: "Feb 22", action: "Expand deployment" },
  { id: "A003", severity: "warning", title: "Integration Hub approaching 80% threshold", subtitle: "387,420 / 500,000 transactions used.", entitlement: "E004", date: "Feb 21", action: "Review integrations" },
  { id: "A004", severity: "warning", title: "Custom table count at 73% capacity", subtitle: "73 of 100 tables in use.", entitlement: "E003", date: "Feb 20", action: "Audit scoped apps" },
  { id: "A005", severity: "info", title: "Contract renewal window opens in 383 days", subtitle: "Begin renewal preparation.", entitlement: null, date: "Feb 19", action: "Start renewal cockpit" },
  { id: "A006", severity: "info", title: "Expert Services: only 22.5% utilized", subtitle: "45 of 200 hours consumed.", entitlement: "E007", date: "Feb 18", action: "Schedule sessions" },
];
const USAGE_TREND = [
  { month: "Mar 24", fulfiller: 195, assists: 0, ihub: 28500, credits: 800 }, { month: "Jun 24", fulfiller: 202, assists: 8200, ihub: 71200, credits: 720 },
  { month: "Sep 24", fulfiller: 208, assists: 19500, ihub: 148300, credits: 680 }, { month: "Dec 24", fulfiller: 212, assists: 28100, ihub: 223800, credits: 580 },
  { month: "Mar 25", fulfiller: 215, assists: 34800, ihub: 312400, credits: 450 }, { month: "Jun 25", fulfiller: 218, assists: 38900, ihub: 350100, credits: 320 },
  { month: "Sep 25", fulfiller: 220, assists: 42500, ihub: 367200, credits: 200 }, { month: "Dec 25", fulfiller: 218, assists: 46100, ihub: 378900, credits: 150 },
  { month: "Feb 26", fulfiller: 218, assists: 48200, ihub: 387420, credits: 120 },
];
const RENEWAL_DATA = { scores: [{ name: "ITSM Fulfillers", score: 87, rec: "Right-sized. Consider slight reduction." }, { name: "ITSM Approvers", score: 62, rec: "Over-provisioned. Reduce by ~150." }, { name: "Custom Tables", score: 73, rec: "Adequate. Monitor Store installs." }, { name: "IHub Transactions", score: 77, rec: "Approaching limit. Negotiate +20%." }, { name: "Now Assist", score: 24, rec: "Severely underutilized. Expand or reduce." }, { name: "Learning Credits", score: 15, rec: "Near-total waste. Restructure urgently." }, { name: "Expert Services", score: 23, rec: "Underutilized. Schedule remaining hours." }, { name: "Storage", score: 47, rec: "Healthy headroom. No action." }], savings: [{ area: "Approver License Right-sizing", amount: 67500, type: "reduction" }, { area: "Now Assist Budget Optimization", amount: 96200, type: "reduction" }, { area: "Learning Credits Utilization", amount: 54400, type: "recovery" }, { area: "Expert Services Utilization", amount: 31000, type: "recovery" }] };
const ASSIST_BURNDOWN = [
  { month: "Jun 25", burned: 0, budget: 200000 }, { month: "Jul 25", burned: 2100, budget: 200000 }, { month: "Aug 25", burned: 5800, budget: 200000 }, { month: "Sep 25", burned: 10200, budget: 200000 },
  { month: "Oct 25", burned: 18400, budget: 200000 }, { month: "Nov 25", burned: 26800, budget: 200000 }, { month: "Dec 25", burned: 34100, budget: 200000 }, { month: "Jan 26", burned: 41200, budget: 200000 }, { month: "Feb 26", burned: 48200, budget: 200000 },
];
const ASSIST_SKILLS = [
  { skill: "Incident Summarization", assists: 22100, pct: 46, runs: 22100, category: "ITSM" },
  { skill: "Code Assist (AutoComplete)", assists: 11050, pct: 23, runs: 14200, category: "Platform" },
  { skill: "Custom Skills (8 active)", assists: 8180, pct: 17, runs: 6540, category: "Custom" },
  { skill: "Agentic Workflows", assists: 4350, pct: 9, runs: 104, category: "Agentic" },
  { skill: "Document Q&A", assists: 1540, pct: 3, runs: 1540, category: "Platform" },
  { skill: "Other (Virtual Agent, etc.)", assists: 980, pct: 2, runs: 3200, category: "Self-Service" },
];
const ASSIST_ENVS = [{ name: "Production", value: 31400, pct: 65 }, { name: "Sub-Production", value: 16800, pct: 35 }];
const ASSIST_AGENTS = [
  { name: "Incident Triage Agent", runs: 42, size: "Small", actionsPerRun: 3, assistsPerRun: 25, total: 1050, trend: "+12%" },
  { name: "Change Risk Assessment", runs: 28, size: "Medium", actionsPerRun: 6, assistsPerRun: 50, total: 1400, trend: "+8%" },
  { name: "Knowledge Article Agent", runs: 22, size: "Medium", actionsPerRun: 7, assistsPerRun: 50, total: 1100, trend: "+22%" },
  { name: "Onboarding Orchestrator", runs: 12, size: "Large", actionsPerRun: 14, assistsPerRun: 150, total: 1800, trend: "new" },
];
const EXTRACTION_STEPS = [{ label: "Reading document structure...", duration: 1800 }, { label: "Extracting contract metadata...", duration: 1400 }, { label: "Identifying entitlement line items...", duration: 2200 }, { label: "Mapping to ServiceNow SKU catalog...", duration: 1600 }, { label: "Detecting reset cycles & anniversaries...", duration: 1200 }, { label: "Cross-referencing platform usage data...", duration: 2000 }, { label: "Calculating value realization scores...", duration: 1400 }, { label: "Generating alert rules...", duration: 1000 }, { label: "Building renewal recommendations...", duration: 1200 }];
const EXTRACTED_FIELDS = [{ label: "Contract Name", value: "ServiceNow Enterprise Suite 2024-2027", confidence: 98 }, { label: "Contract Number", value: "SNW-2024-ENT-4821", confidence: 97 }, { label: "Type", value: "Renewal", confidence: 94 }, { label: "Start Date", value: "2024-03-15", confidence: 99 }, { label: "End Date", value: "2027-03-14", confidence: 99 }, { label: "Anniversary", value: "March 15 (Annual)", confidence: 92 }, { label: "Annual Contract Value", value: "€842,000", confidence: 96 }, { label: "Total Contract Value", value: "€2,526,000", confidence: 96 }];
const EXTRACTED_ENTITLEMENTS = [{ name: "ITSM Fulfiller Licenses", category: "User License", qty: "250 Users", reset: "None", confidence: 98 }, { name: "ITSM Approver Licenses", category: "User License", qty: "500 Users", reset: "None", confidence: 97 }, { name: "Custom Tables (App Engine)", category: "Capacity", qty: "100 Tables", reset: "None", confidence: 95 }, { name: "Integration Hub Transactions", category: "Consumption", qty: "500,000 / yr", reset: "Annual", confidence: 96 }, { name: "Learning Credits", category: "Training", qty: "800 Credits", reset: "12-month", confidence: 93 }, { name: "Expert Services Hours", category: "Service", qty: "200 Hours", reset: "Term", confidence: 91 }, { name: "Storage Allocation", category: "Capacity", qty: "500 GB", reset: "None", confidence: 94 }, { name: "PA Indicators", category: "Capacity", qty: "50 Indicators", reset: "None", confidence: 88 }];

/* VA Chat Conversations */
const VA_CONVERSATIONS = [
  {
    id: "budget", label: "Budget Status",
    prompt: "What's our Now Assist budget status? Are we on track?",
    messages: [
      { role: "user", text: "What's our Now Assist budget status? Are we on track?" },
      { role: "assistant", text: null, widget: "budget_summary" },
      { role: "assistant", text: "You've consumed **48,200 of 200,000 assists** (24%) with 73% of the contract year elapsed. That's significantly under the expected pace.\n\nAt the current burn rate of ~5,800 assists/month, you'll reach approximately **70,500 assists** by the June 1 reset — just **35% utilization**.\n\nThis means **€119,900 of your €185,000 investment** is projected to go unused this contract year. The budget resets on June 1 with no rollover.\n\n**Recommended actions:**\n• Expand Incident Summarization to all ITSM queues (currently partial)\n• Activate Code Assist for the Platform team (28 developers, currently 12 enabled)\n• Consider negotiating a reduced entitlement at renewal to right-size costs" },
      { role: "user", text: "What would happen if we enabled Code Assist for all 28 developers?" },
      { role: "assistant", text: "Based on current usage patterns, your 12 enabled developers generate approximately **920 assists/month** from Code Assist — roughly 77 per developer.\n\nAdding 16 more developers at the same rate would add an estimated **1,230 assists/month**, bringing Code Assist from ~11,050 to approximately **15,000 assists** by end of contract year.\n\nYour total projected consumption would increase from 70,500 to approximately **74,400 assists** (37%) — still well within the 200K budget. The financial impact: **€3,600 additional value realized** from the existing entitlement at zero incremental cost.\n\nThis is a low-risk, high-value activation. I'd recommend proceeding." },
    ]
  },
  {
    id: "agents", label: "Agent Costs",
    prompt: "Which AI agents are costing us the most?",
    messages: [
      { role: "user", text: "Which AI agents are costing us the most? Any optimization opportunities?" },
      { role: "assistant", text: null, widget: "agent_table" },
      { role: "assistant", text: "Your **4 active agents** consumed **4,350 assists** this period (9% of total). Here's the cost breakdown:\n\n**Onboarding Orchestrator** is your most expensive agent — 12 runs consumed 1,800 assists at **€1,665 total** (150 assists/run, Large tier). It uses 14 tool invocations per run.\n\n**Key optimization opportunity:** The Onboarding Orchestrator could potentially be split into two smaller agents. If you reduce the actions from 14 to two workflows of 7 each, each run drops from 150 to 50 assists — a **67% cost reduction per execution**. Over 12 runs, that saves 1,200 assists (€1,110)." },
      { role: "user", text: "What's the design guideline for keeping agents cost-efficient?" },
      { role: "assistant", text: "The ServiceNow assist pricing has three tiers based on **tool invocations per run**:\n\n| Tier | Actions | Assists/Run | Cost |\n|------|---------|-------------|------|\n| Small | 1–4 | 25 | €23.13 |\n| Medium | 5–8 | 50 | €46.25 |\n| Large | 9–20 | 150 | €138.75 |\n\nThe jump from Medium to Large is **3x** — that's where the biggest cost risk lives.\n\n**Design guidelines:**\n• Target ≤4 actions per agent (Small tier) wherever possible\n• If >4 actions needed, keep under 9 to stay Medium\n• Consider splitting complex workflows into chained smaller agents\n• Add action-count monitoring to your CI/CD pipeline" },
    ]
  },
  {
    id: "subprod", label: "Sub-Prod Risk",
    prompt: "How exposed are we on sub-production usage?",
    messages: [
      { role: "user", text: "I heard sub-production usage counts toward our budget. How exposed are we?" },
      { role: "assistant", text: null, widget: "env_split" },
      { role: "assistant", text: "Yes — this is a significant governance finding. **35% of your total assist consumption (16,800 assists) is coming from sub-production environments** — dev, test, and UAT.\n\nAt €0.93 per assist, that's **€15,540 of your budget** spent on non-production usage. ServiceNow does not discount or exclude dev/test usage.\n\n**Why this matters:** You're already underutilizing at 24%. Burning 35% in sub-prod means actual production utilization is roughly **16%** on a €185K investment." },
      { role: "user", text: "What can we do to control sub-prod usage?" },
      { role: "assistant", text: "Here are four governance controls I'd recommend:\n\n**1. Gated test policies** — Disable Now Assist in dev/test by default. Use sys_properties to toggle per instance.\n\n**2. Sample-size testing** — Test with representative samples instead of full regression. Reduces sub-prod consumption by 80–90%.\n\n**3. Test budget allocation** — Set internal policy: max 10% of annual assist budget for sub-prod (20,000 assists).\n\n**4. Monthly sub-prod reporting** — ContractIQ already shows this split. Alert if sub-prod exceeds 15% of total.\n\nShall I draft these as governance policies for your development leads?" },
    ]
  },
];

const TABS = [
  { id: "dashboard", label: "Home" }, { id: "contracts", label: "Contracts" },
  { id: "entitlements", label: "Entitlements" }, { id: "usage", label: "Usage Tracker" },
  { id: "alerts", label: "Alerts" }, { id: "renewal", label: "Renewal Cockpit" },
  { id: "settings", label: "Configuration" },
];

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function App() {
  const [appState, setAppState] = useState("empty");
  const [page, setPage] = useState("dashboard");
  const [selContract, setSelContract] = useState(null);
  const [selEntitlement, setSelEntitlement] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [dismissed, setDismissed] = useState([]);
  const [procStep, setProcStep] = useState(0);
  const [procDone, setProcDone] = useState(false);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const timerRef = useRef(null);

  const startProcessing = () => { setAppState("processing"); setProcStep(0); setProcDone(false); };
  useEffect(() => { if (appState !== "processing") return; if (procStep >= EXTRACTION_STEPS.length) { setProcDone(true); return; } timerRef.current = setTimeout(() => setProcStep(s => s + 1), EXTRACTION_STEPS[procStep].duration); return () => clearTimeout(timerRef.current); }, [appState, procStep]);

  const nav = (p, opts = {}) => { setPage(p); if (opts.contract) setSelContract(opts.contract); else if (p === "contracts") setSelContract(null); if (opts.entitlement) setSelEntitlement(opts.entitlement); else if (p === "entitlements") setSelEntitlement(null); };
  const activeAlerts = ALERTS.filter(a => !dismissed.includes(a.id));
  const critCount = activeAlerts.filter(a => a.severity === "critical").length;
  const isReady = appState === "ready";

  return (
    <div style={{ fontFamily: T.font, color: T.textPrimary, background: T.surface1, width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", fontSize: 14, lineHeight: 1.5, WebkitFontSmoothing: "antialiased" }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;600;700&display=swap" rel="stylesheet" />

      <SNHeader />

      <WorkspaceTabBar
        tabs={TABS}
        active={isReady ? page : null}
        onChange={id => isReady && nav(id)}
        badge={critCount}
      />

      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Hero Banner for ready pages */}
        {isReady && (
          <div style={{ position: "relative", background: "linear-gradient(135deg, #1b2a3e 0%, #2d3a4a 40%, #3a4a5a 100%)", padding: `${T.s7} ${T.s7}`, overflow: "hidden", minHeight: 100 }}>
            <DecoPattern variant="dark" />
            <div style={{ position: "relative", zIndex: 1, maxWidth: 1360, margin: "0 auto" }}>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: T.textOnDark, margin: 0 }}>{TABS.find(t => t.id === page)?.label}</h1>
              {page === "dashboard" && <p style={{ color: "rgba(255,255,255,.7)", margin: `${T.s1} 0 0`, fontSize: 15 }}>Search, explore and manage your ServiceNow subscription</p>}
            </div>
          </div>
        )}

        <div style={{ maxWidth: 1360, margin: "0 auto", padding: `${T.s6} ${T.s6}` }}>
          {!isReady && <>
            {appState === "empty" && <EmptyState onStart={() => setAppState("upload")} />}
            {appState === "upload" && <UploadState fileName={fileName} setFileName={setFileName} dragging={dragging} setDragging={setDragging} onSubmit={startProcessing} />}
            {appState === "processing" && <ProcessingState step={procStep} done={procDone} fileName={fileName} onContinue={() => setAppState("review")} />}
            {appState === "review" && <ReviewState onActivate={() => { setAppState("ready"); setPage("dashboard"); }} />}
          </>}

          {isReady && page === "dashboard" && <DashboardView nav={nav} alerts={activeAlerts} />}
          {isReady && page === "contracts" && <ContractsView nav={nav} sel={selContract} setSel={setSelContract} />}
          {isReady && page === "entitlements" && <EntitlementsView nav={nav} sel={selEntitlement} setSel={setSelEntitlement} />}
          {isReady && page === "usage" && <UsageView showManual={showManual} setShowManual={setShowManual} />}
          {isReady && page === "alerts" && <AlertsView alerts={activeAlerts} dismiss={id => setDismissed([...dismissed, id])} nav={nav} />}
          {isReady && page === "renewal" && <RenewalView />}
          {isReady && page === "settings" && <SettingsView />}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: T.surface0, borderTop: `1px solid ${T.chromeDivider}`, padding: `6px ${T.s6}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textTertiary, flexShrink: 0 }}>
        <span>ContractIQ v0.1 by Teiva Systems</span>
        <span>Last synced: Feb 23, 2026 06:00 UTC  •  ACME Corporation</span>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.chromeDivider}; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.textTertiary}; }
        input::placeholder { color: ${T.textTertiary}; }
        @keyframes dotpulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes caret { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ONBOARDING: Empty → Upload → Processing → Review
   ═══════════════════════════════════════════════════════════ */
function EmptyState({ onStart }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: T.rLg, background: T.infoBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: T.s6 }}><I n="layers" s={36} c={T.brandPrimary} sw={1.5} /></div>
      <h1 style={{ fontSize: 26, fontWeight: 700, margin: `0 0 ${T.s2}` }}>Welcome to ContractIQ</h1>
      <p style={{ fontSize: 15, color: T.textSecondary, maxWidth: 480, margin: `0 0 ${T.s2}`, lineHeight: 1.6 }}>Upload your ServiceNow contract and we'll connect it to your platform telemetry — turning raw usage data into financial intelligence.</p>
      <p style={{ fontSize: 13, color: T.textTertiary, maxWidth: 420, margin: `0 0 ${T.s7}` }}>AI reads your order form, maps entitlements to native ServiceNow data sources, and surfaces the gaps that no existing tool covers.</p>
      <Btn icon="upload" onClick={onStart} style={{ padding: `0 ${T.s7}`, height: 40, fontSize: 15 }}>Upload Your First Contract</Btn>
      <div style={{ display: "flex", gap: T.s7, marginTop: T.s9 }}>
        {[{ icon: "sparkle", title: "AI Extraction", desc: "Contract → entitlements in seconds" }, { icon: "dollarSign", title: "Financial Layer", desc: "€ at risk per entitlement" }, { icon: "bell", title: "Gap Alerts", desc: "What native tools miss" }, { icon: "target", title: "Renewal Intel", desc: "Data-driven negotiation" }].map((f, i) => (
          <div key={i} style={{ textAlign: "center", maxWidth: 140 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.rMd, background: T.infoBg, display: "flex", alignItems: "center", justifyContent: "center", margin: `0 auto ${T.s2}` }}><I n={f.icon} s={18} c={T.brandPrimary} /></div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{f.title}</div>
            <div style={{ fontSize: 11, color: T.textTertiary }}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadState({ fileName, setFileName, dragging, setDragging, onSubmit }) {
  const fileSelected = fileName.length > 0;
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", paddingTop: T.s8 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: `0 0 ${T.s1}` }}>Upload Contract Document</h2>
      <p style={{ fontSize: 13, color: T.textTertiary, margin: `0 0 ${T.s6}` }}>Drop your ServiceNow order form, renewal agreement, or contract PDF.</p>
      <Card>
        <div onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDragOver={e => e.preventDefault()}
          onDrop={e => { e.preventDefault(); setDragging(false); setFileName("SNW-2024-ENT-4821_Enterprise_Suite.pdf"); }}
          onClick={() => { if (!fileSelected) setFileName("SNW-2024-ENT-4821_Enterprise_Suite.pdf"); }}
          style={{ border: `2px dashed ${dragging ? T.brandPrimary : fileSelected ? T.positive : T.chromeDivider}`, borderRadius: T.rMd, padding: fileSelected ? T.s6 : T.s9, textAlign: "center", cursor: fileSelected ? "default" : "pointer", background: dragging ? T.infoBg : fileSelected ? T.positiveBg + "44" : "transparent", transition: "all .2s" }}>
          {!fileSelected ? <>
            <I n="upload" s={32} c={T.textTertiary} /><div style={{ marginTop: T.s3 }}>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: T.s1 }}>Drop contract file here or click to browse</div>
            <div style={{ fontSize: 12, color: T.textTertiary }}>PDF, DOCX • Max 50MB</div></div>
          </> : <div style={{ display: "flex", alignItems: "center", gap: T.s3 }}>
            <div style={{ width: 40, height: 40, borderRadius: T.rSm, background: T.positiveBg, display: "flex", alignItems: "center", justifyContent: "center" }}><I n="layers" s={20} c={T.positive} /></div>
            <div style={{ flex: 1, textAlign: "left" }}><div style={{ fontSize: 14, fontWeight: 600 }}>{fileName}</div><div style={{ fontSize: 12, color: T.textTertiary }}>2.4 MB • PDF document</div></div>
            <I n="checkCircle" s={20} c={T.positive} />
            <span onClick={e => { e.stopPropagation(); setFileName(""); }} style={{ cursor: "pointer" }}><I n="close" s={16} c={T.textTertiary} /></span>
          </div>}
        </div>
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: T.s4 }}><Btn icon="sparkle" onClick={onSubmit} disabled={!fileSelected} style={{ padding: `0 ${T.s6}` }}>Analyze Contract</Btn></div>
    </div>
  );
}

function ProcessingState({ step, done, fileName, onContinue }) {
  const pct = done ? 100 : Math.round((step / EXTRACTION_STEPS.length) * 100);
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", paddingTop: T.s9 }}>
      <div style={{ textAlign: "center", marginBottom: T.s7 }}>
        {!done ? <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.infoBg, display: "flex", alignItems: "center", justifyContent: "center", margin: `0 auto ${T.s4}` }}><Spinner><I n="sparkle" s={28} c={T.brandPrimary} /></Spinner></div>
          : <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.positiveBg, display: "flex", alignItems: "center", justifyContent: "center", margin: `0 auto ${T.s4}` }}><I n="checkCircle" s={32} c={T.positive} /></div>}
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: `0 0 ${T.s1}` }}>{done ? "Analysis Complete" : "Analyzing Contract..."}</h2>
        <p style={{ fontSize: 13, color: T.textTertiary, margin: 0 }}>{fileName}</p>
      </div>
      <div style={{ background: T.surface2, borderRadius: T.rSm, height: 6, marginBottom: T.s6 }}><div style={{ background: done ? T.positive : T.brandPrimary, height: "100%", width: `${pct}%`, borderRadius: T.rSm, transition: "width .5s" }} /></div>
      <Card>
        {EXTRACTION_STEPS.map((s, i) => { const isDone = i < step; const isCurrent = i === step && !done; const allDone = done;
          return <div key={i} style={{ display: "flex", alignItems: "center", gap: T.s3, padding: `${T.s2} 0`, borderBottom: i < EXTRACTION_STEPS.length - 1 ? `1px solid ${T.chromeDividerSubtle}` : "none" }}>
            {(isDone || allDone) ? <I n="checkCircle" s={16} c={T.positive} /> : isCurrent ? <Spinner><I n="loader" s={16} c={T.brandPrimary} /></Spinner> : <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${T.chromeDivider}` }} />}
            <span style={{ fontSize: 13, color: (isDone || allDone) ? T.textPrimary : isCurrent ? T.brandPrimary : T.textTertiary, fontWeight: isCurrent ? 600 : 400 }}>{s.label}</span>
            {isDone && <span style={{ marginLeft: "auto", fontSize: 11, color: T.textTertiary }}>Done</span>}
            {isCurrent && <span style={{ marginLeft: "auto", fontSize: 11, color: T.brandPrimary, fontWeight: 500 }}>In progress...</span>}
          </div>; })}
      </Card>
      {done && <div style={{ marginTop: T.s5 }}>
        <Card style={{ background: T.positiveBg + "66", border: `1px solid ${T.positive}33` }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.s3 }}><I n="sparkle" s={18} c={T.positive} /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600 }}>Extraction Summary</div><div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>Found <span style={{ fontWeight: 700 }}>8 entitlement line items</span> across <span style={{ fontWeight: 700 }}>5 categories</span>.</div></div></div>
        </Card>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: T.s4 }}><Btn icon="eye" onClick={onContinue}>Review Extracted Data</Btn></div>
      </div>}
    </div>
  );
}

function ReviewState({ onActivate }) {
  const [expandEnt, setExpandEnt] = useState(true);
  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: T.s5, paddingTop: T.s5 }}>
        <div><h2 style={{ fontSize: 20, fontWeight: 700, margin: `0 0 ${T.s1}` }}>Review Extracted Data</h2><p style={{ fontSize: 13, color: T.textTertiary, margin: 0 }}>Verify the information below. Click any field to edit.</p></div>
        <Badge variant="success">AI Confidence: 95%</Badge>
      </div>
      <Card style={{ marginBottom: T.s4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.s2, marginBottom: T.s4 }}><I n="layers" s={16} c={T.brandPrimary} /><span style={{ fontSize: 14, fontWeight: 600 }}>Contract Metadata</span><Badge>Auto-extracted</Badge></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
          {EXTRACTED_FIELDS.map((f, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${T.s2} ${T.s3}`, borderBottom: `1px solid ${T.chromeDividerSubtle}` }}>
              <div><div style={{ fontSize: 11, color: T.textTertiary, marginBottom: 1 }}>{f.label}</div><div style={{ fontSize: 13, fontWeight: 500 }}>{f.value}</div></div>
              <div style={{ display: "flex", alignItems: "center", gap: T.s2 }}>
                <div style={{ width: 28, height: 4, borderRadius: 2, background: T.surface2 }}><div style={{ width: `${f.confidence}%`, height: "100%", background: f.confidence > 90 ? T.positive : T.warning, borderRadius: 2 }} /></div>
                <span style={{ fontSize: 10, color: T.textTertiary }}>{f.confidence}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{ marginBottom: T.s4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.s2, marginBottom: T.s4, cursor: "pointer" }} onClick={() => setExpandEnt(!expandEnt)}>
          <I n="layers" s={16} c={T.brandPrimary} /><span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Entitlements ({EXTRACTED_ENTITLEMENTS.length})</span><Badge>Auto-extracted</Badge>
          <I n={expandEnt ? "chevDown" : "chevRight"} s={16} c={T.textTertiary} />
        </div>
        {expandEnt && <>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px 70px", gap: T.s2, padding: `${T.s2} ${T.s2}`, fontSize: 11, fontWeight: 600, color: T.textTertiary, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `2px solid ${T.chromeDivider}` }}>
            <span>Name</span><span>Category</span><span>Quantity</span><span>Reset</span><span>Conf.</span>
          </div>
          {EXTRACTED_ENTITLEMENTS.map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px 70px", gap: T.s2, padding: `${T.s3} ${T.s2}`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, alignItems: "center", fontSize: 13 }}>
              <span style={{ fontWeight: 500 }}>{e.name}</span><Badge variant="neutral">{e.category}</Badge><span>{e.qty}</span><span style={{ fontSize: 12, color: T.textSecondary }}>{e.reset}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 24, height: 4, borderRadius: 2, background: T.surface2 }}><div style={{ width: `${e.confidence}%`, height: "100%", background: e.confidence > 90 ? T.positive : T.warning, borderRadius: 2 }} /></div><span style={{ fontSize: 10, color: T.textTertiary }}>{e.confidence}%</span></div>
            </div>
          ))}
        </>}
      </Card>
      <div style={{ display: "flex", justifyContent: "flex-end" }}><Btn icon="check" onClick={onActivate} style={{ padding: `0 ${T.s7}`, fontSize: 14 }}>Activate Contract Intelligence</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD (Home)
   ═══════════════════════════════════════════════════════════ */
function DashboardView({ nav, alerts }) {
  const sidebar = <>
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s2 }}>Summary</div>
      {[["Active Contracts", "2", () => nav("contracts")], ["Entitlements", "9", () => nav("entitlements")], ["Critical Alerts", alerts.filter(a => a.severity === "critical").length + "", () => nav("alerts")]].map(([l, v, fn], i) => (
        <div key={i} onClick={fn} style={{ display: "flex", justifyContent: "space-between", padding: `6px 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, cursor: "pointer", fontSize: 13 }}>
          <span style={{ color: T.textLink }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </Card>
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s2 }}>Quick Links</div>
      {[["Renewal Cockpit", () => nav("renewal")], ["Usage Tracker", () => nav("usage")], ["Alert Center", () => nav("alerts")], ["Configuration", () => nav("settings")]].map(([l, fn], i) => (
        <div key={i} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", fontSize: 13, color: T.textLink, cursor: "pointer" }}><I n="externalLink" s={11} c={T.textLink} />{l}</div>
      ))}
    </Card>
    <Card>
      <div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s1 }}>Value Realization</div>
      <div style={{ fontSize: 40, fontWeight: 300, color: T.warning, lineHeight: 1 }}>62%</div>
      <div style={{ fontSize: 12, color: T.textTertiary, marginTop: T.s1 }}>€249K at risk</div>
      <div style={{ marginTop: T.s2, height: 4, background: T.surface2, borderRadius: 2 }}><div style={{ height: "100%", width: "62%", background: T.warning, borderRadius: 2 }} /></div>
    </Card>
  </>;
  return (
    <WorkspaceLayout sidebar={sidebar}>
      {/* Important actions */}
      {alerts.filter(a => a.severity === "critical").length > 0 && <Card style={{ marginBottom: T.s4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.s2, marginBottom: T.s3 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Important actions</span>
          <Badge variant="orange">{alerts.filter(a => a.severity === "critical").length}</Badge>
        </div>
        <div style={{ display: "flex", gap: T.s3 }}>
          {alerts.filter(a => a.severity === "critical").map(a => (
            <div key={a.id} style={{ flex: 1, padding: T.s3, border: `1px solid ${T.chromeDividerSubtle}`, borderRadius: T.rMd, borderLeft: `4px solid ${T.negative}` }}>
              <Badge variant="critical">Critical</Badge>
              <div style={{ fontSize: 13, fontWeight: 600, marginTop: T.s2 }}>{a.title}</div>
              <div style={{ fontSize: 11, color: T.textTertiary, marginTop: 2 }}>{a.subtitle}</div>
              <div style={{ marginTop: T.s2 }}><Btn variant="outline" small onClick={() => { if (a.entitlement) nav("entitlements", { entitlement: a.entitlement }); }}>{a.action}</Btn></div>
            </div>
          ))}
        </div>
      </Card>}
      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: T.s3, marginBottom: T.s4 }}>
        {[{ l: "Value Realization", v: "62%", c: T.warning }, { l: "€ at Risk", v: "€249K", c: T.negative }, { l: "Days to Renewal", v: "383", c: T.brandPrimary }, { l: "Entitlements at Risk", v: "3 of 9", c: T.negative }].map((k, i) => (
          <Card key={i} style={{ padding: T.s4 }}>
            <div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s2 }}>{k.l}</div>
            <div style={{ fontSize: 32, fontWeight: 300, lineHeight: 1, color: k.c }}>{k.v}</div>
          </Card>
        ))}
      </div>
      {/* Data Sources strip */}
      <Card style={{ marginBottom: T.s4, padding: `${T.s3} ${T.s4}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.s4, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.textSecondary }}>Data Sources:</span>
          {[["Subscription Mgmt v2", true], ["Now Assist Admin", true], ["Platform Stats", true], ["Now Learning", false], ["Expert Services", false]].map(([n, auto], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: auto ? T.positive : T.warning }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: auto ? T.positive : T.warning }} /><span style={{ fontWeight: 500 }}>{n}</span>
              <span style={{ color: T.textTertiary }}>{auto ? "Auto" : "Manual"}</span>
            </div>
          ))}
        </div>
      </Card>
      {/* Recent Alerts */}
      <Card style={{ marginBottom: T.s4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.s3 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Recent alerts</span>
          <Btn variant="link" small onClick={() => nav("alerts")}>View all</Btn>
        </div>
        {alerts.slice(0, 4).map(a => (
          <div key={a.id} style={{ display: "flex", gap: T.s3, padding: `${T.s2} 0`, borderTop: `1px solid ${T.chromeDividerSubtle}` }}>
            <SevIcon severity={a.severity} />
            <div style={{ flex: 1, minWidth: 0 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{a.title}</div><div style={{ fontSize: 11, color: T.textTertiary, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.subtitle}</div></div>
            <span style={{ fontSize: 11, color: T.textTertiary, whiteSpace: "nowrap" }}>{a.date}</span>
          </div>
        ))}
      </Card>
      {/* Value at Risk chart */}
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.s3 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Value at Risk by Entitlement</span>
          <Btn variant="link" small onClick={() => nav("renewal")}>Full analysis</Btn>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[{ name: "Now Assist", risk: 96200 }, { name: "Approver Lic.", risk: 67500 }, { name: "Learning Crd.", risk: 54400 }, { name: "Expert Svc.", risk: 31000 }]} layout="vertical" margin={{ left: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.chromeDividerSubtle} horizontal={false} />
            <XAxis type="number" tick={{ fill: T.textTertiary, fontSize: 11 }} axisLine={{ stroke: T.chromeDivider }} tickFormatter={v => `€${(v / 1000).toFixed(0)}K`} />
            <YAxis type="category" dataKey="name" tick={{ fill: T.textPrimary, fontSize: 11 }} axisLine={{ stroke: T.chromeDivider }} width={80} />
            <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${T.chromeDivider}`, borderRadius: T.rMd, fontSize: 12 }} formatter={v => fC(v)} />
            <Bar dataKey="risk" fill={T.negative} radius={[0, 3, 3, 0]} barSize={18} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: T.s2, fontSize: 11, color: T.textTertiary }}><span>Data from Subscription Mgmt v2 + Manual entries</span><span style={{ fontWeight: 600, color: T.negative }}>Total: €249,100</span></div>
      </Card>
    </WorkspaceLayout>
  );
}

/* ═══════════════════════════════════════════════════════════
   CONTRACTS
   ═══════════════════════════════════════════════════════════ */
function ContractsView({ nav, sel, setSel }) {
  if (sel) {
    const c = CONTRACTS.find(x => x.id === sel); const ents = ENTITLEMENTS.filter(e => e.contract === sel);
    return (<div>
      <Btn variant="link" small onClick={() => setSel(null)} icon="chevRight" style={{ marginBottom: T.s4, transform: "scaleX(-1)" }}>Back to contracts</Btn>
      <h2 style={{ fontSize: 18, fontWeight: 700, margin: `0 0 ${T.s2}` }}>{c.name}</h2>
      <div style={{ display: "flex", gap: T.s2, marginBottom: T.s5 }}><Badge variant="success">Active</Badge><Badge>{c.type}</Badge><span style={{ fontSize: 12, color: T.textTertiary }}>{c.number}</span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: T.s3, marginBottom: T.s5 }}>
        {[["Start", c.startDate, `Anniversary: ${c.anniversary}`], ["Remaining", `${c.daysRemaining} days`, `End: ${c.endDate}`], ["ACV", fC(c.acv), `TCV: ${fC(c.tcv)}`], ["Value Score", `${c.healthScore}%`, "Utilization"]].map(([l, v, s], i) => (
          <Card key={i} style={{ padding: T.s4 }}><div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s2 }}>{l}</div><div style={{ fontSize: 28, fontWeight: 300 }}>{v}</div><div style={{ fontSize: 11, color: T.textTertiary, marginTop: 2 }}>{s}</div></Card>
        ))}
      </div>
      <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Entitlements ({ents.length})</div>
        {ents.map(e => { const pct = Math.round((e.used / e.purchased) * 100); return <div key={e.id} style={{ display: "flex", alignItems: "center", gap: T.s3, padding: `${T.s3} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, cursor: "pointer" }} onClick={() => nav("entitlements", { entitlement: e.id })}>
          <span style={{ flex: 2, fontWeight: 500, fontSize: 13 }}>{e.name}</span><span style={{ flex: 1, color: T.textSecondary, fontSize: 12 }}>{e.category}</span><div style={{ flex: 1 }}><Progress value={e.used} max={e.purchased} height={6} /></div><span style={{ fontWeight: 600, color: sColor(e.status), fontSize: 12, width: 40, textAlign: "right" }}>{pct}%</span><span style={{ color: T.textTertiary, fontSize: 12, width: 100, textAlign: "right" }}>{fN(e.used)} / {fN(e.purchased)}</span><I n="chevRight" s={14} c={T.textTertiary} />
        </div>; })}
      </Card>
    </div>);
  }
  const contractSidebar = <>
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s2 }}>Actions</div>
      {[["Upload Contract", "upload"], ["Add Manually", "plus"]].map(([l, ic], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", fontSize: 13, color: T.textLink, cursor: "pointer" }}><I n={ic} s={11} c={T.textLink} />{l}</div>
      ))}
    </Card>
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s2 }}>Quick Links</div>
      {[["Renewal Cockpit", () => nav("renewal")], ["Usage Tracker", () => nav("usage")], ["Alert Center", () => nav("alerts")]].map(([l, fn], i) => (
        <div key={i} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", fontSize: 13, color: T.textLink, cursor: "pointer" }}><I n="externalLink" s={11} c={T.textLink} />{l}</div>
      ))}
    </Card>
  </>;
  return (<WorkspaceLayout sidebar={contractSidebar}><div>
    {CONTRACTS.map(c => { const ents = ENTITLEMENTS.filter(e => e.contract === c.id); const sc = c.healthScore > 75 ? T.positive : c.healthScore > 50 ? T.warning : T.negative; return <Card key={c.id} onClick={() => setSel(c.id)} style={{ marginBottom: T.s3 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><div><h3 style={{ fontSize: 15, fontWeight: 600, margin: `0 0 ${T.s2}` }}>{c.name}</h3><div style={{ display: "flex", gap: T.s2 }}><Badge variant="success">Active</Badge><Badge>{c.type}</Badge><span style={{ fontSize: 12, color: T.textTertiary }}>{c.number}</span></div></div><div style={{ textAlign: "right" }}><div style={{ fontSize: 11, color: T.textTertiary }}>Value Score</div><div style={{ fontSize: 28, fontWeight: 300, color: sc }}>{c.healthScore}%</div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: T.s4, marginTop: T.s4, paddingTop: T.s4, borderTop: `1px solid ${T.chromeDividerSubtle}` }}>{[["Period", `${c.startDate} → ${c.endDate}`], ["ACV", fC(c.acv)], ["Entitlements", `${ents.length} line items`], ["Remaining", `${c.daysRemaining} days`]].map(([l, v], i) => <div key={i}><div style={{ fontSize: 11, color: T.textTertiary, marginBottom: 2 }}>{l}</div><div style={{ fontSize: 13, fontWeight: 500 }}>{v}</div></div>)}</div>
    </Card>; })}
  </div></WorkspaceLayout>);
}

/* ═══════════════════════════════════════════════════════════
   ENTITLEMENTS
   ═══════════════════════════════════════════════════════════ */
function EntitlementsView({ nav, sel, setSel }) {
  const [cat, setCat] = useState("All"); const cats = ["All", "User License", "Capacity", "Consumption", "Training", "Service"];
  if (sel) {
    const e = ENTITLEMENTS.find(x => x.id === sel); const pct = Math.round((e.used / e.purchased) * 100); const sc = sColor(e.status);
    const data = USAGE_TREND.map(d => ({ month: d.month, value: e.id === "E004" ? d.ihub : e.id === "E005" ? d.assists : e.id === "E006" ? d.credits : d.fulfiller }));
    const sidebar = <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Details</div>
      {[["Contract", CONTRACTS.find(c => c.id === e.contract)?.name], ["Category", e.category], ["Unit", e.unit], ["Reset", e.resetCycle], ["Overage", "Notify Only"], ["Data Source", e.category === "Training" ? "Now Learning (Manual)" : e.category === "Service" ? "Account Team (Manual)" : e.id === "E005" ? "Now Assist Admin (Auto)" : "Subscription Mgmt v2 (Auto)"], ["Last Updated", "Feb 23, 2026"]].map(([k, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: `7px 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, fontSize: 12 }}><span style={{ color: T.textTertiary }}>{k}</span><span style={{ fontWeight: 500, textAlign: "right", maxWidth: "55%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v}</span></div>)}
    </Card>;
    return (<WorkspaceLayout sidebar={sidebar}>
      <Btn variant="link" small onClick={() => setSel(null)} style={{ marginBottom: T.s4 }}>← Back</Btn>
      <div style={{ display: "flex", alignItems: "center", gap: T.s3, marginBottom: T.s5 }}><div style={{ width: 36, height: 36, borderRadius: T.rSm, background: sc + "14", display: "flex", alignItems: "center", justifyContent: "center" }}><I n={e.iconName} s={18} c={sc} /></div><div><h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{e.name}</h2><div style={{ display: "flex", gap: T.s2, marginTop: T.s1 }}><Badge>{e.category}</Badge><Badge variant="neutral">{e.resetCycle} Reset</Badge></div></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: T.s3, marginBottom: T.s5 }}>
        {[["Purchased", fN(e.purchased), e.unit], ["Current", fN(e.used), `${pct}% utilized`], ["€ at Risk", e.id === "E005" ? "€96.2K" : e.id === "E006" ? "€5.4K" : e.id === "E007" ? "€31K" : e.id === "E002" ? "€67.5K" : "Healthy", pct < 50 ? "Underutilized" : "On track"], ["Reset / Expiry", e.expiry, e.resetCycle !== "None" ? `Resets: ${e.resetCycle}` : "No reset"]].map(([l, v, s], i) => (
          <Card key={i} style={{ padding: T.s4 }}><div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s2 }}>{l}</div><div style={{ fontSize: 24, fontWeight: 300, color: l.includes("Risk") && v !== "Healthy" ? T.negative : undefined }}>{v}</div><div style={{ fontSize: 11, color: T.textTertiary, marginTop: 2 }}>{s}</div></Card>
        ))}
      </div>
      <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Usage History</div>
        <ResponsiveContainer width="100%" height={200}><AreaChart data={data}><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={sc} stopOpacity={.15} /><stop offset="95%" stopColor={sc} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={T.chromeDividerSubtle} /><XAxis dataKey="month" tick={{ fill: T.textTertiary, fontSize: 11 }} axisLine={{ stroke: T.chromeDivider }} /><YAxis tick={{ fill: T.textTertiary, fontSize: 11 }} axisLine={{ stroke: T.chromeDivider }} tickFormatter={fN} /><Tooltip contentStyle={{ background: "#fff", border: `1px solid ${T.chromeDivider}`, borderRadius: T.rMd, fontSize: 12 }} /><Area type="monotone" dataKey="value" stroke={sc} fill="url(#dg)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
      </Card>
    </WorkspaceLayout>);
  }
  const filtered = cat === "All" ? ENTITLEMENTS : ENTITLEMENTS.filter(e => e.category === cat);
  const counts = { h: ENTITLEMENTS.filter(e => e.status === "healthy").length, w: ENTITLEMENTS.filter(e => e.status === "warning").length, c: ENTITLEMENTS.filter(e => e.status === "critical").length };
  return (<div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: T.s3, marginBottom: T.s4 }}>
      {[["Healthy", counts.h, T.positive], ["Warning", counts.w, T.warning], ["Critical", counts.c, T.negative]].map(([l, c, col], i) => (
        <Card key={i} style={{ padding: T.s4, display: "flex", alignItems: "center", gap: T.s3 }}><I n={l === "Healthy" ? "checkCircle" : "alertTriangle"} s={18} c={col} /><div><div style={{ fontSize: 32, fontWeight: 300, color: col, lineHeight: 1 }}>{c}</div><div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>{l}</div></div></Card>
      ))}
    </div>
    <div style={{ display: "flex", gap: T.s6, borderBottom: `2px solid ${T.chromeDivider}`, marginBottom: T.s4, padding: `0 ${T.s1}` }}>{cats.map(c => <button key={c} onClick={() => setCat(c)} style={{ background: "none", border: "none", padding: `${T.s3} 0`, fontSize: 14, fontWeight: cat === c ? 600 : 400, color: cat === c ? T.brandPrimary : T.textSecondary, borderBottom: cat === c ? `2px solid ${T.brandPrimary}` : "2px solid transparent", marginBottom: "-2px", cursor: "pointer", fontFamily: T.font }}>{c}</button>)}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.s3 }}>
      {filtered.map(e => { const pct = Math.round((e.used / e.purchased) * 100); const sc = sColor(e.status); return <Card key={e.id} onClick={() => setSel(e.id)}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: T.s3 }}><div style={{ display: "flex", alignItems: "center", gap: T.s3 }}><div style={{ width: 32, height: 32, borderRadius: T.rSm, background: sc + "14", display: "flex", alignItems: "center", justifyContent: "center" }}><I n={e.iconName} s={16} c={sc} /></div><div><div style={{ fontSize: 13, fontWeight: 600 }}>{e.name}</div><div style={{ fontSize: 11, color: T.textTertiary }}>{e.category}</div></div></div><span style={{ fontSize: 24, fontWeight: 300, color: sc }}>{pct}%</span></div>
        <Progress value={e.used} max={e.purchased} height={6} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: T.s2, fontSize: 11 }}><span style={{ color: T.textTertiary }}>{fN(e.used)} / {fN(e.purchased)} {e.unit}</span>{e.resetCycle !== "None" && <span style={{ color: T.textTertiary, display: "flex", alignItems: "center", gap: 3 }}><I n="refresh" s={10} c={T.textTertiary} />{e.resetCycle}</span>}</div>
      </Card>; })}
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   VA CHAT PANEL
   ═══════════════════════════════════════════════════════════ */
function VAChatPanel() {
  const PP = T.purple;
  const [activeConv, setActiveConv] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [botThinking, setBotThinking] = useState(false);
  const [playState, setPlayState] = useState("idle");
  const chatContainerRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const conv = activeConv ? VA_CONVERSATIONS.find(c => c.id === activeConv) : null;
  const clearTimers = () => { if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; } if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
  const playMessage = (convData, idx) => {
    if (idx >= convData.messages.length) { setPlayState("done"); return; }
    const msg = convData.messages[idx];
    if (msg.role === "user") {
      const fullText = msg.text; let charPos = 0; setInputText("");
      intervalRef.current = setInterval(() => { charPos++; if (charPos > fullText.length) { clearInterval(intervalRef.current); intervalRef.current = null; setInputText(fullText); timeoutRef.current = setTimeout(() => { setSentMessages(prev => [...prev, msg]); setInputText(""); timeoutRef.current = setTimeout(() => playMessage(convData, idx + 1), 400); }, 600); } else { setInputText(fullText.slice(0, charPos)); } }, 38 + Math.floor(Math.random() * 25));
    } else {
      setBotThinking(true);
      const delay = msg.widget ? 700 : 1600 + Math.floor(Math.random() * 600);
      timeoutRef.current = setTimeout(() => { setBotThinking(false); setSentMessages(prev => [...prev, msg]); const nextMsg = convData.messages[idx + 1]; const pauseTime = nextMsg && nextMsg.role === "user" ? 1800 : 300; timeoutRef.current = setTimeout(() => playMessage(convData, idx + 1), pauseTime); }, delay);
    }
  };
  const startConversation = (convId) => { clearTimers(); const convData = VA_CONVERSATIONS.find(c => c.id === convId); setActiveConv(convId); setSentMessages([]); setInputText(""); setBotThinking(false); setPlayState("playing"); setExpanded(true); timeoutRef.current = setTimeout(() => playMessage(convData, 0), 700); };
  const reset = () => { clearTimers(); setActiveConv(null); setSentMessages([]); setInputText(""); setBotThinking(false); setPlayState("idle"); };
  useEffect(() => () => clearTimers(), []);
  useEffect(() => { if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; }, [sentMessages, inputText, botThinking]);
  const renderMarkdown = (text) => text.split("\n").map((line, li) => {
    if (line.startsWith("|") && line.includes("|")) { const cells = line.split("|").filter(c => c.trim()).map(c => c.trim()); if (cells.every(c => /^[-:]+$/.test(c))) return null; const isHeader = text.split("\n")[li + 1]?.includes("---"); return <div key={li} style={{ display: "grid", gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: 0, fontSize: 11 }}>{cells.map((c, ci) => <div key={ci} style={{ padding: "4px 8px", borderBottom: `1px solid ${T.chromeDividerSubtle}`, fontWeight: isHeader ? 600 : 400, background: isHeader ? T.surface1 : "transparent" }}>{c}</div>)}</div>; }
    const formatted = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/•\s/g, `<span style="color:${PP}">  ●  </span>`);
    return <div key={li} style={{ marginBottom: line === "" ? 8 : 2, minHeight: line === "" ? 4 : "auto" }} dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }} />;
  }).filter(Boolean);
  const MiniWidget = ({ type }) => {
    if (type === "budget_summary") return <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, padding: T.s2, background: T.surface1, borderRadius: T.rSm, marginBottom: T.s2 }}>{[{ l: "Burned", v: "48.2K / 200K", c: PP }, { l: "Projected EOY", v: "70.5K (35%)", c: T.negative }, { l: "€ Unused", v: "€119,900", c: T.negative }].map((k, i) => <div key={i} style={{ textAlign: "center", padding: 6 }}><div style={{ fontSize: 9, color: T.textTertiary, textTransform: "uppercase", fontWeight: 600 }}>{k.l}</div><div style={{ fontSize: 14, fontWeight: 700, color: k.c }}>{k.v}</div></div>)}</div>;
    if (type === "agent_table") return <div style={{ padding: T.s2, background: T.surface1, borderRadius: T.rSm, marginBottom: T.s2, fontSize: 11 }}>{[{ n: "Onboarding Orchestrator", c: "€1,665", s: "Large", cl: T.negative }, { n: "Change Risk Assessment", c: "€1,295", s: "Med", cl: T.warning }, { n: "Knowledge Article", c: "€1,018", s: "Med", cl: T.warning }, { n: "Incident Triage", c: "€971", s: "Small", cl: T.positive }].map((a, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < 3 ? `1px solid ${T.chromeDividerSubtle}` : "none" }}><span>{a.n}</span><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Badge variant={a.cl === T.positive ? "success" : a.cl === T.warning ? "warning" : "critical"}>{a.s}</Badge><span style={{ fontWeight: 700, minWidth: 50, textAlign: "right" }}>{a.c}</span></div></div>)}</div>;
    if (type === "env_split") return <div style={{ display: "flex", alignItems: "center", gap: T.s3, padding: T.s2, background: T.surface1, borderRadius: T.rSm, marginBottom: T.s2 }}><div style={{ width: 48, height: 48, borderRadius: "50%", background: `conic-gradient(${PP} 0% 65%, ${T.warning} 65% 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ width: 30, height: 30, borderRadius: "50%", background: T.surface1 }} /></div><div style={{ flex: 1 }}><div style={{ display: "flex", gap: T.s3, fontSize: 11 }}><span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: PP, marginRight: 4, verticalAlign: "middle" }} />Prod: 65%</span><span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: T.warning, marginRight: 4, verticalAlign: "middle" }} />Sub-prod: 35%</span></div><div style={{ fontSize: 10, color: T.negative, fontWeight: 600, marginTop: 4 }}>35% sub-prod = €15,540 non-production</div></div></div>;
    return null;
  };
  const isTypingUser = playState === "playing" && inputText.length > 0;
  return (
    <Card style={{ marginBottom: T.s4, padding: 0, overflow: "hidden" }}>
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${T.s3} ${T.s4}`, cursor: "pointer", background: T.purpleLight, borderBottom: expanded ? `1px solid ${T.chromeDividerSubtle}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.s3 }}>
          <div style={{ width: 28, height: 28, borderRadius: T.rMd, background: PP + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><I n="bot" s={15} c={PP} /></div>
          <div><div style={{ fontSize: 13, fontWeight: 600 }}>Virtual Agent — Now Assist FinOps</div><div style={{ fontSize: 11, color: T.textTertiary }}>Ask about budget, agent costs, and governance</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: T.s2 }}><Badge variant="purple">AI-Powered</Badge><I n={expanded ? "chevDown" : "chevRight"} s={16} c={T.textTertiary} /></div>
      </div>
      {expanded && <div style={{ padding: T.s4 }}>
        {!activeConv && <div>
          <div style={{ fontSize: 12, color: T.textTertiary, marginBottom: T.s3 }}>Choose a conversation to watch:</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: T.s3 }}>
            {VA_CONVERSATIONS.map(c => <div key={c.id} onClick={() => startConversation(c.id)} style={{ padding: T.s4, border: `1px solid ${T.chromeDividerSubtle}`, borderRadius: T.rMd, cursor: "pointer", borderLeft: `3px solid ${PP}`, transition: "all .15s" }} onMouseEnter={e => { e.currentTarget.style.background = T.purpleLight; }} onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: T.s2 }}><I n="msgCircle" s={13} c={PP} /><span style={{ fontSize: 12, fontWeight: 600, color: PP }}>{c.label}</span></div>
              <div style={{ fontSize: 12, color: T.textSecondary, lineHeight: 1.4 }}>"{c.prompt}"</div>
            </div>)}
          </div>
        </div>}
        {activeConv && conv && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.s3 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}><I n="msgCircle" s={13} c={PP} /><span style={{ fontSize: 12, fontWeight: 600, color: PP }}>{conv.label}</span>{playState === "playing" && <span style={{ fontSize: 10, color: T.negative, fontStyle: "italic", marginLeft: T.s2, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: T.negative, animation: "dotpulse 1.5s infinite" }} />Live</span>}</div>
            <Btn variant="link" small onClick={reset}>Back to topics</Btn>
          </div>
          <div ref={chatContainerRef} style={{ maxHeight: 420, overflowY: "auto", paddingRight: T.s1 }}>
            {sentMessages.map((msg, mi) => <div key={mi} style={{ display: "flex", gap: T.s2, marginBottom: T.s3, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
              <div style={{ width: 26, height: 26, borderRadius: T.rMd, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "user" ? T.infoBg : T.purpleLight }}><I n={msg.role === "user" ? "user" : "bot"} s={12} c={msg.role === "user" ? T.brandPrimary : PP} /></div>
              <div style={{ maxWidth: msg.role === "user" ? "70%" : "85%", padding: msg.widget ? `${T.s2} ${T.s3}` : `${T.s3} ${T.s4}`, borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: msg.role === "user" ? T.brandPrimary : "#fff", color: msg.role === "user" ? "#fff" : T.textPrimary, border: msg.role === "user" ? "none" : `1px solid ${T.chromeDividerSubtle}`, fontSize: 12, lineHeight: 1.6, boxShadow: msg.role === "assistant" ? T.elevLow : "none" }}>
                {msg.widget ? <MiniWidget type={msg.widget} /> : msg.role === "user" ? msg.text : renderMarkdown(msg.text)}
              </div>
            </div>)}
            {botThinking && <div style={{ display: "flex", gap: T.s2, marginBottom: T.s3 }}><div style={{ width: 26, height: 26, borderRadius: T.rMd, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: T.purpleLight }}><I n="bot" s={12} c={PP} /></div><div style={{ padding: `${T.s3} ${T.s4}`, borderRadius: "12px 12px 12px 2px", background: "#fff", border: `1px solid ${T.chromeDividerSubtle}`, display: "flex", gap: 4, alignItems: "center" }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: PP, opacity: 0.4, animation: `dotpulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}</div></div>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: T.s2, padding: `${T.s2} ${T.s3}`, background: "#fff", border: `1px solid ${isTypingUser ? PP : T.chromeDivider}`, borderRadius: T.rMd, marginTop: T.s3, transition: "border-color .2s", boxShadow: isTypingUser ? `0 0 0 2px ${PP}18` : "none" }}>
            <I n="search" s={13} c={isTypingUser ? PP : T.textTertiary} />
            <div style={{ flex: 1, fontSize: 12, minHeight: 18, display: "flex", alignItems: "center" }}>
              {inputText ? <span style={{ color: T.textPrimary }}>{inputText}<span style={{ display: "inline-block", width: 2, height: 14, background: PP, marginLeft: 1, verticalAlign: "text-bottom", animation: "caret 1s step-end infinite" }} /></span> : <span style={{ color: T.textTertiary }}>{playState === "done" ? "Ask a follow-up question..." : "Ask anything about Now Assist..."}</span>}
            </div>
            <div style={{ width: 26, height: 26, borderRadius: T.rMd, background: isTypingUser ? PP : T.surface1, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}><I n="send" s={12} c={isTypingUser ? "#fff" : T.textTertiary} /></div>
          </div>
          <div style={{ marginTop: T.s3, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: T.textTertiary }}><I n="database" s={10} c={T.textTertiary} /><span>Data: sys_gen_ai_usage_log, Subscription Mgmt v2, ContractIQ</span></div>
        </div>}
      </div>}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOW ASSIST FINOPS MODULE
   ═══════════════════════════════════════════════════════════ */
function NowAssistFinOps() {
  const PP = T.purple; const totalAssists = 48200; const budget = 200000; const remaining = budget - totalAssists; const pctBurned = Math.round((totalAssists / budget) * 100);
  const projectedEOY = 70500; const pctProj = Math.round((projectedEOY / budget) * 100);
  const costPerAssist = 185000 / 200000;
  const daysPct = 73;
  return (<div>
    <VAChatPanel />
    {/* Budget KPIs */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: T.s3, marginBottom: T.s4 }}>
      {[{ l: "Annual Budget", v: fN(budget) + " Assists", s: "Jun 1 '25 → May 31 '26", c: PP },
        { l: "Burned YTD", v: fN(totalAssists) + ` (${pctBurned}%)`, s: `${daysPct}% of year elapsed`, c: pctBurned > daysPct ? T.warning : T.positive },
        { l: "Remaining", v: fN(remaining), s: `${fC(Math.round(remaining * costPerAssist))} remaining`, c: T.positive },
        { l: "Projected EOY", v: fN(projectedEOY) + ` (${pctProj}%)`, s: pctProj < 50 ? `${fC(Math.round((budget - projectedEOY) * costPerAssist))} unused` : "On track", c: pctProj < 50 ? T.negative : T.warning },
        { l: "Cost / Assist", v: `€${costPerAssist.toFixed(2)}`, s: "€185K ACV / 200K", c: T.textSecondary },
      ].map((k, i) => <Card key={i} style={{ padding: T.s3 }}><div style={{ fontSize: 11, color: T.textTertiary, marginBottom: T.s1, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".4px" }}>{k.l}</div><div style={{ fontSize: 20, fontWeight: 300, color: k.c, lineHeight: 1.1 }}>{k.v}</div><div style={{ fontSize: 10, color: T.textTertiary, marginTop: T.s1 }}>{k.s}</div></Card>)}
    </div>
    {/* Burndown Chart + Anniversary */}
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: T.s3, marginBottom: T.s4 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.s3 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Budget Burndown: Contract Year 2</span><Badge variant="neutral">Annual Reset</Badge></div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={ASSIST_BURNDOWN}>
            <defs><linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={PP} stopOpacity={.2} /><stop offset="95%" stopColor={PP} stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.chromeDividerSubtle} />
            <XAxis dataKey="month" tick={{ fill: T.textTertiary, fontSize: 10 }} axisLine={{ stroke: T.chromeDivider }} />
            <YAxis tick={{ fill: T.textTertiary, fontSize: 10 }} axisLine={{ stroke: T.chromeDivider }} tickFormatter={fN} domain={[0, 200000]} />
            <ReferenceLine y={200000} stroke={T.negative} strokeDasharray="6 3" label={{ value: "Budget: 200K", fill: T.negative, fontSize: 10, position: "insideTopRight" }} />
            <ReferenceLine y={170000} stroke={T.warning} strokeDasharray="4 4" strokeOpacity={.5} />
            <Tooltip contentStyle={{ background: "#fff", border: `1px solid ${T.chromeDivider}`, borderRadius: T.rMd, fontSize: 12 }} formatter={v => [fN(v) + " assists", "Burned"]} />
            <Area type="monotone" dataKey="burned" stroke={PP} fill="url(#bd)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: T.s4, marginTop: T.s2, fontSize: 10, color: T.textTertiary }}><span>Source: sys_gen_ai_usage_log</span></div>
      </Card>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3, display: "flex", alignItems: "center", gap: T.s2 }}><I n="alertTriangle" s={14} c={T.warning} />Reset & Anniversary</div>
        <div style={{ padding: `${T.s3}`, background: T.warningBg, borderRadius: T.rSm, marginBottom: T.s3, fontSize: 12, color: "#a06c00", lineHeight: 1.5 }}><strong>Multi-entitlement detected.</strong> Reset follows oldest entitlement per ServiceNow policy.</div>
        {[{ l: "Governing Anniversary", v: "June 1", b: "Oldest entitlement" }, { l: "Next Reset", v: "Jun 1, 2026" }, { l: "Model", v: "Annual Burndown", b: "Changed Jan 2026" }, { l: "Meter Lag", v: "~24 hours" }, { l: "Overage Policy", v: "No hard stop", b: "True-up via AE" }].map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `7px 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, fontSize: 12 }}><span style={{ color: T.textTertiary }}>{r.l}</span><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 600 }}>{r.v}</span>{r.b && <Badge variant="warning">{r.b}</Badge>}</div></div>
        ))}
        <div style={{ marginTop: T.s3, padding: `${T.s2} ${T.s3}`, background: T.negativeBg, borderRadius: T.rSm, fontSize: 11, color: T.negative, lineHeight: 1.5 }}><strong>Note:</strong> Sub-prod counts toward budget. BYOLLM also consumes assists (double-cost).</div>
      </Card>
    </div>
    {/* Skill Breakdown + Env Split */}
    <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: T.s3, marginBottom: T.s4 }}>
      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.s3 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Consumption by Skill</span><span style={{ fontSize: 10, color: T.textTertiary }}>Source: sys_gen_ai_usage_log</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 60px 80px", gap: T.s2, padding: `${T.s2} 0`, fontSize: 11, fontWeight: 600, color: T.textTertiary, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `2px solid ${T.chromeDivider}` }}><span>Skill</span><span>Assists</span><span>Share</span><span>Cost</span></div>
        {ASSIST_SKILLS.map((s, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr 60px 80px", gap: T.s2, padding: `${T.s2} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, alignItems: "center", fontSize: 12 }}>
          <div><span style={{ fontWeight: 500 }}>{s.skill}</span><br /><span style={{ fontSize: 10, color: T.textTertiary }}>{s.category} • {fN(s.runs)} runs</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: T.s2 }}><div style={{ flex: 1, height: 6, background: T.surface2, borderRadius: 3 }}><div style={{ height: "100%", width: `${s.pct}%`, background: s.category === "Agentic" ? T.warning : PP, borderRadius: 3 }} /></div><span style={{ fontSize: 11, fontWeight: 500, minWidth: 50 }}>{fN(s.assists)}</span></div>
          <span style={{ color: T.textTertiary }}>{s.pct}%</span>
          <span style={{ fontWeight: 600, color: s.assists > 10000 ? T.warning : T.textSecondary }}>{fC(Math.round(s.assists * costPerAssist))}</span>
        </div>)}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 60px 80px", gap: T.s2, padding: `${T.s3} 0`, fontSize: 12, fontWeight: 700 }}><span>Total</span><span></span><span>100%</span><span style={{ color: PP }}>{fC(Math.round(totalAssists * costPerAssist))}</span></div>
      </Card>
      <Card>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Environment Split</div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: T.s2 }}>
          <ResponsiveContainer width={140} height={140}><PieChart><Pie data={ASSIST_ENVS} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" startAngle={90} endAngle={-270}><Cell fill={PP} /><Cell fill={T.warning} /></Pie></PieChart></ResponsiveContainer>
        </div>
        {ASSIST_ENVS.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: T.s2, padding: `6px 0`, fontSize: 12 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: i === 0 ? PP : T.warning }} /><span style={{ flex: 1 }}>{e.name}</span><span style={{ fontWeight: 600 }}>{fN(e.value)}</span><span style={{ color: T.textTertiary, fontSize: 11 }}>{e.pct}%</span></div>)}
        <div style={{ marginTop: T.s3, padding: T.s2, background: ASSIST_ENVS[1].pct > 25 ? T.negativeBg : T.positiveBg, borderRadius: T.rSm, fontSize: 11, color: ASSIST_ENVS[1].pct > 25 ? T.negative : T.positive, lineHeight: 1.4 }}><strong>{ASSIST_ENVS[1].pct}% sub-prod</strong> — {ASSIST_ENVS[1].pct > 25 ? "High. Review test governance." : "Acceptable."}</div>
      </Card>
    </div>
    {/* Agentic Workflow Cost Tracker */}
    <Card style={{ marginBottom: T.s4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: T.s3 }}><span style={{ fontSize: 14, fontWeight: 600 }}>Agentic Workflow Cost Tracker</span><div style={{ display: "flex", gap: T.s2 }}><Badge variant="success">Small ≤4 = 25</Badge><Badge variant="warning">Med 5–8 = 50</Badge><Badge variant="critical">Large 9–20 = 150</Badge></div></div>
      <div style={{ display: "grid", gridTemplateColumns: "200px 50px 70px 70px 70px 70px 70px 1fr", gap: T.s2, padding: `${T.s2} 0`, fontSize: 10, fontWeight: 600, color: T.textTertiary, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `2px solid ${T.chromeDivider}` }}><span>Agent</span><span>Runs</span><span>Size</span><span>Act/Run</span><span>Ast/Run</span><span>Total</span><span>Cost</span><span>Trend</span></div>
      {ASSIST_AGENTS.map((ag, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "200px 50px 70px 70px 70px 70px 70px 1fr", gap: T.s2, padding: `${T.s2} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, alignItems: "center", fontSize: 12 }}>
        <span style={{ fontWeight: 500 }}>{ag.name}</span><span>{ag.runs}</span><Badge variant={ag.size === "Small" ? "success" : ag.size === "Medium" ? "warning" : "critical"}>{ag.size}</Badge><span style={{ color: T.textSecondary }}>{ag.actionsPerRun}</span><span style={{ color: T.textSecondary }}>{ag.assistsPerRun}</span><span style={{ fontWeight: 600 }}>{fN(ag.total)}</span><span style={{ fontWeight: 600, color: ag.total > 1000 ? T.warning : T.textSecondary }}>{fC(Math.round(ag.total * costPerAssist))}</span><span style={{ fontSize: 11, color: ag.trend === "new" ? T.brandPrimary : T.textTertiary }}>{ag.trend}</span>
      </div>)}
      <div style={{ marginTop: T.s3, padding: `${T.s2} ${T.s3}`, background: T.purpleLight, borderRadius: T.rSm, fontSize: 12, color: PP, lineHeight: 1.5 }}><I n="sparkle" s={11} c={PP} /> <strong>Design guideline:</strong> Keep agents ≤4 actions (Small tier). Onboarding Orchestrator at 14 actions/run consumes 6× more than Incident Triage.</div>
    </Card>
    {/* Budget Alert Thresholds */}
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Budget Alert Thresholds</div>
      <div style={{ marginBottom: T.s3 }}><div style={{ height: 28, background: T.surface2, borderRadius: T.rSm, position: "relative", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pctBurned}%`, background: `linear-gradient(90deg, ${T.positive}, ${PP})`, borderRadius: T.rSm }} />
        {[50, 75, 85, 100].map(t => <div key={t} style={{ position: "absolute", left: `${t}%`, top: 0, bottom: 0, width: 2, background: t === 100 ? T.negative : T.textTertiary, opacity: t === 100 ? 1 : .5 }}><span style={{ position: "absolute", top: -14, left: -8, fontSize: 9, color: t === 100 ? T.negative : T.textTertiary, fontWeight: 600 }}>{t}%</span></div>)}
        <div style={{ position: "absolute", left: `${pctBurned}%`, top: -2, width: 3, height: 32, background: PP, borderRadius: 2 }}><span style={{ position: "absolute", bottom: -16, left: -12, fontSize: 10, fontWeight: 700, color: PP }}>Now</span></div>
      </div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: T.s3 }}>
        {[{ threshold: 50, status: "passed", date: "Dec 14, 2025", action: "Internal review", sev: "info" }, { threshold: 75, status: "not reached", date: "—", action: "Throttle non-essential skills", sev: "warning" }, { threshold: 85, status: "not reached", date: "—", action: "Pause sub-prod; review agents", sev: "warning" }, { threshold: 100, status: "not reached", date: "—", action: "Compliance true-up with AE", sev: "critical" }].map((t, i) => (
          <div key={i} style={{ padding: `${T.s3}`, border: `1px solid ${T.chromeDividerSubtle}`, borderRadius: T.rSm, borderLeft: `3px solid ${t.status === "passed" ? T.positive : t.sev === "critical" ? T.negative : T.warning}`, background: t.status === "passed" ? T.positiveBg + "44" : "transparent" }}>
            <div style={{ fontSize: 20, fontWeight: 300, color: t.status === "passed" ? T.positive : T.textTertiary }}>{t.threshold}%</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.status === "passed" ? T.positive : T.textTertiary, marginBottom: T.s1 }}>{t.status === "passed" ? `Passed ${t.date}` : "Not yet reached"}</div>
            <div style={{ fontSize: 11, color: T.textSecondary }}>{t.action}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: T.s3, fontSize: 11, color: T.textTertiary }}>ServiceNow does not hard-stop at 100%. ContractIQ provides the internal governance layer.</div>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   USAGE TRACKER
   ═══════════════════════════════════════════════════════════ */
function UsageView({ showManual, setShowManual }) {
  const [metric, setMetric] = useState("ihub");
  const ms = [{ id: "ihub", label: "Integration Hub", key: "ihub", color: T.brandPrimary, limit: 500000, source: "Platform (Auto)", risk: 0, insight: "Approaching limit — negotiate +20% at renewal." }, { id: "assists", label: "Now Assist", key: "assists", color: T.purple, limit: 200000, source: "Now Assist Admin (Auto)", risk: 96200, insight: "24% consumed. €96K at risk. Expand or renegotiate." }, { id: "credits", label: "Learning Credits", key: "credits", color: T.warning, limit: 800, source: "Manual (Now Learning)", risk: 54400, insight: "15% consumed, expiring in 19 days. €5,440 at risk." }, { id: "fulfiller", label: "Fulfillers", key: "fulfiller", color: T.positive, limit: 250, source: "Subscription Mgmt v2 (Auto)", risk: 0, insight: "Right-sized at 87%. Consider slight reduction." }];
  const a = ms.find(m => m.id === metric); const cur = USAGE_TREND[USAGE_TREND.length - 1][a.key]; const pct = Math.round((cur / a.limit) * 100);
  const usageSidebar = <>
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s2 }}>Actions</div>
      {[["Manual Usage Entry", "plus", () => setShowManual(true)], ["Export Report", "download", () => {}]].map(([l, ic, fn], i) => (
        <div key={i} onClick={fn} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", fontSize: 13, color: T.textLink, cursor: "pointer" }}><I n={ic} s={11} c={T.textLink} />{l}</div>
      ))}
    </Card>
    <Card>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s2 }}>Quick Links</div>
      {[["Entitlements", "layers"], ["Renewal Cockpit", "target"], ["Alert Center", "bell"], ["Configuration", "settings"]].map(([l, ic], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", fontSize: 13, color: T.textLink, cursor: "pointer" }}><I n={ic} s={11} c={T.textLink} />{l}</div>
      ))}
    </Card>
    <Card>
      <div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s1 }}>Current: {a.label}</div>
      <div style={{ fontSize: 32, fontWeight: 300, color: pct > 85 ? T.negative : pct > 65 ? T.warning : a.color, lineHeight: 1 }}>{pct}%</div>
      <div style={{ fontSize: 11, color: T.textTertiary, marginTop: T.s1 }}>{fN(cur)} / {fN(a.limit)}</div>
      <div style={{ marginTop: T.s2, height: 4, background: T.surface2, borderRadius: 2 }}><div style={{ height: "100%", width: `${Math.min(pct, 100)}%`, background: pct > 85 ? T.negative : pct > 65 ? T.warning : a.color, borderRadius: 2 }} /></div>
    </Card>
  </>;
  return (<WorkspaceLayout sidebar={usageSidebar}><div>
    {/* Metric tabs */}
    <div style={{ display: "flex", gap: T.s6, borderBottom: `2px solid ${T.chromeDivider}`, marginBottom: T.s4, padding: `0 ${T.s1}` }}>
      {ms.map(m => <button key={m.id} onClick={() => setMetric(m.id)} style={{ background: "none", border: "none", padding: `${T.s3} 0`, fontSize: 14, fontWeight: metric === m.id ? 600 : 400, color: metric === m.id ? m.color : T.textSecondary, borderBottom: metric === m.id ? `2px solid ${m.color}` : "2px solid transparent", marginBottom: "-2px", cursor: "pointer", fontFamily: T.font }}>{m.label}</button>)}
    </div>
    {/* Financial context strip */}
    <Card style={{ marginBottom: T.s4, padding: `${T.s3} ${T.s4}` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: T.s2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.s4 }}>
          <div><div style={{ fontSize: 11, color: T.textTertiary, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>Entitlement</div><div style={{ fontSize: 14, fontWeight: 600 }}>{fN(a.limit)} / yr</div></div>
          <div style={{ width: 1, height: 28, background: T.chromeDivider }} />
          <div><div style={{ fontSize: 11, color: T.textTertiary, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>Consumed</div><div style={{ fontSize: 14, fontWeight: 600, color: pct > 85 ? T.negative : pct > 65 ? T.warning : T.positive }}>{fN(cur)} ({pct}%)</div></div>
          <div style={{ width: 1, height: 28, background: T.chromeDivider }} />
          <div><div style={{ fontSize: 11, color: T.textTertiary, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".5px" }}>{a.risk > 0 ? "€ at Risk" : "Status"}</div><div style={{ fontSize: 14, fontWeight: 700, color: a.risk > 0 ? T.negative : T.positive }}>{a.risk > 0 ? fC(a.risk) : "Healthy"}</div></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: a.source.includes("Auto") ? T.positive : T.warning }} /><span style={{ color: T.textTertiary }}>Source: {a.source}</span></div>
      </div>
      <div style={{ marginTop: T.s2, padding: `${T.s2} ${T.s3}`, background: a.risk > 0 ? T.negativeBg : T.positiveBg, borderRadius: T.rSm, fontSize: 12, color: a.risk > 0 ? T.negative : T.positive, fontWeight: 500 }}><I n="sparkle" s={11} c={a.risk > 0 ? T.negative : T.positive} /> {a.insight}</div>
    </Card>
    {/* Now Assist FinOps or standard view */}
    {metric === "assists" ? <NowAssistFinOps /> : <>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: T.s3, marginBottom: T.s4 }}>
        <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Consumption Trend: {a.label}</div>
          <ResponsiveContainer width="100%" height={240}><AreaChart data={USAGE_TREND}><defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={a.color} stopOpacity={.15} /><stop offset="95%" stopColor={a.color} stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={T.chromeDividerSubtle} /><XAxis dataKey="month" tick={{ fill: T.textTertiary, fontSize: 11 }} axisLine={{ stroke: T.chromeDivider }} /><YAxis tick={{ fill: T.textTertiary, fontSize: 11 }} axisLine={{ stroke: T.chromeDivider }} tickFormatter={fN} /><Tooltip contentStyle={{ background: "#fff", border: `1px solid ${T.chromeDivider}`, borderRadius: T.rMd, fontSize: 12 }} /><Area type="monotone" dataKey={a.key} stroke={a.color} fill="url(#ug)" strokeWidth={2} /></AreaChart></ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: T.textTertiary, marginTop: T.s1 }}><span>Data via {a.source}</span><span>Limit: {fN(a.limit)}</span></div>
        </Card>
        <Card style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: 11, color: T.textTertiary, textTransform: "uppercase", fontWeight: 600, letterSpacing: ".5px", marginBottom: T.s3 }}>Period Utilization</div>
          <div style={{ width: 110, height: 110, borderRadius: "50%", border: `8px solid ${T.surface2}`, borderTopColor: a.color, borderRightColor: pct > 25 ? a.color : T.surface2, borderBottomColor: pct > 50 ? a.color : T.surface2, borderLeftColor: pct > 75 ? a.color : T.surface2, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 28, fontWeight: 300, color: pct > 85 ? T.negative : pct > 65 ? T.warning : a.color }}>{pct}%</span></div>
          <div style={{ marginTop: T.s4, fontSize: 13, fontWeight: 600 }}>{fN(cur)} / {fN(a.limit)}</div>
          <div style={{ fontSize: 12, color: T.textTertiary }}>Remaining: {fN(a.limit - cur)}</div>
          {a.risk > 0 && <div style={{ marginTop: T.s2, fontSize: 12, fontWeight: 700, color: T.negative }}>{fC(a.risk)} at risk</div>}
        </Card>
      </div>
      <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Collection Log</div>
        <div style={{ display: "grid", gridTemplateColumns: "160px 100px 1fr 120px", gap: T.s2, padding: `${T.s2} 0`, fontSize: 11, fontWeight: 600, color: T.textTertiary, textTransform: "uppercase", letterSpacing: ".4px", borderBottom: `2px solid ${T.chromeDivider}` }}><span>Timestamp</span><span>Source</span><span>Metric</span><span>Value</span></div>
        {[["Feb 23, 06:00", "Platform", "Integration Hub Transactions", "387,420"], ["Feb 23, 06:00", "Sub. Mgmt v2", "Fulfiller License Count", "218"], ["Feb 20, 14:32", "Manual", "Learning Credits Balance", "120"], ["Feb 18, 09:15", "Manual", "Expert Services Hours", "45"]].map(([d, s, m, v], i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "160px 100px 1fr 120px", gap: T.s2, padding: `${T.s2} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, fontSize: 12 }}><span style={{ color: T.textTertiary }}>{d}</span><Badge variant={s === "Manual" ? "neutral" : "success"}>{s}</Badge><span>{m}</span><span style={{ fontWeight: 500 }}>{v}</span></div>)}
      </Card>
    </>}
    {/* Manual entry modal */}
    {showManual && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 }} onClick={() => setShowManual(false)}><div style={{ background: "#fff", borderRadius: T.rMd, padding: T.s6, width: 440, boxShadow: "0 8px 32px rgba(0,0,0,.15)" }} onClick={e => e.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: T.s4 }}><h3 style={{ margin: 0, fontSize: 16 }}>Manual Usage Entry</h3><span style={{ cursor: "pointer" }} onClick={() => setShowManual(false)}><I n="close" s={16} c={T.textTertiary} /></span></div>
      <div style={{ padding: `${T.s2} ${T.s3}`, background: T.warningBg, borderRadius: T.rSm, fontSize: 12, color: "#a06c00", marginBottom: T.s4 }}>For metrics not yet available via platform APIs.</div>
      <div style={{ marginBottom: T.s3 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: T.s1 }}>Entitlement</label><select style={{ width: "100%", padding: `7px ${T.s3}`, border: `1px solid ${T.chromeDivider}`, borderRadius: T.rSm, fontSize: 13, fontFamily: T.font, background: "#fff" }}>{ENTITLEMENTS.filter(e => ["Training", "Service"].includes(e.category)).map(e => <option key={e.id}>{e.name}</option>)}</select></div>
      <div style={{ marginBottom: T.s3 }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textSecondary, marginBottom: T.s1 }}>Current Usage Value</label><input type="number" placeholder="0" style={{ width: "100%", boxSizing: "border-box", padding: `7px ${T.s3}`, border: `1px solid ${T.chromeDivider}`, borderRadius: T.rSm, fontSize: 13, fontFamily: T.font }} /></div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: T.s2, marginTop: T.s4 }}><Btn variant="secondary" onClick={() => setShowManual(false)}>Cancel</Btn><Btn onClick={() => setShowManual(false)}>Save</Btn></div>
    </div></div>}
  </div></WorkspaceLayout>);
}

/* ═══════════════════════════════════════════════════════════
   ALERTS
   ═══════════════════════════════════════════════════════════ */
function AlertsView({ alerts, dismiss, nav }) {
  return (<div>
    <div style={{ display: "flex", gap: T.s2, marginBottom: T.s4 }}>
      {[["critical", T.negative], ["warning", T.warning], ["info", T.brandPrimary]].map(([s, c]) => { const n = alerts.filter(a => a.severity === s).length; return <div key={s} style={{ background: c + "0d", border: `1px solid ${c}22`, borderRadius: T.rSm, padding: `${T.s1} ${T.s3}`, fontSize: 12, fontWeight: 600, color: c, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: c }} />{n} {s}</div>; })}
    </div>
    {alerts.map(a => { const bc = a.severity === "critical" ? T.negative : a.severity === "warning" ? T.warning : T.brandPrimary; return <Card key={a.id} style={{ marginBottom: T.s2, borderLeft: `4px solid ${bc}` }}>
      <div style={{ display: "flex", gap: T.s3 }}><SevIcon severity={a.severity} size={18} /><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{a.title}</div><div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s2 }}>{a.subtitle}</div><div style={{ display: "flex", gap: T.s2 }}><Btn variant="outline" small onClick={() => { if (a.entitlement) nav("entitlements", { entitlement: a.entitlement }); }}>{a.action}</Btn><Btn variant="link" small onClick={() => dismiss(a.id)}>Dismiss</Btn></div></div><span style={{ fontSize: 11, color: T.textTertiary, whiteSpace: "nowrap" }}>{a.date}</span></div>
    </Card>; })}
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   RENEWAL COCKPIT
   ═══════════════════════════════════════════════════════════ */
function RenewalView() {
  const total = RENEWAL_DATA.savings.reduce((a, s) => a + s.amount, 0);
  return (<div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: T.s3, marginBottom: T.s5 }}>
      <Card style={{ display: "flex", alignItems: "center", gap: T.s5 }}><div style={{ width: 70, height: 70, borderRadius: "50%", border: `6px solid ${T.warning}`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 24, fontWeight: 300, color: T.warning }}>62%</span></div><div><div style={{ fontSize: 12, color: T.textSecondary }}>Value Realization</div><div style={{ fontSize: 11, color: T.textTertiary, marginTop: 2 }}>of purchased value consumed</div></div></Card>
      <Card><div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s2 }}>Value at Risk</div><div style={{ fontSize: 32, fontWeight: 300, color: T.negative }}>{fC(total)}</div><div style={{ fontSize: 11, color: T.textTertiary, marginTop: 2 }}>Savings + recovery potential</div></Card>
      <Card><div style={{ fontSize: 12, color: T.textSecondary, marginBottom: T.s2 }}>Negotiation Leverage</div><div style={{ fontSize: 13, lineHeight: 1.8 }}><span style={{ color: T.negative, fontWeight: 700 }}>3</span> underutilized • <span style={{ color: T.warning, fontWeight: 700 }}>2</span> at limit • <span style={{ color: T.positive, fontWeight: 700 }}>4</span> right-size opps</div></Card>
    </div>
    <Card style={{ marginBottom: T.s5 }}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Entitlement Utilization</div>
      {RENEWAL_DATA.scores.map((e, i) => { const sc = e.score > 75 ? T.positive : e.score > 50 ? T.warning : T.negative; return <div key={i} style={{ display: "grid", gridTemplateColumns: "50px 100px 1fr 1fr 24px", gap: T.s2, padding: `${T.s3} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}`, alignItems: "center", fontSize: 13 }}><span style={{ fontWeight: 700, color: sc }}>{e.score}%</span><Progress value={e.score} max={100} height={5} /><span style={{ fontWeight: 500 }}>{e.name}</span><span style={{ color: T.textSecondary, fontSize: 12 }}>{e.rec}</span>{e.score > 75 ? <I n="checkCircle" s={14} c={T.positive} /> : <I n="alertTriangle" s={14} c={sc} />}</div>; })}
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: T.s3 }}>
      <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Optimization Opportunities</div>
        {RENEWAL_DATA.savings.map((s, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: T.s3, padding: `${T.s3} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}` }}><div style={{ width: 28, height: 28, borderRadius: T.rSm, background: s.type === "reduction" ? T.positiveBg : T.infoBg, display: "flex", alignItems: "center", justifyContent: "center" }}><I n={s.type === "reduction" ? "arrowDown" : "arrowUp"} s={14} c={s.type === "reduction" ? T.positive : T.brandPrimary} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{s.area}</div><div style={{ fontSize: 11, color: T.textTertiary }}>{s.type === "reduction" ? "Cost Reduction" : "Value Recovery"}</div></div><span style={{ fontSize: 15, fontWeight: 700, color: T.positive }}>{fC(s.amount)}</span></div>)}
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: T.s3 }}><span style={{ fontSize: 14, fontWeight: 700 }}>Total</span><span style={{ fontSize: 18, fontWeight: 300, color: T.positive }}>{fC(total)}</span></div>
      </Card>
      <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Renewal Checklist</div>
        {[{ t: "Export data from Subscription Mgmt v2", d: true }, { t: "Capture Now Assist Admin Console metrics", d: true }, { t: "Check Now Learning portal for credit balance", d: true }, { t: "Calculate Approver license right-sizing (€67.5K)", d: false }, { t: "Request IHub transaction increase (+20%)", d: false }, { t: "Negotiate Learning Credit rollover clause", d: false }, { t: "Benchmark pricing (Flexera/Gartner)", d: false }].map((item, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: T.s3, padding: `${T.s2} 0`, borderBottom: `1px solid ${T.chromeDividerSubtle}` }}><div style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${item.d ? T.positive : T.chromeDivider}`, background: item.d ? T.positiveBg : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.d && <I n="check" s={10} c={T.positive} />}</div><span style={{ fontSize: 12, color: item.d ? T.textTertiary : T.textPrimary, textDecoration: item.d ? "line-through" : "none" }}>{item.t}</span></div>)}
      </Card>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════════════ */
function SettingsView() {
  return (<div>
    <Card style={{ marginBottom: T.s4, padding: `${T.s3} ${T.s4}`, background: T.infoBg }}>
      <div style={{ fontSize: 13, color: T.brandPrimary, lineHeight: 1.5 }}><strong>ContractIQ reads from your existing ServiceNow telemetry</strong> — it does not replicate what Subscription Management or Now Assist Admin already track.</div>
    </Card>
    <Card style={{ marginBottom: T.s4 }}><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s1 }}>Connected Data Sources</div><p style={{ fontSize: 12, color: T.textTertiary, margin: `0 0 ${T.s3}` }}>ContractIQ consumes data from these native ServiceNow sources</p>
      {[["Subscription Management v2", "connected", "User licenses, custom tables, storage", "Daily 06:00"],
        ["Now Assist Admin Console", "connected", "Assist actions, skill performance", "Daily 06:00"],
        ["Platform Usage Analytics", "connected", "IHub transactions, PA indicators", "Daily 06:00"],
        ["Now Learning Portal", "manual", "Learning Credits balance", "Monthly reminder"],
        ["Expert Services Tracker", "manual", "Expert Services hours consumed", "Monthly reminder"],
      ].map(([n, s, metrics, freq], i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: T.s3, padding: T.s3, border: `1px solid ${T.chromeDividerSubtle}`, borderRadius: T.rSm, marginBottom: T.s2, borderLeft: `3px solid ${s === "connected" ? T.positive : T.warning}` }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: s === "connected" ? T.positive : T.warning, marginTop: 5, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.s2 }}><span style={{ fontSize: 13, fontWeight: 600 }}>{n}</span><Badge variant={s === "connected" ? "success" : "warning"}>{s === "connected" ? "Connected" : "Manual"}</Badge><span style={{ fontSize: 11, color: T.textTertiary, marginLeft: "auto" }}>{freq}</span></div>
          <div style={{ fontSize: 12, color: T.textSecondary, marginTop: 2 }}>{metrics}</div>
        </div>
        <Btn variant="outline" small>{s === "connected" ? "Configure" : "Set Reminder"}</Btn>
      </div>)}
    </Card>
    <Card><div style={{ fontSize: 14, fontWeight: 600, marginBottom: T.s3 }}>Access Roles</div>
      {[["x_teiva_contractiq.admin", "Full CRUD • configure alerts • manage data sources", "2"], ["x_teiva_contractiq.manager", "Read/write • manual usage entry • renewal prep", "5"], ["x_teiva_contractiq.viewer", "Read-only dashboards • for leadership & finance", "12"]].map(([r, d, u], i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: T.s3, padding: `${T.s3}`, border: `1px solid ${T.chromeDividerSubtle}`, borderRadius: T.rSm, marginBottom: T.s2 }}><I n="shield" s={14} c={T.brandPrimary} /><div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500, fontFamily: "monospace" }}>{r}</div><div style={{ fontSize: 11, color: T.textTertiary }}>{d}</div></div><Badge>{u} users</Badge></div>)}
    </Card>
  </div>);
}
