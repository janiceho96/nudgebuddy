import React, { useState } from 'react';
import { Task } from '../../types';
import { parseBrainDumpToTasks } from '../../core/brainDumpParser';
import { audioEngine } from '../../core/audioEngine';
import { X, Sparkles, Check, Plus, Trash2, ArrowRight } from 'lucide-react';

interface BrainDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBatchAddTasks: (tasks: Task[]) => void;
}

export const BrainDumpModal: React.FC<BrainDumpModalProps> = ({
  isOpen,
  onClose,
  onBatchAddTasks
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [candidates, setCandidates] = useState<Task[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleParse = () => {
    if (!rawText.trim()) return;
    audioEngine.playSfx('boing');
    const parsed = parseBrainDumpToTasks(rawText);
    setCandidates(parsed);
    setSelectedIds(new Set(parsed.map(t => t.id)));
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBatchImport = () => {
    const toImport = candidates.filter(c => selectedIds.has(c.id));
    if (toImport.length === 0) return;
    audioEngine.playSfx('fanfare');
    onBatchAddTasks(toImport);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '520px', maxHeight: '88vh', overflowY: 'auto' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: '#ffffff',
            border: '2px solid #121826',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={15} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
          <span className="nb-badge" style={{ background: '#ffe600' }}>🧠 Brain Dump</span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Unclutter Your Mind</h3>
        </div>

        <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem', lineHeight: 1.4 }}>
          Paste or type your messy, rambling thoughts. Budge will automatically slice them into structured, time-estimated micro-tasks!
        </p>

        <textarea
          rows={5}
          className="quick-capture-input"
          placeholder="Example:&#10;- Email Sarah about lease renewal 15m #admin !high&#10;- Fix login button bug 30m #dev&#10;- Buy groceries and dog food&#10;- Cancel gym membership 10m !crit"
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          style={{ marginBottom: '0.6rem', fontSize: '0.82rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ width: '100%', padding: '0.55rem' }}
            onClick={handleParse}
            disabled={!rawText.trim()}
          >
            <Sparkles size={15} /> Parse & Slice with Budge
          </button>
        </div>

        {/* Parsed Candidates Preview */}
        {candidates.length > 0 && (
          <div style={{ background: '#f8fafc', border: '2px solid #121826', borderRadius: '10px', padding: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>
                Found {candidates.length} Tasks ({selectedIds.size} selected)
              </span>
              <button
                type="button"
                onClick={() => {
                  if (selectedIds.size === candidates.length) setSelectedIds(new Set());
                  else setSelectedIds(new Set(candidates.map(t => t.id)));
                }}
                style={{ fontSize: '0.72rem', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline', color: '#475569' }}
              >
                {selectedIds.size === candidates.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '200px', overflowY: 'auto' }}>
              {candidates.map((cand) => {
                const isChecked = selectedIds.has(cand.id);
                return (
                  <div
                    key={cand.id}
                    onClick={() => handleToggleSelect(cand.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.4rem 0.55rem',
                      background: isChecked ? '#ffffff' : '#f1f5f9',
                      border: '1.5px solid #121826',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '4px',
                        border: '1.5px solid #121826',
                        background: isChecked ? '#86efac' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {isChecked && <Check size={11} strokeWidth={3.5} />}
                    </div>

                    <span style={{ flex: 1, fontWeight: 700, color: isChecked ? '#0f172a' : '#64748b' }}>
                      {cand.title}
                    </span>

                    <span className="nb-badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', background: '#e2e8f0' }}>
                      {cand.estimatedMinutes}m
                    </span>

                    <span className="nb-badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.3rem', background: cand.urgency === 'critical' ? '#fca5a5' : '#fed7aa' }}>
                      !{cand.urgency}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              className="nb-btn nb-btn-success"
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.6rem' }}
              onClick={handleBatchImport}
              disabled={selectedIds.size === 0}
            >
              <Plus size={15} /> Batch Add {selectedIds.size} Tasks to Inbox
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
