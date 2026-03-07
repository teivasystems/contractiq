import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line, ReferenceLine, PieChart, Pie, Cell } from "recharts";
import {
  FileText, Layers, Activity, Bell, RefreshCw, Settings,
  ChevronRight, ChevronDown, AlertTriangle, CheckCircle, Clock, TrendingUp,
  Upload, Plus, Search, Download, Edit, Calendar, DollarSign, Users,
  Database, Zap, GraduationCap, Briefcase, BarChart3, ArrowUpRight, ArrowDownRight,
  X, Check, Info, Shield, Target, Home, Loader, Sparkles, Eye,
  ExternalLink, ArrowRight, Minus, MessageCircle, Send, Bot
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   ServiceNow Workspace Design Tokens
   ═══════════════════════════════════════════════════════ */
const SN = {
  // Chrome (dark navy tab bar matching SN workspace)
  tabBar: "#1b2a4a",
  tabText: "rgba(255,255,255,0.8)",
  tabActive: "#ffffff",
  tabActiveBg: "rgba(255,255,255,0.08)",
  tabUnderline: "#ffffff",
  // Accent (purple/indigo from real workspace)
  accent: "#5a3e9e",
  accentLight: "#ede8f5",
  accentBorder: "#c9b8e8",
  // Primary
  primary: "#1f6bff",
  primaryLight: "#e8f0ff",
  // Page
  pageBg: "#f0f0f3",
  cardBg: "#ffffff",
  cardBorder: "#e3e3e8",
  cardShadow: "0 1px 4px rgba(0,0,0,0.06)",
  cardRadius: 6,
  // Text
  textPrimary: "#1e1e1e",
  textSecondary: "#5a5a5a",
  textTertiary: "#8c8c8c",
  textPlaceholder: "#b0b0b0",
  // Semantic
  positive: "#2ca04b",
  positiveBg: "#e9f7ec",
  moderate: "#c47e1a",
  moderateBg: "#fef4e4",
  critical: "#c4314b",
  criticalBg: "#fce4e8",
  info: "#1f6bff",
  infoBg: "#e8f0ff",
  // Lines
  divider: "#e3e3e8",
  dividerLight: "#eeeef2",
  inputBorder: "#c8c8c8",
  // Misc
  hoverBg: "#f6f6f9",
  selectionBg: "#ede8f5",
  green: "#62d84e",
};
const font = "'Source Sans Pro','Segoe UI',-apple-system,sans-serif";
const hFont = "'Source Sans Pro','Segoe UI',-apple-system,sans-serif";

/* ═══════════════════════════════════════════════════════ */
const fN = n => { if(n>=1e6) return (n/1e6).toFixed(1)+"M"; if(n>=1e3) return (n/1e3).toFixed(0)+"K"; return n.toString(); };
const fC = n => "€"+n.toLocaleString();
const sColor = s => s==="healthy"?SN.positive:s==="warning"?SN.moderate:SN.critical;

/* ═══════════════════════════════════════════════════════
   Shared Components
   ═══════════════════════════════════════════════════════ */
function Spinner({children}){const ref=useRef(null);useEffect(()=>{const el=ref.current;if(!el)return;let a=0,r;const f=()=>{a=(a+4)%360;el.style.transform=`rotate(${a}deg)`;r=requestAnimationFrame(f);};r=requestAnimationFrame(f);return()=>cancelAnimationFrame(r);},[]);return <div ref={ref} style={{display:"inline-flex"}}>{children}</div>;}

const Badge = ({children,variant="default"}) => {
  const m={default:{bg:SN.accentLight,c:SN.accent},positive:{bg:SN.positiveBg,c:SN.positive},warning:{bg:SN.moderateBg,c:SN.moderate},critical:{bg:SN.criticalBg,c:SN.critical},neutral:{bg:"#eeeef2",c:SN.textSecondary},count:{bg:SN.positive,c:"#fff"}};
  const s=m[variant]||m.default;
  return <span style={{background:s.bg,color:s.c,padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:600,fontFamily:font,whiteSpace:"nowrap",letterSpacing:.2}}>{children}</span>;
};
const Progress = ({value,max,height=4}) => {
  const pct=Math.min((value/max)*100,100);const c=pct>85?SN.critical:pct>65?SN.moderate:SN.positive;
  return <div style={{background:"#e8e8e8",borderRadius:2,height,width:"100%"}}><div style={{background:c,height:"100%",width:`${pct}%`,borderRadius:2,transition:"width .6s"}}/></div>;
};
/* Card with optional left accent border (matching workspace style) */
const Card = ({children,accent,style={},onClick}) => (
  <div onClick={onClick} style={{background:SN.cardBg,border:`1px solid ${SN.cardBorder}`,borderRadius:SN.cardRadius,boxShadow:SN.cardShadow,borderLeft:accent?`3px solid ${accent}`:undefined,padding:20,cursor:onClick?"pointer":"default",transition:"box-shadow .15s",...style}}
    onMouseEnter={e=>{if(onClick)e.currentTarget.style.boxShadow="0 2px 8px rgba(0,0,0,0.1)";}}
    onMouseLeave={e=>{e.currentTarget.style.boxShadow=SN.cardShadow;}}>{children}</div>
);
const Btn = ({children,variant="primary",onClick,icon:Icon,disabled,small,style={}}) => {
  const sz=small?{padding:"4px 12px",fontSize:12}:{padding:"6px 16px",fontSize:13};
  const base={display:"inline-flex",alignItems:"center",gap:6,borderRadius:4,fontWeight:500,fontFamily:font,cursor:disabled?"not-allowed":"pointer",border:"none",transition:"all .15s",opacity:disabled?.5:1,...sz,...style};
  if(variant==="primary") return <button onClick={disabled?undefined:onClick} style={{...base,background:SN.accent,color:"#fff"}}>{Icon&&<Icon size={small?12:14}/>}{children}</button>;
  if(variant==="outline") return <button onClick={disabled?undefined:onClick} style={{...base,background:"#fff",color:SN.accent,border:`1px solid ${SN.accent}`}}>{Icon&&<Icon size={small?12:14}/>}{children}</button>;
  if(variant==="secondary") return <button onClick={disabled?undefined:onClick} style={{...base,background:"#fff",color:SN.textPrimary,border:`1px solid ${SN.inputBorder}`}}>{Icon&&<Icon size={small?12:14}/>}{children}</button>;
  return <button onClick={disabled?undefined:onClick} style={{...base,background:"transparent",color:SN.primary,padding:"4px 6px"}}>{Icon&&<Icon size={small?12:14}/>}{children}</button>;
};
const Input = ({label,placeholder,type="text",value,onChange,...rest}) => (
  <div style={{marginBottom:12}}>{label&&<label style={{display:"block",fontSize:12,fontWeight:600,color:SN.textSecondary,marginBottom:4,fontFamily:font}}>{label}</label>}<input type={type} placeholder={placeholder} value={value} onChange={onChange} {...rest} style={{width:"100%",boxSizing:"border-box",padding:"7px 10px",border:`1px solid ${SN.inputBorder}`,borderRadius:4,fontSize:13,fontFamily:font,color:SN.textPrimary,outline:"none",background:"#fff"}} onFocus={e=>e.target.style.borderColor=SN.accent} onBlur={e=>e.target.style.borderColor=SN.inputBorder}/></div>
);
const SevIcon = ({severity,size=14}) => severity==="critical"?<AlertTriangle size={size} color={SN.critical}/>:severity==="warning"?<AlertTriangle size={size} color={SN.moderate}/>:<Info size={size} color={SN.info}/>;

/* Decorative dots pattern (top-right, matching workspace) */
const DecoDots = () => (
  <svg width="160" height="80" viewBox="0 0 160 80" style={{position:"absolute",top:10,right:20,opacity:.35,pointerEvents:"none"}}>
    {[...Array(5)].map((_,r)=>[...Array(7)].map((_,c)=><circle key={`${r}-${c}`} cx={c*24+12} cy={r*16+8} r={r===2&&c===5?6:r===1&&c===6?4:r===3&&c===4?5:2} fill={SN.accent} opacity={r===2&&c===5?.3:r===1&&c===6?.2:.15}/>))}
  </svg>
);

/* ═══════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════ */
const CONTRACTS=[{id:"C001",name:"ServiceNow Enterprise Suite 2024-2027",number:"SNW-2024-ENT-4821",type:"Renewal",status:"Active",startDate:"2024-03-15",endDate:"2027-03-14",anniversary:"March 15",acv:842000,tcv:2526000,daysRemaining:383,healthScore:62},{id:"C002",name:"Now Assist Add-On 2024",number:"SNW-2024-NA-1205",type:"Add-On",status:"Active",startDate:"2024-06-01",endDate:"2027-03-14",anniversary:"June 1",acv:185000,tcv:510000,daysRemaining:383,healthScore:41}];
const ENTITLEMENTS=[
  {id:"E001",contract:"C001",name:"ITSM Fulfiller Licenses",category:"User License",purchased:250,used:218,unit:"Users",expiry:"2027-03-14",resetCycle:"None",status:"healthy",icon:Users},
  {id:"E002",contract:"C001",name:"ITSM Approver Licenses",category:"User License",purchased:500,used:312,unit:"Users",expiry:"2027-03-14",resetCycle:"None",status:"healthy",icon:Users},
  {id:"E003",contract:"C001",name:"Custom Tables (App Engine)",category:"Capacity",purchased:100,used:73,unit:"Tables",expiry:"2027-03-14",resetCycle:"None",status:"warning",icon:Database},
  {id:"E004",contract:"C001",name:"Integration Hub Transactions",category:"Consumption",purchased:500000,used:387420,unit:"Transactions/yr",expiry:"2025-03-14",resetCycle:"Annual",status:"warning",icon:Zap},
  {id:"E005",contract:"C002",name:"Now Assist (Assists)",category:"Consumption",purchased:200000,used:48200,unit:"Assists/yr",expiry:"2025-06-01",resetCycle:"Annual",status:"critical",icon:Zap},
  {id:"E006",contract:"C001",name:"Learning Credits",category:"Training",purchased:800,used:120,unit:"Credits",expiry:"2025-03-14",resetCycle:"Annual",status:"critical",icon:GraduationCap},
  {id:"E007",contract:"C001",name:"Expert Services Hours",category:"Service",purchased:200,used:45,unit:"Hours",expiry:"2027-03-14",resetCycle:"Term",status:"critical",icon:Briefcase},
  {id:"E008",contract:"C001",name:"Storage Allocation",category:"Capacity",purchased:500,used:234,unit:"GB",expiry:"2027-03-14",resetCycle:"None",status:"healthy",icon:Database},
  {id:"E009",contract:"C001",name:"PA Indicators",category:"Capacity",purchased:50,used:38,unit:"Indicators",expiry:"2027-03-14",resetCycle:"None",status:"warning",icon:BarChart3},
];
const ALERTS=[
  {id:"A001",severity:"critical",title:"Learning Credits expiring in 19 days",subtitle:"800 credits purchased, only 120 used (15%). €5,440 value at risk.",entitlement:"E006",date:"Feb 23",action:"Plan training sessions"},
  {id:"A002",severity:"critical",title:"Now Assist severely underutilized",subtitle:"Only 24% consumed with 97 days remaining.",entitlement:"E005",date:"Feb 22",action:"Expand deployment"},
  {id:"A003",severity:"warning",title:"Integration Hub approaching 80% threshold",subtitle:"387,420 / 500,000 transactions used.",entitlement:"E004",date:"Feb 21",action:"Review integrations"},
  {id:"A004",severity:"warning",title:"Custom table count at 73% capacity",subtitle:"73 of 100 tables in use.",entitlement:"E003",date:"Feb 20",action:"Audit scoped apps"},
  {id:"A005",severity:"info",title:"Contract renewal window opens in 383 days",subtitle:"Begin renewal preparation.",entitlement:null,date:"Feb 19",action:"Start renewal cockpit"},
  {id:"A006",severity:"info",title:"Expert Services: only 22.5% utilized",subtitle:"45 of 200 hours consumed.",entitlement:"E007",date:"Feb 18",action:"Schedule sessions"},
];
const USAGE_TREND=[{month:"Mar 24",fulfiller:195,assists:0,ihub:28500,credits:800},{month:"Jun 24",fulfiller:202,assists:8200,ihub:71200,credits:720},{month:"Sep 24",fulfiller:208,assists:19500,ihub:148300,credits:680},{month:"Dec 24",fulfiller:212,assists:28100,ihub:223800,credits:580},{month:"Mar 25",fulfiller:215,assists:34800,ihub:312400,credits:450},{month:"Jun 25",fulfiller:218,assists:38900,ihub:350100,credits:320},{month:"Sep 25",fulfiller:220,assists:42500,ihub:367200,credits:200},{month:"Dec 25",fulfiller:218,assists:46100,ihub:378900,credits:150},{month:"Feb 26",fulfiller:218,assists:48200,ihub:387420,credits:120}];
const RENEWAL_DATA={overallValueScore:62,scores:[{name:"ITSM Fulfillers",score:87,rec:"Right-sized. Consider slight reduction."},{name:"ITSM Approvers",score:62,rec:"Over-provisioned. Reduce by ~150."},{name:"Custom Tables",score:73,rec:"Adequate. Monitor Store installs."},{name:"IHub Transactions",score:77,rec:"Approaching limit. Negotiate +20%."},{name:"Now Assist",score:24,rec:"Severely underutilized. Expand or reduce."},{name:"Learning Credits",score:15,rec:"Near-total waste. Restructure urgently."},{name:"Expert Services",score:23,rec:"Underutilized. Schedule remaining hours."},{name:"Storage",score:47,rec:"Healthy headroom. No action."}],savings:[{area:"Approver License Right-sizing",amount:67500,type:"reduction"},{area:"Now Assist Budget Optimization",amount:96200,type:"reduction"},{area:"Learning Credits Utilization",amount:54400,type:"recovery"},{area:"Expert Services Utilization",amount:31000,type:"recovery"}]};

/* ═══════════════════════════════════════════════════════
   Now Assist FinOps Data
   ═══════════════════════════════════════════════════════ */
// Contract-year burndown (cumulative since June 1 anniversary)
const ASSIST_BURNDOWN=[
  {month:"Jun 24",burned:8200,budget:200000},{month:"Jul 24",burned:11400,budget:200000},{month:"Aug 24",burned:14800,budget:200000},{month:"Sep 24",burned:19500,budget:200000},
  {month:"Oct 24",burned:22100,budget:200000},{month:"Nov 24",burned:24900,budget:200000},{month:"Dec 24",burned:28100,budget:200000},{month:"Jan 25",burned:31200,budget:200000},
  {month:"Feb 25",burned:34800,budget:200000},{month:"Mar 25",burned:37200,budget:200000},{month:"Apr 25",burned:39800,budget:200000},{month:"May 25",burned:42500,budget:200000},
  {month:"Jun 25",burned:0,budget:200000},{month:"Jul 25",burned:2100,budget:200000},{month:"Aug 25",burned:5800,budget:200000},{month:"Sep 25",burned:10200,budget:200000},
  {month:"Oct 25",burned:18400,budget:200000},{month:"Nov 25",burned:26800,budget:200000},{month:"Dec 25",burned:34100,budget:200000},{month:"Jan 26",burned:41200,budget:200000},{month:"Feb 26",burned:48200,budget:200000},
];
// Projected (dashed extension)
const ASSIST_PROJECTED=[
  {month:"Feb 26",burned:48200},{month:"Mar 26",burned:55800},{month:"Apr 26",burned:63200},{month:"May 26",burned:70500,projected:70500},
];
// Consumption by skill (from sys_gen_ai_usage_log)
const ASSIST_SKILLS=[
  {skill:"Incident Summarization",assists:22100,pct:46,runs:22100,category:"ITSM"},
  {skill:"Code Assist (AutoComplete)",assists:11050,pct:23,runs:14200,category:"Platform"},
  {skill:"Custom Skills (8 active)",assists:8180,pct:17,runs:6540,category:"Custom"},
  {skill:"Agentic Workflows",assists:4350,pct:9,runs:104,category:"Agentic"},
  {skill:"Document Q&A",assists:1540,pct:3,runs:1540,category:"Platform"},
  {skill:"Other (Virtual Agent, etc.)",assists:980,pct:2,runs:3200,category:"Self-Service"},
];
// Prod vs Sub-prod split
const ASSIST_ENVS=[{name:"Production",value:31400,pct:65},{name:"Sub-Production",value:16800,pct:35}];
// Agentic workflow runs detail
const ASSIST_AGENTS=[
  {name:"Incident Triage Agent",runs:42,size:"Small",actionsPerRun:3,assistsPerRun:25,total:1050,trend:"+12%"},
  {name:"Change Risk Assessment",runs:28,size:"Medium",actionsPerRun:6,assistsPerRun:50,total:1400,trend:"+8%"},
  {name:"Knowledge Article Agent",runs:22,size:"Medium",actionsPerRun:7,assistsPerRun:50,total:1100,trend:"+22%"},
  {name:"Onboarding Orchestrator",runs:12,size:"Large",actionsPerRun:14,assistsPerRun:150,total:1800,trend:"new"},
];

const EXTRACTION_STEPS=[{label:"Reading document structure...",duration:1800},{label:"Extracting contract metadata...",duration:1400},{label:"Identifying entitlement line items...",duration:2200},{label:"Mapping to ServiceNow SKU catalog...",duration:1600},{label:"Detecting reset cycles & anniversaries...",duration:1200},{label:"Cross-referencing platform usage data...",duration:2000},{label:"Calculating value realization scores...",duration:1400},{label:"Generating alert rules...",duration:1000},{label:"Building renewal recommendations...",duration:1200}];
const EXTRACTED_FIELDS=[{label:"Contract Name",value:"ServiceNow Enterprise Suite 2024-2027",confidence:98},{label:"Contract Number",value:"SNW-2024-ENT-4821",confidence:97},{label:"Type",value:"Renewal",confidence:94},{label:"Start Date",value:"2024-03-15",confidence:99},{label:"End Date",value:"2027-03-14",confidence:99},{label:"Anniversary",value:"March 15 (Annual)",confidence:92},{label:"Annual Contract Value",value:"€842,000",confidence:96},{label:"Total Contract Value",value:"€2,526,000",confidence:96}];
const EXTRACTED_ENTITLEMENTS=[{name:"ITSM Fulfiller Licenses",category:"User License",qty:"250 Users",reset:"None",confidence:98},{name:"ITSM Approver Licenses",category:"User License",qty:"500 Users",reset:"None",confidence:97},{name:"Custom Tables (App Engine)",category:"Capacity",qty:"100 Tables",reset:"None",confidence:95},{name:"Integration Hub Transactions",category:"Consumption",qty:"500,000 / yr",reset:"Annual",confidence:96},{name:"Learning Credits",category:"Training",qty:"800 Credits",reset:"12-month",confidence:93},{name:"Expert Services Hours",category:"Service",qty:"200 Hours",reset:"Term",confidence:91},{name:"Storage Allocation",category:"Capacity",qty:"500 GB",reset:"None",confidence:94},{name:"PA Indicators",category:"Capacity",qty:"50 Indicators",reset:"None",confidence:88}];

/* ═══════════════════════════════════════════════════════
   Navigation Tabs
   ═══════════════════════════════════════════════════════ */
const TABS=[
  {id:"dashboard",label:"Home"},
  {id:"contracts",label:"Contracts"},
  {id:"entitlements",label:"Entitlements"},
  {id:"usage",label:"Usage Tracker"},
  {id:"alerts",label:"Alerts"},
  {id:"renewal",label:"Renewal Cockpit"},
  {id:"settings",label:"Configuration"},
];

/* ═══════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════ */
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
  useEffect(() => { if(appState!=="processing") return; if(procStep>=EXTRACTION_STEPS.length){setProcDone(true);return;} timerRef.current=setTimeout(()=>setProcStep(s=>s+1),EXTRACTION_STEPS[procStep].duration); return()=>clearTimeout(timerRef.current); }, [appState, procStep]);

  const nav = (p,opts={}) => { setPage(p); if(opts.contract) setSelContract(opts.contract); else if(p==="contracts") setSelContract(null); if(opts.entitlement) setSelEntitlement(opts.entitlement); else if(p==="entitlements") setSelEntitlement(null); };
  const activeAlerts = ALERTS.filter(a=>!dismissed.includes(a.id));
  const critCount = activeAlerts.filter(a=>a.severity==="critical").length;
  const isReady = appState==="ready";

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100vh",fontFamily:font,color:SN.textPrimary,background:SN.pageBg}}>
      {/* ── Workspace Tab Bar ── */}
      <div style={{background:SN.tabBar,display:"flex",alignItems:"stretch",padding:"0 20px",flexShrink:0,zIndex:10,height:40}}>
        {TABS.map(tab => {
          const active = isReady && page===tab.id;
          const disabled = !isReady;
          return (
            <div key={tab.id} onClick={()=>!disabled&&nav(tab.id)}
              style={{display:"flex",alignItems:"center",padding:"0 16px",fontSize:13.5,fontWeight:active?600:400,
                color:disabled?"rgba(255,255,255,0.3)":active?SN.tabActive:SN.tabText,
                background:active?SN.tabActiveBg:"transparent",
                borderBottom:active?`3px solid ${SN.tabUnderline}`:"3px solid transparent",
                cursor:disabled?"default":"pointer",transition:"all .15s",marginBottom:0,
                opacity:disabled?.45:1}}
              onMouseEnter={e=>{if(!disabled&&!active)e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
              onMouseLeave={e=>{if(!active)e.currentTarget.style.background="transparent";}}>
              {tab.label}
              {tab.id==="alerts"&&isReady&&critCount>0&&<span style={{marginLeft:6,background:SN.critical,color:"#fff",fontSize:10,fontWeight:700,borderRadius:10,minWidth:18,height:18,display:"inline-flex",alignItems:"center",justifyContent:"center",padding:"0 5px"}}>{critCount}</span>}
            </div>
          );
        })}
      </div>

      {/* ── Content Area ── */}
      <div style={{flex:1,overflow:"auto"}}>
        {/* Page Header Band (colored background extending under first widgets) */}
        {isReady && <div style={{position:"relative",background:"linear-gradient(135deg, #e8ecf4 0%, #d8dff0 40%, #eef0f6 100%)",padding:"20px 0 40px",marginBottom:-28}}>
          <DecoDots/>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"0 24px"}}>
            <h1 style={{fontFamily:hFont,fontSize:22,fontWeight:700,margin:0,color:SN.textPrimary}}>{TABS.find(t=>t.id===page)?.label}</h1>
            {page==="dashboard" && <p style={{fontSize:13,color:SN.textSecondary,margin:"2px 0 0"}}>Search, explore and manage your ServiceNow subscription</p>}
          </div>
        </div>}

        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 24px 24px",position:"relative"}}>
          {/* Non-ready states don't get the header */}
          {!isReady && <>
          {appState==="empty" && <EmptyState onStart={()=>setAppState("upload")}/>}
          {appState==="upload" && <UploadState fileName={fileName} setFileName={setFileName} dragging={dragging} setDragging={setDragging} onSubmit={startProcessing}/>}
          {appState==="processing" && <ProcessingState step={procStep} done={procDone} fileName={fileName} onContinue={()=>setAppState("review")}/>}
          {appState==="review" && <ReviewState onActivate={()=>{setAppState("ready");setPage("dashboard");}}/>}
          </>}

          {/* FULL APP */}
          {isReady && page==="dashboard" && <DashboardView nav={nav} alerts={activeAlerts}/>}
          {isReady && page==="contracts" && <ContractsView nav={nav} sel={selContract} setSel={setSelContract}/>}
          {isReady && page==="entitlements" && <EntitlementsView nav={nav} sel={selEntitlement} setSel={setSelEntitlement}/>}
          {isReady && page==="usage" && <UsageView showManual={showManual} setShowManual={setShowManual}/>}
          {isReady && page==="alerts" && <AlertsView alerts={activeAlerts} dismiss={id=>setDismissed([...dismissed,id])} nav={nav}/>}
          {isReady && page==="renewal" && <RenewalView/>}
          {isReady && page==="settings" && <SettingsView/>}
        </div>
      </div>

      {/* Footer strip */}
      <div style={{background:SN.cardBg,borderTop:`1px solid ${SN.divider}`,padding:"6px 24px",display:"flex",justifyContent:"space-between",fontSize:11,color:SN.textTertiary,flexShrink:0}}>
        <span>ContractIQ v0.1 by Teiva Systems</span>
        <span>Last synced: Feb 23, 2026 06:00 UTC &nbsp;•&nbsp; ACME Corporation</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Layout Helper: Main + Right Sidebar
   ═══════════════════════════════════════════════════════ */
function WorkspaceLayout({children, sidebar}) {
  if (!sidebar) return <div>{children}</div>;
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:16,alignItems:"start"}}>
      <div>{children}</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>{sidebar}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   KPI Widget (matching SN workspace pattern)
   ═══════════════════════════════════════════════════════ */
