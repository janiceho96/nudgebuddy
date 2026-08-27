import React, { useState } from 'react';
import { Task } from '../../types';
import { AppState } from '../../core/stateMachine';
import { exportTasksToMarkdown, parseMarkdownToTasks } from '../../core/markdownSync';
import { exportBackupJSON, importBackupJSON, exportTasksToCSV, downloadTextFile } from '../../core/backupManager';
import { generateIcsForFocusDay } from '../../core/calendarSync';
import { audioEngine } from '../../core/audioEngine';
import { X, FileText, Download, Upload, Calendar, Database, Check } from 'lucide-react';

interface SyncModalProps {
  state: AppState;
  isOpen: boolean;
  onClose: () => void;
  onImportTasks: (tasks: Task[]) => void;
  onRestoreState: (state: AppState) => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({
  state,
  isOpen,
  onClose,
  onImportTasks,
  onRestoreState
}) => {
  if (!isOpen) return null;

  const [mdInput, setMdInput] = useState('');
  const [activeTab, setActiveTab] = useState<'markdown' | 'backup' | 'calendar'>('markdown');

  const handleExportMarkdown = () => {
    audioEngine.playSfx('pop');
    const md = exportTasksToMarkdown(state.tasks);
    downloadTextFile('tasks.md', md, 'text/markdown');
  };

  const handleImportMarkdown = () => {
    if (!mdInput.trim()) return;
    audioEngine.playSfx('fanfare');
    const imported = parseMarkdownToTasks(mdInput);
    onImportTasks(imported);
    setMdInput('');
    alert(`Successfully imported ${imported.length} tasks from Markdown!`);
  };

  const handleExportJSON = () => {
    audioEngine.playSfx('pop');
    const json = exportBackupJSON(state);
    downloadTextFile('nudgebuddy-backup.json', json, 'application/json');
  };

  const handleExportCSV = () => {
    audioEngine.playSfx('pop');
    const csv = exportTasksToCSV(state.tasks);
    downloadTextFile('nudgebuddy-tasks.csv', csv, 'text/csv');
  };

  const handleExportCalendar = () => {
    audioEngine.playSfx('pop');
    const ics = generateIcsForFocusDay(state.tasks);
    downloadTextFile('nudgebuddy-schedule.ics', ics, 'text/calendar');
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
          <span className="nb-badge" style={{ background: '#93c5fd' }}>📂 Sync & Ecosystem</span>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Local Files & Backups</h3>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.85rem' }}>
          <button
            type="button"
            className="nb-btn"
            style={{ flex: 1, fontSize: '0.74rem', background: activeTab === 'markdown' ? '#ffe600' : '#ffffff' }}
            onClick={() => setActiveTab('markdown')}
          >
            <FileText size={13} /> Obsidian / Markdown
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{ flex: 1, fontSize: '0.74rem', background: activeTab === 'calendar' ? '#ffe600' : '#ffffff' }}
            onClick={() => setActiveTab('calendar')}
          >
            <Calendar size={13} /> Calendar .ics
          </button>
          <button
            type="button"
            className="nb-btn"
            style={{ flex: 1, fontSize: '0.74rem', background: activeTab === 'backup' ? '#ffe600' : '#ffffff' }}
            onClick={() => setActiveTab('backup')}
          >
            <Database size={13} /> JSON / CSV
          </button>
        </div>

        {/* Markdown Tab */}
        {activeTab === 'markdown' && (
          <div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
              Export or sync your tasks with your local Obsidian vault or Markdown notes (`tasks.md`).
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <button
                type="button"
                className="nb-btn nb-btn-primary"
                style={{ flex: 1, fontSize: '0.75rem' }}
                onClick={handleExportMarkdown}
              >
                <Download size={13} /> Download tasks.md
              </button>
            </div>

            <div style={{ borderTop: '1.5px solid #e2e8f0', paddingTop: '0.6rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.3rem' }}>
                Paste Markdown to Import Tasks:
              </label>
              <textarea
                rows={4}
                className="quick-capture-input"
                placeholder="- [ ] Write pitch deck (25m) #work !high&#10;- [ ] Clean apartment (15m) #home"
                value={mdInput}
                onChange={(e) => setMdInput(e.target.value)}
                style={{ marginBottom: '0.5rem', fontSize: '0.78rem' }}
              />
              <button
                type="button"
                className="nb-btn nb-btn-success"
                style={{ width: '100%', fontSize: '0.75rem' }}
                onClick={handleImportMarkdown}
                disabled={!mdInput.trim()}
              >
                <Upload size={13} /> Import Tasks from Markdown
              </button>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
              Export your focus sprint roadmap into Apple Calendar, Google Calendar, or Outlook as scheduled 25-minute blocks.
            </p>
            <button
              type="button"
              className="nb-btn nb-btn-primary"
              style={{ width: '100%', fontSize: '0.78rem', padding: '0.6rem' }}
              onClick={handleExportCalendar}
            >
              <Calendar size={15} /> Export Today's Sprints as .ics Calendar File
            </button>
          </div>
        )}

        {/* Backup Tab */}
        {activeTab === 'backup' && (
          <div>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginBottom: '0.75rem' }}>
              Download complete raw JSON backups of all your tasks, settings, and stats or export to CSV.
            </p>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem' }}>
              <button
                type="button"
                className="nb-btn nb-btn-primary"
                style={{ flex: 1, fontSize: '0.75rem' }}
                onClick={handleExportJSON}
              >
                <Download size={13} /> Export JSON Backup
              </button>
              <button
                type="button"
                className="nb-btn"
                style={{ flex: 1, fontSize: '0.75rem', background: '#ffffff' }}
                onClick={handleExportCSV}
              >
                <Download size={13} /> Export CSV Spreadsheet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
