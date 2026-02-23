import React, { useState, useEffect } from 'react';
import { 
  Plus, Camera, ChevronRight, TrendingUp, TrendingDown, 
  Eye, Heart, Settings, Image as ImageIcon, ArrowLeft,
  Share2, Edit3, Save, Trash2, Clock, X
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine, Scatter, ScatterChart, ZAxis
} from 'recharts';

const QUALIA_STORAGE_KEY = 'qualia_app_data';

export default function QualiaApp() {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem(QUALIA_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentProject, setCurrentProject] = useState(null);
  const [view, setView] = useState('list'); // 'list', 'detail', 'add', 'report'
  const [category, setCategory] = useState('Design');
  const [activeTab, setActiveTab] = useState('Self'); // 'Self', 'Observation'
  
  const [formData, setFormData] = useState({
    content: '',
    emotion: 0,
    emotionWord: '',
    detail: '',
    photos: [],
    thumbnailIndex: 0,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    localStorage.setItem(QUALIA_STORAGE_KEY, JSON.stringify(projects));
  }, [projects]);

  const colors = {
    Design: '#3b82f6',
    Experience: '#10b981',
    Observation: '#f59e0b'
  };

  const getThumbnail = (log) => {
    return log.photos && log.photos.length > 0 ? log.photos[log.thumbnailIndex] : null;
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    const title = e.target.projectTitle.value;
    if (!title) return;
    const newProject = { id: Date.now(), title, logs: [] };
    setProjects([...projects, newProject]);
    e.target.reset();
  };

  const handleSaveLog = () => {
    const newLog = { ...formData, id: Date.now(), category };
    const updatedProjects = projects.map(p => {
      if (p.id === currentProject.id) {
        const newLogs = [...p.logs, newLog].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        return { ...p, logs: newLogs };
      }
      return p;
    });
    setProjects(updatedProjects);
    setCurrentProject(updatedProjects.find(p => p.id === currentProject.id));
    setView('detail');
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      content: '', emotion: 0, emotionWord: '',
      detail: '', photos: [], thumbnailIndex: 0,
      timestamp: new Date().toISOString()
    });
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photos: [...prev.photos, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  // --- 1. プロジェクト一覧 (修正済) ---
  if (view === 'list') {
    return (
      <div className="min-h-screen bg-[#06080f] text-white p-6 pb-24 font-sans">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tighter mb-1 italic">QUALIA</h1>
          <p className="text-blue-500 text-[10px] font-bold tracking-[0.3em] uppercase">Field Research Archiver</p>
        </header>

        <form onSubmit={handleAddProject} className="mb-10 flex gap-2">
          <input 
            name="projectTitle"
            placeholder="新規プロジェクト名..." 
            className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button className="bg-blue-600 w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-transform active:scale-90">
            <Plus size={28} />
          </button>
        </form>

        <div className="grid gap-8">
          {projects.map(p => {
            const lastLog = p.logs[p.logs.length - 1];
            const thumb = lastLog ? getThumbnail(lastLog) : null;
            return (
              <button 
                key={p.id}
                onClick={() => { setCurrentProject(p); setView('detail'); }}
                className="group w-full text-left bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-800 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="aspect-[16/10] w-full bg-gray-800 relative overflow-hidden">
                  {thumb ? (
                    <img src={thumb} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ImageIcon size={64} strokeWidth={1} />
                    </div>
                  )}
                  <div className="absolute bottom-6 left-6 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-xs font-bold">
                    {p.logs.length} LOGS
                  </div>
                </div>
                <div className="p-8 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">{p.title}</h3>
                    <p className="text-gray-500 text-xs mt-2 font-medium tracking-widest uppercase">
                      {p.logs.length > 0 ? new Date(p.logs[0].timestamp).toLocaleDateString() : 'NO DATA'}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-gray-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // --- 2. プロジェクト詳細 (グラフ画面) ---
  if (view === 'detail') {
    const selfLogs = currentProject.logs.filter(l => l.category !== 'Observation');
    const obsLogs = currentProject.logs.filter(l => l.category === 'Observation');
    const displayLogs = activeTab === 'Self' ? selfLogs : obsLogs;

    return (
      <div className="min-h-screen bg-[#06080f] text-white">
        <header className="p-6 flex items-center justify-between sticky top-0 bg-[#06080f]/80 backdrop-blur-md z-30">
          <button onClick={() => setView('list')} className="p-2"><ArrowLeft /></button>
          <h2 className="text-lg font-bold truncate px-4">{currentProject.title}</h2>
          <div className="flex gap-2">
            <button onClick={() => setView('report')} className="p-2 text-blue-400"><Share2 size={20}/></button>
          </div>
        </header>

        <div className="px-6 mb-6">
          <div className="flex bg-gray-900 p-1 rounded-2xl">
            {['Self', 'Observation'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === t ? 'bg-gray-800 shadow-lg' : 'text-gray-500'}`}
              >
                {t === 'Self' ? '自己体験' : '他者観察'}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 px-2 mb-8 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayLogs}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="timestamp" hide />
              <YAxis domain={[-110, 110]} hide />
              <Tooltip content={() => null} />
              <ReferenceLine y={0} stroke="#374151" />
              {activeTab === 'Self' ? (
                <>
                  <Line type="monotone" dataKey="emotion" data={displayLogs.filter(l => l.category === 'Design')} stroke={colors.Design} strokeWidth={3} dot={{ r: 6, fill: colors.Design }} />
                  <Line type="monotone" dataKey="emotion" data={displayLogs.filter(l => l.category === 'Experience')} stroke={colors.Experience} strokeWidth={3} dot={{ r: 6, fill: colors.Experience }} />
                </>
              ) : (
                <Line type="monotone" dataKey="emotion" stroke={colors.Observation} strokeWidth={3} dot={{ r: 6, fill: colors.Observation }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="px-6 space-y-4 pb-32">
          {displayLogs.map(log => (
            <div key={log.id} className="bg-gray-900/50 border border-gray-800 p-5 rounded-3xl flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-800 overflow-hidden flex-shrink-0">
                {getThumbnail(log) ? <img src={getThumbnail(log)} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto h-full text-gray-700" size={24}/>}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{color: colors[log.category]}}>{log.category}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="font-bold text-sm">{log.content}</p>
                <p className="text-blue-400 text-xs mt-1 font-bold">{log.emotionWord}</p>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => { resetForm(); setView('add'); }}
          className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center active:scale-90 transition-transform z-40"
        >
          <Plus size={32} />
        </button>
      </div>
    );
  }

  // --- 3. ログ追加画面 ---
  if (view === 'add') {
    return (
      <div className="min-h-screen bg-[#06080f] text-white p-6 pb-24">
        <header className="flex justify-between items-center mb-8">
          <button onClick={() => setView('detail')}><X /></button>
          <h2 className="font-bold">NEW LOG</h2>
          <button onClick={handleSaveLog} className="text-blue-500 font-bold">保存</button>
        </header>

        <div className="space-y-8">
          <div className="flex bg-gray-900 p-1 rounded-2xl">
            {['Design', 'Experience', 'Observation'].map(c => (
              <button 
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-1 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${category === c ? 'bg-gray-800 text-white' : 'text-gray-500'}`}
              >
                {c.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Content</label>
            <input 
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="何が起きましたか？"
              className="w-full bg-transparent text-2xl font-bold border-b border-gray-800 pb-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">Emotion</label>
              <span className="text-3xl font-black">{formData.emotion > 0 ? `+${formData.emotion}` : formData.emotion}</span>
            </div>
            <input 
              type="range" min="-100" max="100" 
              value={formData.emotion}
              onChange={e => setFormData({...formData, emotion: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none accent-blue-500"
            />
          </div>

          <input 
            placeholder="感情を一言で（わくわく、など）"
            value={formData.emotionWord}
            onChange={e => setFormData({...formData, emotionWord: e.target.value})}
            className="w-full bg-gray-900 p-4 rounded-2xl focus:outline-none"
          />

          <textarea 
            placeholder="詳細な気づきをメモ..."
            value={formData.detail}
            onChange={e => setFormData({...formData, detail: e.target.value})}
            className="w-full bg-gray-900 p-4 rounded-2xl h-32 focus:outline-none"
          />

          <div className="flex gap-4 overflow-x-auto pb-4">
            <label className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0 cursor-pointer">
              <Camera className="text-gray-500" />
              <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {formData.photos.map((p, i) => (
              <div key={i} className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 relative border-2 border-blue-500">
                <img src={p} className="w-full h-full object-cover" />
                <button 
                  onClick={() => setFormData(prev => ({...prev, photos: prev.photos.filter((_, idx) => idx !== i)}))}
                  className="absolute top-1 right-1 bg-black/50 rounded-full p-1"
                ><X size={12}/></button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-gray-500">
            <Clock size={16} />
            <input 
              type="datetime-local" 
              value={formData.timestamp.slice(0, 16)}
              onChange={e => setFormData({...formData, timestamp: new Date(e.target.value).toISOString()})}
              className="bg-transparent text-xs font-mono"
            />
          </div>
        </div>
      </div>
    );
  }

  // --- 4. レポート画面 (修正済：写真大型化) ---
  if (view === 'report') {
    return (
      <div className="min-h-screen bg-white text-black p-8 font-sans">
        <button onClick={() => setView('detail')} className="mb-10 flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors">
          <ArrowLeft size={20} /> BACK
        </button>
        
        <header className="mb-16">
          <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase leading-none">{currentProject.title}</h1>
          <div className="flex items-center gap-4">
            <div className="h-[2px] flex-1 bg-black"></div>
            <p className="text-sm font-black tracking-[0.2em] uppercase">Insight Report</p>
          </div>
          <p className="mt-4 font-mono text-xs text-gray-400 italic">DATE: {new Date().toLocaleDateString()}</p>
        </header>

        <div className="space-y-24">
          {currentProject.logs.map((log, idx) => (
            <div key={log.id} className="relative">
              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black italic opacity-10 leading-none">0{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[log.category] }}></span>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400">{log.category}</span>
                  </div>
                  <h2 className="text-3xl font-black tracking-tight">{log.content}</h2>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>

              {log.photos && log.photos.length > 0 && (
                <div className="mb-8 grid gap-4">
                  {log.photos.map((url, i) => (
                    <div key={i} className="group overflow-hidden rounded-[2rem] shadow-2xl">
                      <img src={url} className="w-full h-auto object-cover" alt="Insight" />
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-gray-50 p-8 rounded-[2rem] border-l-8" style={{ borderColor: colors[log.category] }}>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {log.detail || '考察メモなし'}
                  </p>
                </div>
                
                <div className="flex items-center gap-8 px-4">
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Score</p>
                    <p className="text-5xl font-black" style={{color: colors[log.category]}}>
                      {log.emotion > 0 ? `+${log.emotion}` : log.emotion}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Emotion</p>
                    <p className="text-2xl font-black italic">{log.emotionWord || '---'}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <footer className="mt-32 pt-16 border-t border-gray-100 text-center">
          <p className="font-black italic text-2xl opacity-10">QUALIA ARCHIVE SYSTEM</p>
        </footer>
      </div>
    );
  }

  return null;
}