function KPIWidget({label, value, delta, deltaLabel, color, onClick, sparkData}) {
  return (
    <Card accent={SN.accentBorder} onClick={onClick} style={{padding:16}}>
      <div style={{fontSize:12,color:SN.textSecondary,marginBottom:8,fontWeight:500}}>{label}</div>
      <div style={{fontSize:32,fontWeight:700,fontFamily:hFont,color:color||SN.textPrimary,lineHeight:1}}>{value}</div>
      {delta!==undefined && <div style={{display:"flex",alignItems:"center",gap:4,marginTop:6,fontSize:12,color:SN.textTertiary}}>
        <Minus size={10}/> {delta} {deltaLabel}
      </div>}
      {sparkData && <div style={{marginTop:10,height:3,background:"#e8e8e8",borderRadius:2,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${sparkData}%`,background:color||SN.accent,borderRadius:2}}/>
      </div>}
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════
   STATE 1: EMPTY
   ═══════════════════════════════════════════════════════ */
function EmptyState({onStart}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",textAlign:"center",position:"relative"}}>
      <DecoDots/>
      <div style={{width:72,height:72,borderRadius:16,background:SN.accentLight,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24}}>
        <FileText size={36} color={SN.accent} strokeWidth={1.5}/>
      </div>
      <h1 style={{fontFamily:hFont,fontSize:26,fontWeight:700,margin:"0 0 8px"}}>Welcome to ContractIQ</h1>
      <p style={{fontSize:15,color:SN.textSecondary,maxWidth:480,margin:"0 0 8px",lineHeight:1.6}}>Upload your ServiceNow contract and we'll connect it to your platform telemetry — turning raw usage data into financial intelligence.</p>
      <p style={{fontSize:13,color:SN.textTertiary,maxWidth:420,margin:"0 0 32px"}}>AI reads your order form, maps entitlements to native ServiceNow data sources, and surfaces the gaps that no existing tool covers.</p>
      <Btn icon={Upload} onClick={onStart} style={{padding:"10px 28px",fontSize:15}}>Upload Your First Contract</Btn>
      <div style={{display:"flex",gap:32,marginTop:48}}>
        {[{icon:Sparkles,title:"AI Extraction",desc:"Contract → entitlements in seconds"},{icon:DollarSign,title:"Financial Layer",desc:"€ at risk per entitlement"},{icon:Bell,title:"Gap Alerts",desc:"What native tools miss"},{icon:Target,title:"Renewal Intel",desc:"Data-driven negotiation"}].map((f,i)=>(
          <div key={i} style={{textAlign:"center",maxWidth:140}}>
            <div style={{width:40,height:40,borderRadius:8,background:SN.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 8px"}}><f.icon size={18} color={SN.accent}/></div>
            <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{f.title}</div>
            <div style={{fontSize:11,color:SN.textTertiary}}>{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATE 2: UPLOAD
   ═══════════════════════════════════════════════════════ */
function UploadState({fileName,setFileName,dragging,setDragging,onSubmit}) {
  const fileSelected=fileName.length>0;
  return (
    <div style={{maxWidth:560,margin:"0 auto",paddingTop:40}}>
      <h2 style={{fontFamily:hFont,fontSize:20,fontWeight:700,margin:"0 0 4px"}}>Upload Contract Document</h2>
      <p style={{fontSize:13,color:SN.textTertiary,margin:"0 0 24px"}}>Drop your ServiceNow order form, renewal agreement, or contract PDF.</p>
      <Card>
        <div onDragEnter={()=>setDragging(true)} onDragLeave={()=>setDragging(false)} onDragOver={e=>e.preventDefault()}
          onDrop={e=>{e.preventDefault();setDragging(false);setFileName("SNW-2024-ENT-4821_Enterprise_Suite.pdf");}}
          onClick={()=>{if(!fileSelected)setFileName("SNW-2024-ENT-4821_Enterprise_Suite.pdf");}}
          style={{border:`2px dashed ${dragging?SN.accent:fileSelected?SN.positive:SN.inputBorder}`,borderRadius:8,padding:fileSelected?24:48,textAlign:"center",cursor:fileSelected?"default":"pointer",background:dragging?SN.accentLight:fileSelected?SN.positiveBg+"44":"transparent",transition:"all .2s"}}>
          {!fileSelected ? <>
            <Upload size={32} color={SN.textTertiary} style={{margin:"0 auto 12px",display:"block"}}/>
            <div style={{fontSize:14,fontWeight:500,marginBottom:4}}>Drop contract file here or click to browse</div>
            <div style={{fontSize:12,color:SN.textTertiary}}>PDF, DOCX • Max 50MB</div>
          </> : <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:40,height:40,borderRadius:4,background:SN.positiveBg,display:"flex",alignItems:"center",justifyContent:"center"}}><FileText size={20} color={SN.positive}/></div>
            <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:14,fontWeight:600}}>{fileName}</div><div style={{fontSize:12,color:SN.textTertiary}}>2.4 MB • PDF document</div></div>
            <CheckCircle size={20} color={SN.positive}/>
            <X size={16} color={SN.textTertiary} style={{cursor:"pointer"}} onClick={e=>{e.stopPropagation();setFileName("");}}/>
          </div>}
        </div>
        <div style={{marginTop:16,padding:12,background:SN.accentLight,borderRadius:4,fontSize:12,color:SN.textSecondary,display:"flex",alignItems:"flex-start",gap:10}}>
          <Sparkles size={16} color={SN.accent} style={{flexShrink:0,marginTop:1}}/>
          <div><div style={{fontWeight:600,marginBottom:2}}>AI-Powered Extraction</div><div style={{color:SN.textTertiary}}>Contract metadata, entitlements, dates, pricing, and reset cycles will be automatically detected.</div></div>
        </div>
      </Card>
      <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}><Btn icon={Sparkles} onClick={onSubmit} disabled={!fileSelected} style={{padding:"8px 24px"}}>Analyze Contract</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATE 3: PROCESSING
   ═══════════════════════════════════════════════════════ */
function ProcessingState({step,done,fileName,onContinue}) {
  const pct=done?100:Math.round((step/EXTRACTION_STEPS.length)*100);
  return (
    <div style={{maxWidth:600,margin:"0 auto",paddingTop:60}}>
      <div style={{textAlign:"center",marginBottom:32}}>
        {!done ? <div style={{width:64,height:64,borderRadius:99,background:SN.accentLight,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><Spinner><Sparkles size={28} color={SN.accent}/></Spinner></div>
          : <div style={{width:64,height:64,borderRadius:99,background:SN.positiveBg,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}><CheckCircle size={32} color={SN.positive}/></div>}
        <h2 style={{fontFamily:hFont,fontSize:20,fontWeight:700,margin:"0 0 4px"}}>{done?"Analysis Complete":"Analyzing Contract..."}</h2>
        <p style={{fontSize:13,color:SN.textTertiary,margin:0}}>{fileName}</p>
      </div>
      <div style={{background:"#e8e8e8",borderRadius:4,height:6,marginBottom:24}}><div style={{background:done?SN.positive:SN.accent,height:"100%",width:`${pct}%`,borderRadius:4,transition:"width .5s"}}/></div>
      <Card>
        {EXTRACTION_STEPS.map((s,i)=>{const isDone=i<step;const isCurrent=i===step&&!done;const allDone=done;
          return <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<EXTRACTION_STEPS.length-1?`1px solid ${SN.dividerLight}`:"none"}}>
            {(isDone||allDone)?<CheckCircle size={16} color={SN.positive}/>:isCurrent?<Spinner><Loader size={16} color={SN.accent}/></Spinner>:<div style={{width:16,height:16,borderRadius:99,border:`2px solid ${SN.divider}`}}/>}
            <span style={{fontSize:13,color:(isDone||allDone)?SN.textPrimary:isCurrent?SN.accent:SN.textTertiary,fontWeight:isCurrent?600:400}}>{s.label}</span>
            {isDone&&<span style={{marginLeft:"auto",fontSize:11,color:SN.textTertiary}}>Done</span>}
            {isCurrent&&<span style={{marginLeft:"auto",fontSize:11,color:SN.accent,fontWeight:500}}>In progress...</span>}
          </div>;
        })}
      </Card>
      {done && <div style={{marginTop:20}}>
        <Card style={{background:SN.positiveBg+"66",border:`1px solid ${SN.positive}33`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}><Sparkles size={18} color={SN.positive}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600}}>Extraction Summary</div><div style={{fontSize:12,color:SN.textSecondary,marginTop:2}}>Found <span style={{fontWeight:700}}>8 entitlement line items</span> across <span style={{fontWeight:700}}>5 categories</span>. Contract terms 2024-03-15 to 2027-03-14.</div></div></div>
        </Card>
        <div style={{display:"flex",justifyContent:"flex-end",marginTop:16}}><Btn icon={Eye} onClick={onContinue} style={{padding:"8px 24px"}}>Review Extracted Data</Btn></div>
      </div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STATE 4: REVIEW
   ═══════════════════════════════════════════════════════ */
function ReviewState({onActivate}) {
  const [expandEnt,setExpandEnt]=useState(true);
  return (
    <div style={{maxWidth:800,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20,paddingTop:20}}>
        <div><h2 style={{fontFamily:hFont,fontSize:20,fontWeight:700,margin:"0 0 4px"}}>Review Extracted Data</h2><p style={{fontSize:13,color:SN.textTertiary,margin:0}}>Verify the information below. Click any field to edit.</p></div>
        <Badge variant="positive">AI Confidence: 95%</Badge>
      </div>
      <Card accent={SN.accentBorder} style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><FileText size={16} color={SN.accent}/><h3 style={{fontSize:14,fontWeight:600,margin:0}}>Contract Metadata</h3><Badge>Auto-extracted</Badge></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
          {EXTRACTED_FIELDS.map((f,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",borderBottom:`1px solid ${SN.dividerLight}`,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.background=SN.hoverBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div><div style={{fontSize:11,color:SN.textTertiary,marginBottom:1}}>{f.label}</div><div style={{fontSize:13,fontWeight:500}}>{f.value}</div></div>
              <div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:28,height:4,borderRadius:2,background:"#e8e8e8"}}><div style={{width:`${f.confidence}%`,height:"100%",background:f.confidence>90?SN.positive:SN.moderate,borderRadius:2}}/></div><span style={{fontSize:10,color:SN.textTertiary}}>{f.confidence}%</span><Edit size={12} color={SN.textTertiary}/></div>
            </div>
          ))}
        </div>
      </Card>
      <Card accent={SN.accentBorder} style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14,cursor:"pointer"}} onClick={()=>setExpandEnt(!expandEnt)}>
          <Layers size={16} color={SN.accent}/><h3 style={{fontSize:14,fontWeight:600,margin:0,flex:1}}>Entitlements ({EXTRACTED_ENTITLEMENTS.length})</h3><Badge>Auto-extracted</Badge>
          {expandEnt?<ChevronDown size={16} color={SN.textTertiary}/>:<ChevronRight size={16} color={SN.textTertiary}/>}
        </div>
        {expandEnt && <>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px 70px 30px",gap:8,padding:"6px 8px",fontSize:11,fontWeight:600,color:SN.textTertiary,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${SN.divider}`}}>
            <span>Name</span><span>Category</span><span>Quantity</span><span>Reset</span><span>Conf.</span><span></span>
          </div>
          {EXTRACTED_ENTITLEMENTS.map((e,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 80px 70px 30px",gap:8,padding:"10px 8px",borderBottom:`1px solid ${SN.dividerLight}`,alignItems:"center",fontSize:13,cursor:"pointer"}} onMouseEnter={ev=>ev.currentTarget.style.background=SN.hoverBg} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
              <span style={{fontWeight:500}}>{e.name}</span><Badge variant="neutral">{e.category}</Badge><span>{e.qty}</span><span style={{fontSize:12,color:SN.textSecondary}}>{e.reset}</span>
              <div style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:24,height:4,borderRadius:2,background:"#e8e8e8"}}><div style={{width:`${e.confidence}%`,height:"100%",background:e.confidence>90?SN.positive:SN.moderate,borderRadius:2}}/></div><span style={{fontSize:10,color:SN.textTertiary}}>{e.confidence}%</span></div>
              <Edit size={12} color={SN.textTertiary}/>
            </div>
          ))}
          <div style={{padding:"8px 8px 0",display:"flex",justifyContent:"flex-end"}}><Btn variant="link" icon={Plus} small>Add missing entitlement</Btn></div>
        </>}
      </Card>
      <Card style={{marginBottom:16,background:SN.hoverBg}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><Bell size={16} color={SN.accent}/><h3 style={{fontSize:14,fontWeight:600,margin:0}}>Alert Rules (Auto-Configured)</h3></div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {["Expiry Warning (90/60/30/7d)","Budget Pacing (monthly)","Period Reset (30/7d)","Renewal Prep (180/90/60d)","Manual Update Reminder"].map((r,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",background:"#fff",border:`1px solid ${SN.dividerLight}`,borderRadius:4,fontSize:12}}><div style={{width:6,height:6,borderRadius:99,background:SN.positive}}/>{r}</div>
          ))}
        </div>
      </Card>
      <div style={{display:"flex",justifyContent:"flex-end"}}><Btn icon={Check} onClick={onActivate} style={{padding:"8px 28px",fontSize:14}}>Activate Contract Intelligence</Btn></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   DASHBOARD (Home)
   ═══════════════════════════════════════════════════════ */
function DashboardView({nav,alerts}) {
  const sidebar = <>
    {/* My Work panel */}
    <Card accent={SN.accentBorder}>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Summary</div>
      {[["Active Contracts","2",()=>nav("contracts")],["Entitlements","9",()=>nav("entitlements")],["Critical Alerts",critAlerts(alerts)+"",()=>nav("alerts")]].map(([l,v,fn],i)=>(
        <div key={i} onClick={fn} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${SN.dividerLight}`,cursor:"pointer",fontSize:13}}>
          <span style={{color:SN.primary}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
        </div>
      ))}
    </Card>
    {/* Quick Links */}
    <Card>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Quick Links</div>
      {[["Renewal Cockpit",()=>nav("renewal")],["Usage Tracker",()=>nav("usage")],["Alert Center",()=>nav("alerts")],["Configuration",()=>nav("settings")]].map(([l,fn],i)=>(
        <div key={i} onClick={fn} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",fontSize:13,color:SN.primary,cursor:"pointer"}}><ExternalLink size={11}/>{l}</div>
      ))}
    </Card>
    {/* Value Score */}
    <Card accent={SN.moderate}>
      <div style={{fontSize:12,color:SN.textSecondary,marginBottom:4}}>Value Realization</div>
      <div style={{fontSize:36,fontWeight:700,fontFamily:hFont,color:SN.moderate,lineHeight:1}}>62%</div>
      <div style={{fontSize:12,color:SN.textTertiary,marginTop:4}}>€249K at risk</div>
      <div style={{marginTop:8,height:4,background:"#e8e8e8",borderRadius:2}}><div style={{height:"100%",width:"62%",background:SN.moderate,borderRadius:2}}/></div>
    </Card>
  </>;

  return (
    <WorkspaceLayout sidebar={sidebar}>
      {/* Important Actions */}
      {alerts.filter(a=>a.severity==="critical").length>0 && <Card accent={SN.accentBorder} style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:14,fontWeight:600}}>Important actions</span>
          <Badge variant="count">{alerts.filter(a=>a.severity==="critical").length}</Badge>
        </div>
        <div style={{display:"flex",gap:12}}>
          {alerts.filter(a=>a.severity==="critical").map(a=>(
            <div key={a.id} style={{flex:1,padding:12,border:`1px solid ${SN.dividerLight}`,borderRadius:SN.cardRadius,borderLeft:`3px solid ${SN.critical}`}}>
              <Badge variant="critical" style={{fontSize:10}}>Critical</Badge>
              <div style={{fontSize:13,fontWeight:600,marginTop:6}}>{a.title}</div>
              <div style={{fontSize:11,color:SN.textTertiary,marginTop:2}}>{a.subtitle}</div>
              <div style={{marginTop:8}}><Btn variant="outline" small onClick={()=>{if(a.entitlement) nav("entitlements",{entitlement:a.entitlement});}}>{a.action}</Btn></div>
            </div>
          ))}
        </div>
      </Card>}

      {/* What's New - Financial Intelligence KPI row */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <span style={{fontSize:14,fontWeight:600}}>Contract Intelligence</span>
          <Btn variant="link" small onClick={()=>nav("renewal")}>Renewal Cockpit</Btn>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[{l:"Value Realization",v:"62%",d:"of purchased value consumed",c:SN.moderate,sp:62},{l:"€ at Risk",v:"€249K",d:"optimization potential",c:SN.critical,sp:0},{l:"Days to Renewal",v:"383",d:"renewal window opens soon",c:SN.info,sp:0},{l:"Entitlements at Risk",v:"3 of 9",d:"critical or severely under-used",c:SN.critical,sp:33}].map((k,i)=>(
            <Card key={i} accent={SN.accentBorder} style={{padding:14}}>
              <div style={{fontSize:12,color:SN.textSecondary,marginBottom:6}}>{k.l}</div>
              <div style={{fontSize:28,fontWeight:700,fontFamily:hFont,lineHeight:1,color:k.c}}>{k.v}</div>
              <div style={{fontSize:11,color:SN.textTertiary,marginTop:4}}>{k.d}</div>
              {k.sp>0&&<div style={{marginTop:8,height:4,background:"#e8e8e8",borderRadius:2}}><div style={{height:"100%",width:`${k.sp}%`,background:k.c,borderRadius:2}}/></div>}
            </Card>
          ))}
        </div>
      </div>

      {/* Connected Data Sources strip */}
      <Card style={{marginBottom:16,padding:"10px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
          <span style={{fontSize:12,fontWeight:600,color:SN.textSecondary}}>Data Sources:</span>
          {[["Subscription Mgmt v2","connected"],["Now Assist Admin","connected"],["Platform Stats","connected"],["Now Learning","manual"],["Expert Services","manual"]].map(([n,s],i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:s==="connected"?SN.positive:SN.moderate}}>
              <div style={{width:6,height:6,borderRadius:99,background:s==="connected"?SN.positive:SN.moderate}}/><span style={{fontWeight:500}}>{n}</span>
              <span style={{color:SN.textTertiary,fontWeight:400}}>{s==="connected"?"Auto":"Manual"}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Alerts */}
      <Card accent={SN.accentBorder} style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:14,fontWeight:600}}>Recent alerts</span>
          <Btn variant="link" small onClick={()=>nav("alerts")}>View all</Btn>
        </div>
        {alerts.slice(0,4).map(a=>(
          <div key={a.id} style={{display:"flex",gap:10,padding:"8px 0",borderTop:`1px solid ${SN.dividerLight}`}}>
            <SevIcon severity={a.severity}/>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:500}}>{a.title}</div><div style={{fontSize:11,color:SN.textTertiary,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.subtitle}</div></div>
            <span style={{fontSize:11,color:SN.textTertiary,whiteSpace:"nowrap"}}>{a.date}</span>
          </div>
        ))}
      </Card>

      {/* Value at Risk by Entitlement */}
      <Card accent={SN.accentBorder}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <span style={{fontSize:14,fontWeight:600}}>Value at Risk by Entitlement</span>
          <Btn variant="link" small onClick={()=>nav("renewal")}>Full analysis</Btn>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={[{name:"Now Assist",risk:96200,color:SN.critical},{name:"Approver\nLicenses",risk:67500,color:SN.moderate},{name:"Learning\nCredits",risk:54400,color:SN.critical},{name:"Expert\nServices",risk:31000,color:SN.moderate}]} layout="vertical" margin={{left:90}}>
            <CartesianGrid strokeDasharray="3 3" stroke={SN.dividerLight} horizontal={false}/>
            <XAxis type="number" tick={{fill:SN.textTertiary,fontSize:11}} axisLine={{stroke:SN.divider}} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
            <YAxis type="category" dataKey="name" tick={{fill:SN.textPrimary,fontSize:11}} axisLine={{stroke:SN.divider}} width={80}/>
            <Tooltip contentStyle={{background:"#fff",border:`1px solid ${SN.cardBorder}`,borderRadius:4,fontSize:12}} formatter={v=>fC(v)}/>
            <Bar dataKey="risk" fill={SN.critical} radius={[0,3,3,0]} barSize={18}/>
          </BarChart>
        </ResponsiveContainer>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11,color:SN.textTertiary}}><span>Data from Subscription Mgmt v2 + Manual entries</span><span style={{fontWeight:600,color:SN.critical}}>Total: €249,100</span></div>
      </Card>
    </WorkspaceLayout>
  );
}
function critAlerts(alerts){return alerts.filter(a=>a.severity==="critical").length;}

/* ═══════════════════════════════════════════════════════
   CONTRACTS
   ═══════════════════════════════════════════════════════ */
function ContractsView({nav,sel,setSel}) {
  if(sel) {
    const c=CONTRACTS.find(x=>x.id===sel);const ents=ENTITLEMENTS.filter(e=>e.contract===sel);
    return (<div>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}><div><h2 style={{fontSize:18,fontWeight:700,margin:"0 0 6px"}}>{c.name}</h2><div style={{display:"flex",gap:6}}><Badge variant="positive">Active</Badge><Badge>{c.type}</Badge><span style={{fontSize:12,color:SN.textTertiary}}>{c.number}</span></div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[["Start",c.startDate,`Anniversary: ${c.anniversary}`],["Remaining",`${c.daysRemaining} days`,`End: ${c.endDate}`],["ACV",fC(c.acv),`TCV: ${fC(c.tcv)}`],["Value Score",`${c.healthScore}%`,"Utilization"]].map(([l,v,s],i)=>(
          <Card key={i} accent={SN.accentBorder} style={{padding:14}}><div style={{fontSize:12,color:SN.textSecondary,marginBottom:6}}>{l}</div><div style={{fontSize:22,fontWeight:700,fontFamily:hFont}}>{v}</div><div style={{fontSize:11,color:SN.textTertiary,marginTop:2}}>{s}</div></Card>
        ))}
      </div>
      <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Entitlements ({ents.length})</h3>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 120px 80px 100px 20px",gap:8,padding:"6px 8px",fontSize:11,fontWeight:600,color:SN.textTertiary,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${SN.divider}`}}><span>Name</span><span>Category</span><span>Utilization</span><span>Status</span><span>Used / Limit</span><span></span></div>
        {ents.map(e=>{const pct=Math.round((e.used/e.purchased)*100);return <div key={e.id} style={{display:"grid",gridTemplateColumns:"2fr 1fr 120px 80px 100px 20px",gap:8,padding:"10px 8px",borderBottom:`1px solid ${SN.dividerLight}`,alignItems:"center",cursor:"pointer",fontSize:13}} onClick={()=>nav("entitlements",{entitlement:e.id})} onMouseEnter={ev=>ev.currentTarget.style.background=SN.hoverBg} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}><span style={{fontWeight:500}}>{e.name}</span><span style={{color:SN.textSecondary}}>{e.category}</span><Progress value={e.used} max={e.purchased} height={6}/><span style={{fontWeight:600,color:sColor(e.status),fontSize:12}}>{pct}%</span><span style={{color:SN.textTertiary,fontSize:12}}>{fN(e.used)} / {fN(e.purchased)}</span><ChevronRight size={14} color={SN.textTertiary}/></div>;})}
      </Card>
    </div>);
  }
  const contractSidebar = <>
    <Card>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Actions</div>
      {[["Upload Contract",Upload,()=>{}],["Add Contract Manually",Plus,()=>{}]].map(([l,Ic,fn],i)=>(
        <div key={i} onClick={fn} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",fontSize:13,color:SN.primary,cursor:"pointer"}}><Ic size={11}/>{l}</div>
      ))}
    </Card>
    <Card>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Quick Links</div>
      {[["Renewal Cockpit",()=>nav("renewal")],["Usage Tracker",()=>nav("usage")],["Alert Center",()=>nav("alerts")]].map(([l,fn],i)=>(
        <div key={i} onClick={fn} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",fontSize:13,color:SN.primary,cursor:"pointer"}}><ExternalLink size={11}/>{l}</div>
      ))}
    </Card>
  </>;
  return (<WorkspaceLayout sidebar={contractSidebar}><div>
    {CONTRACTS.map(c=>{const ents=ENTITLEMENTS.filter(e=>e.contract===c.id);const sc=c.healthScore>75?SN.positive:c.healthScore>50?SN.moderate:SN.critical;return <Card key={c.id} accent={SN.accentBorder} onClick={()=>setSel(c.id)} style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between"}}><div><h3 style={{fontSize:15,fontWeight:600,margin:"0 0 6px"}}>{c.name}</h3><div style={{display:"flex",gap:6}}><Badge variant="positive">Active</Badge><Badge>{c.type}</Badge><span style={{fontSize:12,color:SN.textTertiary}}>{c.number}</span></div></div><div style={{textAlign:"right"}}><div style={{fontSize:11,color:SN.textTertiary}}>Value Score</div><div style={{fontSize:26,fontWeight:700,fontFamily:hFont,color:sc}}>{c.healthScore}%</div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginTop:14,paddingTop:14,borderTop:`1px solid ${SN.dividerLight}`}}>{[["Period",`${c.startDate} → ${c.endDate}`],["ACV",fC(c.acv)],["Entitlements",`${ents.length} line items`],["Remaining",`${c.daysRemaining} days`]].map(([l,v],i)=><div key={i}><div style={{fontSize:11,color:SN.textTertiary,marginBottom:2}}>{l}</div><div style={{fontSize:13,fontWeight:500}}>{v}</div></div>)}</div>
    </Card>;})}
  </div></WorkspaceLayout>);
}

