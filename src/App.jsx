import { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from "recharts";
import { Plus, X, ChevronRight, BookOpen, BarChart2, FileText, Edit2, Trash2, Camera, Clock, ChevronLeft, Check, Download, Pencil, Image } from "lucide-react";

/* ═══════════════════════════════════════════
   DESIGN TOKENS — Light & Clean
═══════════════════════════════════════════ */
const T = {
  bg0:    "#f5f6fa",   // page background
  bg1:    "#ffffff",   // card / surface
  bg2:    "#f0f2f8",   // subtle fill
  bg3:    "#e8eaf2",   // input background
  line:   "#e2e5ef",   // border
  lineA:  "#c7cde8",   // stronger border
  accent: "#5b6af0",   // primary accent (indigo)
  accentL:"#5b6af015", // accent light fill
  accentB:"#5b6af040", // accent border
  txt0:   "#1a1d2e",   // primary text
  txt1:   "#4b5270",   // secondary text
  txt2:   "#8b92b0",   // tertiary text
  pos:    "#16a34a",   // positive
  posL:   "#16a34a18",
  neg:    "#dc2626",   // negative
  negL:   "#dc262618",
  neu:    "#6b7280",
  shadow: "0 2px 12px rgba(91,106,240,0.08)",
  shadowM:"0 4px 24px rgba(91,106,240,0.13)",
};

const CAT = {
  design:      { key:"design",      label:"Design",      color:"#3b82f6", light:"#eff6ff", border:"#bfdbfe" },
  experience:  { key:"experience",  label:"Experience",  color:"#16a34a", light:"#f0fdf4", border:"#bbf7d0" },
  observation: { key:"observation", label:"Observation", color:"#ea580c", light:"#fff7ed", border:"#fed7aa" },
};

const EMOTION_WORDS = [
  "わくわく","物足りない","困惑","感動","不満","安心",
  "期待","驚き","楽しい","退屈","不安","満足","興奮","やるせない","爽快","重い",
];

/* ═══════════════════════════════════════════  GLOBAL CSS */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter','Noto Sans JP',sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #f0f2f8; }
  ::-webkit-scrollbar-thumb { background: #c7cde8; border-radius: 4px; }
  input[type=range] { -webkit-appearance: none; appearance: none; background: transparent; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #5b6af0; box-shadow: 0 2px 8px #5b6af050; cursor: pointer; margin-top: -7px; }
  input[type=range]::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: #e2e5ef; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .q-card { animation: fadeUp 0.25s ease forwards; }
  textarea, input { font-family: inherit; }
`;

/* ═══════════════════════════════════════════  SVG PLACEHOLDERS */
function svg(body) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">${body}</svg>`
  )}`;
}

const LOG_IMAGES = {
  log001:[
    svg('<rect width="400" height="300" fill="#dbeafe"/><rect x="60" y="80" width="280" height="150" rx="14" fill="#bfdbfe"/><rect x="80" y="120" width="240" height="80" rx="8" fill="#93c5fd"/><circle cx="130" cy="200" r="30" fill="#60a5fa" opacity="0.5"/><circle cx="270" cy="200" r="30" fill="#60a5fa" opacity="0.5"/><text x="200" y="55" fill="#1d4ed8" font-size="12" text-anchor="middle" font-family="sans-serif">Door Frame</text>'),
    svg('<rect width="400" height="300" fill="#fef9c3"/><path d="M80 160 Q200 80 320 160" stroke="#ca8a04" stroke-width="3" fill="none"/><circle cx="200" cy="110" r="40" fill="#fde68a"/><text x="200" y="270" fill="#92400e" font-size="12" text-anchor="middle" font-family="sans-serif">Hinge Precision</text>'),
    svg('<rect width="400" height="300" fill="#ede9fe"/><circle cx="200" cy="150" r="100" fill="#ddd6fe" stroke="#8b5cf6" stroke-width="2"/><circle cx="200" cy="150" r="10" fill="#7c3aed"/><text x="200" y="270" fill="#5b21b6" font-size="12" text-anchor="middle" font-family="sans-serif">Material Memory</text>'),
  ],
  log002:[
    svg('<rect width="400" height="300" fill="#dcfce7"/><path d="M0 250 Q100 150 200 180 Q300 210 400 100" stroke="#16a34a" stroke-width="3" fill="none"/><text x="200" y="40" fill="#15803d" font-size="12" text-anchor="middle" font-family="sans-serif">Acceleration 0-100</text>'),
    svg('<rect width="400" height="300" fill="#f0fdf4"/><circle cx="200" cy="155" r="60" fill="#bbf7d0" stroke="#16a34a" stroke-width="2"/><path d="M148 155 L200 98 L252 155" stroke="#16a34a" stroke-width="2" fill="none"/>'),
    svg('<rect width="400" height="300" fill="#ecfdf5"/><path d="M50 200 L120 80 L200 150 L280 60 L350 130" stroke="#16a34a" stroke-width="2.5" fill="none"/><circle cx="200" cy="150" r="5" fill="#16a34a"/>'),
  ],
  log003:[
    svg('<rect width="400" height="300" fill="#e0f2fe"/><circle cx="200" cy="150" r="100" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/><path d="M200 70 L200 150" stroke="#0c4a6e" stroke-width="3"/><path d="M200 150 L255 190" stroke="#ea580c" stroke-width="3"/><text x="200" y="270" fill="#0c4a6e" font-size="12" text-anchor="middle" font-family="sans-serif">Tachometer</text>'),
    svg('<rect width="400" height="300" fill="#f0f9ff"/><rect x="50" y="100" width="300" height="120" rx="10" fill="#bae6fd"/><rect x="70" y="120" width="80" height="80" rx="5" fill="#7dd3fc"/><rect x="165" y="120" width="80" height="35" rx="5" fill="#e0f2fe"/><rect x="165" y="165" width="80" height="35" rx="5" fill="#e0f2fe"/>'),
    svg('<rect width="400" height="300" fill="#f0f9ff"/><text x="200" y="175" fill="#0284c7" font-size="52" text-anchor="middle" font-family="sans-serif" font-weight="700">911</text>'),
  ],
  log004:[
    svg('<rect width="400" height="300" fill="#dcfce7"/><path d="M0 200 Q50 185 100 196 Q155 208 200 184 Q248 160 300 191 Q348 218 400 200" stroke="#16a34a" stroke-width="2" fill="none"/><text x="200" y="40" fill="#15803d" font-size="12" text-anchor="middle" font-family="sans-serif">Surface Info</text>'),
    svg('<rect width="400" height="300" fill="#f0fdf4"/><circle cx="200" cy="148" r="110" fill="none" stroke="#86efac" stroke-width="2" stroke-dasharray="8 4"/><circle cx="200" cy="148" r="20" fill="#bbf7d0"/>'),
    svg('<rect width="400" height="300" fill="#ecfdf5"/><path d="M60 150 Q130 80 200 150 Q270 220 340 150" stroke="#16a34a" stroke-width="3" fill="none"/>'),
  ],
  log005:[
    svg('<rect width="400" height="300" fill="#fff7ed"/><circle cx="148" cy="148" r="55" fill="#fed7aa" stroke="#ea580c" stroke-width="2"/><circle cx="270" cy="138" r="44" fill="#fed7aa" stroke="#ea580c" stroke-width="1.5" stroke-dasharray="4 3"/><text x="200" y="270" fill="#9a3412" font-size="12" text-anchor="middle" font-family="sans-serif">Silence Strategy</text>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><rect x="72" y="72" width="108" height="156" rx="8" fill="#fed7aa"/><rect x="220" y="92" width="108" height="128" rx="8" fill="#fed7aa" stroke="#ea580c"/>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><path d="M80 200 Q140 80 200 140 Q260 200 320 100" stroke="#ea580c" stroke-width="2" fill="none"/>'),
  ],
  log006:[
    svg('<rect width="400" height="300" fill="#f0fdf4"/><path d="M200 80 L280 220 L120 220 Z" fill="#bbf7d0" stroke="#16a34a" stroke-width="1.5"/><text x="200" y="265" fill="#15803d" font-size="12" text-anchor="middle" font-family="sans-serif">End of Experience</text>'),
    svg('<rect width="400" height="300" fill="#f0fdf4"/><rect x="100" y="60" width="200" height="180" rx="12" fill="#dcfce7" stroke="#86efac"/>'),
    svg('<rect width="400" height="300" fill="#f0fdf4"/><circle cx="200" cy="150" r="90" fill="#dcfce7" stroke="#16a34a" stroke-width="1" stroke-dasharray="10 5"/>'),
  ],
  log007:[
    svg('<rect width="400" height="300" fill="#fff7ed"/><rect x="162" y="72" width="76" height="148" rx="10" fill="#fed7aa"/><rect x="172" y="82" width="56" height="88" rx="5" fill="#fdba74"/><text x="200" y="260" fill="#9a3412" font-size="12" text-anchor="middle" font-family="sans-serif">Photo Behaviour</text>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><rect x="52" y="82" width="136" height="148" rx="8" fill="#fed7aa" stroke="#ea580c"/><rect x="212" y="102" width="136" height="128" rx="8" fill="#fed7aa"/>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><path d="M80 220 L120 120 L200 160 L280 80 L320 140" stroke="#ea580c" stroke-width="2" fill="none"/>'),
  ],
  log101:[
    svg('<rect width="400" height="300" fill="#fff7ed"/><rect x="124" y="52" width="152" height="228" rx="10" fill="#fed7aa" stroke="#ea580c"/><text x="200" y="172" fill="#9a3412" font-size="12" text-anchor="middle" font-family="sans-serif">Kiosk UI</text>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><circle cx="200" cy="148" r="82" fill="#fed7aa"/><line x1="136" y1="84" x2="264" y2="212" stroke="#ea580c" stroke-width="2"/><line x1="264" y1="84" x2="136" y2="212" stroke="#ea580c" stroke-width="2"/>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><rect x="52" y="72" width="296" height="168" rx="12" fill="#fed7aa"/><rect x="72" y="92" width="80" height="128" rx="5" fill="#fdba74"/>'),
  ],
  log102:[
    svg('<rect width="400" height="300" fill="#fffbeb"/><rect x="36" y="52" width="328" height="208" rx="12" fill="#fde68a"/><text x="200" y="270" fill="#92400e" font-size="12" text-anchor="middle" font-family="sans-serif">Signage Overload</text>'),
    svg('<rect width="400" height="300" fill="#fffbeb"/><text x="72" y="80" fill="#d97706" font-size="11" font-family="sans-serif">メニュー情報</text><text x="220" y="105" fill="#d97706" font-size="11" font-family="sans-serif">番号呼び出し</text><text x="52" y="152" fill="#d97706" font-size="11" font-family="sans-serif">SNS告知</text>'),
    svg('<rect width="400" height="300" fill="#fffbeb"/><circle cx="200" cy="148" r="100" fill="#fde68a" stroke="#d97706"/><text x="200" y="152" fill="#92400e" font-size="12" text-anchor="middle" font-family="sans-serif">視線迷子</text>'),
  ],
  log103:[
    svg('<rect width="400" height="300" fill="#eff6ff"/><path d="M80 250 L80 80 L180 80 L180 250" stroke="#3b82f6" stroke-width="2" fill="none" stroke-dasharray="6 4"/><path d="M220 250 L220 100 L320 100 L320 250" stroke="#ea580c" stroke-width="2" fill="none" stroke-dasharray="4 6"/><text x="200" y="275" fill="#1e40af" font-size="12" text-anchor="middle" font-family="sans-serif">Flow Conflict</text>'),
    svg('<rect width="400" height="300" fill="#eff6ff"/><rect x="72" y="108" width="88" height="88" rx="6" fill="#bfdbfe"/><rect x="240" y="108" width="88" height="88" rx="6" fill="#fed7aa"/>'),
    svg('<rect width="400" height="300" fill="#eff6ff"/><path d="M60 200 Q150 100 240 180 Q280 210 340 150" stroke="#ea580c" stroke-width="2" fill="none"/>'),
  ],
  log104:[
    svg('<rect width="400" height="300" fill="#fffbeb"/><rect x="36" y="168" width="328" height="108" rx="6" fill="#fde68a"/><path d="M60 168 L60 60 L80 60 L80 168" fill="#92400e"/><path d="M100 168 L100 80 L120 80 L120 168" fill="#b45309"/><circle cx="130" cy="48" r="28" fill="#fef08a"/><text x="200" y="280" fill="#92400e" font-size="12" text-anchor="middle" font-family="sans-serif">Pendant Lighting</text>'),
    svg('<rect width="400" height="300" fill="#fffbeb"/><rect x="0" y="0" width="44" height="44" fill="#fde68a"/><rect x="46" y="0" width="44" height="44" fill="#fef9c3"/><rect x="92" y="0" width="44" height="44" fill="#fde68a"/><text x="200" y="200" fill="#92400e" font-size="12" text-anchor="middle" font-family="sans-serif">Terracotta Tile</text>'),
    svg('<rect width="400" height="300" fill="#fffbeb"/><circle cx="200" cy="100" r="65" fill="#fef08a"/><circle cx="200" cy="100" r="44" fill="#fde68a"/><circle cx="200" cy="100" r="24" fill="#fbbf24"/>'),
  ],
  log105:[
    svg('<rect width="400" height="300" fill="#fff7ed"/><rect x="52" y="100" width="84" height="64" rx="5" fill="#fed7aa" stroke="#ea580c"/><rect x="158" y="100" width="84" height="64" rx="5" fill="#fed7aa" stroke="#ea580c"/><rect x="264" y="100" width="84" height="64" rx="5" fill="#fed7aa" stroke="#ea580c"/><text x="200" y="210" fill="#9a3412" font-size="12" text-anchor="middle" font-family="sans-serif">4人席なし</text>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><circle cx="200" cy="150" r="92" fill="#fed7aa" stroke="#ea580c"/>'),
    svg('<rect width="400" height="300" fill="#fff7ed"/><path d="M60 240 L100 160 L160 220 L200 120 L260 200 L320 100 L360 180" stroke="#ea580c" stroke-width="2" fill="none"/>'),
  ],
  log106:[
    svg('<rect width="400" height="300" fill="#f0fdf4"/><rect x="152" y="56" width="96" height="188" rx="44" fill="#bbf7d0" stroke="#16a34a"/><text x="200" y="270" fill="#15803d" font-size="12" text-anchor="middle" font-family="sans-serif">Cup Haptics</text>'),
    svg('<rect width="400" height="300" fill="#f0fdf4"/><circle cx="200" cy="140" r="82" fill="#dcfce7" stroke="#16a34a"/><text x="200" y="145" fill="#15803d" font-size="12" text-anchor="middle" font-family="sans-serif">ロゴ触感</text>'),
    svg('<rect width="400" height="300" fill="#f0fdf4"/><rect x="72" y="52" width="256" height="208" rx="10" fill="#dcfce7" stroke="#86efac"/>'),
  ],
};

const PROJECT_COVERS = {
  p1: svg('<rect width="400" height="200" fill="#dbeafe"/><path d="M40 140 Q120 60 200 100 Q280 140 360 80" stroke="#2563eb" stroke-width="2" fill="none"/><circle cx="200" cy="100" r="50" fill="#bfdbfe" stroke="#3b82f6"/><text x="200" y="98" fill="#1d4ed8" font-size="14" text-anchor="middle" font-family="sans-serif" font-weight="600">Porsche 911</text><text x="200" y="116" fill="#3b82f6" font-size="9" text-anchor="middle" font-family="sans-serif">SENSORY STUDY</text>'),
  p2: svg('<rect width="400" height="200" fill="#fff7ed"/><rect x="60" y="28" width="280" height="144" rx="10" fill="#fed7aa"/><rect x="80" y="48" width="80" height="100" rx="5" fill="#fdba74"/><rect x="172" y="48" width="60" height="48" rx="4" fill="#bbf7d0"/><rect x="172" y="100" width="60" height="48" rx="4" fill="#dcfce7"/><text x="200" y="188" fill="#9a3412" font-size="11" text-anchor="middle" font-family="sans-serif">Café UI Observation</text>'),
  p3: svg('<rect width="400" height="200" fill="#eff6ff"/><rect x="100" y="40" width="60" height="100" rx="5" fill="#bfdbfe"/><rect x="240" y="40" width="60" height="100" rx="5" fill="#bfdbfe"/><line x1="0" y1="90" x2="400" y2="90" stroke="#3b82f6" stroke-width="2" stroke-dasharray="20 10"/>'),
};

function getImgs(logId) {
  return LOG_IMAGES[logId] || [svg('<rect width="400" height="300" fill="#f0f2f8"/><text x="200" y="155" fill="#8b92b0" font-size="13" text-anchor="middle" font-family="sans-serif">No Image</text>')];
}

/* ═══════════════════════════════════════════  DEMO DATA */
const DEMO_PROJECTS = [
  {
    id:"p1", name:"ポルシェ試乗体験", date:"2025-06-10", coverImage: null,
    logs:[
      { id:"log001", category:"design",      thumbnailIdx:0, content:"ドアを開けた瞬間のアルミフレームの質感と重さ",          emotions:["感動","わくわく"], score:85,  memo:"ドアのヒンジ部分の精度が異常に高く、「カチッ」という閉まり方に職人的なこだわりを感じた。素材の冷たさと滑らかさが手のひらに記憶される感覚。", datetime:"2025-06-10T10:15:00.000Z", images:[] },
      { id:"log002", category:"experience",  thumbnailIdx:1, content:"アクセルを踏んだ瞬間のレスポンスと加速感",                emotions:["興奮"],           score:95,  memo:"0–100km/hが体感3秒程度。身体がシートに押し付けられる感覚は恐怖に近いが、それが快感に変わる瞬間がある。", datetime:"2025-06-10T10:42:00.000Z", images:[] },
      { id:"log003", category:"design",      thumbnailIdx:0, content:"コックピットのアナログとデジタルの混在デザイン",          emotions:["わくわく","感動"], score:72,  memo:"中央のタコメーターのみアナログで残し、他はデジタル化。この意図的な「アナログの残留」がドライバーを感情的に繋ぎとめているように感じた。", datetime:"2025-06-10T11:05:00.000Z", images:[] },
      { id:"log004", category:"experience",  thumbnailIdx:2, content:"カーブでのグリップ感と路面インフォメーション",            emotions:["安心"],           score:60,  memo:"ステアリングから路面の凹凸が「語りかけてくる」感じ。車と対話しているような感覚。これが信頼感・安心感に繋がる。", datetime:"2025-06-10T11:30:00.000Z", images:[] },
      { id:"log005", category:"observation", thumbnailIdx:0, content:"同乗スタッフが一切説明せず運転者の反応を静かに観察",      emotions:["驚き"],           score:45,  memo:"通常の試乗では説明過多になりがちだが、ポルシェのスタッフは沈黙を戦略的に使っていた。体験を自分の言葉で解釈させる時間を与えることで、感情の解像度が上がる設計に見えた。", datetime:"2025-06-10T11:50:00.000Z", images:[] },
      { id:"log006", category:"experience",  thumbnailIdx:1, content:"試乗後の降車時、ドアを閉める手に「また乗りたい」感覚",   emotions:["物足りない"],     score:-20, memo:"体験の終わりをデザインするという観点が面白い。降車〜鍵返却のフローが唐突で、余韻を壊している。", datetime:"2025-06-10T12:10:00.000Z", images:[] },
      { id:"log007", category:"observation", thumbnailIdx:2, content:"隣の客が試乗前にスマホで写真を何枚も撮っていた",         emotions:["わくわく"],       score:30,  memo:"車への期待値の高さが写真行動に現れている。「乗る前から体験は始まっている」ことを再認識。", datetime:"2025-06-10T09:50:00.000Z", images:[] },
    ],
  },
  {
    id:"p2", name:"カフェのUI観察", date:"2025-06-08", coverImage: null,
    logs:[
      { id:"log101", category:"observation", thumbnailIdx:0, content:"注文端末の前で3分以上立ち止まる高齢女性",              emotions:["困惑","やるせない"], score:-60, memo:"タッチパネルの文字サイズが小さく、カテゴリ階層が深すぎる。スタッフが2回声をかけて結局口頭で注文した。", datetime:"2025-06-08T09:20:00.000Z", images:[] },
      { id:"log102", category:"experience",  thumbnailIdx:1, content:"コーヒー受け取り口のサイネージの情報密度が高すぎる",    emotions:["困惑"],             score:-40, memo:"メニュー情報・番号呼び出し・店舗SNS・フェアの告知が同一画面に同居。視線の優先度がデザインされていない。", datetime:"2025-06-08T09:45:00.000Z", images:[] },
      { id:"log103", category:"observation", thumbnailIdx:0, content:"若い男性がモバイルオーダーで先に番号を持って入店",      emotions:["安心"],             score:55,  memo:"モバイルオーダー利用者の動線と通常注文者の動線が交差して混雑している。空間設計がUIの変化に追いついていない。", datetime:"2025-06-08T10:10:00.000Z", images:[] },
      { id:"log104", category:"design",      thumbnailIdx:2, content:"カウンター天板のタイル素材と照明の組み合わせ",          emotions:["わくわく","感動"],   score:70,  memo:"テラコッタ調タイルにペンダントライトの温かい光が反射して美しい。このエリアだけ別世界のような心地よさがある。", datetime:"2025-06-08T10:30:00.000Z", images:[] },
      { id:"log105", category:"observation", thumbnailIdx:1, content:"グループ客4人が席を探して3周した後、諦めて帰った",      emotions:["やるせない","不満"], score:-75, memo:"4人席が1つもなく、2人席を2つ繋げようとしたが固定されていた。混雑時の席割りをUIで見せる仕組みがあれば防げた事象。", datetime:"2025-06-08T11:00:00.000Z", images:[] },
      { id:"log106", category:"experience",  thumbnailIdx:0, content:"カップのサイズ感と持ちやすさ、ロゴの触感",              emotions:["満足"],             score:65,  memo:"紙カップのエンボス加工されたロゴが指に引っかかる感触が好印象。ブランドを「触覚」で伝えるという発想が面白い。", datetime:"2025-06-08T10:50:00.000Z", images:[] },
    ],
  },
  { id:"p3", name:"駅ホームの案内UX", date:"2025-06-05", coverImage: null, logs:[] },
];

/* ═══════════════════════════════════════════  HELPERS */
function uid() { return Math.random().toString(36).slice(2,9); }
function fmt(iso) {
  const d = new Date(iso);
  return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}
function thumbOf(log) {
  const imgs = (log.images && log.images.length) ? log.images : getImgs(log.id);
  return imgs[log.thumbnailIdx] || imgs[0];
}
function scoreCol(s) { return s > 0 ? T.pos : s < 0 ? T.neg : T.neu; }

/* ═══════════════════════════════════════════  ATOMS */
function Pill({ cat, size=11 }) {
  const c = CAT[cat];
  return (
    <span style={{ padding:`3px ${size<12?8:10}px`, borderRadius:20, fontSize:size, fontWeight:600,
      background:c.light, color:c.color, border:`1px solid ${c.border}` }}>
      {c.label}
    </span>
  );
}

function ScoreTag({ score }) {
  const col = scoreCol(score);
  const bg  = score>0 ? T.posL : score<0 ? T.negL : "#6b728018";
  return (
    <span style={{ fontSize:13, fontWeight:700, color:col, background:bg,
      padding:"2px 8px", borderRadius:8 }}>
      {score>0?"+":""}{score}
    </span>
  );
}

function ScoreBar({ score }) {
  const col = scoreCol(score);
  return (
    <div style={{ background:T.bg2, borderRadius:12, padding:"12px 16px", display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:11, color:T.txt2, marginBottom:6, fontWeight:500 }}>感情スコア</div>
        <div style={{ height:6, borderRadius:3, background:T.bg3 }}>
          <div style={{ height:"100%", borderRadius:3, background:col,
            width:`${((score+100)/200)*100}%`, transition:"width .3s" }} />
        </div>
      </div>
      <span style={{ fontSize:26, fontWeight:700, color:col }}>{score>0?"+":""}{score}</span>
    </div>
  );
}

function Slider({ value, onChange }) {
  const col = scoreCol(value);
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.txt2, marginBottom:8 }}>
        <span>−100</span>
        <span style={{ color:col, fontSize:22, fontWeight:700 }}>{value>0?"+":""}{value}</span>
        <span>+100</span>
      </div>
      <input type="range" min={-100} max={100} value={value}
        onChange={e=>onChange(Number(e.target.value))}
        style={{ width:"100%", cursor:"pointer" }} />
    </div>
  );
}

function Modal({ children, onClose, wide }) {
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()} style={{
      position:"fixed", inset:0, zIndex:60, background:"rgba(30,29,60,0.45)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      backdropFilter:"blur(6px)" }}>
      <div style={{ width:"100%", maxWidth: wide ? 600 : 500, maxHeight:"94vh", overflowY:"auto",
        background:T.bg1, borderRadius:"24px 24px 0 0", position:"relative",
        boxShadow:"0 -8px 40px rgba(91,106,240,0.15)", border:`1px solid ${T.line}` }}>
        <div style={{ position:"sticky", top:0, background:T.bg1, paddingTop:12, paddingBottom:4,
          display:"flex", justifyContent:"center", zIndex:1 }}>
          <div style={{ width:40, height:4, borderRadius:2, background:T.line }} />
        </div>
        <button onClick={onClose} style={{ position:"absolute", top:14, right:16,
          background:T.bg2, border:`1px solid ${T.line}`, borderRadius:"50%", width:32, height:32,
          display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
          <X size={14} color={T.txt2} />
        </button>
        {children}
      </div>
    </div>
  );
}

function inp(extra={}) {
  return { width:"100%", borderRadius:10, padding:"10px 13px", fontSize:13,
    background:T.bg2, color:T.txt0, border:`1.5px solid ${T.line}`,
    outline:"none", boxSizing:"border-box", transition:"border-color .2s", ...extra };
}

function Label({ children }) {
  return <div style={{ fontSize:11, fontWeight:600, color:T.txt2, marginBottom:7,
    letterSpacing:"0.04em", textTransform:"uppercase" }}>{children}</div>;
}

/* ═══════════════════════════════════════════  IMAGE UPLOAD BUTTONS */
function ImageUploadButtons({ onFiles }) {
  const galleryRef = useRef(null);
  const cameraRef  = useRef(null);
  const readFiles  = e => {
    Array.from(e.target.files).forEach(file => {
      const r = new FileReader();
      r.onload = ev => onFiles(ev.target.result);
      r.readAsDataURL(file);
    });
  };
  return (
    <div style={{ display:"flex", gap:8 }}>
      {/* Camera — direct capture */}
      <button onClick={()=>cameraRef.current?.click()}
        style={{ flex:1, padding:"9px 0", borderRadius:10, background:T.accentL,
          border:`1.5px solid ${T.accentB}`, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          color:T.accent, fontSize:12, fontWeight:600 }}>
        <Camera size={14}/> カメラで撮影
      </button>
      {/* Gallery — file picker */}
      <button onClick={()=>galleryRef.current?.click()}
        style={{ flex:1, padding:"9px 0", borderRadius:10, background:T.bg2,
          border:`1.5px solid ${T.line}`, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          color:T.txt1, fontSize:12, fontWeight:600 }}>
        <Image size={14}/> フォルダから選択
      </button>
      <input ref={cameraRef}  type="file" accept="image/*" capture="environment" onChange={readFiles} style={{ display:"none" }} />
      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={readFiles} style={{ display:"none" }} />
    </div>
  );
}

/* ═══════════════════════════════════════════  LOG FORM */
function LogForm({ initial, allContents, onSubmit, onCancel }) {
  const [f, setF] = useState(() => {
    if (initial) return { ...initial, datetime:initial.datetime.slice(0,16), emotions:initial.emotions||[], images:initial.images||[], freeInput:"" };
    return { category:"design", content:"", score:0, emotions:[], freeInput:"", memo:"", thumbnailIdx:0, datetime:new Date().toISOString().slice(0,16), images:[] };
  });
  const [suggest, setSuggest] = useState([]);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const c = CAT[f.category];

  const handleContent = v => {
    set("content",v);
    setSuggest(v.length>1 ? allContents.filter(c=>c!==v&&c.includes(v)).slice(0,3) : []);
  };
  const toggleEmotion = w => setF(p=>({ ...p, emotions:p.emotions.includes(w)?p.emotions.filter(e=>e!==w):[...p.emotions,w] }));
  const addFree = () => {
    const v=(f.freeInput||"").trim();
    if(!v) return;
    if(!f.emotions.includes(v)) setF(p=>({...p,emotions:[...p.emotions,v],freeInput:""}));
    else set("freeInput","");
  };
  const removeImg = i => setF(p => {
    const images = p.images.filter((_,j)=>j!==i);
    return {...p, images, thumbnailIdx:Math.min(p.thumbnailIdx, Math.max(0,images.length-1))};
  });
  const submit = () => {
    if(!f.content.trim()) return;
    const { freeInput, ...rest } = f;
    onSubmit({ ...rest, id:f.id||uid(), datetime:new Date(f.datetime).toISOString() });
  };

  return (
    <div style={{ padding:"8px 20px 28px" }}>
      <h2 style={{ fontSize:17, fontWeight:700, color:T.txt0, marginBottom:20 }}>
        {initial?"ログを編集":"新規ログを記録"}
      </h2>

      {/* Category */}
      <Label>カテゴリ</Label>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:20 }}>
        {Object.values(CAT).map(cat=>(
          <button key={cat.key} onClick={()=>set("category",cat.key)} style={{
            padding:"10px 0", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer",
            background:f.category===cat.key?cat.light:T.bg2,
            color:f.category===cat.key?cat.color:T.txt2,
            border:`1.5px solid ${f.category===cat.key?cat.border:T.line}`,
            transition:"all .15s" }}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <Label>内容 *</Label>
      <div style={{ position:"relative", marginBottom:18 }}>
        <textarea value={f.content} onChange={e=>handleContent(e.target.value)}
          placeholder="気づいた内容を入力…" rows={2}
          style={{ ...inp({ resize:"none", display:"block" }) }} />
        {suggest.length>0&&(
          <div style={{ position:"absolute", width:"100%", background:T.bg1, border:`1px solid ${T.line}`,
            borderRadius:10, zIndex:10, top:"100%", marginTop:2, boxShadow:T.shadow }}>
            {suggest.map((s,i)=>(
              <button key={i} onClick={()=>{set("content",s);setSuggest([]);}}
                style={{ display:"block", width:"100%", textAlign:"left", padding:"9px 13px",
                  color:T.txt1, fontSize:12, background:"none", border:"none", cursor:"pointer",
                  borderBottom:i<suggest.length-1?`1px solid ${T.line}`:"none" }}>{s}</button>
            ))}
          </div>
        )}
      </div>

      {/* Images */}
      <Label>写真</Label>
      <div style={{ marginBottom:12 }}>
        <ImageUploadButtons onFiles={src=>setF(p=>({...p,images:[...p.images,src]}))} />
      </div>
      {f.images.length>0&&(
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
          {f.images.map((src,i)=>(
            <div key={i} style={{ position:"relative" }}>
              <img src={src} alt="" onClick={()=>set("thumbnailIdx",i)}
                style={{ width:70, height:70, objectFit:"cover", borderRadius:10, display:"block",
                  cursor:"pointer", border:`2px solid ${i===f.thumbnailIdx?c.color:T.line}`,
                  boxShadow:i===f.thumbnailIdx?`0 0 0 3px ${c.border}`:undefined }} />
              <button onClick={()=>removeImg(i)} style={{ position:"absolute", top:-5, right:-5,
                width:18, height:18, borderRadius:"50%", background:"#dc2626", border:"none",
                cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <X size={9} color="white" />
              </button>
              {i===f.thumbnailIdx&&(
                <div style={{ position:"absolute", bottom:-6, left:"50%", transform:"translateX(-50%)",
                  background:c.color, borderRadius:4, padding:"1px 5px", fontSize:8, color:"white", whiteSpace:"nowrap" }}>
                  メイン
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Score */}
      <Label>感情スコア</Label>
      <div style={{ marginBottom:20 }}><Slider value={f.score} onChange={v=>set("score",v)} /></div>

      {/* Emotion tags */}
      <Label>感情ワード（複数可）</Label>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:10 }}>
        {EMOTION_WORDS.map(w=>{
          const sel=f.emotions.includes(w);
          return (
            <button key={w} onClick={()=>toggleEmotion(w)} style={{
              padding:"5px 11px", borderRadius:20, fontSize:12, cursor:"pointer",
              background:sel?c.light:T.bg2, color:sel?c.color:T.txt2,
              border:`1.5px solid ${sel?c.border:T.line}`, fontWeight:sel?600:400,
              transition:"all .15s" }}>{w}</button>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:f.emotions.length?10:18 }}>
        <input value={f.freeInput||""} onChange={e=>set("freeInput",e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&addFree()}
          placeholder="自由記述（例: じんわり）"
          style={{ ...inp({ flex:1, marginBottom:0 }) }} />
        <button onClick={addFree} style={{ padding:"10px 14px", borderRadius:10, background:c.light,
          color:c.color, border:`1.5px solid ${c.border}`, cursor:"pointer",
          fontSize:12, fontWeight:700, whiteSpace:"nowrap" }}>追加</button>
      </div>
      {f.emotions.length>0&&(
        <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:16,
          padding:"10px 12px", background:T.bg2, borderRadius:10 }}>
          {f.emotions.map((e,i)=>(
            <span key={i} style={{ display:"flex", alignItems:"center", gap:4, padding:"4px 9px",
              background:c.light, color:c.color, borderRadius:14, fontSize:11, fontWeight:600 }}>
              {e}
              <button onClick={()=>toggleEmotion(e)}
                style={{ background:"none", border:"none", cursor:"pointer", color:c.color, padding:0, display:"flex" }}>
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Memo */}
      <Label>詳細メモ</Label>
      <textarea value={f.memo} onChange={e=>set("memo",e.target.value)}
        placeholder="なぜそう感じたかの考察…" rows={3}
        style={{ ...inp({ resize:"none", marginBottom:18, display:"block" }) }} />

      {/* Datetime */}
      <Label><span style={{ display:"flex", alignItems:"center", gap:4 }}><Clock size={11}/>記録日時</span></Label>
      <input type="datetime-local" value={f.datetime} onChange={e=>set("datetime",e.target.value)}
        style={{ ...inp({ marginBottom:22 }) }} />

      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onCancel} style={{ flex:1, padding:"12px 0", borderRadius:12,
          background:T.bg2, color:T.txt2, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13 }}>
          キャンセル
        </button>
        <button onClick={submit} style={{ flex:1, padding:"12px 0", borderRadius:12,
          background:c.color, color:"white", border:"none", cursor:"pointer",
          fontSize:13, fontWeight:700, boxShadow:`0 4px 14px ${c.color}40` }}>
          {initial?"更新する":"記録する"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════  DETAIL MODAL */
function DetailModal({ log, onClose, onEdit, onDelete }) {
  const c = CAT[log.category];
  const imgs = (log.images&&log.images.length) ? log.images : getImgs(log.id);
  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding:"8px 22px 28px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
          <Pill cat={log.category} />
          <span style={{ color:T.txt2, fontSize:11 }}>{fmt(log.datetime)}</span>
        </div>

        {/* Images — large */}
        {imgs.length > 0 && (
          <div style={{ display:"flex", gap:10, marginBottom:20, overflowX:"auto" }}>
            {imgs.slice(0,3).map((src,i)=>(
              <div key={i} style={{ position:"relative", flexShrink:0 }}>
                <img src={src} alt="" style={{ width:120, height:120, objectFit:"cover", borderRadius:14, display:"block",
                  border:`2px solid ${i===log.thumbnailIdx?c.color:T.line}` }} />
                {i===log.thumbnailIdx&&(
                  <div style={{ position:"absolute", top:-5, right:-5, width:20, height:20,
                    borderRadius:"50%", background:c.color, display:"flex", alignItems:"center", justifyContent:"center",
                    boxShadow:`0 2px 8px ${c.color}60` }}>
                    <Check size={11} color="white" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <p style={{ color:T.txt0, fontWeight:600, fontSize:15, marginBottom:10, lineHeight:1.5 }}>
          {log.content}
        </p>

        {log.emotions&&log.emotions.length>0&&(
          <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:12 }}>
            {log.emotions.map((e,i)=>(
              <span key={i} style={{ padding:"3px 9px", background:c.light, color:c.color,
                borderRadius:12, fontSize:11, fontWeight:600 }}>「{e}」</span>
            ))}
          </div>
        )}

        {log.memo&&(
          <p style={{ color:T.txt1, fontSize:13, lineHeight:1.75, marginBottom:18,
            borderLeft:`3px solid ${c.border}`, paddingLeft:12 }}>
            {log.memo}
          </p>
        )}
        <div style={{ marginBottom:20 }}><ScoreBar score={log.score} /></div>

        <div style={{ display:"flex", gap:8 }}>
          <button onClick={()=>onEdit(log)} style={{ flex:1, padding:"11px 0", borderRadius:12,
            background:T.bg2, color:T.txt0, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13, fontWeight:600,
            display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
            <Edit2 size={13}/> 編集
          </button>
          <button onClick={()=>{onDelete(log.id);onClose();}} style={{ padding:"11px 16px",
            borderRadius:12, background:T.negL, color:T.neg, border:`1px solid #dc262630`, cursor:"pointer" }}>
            <Trash2 size={14}/>
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════  PROJECT EDIT MODAL */
function ProjectEditModal({ project, onSave, onClose }) {
  const [name, setName] = useState(project.name);
  const [cover, setCover] = useState(project.coverImage || null);
  const fileRef = useRef(null);
  const camRef  = useRef(null);

  const readFile = e => {
    const file = e.target.files[0];
    if(!file) return;
    const r = new FileReader();
    r.onload = ev => setCover(ev.target.result);
    r.readAsDataURL(file);
  };

  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding:"8px 22px 28px" }}>
        <h2 style={{ fontSize:17, fontWeight:700, color:T.txt0, marginBottom:20 }}>
          プロジェクトを編集
        </h2>

        <Label>プロジェクト名</Label>
        <input value={name} onChange={e=>setName(e.target.value)}
          placeholder="プロジェクト名" style={{ ...inp({ marginBottom:20 }) }} />

        <Label>カバー画像</Label>
        {cover && (
          <div style={{ position:"relative", marginBottom:12, display:"inline-block" }}>
            <img src={cover} alt="" style={{ width:"100%", height:140, objectFit:"cover",
              borderRadius:14, display:"block", border:`1px solid ${T.line}` }} />
            <button onClick={()=>setCover(null)} style={{ position:"absolute", top:8, right:8,
              background:"rgba(0,0,0,0.5)", border:"none", borderRadius:"50%", width:26, height:26,
              display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
              <X size={12} color="white" />
            </button>
          </div>
        )}
        <div style={{ marginBottom:24 }}>
          <ImageUploadButtons onFiles={src=>setCover(src)} />
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"12px 0", borderRadius:12,
            background:T.bg2, color:T.txt2, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13 }}>
            キャンセル
          </button>
          <button onClick={()=>{ if(name.trim()) onSave(name.trim(), cover); }}
            style={{ flex:1, padding:"12px 0", borderRadius:12, background:T.accent,
              color:"white", border:"none", cursor:"pointer", fontSize:13, fontWeight:700,
              boxShadow:`0 4px 14px ${T.accent}40` }}>
            保存する
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════  JOURNEY DOT */
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
      {label&&(
        <g>
          <rect x={cx-lw/2} y={cy-54} width={lw} height={22} rx={11}
            fill={cc.light} stroke={cc.border} strokeWidth={1.5}/>
          <text x={cx} y={cy-39} textAnchor="middle"
            style={{ fontSize:9, fill:cc.color, fontWeight:"700", fontFamily:"sans-serif" }}>
            {label}
          </text>
          <polygon points={`${cx-4},${cy-32} ${cx+4},${cy-32} ${cx},${cy-22}`}
            fill={cc.light} stroke={cc.border} strokeWidth={1}/>
        </g>
      )}
      {isHov&&<circle cx={cx} cy={cy} r={22} fill={cc.light} stroke={cc.border} strokeWidth={1.5}/>}
      <circle cx={cx} cy={cy} r={isHov?14:10} fill={cc.light} stroke={cc.color} strokeWidth={2}/>
      <circle cx={cx} cy={cy} r={isHov?7:4.5} fill={cc.color}/>
      {isHov&&thumb&&(
        <foreignObject x={cx-40} y={cy+22} width={80} height={80} style={{ overflow:"visible" }}>
          <img src={thumb} alt="" style={{ width:78, height:78, objectFit:"cover",
            borderRadius:10, display:"block", border:`2px solid ${cc.color}`,
            boxShadow:"0 4px 16px rgba(0,0,0,0.2)" }}/>
        </foreignObject>
      )}
    </g>
  );
}

