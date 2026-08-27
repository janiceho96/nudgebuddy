import React from 'react';
import { Task } from '../../types';
import { calculateUserStats, getDopamineBadges } from '../../core/statsEngine';
import { generateIcsForFocusDay } from '../../core/calendarSync';
import { downloadTextFile } from '../../core/backupManager';
import { audioEngine } from '../../core/audioEngine';
import { X, Flame, Clock, CheckCircle2, Award, Calendar, Copy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyRecapModalProps {
  tasks: Task[];
  isOpen: boolean;
  onClose: () => void;
}

export const DailyRecapModal: React.FC<DailyRecapModalProps> = ({ tasks, isOpen, onClose }) => {
  if (!isOpen) return null;

  const stats = calculateUserStats(tasks);
  const badges = getDopamineBadges(tasks);

  const handleTriggerCelebration = () => {
    try {
      audioEngine.playSfx('fanfare');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {}
  };

  const handleDownloadCalendar = () => {
    audioEngine.playSfx('pop');
    const ics = generateIcsForFocusDay(tasks);
    downloadTextFile('nudgebuddy-focus-schedule.ics', ics, 'text/calendar');
  };

  const handleCopySummary = () => {
    audioEngine.playSfx('pop');
    const summary = `👾 NudgeBuddy Daily Focus Summary:
🔥 Streak: ${stats.streakDays} days
⏱️ Focus Banked: ${stats.totalFocusMinutes} minutes
✅ Completed: ${stats.completedCount} tasks
🏆 Badges Unlocked: ${badges.filter(b => b.unlocked).map(b => b.emoji + ' ' + b.name).join(', ')}`;
    navigator.clipboard.writeText(summary);
    alert('Daily summary copied to clipboard!');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '500px', maxHeight: '88vh', overflowY: 'auto' }}>
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
          <span className="nb-badge" style={{ background: '#86efac' }}>🏆 Daily Recap</span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Dopamine & Progress Tracker</h3>
        </div>

        {/* 3 Metric Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.9rem' }}>
          <div style={{ background: '#fef3c7', border: '2px solid #121826', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', color: '#b45309', fontWeight: 800, fontSize: '0.75rem' }}>
              <Flame size={14} color="#f59e0b" /> Streak
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '2px' }}>
              {stats.streakDays}d
            </div>
          </div>

          <div style={{ background: '#dbeafe', border: '2px solid #121826', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', color: '#1d4ed8', fontWeight: 800, fontSize: '0.75rem' }}>
              <Clock size={14} color="#3b82f6" /> Focus
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '2px' }}>
              {stats.totalFocusMinutes}m
            </div>
          </div>

          <div style={{ background: '#dcfce7', border: '2px solid #121826', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem', color: '#15803d', fontWeight: 800, fontSize: '0.75rem' }}>
              <CheckCircle2 size={14} color="#22c55e" /> Done
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '2px' }}>
              {stats.completedCount}
            </div>
          </div>
        </div>

        {/* Dopamine Badges Section */}
        <div style={{ background: '#ffffff', border: '2px solid #121826', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.9rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Award size={14} color="#eab308" /> Dopamine Achievements ({badges.filter(b => b.unlocked).length}/{badges.length})
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem' }}>
            {badges.map((b) => (
              <div
                key={b.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.5rem',
                  background: b.unlocked ? '#fefce8' : '#f1f5f9',
                  border: '1.5px solid #121826',
                  borderRadius: '6px',
                  opacity: b.unlocked ? 1 : 0.45
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{b.emoji}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.74rem', color: '#0f172a' }}>{b.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#64748b' }}>{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="nb-btn nb-btn-primary"
            style={{ flex: 1, fontSize: '0.75rem' }}
            onClick={handleTriggerCelebration}
          >
            <Sparkles size={13} /> Celebrate Wins! 🎉
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{ flex: 1, fontSize: '0.75rem', background: '#ffffff' }}
            onClick={handleCopySummary}
          >
            <Copy size={13} /> Copy Summary
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{ flex: 1, fontSize: '0.75rem', background: '#ffffff' }}
            onClick={handleDownloadCalendar}
            title="Download .ics schedule for Apple Calendar / Google Calendar"
          >
            <Calendar size={13} /> Export .ics
          </button>
        </div>
      </div>
    </div>
  );
};