/* ═══════════════════════════════════════════════════════
   ENTITLEMENTS
   ═══════════════════════════════════════════════════════ */
function EntitlementsView({nav,sel,setSel}) {
  const [cat,setCat]=useState("All");const cats=["All","User License","Capacity","Consumption","Training","Service"];
  if(sel) {
    const e=ENTITLEMENTS.find(x=>x.id===sel);const pct=Math.round((e.used/e.purchased)*100);const sc=sColor(e.status);const Icon=e.icon;
    const data=USAGE_TREND.map(d=>({month:d.month,value:e.id==="E004"?d.ihub:e.id==="E005"?d.assists:e.id==="E006"?d.credits:d.fulfiller}));
    const sidebar = <Card><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Details</h3>
      {[["Contract",CONTRACTS.find(c=>c.id===e.contract)?.name],["Category",e.category],["Unit",e.unit],["Reset",e.resetCycle],["Overage","Notify Only"],["Rollover","Not allowed"],["Data Source",e.category==="Training"?"Now Learning (Manual)":e.category==="Service"?"Account Team (Manual)":e.id==="E005"?"Now Assist Admin (Auto)":"Subscription Mgmt v2 (Auto)"],["Last Updated","Feb 23, 2026"]].map(([k,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${SN.dividerLight}`,fontSize:12}}><span style={{color:SN.textTertiary}}>{k}</span><span style={{fontWeight:500,textAlign:"right",maxWidth:"55%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:k==="Data Source"&&v.includes("Auto")?SN.positive:k==="Data Source"?SN.moderate:undefined}}>{v}</span></div>)}
    </Card>;
    return (<WorkspaceLayout sidebar={sidebar}>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}><div style={{width:36,height:36,borderRadius:4,background:sc+"14",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={18} color={sc}/></div><div><h2 style={{fontSize:18,fontWeight:700,margin:0}}>{e.name}</h2><div style={{display:"flex",gap:6,marginTop:4}}><Badge>{e.category}</Badge><Badge variant="neutral">{e.resetCycle} Reset</Badge></div></div></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[["Purchased",fN(e.purchased),e.unit],[" Current",fN(e.used),`${pct}% utilized`],["€ at Risk",e.id==="E005"?"€96.2K":e.id==="E006"?"€5.4K":e.id==="E007"?"€31K":e.id==="E002"?"€67.5K":"Healthy",pct<50?"Underutilized":"On track"],["Reset / Expiry",e.expiry,e.resetCycle!=="None"?`Resets: ${e.resetCycle}`:"No reset"]].map(([l,v,s],i)=>(
          <Card key={i} accent={SN.accentBorder} style={{padding:14}}><div style={{fontSize:12,color:SN.textSecondary,marginBottom:6}}>{l.trim()}</div><div style={{fontSize:22,fontWeight:700,fontFamily:hFont,color:l.includes("Risk")&&v!=="Healthy"?SN.critical:undefined}}>{v}</div><div style={{fontSize:11,color:SN.textTertiary,marginTop:2}}>{s}</div></Card>
        ))}
      </div>
      <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Usage History</h3>
        <ResponsiveContainer width="100%" height={200}><AreaChart data={data}><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={sc} stopOpacity={.15}/><stop offset="95%" stopColor={sc} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={SN.dividerLight}/><XAxis dataKey="month" tick={{fill:SN.textTertiary,fontSize:11}} axisLine={{stroke:SN.divider}}/><YAxis tick={{fill:SN.textTertiary,fontSize:11}} axisLine={{stroke:SN.divider}} tickFormatter={fN}/><Tooltip contentStyle={{background:"#fff",border:`1px solid ${SN.cardBorder}`,borderRadius:4,fontSize:12}}/><Area type="monotone" dataKey="value" stroke={sc} fill="url(#dg)" strokeWidth={2}/></AreaChart></ResponsiveContainer>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:SN.textTertiary,marginTop:4}}><span>Source: {e.category==="Training"?"Now Learning (Manual)":e.category==="Service"?"Account Team (Manual)":e.id==="E005"?"Now Assist Admin Console":"Subscription Mgmt v2 / Platform Stats"}</span><span>Entitlement: {fN(e.purchased)} {e.unit}</span></div>
      </Card>
    </WorkspaceLayout>);
  }
  const filtered=cat==="All"?ENTITLEMENTS:ENTITLEMENTS.filter(e=>e.category===cat);
  const counts={h:ENTITLEMENTS.filter(e=>e.status==="healthy").length,w:ENTITLEMENTS.filter(e=>e.status==="warning").length,c:ENTITLEMENTS.filter(e=>e.status==="critical").length};
  return (<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:16}}>
      {[["Healthy",counts.h,SN.positive,CheckCircle],["Warning",counts.w,SN.moderate,AlertTriangle],["Critical",counts.c,SN.critical,AlertTriangle]].map(([l,c,col,I],i)=>(
        <Card key={i} accent={col} style={{padding:14,display:"flex",alignItems:"center",gap:12}}><I size={18} color={col}/><div><div style={{fontSize:28,fontWeight:700,fontFamily:hFont,color:col,lineHeight:1}}>{c}</div><div style={{fontSize:12,color:SN.textSecondary,marginTop:2}}>{l}</div></div></Card>
      ))}
    </div>
    <div style={{display:"flex",gap:0,borderBottom:`2px solid ${SN.divider}`,marginBottom:16}}>{cats.map(c=><div key={c} onClick={()=>setCat(c)} style={{padding:"8px 16px",fontSize:13,cursor:"pointer",fontWeight:cat===c?600:400,color:cat===c?SN.accent:SN.textSecondary,borderBottom:cat===c?`3px solid ${SN.tabUnderline}`:"3px solid transparent",marginBottom:-2}}>{c}</div>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      {filtered.map(e=>{const pct=Math.round((e.used/e.purchased)*100);const sc=sColor(e.status);const Icon=e.icon;return <Card key={e.id} accent={SN.accentBorder} onClick={()=>setSel(e.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{width:32,height:32,borderRadius:4,background:sc+"14",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon size={16} color={sc}/></div><div><div style={{fontSize:13,fontWeight:600}}>{e.name}</div><div style={{fontSize:11,color:SN.textTertiary}}>{e.category}</div></div></div><span style={{fontSize:20,fontWeight:700,fontFamily:hFont,color:sc}}>{pct}%</span></div>
        <Progress value={e.used} max={e.purchased} height={6}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:8,fontSize:11}}><span style={{color:SN.textTertiary}}>{fN(e.used)} / {fN(e.purchased)} {e.unit}</span>{e.resetCycle!=="None"&&<span style={{color:SN.textTertiary,display:"flex",alignItems:"center",gap:3}}><RefreshCw size={10}/>{e.resetCycle}</span>}</div>
      </Card>;})}
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════
   VIRTUAL AGENT — NOW ASSIST CHAT
   ═══════════════════════════════════════════════════════ */
const VA_CONVERSATIONS = [
  {
    id: "budget",
    label: "Budget Status",
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
    id: "agents",
    label: "Agent Costs",
    prompt: "Which AI agents are costing us the most? Any optimization opportunities?",
    messages: [
      { role: "user", text: "Which AI agents are costing us the most? Any optimization opportunities?" },
      { role: "assistant", text: null, widget: "agent_table" },
      { role: "assistant", text: "Your **4 active agents** consumed **4,350 assists** this period (9% of total). Here's the cost breakdown:\n\n**Onboarding Orchestrator** is your most expensive agent — 12 runs consumed 1,800 assists at **€1,665 total** (150 assists/run, Large tier). It uses 14 tool invocations per run.\n\n**Change Risk Assessment** and **Knowledge Article Agent** are both Medium tier (50 assists/run), costing €1,295 and €1,018 respectively.\n\n**Incident Triage Agent** is the most efficient — 42 runs at only 25 assists each (Small tier), totaling €971.\n\n**Key optimization opportunity:** The Onboarding Orchestrator could potentially be split into two smaller agents. If you reduce the actions from 14 to two workflows of 7 each, each run drops from 150 to 50 assists — a **67% cost reduction per execution**. Over 12 runs, that saves 1,200 assists (€1,110)." },
      { role: "user", text: "Good idea. What's the design guideline for keeping agents cost-efficient?" },
      { role: "assistant", text: "The ServiceNow assist pricing model has three tiers based on **tool invocations per run**:\n\n| Tier | Actions | Assists/Run | Your Cost |\n|------|---------|-------------|----------|\n| Small | 1–4 | 25 | €23.13 |\n| Medium | 5–8 | 50 | €46.25 |\n| Large | 9–20 | 150 | €138.75 |\n\nThe jump from Medium to Large is **3x** — that's where the biggest cost risk lives.\n\n**Design guidelines I'd recommend:**\n• Target ≤4 actions per agent (Small tier) wherever possible\n• If >4 actions are needed, keep it under 9 to stay Medium\n• Never let an agent exceed 8 actions without architectural review\n• Consider splitting complex workflows into chained smaller agents\n• Add action-count monitoring to your CI/CD pipeline for agent deployments\n\nWant me to flag any agent that crosses the Medium→Large threshold automatically?" },
    ]
  },
  {
    id: "subprod",
    label: "Sub-Prod Risk",
    prompt: "I heard sub-production counts toward our budget. How exposed are we?",
    messages: [
      { role: "user", text: "I heard sub-production usage counts toward our budget. How exposed are we?" },
      { role: "assistant", text: null, widget: "env_split" },
      { role: "assistant", text: "Yes — this is a significant governance finding. **35% of your total assist consumption (16,800 assists) is coming from sub-production environments** — dev, test, and UAT.\n\nAt €0.93 per assist, that's **€15,540 of your budget** spent on non-production usage. ServiceNow does not discount or exclude dev/test usage because the underlying LLM compute cost is the same regardless of environment.\n\nFor context: demo and evaluation instances ARE excluded, but your dev, test, and UAT instances are not.\n\n**Why this matters at your consumption level:**\nYou're already underutilizing at 24%. Burning 35% of that in sub-prod means your actual production value realization is even lower — roughly **16% production utilization** on a €185K investment." },
      { role: "user", text: "What can we do to control sub-prod usage?" },
      { role: "assistant", text: "Here are four governance controls I'd recommend implementing:\n\n**1. Gated test policies** — Disable Now Assist skills in dev/test by default. Only enable for specific, time-boxed testing windows. Use sys_properties to toggle `glide.now_assist.enabled` per instance.\n\n**2. Sample-size testing** — Instead of running full regression with AI skills active, test with a representative sample (e.g., 50 incidents instead of 5,000). This can reduce sub-prod consumption by 80–90%.\n\n**3. Test budget allocation** — Set an internal policy: max 10% of annual assist budget for sub-prod. That's 20,000 assists. You're currently at 16,800 — technically within 10% but trending upward.\n\n**4. Monthly sub-prod reporting** — ContractIQ already shows this split. Set up a monthly alert if sub-prod exceeds 15% of total consumption.\n\nShall I draft these as governance policies you can share with your development team leads?" },
    ]
  },
];

function VAChatPanel() {
  const PP = "#7c3aed";
  const [activeConv, setActiveConv] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [botThinking, setBotThinking] = useState(false);
  const [playState, setPlayState] = useState("idle"); // idle | playing | done
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);

  const conv = activeConv ? VA_CONVERSATIONS.find(c => c.id === activeConv) : null;

  // Cleanup all timers
  const clearTimers = () => {
    if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  // Play one message from the conversation
  const playMessage = (convData, idx) => {
    if (idx >= convData.messages.length) { setPlayState("done"); return; }
    const msg = convData.messages[idx];

    if (msg.role === "user") {
      // Type user message character by character into input
      const fullText = msg.text;
      let charPos = 0;
      setInputText("");
      intervalRef.current = setInterval(() => {
        charPos++;
        if (charPos > fullText.length) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          // Brief pause with full text visible, then "send"
          timeoutRef.current = setTimeout(() => {
            setSentMessages(prev => [...prev, msg]);
            setInputText("");
            // Small gap then play next
            timeoutRef.current = setTimeout(() => playMessage(convData, idx + 1), 400);
          }, 600);
        } else {
          setInputText(fullText.slice(0, charPos));
        }
      }, 38 + Math.floor(Math.random() * 25));

    } else if (msg.role === "assistant") {
      if (msg.widget) {
        // Widget messages appear quickly
        setBotThinking(true);
        timeoutRef.current = setTimeout(() => {
          setBotThinking(false);
          setSentMessages(prev => [...prev, msg]);
          timeoutRef.current = setTimeout(() => playMessage(convData, idx + 1), 300);
        }, 700);
      } else {
        // Text response — show thinking dots then reveal
        setBotThinking(true);
        timeoutRef.current = setTimeout(() => {
          setBotThinking(false);
          setSentMessages(prev => [...prev, msg]);
          // Longer pause after bot response before next user types
          const nextMsg = convData.messages[idx + 1];
          const pauseTime = nextMsg && nextMsg.role === "user" ? 1800 : 600;
          timeoutRef.current = setTimeout(() => playMessage(convData, idx + 1), pauseTime);
        }, 1600 + Math.floor(Math.random() * 600));
      }
    }
  };

  const startConversation = (convId) => {
    clearTimers();
    const convData = VA_CONVERSATIONS.find(c => c.id === convId);
    setActiveConv(convId);
    setSentMessages([]);
    setInputText("");
    setBotThinking(false);
    setPlayState("playing");
    setExpanded(true);
    // Start playback after brief initial pause
    timeoutRef.current = setTimeout(() => playMessage(convData, 0), 700);
  };

  const reset = () => {
    clearTimers();
    setActiveConv(null);
    setSentMessages([]);
    setInputText("");
    setBotThinking(false);
    setPlayState("idle");
  };

  // Cleanup on unmount
  useEffect(() => () => clearTimers(), []);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [sentMessages, inputText, botThinking]);

  const renderMarkdown = (text) => {
    const lines = text.split("\n");
    return lines.map((line, li) => {
      if (line.startsWith("|") && line.includes("|")) {
        const cells = line.split("|").filter(c => c.trim()).map(c => c.trim());
        if (cells.every(c => /^[-:]+$/.test(c))) return null;
        const isHeader = li > 0 && lines[li + 1] && lines[li + 1].includes("---");
        return (
          <div key={li} style={{ display: "grid", gridTemplateColumns: `repeat(${cells.length}, 1fr)`, gap: 0, fontSize: 11 }}>
            {cells.map((c, ci) => (
              <div key={ci} style={{ padding: "4px 8px", borderBottom: `1px solid ${SN.dividerLight}`, fontWeight: isHeader ? 600 : 400, background: isHeader ? SN.hoverBg : "transparent" }}>{c}</div>
            ))}
          </div>
        );
      }
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/•\s/g, '<span style="color:#7c3aed">  ●  </span>');
      return <div key={li} style={{ marginBottom: line === "" ? 8 : 2, minHeight: line === "" ? 4 : "auto" }} dangerouslySetInnerHTML={{ __html: formatted || "&nbsp;" }} />;
    }).filter(Boolean);
  };

  const MiniWidget = ({ type }) => {
    if (type === "budget_summary") return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6, padding: 8, background: SN.hoverBg, borderRadius: 4, marginBottom: 8 }}>
        {[{ l: "Burned", v: "48,200 / 200K", c: PP }, { l: "Projected EOY", v: "70,500 (35%)", c: SN.critical }, { l: "€ Unused", v: "€119,900", c: SN.critical }].map((k, i) => (
          <div key={i} style={{ textAlign: "center", padding: 6 }}>
            <div style={{ fontSize: 9, color: SN.textTertiary, textTransform: "uppercase", fontWeight: 600 }}>{k.l}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>
    );
    if (type === "agent_table") return (
      <div style={{ padding: 8, background: SN.hoverBg, borderRadius: 4, marginBottom: 8, fontSize: 11 }}>
        {[{ n: "Onboarding Orchestrator", c: "€1,665", s: "Large", cl: SN.critical }, { n: "Change Risk Assessment", c: "€1,295", s: "Med", cl: SN.moderate }, { n: "Knowledge Article Agent", c: "€1,018", s: "Med", cl: SN.moderate }, { n: "Incident Triage Agent", c: "€971", s: "Small", cl: SN.positive }].map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < 3 ? `1px solid ${SN.dividerLight}` : "none" }}>
            <span>{a.n}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 8, background: a.cl + "18", color: a.cl, fontWeight: 600 }}>{a.s}</span>
              <span style={{ fontWeight: 700, minWidth: 50, textAlign: "right" }}>{a.c}</span>
            </div>
          </div>
        ))}
      </div>
    );
    if (type === "env_split") return (
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 8, background: SN.hoverBg, borderRadius: 4, marginBottom: 8 }}>
        <div style={{ width: 48, height: 48, borderRadius: 99, background: `conic-gradient(${PP} 0% 65%, ${SN.moderate} 65% 100%)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 30, height: 30, borderRadius: 99, background: SN.hoverBg }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: PP, marginRight: 4, verticalAlign: "middle" }} />Prod: 31,400 (65%)</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 2, background: SN.moderate, marginRight: 4, verticalAlign: "middle" }} />Sub-prod: 16,800 (35%)</span>
          </div>
          <div style={{ fontSize: 10, color: SN.critical, fontWeight: 600, marginTop: 4 }}>Warning: 35% sub-prod = €15,540 non-production spend</div>
        </div>
      </div>
    );
    return null;
  };

  const isTypingUser = playState === "playing" && inputText.length > 0;

  return (
    <Card accent={PP} style={{ marginBottom: 16, padding: 0, overflow: "hidden" }}>
      {/* Header bar */}
      <div onClick={() => setExpanded(!expanded)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", cursor: "pointer", background: `linear-gradient(135deg, ${PP}08, ${PP}04)`, borderBottom: expanded ? `1px solid ${SN.dividerLight}` : "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: PP + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Bot size={15} color={PP} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Virtual Agent — Now Assist FinOps</div>
            <div style={{ fontSize: 11, color: SN.textTertiary }}>Ask questions about your Now Assist budget, agent costs, and governance</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Badge>AI-Powered</Badge>
          {expanded ? <ChevronDown size={16} color={SN.textTertiary} /> : <ChevronRight size={16} color={SN.textTertiary} />}
        </div>
      </div>

      {expanded && (
        <div style={{ padding: 16 }}>
          {/* Conversation starters */}
          {!activeConv && (
            <div>
              <div style={{ fontSize: 12, color: SN.textTertiary, marginBottom: 10 }}>Choose a conversation to watch:</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {VA_CONVERSATIONS.map(c => (
                  <div key={c.id} onClick={() => startConversation(c.id)} style={{ padding: 14, border: `1px solid ${SN.dividerLight}`, borderRadius: 6, cursor: "pointer", transition: "all .15s", borderLeft: `3px solid ${PP}` }}
                    onMouseEnter={e => { e.currentTarget.style.background = PP + "06"; e.currentTarget.style.borderColor = PP + "44"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = SN.dividerLight; }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                      <MessageCircle size={13} color={PP} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: PP }}>{c.label}</span>
                    </div>
                    <div style={{ fontSize: 12, color: SN.textSecondary, lineHeight: 1.4 }}>"{c.prompt}"</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active conversation */}
          {activeConv && conv && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <MessageCircle size={13} color={PP} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: PP }}>{conv.label}</span>
                  {playState === "playing" && <span style={{ fontSize: 10, color: PP, fontStyle: "italic", marginLeft: 8, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: 99, background: SN.critical, animation: "pulse 1.5s infinite" }} />Live</span>}
                </div>
                <Btn variant="link" small onClick={reset}>Back to topics</Btn>
              </div>

              {/* Chat messages */}
              <div ref={chatContainerRef} style={{ maxHeight: 420, overflowY: "auto", paddingRight: 4 }}>
                {sentMessages.map((msg, mi) => (
                  <div key={mi} style={{ display: "flex", gap: 8, marginBottom: 12, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: msg.role === "user" ? SN.accent + "14" : PP + "14" }}>
                      {msg.role === "user" ? <Users size={12} color={SN.accent} /> : <Bot size={12} color={PP} />}
                    </div>
                    <div style={{
                      maxWidth: msg.role === "user" ? "70%" : "85%",
                      padding: msg.widget ? "8px 10px" : "10px 14px",
                      borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      background: msg.role === "user" ? SN.accent : "#fff",
                      color: msg.role === "user" ? "#fff" : SN.textPrimary,
                      border: msg.role === "user" ? "none" : `1px solid ${SN.dividerLight}`,
                      fontSize: 12, lineHeight: 1.6,
                      boxShadow: msg.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                    }}>
                      {msg.widget ? <MiniWidget type={msg.widget} /> :
                        msg.role === "user" ? msg.text : renderMarkdown(msg.text)
                      }
                    </div>
                  </div>
                ))}

                {/* Bot thinking dots */}
                {botThinking && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: PP + "14" }}>
                      <Bot size={12} color={PP} />
                    </div>
                    <div style={{ padding: "10px 16px", borderRadius: "12px 12px 12px 2px", background: "#fff", border: `1px solid ${SN.dividerLight}`, display: "flex", gap: 4, alignItems: "center" }}>
                      {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 99, background: PP, opacity: 0.4, animation: `dotpulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input field — live typing simulation */}
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                background: "#fff",
                border: `1px solid ${isTypingUser ? PP : SN.inputBorder}`,
                borderRadius: 8, marginTop: 10,
                transition: "border-color .2s, box-shadow .2s",
                boxShadow: isTypingUser ? `0 0 0 2px ${PP}18` : "none"
              }}>
                <Search size={13} color={isTypingUser ? PP : SN.textTertiary} />
                <div style={{ flex: 1, fontSize: 12, minHeight: 18, display: "flex", alignItems: "center" }}>
                  {inputText ? (
                    <span style={{ color: SN.textPrimary }}>{inputText}<span style={{ display: "inline-block", width: 2, height: 14, background: PP, marginLeft: 1, verticalAlign: "text-bottom", animation: "caret 1s step-end infinite" }} /></span>
                  ) : (
                    <span style={{ color: SN.textPlaceholder }}>{playState === "done" ? "Ask a follow-up question..." : "Ask anything about your Now Assist entitlement..."}</span>
                  )}
                </div>
                <div style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: isTypingUser ? PP : SN.hoverBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all .3s"
                }}>
                  <Send size={12} color={isTypingUser ? "#fff" : SN.textTertiary} />
                </div>
              </div>

              {/* Source attribution */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: SN.textTertiary }}>
                <Database size={10} />
                <span>Data: sys_gen_ai_usage_log, sys_generative_ai_log, Subscription Mgmt v2, ContractIQ</span>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes dotpulse { 0%,100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.15); } }
        @keyframes caret { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </Card>
  );
}

/* ═══════════════════════════════════════════════════════
   NOW ASSIST FINOPS MODULE
   ═══════════════════════════════════════════════════════ */
function NowAssistFinOps() {
  const PP="#7c3aed";const totalAssists=48200;const budget=200000;const remaining=budget-totalAssists;const pctBurned=Math.round((totalAssists/budget)*100);
  const projectedEOY=70500;const pctProj=Math.round((projectedEOY/budget)*100);
  const costPerAssist=185000/200000;// €0.925 per assist
  const daysIntoYear=Math.round((new Date("2026-02-23")-new Date("2025-06-01"))/(1000*60*60*24));const daysTotal=365;const daysPct=Math.round((daysIntoYear/daysTotal)*100);

  return (<div>
    {/* ── Virtual Agent Chat ── */}
    <VAChatPanel/>

    {/* ── Row 1: Budget Burndown KPIs ── */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,marginBottom:16}}>
      {[
        {l:"Annual Budget",v:fN(budget)+" Assists",s:"Contract year: Jun 1 '25 → May 31 '26",c:PP},
        {l:"Burned YTD",v:fN(totalAssists)+` (${pctBurned}%)`,s:`${daysPct}% of contract year elapsed`,c:pctBurned>daysPct?SN.moderate:SN.positive},
        {l:"Remaining",v:fN(remaining),s:`${fC(Math.round(remaining*costPerAssist))} value remaining`,c:SN.positive},
        {l:"Projected EOY",v:fN(projectedEOY)+` (${pctProj}%)`,s:pctProj<50?`${fC(Math.round((budget-projectedEOY)*costPerAssist))} likely unused`:"On track",c:pctProj<50?SN.critical:SN.moderate},
        {l:"Cost / Assist",v:`€${costPerAssist.toFixed(2)}`,s:"Based on €185K ACV / 200K",c:SN.textSecondary},
      ].map((k,i)=>(
        <Card key={i} accent={SN.accentBorder} style={{padding:12}}>
          <div style={{fontSize:11,color:SN.textTertiary,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:.4}}>{k.l}</div>
          <div style={{fontSize:20,fontWeight:700,fontFamily:hFont,color:k.c,lineHeight:1.1}}>{k.v}</div>
          <div style={{fontSize:10,color:SN.textTertiary,marginTop:4}}>{k.s}</div>
        </Card>
      ))}
    </div>

    {/* ── Row 2: Burndown Chart + Anniversary Logic ── */}
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:16}}>
      <Card accent={PP}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{fontSize:14,fontWeight:600,margin:0}}>Budget Burndown: Contract Year 2 (Jun '25 → May '26)</h3>
          <Badge variant="neutral">Annual Reset Model</Badge>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={ASSIST_BURNDOWN.filter(d=>{const parts=d.month.split(" ");const mon=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].indexOf(parts[0]);const yr=parseInt("20"+parts[1]);return yr>2025||(yr===2025&&mon>=5);})}>
            <defs><linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={PP} stopOpacity={.2}/><stop offset="95%" stopColor={PP} stopOpacity={0}/></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke={SN.dividerLight}/>
            <XAxis dataKey="month" tick={{fill:SN.textTertiary,fontSize:10}} axisLine={{stroke:SN.divider}}/>
            <YAxis tick={{fill:SN.textTertiary,fontSize:10}} axisLine={{stroke:SN.divider}} tickFormatter={fN} domain={[0,200000]}/>
            <ReferenceLine y={200000} stroke={SN.critical} strokeDasharray="6 3" label={{value:"Budget: 200K",fill:SN.critical,fontSize:10,position:"insideTopRight"}}/>
            <ReferenceLine y={budget*0.85} stroke={SN.moderate} strokeDasharray="4 4" strokeOpacity={.5}/>
            <Tooltip contentStyle={{background:"#fff",border:`1px solid ${SN.cardBorder}`,borderRadius:4,fontSize:12}} formatter={(v)=>[fN(v)+" assists","Burned"]}/>
            <Area type="monotone" dataKey="burned" stroke={PP} fill="url(#bd)" strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
        <div style={{display:"flex",gap:16,marginTop:6,fontSize:10,color:SN.textTertiary}}>
          <span><span style={{display:"inline-block",width:12,height:2,background:PP,verticalAlign:"middle",marginRight:4}}/>Actual</span>
          <span><span style={{display:"inline-block",width:12,height:2,background:SN.critical,verticalAlign:"middle",marginRight:4,borderTop:"1px dashed "+SN.critical}}/>Budget limit (200K)</span>
          <span><span style={{display:"inline-block",width:12,height:2,background:SN.moderate,verticalAlign:"middle",marginRight:4,opacity:.5}}/>85% alert threshold</span>
          <span style={{marginLeft:"auto"}}>Source: sys_gen_ai_usage_log → daily</span>
        </div>
      </Card>

      {/* Anniversary & Reset Logic */}
      <Card accent={SN.moderate}>
        <h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px",display:"flex",alignItems:"center",gap:6}}><AlertTriangle size={14} color={SN.moderate}/>Reset & Anniversary</h3>
        <div style={{padding:"10px 12px",background:SN.moderateBg,borderRadius:4,marginBottom:12,fontSize:12,color:SN.moderate,lineHeight:1.5}}>
          <strong>Multi-entitlement detected.</strong> Two Now Assist entitlements with different start dates. Reset date follows the oldest entitlement per ServiceNow policy.
        </div>
        {[
          {l:"Governing Anniversary",v:"June 1",badge:"Oldest entitlement"},
          {l:"Contract Year Reset",v:"Jun 1, 2026",badge:null},
          {l:"Model",v:"Annual Burndown",badge:"Changed Jan 2026"},
          {l:"Meter Lag",v:"~24 hours",badge:"Sub Mgmt refresh"},
          {l:"Overage Policy",v:"No hard stop",badge:"True-up via AE"},
        ].map((r,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${SN.dividerLight}`,fontSize:12}}>
            <span style={{color:SN.textTertiary}}>{r.l}</span>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontWeight:600}}>{r.v}</span>
              {r.badge&&<Badge variant="warning">{r.badge}</Badge>}
            </div>
          </div>
        ))}
        <div style={{marginTop:12,padding:"8px 10px",background:SN.criticalBg,borderRadius:4,fontSize:11,color:SN.critical,lineHeight:1.5}}>
          <strong>Governance note:</strong> Sub-production usage counts toward budget. ServiceNow does not discount dev/test/UAT usage. BYOLLM also consumes assists (double-cost risk).
        </div>
      </Card>
    </div>

    {/* ── Row 3: Consumption by Skill + Prod/SubProd ── */}
    <div style={{display:"grid",gridTemplateColumns:"3fr 1fr",gap:12,marginBottom:16}}>
      <Card accent={SN.accentBorder}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{fontSize:14,fontWeight:600,margin:0}}>Consumption by Skill</h3>
          <span style={{fontSize:10,color:SN.textTertiary}}>Source: sys_gen_ai_usage_log</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr 60px 80px",gap:8,padding:"6px 0",fontSize:11,fontWeight:600,color:SN.textTertiary,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${SN.divider}`}}>
          <span>Skill</span><span>Assists Consumed</span><span>Share</span><span>Cost</span>
        </div>
        {ASSIST_SKILLS.map((s,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"200px 1fr 60px 80px",gap:8,padding:"8px 0",borderBottom:`1px solid ${SN.dividerLight}`,alignItems:"center",fontSize:12}}>
            <div><span style={{fontWeight:500}}>{s.skill}</span><br/><span style={{fontSize:10,color:SN.textTertiary}}>{s.category} • {fN(s.runs)} runs</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{flex:1,height:6,background:"#e8e8e8",borderRadius:3}}>
                <div style={{height:"100%",width:`${s.pct}%`,background:s.category==="Agentic"?SN.moderate:PP,borderRadius:3}}/>
              </div>
              <span style={{fontSize:11,fontWeight:500,minWidth:50}}>{fN(s.assists)}</span>
            </div>
            <span style={{color:SN.textTertiary}}>{s.pct}%</span>
            <span style={{fontWeight:600,color:s.assists>10000?SN.moderate:SN.textSecondary}}>{fC(Math.round(s.assists*costPerAssist))}</span>
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr 60px 80px",gap:8,padding:"10px 0",fontSize:12,fontWeight:700}}>
          <span>Total</span><span></span><span>100%</span><span style={{color:PP}}>{fC(Math.round(totalAssists*costPerAssist))}</span>
        </div>
      </Card>

      {/* Prod vs Sub-Prod */}
      <Card accent={SN.accentBorder}>
        <h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Environment Split</h3>
        <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
          <ResponsiveContainer width={140} height={140}>
            <PieChart><Pie data={ASSIST_ENVS} cx="50%" cy="50%" innerRadius={38} outerRadius={58} dataKey="value" startAngle={90} endAngle={-270}>
              <Cell fill={PP}/><Cell fill={SN.moderate}/>
            </Pie></PieChart>
          </ResponsiveContainer>
        </div>
        {ASSIST_ENVS.map((e,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",fontSize:12}}>
            <div style={{width:10,height:10,borderRadius:2,background:i===0?PP:SN.moderate}}/>
            <span style={{flex:1}}>{e.name}</span>
            <span style={{fontWeight:600}}>{fN(e.value)}</span>
            <span style={{color:SN.textTertiary,fontSize:11}}>{e.pct}%</span>
          </div>
        ))}
        <div style={{marginTop:10,padding:"8px",background:ASSIST_ENVS[1].pct>25?SN.criticalBg:SN.positiveBg,borderRadius:4,fontSize:11,color:ASSIST_ENVS[1].pct>25?SN.critical:SN.positive,lineHeight:1.4}}>
          <strong>{ASSIST_ENVS[1].pct}% sub-prod</strong> — {ASSIST_ENVS[1].pct>25?"High. Review test governance. Consider gated test policies.":"Within acceptable range."}
        </div>
        <div style={{fontSize:10,color:SN.textTertiary,marginTop:6}}>Sub-prod = dev + test + UAT instances. Demo/eval excluded.</div>
      </Card>
    </div>

    {/* ── Row 4: Agentic Workflow Cost Tracker ── */}
    <Card accent={SN.moderate} style={{marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h3 style={{fontSize:14,fontWeight:600,margin:0}}>Agentic Workflow Cost Tracker</h3>
        <div style={{display:"flex",gap:6}}>
          <Badge>Small ≤4 actions = 25 assists</Badge>
          <Badge variant="warning">Med 5–8 = 50</Badge>
          <Badge variant="critical">Large 9–20 = 150</Badge>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"220px 60px 80px 80px 80px 80px 80px 1fr",gap:8,padding:"6px 0",fontSize:10,fontWeight:600,color:SN.textTertiary,textTransform:"uppercase",letterSpacing:.4,borderBottom:`2px solid ${SN.divider}`}}>
        <span>Agent</span><span>Runs</span><span>Size</span><span>Actions/Run</span><span>Assists/Run</span><span>Total Assists</span><span>Cost</span><span>Trend</span>
      </div>
      {ASSIST_AGENTS.map((ag,i)=>{
        const sizeCol=ag.size==="Small"?SN.positive:ag.size==="Medium"?SN.moderate:SN.critical;
        return <div key={i} style={{display:"grid",gridTemplateColumns:"220px 60px 80px 80px 80px 80px 80px 1fr",gap:8,padding:"8px 0",borderBottom:`1px solid ${SN.dividerLight}`,alignItems:"center",fontSize:12}}>
          <span style={{fontWeight:500}}>{ag.name}</span>
          <span>{ag.runs}</span>
          <Badge variant={ag.size==="Small"?"positive":ag.size==="Medium"?"warning":"critical"}>{ag.size}</Badge>
          <span style={{color:SN.textSecondary}}>{ag.actionsPerRun}</span>
          <span style={{color:SN.textSecondary}}>{ag.assistsPerRun}</span>
          <span style={{fontWeight:600}}>{fN(ag.total)}</span>
          <span style={{fontWeight:600,color:ag.total>1000?SN.moderate:SN.textSecondary}}>{fC(Math.round(ag.total*costPerAssist))}</span>
          <span style={{fontSize:11,color:ag.trend==="new"?SN.info:SN.textTertiary}}>{ag.trend}</span>
        </div>;
      })}
      <div style={{display:"grid",gridTemplateColumns:"220px 60px 80px 80px 80px 80px 80px 1fr",gap:8,padding:"10px 0",fontSize:12,fontWeight:700}}>
        <span>All Agents Total</span><span>{ASSIST_AGENTS.reduce((s,a)=>s+a.runs,0)}</span><span></span><span></span><span></span>
        <span>{fN(ASSIST_AGENTS.reduce((s,a)=>s+a.total,0))}</span>
        <span style={{color:PP}}>{fC(Math.round(ASSIST_AGENTS.reduce((s,a)=>s+a.total,0)*costPerAssist))}</span>
        <span style={{fontSize:11,color:SN.textTertiary,fontWeight:400}}>{Math.round(ASSIST_AGENTS.reduce((s,a)=>s+a.total,0)/totalAssists*100)}% of total assists</span>
      </div>
      <div style={{marginTop:10,padding:"8px 12px",background:SN.accentLight,borderRadius:4,fontSize:12,color:SN.accent,lineHeight:1.5}}>
        <Sparkles size={11} style={{verticalAlign:"middle",marginRight:4}}/>
        <strong>Design guideline:</strong> Keep agent workflows ≤4 actions where possible to stay in the Small tier (25 assists/run). The Onboarding Orchestrator at 14 actions/run consumes 6× more per execution than the Incident Triage Agent.
      </div>
    </Card>

    {/* ── Row 5: Budget Alert Thresholds ── */}
    <Card accent={SN.accentBorder}>
      <h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Budget Alert Thresholds</h3>
      <div style={{marginBottom:12}}>
        <div style={{height:28,background:"#e8e8e8",borderRadius:4,position:"relative",overflow:"hidden"}}>
          <div style={{height:"100%",width:`${pctBurned}%`,background:`linear-gradient(90deg, ${SN.positive}, ${PP})`,borderRadius:4,transition:"width .6s"}}/>
          {[50,75,85,100].map(t=>(
            <div key={t} style={{position:"absolute",left:`${t}%`,top:0,bottom:0,width:2,background:t===100?SN.critical:SN.textTertiary,opacity:t===100?1:.5}}>
              <span style={{position:"absolute",top:-14,left:-8,fontSize:9,color:t===100?SN.critical:SN.textTertiary,fontWeight:600}}>{t}%</span>
            </div>
          ))}
          <div style={{position:"absolute",left:`${pctBurned}%`,top:-2,width:3,height:32,background:PP,borderRadius:2}}>
            <span style={{position:"absolute",bottom:-16,left:-12,fontSize:10,fontWeight:700,color:PP}}>Now</span>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {[
          {threshold:50,status:"passed",date:"Dec 14, 2025",action:"Internal review scheduled",sev:"info"},
          {threshold:75,status:"not reached",date:"—",action:"Throttle non-essential skills",sev:"warning"},
          {threshold:85,status:"not reached",date:"—",action:"Pause sub-prod testing; review agents",sev:"warning"},
          {threshold:100,status:"not reached",date:"—",action:"Compliance true-up with Account Executive",sev:"critical"},
        ].map((t,i)=>(
          <div key={i} style={{padding:"10px 12px",border:`1px solid ${SN.dividerLight}`,borderRadius:4,borderLeft:`3px solid ${t.status==="passed"?SN.positive:t.sev==="critical"?SN.critical:SN.moderate}`,background:t.status==="passed"?SN.positiveBg+"44":"transparent"}}>
            <div style={{fontSize:18,fontWeight:700,fontFamily:hFont,color:t.status==="passed"?SN.positive:SN.textTertiary}}>{t.threshold}%</div>
            <div style={{fontSize:11,fontWeight:600,color:t.status==="passed"?SN.positive:SN.textTertiary,marginBottom:4}}>{t.status==="passed"?`✓ Passed ${t.date}`:"Not yet reached"}</div>
            <div style={{fontSize:11,color:SN.textSecondary}}>{t.action}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:10,fontSize:11,color:SN.textTertiary}}>ServiceNow does not hard-stop at 100%. Overages result in a compliance true-up process with your Account Executive. ContractIQ provides the internal governance layer.</div>
    </Card>
  </div>);
}