/* ═══════════════════════════════════════════  JOURNEY MAP */
function JourneyMap({ logs, onClickLog }) {
  const [view, setView] = useState("self");
  const [hoveredId, setHoveredId] = useState(null);
  const sorted = [...logs].sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
  const dData = sorted.filter(l=>l.category==="design").map(l=>({...l,time:fmt(l.datetime)}));
  const eData = sorted.filter(l=>l.category==="experience").map(l=>({...l,time:fmt(l.datetime)}));
  const oData = sorted.filter(l=>l.category==="observation").map(l=>({...l,time:fmt(l.datetime)}));
  const dotP = { onClickLog, hoveredId, setHoveredId };
  const rd = p => <JourneyDot {...p} {...dotP}/>;
  const tt = {
    contentStyle:{ background:T.bg1, border:`1px solid ${T.line}`, borderRadius:10,
      fontSize:12, color:T.txt1, boxShadow:T.shadow },
    labelStyle:{ color:T.txt2, fontSize:10 },
  };

  return (
    <div style={{ paddingTop:8 }}>
      <div style={{ display:"flex", background:T.bg2, borderRadius:12, padding:4, marginBottom:22,
        border:`1px solid ${T.line}` }}>
        {[["self","自己体験"],["obs","他者観察"]].map(([k,label])=>(
          <button key={k} onClick={()=>setView(k)} style={{
            flex:1, padding:"9px 0", borderRadius:9, fontSize:12, fontWeight:600, cursor:"pointer",
            background:view===k?T.bg1:"transparent",
            color:view===k?T.txt0:T.txt2,
            border:view===k?`1px solid ${T.line}`:"1px solid transparent",
            boxShadow:view===k?T.shadow:"none", transition:"all .2s" }}>
            {label}
          </button>
        ))}
      </div>

      {view==="self"&&(dData.length<2&&eData.length<2?<EmptyChart/>:(
        <div style={{ height:340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top:72, right:20, left:-24, bottom:8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false}/>
              <ReferenceLine y={0} stroke={T.lineA} strokeWidth={1.5}/>
              <XAxis dataKey="time" type="category" allowDuplicatedCategory={false}
                tick={{ fill:T.txt2, fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[-100,100]} tick={{ fill:T.txt2, fontSize:10 }}
                axisLine={false} tickLine={false}/>
              <Tooltip {...tt} formatter={(v,n)=>[`${v>0?"+":""}${v}`,n]}/>
              {dData.length>=2&&<Line data={dData} type="monotone" dataKey="score"
                stroke={CAT.design.color} strokeWidth={2} name="Design" dot={rd} activeDot={false}/>}
              {eData.length>=2&&<Line data={eData} type="monotone" dataKey="score"
                stroke={CAT.experience.color} strokeWidth={2} name="Experience" dot={rd} activeDot={false}/>}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
      {view==="obs"&&(oData.length<2?<EmptyChart/>:(
        <div style={{ height:340 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={oData} margin={{ top:72, right:20, left:-24, bottom:8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false}/>
              <ReferenceLine y={0} stroke={T.lineA} strokeWidth={1.5}/>
              <XAxis dataKey="time" tick={{ fill:T.txt2, fontSize:10 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[-100,100]} tick={{ fill:T.txt2, fontSize:10 }} axisLine={false} tickLine={false}/>
              <Tooltip {...tt} formatter={(v,n)=>[`${v>0?"+":""}${v}`,n]}/>
              <Line type="monotone" dataKey="score" stroke={CAT.observation.color}
                strokeWidth={2} name="Observation" dot={rd} activeDot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
      {view==="self"&&(
        <div style={{ display:"flex", justifyContent:"center", gap:20, marginTop:12 }}>
          {["design","experience"].map(k=>(
            <div key={k} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, color:T.txt2 }}>
              <div style={{ width:20, height:2.5, borderRadius:2, background:CAT[k].color }}/>
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
      justifyContent:"center", height:200, gap:12 }}>
      <BarChart2 size={40} strokeWidth={1} color={T.txt2}/>
      <p style={{ fontSize:12, color:T.txt2 }}>ログを2件以上追加するとグラフが表示されます</p>
    </div>
  );
}

/* ═══════════════════════════════════════════  MINI CHART */
function MiniChart({ data, color }) {
  if (data.length<2) return (
    <div style={{ height:110, display:"flex", alignItems:"center", justifyContent:"center",
      color:T.txt2, fontSize:11 }}>データ不足（2件以上必要）</div>
  );
  return (
    <div style={{ height:130 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:8, right:8, left:-34, bottom:4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false}/>
          <ReferenceLine y={0} stroke={T.lineA} strokeWidth={1}/>
          <XAxis dataKey="time" tick={{ fill:T.txt2, fontSize:9 }} axisLine={false} tickLine={false}/>
          <YAxis domain={[-100,100]} tick={{ fill:T.txt2, fontSize:9 }} axisLine={false} tickLine={false}/>
          <Line type="monotone" dataKey="score" stroke={color} strokeWidth={2}
            dot={{ r:3, fill:color, strokeWidth:0 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ═══════════════════════════════════════════  REPORT */
function Report({ project, logs }) {
  const sorted = [...logs].sort((a,b)=>new Date(a.datetime)-new Date(b.datetime));
  const selfData = sorted.filter(l=>l.category!=="observation").map(l=>({...l,time:fmt(l.datetime)}));
  const obsData  = sorted.filter(l=>l.category==="observation").map(l=>({...l,time:fmt(l.datetime)}));
  const reportRef = useRef(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  const loadScript = (src, check) => new Promise((res,rej)=>{
    if(check()) return res();
    const s=document.createElement("script"); s.src=src; s.onload=res; s.onerror=rej;
    document.head.appendChild(s);
  });

  const handlePDF = async () => {
    if(!reportRef.current) return;
    setPdfLoading(true);
    try {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", ()=>!!window.html2canvas);
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", ()=>!!(window.jspdf&&window.jspdf.jsPDF));
      const el = reportRef.current;
      const canvas = await window.html2canvas(el, { backgroundColor:"#ffffff", scale:2, useCORS:true, allowTaint:true, logging:false, width:el.scrollWidth, height:el.scrollHeight, windowWidth:el.scrollWidth });
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pw=pdf.internal.pageSize.getWidth(), ph=pdf.internal.pageSize.getHeight();
      const iw=pw, ih=(canvas.height*iw)/canvas.width;
      let rem=ih, page=0;
      while(rem>0){
        if(page>0) pdf.addPage();
        const sh=Math.min(ph,rem), sy=page*(canvas.height/ih)*ph, shpx=sh*(canvas.height/ih);
        const pc=document.createElement("canvas"); pc.width=canvas.width; pc.height=Math.ceil(shpx);
        pc.getContext("2d").drawImage(canvas,0,sy,canvas.width,shpx,0,0,canvas.width,shpx);
        pdf.addImage(pc.toDataURL("image/png"),"PNG",0,0,iw,sh);
        rem-=sh; page++;
      }
      pdf.save(`QUALIA_${project.name}_${new Date().toLocaleDateString("ja-JP").replace(/\//g,"-")}.pdf`);
    } catch(e){ alert("PDF生成エラー: "+e.message); }
    finally{ setPdfLoading(false); }
  };

  return (
    <div style={{ paddingBottom:20 }}>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button onClick={handlePDF} disabled={pdfLoading} style={{
          display:"flex", alignItems:"center", gap:7, padding:"9px 16px", borderRadius:10,
          fontSize:12, fontWeight:600, cursor:pdfLoading?"not-allowed":"pointer",
          background:pdfLoading?T.bg2:T.accentL, color:pdfLoading?T.txt2:T.accent,
          border:`1px solid ${pdfLoading?T.line:T.accentB}`, transition:"all .2s" }}>
          <Download size={13}/> {pdfLoading?"生成中…":"PDF出力"}
        </button>
      </div>

      <div ref={reportRef} style={{ background:"#ffffff", padding:20, borderRadius:16, border:`1px solid ${T.line}` }}>
        {/* Header */}
        <div style={{ paddingBottom:18, borderBottom:`1px solid ${T.line}`, marginBottom:20 }}>
          <p style={{ fontSize:10, color:T.txt2, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:4 }}>
            QUALIA · Field Research Report
          </p>
          <h1 style={{ fontSize:20, fontWeight:700, color:T.txt0, marginBottom:4 }}>{project.name}</h1>
          <p style={{ fontSize:11, color:T.txt2 }}>{new Date().toLocaleDateString("ja-JP")} · {logs.length}件</p>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:24 }}>
          {Object.values(CAT).map(cat=>{
            const cl=logs.filter(l=>l.category===cat.key);
            const avg=cl.length?Math.round(cl.reduce((a,l)=>a+l.score,0)/cl.length):"–";
            return (
              <div key={cat.key} style={{ padding:"14px 12px", borderRadius:12,
                background:cat.light, border:`1px solid ${cat.border}` }}>
                <p style={{ fontSize:10, fontWeight:700, color:cat.color, marginBottom:5,
                  letterSpacing:"0.05em" }}>{cat.label}</p>
                <p style={{ fontSize:28, fontWeight:700, color:T.txt0, lineHeight:1 }}>{cl.length}</p>
                <p style={{ fontSize:10, color:T.txt2, marginTop:5 }}>avg {avg}</p>
              </div>
            );
          })}
        </div>

        {/* Maps */}
        {[["自己体験マップ", selfData, CAT.design.color],["他者観察マップ", obsData, CAT.observation.color]].map(([title, data, color])=>(
          <div key={title} style={{ marginBottom:24 }}>
            <h3 style={{ fontSize:13, fontWeight:700, color:T.txt0, display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:4, height:16, borderRadius:2, background:color }}/>
              {title}
            </h3>
            <div style={{ background:T.bg2, borderRadius:12, padding:"12px 8px", border:`1px solid ${T.line}` }}>
              <MiniChart data={data} color={color}/>
            </div>
          </div>
        ))}

        {/* Logs — full text, no truncation */}
        {Object.values(CAT).map(cat=>{
          const cl=sorted.filter(l=>l.category===cat.key);
          if(!cl.length) return null;
          return (
            <div key={cat.key} style={{ marginBottom:24 }}>
              <h3 style={{ fontSize:13, fontWeight:700, color:cat.color, display:"flex",
                alignItems:"center", gap:8, marginBottom:12 }}>
                <div style={{ width:4, height:16, borderRadius:2, background:cat.color }}/>
                {cat.label}
              </h3>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {cl.map(log=>(
                  <div key={log.id} style={{ display:"flex", gap:12, padding:14,
                    borderRadius:12, background:T.bg2, border:`1px solid ${T.line}` }}>
                    <img src={thumbOf(log)} alt="" style={{ width:60, height:60, objectFit:"cover",
                      borderRadius:10, flexShrink:0, border:`1.5px solid ${cat.border}`, display:"block" }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:10, color:T.txt2 }}>{fmt(log.datetime)}</span>
                        <ScoreTag score={log.score}/>
                      </div>
                      {/* Full content — no truncation */}
                      <p style={{ fontSize:13, fontWeight:600, color:T.txt0, marginBottom:4, lineHeight:1.5 }}>
                        {log.content}
                      </p>
                      {log.emotions&&log.emotions.length>0&&(
                        <p style={{ fontSize:11, color:cat.color, marginBottom:4 }}>
                          {log.emotions.map(e=>`「${e}」`).join(" ")}
                        </p>
                      )}
                      {/* Full memo — no truncation */}
                      {log.memo&&(
                        <p style={{ fontSize:12, color:T.txt1, lineHeight:1.7 }}>
                          {log.memo}
                        </p>
                      )}
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

/* ═══════════════════════════════════════════  DELETE CONFIRM */
function DeleteProjModal({ project, onConfirm, onCancel }) {
  return (
    <Modal onClose={onCancel}>
      <div style={{ padding:"8px 24px 28px", textAlign:"center" }}>
        <div style={{ width:52, height:52, borderRadius:"50%", background:T.negL,
          border:`1px solid #dc262630`, display:"flex", alignItems:"center",
          justifyContent:"center", margin:"8px auto 18px" }}>
          <Trash2 size={22} color={T.neg}/>
        </div>
        <h3 style={{ color:T.txt0, fontWeight:700, fontSize:17, marginBottom:8 }}>
          プロジェクトを削除しますか？
        </h3>
        <p style={{ color:T.txt1, fontSize:13, marginBottom:5 }}>「{project.name}」</p>
        <p style={{ color:T.txt2, fontSize:12, marginBottom:26 }}>
          全ログも削除されます。この操作は取り消せません。
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onCancel} style={{ flex:1, padding:"12px 0", borderRadius:12,
            background:T.bg2, color:T.txt2, border:`1px solid ${T.line}`, cursor:"pointer", fontSize:13 }}>
            キャンセル
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:"12px 0", borderRadius:12,
            background:T.neg, color:"white", border:"none", cursor:"pointer", fontSize:13, fontWeight:700 }}>
            削除する
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════  MAIN APP */
export default function Qualia() {
  const [projects,     setProjects]     = useState(DEMO_PROJECTS);
  const [activeId,     setActiveId]     = useState("p1");
  const [screen,       setScreen]       = useState("logs");
  const [showForm,     setShowForm]     = useState(false);
  const [editingLog,   setEditingLog]   = useState(null);
  const [viewingLog,   setViewingLog]   = useState(null);
  const [showNewProj,  setShowNewProj]  = useState(false);
  const [newProjName,  setNewProjName]  = useState("");
  const [deletingProj, setDeletingProj] = useState(null);
  const [editingProj,  setEditingProj]  = useState(null);

  const proj = projects.find(p=>p.id===activeId);
  const logs = proj?.logs||[];

  const mut = (id,fn) => setProjects(ps=>ps.map(p=>p.id===id?{...p,...fn(p)}:p));
  const addLog    = log => { mut(activeId,p=>({logs:[...p.logs,log]})); setShowForm(false); };
  const updateLog = log => { mut(activeId,p=>({logs:p.logs.map(l=>l.id===log.id?log:l)})); setEditingLog(null); setViewingLog(null); };
  const deleteLog = id  => { mut(activeId,p=>({logs:p.logs.filter(l=>l.id!==id)})); };

  const createProj = () => {
    if(!newProjName.trim()) return;
    const p={id:uid(),name:newProjName,date:new Date().toISOString(),coverImage:null,logs:[]};
    setProjects(ps=>[p,...ps]);
    setNewProjName(""); setShowNewProj(false); setActiveId(p.id); setScreen("logs");
  };
  const confirmDelete = () => {
    setProjects(ps=>ps.filter(p=>p.id!==deletingProj.id));
    if(activeId===deletingProj.id){setActiveId(null);setScreen("home");}
    setDeletingProj(null);
  };
  const saveProjectEdit = (name, coverImage) => {
    setProjects(ps=>ps.map(p=>p.id===editingProj.id?{...p,name,coverImage}:p));
    setEditingProj(null);
  };

  const NAV=[{key:"logs",Icon:BookOpen,label:"Logs"},{key:"journey",Icon:BarChart2,label:"Journey"},{key:"report",Icon:FileText,label:"Report"}];

  const base={background:T.bg0, fontFamily:"'Inter','Noto Sans JP',sans-serif", minHeight:"100vh", color:T.txt0};

  /* ── HOME ─────────────────────────────── */
  if(screen==="home"||!activeId) return (
    <div style={base}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ maxWidth:480, margin:"0 auto", padding:"52px 18px 100px" }}>

        {/* Wordmark */}
        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:36, fontWeight:800, color:T.txt0, letterSpacing:"-0.02em", marginBottom:4 }}>
            QUALIA
          </h1>
          <p style={{ fontSize:13, color:T.txt2, fontWeight:400 }}>Qualitative Field Research Tool</p>
        </div>

        {/* New project input */}
        {showNewProj?(
          <div style={{ background:T.bg1, border:`1.5px solid ${T.accentB}`, borderRadius:16,
            padding:18, marginBottom:20, boxShadow:T.shadowM }}>
            <p style={{ fontSize:11, fontWeight:700, color:T.accent, letterSpacing:"0.08em",
              textTransform:"uppercase", marginBottom:10 }}>新規プロジェクト</p>
            <input value={newProjName} onChange={e=>setNewProjName(e.target.value)}
              placeholder="プロジェクト名" autoFocus onKeyDown={e=>e.key==="Enter"&&createProj()}
              style={{ ...inp({ marginBottom:12 }) }} />
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={()=>setShowNewProj(false)} style={{ flex:1, padding:"10px 0",
                borderRadius:10, background:T.bg2, color:T.txt2, border:`1px solid ${T.line}`,
                cursor:"pointer", fontSize:13 }}>キャンセル</button>
              <button onClick={createProj} style={{ flex:1, padding:"10px 0", borderRadius:10,
                background:T.accent, color:"white", border:"none", cursor:"pointer",
                fontSize:13, fontWeight:700 }}>作成</button>
            </div>
          </div>
        ):(
          <button onClick={()=>setShowNewProj(true)} style={{
            width:"100%", padding:"14px 0", borderRadius:14, marginBottom:24,
            background:T.accentL, color:T.accent, border:`1.5px dashed ${T.accentB}`,
            cursor:"pointer", fontSize:13, fontWeight:600,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Plus size={15}/> 新規プロジェクト
          </button>
        )}

        <p style={{ fontSize:11, fontWeight:700, color:T.txt2, letterSpacing:"0.08em",
          textTransform:"uppercase", marginBottom:14 }}>プロジェクト一覧</p>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {projects.map((p,idx)=>{
            const fallbackCover = PROJECT_COVERS[p.id];
            const userThumb = p.logs.find(l=>l.images&&l.images.length>0);
            const coverSrc = p.coverImage || (userThumb?thumbOf(userThumb):fallbackCover);
            return (
              <div key={p.id} className="q-card"
                style={{ animationDelay:`${idx*0.05}s`, borderRadius:18, overflow:"hidden",
                  background:T.bg1, border:`1px solid ${T.line}`, boxShadow:T.shadow }}>
                {/* Cover image */}
                <div style={{ height:96, overflow:"hidden", position:"relative" }}>
                  {coverSrc&&<img src={coverSrc} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>}
                  {!coverSrc&&<div style={{ width:"100%", height:"100%", background:T.bg2 }}/>}
                  <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 40%,rgba(255,255,255,0.95) 100%)" }}/>
                  {/* Edit & Delete buttons */}
                  <div style={{ position:"absolute", top:8, right:8, display:"flex", gap:6 }}>
                    <button onClick={e=>{e.stopPropagation();setEditingProj(p);}}
                      style={{ width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,0.9)",
                        border:`1px solid ${T.line}`, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:T.shadow }}>
                      <Pencil size={12} color={T.txt1}/>
                    </button>
                    <button onClick={e=>{e.stopPropagation();setDeletingProj(p);}}
                      style={{ width:30, height:30, borderRadius:"50%", background:"rgba(255,255,255,0.9)",
                        border:`1px solid #dc262630`, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:T.shadow }}>
                      <Trash2 size={12} color={T.neg}/>
                    </button>
                  </div>
                  {/* Category badges */}
                  <div style={{ position:"absolute", bottom:8, left:12, display:"flex", gap:5 }}>
                    {Object.values(CAT).map(cat=>{
                      const n=p.logs.filter(l=>l.category===cat.key).length;
                      if(!n) return null;
                      return (
                        <span key={cat.key} style={{ padding:"2px 7px", borderRadius:10,
                          background:cat.light, color:cat.color, border:`1px solid ${cat.border}`,
                          fontSize:9, fontWeight:700 }}>
                          {cat.label[0]} {n}
                        </span>
                      );
                    })}
                  </div>
                </div>
                {/* Info row */}
                <button onClick={()=>{setActiveId(p.id);setScreen("logs");}}
                  style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px",
                    background:"none", border:"none", cursor:"pointer", width:"100%", textAlign:"left" }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:15, fontWeight:700, color:T.txt0, overflow:"hidden",
                      textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</p>
                    <p style={{ fontSize:11, color:T.txt2, marginTop:2 }}>{p.logs.length}件のログ</p>
                  </div>
                  <ChevronRight size={16} color={T.txt2}/>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {deletingProj&&<DeleteProjModal project={deletingProj} onConfirm={confirmDelete} onCancel={()=>setDeletingProj(null)}/>}
      {editingProj&&<ProjectEditModal project={editingProj} onSave={saveProjectEdit} onClose={()=>setEditingProj(null)}/>}
    </div>
  );

  /* ── PROJECT SCREEN ──────────────────── */
  return (
    <div style={base}>
      <style>{GLOBAL_CSS}</style>

      {/* Topbar */}
      <div style={{ position:"sticky", top:0, zIndex:30, padding:"10px 16px",
        display:"flex", alignItems:"center", gap:12,
        background:`${T.bg0}f2`, backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${T.line}` }}>
        <button onClick={()=>{setScreen("home");setActiveId(null);}}
          style={{ width:34, height:34, borderRadius:10, background:T.bg1,
            border:`1px solid ${T.line}`, cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center", boxShadow:T.shadow }}>
          <ChevronLeft size={16} color={T.txt2}/>
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:15, fontWeight:700, color:T.txt0, overflow:"hidden",
            textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{proj?.name}</p>
          <p style={{ fontSize:10, color:T.txt2, fontWeight:500 }}>{logs.length}件のログ</p>
        </div>
        <span style={{ fontSize:14, fontWeight:800, color:T.accent, letterSpacing:"0.04em" }}>QUALIA</span>
        {screen==="logs"&&(
          <button onClick={()=>setShowForm(true)} style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
            borderRadius:10, background:T.accent, color:"white",
            border:"none", cursor:"pointer", fontSize:12, fontWeight:700,
            boxShadow:`0 4px 12px ${T.accent}40` }}>
            <Plus size={13}/> 記録
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth:480, margin:"0 auto", padding:"14px 16px 108px" }}>

        {/* LOG LIST */}
        {screen==="logs"&&(
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {logs.length===0&&(
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                justifyContent:"center", height:260, gap:14 }}>
                <BookOpen size={44} strokeWidth={1} color={T.txt2}/>
                <p style={{ fontSize:13, color:T.txt2, textAlign:"center", lineHeight:2 }}>
                  「記録」ボタンから<br/>最初のログを追加しましょう
                </p>
              </div>
            )}
            {[...logs].reverse().map((log,idx)=>{
              const c = CAT[log.category];
              const imgs = (log.images&&log.images.length)?log.images:getImgs(log.id);
              const mainImg = imgs[log.thumbnailIdx]||imgs[0];
              return (
                <button key={log.id} onClick={()=>setViewingLog(log)}
                  className="q-card"
                  style={{ animationDelay:`${idx*0.04}s`, display:"flex", flexDirection:"column",
                    borderRadius:18, background:T.bg1, border:`1px solid ${T.line}`,
                    cursor:"pointer", textAlign:"left", width:"100%", overflow:"hidden",
                    boxShadow:T.shadow, transition:"box-shadow .2s, transform .2s" }}
                  onMouseEnter={e=>{e.currentTarget.style.boxShadow=T.shadowM;}}
                  onMouseLeave={e=>{e.currentTarget.style.boxShadow=T.shadow;}}>
                  {/* Large image */}
                  <div style={{ width:"100%", height:160, overflow:"hidden", flexShrink:0, position:"relative" }}>
                    <img src={mainImg} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 50%,rgba(255,255,255,0.7) 100%)" }}/>
                    <div style={{ position:"absolute", top:10, left:12 }}>
                      <Pill cat={log.category} size={10}/>
                    </div>
                    <div style={{ position:"absolute", top:10, right:12 }}>
                      <ScoreTag score={log.score}/>
                    </div>
                  </div>
                  {/* Text content */}
                  <div style={{ padding:"12px 14px 14px" }}>
                    <p style={{ fontSize:13, fontWeight:600, color:T.txt0, marginBottom:5, lineHeight:1.4 }}>
                      {log.content}
                    </p>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                      {log.emotions&&log.emotions.length>0?(
                        <p style={{ fontSize:11, color:c.color }}>
                          {log.emotions.slice(0,3).map(e=>`「${e}」`).join(" ")}
                        </p>
                      ):<span/>}
                      <span style={{ fontSize:10, color:T.txt2 }}>{fmt(log.datetime)}</span>
                    </div>
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
        display:"flex", justifyContent:"space-around", padding:"10px 16px",
        background:`${T.bg0}f5`, backdropFilter:"blur(16px)",
        borderTop:`1px solid ${T.line}` }}>
        {NAV.map(({key,Icon,label})=>{
          const active=screen===key;
          return (
            <button key={key} onClick={()=>setScreen(key)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              padding:"5px 20px", background:"none", border:"none", cursor:"pointer",
              color:active?T.accent:T.txt2, position:"relative" }}>
              {active&&<div style={{ position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
                width:28, height:3, borderRadius:2, background:T.accent }}/>}
              <Icon size={20} strokeWidth={active?2.5:1.5}/>
              <span style={{ fontSize:10, fontWeight:active?700:400, letterSpacing:"0.04em" }}>
                {label}
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
