import { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Plus, X, ChevronRight, BookOpen, BarChart2, FileText, Edit2, Trash2, Camera, Clock, ChevronLeft, Check, Download, Layers } from "lucide-react";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS  — "Precision Lab" aesthetic
   Deep cosmos black · hairline gold · neon category accents
═══════════════════════════════════════════════════ */
const T = {
  bg0:     "#06080f",   // deepest background
  bg1:     "#0b0f1a",   // card background
  bg2:     "#111827",   // elevated surface
  bg3:     "#1a2235",   // input / pressed
  line:    "#1e2d45",   // hairline border
  lineGold:"#c9a84c30", // gold accent border
  gold:    "#c9a84c",   // gold accent text
  goldDim: "#c9a84c60",
  txt0:    "#f0f4ff",   // primary text
  txt1:    "#8899bb",   // secondary text
  txt2:    "#4a5a78",   // tertiary text
  pos:     "#34d399",   // positive score
  neg:     "#f87171",   // negative score
  neu:     "#6b7fa3",   // neutral
};

const CAT = {
  design:      { key:"design",      label:"Design",      jp:"意匠", color:"#60a5fa", glow:"#60a5fa22", border:"#60a5fa35" },
  experience:  { key:"experience",  label:"Experience",  jp:"体験", color:"#34d399", glow:"#34d39922", border:"#34d39935" },
  observation: { key:"observation", label:"Observation", jp:"観察", color:"#fb923c", glow:"#fb923c22", border:"#fb923c35" },
};

const EMOTION_WORDS = [
  "わくわく","物足りない","困惑","感動","不満","安心",
  "期待","驚き","楽しい","退屈","不安","満足","興奮","やるせない","爽快","重い",
];

/* ═══════════════════════════════════════════════════  GLOBAL STYLES  */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Mono:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e2d45; border-radius: 2px; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: #f0f4ff; box-shadow: 0 0 8px #60a5fa88; cursor: pointer; }
  input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 12px #60a5fa18; } 50% { box-shadow: 0 0 24px #60a5fa30; } }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  .qualia-card { animation: fadeUp 0.3s ease forwards; }
  .qualia-card:hover { transform: translateY(-1px); transition: transform 0.2s ease; }
