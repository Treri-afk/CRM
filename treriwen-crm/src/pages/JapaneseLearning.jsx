import React, { useState } from 'react';
import {
  CheckCircle2, Circle, Clock, Plus, RotateCcw, X, Search
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import Topbar from '../components/layout/Topbar';
import {
  studySessions, kanjiList, kanjiExtra,
  vocabulary, vocabularyExtra,
  grammarPoints, grammarExtra,
  jlptProgress, hiragana, katakana, jlptLevels
} from '../data/mockDataJapan';
import './Japan.css';

const typeColors  = { kanji: '#f5c842', vocab: '#3d7fff', grammaire: '#a78bfa', hiragana: '#2dd4a0', conversation: '#fb923c' };
const levelColors = { N5: '#2dd4a0', N4: '#3d7fff', N3: '#a78bfa', N2: '#f5c842', N1: '#ff4d6a' };
const statusConfig = {
  done:        { label: 'Maîtrisé',     color: 'var(--green)',      bg: 'var(--green-dim)'   },
  in_progress: { label: 'En cours',     color: 'var(--accent)',     bg: 'var(--accent-dim)'  },
  started:     { label: 'Commencé',     color: 'var(--yellow)',     bg: 'var(--yellow-dim)'  },
  not_started: { label: 'Non commencé', color: 'var(--text-muted)', bg: 'var(--bg-elevated)' },
};

const allKanji   = [...kanjiList,    ...kanjiExtra];
const allVocab   = [...vocabulary,   ...vocabularyExtra];
const allGrammar = [...grammarPoints, ...grammarExtra];

// ── Flashcard ────────────────────────────────────────────────────────────────
function Flashcard({ item, type }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`japan-flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
      <div className="jfc-front">
        <p className="jfc-char">{type === 'kanji' ? item.kanji : type === 'vocab' ? item.japanese : item.pattern}</p>
        <p className="jfc-hint">Cliquer pour révéler</p>
      </div>
      <div className="jfc-back">
        <p className="jfc-reading">{type === 'kanji' ? item.reading : type === 'vocab' ? item.reading : ''}</p>
        <p className="jfc-meaning">{type === 'kanji' ? item.meaning : type === 'vocab' ? item.french : item.meaning}</p>
        {type === 'vocab'   && <p className="jfc-example" style={{ color: item.mastered ? 'var(--green)' : 'var(--text-muted)' }}>{item.mastered ? '✓ Maîtrisé' : '○ À réviser'}</p>}
        {type === 'grammar' && item.example && <p className="jfc-example">{item.example}</p>}
      </div>
    </div>
  );
}

// ── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function AddKanjiModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ kanji: '', reading: '', meaning: '', level: 'N4', mastered: false });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="➕ Ajouter un Kanji" onClose={onClose}>
      <div className="add-form">
        <label>Kanji *</label>
        <input className="japan-input" placeholder="Ex : 東" value={form.kanji} onChange={e => s('kanji', e.target.value)} style={{ fontSize: 28, width: 80, textAlign: 'center' }} />
        <label>Lecture *</label>
        <input className="japan-input flex" placeholder="Ex : ひがし・とう" value={form.reading} onChange={e => s('reading', e.target.value)} />
        <label>Signification *</label>
        <input className="japan-input flex" placeholder="Ex : est, orient" value={form.meaning} onChange={e => s('meaning', e.target.value)} />
        <label>Niveau JLPT</label>
        <select className="perso-select" value={form.level} onChange={e => s('level', e.target.value)}>
          {jlptLevels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label className="add-form-check"><input type="checkbox" checked={form.mastered} onChange={e => s('mastered', e.target.checked)} /> Déjà maîtrisé</label>
        <button className="perso-add-btn" style={{ marginTop: 8 }} onClick={() => { if (form.kanji && form.reading && form.meaning) { onAdd(form); onClose(); }}}>
          <Plus size={13} /> Ajouter
        </button>
      </div>
    </Modal>
  );
}

function AddVocabModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ japanese: '', reading: '', french: '', category: 'quotidien', level: 'N4', mastered: false });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cats = ['immobilier','finance','transport','nourriture','quotidien','culture','politesse','conversation'];
  return (
    <Modal title="➕ Ajouter du Vocabulaire" onClose={onClose}>
      <div className="add-form">
        <label>Japonais *</label>
        <input className="japan-input flex" placeholder="Ex : 東京" value={form.japanese} onChange={e => s('japanese', e.target.value)} style={{ fontSize: 20 }} />
        <label>Lecture (hiragana) *</label>
        <input className="japan-input flex" placeholder="Ex : とうきょう" value={form.reading} onChange={e => s('reading', e.target.value)} />
        <label>Traduction *</label>
        <input className="japan-input flex" placeholder="Ex : Tokyo" value={form.french} onChange={e => s('french', e.target.value)} />
        <label>Catégorie</label>
        <select className="perso-select" value={form.category} onChange={e => s('category', e.target.value)}>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label>Niveau JLPT</label>
        <select className="perso-select" value={form.level} onChange={e => s('level', e.target.value)}>
          {jlptLevels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label className="add-form-check"><input type="checkbox" checked={form.mastered} onChange={e => s('mastered', e.target.checked)} /> Déjà maîtrisé</label>
        <button className="perso-add-btn" style={{ marginTop: 8 }} onClick={() => { if (form.japanese && form.french) { onAdd({ ...form, id: Date.now() }); onClose(); }}}>
          <Plus size={13} /> Ajouter
        </button>
      </div>
    </Modal>
  );
}

function AddGrammarModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ pattern: '', meaning: '', example: '', level: 'N4', mastered: false });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="➕ Ajouter un point de Grammaire" onClose={onClose}>
      <div className="add-form">
        <label>Pattern *</label>
        <input className="japan-input flex" placeholder="Ex : 〜てしまう" value={form.pattern} onChange={e => s('pattern', e.target.value)} style={{ fontSize: 18, fontWeight: 700 }} />
        <label>Signification *</label>
        <input className="japan-input flex" placeholder="Ex : Faire ~ accidentellement" value={form.meaning} onChange={e => s('meaning', e.target.value)} />
        <label>Exemple (japonais)</label>
        <input className="japan-input flex" placeholder="Ex : 財布を忘れてしまった" value={form.example} onChange={e => s('example', e.target.value)} />
        <label>Niveau JLPT</label>
        <select className="perso-select" value={form.level} onChange={e => s('level', e.target.value)}>
          {jlptLevels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label className="add-form-check"><input type="checkbox" checked={form.mastered} onChange={e => s('mastered', e.target.checked)} /> Déjà maîtrisé</label>
        <button className="perso-add-btn" style={{ marginTop: 8 }} onClick={() => { if (form.pattern && form.meaning) { onAdd({ ...form, id: Date.now() }); onClose(); }}}>
          <Plus size={13} /> Ajouter
        </button>
      </div>
    </Modal>
  );
}

function AddSessionModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0,10), type: 'vocab', duration: '', score: '', level: 'N4', notes: '' });
  const s = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal title="📝 Logger une session" onClose={onClose}>
      <div className="add-form">
        <label>Date</label>
        <input className="japan-input flex" type="date" value={form.date} onChange={e => s('date', e.target.value)} />
        <label>Type</label>
        <select className="perso-select" value={form.type} onChange={e => s('type', e.target.value)}>
          {['kanji','vocab','grammaire','hiragana','conversation'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <label>Durée (minutes) *</label>
        <input className="japan-input flex" type="number" placeholder="Ex : 30" value={form.duration} onChange={e => s('duration', e.target.value)} />
        <label>Score (%)</label>
        <input className="japan-input flex" type="number" min="0" max="100" placeholder="Ex : 85" value={form.score} onChange={e => s('score', e.target.value)} />
        <label>Niveau travaillé</label>
        <select className="perso-select" value={form.level} onChange={e => s('level', e.target.value)}>
          {jlptLevels.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <label>Notes</label>
        <input className="japan-input flex" placeholder="Notes optionnelles..." value={form.notes} onChange={e => s('notes', e.target.value)} />
        <button className="perso-add-btn" style={{ marginTop: 8 }} onClick={() => { if (form.duration) { onAdd({ ...form, id: Date.now(), duration: Number(form.duration), score: Number(form.score)||0 }); onClose(); }}}>
          <Plus size={13} /> Logger
        </button>
      </div>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
export default function JapaneseLearning() {
  const [tab,           setTab]           = useState('dashboard');
  const [vocabFilter,   setVocabFilter]   = useState('all');
  const [kanjiFilter,   setKanjiFilter]   = useState('all');
  const [kanjiSearch,   setKanjiSearch]   = useState('');
  const [vocabSearch,   setVocabSearch]   = useState('');
  const [fcType,        setFcType]        = useState('vocab');
  const [fcIdx,         setFcIdx]         = useState(0);
  const [fcLevelFilter, setFcLevelFilter] = useState('all');

  const [showAddKanji,   setShowAddKanji]   = useState(false);
  const [showAddVocab,   setShowAddVocab]   = useState(false);
  const [showAddGrammar, setShowAddGrammar] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);

  const [kanjis,   setKanjis]   = useState(allKanji);
  const [vocabs,   setVocabs]   = useState(allVocab);
  const [grammars, setGrammars] = useState(allGrammar);
  const [sessions, setSessions] = useState(studySessions);

  const totalStudyTime  = sessions.reduce((s, ss) => s + ss.duration, 0);
  const avgScore        = sessions.length ? Math.round(sessions.reduce((s, ss) => s + ss.score, 0) / sessions.length) : 0;
  const masteredVocab   = vocabs.filter(v => v.mastered).length;
  const masteredKanji   = kanjis.filter(k => k.mastered).length;
  const masteredGrammar = grammars.filter(g => g.mastered).length;
  const currentLevel    = jlptLevels.find(l => jlptProgress[l].status === 'in_progress') || 'N4';

  const sessionData = [...sessions].reverse().slice(-10).map(s => ({
    date: s.date.slice(5), durée: s.duration, score: s.score, type: s.type,
  }));

  const fcItems = (fcType === 'vocab' ? vocabs : fcType === 'kanji' ? kanjis : grammars)
    .filter(i => fcLevelFilter === 'all' || i.level === fcLevelFilter);
  const fcItem  = fcItems.length ? fcItems[((fcIdx % fcItems.length) + fcItems.length) % fcItems.length] : null;

  const filteredKanji = kanjis
    .filter(k => kanjiFilter === 'all' || k.level === kanjiFilter)
    .filter(k => !kanjiSearch || k.kanji.includes(kanjiSearch) || k.reading.includes(kanjiSearch) || k.meaning.toLowerCase().includes(kanjiSearch.toLowerCase()));

  const filteredVocab = vocabs
    .filter(v => vocabFilter === 'all' || v.category === vocabFilter)
    .filter(v => !vocabSearch || v.japanese.includes(vocabSearch) || v.reading.includes(vocabSearch) || v.french.toLowerCase().includes(vocabSearch.toLowerCase()));

  const vocabCategories = [...new Set(vocabs.map(v => v.category))];

  return (
    <div className="page">
      <Topbar title="Apprentissage Japonais 🇯🇵" subtitle={`${currentLevel} · ${masteredVocab}/${vocabs.length} mots · ${masteredKanji}/${kanjis.length} kanji`} />
      <div className="page-content">

        {/* Modals */}
        {showAddKanji   && <AddKanjiModal   onClose={() => setShowAddKanji(false)}   onAdd={k => setKanjis(p => [...p, k])} />}
        {showAddVocab   && <AddVocabModal   onClose={() => setShowAddVocab(false)}   onAdd={v => setVocabs(p => [...p, v])} />}
        {showAddGrammar && <AddGrammarModal onClose={() => setShowAddGrammar(false)} onAdd={g => setGrammars(p => [...p, g])} />}
        {showAddSession && <AddSessionModal onClose={() => setShowAddSession(false)} onAdd={s => setSessions(p => [s, ...p])} />}

        {/* Tabs */}
        <div className="perso-tabs">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'jlpt',      label: 'JLPT' },
            { id: 'kanji',     label: `Kanji (${kanjis.length})` },
            { id: 'vocab',     label: `Vocabulaire (${vocabs.length})` },
            { id: 'grammaire', label: `Grammaire (${grammars.length})` },
            { id: 'hiragana',  label: 'Hiragana ひ' },
            { id: 'katakana',  label: 'Katakana ア' },
            { id: 'flashcards',label: '🃏 Flashcards' },
          ].map(t => (
            <button key={t.id} className={`perso-tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── DASHBOARD ─── */}
        {tab === 'dashboard' && (
          <>
            <div className="japan-kpis stagger">
              {[
                { label: 'Temps d\'étude',     value: `${Math.floor(totalStudyTime/60)}h${totalStudyTime%60}min`, color: '#3d7fff' },
                { label: 'Score moyen',         value: `${avgScore}%`,                                             color: avgScore >= 85 ? 'var(--green)' : 'var(--yellow)' },
                { label: 'Vocab maîtrisé',      value: `${masteredVocab}/${vocabs.length}`,                        color: '#a78bfa' },
                { label: 'Kanji maîtrisés',     value: `${masteredKanji}/${kanjis.length}`,                        color: '#f5c842' },
                { label: 'Grammaire maîtrisée', value: `${masteredGrammar}/${grammars.length}`,                    color: '#2dd4a0' },
                { label: 'Sessions',            value: sessions.length,                                            color: 'var(--text-secondary)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="japan-kpi">
                  <p className="japan-kpi-val mono" style={{ color }}>{value}</p>
                  <p className="japan-kpi-label">{label}</p>
                </div>
              ))}
            </div>

            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Sessions d'étude</h3>
                <button className="perso-add-btn" onClick={() => setShowAddSession(true)}><Plus size={13} /> Logger une session</button>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={sessionData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid stroke="#1e2740" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4a5470', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}m`} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-soft)', borderRadius: 8 }} />
                  <Bar dataKey="durée" name="Durée (min)" radius={[3,3,0,0]}>
                    {sessionData.map((s, i) => <Cell key={i} fill={typeColors[s.type] || '#8892aa'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} className="japan-session-row">
                  <div className="jsr-type" style={{ background: (typeColors[s.type]||'#8892aa')+'18', color: typeColors[s.type]||'#8892aa' }}>{s.type}</div>
                  <div className="jsr-info">
                    <p className="jsr-date mono">{s.date}</p>
                    {s.notes && <p className="jsr-notes">{s.notes}</p>}
                  </div>
                  <div className="jsr-stats">
                    <span><Clock size={11} /> {s.duration}min</span>
                    <span className="mono" style={{ color: s.score>=85?'var(--green)':s.score>=70?'var(--yellow)':'var(--red)', fontWeight:700 }}>{s.score}%</span>
                    <span className="jsr-level" style={{ background: (levelColors[s.level]||'#8892aa')+'20', color: levelColors[s.level]||'#8892aa' }}>{s.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── JLPT ─── */}
        {tab === 'jlpt' && (
          <div className="japan-jlpt-grid">
            {jlptLevels.map(level => {
              const p = jlptProgress[level];
              const sc = statusConfig[p.status];
              return (
                <div key={level} className="japan-jlpt-card" style={{ borderTopColor: levelColors[level] }}>
                  <div className="jjc-header">
                    <div className="jjc-level" style={{ background: levelColors[level]+'20', color: levelColors[level] }}>{level}</div>
                    <span className="jjc-status" style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
                  </div>
                  <div className="jjc-stats">
                    {[['Vocabulaire', p.mastered, p.total],['Kanji', p.kanjiMastered, p.kanjis]].map(([lbl, cur, tot]) => (
                      <div key={lbl}>
                        <p className="jjc-stat-label">{lbl}</p>
                        <p className="jjc-stat-val mono">{cur}<span>/{tot}</span></p>
                        <div className="jjc-bar-wrap"><div className="jjc-bar" style={{ width: `${Math.round(cur/tot*100)}%`, background: levelColors[level] }} /></div>
                        <p className="jjc-pct">{Math.round(cur/tot*100)}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── KANJI ─── */}
        {tab === 'kanji' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Kanji <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:12 }}>{filteredKanji.length} affichés sur {kanjis.length}</span></h3>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                <div className="search-field" style={{ width:180 }}>
                  <Search size={12} />
                  <input placeholder="Chercher kanji..." value={kanjiSearch} onChange={e => setKanjiSearch(e.target.value)} />
                </div>
                <div className="filter-tabs">
                  {['all','N5','N4','N3','N2'].map(l => (
                    <button key={l} className={`filter-tab ${kanjiFilter===l?'active':''}`} onClick={() => setKanjiFilter(l)}>{l==='all'?'Tous':l}</button>
                  ))}
                </div>
                <button className="perso-add-btn" onClick={() => setShowAddKanji(true)}><Plus size={13} /> Ajouter</button>
              </div>
            </div>
            <div className="japan-kanji-grid">
              {filteredKanji.map((k, i) => (
                <div key={i} className={`japan-kanji-card ${k.mastered?'mastered':''}`} style={{ borderColor: k.mastered?(levelColors[k.level]+'55'):'var(--border-dim)' }}>
                  <p className="jkc-kanji" style={{ color: levelColors[k.level] }}>{k.kanji}</p>
                  <p className="jkc-reading">{k.reading}</p>
                  <p className="jkc-meaning">{k.meaning}</p>
                  <div className="jkc-footer">
                    <span className="jkc-level" style={{ color: levelColors[k.level] }}>{k.level}</span>
                    {k.mastered ? <CheckCircle2 size={14} color="var(--green)" /> : <Circle size={14} color="var(--border-bright)" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── VOCABULAIRE ─── */}
        {tab === 'vocab' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Vocabulaire <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:12 }}>{filteredVocab.length} / {vocabs.length} mots</span></h3>
              <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
                <div className="search-field" style={{ width:180 }}>
                  <Search size={12} />
                  <input placeholder="Chercher mot..." value={vocabSearch} onChange={e => setVocabSearch(e.target.value)} />
                </div>
                <div className="filter-tabs">
                  <button className={`filter-tab ${vocabFilter==='all'?'active':''}`} onClick={() => setVocabFilter('all')}>Tout</button>
                  {vocabCategories.map(c => (
                    <button key={c} className={`filter-tab ${vocabFilter===c?'active':''}`} onClick={() => setVocabFilter(c)}>{c}</button>
                  ))}
                </div>
                <button className="perso-add-btn" onClick={() => setShowAddVocab(true)}><Plus size={13} /> Ajouter</button>
              </div>
            </div>
            <table className="perso-table">
              <thead><tr><th>Japonais</th><th>Lecture</th><th>Français</th><th>Catégorie</th><th>Niveau</th><th>✓</th></tr></thead>
              <tbody>
                {filteredVocab.map(v => (
                  <tr key={v.id} className="perso-table-row">
                    <td style={{ fontSize:16, fontWeight:700, color:'var(--text-primary)' }}>{v.japanese}</td>
                    <td className="mono" style={{ color:'#f5c842' }}>{v.reading}</td>
                    <td style={{ color:'var(--text-secondary)' }}>{v.french}</td>
                    <td><span className="japan-cat-badge">{v.category}</span></td>
                    <td><span style={{ color: levelColors[v.level]||'#8892aa', fontWeight:700, fontSize:12 }}>{v.level}</span></td>
                    <td>{v.mastered ? <CheckCircle2 size={15} color="var(--green)" /> : <Circle size={15} color="var(--border-bright)" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ─── GRAMMAIRE ─── */}
        {tab === 'grammaire' && (
          <>
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button className="perso-add-btn" onClick={() => setShowAddGrammar(true)}><Plus size={13} /> Ajouter un point</button>
            </div>
            <div className="japan-grammar-list">
              {grammars.map(g => (
                <div key={g.id} className={`japan-grammar-card ${g.mastered?'mastered':''}`}>
                  <div className="jgc-header">
                    <p className="jgc-pattern" style={{ color: levelColors[g.level]||'#8892aa' }}>{g.pattern}</p>
                    <span style={{ color: levelColors[g.level]||'#8892aa', fontSize:11, fontWeight:700 }}>{g.level}</span>
                    {g.mastered ? <CheckCircle2 size={15} color="var(--green)" /> : <Circle size={15} color="var(--border-bright)" />}
                  </div>
                  <p className="jgc-meaning">{g.meaning}</p>
                  {g.example && <p className="jgc-example">{g.example}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── HIRAGANA ─── */}
        {tab === 'hiragana' && (
          <div className="perso-card">
            <div className="perso-card-header">
              <h3 className="perso-card-title">Hiragana — {hiragana.length} caractères <span style={{ color:'var(--text-muted)', fontSize:12, fontWeight:400 }}>ひらがな</span></h3>
              <p className="perso-card-sub">Écriture phonétique japonaise pour les mots natifs</p>
            </div>
            <div className="japan-hiragana-grid">
              {hiragana.map(h => (
                <div key={h.char} className="japan-hira-card">
                  <p className="jhc-char">{h.char}</p>
                  <p className="jhc-romaji">{h.romaji}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── KATAKANA ─── */}
        {tab === 'katakana' && (
          <>
            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Katakana — 46 caractères <span style={{ color:'var(--text-muted)', fontSize:12, fontWeight:400 }}>カタカナ</span></h3>
                <p className="perso-card-sub">Utilisé pour les mots étrangers, les onomatopées et l'emphase</p>
              </div>
              <div className="japan-hiragana-grid">
                {katakana.filter(k => k.romaji && !k.meaning).map(k => (
                  <div key={k.char} className="japan-hira-card katakana">
                    <p className="jhc-char" style={{ color:'#a78bfa' }}>{k.char}</p>
                    <p className="jhc-romaji">{k.romaji}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="perso-card">
              <div className="perso-card-header">
                <h3 className="perso-card-title">Mots d'emprunt courants 🗣️</h3>
                <p className="perso-card-sub">Mots étrangers écrits en katakana — très utiles au quotidien</p>
              </div>
              <div className="japan-kata-words-grid">
                {katakana.filter(k => k.meaning).map((k, i) => (
                  <div key={i} className="japan-kata-word-card">
                    <p className="jkw-japanese">{k.char}</p>
                    <p className="jkw-romaji mono">{k.romaji}</p>
                    <p className="jkw-meaning">{k.meaning}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ─── FLASHCARDS ─── */}
        {tab === 'flashcards' && (
          <div className="japan-flashcard-section">
            <div className="japan-fc-controls">
              <div className="filter-tabs">
                {[{id:'vocab',label:'Vocabulaire'},{id:'kanji',label:'Kanji'},{id:'grammar',label:'Grammaire'}].map(t => (
                  <button key={t.id} className={`filter-tab ${fcType===t.id?'active':''}`} onClick={() => { setFcType(t.id); setFcIdx(0); }}>{t.label}</button>
                ))}
              </div>
              <div className="filter-tabs">
                {['all',...jlptLevels].map(l => (
                  <button key={l} className={`filter-tab ${fcLevelFilter===l?'active':''}`} onClick={() => { setFcLevelFilter(l); setFcIdx(0); }}>
                    {l==='all'?'Tous':l}
                  </button>
                ))}
              </div>
              <span className="mono" style={{ color:'var(--text-muted)', fontSize:12 }}>
                {fcItems.length ? `${((fcIdx%fcItems.length)+fcItems.length)%fcItems.length+1} / ${fcItems.length}` : '0 / 0'}
              </span>
            </div>
            {fcItem
              ? <Flashcard item={fcItem} type={fcType} />
              : <p style={{ color:'var(--text-muted)', textAlign:'center', padding:40 }}>Aucune carte pour ce filtre</p>
            }
            <div className="japan-fc-nav">
              <button className="japan-nav-btn lg" onClick={() => setFcIdx(i => i-1)}>← Précédent</button>
              <button className="japan-fc-shuffle" onClick={() => setFcIdx(Math.floor(Math.random()*fcItems.length))}>
                <RotateCcw size={14} /> Aléatoire
              </button>
              <button className="japan-nav-btn lg" onClick={() => setFcIdx(i => i+1)}>Suivant →</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}