import React, { useState, useEffect } from 'react';
import { SoundscapeType, soundscapeEngine } from '../../core/soundscapeEngine';
import { Volume2, Headphones, Play, Square } from 'lucide-react';

interface SoundscapePlayerProps {
  isTimerRunning: boolean;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ isTimerRunning }) => {
  const [selectedType, setSelectedType] = useState<SoundscapeType>('none');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.3);

  // Auto-play selected soundscape during active focus sprint if one is chosen
  useEffect(() => {
    if (isTimerRunning && selectedType !== 'none' && !isPlaying) {
      soundscapeEngine.startSoundscape(selectedType);
      setIsPlaying(true);
    } else if (!isTimerRunning && isPlaying) {
      soundscapeEngine.stopSoundscape();
      setIsPlaying(false);
    }
  }, [isTimerRunning, selectedType]);

  const handleSelectType = (type: SoundscapeType) => {
    setSelectedType(type);
    if (type === 'none') {
      soundscapeEngine.stopSoundscape();
      setIsPlaying(false);
    } else {
      soundscapeEngine.startSoundscape(type);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      soundscapeEngine.stopSoundscape();
      setIsPlaying(false);
    } else {
      const typeToPlay = selectedType === 'none' ? 'brown_noise' : selectedType;
      setSelectedType(typeToPlay);
      soundscapeEngine.startSoundscape(typeToPlay);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundscapeEngine.setVolume(newVol);
  };

  return (
    <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '0.45rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.74rem', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
        <Headphones size={13} color="#6366f1" />
        <span>Ambience:</span>
        <select
          value={selectedType}
          onChange={(e) => handleSelectType(e.target.value as SoundscapeType)}
          style={{ padding: '0.2rem 0.4rem', borderRadius: '6px', border: '1px solid var(--border-dark)', fontSize: '0.72rem', fontWeight: 500, background: '#ffffff', color: 'var(--text-main)', outline: 'none' }}
        >
          <option value="none">Silent</option>
          <option value="brown_noise">🌌 Deep Resonance (Brown Noise)</option>
          <option value="rain">🌧️ Ethereal Rain</option>
          <option value="binaural_40hz">⚡ 40Hz Theta/Gamma Waves</option>
          <option value="lofi_drone">🕯️ Quiet Sanctuary Drone</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <button
          type="button"
          onClick={togglePlay}
          className="nb-btn"
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', background: isPlaying ? '#fef2f2' : '#eef2ff', color: isPlaying ? '#ef4444' : '#4f46e5', border: '1px solid var(--border-subtle)' }}
          title={isPlaying ? 'Pause ambience' : 'Play ambience'}
        >
          {isPlaying ? <Square size={10} fill="#ef4444" /> : <Play size={10} fill="#4f46e5" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Volume2 size={12} color="#94a3b8" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            style={{ width: '38px', cursor: 'pointer', accentColor: '#6366f1' }}
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