`;

/* ═══════════════════════════════════════════════════  SVG IMAGES  */
function svg(body) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">${body}</svg>`
  )}`;
}

const LOG_IMAGES = {
  log001:[
    svg('<rect width="400" height="300" fill="#0a0c14"/><rect x="50" y="70" width="300" height="170" rx="16" fill="#141c2e"/><rect x="70" y="120" width="260" height="90" rx="8" fill="#1e2d4a"/><circle cx="120" cy="205" r="35" fill="#0d1320" stroke="#334466" stroke-width="3"/><circle cx="280" cy="205" r="35" fill="#0d1320" stroke="#334466" stroke-width="3"/><line x1="50" y1="70" x2="350" y2="70" stroke="#60a5fa22" stroke-width="1"/><text x="200" y="48" fill="#60a5fa" font-size="11" text-anchor="middle" font-family="serif" letter-spacing="3">DOOR FRAME · ALUMINIUM</text>'),
    svg('<rect width="400" height="300" fill="#0e0c08"/><path d="M60 180 Q200 80 340 180" stroke="#c9a84c" stroke-width="1.5" fill="none"/><circle cx="200" cy="110" r="45" fill="#1a1508" stroke="#c9a84c40"/><circle cx="200" cy="110" r="8" fill="#c9a84c"/><text x="200" y="270" fill="#c9a84c80" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">HINGE PRECISION</text>'),
    svg('<rect width="400" height="300" fill="#080a12"/><circle cx="200" cy="148" r="105" fill="none" stroke="#60a5fa18" stroke-width="1"/><circle cx="200" cy="148" r="75" fill="#0d1220" stroke="#60a5fa30" stroke-width="1"/><circle cx="200" cy="148" r="8" fill="#60a5fa"/><text x="200" y="272" fill="#60a5fa60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">MATERIAL MEMORY</text>'),
  ],
  log002:[
    svg('<rect width="400" height="300" fill="#080d08"/><path d="M0 260 Q80 200 160 220 Q240 240 320 160 Q360 120 400 80" stroke="#34d399" stroke-width="1.5" fill="none"/><path d="M0 260 Q80 200 160 220 Q240 240 320 160 Q360 120 400 80 L400 300 L0 300 Z" fill="#34d39910"/><text x="200" y="40" fill="#34d39980" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="3">ACCELERATION · 0–100 km/h</text>'),
    svg('<rect width="400" height="300" fill="#050d07"/><circle cx="200" cy="158" r="70" fill="#0a180c" stroke="#34d399" stroke-width="1"/><path d="M148 158 L200 98 L252 158" stroke="#34d399" stroke-width="1.5" fill="none"/><circle cx="200" cy="98" r="5" fill="#34d399"/><text x="200" y="48" fill="#34d39960" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">STEERING RESPONSE</text>'),
    svg('<rect width="400" height="300" fill="#040a05"/><path d="M40 210 L100 90 L180 155 L270 68 L360 138" stroke="#34d399" stroke-width="1.5" fill="none"/><circle cx="100" cy="90" r="4" fill="#34d399"/><circle cx="180" cy="155" r="4" fill="#34d399"/><circle cx="270" cy="68" r="4" fill="#34d399"/>'),
  ],
  log003:[
    svg('<rect width="400" height="300" fill="#080a18"/><circle cx="200" cy="148" r="100" fill="#0f1228" stroke="#60a5fa20" stroke-width="1"/><circle cx="200" cy="148" r="78" fill="#080a18"/><path d="M200 72 L200 148" stroke="#f0f4ff" stroke-width="2.5"/><path d="M200 148 L258 196" stroke="#fb923c" stroke-width="2.5"/><circle cx="200" cy="148" r="5" fill="#60a5fa"/><text x="200" y="272" fill="#60a5fa60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">ANALOGUE TACHOMETER</text>'),
    svg('<rect width="400" height="300" fill="#060810"/><rect x="44" y="96" width="312" height="128" rx="12" fill="#0d1228"/><rect x="64" y="116" width="85" height="88" rx="6" fill="#141e38"/><rect x="162" y="116" width="84" height="40" rx="5" fill="#60a5fa12"/><rect x="162" y="164" width="84" height="40" rx="5" fill="#60a5fa08"/><rect x="260" y="116" width="76" height="88" rx="5" fill="#60a5fa08"/>'),
    svg('<rect width="400" height="300" fill="#07090f"/><text x="200" y="175" fill="#60a5fa" font-size="52" text-anchor="middle" font-family="serif" font-weight="300" letter-spacing="-2">911</text><line x1="120" y1="190" x2="280" y2="190" stroke="#60a5fa30" stroke-width="1"/>'),
  ],
  log004:[
    svg('<rect width="400" height="300" fill="#040d06"/><path d="M0 200 Q50 185 100 196 Q155 208 200 184 Q248 160 300 191 Q348 218 400 200" stroke="#34d399" stroke-width="1.5" fill="none" opacity="0.8"/><path d="M0 220 Q50 205 100 216 Q155 228 200 204 Q248 180 300 211 Q348 238 400 220" stroke="#34d399" stroke-width="0.8" fill="none" opacity="0.35"/><text x="200" y="40" fill="#34d39960" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">SURFACE INFORMATION</text>'),
    svg('<rect width="400" height="300" fill="#050d07"/><circle cx="200" cy="148" r="115" fill="none" stroke="#34d39918" stroke-width="1" stroke-dasharray="8 4"/><circle cx="200" cy="148" r="80" fill="none" stroke="#34d39928" stroke-width="1" stroke-dasharray="4 8"/><circle cx="200" cy="148" r="45" fill="none" stroke="#34d39938" stroke-width="1"/><circle cx="200" cy="148" r="18" fill="#34d39920"/>'),
    svg('<rect width="400" height="300" fill="#030b04"/><path d="M40 148 Q120 72 200 148 Q280 224 360 148" stroke="#34d399" stroke-width="2" fill="none"/><text x="200" y="44" fill="#34d39960" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">GRIP · CURVE DYNAMICS</text>'),
  ],
  log005:[
    svg('<rect width="400" height="300" fill="#0e0900"/><circle cx="148" cy="148" r="55" fill="#1a1000" stroke="#fb923c" stroke-width="1"/><circle cx="270" cy="138" r="44" fill="#1a1000" stroke="#fb923c60" stroke-width="1" stroke-dasharray="4 3"/><line x1="200" y1="44" x2="200" y2="260" stroke="#fb923c20" stroke-width="1" stroke-dasharray="6 4"/><text x="200" y="282" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">SILENCE · STRATEGY</text>'),
    svg('<rect width="400" height="300" fill="#0c0800"/><rect x="72" y="72" width="108" height="156" rx="8" fill="#180e00"/><rect x="220" y="92" width="108" height="128" rx="8" fill="#180e00" stroke="#fb923c30"/><path d="M180 148 L220 148" stroke="#fb923c" stroke-width="1" stroke-dasharray="4 3"/><text x="200" y="268" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">OBSERVATION LOG</text>'),
    svg('<rect width="400" height="300" fill="#080600"/><path d="M60 210 Q130 82 200 142 Q270 202 340 102" stroke="#fb923c" stroke-width="1.5" fill="none"/><circle cx="130" cy="120" r="4" fill="#fb923c80"/><circle cx="200" cy="148" r="4" fill="#fb923c80"/><circle cx="270" cy="120" r="4" fill="#fb923c80"/>'),
  ],
  log006:[
    svg('<rect width="400" height="300" fill="#0e0008"/><path d="M200 72 L288 228 L112 228 Z" fill="#200020" stroke="#34d39930" stroke-width="1"/><text x="200" y="272" fill="#34d39960" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">END OF EXPERIENCE</text>'),
    svg('<rect width="400" height="300" fill="#0a000e"/><rect x="96" y="52" width="208" height="196" rx="14" fill="#150020" stroke="#34d39928" stroke-width="1"/><text x="200" y="158" fill="#34d39980" font-size="12" text-anchor="middle" font-family="serif" letter-spacing="1">また乗りたい</text>'),
    svg('<rect width="400" height="300" fill="#060008"/><circle cx="200" cy="148" r="92" fill="#100018" stroke="#34d399" stroke-width="1" stroke-dasharray="10 5"/><circle cx="200" cy="148" r="60" fill="none" stroke="#34d39930" stroke-width="1" stroke-dasharray="5 8"/>'),
  ],
  log007:[
    svg('<rect width="400" height="300" fill="#0a0a00"/><rect x="162" y="72" width="76" height="148" rx="10" fill="#1a1a00"/><rect x="172" y="82" width="56" height="88" rx="5" fill="#fb923c18"/><circle cx="200" cy="200" r="14" fill="#262600" stroke="#fb923c30"/><text x="200" y="268" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">PRE-RIDE BEHAVIOUR</text>'),
    svg('<rect width="400" height="300" fill="#080800"/><rect x="52" y="82" width="136" height="148" rx="8" fill="#181800" stroke="#fb923c30"/><rect x="212" y="102" width="136" height="128" rx="8" fill="#181800" stroke="#fb923c18"/><path d="M188 158 L212 158" stroke="#fb923c" stroke-width="1.5"/>'),
    svg('<rect width="400" height="300" fill="#060600"/><path d="M72 228 L112 128 L192 168 L272 88 L332 148" stroke="#fb923c" stroke-width="1.5" fill="none"/>'),
  ],
  log101:[
    svg('<rect width="400" height="300" fill="#100800"/><rect x="124" y="52" width="152" height="228" rx="10" fill="#1c1000" stroke="#fb923c30"/><rect x="140" y="72" width="120" height="188" rx="6" fill="#140c00"/><text x="200" y="172" fill="#fb923c" font-size="11" text-anchor="middle" font-family="serif" letter-spacing="1">注文端末</text><text x="200" y="272" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">KIOSK UI · BARRIER</text>'),
    svg('<rect width="400" height="300" fill="#0c0600"/><circle cx="200" cy="148" r="82" fill="#1a0e00"/><line x1="136" y1="84" x2="264" y2="212" stroke="#fb923c" stroke-width="1.5" opacity="0.7"/><line x1="264" y1="84" x2="136" y2="212" stroke="#fb923c" stroke-width="1.5" opacity="0.7"/><text x="200" y="272" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">CONFUSION PATTERN</text>'),
    svg('<rect width="400" height="300" fill="#080400"/><rect x="52" y="72" width="296" height="168" rx="12" fill="#150a00"/><rect x="72" y="92" width="80" height="128" rx="5" fill="#fb923c12"/><rect x="164" y="92" width="60" height="58" rx="4" fill="#fb923c08"/><rect x="164" y="162" width="60" height="58" rx="4" fill="#fb923c06"/>'),
  ],
  log102:[
    svg('<rect width="400" height="300" fill="#0a0800"/><rect x="36" y="52" width="328" height="208" rx="12" fill="#181400"/><rect x="56" y="72" width="288" height="44" rx="5" fill="#282000"/><rect x="56" y="128" width="136" height="52" rx="4" fill="#282000"/><rect x="204" y="128" width="140" height="52" rx="4" fill="#fb923c18"/><rect x="56" y="192" width="288" height="44" rx="4" fill="#282000"/><text x="200" y="280" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">SIGNAGE OVERLOAD</text>'),
    svg('<rect width="400" height="300" fill="#080600"/><text x="72" y="80" fill="#fb923c" font-size="10" font-family="serif">メニュー情報</text><text x="220" y="105" fill="#fb923c" font-size="10" font-family="serif">番号呼び出し</text><text x="52" y="152" fill="#fb923c" font-size="10" font-family="serif">SNS告知</text><text x="228" y="175" fill="#fb923c" font-size="10" font-family="serif">フェア情報</text><text x="96" y="228" fill="#fb923c80" font-size="10" font-family="serif">季節メニュー</text>'),
    svg('<rect width="400" height="300" fill="#060400"/><circle cx="200" cy="148" r="100" fill="#100c00" stroke="#fb923c30"/><circle cx="200" cy="148" r="64" fill="#0c0800" stroke="#fb923c18"/><text x="200" y="152" fill="#fb923c" font-size="11" text-anchor="middle" font-family="serif">視線迷子</text>'),
  ],
  log103:[
    svg('<rect width="400" height="300" fill="#00080e"/><path d="M72 260 L72 72 L180 72 L180 260" stroke="#60a5fa" stroke-width="1" fill="none" stroke-dasharray="6 4"/><path d="M220 260 L220 88 L328 88 L328 260" stroke="#fb923c" stroke-width="1" fill="none" stroke-dasharray="4 6"/><circle cx="200" cy="165" r="10" fill="#ef444430"/><text x="200" y="282" fill="#6b7fa360" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">FLOW CONFLICT</text>'),
    svg('<rect width="400" height="300" fill="#00060c"/><rect x="72" y="108" width="88" height="88" rx="6" fill="#0a1828" stroke="#60a5fa28"/><rect x="240" y="108" width="88" height="88" rx="6" fill="#200c00" stroke="#fb923c20"/><path d="M160 152 L240 152" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 3"/>'),
    svg('<rect width="400" height="300" fill="#00040a"/><path d="M52 208 Q144 100 240 178 Q282 210 348 150" stroke="#fb923c" stroke-width="1.5" fill="none"/>'),
  ],
  log104:[
    svg('<rect width="400" height="300" fill="#120800"/><rect x="36" y="168" width="328" height="108" rx="6" fill="#c8691022"/><path d="M60 168 L60 60 L80 60 L80 168" fill="#8B4513"/><path d="M104 168 L104 82 L124 82 L124 168" fill="#7a3c12"/><path d="M148 168 L148 68 L168 68 L168 168" fill="#8B4513"/><circle cx="132" cy="48" r="28" fill="#f59e0b18"/><circle cx="256" cy="56" r="22" fill="#f59e0b14"/><text x="200" y="282" fill="#c9a84c80" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">PENDANT LIGHTING</text>'),
    svg('<rect width="400" height="300" fill="#0e0600"/><rect x="0" y="0" width="44" height="44" fill="#2a1500"/><rect x="46" y="0" width="44" height="44" fill="#1e0e00"/><rect x="92" y="0" width="44" height="44" fill="#2a1500"/><rect x="0" y="46" width="44" height="44" fill="#1e0e00"/><rect x="46" y="46" width="44" height="44" fill="#2a1500"/><text x="200" y="200" fill="#c9a84c80" font-size="11" text-anchor="middle" font-family="serif" letter-spacing="2">TERRACOTTA TILE</text>'),
    svg('<rect width="400" height="300" fill="#0a0400"/><circle cx="200" cy="100" r="65" fill="#f59e0b12"/><circle cx="200" cy="100" r="44" fill="#f59e0b1e"/><circle cx="200" cy="100" r="24" fill="#f59e0b2e"/><line x1="200" y1="165" x2="200" y2="268" stroke="#f59e0b" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>'),
  ],
  log105:[
    svg('<rect width="400" height="300" fill="#080008"/><rect x="52" y="100" width="84" height="64" rx="5" fill="#18001a" stroke="#fb923c30"/><rect x="158" y="100" width="84" height="64" rx="5" fill="#18001a" stroke="#fb923c30"/><rect x="264" y="100" width="84" height="64" rx="5" fill="#18001a" stroke="#fb923c30"/><text x="200" y="216" fill="#fb923c" font-size="11" text-anchor="middle" font-family="serif">4人席 なし</text><text x="200" y="272" fill="#fb923c60" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">GROUP FAILURE</text>'),
    svg('<rect width="400" height="300" fill="#060006"/><circle cx="200" cy="148" r="92" fill="#100018" stroke="#fb923c28"/><path d="M200 56 L200 148 L292 148" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="5 3" fill="none"/>'),
    svg('<rect width="400" height="300" fill="#040004"/><path d="M52 248 L92 162 L152 224 L200 120 L260 202 L320 102 L368 178" stroke="#fb923c" stroke-width="1.5" fill="none"/>'),
  ],
  log106:[
    svg('<rect width="400" height="300" fill="#060808"/><rect x="152" y="56" width="96" height="188" rx="44" fill="#0f1a1a" stroke="#34d39930"/><rect x="164" y="68" width="72" height="164" rx="38" fill="#081212"/><text x="200" y="272" fill="#34d39960" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="2">CUP · HAPTICS</text>'),
    svg('<rect width="400" height="300" fill="#040606"/><circle cx="200" cy="140" r="82" fill="#080e0e" stroke="#34d39928"/><circle cx="200" cy="140" r="56" fill="#040a0a" stroke="#34d39938"/><text x="200" y="145" fill="#34d399" font-size="12" text-anchor="middle" font-family="serif" letter-spacing="1">ロゴ触感</text>'),
    svg('<rect width="400" height="300" fill="#020404"/><rect x="72" y="52" width="256" height="208" rx="10" fill="#090f0f"/><rect x="88" y="68" width="224" height="176" rx="7" fill="#050a0a" stroke="#34d39918"/><text x="200" y="174" fill="#34d39980" font-size="11" text-anchor="middle" font-family="serif" letter-spacing="1">ダブルウォール設計</text>'),
  ],
};

const PROJECT_COVERS = {
  p1: svg('<rect width="400" height="200" fill="#08091a"/><path d="M32 142 Q120 58 200 98 Q280 138 368 80" stroke="#60a5fa" stroke-width="1.2" fill="none" opacity="0.5"/><circle cx="200" cy="98" r="52" fill="#121a36" stroke="#60a5fa40"/><text x="200" y="94" fill="#60a5fa" font-size="14" text-anchor="middle" font-family="serif" letter-spacing="2">PORSCHE 911</text><text x="200" y="114" fill="#60a5fa60" font-size="9" text-anchor="middle" font-family="serif" letter-spacing="4">SENSORY STUDY</text><line x1="80" y1="160" x2="320" y2="160" stroke="#60a5fa18" stroke-width="1"/>'),
  p2: svg('<rect width="400" height="200" fill="#0c0900"/><rect x="56" y="28" width="288" height="144" rx="10" fill="#1a1200"/><rect x="76" y="48" width="84" height="104" rx="5" fill="#fb923c12"/><rect x="172" y="48" width="64" height="48" rx="4" fill="#34d39910"/><rect x="172" y="104" width="64" height="48" rx="4" fill="#34d39908"/><rect x="248" y="48" width="76" height="104" rx="4" fill="#fb923c08"/><text x="200" y="188" fill="#fb923c" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="3">CAFÉ UI OBSERVATION</text>'),
  p3: svg('<rect width="400" height="200" fill="#060610"/><rect x="96" y="38" width="64" height="108" rx="5" fill="#1a1a38"/><rect x="240" y="38" width="64" height="108" rx="5" fill="#1a1a38"/><line x1="0" y1="92" x2="400" y2="92" stroke="#60a5fa30" stroke-width="1.5" stroke-dasharray="20 10"/><text x="200" y="175" fill="#60a5fa80" font-size="10" text-anchor="middle" font-family="serif" letter-spacing="3">STATION WAYFINDING</text>'),
};

function getImgs(logId) {
  return LOG_IMAGES[logId] || [svg('<rect width="400" height="300" fill="#0b0f1a"/><text x="200" y="155" fill="#1e2d45" font-size="13" text-anchor="middle" font-family="serif" letter-spacing="2">NO IMAGE</text>')];
}

/* ═══════════════════════════════════════════════════  DEMO DATA  */
const DEMO_PROJECTS = [
  {
    id:"p1", name:"ポルシェ試乗体験", date:"2025-06-10",
    logs:[
      { id:"log001", category:"design",      thumbnailIdx:0, content:"ドアを開けた瞬間のアルミフレームの質感と重さ",     emotions:["感動","わくわく"], score:85,  memo:"ドアのヒンジ部分の精度が異常に高く、「カチッ」という閉まり方に職人的なこだわりを感じた。素材の冷たさと滑らかさが手のひらに記憶される感覚。", datetime:"2025-06-10T10:15:00.000Z" },
      { id:"log002", category:"experience",  thumbnailIdx:1, content:"アクセルを踏んだ瞬間のレスポンスと加速感",         emotions:["興奮"],           score:95,  memo:"0–100km/hが体感3秒程度。身体がシートに押し付けられる感覚は恐怖に近いが、それが快感に変わる瞬間がある。", datetime:"2025-06-10T10:42:00.000Z" },
      { id:"log003", category:"design",      thumbnailIdx:0, content:"コックピットのアナログとデジタルの混在デザイン",   emotions:["わくわく","感動"], score:72,  memo:"中央のタコメーターのみアナログで残し、他はデジタル化。この意図的な「アナログの残留」がドライバーを感情的に繋ぎとめているように感じた。", datetime:"2025-06-10T11:05:00.000Z" },
      { id:"log004", category:"experience",  thumbnailIdx:2, content:"カーブでのグリップ感と路面インフォメーション",     emotions:["安心"],           score:60,  memo:"ステアリングから路面の凹凸が「語りかけてくる」感じ。車と対話しているような感覚。これが信頼感・安心感に繋がる。", datetime:"2025-06-10T11:30:00.000Z" },
      { id:"log005", category:"observation", thumbnailIdx:0, content:"同乗スタッフが一切説明せず運転者の反応を静かに観察", emotions:["驚き"],         score:45,  memo:"通常の試乗では説明過多になりがちだが、ポルシェのスタッフは沈黙を戦略的に使っていた。感情の解像度が上がる設計に見えた。", datetime:"2025-06-10T11:50:00.000Z" },
      { id:"log006", category:"experience",  thumbnailIdx:1, content:"試乗後の降車時、ドアを閉める手に「また乗りたい」感覚", emotions:["物足りない"], score:-20, memo:"体験の終わりをデザインするという観点が面白い。降車〜鍵返却のフローが唐突で、余韻を壊している。", datetime:"2025-06-10T12:10:00.000Z" },
      { id:"log007", category:"observation", thumbnailIdx:2, content:"隣の客が試乗前にスマホで写真を何枚も撮っていた", emotions:["わくわく"],       score:30,  memo:"車への期待値の高さが写真行動に現れている。「乗る前から体験は始まっている」ことを再認識。", datetime:"2025-06-10T09:50:00.000Z" },
    ],
  },
  {
    id:"p2", name:"カフェのUI観察", date:"2025-06-08",
    logs:[
      { id:"log101", category:"observation", thumbnailIdx:0, content:"注文端末の前で3分以上立ち止まる高齢女性",         emotions:["困惑","やるせない"], score:-60, memo:"タッチパネルの文字サイズが小さく、カテゴリ階層が深すぎる。スタッフが2回声をかけて結局口頭で注文した。", datetime:"2025-06-08T09:20:00.000Z" },
      { id:"log102", category:"experience",  thumbnailIdx:1, content:"コーヒー受け取り口のサイネージの情報密度が高すぎる", emotions:["困惑"],           score:-40, memo:"メニュー情報・番号呼び出し・店舗SNS・フェアの告知が同一画面に同居。視線の優先度がデザインされていない。", datetime:"2025-06-08T09:45:00.000Z" },
      { id:"log103", category:"observation", thumbnailIdx:0, content:"若い男性がモバイルオーダーで先に番号を持って入店", emotions:["安心"],             score:55,  memo:"モバイルオーダー利用者の動線と通常注文者の動線が交差して混雑している。空間設計がUIの変化に追いついていない。", datetime:"2025-06-08T10:10:00.000Z" },
      { id:"log104", category:"design",      thumbnailIdx:2, content:"カウンター天板のタイル素材と照明の組み合わせ",    emotions:["わくわく","感動"],   score:70,  memo:"テラコッタ調タイルにペンダントライトの温かい光が反射して美しい。このエリアだけ別世界のような心地よさがある。", datetime:"2025-06-08T10:30:00.000Z" },
      { id:"log105", category:"observation", thumbnailIdx:1, content:"グループ客4人が席を探して3周した後、諦めて帰った", emotions:["やるせない","不満"], score:-75, memo:"4人席が1つもなく、2人席を2つ繋げようとしたが固定されていた。混雑時の席割りをUIで見せる仕組みがあれば防げた事象。", datetime:"2025-06-08T11:00:00.000Z" },
      { id:"log106", category:"experience",  thumbnailIdx:0, content:"カップのサイズ感と持ちやすさ、ロゴの触感",         emotions:["満足"],             score:65,  memo:"紙カップのエンボス加工されたロゴが指に引っかかる感触が好印象。ブランドを「触覚」で伝えるという発想が面白い。", datetime:"2025-06-08T10:50:00.000Z" },
    ],
  },
  { id:"p3", name:"駅ホームの案内UX", date:"2025-06-05", logs:[] },
];

/* ═══════════════════════════════════════════════════  HELPERS  */
function uid() { return Math.random().toString(36).slice(2,9); }
function fmt(iso) {
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function thumbOf(log) {
  const imgs = (log.images && log.images.length) ? log.images : getImgs(log.id);
  return imgs[log.thumbnailIdx] || imgs[0];
}
function scoreColor(s) { return s>0?T.pos:s<0?T.neg:T.neu; }

/* ═══════════════════════════════════════════════════  ATOMS  */

// Thin gold separator
function Sep() {
  return <div style={{ height:1, background:`linear-gradient(90deg,transparent,${T.gold}28,transparent)`, margin:"0 0 20px" }}/>;
}

// Category pill
function Pill({ cat, size=11 }) {
  const c = CAT[cat];
  return (
    <span style={{ padding:`3px ${size<12?8:10}px`, borderRadius:20, fontSize:size, fontWeight:500,
      background:c.glow, color:c.color, border:`1px solid ${c.border}`,
      fontFamily:"'DM Mono', monospace", letterSpacing:"0.05em" }}>
      {c.label}
    </span>
  );
}

// Score chip
function ScoreChip({ score, big }) {
  const col = scoreColor(score);
  const fs  = big ? 28 : 14;
  return (
    <span style={{ fontSize:fs, fontWeight:big?300:700, color:col, fontFamily:"'Cormorant Garamond', serif",
      letterSpacing:big?"-0.02em":"0" }}>
      {score>0?"+":""}{score}
    </span>
  );
}

// Score bar
function ScoreBar({ score }) {
  const col = scoreColor(score);
  const pct = ((score+100)/200)*100;
  return (
    <div style={{ background:T.bg2, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:9, color:T.txt2, marginBottom:6, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", textTransform:"uppercase" }}>Emotion Score</div>
        <div style={{ height:3, borderRadius:2, background:T.bg0 }}>
          <div style={{ height:"100%", borderRadius:2, background:col, width:`${pct}%`, boxShadow:`0 0 8px ${col}60` }} />
        </div>
      </div>
      <ScoreChip score={score} big />
    </div>
  );
}

// Emotion slider
function Slider({ value, onChange }) {
  const pct = ((value+100)/200)*100;
  const col = scoreColor(value);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:T.txt2, marginBottom:10,
        fontFamily:"'DM Mono',monospace" }}>
        <span>−100</span>
        <span style={{ color:col, fontSize:22, fontFamily:"'Cormorant Garamond',serif", fontWeight:300 }}>
          {value>0?"+":""}{value}
        </span>
        <span>+100</span>
      </div>
      <div style={{ position:"relative", height:4, borderRadius:2, background:T.bg3 }}>
        <div style={{ position:"absolute", top:0, left:0, height:"100%", borderRadius:2,
          width:`${pct}%`, background:`linear-gradient(90deg,${T.neg},${T.neu} 50%,${T.pos})`,
          boxShadow:`0 0 8px ${col}50` }} />
        <input type="range" min={-100} max={100} value={value} onChange={e=>onChange(Number(e.target.value))}
          style={{ position:"absolute", inset:0, width:"100%", opacity:0, cursor:"pointer", height:"100%", margin:0 }} />
      </div>
    </div>
  );
}

// Label
function Label({ children, mono }) {
  return <div style={{ fontSize:10, color:T.txt2, marginBottom:7, fontFamily:mono?"'DM Mono',monospace":"inherit",
    letterSpacing:"0.12em", textTransform:"uppercase" }}>{children}</div>;
}

// Text input style
function inpStyle(extra={}) {
  return { width:"100%", borderRadius:8, padding:"10px 13px", fontSize:13,
    background:T.bg3, color:T.txt0, border:`1px solid ${T.line}`,
    outline:"none", boxSizing:"border-box", fontFamily:"inherit",
    transition:"border-color 0.2s", ...extra };
}

// Bottom sheet modal
function Modal({ children, onClose }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
      position:"fixed", inset:0, zIndex:60, background:"rgba(0,0,0,0.88)",
      display:"flex", alignItems:"flex-end", justifyContent:"center", backdropFilter:"blur(4px)" }}>
      <div style={{ width:"100%", maxWidth:500, maxHeight:"93vh", overflowY:"auto",
        background:T.bg1, borderTop:`1px solid ${T.lineGold}`,
        borderRadius:"22px 22px 0 0", position:"relative",
        boxShadow:`0 -20px 60px rgba(0,0,0,0.6)` }}>
        <div style={{ position:"absolute", top:10, left:"50%", transform:"translateX(-50%)",
          width:36, height:3, borderRadius:2, background:T.line }} />
        <button onClick={onClose} style={{ position:"absolute", top:16, right:16, zIndex:1,
          background:T.bg3, border:`1px solid ${T.line}`, borderRadius:"50%", width:30, height:30,
          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <X size={13} color={T.txt2} />
        </button>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════  LOG FORM  */
function LogForm({ initial, allContents, onSubmit, onCancel }) {
  const [f, setF] = useState(() => {
    if (initial) return { ...initial, datetime:initial.datetime.slice(0,16), emotions:initial.emotions||[], images:initial.images||[], freeInput:"" };
    return { category:"design", content:"", score:0, emotions:[], freeInput:"", memo:"", thumbnailIdx:0, datetime:new Date().toISOString().slice(0,16), images:[] };
  });
  const [suggest, setSuggest] = useState([]);
  const fileRef = useRef(null);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const c = CAT[f.category];

  const handleContent = v => {
    set("content",v);
    setSuggest(v.length>1 ? allContents.filter(c=>c!==v&&c.includes(v)).slice(0,3) : []);
  };
  const toggleEmotion = w => {
    setF(p=>({ ...p, emotions:p.emotions.includes(w)?p.emotions.filter(e=>e!==w):[...p.emotions,w] }));
  };
  const addFree = () => {
    const v=(f.freeInput||"").trim();
    if(!v) return;
    if(!f.emotions.includes(v)) setF(p=>({...p,emotions:[...p.emotions,v],freeInput:""}));
    else set("freeInput","");
  };
  const handleFiles = e => {
    Array.from(e.target.files).forEach(file=>{
      const r=new FileReader();
      r.onload=ev=>setF(p=>({...p,images:[...p.images,ev.target.result]}));
      r.readAsDataURL(file);
    });
  };
  const removeImg = i => setF(p=>{
    const images=p.images.filter((_,j)=>j!==i);
    return {...p,images,thumbnailIdx:Math.min(p.thumbnailIdx,Math.max(0,images.length-1))};
  });
  const submit = () => {
    if(!f.content.trim()) return;
    const { freeInput, ...rest } = f;
    onSubmit({ ...rest, id:f.id||uid(), datetime:new Date(f.datetime).toISOString() });
  };

  return (
    <div style={{ padding:"28px 20px 24px" }}>
      {/* Title */}
      <div style={{ marginBottom:22 }}>
        <p style={{ fontSize:10, color:T.goldDim, letterSpacing:"0.2em", textTransform:"uppercase",
          fontFamily:"'DM Mono',monospace", marginBottom:4 }}>QUALIA Log</p>
        <h2 style={{ fontSize:20, fontWeight:300, color:T.txt0, fontFamily:"'Cormorant Garamond',serif" }}>
          {initial?"記録を編集":"新規記録"}
        </h2>
      </div>

      {/* Category */}
      <Label mono>Category</Label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:20 }}>
        {Object.values(CAT).map(cat=>(
          <button key={cat.key} onClick={()=>set("category",cat.key)} style={{
            padding:"9px 0", borderRadius:8, fontSize:11, fontWeight:f.category===cat.key?600:400,
            cursor:"pointer", fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em",
            background:f.category===cat.key?cat.glow:T.bg3,
            color:f.category===cat.key?cat.color:T.txt2,
            border:`1px solid ${f.category===cat.key?cat.border:T.line}`,
            transition:"all 0.2s",
          }}>{cat.label}</button>
        ))}
      </div>

      {/* Content */}
      <Label mono>Observation *</Label>
      <div style={{ position:"relative", marginBottom:18 }}>
        <textarea value={f.content} onChange={e=>handleContent(e.target.value)}
          placeholder="気づいた内容を記録…" rows={2}
          style={{ ...inpStyle({ resize:"none", display:"block" }) }} />
        {suggest.length>0&&(
          <div style={{ position:"absolute", width:"100%", background:T.bg2,
            border:`1px solid ${T.line}`, borderRadius:8, zIndex:10, top:"100%", marginTop:2 }}>
            {suggest.map((s,i)=>(
              <button key={i} onClick={()=>{set("content",s);setSuggest([]);}}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 13px",
                  color:T.txt1, fontSize:12, background:"none", border:"none", cursor:"pointer",
                  borderBottom:i<suggest.length-1?`1px solid ${T.line}`:"none" }}>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <Label mono>Photos</Label>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }}>
        {f.images.map((src,i)=>(
          <div key={i} style={{ position:"relative" }}>
            <img src={src} alt="" onClick={()=>set("thumbnailIdx",i)}
              style={{ width:64, height:64, objectFit:"cover", borderRadius:8, display:"block", cursor:"pointer",
                border:`1.5px solid ${i===f.thumbnailIdx?c.color:T.line}`,
                boxShadow:i===f.thumbnailIdx?`0 0 10px ${c.color}40`:undefined }} />
            <button onClick={()=>removeImg(i)} style={{ position:"absolute", top:-5, right:-5,
              width:17, height:17, borderRadius:"50%", background:"#EF4444", border:"none",
              cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X size={8} color="white" />
            </button>
            {i===f.thumbnailIdx&&(
              <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)",
                background:c.color, borderRadius:3, padding:"1px 5px", fontSize:8, color:"white", whiteSpace:"nowrap" }}>
                MAIN
              </div>
            )}
          </div>
        ))}
        <button onClick={()=>fileRef.current?.click()} style={{ width:64, height:64, borderRadius:8,
          background:T.bg3, border:`1px dashed ${T.line}`, cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
          <Camera size={16} color={T.txt2} />
          <span style={{ fontSize:9, color:T.txt2, fontFamily:"'DM Mono',monospace" }}>ADD</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:"none" }} />
      </div>

      {/* Score */}
      <Label mono>Emotion Score</Label>
      <div style={{ marginBottom:20 }}><Slider value={f.score} onChange={v=>set("score",v)} /></div>

      {/* Emotion tags */}
      <Label mono>Emotion Words <span style={{ color:T.txt2, fontWeight:300 }}>· multiple</span></Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
        {EMOTION_WORDS.map(w=>{
          const sel=f.emotions.includes(w);
          return (
            <button key={w} onClick={()=>toggleEmotion(w)} style={{
              padding:"5px 10px", borderRadius:16, fontSize:11, cursor:"pointer",
              background:sel?c.glow:T.bg3, color:sel?c.color:T.txt2,
              border:`1px solid ${sel?c.border:T.line}`, fontWeight:sel?600:400,
              transition:"all 0.15s",
            }}>{w}</button>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:f.emotions.length?12:18 }}>
        <input value={f.freeInput||""} onChange={e=>set("freeInput",e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&addFree()}
          placeholder="自由記述（例: じんわり）"
          style={{ ...inpStyle({ flex:1, marginBottom:0 }) }} />
        <button onClick={addFree} style={{ padding:"10px 14px", borderRadius:8, background:c.glow,
          color:c.color, border:`1px solid ${c.border}`, cursor:"pointer",
          fontSize:11, fontWeight:600, fontFamily:"'DM Mono',monospace", whiteSpace:"nowrap" }}>
          ADD
        </button>
      </div>
      {f.emotions.length>0&&(
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16, padding:"10px 12px",
          background:T.bg2, borderRadius:8, border:`1px solid ${T.line}` }}>
          {f.emotions.map((e,i)=>(
            <span key={i} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 9px",
              background:c.glow, color:c.color, borderRadius:14, fontSize:11, fontWeight:500 }}>
              {e}
              <button onClick={()=>toggleEmotion(e)}
                style={{ background:"none", border:"none", cursor:"pointer", color:c.color, padding:0, display:"flex", lineHeight:1 }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Memo */}
      <Label mono>Field Notes</Label>
      <textarea value={f.memo} onChange={e=>set("memo",e.target.value)}
        placeholder="なぜそう感じたかの考察…" rows={3}
        style={{ ...inpStyle({ resize:"none", marginBottom:18, display:"block" }) }} />

      {/* Datetime */}
      <Label mono><Clock size={9} style={{ display:"inline", marginRight:4 }}/>Recorded At</Label>
      <input type="datetime-local" value={f.datetime} onChange={e=>set("datetime",e.target.value)}
        style={{ ...inpStyle({ marginBottom:22 }) }} />

      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onCancel} style={{ flex:1, padding:"12px 0", borderRadius:10,
          background:T.bg3, color:T.txt2, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13 }}>
          Cancel
        </button>
        <button onClick={submit} style={{ flex:1, padding:"12px 0", borderRadius:10,
          background:c.glow, color:c.color, border:`1px solid ${c.border}`, cursor:"pointer",
          fontSize:13, fontWeight:600, boxShadow:`0 0 16px ${c.color}20` }}>
          {initial?"Update":"Record"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════  DETAIL MODAL  */
function DetailModal({ log, onClose, onEdit, onDelete }) {
  const c = CAT[log.category];
  const imgs = (log.images&&log.images.length) ? log.images : getImgs(log.id);
  return (
    <Modal onClose={onClose}>
      <div style={{ padding:"28px 20px 24px" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <Pill cat={log.category} />
          <span style={{ color:T.txt2, fontSize:11, fontFamily:"'DM Mono',monospace" }}>{fmt(log.datetime)}</span>
        </div>

        {/* Images */}
        <div style={{ display:"flex", gap:8, marginBottom:20, overflowX:"auto" }}>
          {imgs.slice(0,3).map((src,i)=>(
            <div key={i} style={{ position:"relative", flexShrink:0 }}>
              <img src={src} alt="" style={{ width:92, height:92, objectFit:"cover", borderRadius:10, display:"block",
                border:`1.5px solid ${i===log.thumbnailIdx?c.color:T.line}`,
                boxShadow:i===log.thumbnailIdx?`0 0 12px ${c.color}35`:undefined }} />
              {i===log.thumbnailIdx&&(
                <div style={{ position:"absolute", top:-5, right:-5, width:18, height:18,
                  borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 0 8px ${c.color}` }}>
                  <Check size={10} color="white" />
                </div>
              )}
            </div>
          ))}
        </div>

        <p style={{ color:T.txt0, fontWeight:400, fontSize:15, marginBottom:10, lineHeight:1.5,
          fontFamily:"'Cormorant Garamond',serif" }}>{log.content}</p>

        {log.emotions&&log.emotions.length>0&&(
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:14 }}>
            {log.emotions.map((e,i)=>(
              <span key={i} style={{ padding:"3px 9px", background:c.glow, color:c.color,
                borderRadius:12, fontSize:11, fontWeight:500 }}>「{e}」</span>
            ))}
          </div>
        )}

        {log.memo&&<p style={{ color:T.txt1, fontSize:13, lineHeight:1.7, marginBottom:18,
          borderLeft:`2px solid ${c.border}`, paddingLeft:12 }}>{log.memo}</p>}

        <div style={{ marginBottom:20 }}><ScoreBar score={log.score} /></div>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>onEdit(log)} style={{ flex:1, padding:"11px 0", borderRadius:10,
            background:T.bg3, color:T.txt0, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13,
            display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <Edit2 size={13} /> Edit
          </button>
          <button onClick={()=>{onDelete(log.id);onClose();}} style={{ padding:"11px 18px",
            borderRadius:10, background:"#EF444418", color:"#EF4444",
            border:"1px solid #EF444435", cursor:"pointer" }}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════  JOURNEY DOT  */
function JourneyDot(props) {
  const { cx, cy, payload, onClickLog, hoveredId, setHoveredId } = props;
  if (cx==null||cy==null||!payload) return null;
  const cc = CAT[payload.category];
  if (!cc) return null;
  const isHov = hoveredId===payload.id;
  const label = (payload.emotions||[]).slice(0,2).join("・");
  const lw = Math.max(52, label.length*9.5+18);
  const thumb = thumbOf(payload);

  return (
    <g style={{ cursor:"pointer" }}
      onClick={()=>onClickLog(payload)}
      onMouseEnter={()=>setHoveredId(payload.id)}
      onMouseLeave={()=>setHoveredId(null)}>
      {/* Callout */}
      {label&&(
        <g>
          <rect x={cx-lw/2} y={cy-52} width={lw} height={21} rx={10}
            fill="#0b0f1a" stroke={cc.color} strokeWidth={1} opacity={0.96}/>
          <text x={cx} y={cy-37} textAnchor="middle"
            style={{ fontSize:9, fill:cc.color, fontWeight:"500", fontFamily:"sans-serif" }}>
            {label}
          </text>
          <polygon points={`${cx-4},${cy-31} ${cx+4},${cy-31} ${cx},${cy-22}`}
            fill="#0b0f1a" stroke={cc.color} strokeWidth={0.8}/>
        </g>
      )}
      {/* Glow ring */}
      {isHov&&<circle cx={cx} cy={cy} r={22} fill={cc.color+"18"} stroke={cc.color+"40"} strokeWidth={1}/>}
      {/* Dot */}
      <circle cx={cx} cy={cy} r={isHov?14:11} fill={cc.glow} stroke={cc.color} strokeWidth={1.5}
        style={{ filter:`drop-shadow(0 0 5px ${cc.color}50)` }}/>
      <circle cx={cx} cy={cy} r={isHov?7:5} fill={cc.color}/>
      {/* Hover thumbnail */}
      {isHov&&thumb&&(
        <foreignObject x={cx-40} y={cy+22} width={80} height={80}
          style={{ overflow:"visible", borderRadius:10 }}>
          <img src={thumb} alt=""
            style={{ width:78, height:78, objectFit:"cover", borderRadius:10, display:"block",
              border:`1.5px solid ${cc.color}`, boxShadow:`0 4px 16px rgba(0,0,0,0.6)` }}/>
        </foreignObject>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════════════  JOURNEY MAP  */
function JourneyMap({ logs, onClickLog }) {
  const [view, setView] = useState("self");
  const [hoveredId, setHoveredId] = useState(null);
  const sorted = [...logs].sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
  const dData = sorted.filter(l=>l.category==="design")    .map(l=>({...l,time:fmt(l.datetime)}));
  const eData = sorted.filter(l=>l.category==="experience").map(l=>({...l,time:fmt(l.datetime)}));
  const oData = sorted.filter(l=>l.category==="observation").map(l=>({...l,time:fmt(l.datetime)}));
  const dotProps = { onClickLog, hoveredId, setHoveredId };
  const renderDot = p => <JourneyDot {...p} {...dotProps}/>;
  const tt = {
    contentStyle:{ background:T.bg1, border:`1px solid ${T.line}`, borderRadius:10, fontSize:12,
      color:T.txt1, padding:"6px 12px" },
    labelStyle:{ color:T.txt2, fontSize:10 }, cursor:{ stroke:T.line },
  };

  return (
    <div style={{ paddingTop:8 }}>
      {/* Toggle */}
      <div style={{ display:"flex", background:T.bg2, borderRadius:10, padding:3, marginBottom:22,
        border:`1px solid ${T.line}` }}>
        {[["self","Self Experience"],["obs","Observation"]].map(([k,label])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            flex:1, padding:"8px 0", borderRadius:8, fontSize:11, fontWeight:500, cursor:"pointer",
            background:view===k?T.bg3:"transparent",
            color:view===k?T.txt0:T.txt2,
            border:view===k?`1px solid ${T.line}`:"1px solid transparent",
            fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em", transition:"all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {view==="self"&&(dData.length<2&&eData.length<2?<EmptyChart/>:(
        <div style={{ height:340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top:72, right:24, left:-22, bottom:8 }}>
              <defs>
                <filter id="glow-d"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-e"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <CartesianGrid strokeDasharray="1 4" stroke={T.line} vertical={false}/>
              <ReferenceLine y={0} stroke={T.goldDim} strokeWidth={1} strokeDasharray="4 4"/>
              <XAxis dataKey="time" type="category" allowDuplicatedCategory={false}
                tick={{ fill:T.txt2, fontSize:9, fontFamily:"DM Mono" }} axisLine={false} tickLine={false}/>
              <YAxis domain={[-100,100]} tick={{ fill:T.txt2, fontSize:9, fontFamily:"DM Mono" }}
                axisLine={false} tickLine={false}/>
              <Tooltip {...tt} formatter={(v,n)=>[`${v>0?"+":""}${v}`, n]}/>
              {dData.length>=2&&<Line data={dData} type="monotone" dataKey="score"
                stroke={CAT.design.color} strokeWidth={1.5} name="Design"
                dot={renderDot} activeDot={false} filter="url(#glow-d)"/>}
              {eData.length>=2&&<Line data={eData} type="monotone" dataKey="score"
                stroke={CAT.experience.color} strokeWidth={1.5} name="Experience"
                dot={renderDot} activeDot={false} filter="url(#glow-e)"/>}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      {view==="obs"&&(oData.length<2?<EmptyChart/>:(
        <div style={{ height:340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={oData} margin={{ top:72, right:24, left:-22, bottom:8 }}>
              <CartesianGrid strokeDasharray="1 4" stroke={T.line} vertical={false}/>
              <ReferenceLine y={0} stroke={T.goldDim} strokeWidth={1} strokeDasharray="4 4"/>
              <XAxis dataKey="time" tick={{ fill:T.txt2, fontSize:9, fontFamily:"DM Mono" }}
                axisLine={false} tickLine={false}/>
              <YAxis domain={[-100,100]} tick={{ fill:T.txt2, fontSize:9, fontFamily:"DM Mono" }}
                axisLine={false} tickLine={false}/>
              <Tooltip {...tt} formatter={(v,n)=>[`${v>0?"+":""}${v}`,n]}/>
              <Line type="monotone" dataKey="score" stroke={CAT.observation.color}
                strokeWidth={1.5} name="Observation" dot={renderDot} activeDot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}

      {/* Legend */}
      {view==="self"&&(
        <div style={{ display:"flex", justifyContent:"center", gap:24, marginTop:14 }}>
          {["design","experience"].map(k=>(
            <div key={k} style={{ display:"flex", alignItems:"center", gap:7, fontSize:10,
              color:T.txt2, fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em" }}>
              <div style={{ width:20, height:1.5, background:CAT[k].color,
                boxShadow:`0 0 6px ${CAT[k].color}` }}/>
              {CAT[k].label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyChart() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:200, gap:14 }}>
      <BarChart2 size={38} strokeWidth={0.8} color={T.txt2}/>
      <p style={{ fontSize:12, color:T.txt2, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em" }}>
        2 LOGS MINIMUM REQUIRED
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════  MINI CHART (report)  */
function MiniChart({ data, color }) {
  if (data.length<2) return (
    <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center",
      color:T.txt2, fontSize:11, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em" }}>
      INSUFFICIENT DATA
    </div>
  );
  return (
    <div style={{ height:130 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:8, right:8, left:-34, bottom:4 }}>
          <CartesianGrid strokeDasharray="1 4" stroke={T.line} vertical={false}/>
          <ReferenceLine y={0} stroke={T.goldDim} strokeWidth={1}/>
          <XAxis dataKey="time" tick={{ fill:T.txt2, fontSize:8, fontFamily:"DM Mono" }}
            axisLine={false} tickLine={false}/>
          <YAxis domain={[-100,100]} tick={{ fill:T.txt2, fontSize:8, fontFamily:"DM Mono" }}
            axisLine={false} tickLine={false}/>
          <Line type="monotone" dataKey="score" stroke={color} strokeWidth={1.5}
            dot={{ r:3, fill:color, strokeWidth:0 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════════════  REPORT  */
function Report({ project, logs }) {
  const sorted = [...logs].sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
  const selfData = sorted.filter(l=>l.category!=="observation").map(l=>({...l,time:fmt(l.datetime)}));
  const obsData  = sorted.filter(l=>l.category==="observation").map(l=>({...l,time:fmt(l.datetime)}));
  const reportRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadScript = (src, check) => new Promise((res, rej) => {
    if (check()) return res();
    const s = document.createElement("script");
    s.src = src; s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  });

  const handlePDF = async () => {
    if (!reportRef.current) return;
    setPdfLoading(true);
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", ()=>!!window.html2canvas);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", ()=>!!(window.jspdf&&window.jspdf.jsPDF));
      const el = reportRef.current;
      const canvas = await window.html2canvas(el, { backgroundColor:"#06080f", scale:2, useCORS:true, allowTaint:true, logging:false, width:el.scrollWidth, height:el.scrollHeight, windowWidth:el.scrollWidth });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const iw = pw;
      const ih = (canvas.height*iw)/canvas.width;
      let rem=ih, page=0;
      while(rem>0){
        if(page>0) pdf.addPage();
        const sh=Math.min(ph,rem);
        const sy=page*(canvas.height/ih)*ph;
        const shpx=sh*(canvas.height/ih);
        const pc=document.createElement("canvas");
        pc.width=canvas.width; pc.height=Math.ceil(shpx);
        pc.getContext("2d").drawImage(canvas,0,sy,canvas.width,shpx,0,0,canvas.width,shpx);
        pdf.addImage(pc.toDataURL("image/png"),"PNG",0,0,iw,sh);
        rem-=sh; page++;
      }
      const date=new Date().toLocaleDateString("ja-JP").replace(/\//g,"-");
      pdf.save(`QUALIA_${project.name}_${date}.pdf`);
    } catch(e) { console.error(e); alert("PDF生成エラー: "+e.message); }
    finally { setPdfLoading(false); }
  };

  const SH = (color) => ({
    fontSize:12, fontWeight:500, color:color||T.txt0,
    display:"flex", alignItems:"center", gap:8, marginBottom:12,
    fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em", textTransform:"uppercase"
  });

  return (
    <div style={{ paddingBottom:20 }}>
      {/* PDF button */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button onClick={handlePDF} disabled={pdfLoading} style={{
          display:"flex", alignItems:"center", gap:7, padding:"9px 16px", borderRadius:9,
          fontSize:11, fontWeight:500, cursor:pdfLoading?"not-allowed":"pointer",
          background:pdfLoading?T.bg3:T.bg2,
          color:pdfLoading?T.txt2:T.gold,
          border:`1px solid ${pdfLoading?T.line:T.goldDim}`,
          fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em",
          boxShadow:pdfLoading?"none":`0 0 16px ${T.goldDim}`,
        }}>
          <Download size={12}/> {pdfLoading?"GENERATING…":"EXPORT PDF"}
        </button>
      </div>

      {/* Captured content */}
      <div ref={reportRef} style={{ background:T.bg0, padding:20, borderRadius:16 }}>
        {/* Header */}
        <div style={{ marginBottom:24 }}>
          <p style={{ fontSize:9, color:T.goldDim, letterSpacing:"0.25em", textTransform:"uppercase",
            fontFamily:"'DM Mono',monospace", marginBottom:6 }}>QUALIA · Field Research Report</p>
          <h1 style={{ fontSize:26, fontWeight:300, color:T.txt0, fontFamily:"'Cormorant Garamond',serif",
            letterSpacing:"-0.01em", marginBottom:4 }}>{project.name}</h1>
          <p style={{ fontSize:10, color:T.txt2, fontFamily:"'DM Mono',monospace" }}>
            {new Date().toLocaleDateString("ja-JP")} · {logs.length} LOGS
          </p>
        </div>
        <Sep/>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
          {Object.values(CAT).map(cat=>{
            const cl=logs.filter(l=>l.category===cat.key);
            const avg=cl.length?Math.round(cl.reduce((a,l)=>a+l.score,0)/cl.length):"–";
            return (
              <div key={cat.key} style={{ padding:"14px 12px", borderRadius:12, background:cat.glow,
                border:`1px solid ${cat.border}` }}>
                <p style={{ fontSize:9, fontWeight:500, color:cat.color, marginBottom:6,
                  fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em", textTransform:"uppercase" }}>
                  {cat.label}
                </p>
                <p style={{ fontSize:30, fontWeight:300, color:T.txt0, lineHeight:1,
                  fontFamily:"'Cormorant Garamond',serif" }}>{cl.length}</p>
                <p style={{ fontSize:10, color:T.txt2, marginTop:5, fontFamily:"'DM Mono',monospace" }}>
                  avg {avg}
                </p>
              </div>
            );
          })}
        </div>

        {/* Self map */}
        <div style={{ marginBottom:24 }}>
          <h3 style={SH()}>
            <div style={{ width:3, height:14, borderRadius:2, background:CAT.design.color,
              boxShadow:`0 0 8px ${CAT.design.color}` }}/>
            Self Experience Map
          </h3>
          <div style={{ background:T.bg1, borderRadius:12, padding:"12px 8px",
            border:`1px solid ${T.line}` }}>
            <MiniChart data={selfData} color={CAT.design.color}/>
          </div>
        </div>

        {/* Observation map */}
        <div style={{ marginBottom:24 }}>
          <h3 style={SH()}>
            <div style={{ width:3, height:14, borderRadius:2, background:CAT.observation.color,
              boxShadow:`0 0 8px ${CAT.observation.color}` }}/>
            Observation Map
          </h3>
          <div style={{ background:T.bg1, borderRadius:12, padding:"12px 8px",
            border:`1px solid ${T.line}` }}>
            <MiniChart data={obsData} color={CAT.observation.color}/>
          </div>
        </div>

        {/* Logs */}
        {Object.values(CAT).map(cat=>{
          const cl=sorted.filter(l=>l.category===cat.key);
          if(!cl.length) return null;
          return (
            <div key={cat.key} style={{ marginBottom:24 }}>
              <h3 style={SH(cat.color)}>
                <div style={{ width:3, height:14, borderRadius:2, background:cat.color,
                  boxShadow:`0 0 8px ${cat.color}` }}/>
                {cat.label}
              </h3>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {cl.map(log=>(
                  <div key={log.id} style={{ display:"flex", gap:12, padding:12,
                    borderRadius:12, background:T.bg1, border:`1px solid ${T.line}` }}>
                    <img src={thumbOf(log)} alt="" style={{ width:52, height:52, objectFit:"cover",
                      borderRadius:8, flexShrink:0, border:`1px solid ${cat.border}`, display:"block" }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                        <span style={{ fontSize:9, color:T.txt2, fontFamily:"'DM Mono',monospace" }}>{fmt(log.datetime)}</span>
                        <span style={{ fontSize:13, fontWeight:300, color:scoreColor(log.score),
                          fontFamily:"'Cormorant Garamond',serif" }}>
                          {log.score>0?"+":""}{log.score}
                        </span>
                      </div>
                      <p style={{ fontSize:13, color:T.txt0, overflow:"hidden", textOverflow:"ellipsis",
                        whiteSpace:"nowrap", marginBottom:3 }}>{log.content}</p>
                      {log.emotions&&log.emotions.length>0&&(
                        <p style={{ fontSize:10, color:cat.color }}>
                          {log.emotions.map(e=>`「${e}」`).join(" ")}
                        </p>
                      )}
                      {log.memo&&<p style={{ fontSize:11, color:T.txt2, marginTop:4, lineHeight:1.5,
                        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                        {log.memo}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════  DELETE CONFIRM  */
function DeleteProjModal({ project, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <div style={{ padding:"28px 24px", textAlign:"center" }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:"#EF444418",
          border:"1px solid #EF444435", display:"flex", alignItems:"center", justifyContent:"center",
          margin:"0 auto 18px" }}>
          <Trash2 size={22} color="#EF4444"/>
        </div>
        <h3 style={{ color:T.txt0, fontWeight:300, fontSize:20, marginBottom:8,
          fontFamily:"'Cormorant Garamond',serif" }}>
          Delete Project?
        </h3>
        <p style={{ color:T.txt1, fontSize:13, marginBottom:5 }}>「{project.name}」</p>
        <p style={{ color:T.txt2, fontSize:11, marginBottom:26, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.05em" }}>ALL LOGS WILL BE PERMANENTLY DELETED</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"12px 0", borderRadius:10,
            background:T.bg3, color:T.txt2, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13 }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:"12px 0", borderRadius:10,
            background:"#EF444418", color:"#EF4444", border:"1px solid #EF444435",
            cursor:"pointer", fontSize:13, fontWeight:600 }}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════  MAIN APP  */
export default function Qualia() {
  const [projects,    setProjects]    = useState(DEMO_PROJECTS);
  const [activeId,    setActiveId]    = useState("p1");
  const [screen,      setScreen]      = useState("logs");
  const [showForm,    setShowForm]    = useState(false);
  const [editingLog,  setEditingLog]  = useState(null);
  const [viewingLog,  setViewingLog]  = useState(null);
  const [showNewProj, setShowNewProj] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [deletingProj,setDeletingProj]= useState(null);

  const proj = projects.find(p=>p.id===activeId);
  const logs = proj?.logs||[];

  const mut = (id,fn) => setProjects(ps=>ps.map(p=>p.id===id?{...p,...fn(p)}:p));
  const addLog    = log => { mut(activeId,p=>({logs:[...p.logs,log]})); setShowForm(false); };
  const updateLog = log => { mut(activeId,p=>({logs:p.logs.map(l=>l.id===log.id?log:l)})); setEditingLog(null); setViewingLog(null); };
  const deleteLog = id  => { mut(activeId,p=>({logs:p.logs.filter(l=>l.id!==id)})); };

  const createProj = () => {
    if(!newProjName.trim()) return;
    const p={id:uid(),name:newProjName,date:new Date().toISOString(),logs:[]};
    setProjects(ps=>[p,...ps]);
    setNewProjName(""); setShowNewProj(false); setActiveId(p.id); setScreen("logs");
  };
  const confirmDelete = () => {
    setProjects(ps=>ps.filter(p=>p.id!==deletingProj.id));
    if(activeId===deletingProj.id){setActiveId(null);setScreen("home");}
    setDeletingProj(null);
  };

  const NAV=[
    {key:"logs",   Icon:BookOpen,  label:"Logs"},
    {key:"journey",Icon:BarChart2, label:"Journey"},
    {key:"report", Icon:FileText,  label:"Report"},
  ];

  const base = {
    background:T.bg0,
    fontFamily:"'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",
    minHeight:"100vh",
    color:T.txt0,
  };

  // ── HOME ─────────────────────────────────────────
  if (screen==="home"||!activeId) return (
    <div style={base}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"56px 18px 100px" }}>

        {/* Wordmark */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"baseline", gap:10, marginBottom:6 }}>
            <h1 style={{ fontSize:40, fontWeight:300, color:T.txt0, fontFamily:"'Cormorant Garamond',serif",
              letterSpacing:"0.08em" }}>QUALIA</h1>
            <span style={{ fontSize:9, color:T.gold, fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.2em", marginBottom:2 }}>v2</span>
          </div>
          <div style={{ width:48, height:1, background:`linear-gradient(90deg,${T.gold},transparent)`,
            marginBottom:8 }}/>
          <p style={{ fontSize:11, color:T.txt2, fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.12em", textTransform:"uppercase" }}>
            Qualitative Field Research
          </p>
        </div>

        {/* New project */}
        {showNewProj?(
          <div style={{ background:T.bg1, border:`1px solid ${T.lineGold}`, borderRadius:16,
            padding:18, marginBottom:22, boxShadow:`0 0 30px rgba(201,168,76,0.06)` }}>
            <p style={{ fontSize:9, color:T.goldDim, fontFamily:"'DM Mono',monospace",
              letterSpacing:"0.2em", marginBottom:10, textTransform:"uppercase" }}>New Project</p>
            <input value={newProjName} onChange={e=>setNewProjName(e.target.value)}
              placeholder="Project name…" autoFocus onKeyDown={e=>e.key==="Enter"&&createProj()}
              style={{ ...inpStyle({ marginBottom:12 }) }} />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setShowNewProj(false)} style={{ flex:1, padding:"10px 0",
                borderRadius:9, background:T.bg3, color:T.txt2, border:`1px solid ${T.line}`,
                cursor:"pointer", fontSize:12 }}>Cancel</button>
              <button onClick={createProj} style={{ flex:1, padding:"10px 0", borderRadius:9,
                background:T.lineGold, color:T.gold, border:`1px solid ${T.goldDim}`,
                cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'DM Mono',monospace",
                letterSpacing:"0.05em" }}>CREATE</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowNewProj(true)} style={{
            width:"100%", padding:"14px 0", borderRadius:14, marginBottom:24,
            background:"transparent", color:T.gold, border:`1px dashed ${T.goldDim}`,
            cursor:"pointer", fontSize:12, fontFamily:"'DM Mono',monospace", letterSpacing:"0.1em",
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            transition:"all 0.2s" }}>
            <Plus size={14}/> NEW PROJECT
          </button>
        )}

        {/* Project list */}
        <p style={{ fontSize:9, color:T.txt2, fontFamily:"'DM Mono',monospace",
          letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14 }}>Projects</p>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {projects.map((p,idx)=>{
            const cover = PROJECT_COVERS[p.id];
            const userThumb = p.logs.find(l=>l.images&&l.images.length>0);
            const coverSrc = userThumb?thumbOf(userThumb):cover;
            return (
              <div key={p.id} className="qualia-card"
                style={{ animationDelay:`${idx*0.06}s`, borderRadius:18, overflow:"hidden",
                  background:T.bg1, border:`1px solid ${T.line}`, position:"relative" }}>
                {/* Cover */}
                <div style={{ height:100, overflow:"hidden", position:"relative" }}>
                  {coverSrc&&<img src={coverSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>}
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom,transparent 20%,${T.bg1}f8 100%)` }}/>
                  {/* Delete */}
                  <button onClick={e=>{e.stopPropagation();setDeletingProj(p);}}
                    style={{ position:"absolute", top:10, right:10, width:30, height:30,
                      borderRadius:"50%", background:"rgba(0,0,0,0.7)", border:"1px solid #EF444435",
                      cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Trash2 size={12} color="#EF4444"/>
                  </button>
                  {/* Cat badges */}
                  <div style={{ position:"absolute", bottom:10, left:14, display:"flex", gap:5 }}>
                    {Object.values(CAT).map(cat=>{
                      const n=p.logs.filter(l=>l.category===cat.key).length;
                      if(!n) return null;
                      return (
                        <span key={cat.key} style={{ padding:"2px 7px", borderRadius:10,
                          background:cat.glow, color:cat.color, border:`1px solid ${cat.border}`,
                          fontSize:9, fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em" }}>
                          {cat.label[0]} {n}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* Info */}
                <button onClick={()=>{setActiveId(p.id);setScreen("logs");}}
                  style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px",
                    background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:14, fontWeight:400, color:T.txt0, overflow:"hidden",
                      textOverflow:"ellipsis", whiteSpace:"nowrap",
                      fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.01em" }}>{p.name}</p>
                    <p style={{ fontSize:10, color:T.txt2, marginTop:2,
                      fontFamily:"'DM Mono',monospace", letterSpacing:"0.05em" }}>
                      {p.logs.length} LOGS
                    </p>
                  </div>
                  <ChevronRight size={15} color={T.txt2}/>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      {deletingProj&&<DeleteProjModal project={deletingProj} onConfirm={confirmDelete} onCancel={()=>setDeletingProj(null)}/>}
    </div>
  );

  // ── PROJECT SCREEN ────────────────────────────────
  return (
    <div style={base}>
      <style>{GLOBAL_CSS}</style>

      {/* Topbar */}
      <div style={{ position:"sticky", top:0, zIndex:30, padding:"10px 16px",
        display:"flex", alignItems:"center", gap:12,
        background:`${T.bg0}ee`, backdropFilter:"blur(20px)",
        borderBottom:`1px solid ${T.line}` }}>
        <button onClick={()=>{setScreen("home");setActiveId(null);}}
          style={{ width:32, height:32, borderRadius:9, background:T.bg2,
            border:`1px solid ${T.line}`, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ChevronLeft size={15} color={T.txt2}/>
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:15, fontWeight:300, color:T.txt0, overflow:"hidden",
            textOverflow:"ellipsis", whiteSpace:"nowrap",
            fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.02em" }}>{proj?.name}</p>
          <p style={{ fontSize:9, color:T.txt2, fontFamily:"'DM Mono',monospace",
            letterSpacing:"0.1em" }}>{logs.length} LOGS</p>
        </div>
        {/* QUALIA wordmark */}
        <span style={{ fontSize:13, color:T.goldDim, fontFamily:"'Cormorant Garamond',serif",
          letterSpacing:"0.15em" }}>QUALIA</span>
        {screen==="logs"&&(
          <button onClick={()=>setShowForm(true)} style={{
            display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
            borderRadius:9, background:T.bg2, color:T.txt0,
            border:`1px solid ${T.line}`, cursor:"pointer", fontSize:11,
            fontFamily:"'DM Mono',monospace", letterSpacing:"0.08em" }}>
            <Plus size={12}/> NEW
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth:480, margin:"0 auto", padding:"14px 16px 108px" }}>

        {/* LOG LIST */}
        {screen==="logs"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {logs.length===0&&(
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", height:260, gap:14 }}>
                <BookOpen size={42} strokeWidth={0.8} color={T.txt2}/>
                <p style={{ fontSize:11, color:T.txt2, textAlign:"center", fontFamily:"'DM Mono',monospace",
                  letterSpacing:"0.1em", lineHeight:2 }}>
                  PRESS "NEW" TO BEGIN<br/>RECORDING OBSERVATIONS
                </p>
              </div>
            )}
            {[...logs].reverse().map((log,idx)=>{
              const c=CAT[log.category];
              return (
                <button key={log.id} onClick={()=>setViewingLog(log)}
                  className="qualia-card"
                  style={{ animationDelay:`${idx*0.04}s`, display:"flex", gap:13, padding:"13px 14px",
                    borderRadius:16, background:T.bg1, border:`1px solid ${T.line}`,
                    cursor:"pointer", textAlign:"left", width:"100%",
                    transition:"border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=c.border;e.currentTarget.style.boxShadow=`0 0 20px ${c.color}10`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.line;e.currentTarget.style.boxShadow="none";}}>
                  <img src={thumbOf(log)} alt="" style={{ width:56, height:56, objectFit:"cover",
                    borderRadius:10, flexShrink:0, border:`1px solid ${c.border}`, display:"block" }}/>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                      <Pill cat={log.category} size={10}/>
                      <span style={{ fontSize:10, color:T.txt2, fontFamily:"'DM Mono',monospace" }}>
                        {fmt(log.datetime)}
                      </span>
                    </div>
                    <p style={{ fontSize:13, color:T.txt0, overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap", marginBottom:3 }}>{log.content}</p>
                    {log.emotions&&log.emotions.length>0&&(
                      <p style={{ fontSize:10, color:c.color }}>
                        {log.emotions.slice(0,3).map(e=>`「${e}」`).join(" ")}
                      </p>
                    )}
                  </div>
                  <div style={{ alignSelf:"center", flexShrink:0 }}>
                    <ScoreChip score={log.score}/>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {screen==="journey"&&<JourneyMap logs={logs} onClickLog={setViewingLog}/>}
        {screen==="report"&&proj&&<Report project={proj} logs={logs}/>}
      </div>

      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:30,
        display:"flex", justifyContent:"space-around", padding:"10px 20px",
        background:`${T.bg0}f0`, backdropFilter:"blur(20px)",
        borderTop:`1px solid ${T.line}` }}>
        {NAV.map(({key,Icon,label})=>{
          const active = screen===key;
          return (
            <button key={key} onClick={()=>setScreen(key)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              padding:"5px 24px", background:"none", border:"none", cursor:"pointer",
              color:active?T.gold:T.txt2, position:"relative" }}>
              {active&&<div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
                width:24, height:1.5, background:T.gold,
                boxShadow:`0 0 8px ${T.gold}`, borderRadius:1 }}/>}
              <Icon size={19} strokeWidth={active?2:1.2}/>
              <span style={{ fontSize:9, fontFamily:"'DM Mono',monospace",
                letterSpacing:"0.1em", fontWeight:active?500:400 }}>
                {label.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      {(showForm||editingLog)&&(
        <Modal onClose={()=>{setShowForm(false);setEditingLog(null);}}>
          <LogForm initial={editingLog} allContents={logs.map(l=>l.content)}
            onSubmit={editingLog?updateLog:addLog}
            onCancel={()=>{setShowForm(false);setEditingLog(null);}}/>
        </Modal>
      )}
      {viewingLog&&!editingLog&&(
        <DetailModal log={viewingLog} onClose={()=>setViewingLog(null)}
          onEdit={log=>{setViewingLog(null);setEditingLog(log);}}
          onDelete={deleteLog}/>
      )}
    </div>
  );
}
