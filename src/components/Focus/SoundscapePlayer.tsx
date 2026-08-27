import React, { useState, useEffect } from 'react';
import { SoundscapeType, soundscapeEngine } from '../../core/soundscapeEngine';
import { Volume2, Headphones, Play, Square } from 'lucide-react';

interface SoundscapePlayerProps {
  isTimerRunning: boolean;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ isTimerRunning }) => {
  const [selectedType, setSelectedType] = useState<SoundscapeType>('none');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.35);

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
    <div style={{ background: '#fdfbf7', border: '1.5px solid var(--border-subtle)', borderRadius: '14px', padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.75rem', boxShadow: '0 2px 8px rgba(49, 78, 62, 0.04)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: 'var(--color-matcha-dark)' }}>
        <Headphones size={13} color="#588157" />
        <span>Ambience:</span>
        <select
          value={selectedType}
          onChange={(e) => handleSelectType(e.target.value as SoundscapeType)}
          style={{ padding: '0.25rem 0.45rem', borderRadius: '8px', border: '1.2px solid var(--border-dark)', fontSize: '0.72rem', fontWeight: 600, background: '#ffffff', color: 'var(--text-main)', outline: 'none' }}
        >
          <option value="none">Silent</option>
          <option value="brown_noise">🍵 Zen Garden (Brown Noise)</option>
          <option value="rain">🌧️ Soft Rain on Cedar</option>
          <option value="binaural_40hz">⚡ 40Hz Calm Gamma Waves</option>
          <option value="lofi_drone">📻 Lofi Tea Room</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={togglePlay}
          className="nb-btn"
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', background: isPlaying ? '#fcece9' : '#e3ede5', color: isPlaying ? '#c85a54' : '#344e41', border: '1.2px solid var(--border-dark)' }}
          title={isPlaying ? 'Pause ambience' : 'Play ambience'}
        >
          {isPlaying ? <Square size={10} fill="#c85a54" /> : <Play size={10} fill="#344e41" />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Volume2 size={12} color="#6b7c72" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            style={{ width: '42px', cursor: 'pointer', accentColor: '#588157' }}
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