/* ═══════════════════════════════════════════════════════
   USAGE TRACKER
   ═══════════════════════════════════════════════════════ */
function UsageView({showManual,setShowManual}) {
  const [metric,setMetric]=useState("ihub");
  const ms=[{id:"ihub",label:"Integration Hub",key:"ihub",color:SN.accent,limit:500000,source:"Platform (Auto)",acv:null,risk:0,insight:"On track. Approaching limit — negotiate +20% at renewal."},{id:"assists",label:"Now Assist",key:"assists",color:"#7c3aed",limit:200000,source:"Now Assist Admin (Auto)",acv:185000,risk:96200,insight:"Severely underutilized at 24%. €96K at risk. Expand deployment or renegotiate."},{id:"credits",label:"Learning Credits",key:"credits",color:SN.moderate,limit:800,source:"Manual (Now Learning portal)",acv:null,risk:54400,insight:"Only 15% consumed, expiring in 19 days. €5,440 will be lost without action."},{id:"fulfiller",label:"Fulfillers",key:"fulfiller",color:SN.positive,limit:250,source:"Subscription Mgmt v2 (Auto)",acv:null,risk:0,insight:"Right-sized at 87%. Consider slight reduction at renewal."}];
  const a=ms.find(m=>m.id===metric);const cur=USAGE_TREND[USAGE_TREND.length-1][a.key];const pct=Math.round((cur/a.limit)*100);
  const usageSidebar = <>
    <Card>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Actions</div>
      {[["Manual Usage Entry",Plus,()=>setShowManual(true)],["Export Report",Download,()=>{}]].map(([l,Ic,fn],i)=>(
        <div key={i} onClick={fn} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",fontSize:13,color:SN.primary,cursor:"pointer"}}><Ic size={11}/>{l}</div>
      ))}
    </Card>
    <Card>
      <div style={{fontSize:14,fontWeight:600,marginBottom:8}}>Quick Links</div>
      {[["Entitlements",Layers],["Renewal Cockpit",Target],["Alert Center",Bell],["Configuration",Settings]].map(([l,Ic],i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 0",fontSize:13,color:SN.primary,cursor:"pointer"}}><Ic size={11}/>{l}</div>
      ))}
    </Card>
    <Card accent={a.color}>
      <div style={{fontSize:12,color:SN.textSecondary,marginBottom:4}}>Current: {a.label}</div>
      <div style={{fontSize:28,fontWeight:700,fontFamily:hFont,color:pct>85?SN.critical:pct>65?SN.moderate:a.color,lineHeight:1}}>{pct}%</div>
      <div style={{fontSize:11,color:SN.textTertiary,marginTop:4}}>{fN(cur)} / {fN(a.limit)}</div>
      <div style={{marginTop:8,height:4,background:"#e8e8e8",borderRadius:2}}><div style={{height:"100%",width:`${Math.min(pct,100)}%`,background:pct>85?SN.critical:pct>65?SN.moderate:a.color,borderRadius:2}}/></div>
    </Card>
  </>;
  return (<WorkspaceLayout sidebar={usageSidebar}><div>
    <div style={{display:"flex",gap:0,borderBottom:`2px solid ${SN.divider}`,marginBottom:16}}>{ms.map(m=><div key={m.id} onClick={()=>setMetric(m.id)} style={{padding:"8px 16px",fontSize:13,cursor:"pointer",fontWeight:metric===m.id?600:400,color:metric===m.id?m.color:SN.textSecondary,borderBottom:metric===m.id?`3px solid ${m.color}`:"3px solid transparent",marginBottom:-2}}>{m.label}</div>)}</div>

    {/* Financial context strip — what native tools don't show */}
    <Card accent={a.risk>0?SN.critical:SN.positive} style={{marginBottom:16,padding:"12px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:16}}>
          <div><div style={{fontSize:11,color:SN.textTertiary,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Contract Entitlement</div><div style={{fontSize:14,fontWeight:600}}>{fN(a.limit)} {a.id==="fulfiller"?"Users":a.id==="credits"?"Credits":a.id==="assists"?"Assists":"Transactions"}/yr</div></div>
          <div style={{width:1,height:28,background:SN.divider}}/>
          <div><div style={{fontSize:11,color:SN.textTertiary,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>Consumed</div><div style={{fontSize:14,fontWeight:600,color:pct>85?SN.critical:pct>65?SN.moderate:SN.positive}}>{fN(cur)} ({pct}%)</div></div>
          <div style={{width:1,height:28,background:SN.divider}}/>
          <div><div style={{fontSize:11,color:SN.textTertiary,fontWeight:600,textTransform:"uppercase",letterSpacing:.5}}>{a.risk>0?"€ at Risk":"Status"}</div><div style={{fontSize:14,fontWeight:700,color:a.risk>0?SN.critical:SN.positive}}>{a.risk>0?fC(a.risk):"Healthy"}</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,fontSize:11}}>
          <div style={{width:6,height:6,borderRadius:99,background:a.source.includes("Auto")?SN.positive:SN.moderate}}/>
          <span style={{color:SN.textTertiary}}>Source: {a.source}</span>
        </div>
      </div>
      <div style={{marginTop:8,padding:"6px 10px",background:a.risk>0?SN.criticalBg:SN.positiveBg,borderRadius:4,fontSize:12,color:a.risk>0?SN.critical:SN.positive,fontWeight:500}}>
        <Sparkles size={11} style={{verticalAlign:"middle",marginRight:4}}/>{a.insight}
      </div>
    </Card>

    {/* ── Now Assist FinOps Module (only when assists selected) ── */}
    {metric==="assists" ? <NowAssistFinOps/> : <>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:20}}>
      <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Consumption Trend: {a.label}</h3>
        <ResponsiveContainer width="100%" height={240}><AreaChart data={USAGE_TREND}><defs><linearGradient id="ug" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={a.color} stopOpacity={.15}/><stop offset="95%" stopColor={a.color} stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke={SN.dividerLight}/><XAxis dataKey="month" tick={{fill:SN.textTertiary,fontSize:11}} axisLine={{stroke:SN.divider}}/><YAxis tick={{fill:SN.textTertiary,fontSize:11}} axisLine={{stroke:SN.divider}} tickFormatter={fN}/><Tooltip contentStyle={{background:"#fff",border:`1px solid ${SN.cardBorder}`,borderRadius:4,fontSize:12}}/><Area type="monotone" dataKey={a.key} stroke={a.color} fill="url(#ug)" strokeWidth={2}/></AreaChart></ResponsiveContainer>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:SN.textTertiary,marginTop:4}}><span>Data via {a.source}</span><span>Entitlement boundary: {fN(a.limit)}</span></div>
      </Card>
      <Card accent={a.color} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
        <div style={{fontSize:11,color:SN.textTertiary,textTransform:"uppercase",fontWeight:600,letterSpacing:.5,marginBottom:12}}>Period Utilization</div>
        <div style={{width:110,height:110,borderRadius:99,border:`8px solid ${SN.divider}`,borderTopColor:a.color,borderRightColor:pct>25?a.color:SN.divider,borderBottomColor:pct>50?a.color:SN.divider,borderLeftColor:pct>75?a.color:SN.divider,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:26,fontWeight:700,fontFamily:hFont,color:pct>85?SN.critical:pct>65?SN.moderate:a.color}}>{pct}%</span></div>
        <div style={{marginTop:14,fontSize:13,fontWeight:600}}>{fN(cur)} / {fN(a.limit)}</div>
        <div style={{fontSize:12,color:SN.textTertiary}}>Remaining: {fN(a.limit-cur)}</div>
        {a.risk>0&&<div style={{marginTop:8,fontSize:12,fontWeight:700,color:SN.critical}}>{fC(a.risk)} at risk</div>}
      </Card>
    </div>
    <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Collection Log</h3>
      <div style={{display:"grid",gridTemplateColumns:"160px 100px 1fr 120px",gap:8,padding:"6px 0",fontSize:11,fontWeight:600,color:SN.textTertiary,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${SN.divider}`}}><span>Timestamp</span><span>Source</span><span>Metric</span><span>Value</span></div>
      {[["Feb 23, 06:00","Platform","Integration Hub Transactions","387,420"],["Feb 23, 06:00","Sub. Mgmt v2","Fulfiller License Count","218"],["Feb 20, 14:32","Manual","Learning Credits Balance","120"],["Feb 18, 09:15","Manual","Expert Services Hours","45"]].map(([d,s,m,v],i)=><div key={i} style={{display:"grid",gridTemplateColumns:"160px 100px 1fr 120px",gap:8,padding:"8px 0",borderBottom:`1px solid ${SN.dividerLight}`,fontSize:12}}><span style={{color:SN.textTertiary}}>{d}</span><Badge variant={s==="Manual"?"default":"positive"}>{s}</Badge><span>{m}</span><span style={{fontWeight:500}}>{v}</span></div>)}
    </Card>
    </>}
    {showManual&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999}} onClick={()=>setShowManual(false)}><div style={{background:"#fff",borderRadius:8,padding:24,width:440,boxShadow:"0 8px 32px rgba(0,0,0,.15)"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{margin:0,fontSize:16}}>Manual Usage Entry</h3><X size={16} color={SN.textTertiary} style={{cursor:"pointer"}} onClick={()=>setShowManual(false)}/></div><div style={{padding:"8px 10px",background:SN.moderateBg,borderRadius:4,fontSize:12,color:SN.moderate,marginBottom:16}}>For metrics not yet available via platform APIs (Learning Credits, Expert Services). Check the Now Learning portal or your ServiceNow account team for current values.</div><div><label style={{display:"block",fontSize:12,fontWeight:600,color:SN.textSecondary,marginBottom:4}}>Entitlement</label><select style={{width:"100%",padding:"7px 10px",border:`1px solid ${SN.inputBorder}`,borderRadius:4,fontSize:13,fontFamily:font,marginBottom:12,background:"#fff"}}>{ENTITLEMENTS.filter(e=>["Training","Service"].includes(e.category)||(e.id==="E005")).map(e=><option key={e.id}>{e.name} (Manual)</option>)}</select></div><Input label="Current Usage Value" placeholder="0" type="number"/><Input label="Notes" placeholder="e.g., Checked Now Learning portal Feb 20"/><div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:8}}><Btn variant="secondary" onClick={()=>setShowManual(false)}>Cancel</Btn><Btn onClick={()=>setShowManual(false)}>Save</Btn></div></div></div>}
  </div></WorkspaceLayout>);
}

/* ═══════════════════════════════════════════════════════
   ALERTS
   ═══════════════════════════════════════════════════════ */
function AlertsView({alerts,dismiss,nav}) {
  return (<div>
    <div style={{display:"flex",gap:8,marginBottom:16}}>
      {[["critical",SN.critical],["warning",SN.moderate],["info",SN.info]].map(([s,c])=>{const n=alerts.filter(a=>a.severity===s).length;return <div key={s} style={{background:c+"0d",border:`1px solid ${c}22`,borderRadius:4,padding:"4px 12px",fontSize:12,fontWeight:600,color:c,display:"flex",alignItems:"center",gap:6}}><span style={{width:6,height:6,borderRadius:99,background:c}}/>{n} {s}</div>;})}
    </div>
    {alerts.map(a=>{const bc=a.severity==="critical"?SN.critical:a.severity==="warning"?SN.moderate:SN.info;return <Card key={a.id} accent={bc} style={{marginBottom:8}}>
      <div style={{display:"flex",gap:10}}><SevIcon severity={a.severity} size={18}/><div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,marginBottom:2}}>{a.title}</div><div style={{fontSize:12,color:SN.textSecondary,marginBottom:8}}>{a.subtitle}</div><div style={{display:"flex",gap:8}}><Btn variant="outline" small onClick={()=>{if(a.entitlement)nav("entitlements",{entitlement:a.entitlement});}}>{a.action}</Btn><Btn variant="link" small onClick={()=>dismiss(a.id)}>Dismiss</Btn></div></div><span style={{fontSize:11,color:SN.textTertiary,whiteSpace:"nowrap"}}>{a.date}</span></div>
    </Card>;})}
  </div>);
}

/* ═══════════════════════════════════════════════════════
   RENEWAL COCKPIT
   ═══════════════════════════════════════════════════════ */
function RenewalView() {
  const total=RENEWAL_DATA.savings.reduce((a,s)=>a+s.amount,0);
  return (<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
      <Card accent={SN.moderate} style={{display:"flex",alignItems:"center",gap:20}}><div style={{width:70,height:70,borderRadius:99,border:`6px solid ${SN.moderate}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:24,fontWeight:700,fontFamily:hFont,color:SN.moderate}}>62%</span></div><div><div style={{fontSize:12,color:SN.textSecondary}}>Value Realization</div><div style={{fontSize:11,color:SN.textTertiary,marginTop:2}}>of purchased value consumed</div></div></Card>
      <Card accent={SN.critical}><div style={{fontSize:12,color:SN.textSecondary,marginBottom:6}}>Value at Risk</div><div style={{fontSize:28,fontWeight:700,fontFamily:hFont,color:SN.critical}}>{fC(total)}</div><div style={{fontSize:11,color:SN.textTertiary,marginTop:2}}>Savings + recovery potential</div></Card>
      <Card accent={SN.positive}><div style={{fontSize:12,color:SN.textSecondary,marginBottom:6}}>Negotiation Leverage</div><div style={{fontSize:13,lineHeight:1.8}}><span style={{color:SN.critical,fontWeight:700}}>3</span> underutilized • <span style={{color:SN.moderate,fontWeight:700}}>2</span> at limit • <span style={{color:SN.positive,fontWeight:700}}>4</span> right-size opps</div></Card>
    </div>
    <Card accent={SN.accentBorder} style={{marginBottom:20}}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Entitlement Utilization</h3>
      <div style={{display:"grid",gridTemplateColumns:"60px 100px 1fr 1fr 24px",gap:8,padding:"6px 0",fontSize:11,fontWeight:600,color:SN.textTertiary,textTransform:"uppercase",letterSpacing:.5,borderBottom:`2px solid ${SN.divider}`}}><span>Score</span><span></span><span>Entitlement</span><span>Recommendation</span><span></span></div>
      {RENEWAL_DATA.scores.map((e,i)=>{const sc=e.score>75?SN.positive:e.score>50?SN.moderate:SN.critical;return <div key={i} style={{display:"grid",gridTemplateColumns:"60px 100px 1fr 1fr 24px",gap:8,padding:"10px 0",borderBottom:`1px solid ${SN.dividerLight}`,alignItems:"center",fontSize:13}}><span style={{fontWeight:700,color:sc}}>{e.score}%</span><Progress value={e.score} max={100} height={5}/><span style={{fontWeight:500}}>{e.name}</span><span style={{color:SN.textSecondary,fontSize:12}}>{e.rec}</span>{e.score>75?<CheckCircle size={14} color={SN.positive}/>:<AlertTriangle size={14} color={sc}/>}</div>;})}
    </Card>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Optimization Opportunities</h3>
        {RENEWAL_DATA.savings.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:`1px solid ${SN.dividerLight}`}}><div style={{width:28,height:28,borderRadius:4,background:s.type==="reduction"?SN.positiveBg:SN.infoBg,display:"flex",alignItems:"center",justifyContent:"center"}}>{s.type==="reduction"?<ArrowDownRight size={14} color={SN.positive}/>:<ArrowUpRight size={14} color={SN.info}/>}</div><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{s.area}</div><div style={{fontSize:11,color:SN.textTertiary}}>{s.type==="reduction"?"Cost Reduction":"Value Recovery"}</div></div><span style={{fontSize:15,fontWeight:700,color:SN.positive}}>{fC(s.amount)}</span></div>)}
        <div style={{display:"flex",justifyContent:"space-between",paddingTop:12}}><span style={{fontSize:14,fontWeight:700}}>Total</span><span style={{fontSize:18,fontWeight:700,fontFamily:hFont,color:SN.positive}}>{fC(total)}</span></div>
      </Card>
      <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Renewal Checklist</h3>
        {[{t:"Export data from Subscription Mgmt v2 → verified",d:true},{t:"Capture Now Assist Admin Console metrics",d:true},{t:"Check Now Learning portal for credit balance",d:true},{t:"Calculate Approver license right-sizing (€67.5K)",d:false},{t:"Request IHub transaction increase (+20%)",d:false},{t:"Negotiate Learning Credit rollover clause",d:false},{t:"Benchmark pricing (Flexera/Gartner)",d:false}].map((item,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${SN.dividerLight}`}}><div style={{width:18,height:18,borderRadius:3,border:`2px solid ${item.d?SN.positive:SN.inputBorder}`,background:item.d?SN.positiveBg:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{item.d&&<Check size={10} color={SN.positive}/>}</div><span style={{fontSize:12,color:item.d?SN.textTertiary:SN.textPrimary,textDecoration:item.d?"line-through":"none"}}>{item.t}</span></div>)}
      </Card>
    </div>
  </div>);
}

/* ═══════════════════════════════════════════════════════
   SETTINGS
   ═══════════════════════════════════════════════════════ */
function SettingsView() {
  return (<div>
    {/* Positioning banner */}
    <Card accent={SN.accent} style={{marginBottom:16,padding:"12px 16px",background:SN.accentLight}}>
      <div style={{fontSize:13,color:SN.accent,lineHeight:1.5}}><strong>ContractIQ reads from your existing ServiceNow telemetry</strong> — it does not replicate what Subscription Management or Now Assist Admin already track. For entitlements without native APIs (Learning Credits, Expert Services), ContractIQ provides manual entry workflows with reminders.</div>
    </Card>

    {/* Connected Data Sources */}
    <Card accent={SN.accentBorder} style={{marginBottom:16}}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>Connected Data Sources</h3><p style={{fontSize:12,color:SN.textTertiary,margin:"0 0 12px"}}>ContractIQ consumes data from these native ServiceNow sources</p>
      {[
        ["Subscription Management v2","connected","User licenses, custom tables, storage","Reads allocation groups & usage counts","Daily 06:00"],
        ["Now Assist Admin Console","connected","Assist actions, skill performance, daily active users","Reads usage summary & skill breakdown","Daily 06:00"],
        ["Platform Usage Analytics","connected","Integration Hub transactions, PA indicators","Reads sys_properties & platform stats","Daily 06:00"],
        ["Now Learning Portal","manual","Learning Credits balance","No API available — requires manual check","Monthly reminder"],
        ["Expert Services Tracker","manual","Expert Services hours consumed","Tracked by SN account team — manual entry","Monthly reminder"],
      ].map(([n,s,metrics,detail,freq],i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px",border:`1px solid ${SN.dividerLight}`,borderRadius:4,marginBottom:8,borderLeft:`3px solid ${s==="connected"?SN.positive:SN.moderate}`}}>
        <div style={{width:8,height:8,borderRadius:99,background:s==="connected"?SN.positive:SN.moderate,marginTop:5,flexShrink:0}}/>
        <div style={{flex:1}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:13,fontWeight:600}}>{n}</span>
            <Badge variant={s==="connected"?"positive":"default"}>{s==="connected"?"Connected":"Manual"}</Badge>
            <span style={{fontSize:11,color:SN.textTertiary,marginLeft:"auto"}}>{freq}</span>
          </div>
          <div style={{fontSize:12,color:SN.textSecondary,marginTop:2}}>{metrics}</div>
          <div style={{fontSize:11,color:SN.textTertiary,marginTop:2,fontStyle:"italic"}}>{detail}</div>
        </div>
        {s==="connected"?<Btn variant="outline" small>Configure</Btn>:<Btn variant="outline" small>Set Reminder</Btn>}
      </div>)}</Card>

    {/* Future Connectors */}
    <Card accent={SN.accentBorder} style={{marginBottom:16}}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 4px"}}>Roadmap Connectors</h3><p style={{fontSize:12,color:SN.textTertiary,margin:"0 0 12px"}}>Upcoming integrations to reduce manual entry</p>
      {[["Now Learning API","Auto-sync Learning Credits (when ServiceNow publishes API)","v1.2"],["Contract Management Pro","Import contract metadata & renewal dates","v1.2"],["ServiceNow Store Entitlements","Track store app custom table consumption","v1.3"]].map(([n,d,v],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",border:`1px solid ${SN.dividerLight}`,borderRadius:4,marginBottom:6}}><div style={{width:8,height:8,borderRadius:99,background:SN.textPlaceholder}}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500}}>{n}</div><div style={{fontSize:11,color:SN.textTertiary}}>{d}</div></div><Badge variant="neutral">{v}</Badge></div>)}</Card>

    <Card accent={SN.accentBorder}><h3 style={{fontSize:14,fontWeight:600,margin:"0 0 12px"}}>Access Roles</h3>
      {[["x_teiva_contractiq.admin","Full CRUD • configure alerts • manage data sources","2"],["x_teiva_contractiq.manager","Read/write • manual usage entry • renewal prep","5"],["x_teiva_contractiq.viewer","Read-only dashboards • for leadership & finance","12"]].map(([r,d,u],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",border:`1px solid ${SN.dividerLight}`,borderRadius:4,marginBottom:6}}><Shield size={14} color={SN.accent}/><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,fontFamily:"monospace"}}>{r}</div><div style={{fontSize:11,color:SN.textTertiary}}>{d}</div></div><Badge>{u} users</Badge></div>)}</Card>
  </div>);
}
