import React, { useState, useEffect } from 'react';
import { SoundscapeType, soundscapeEngine } from '../../core/soundscapeEngine';
import { Volume2, VolumeX, Headphones, Play, Square } from 'lucide-react';

interface SoundscapePlayerProps {
  isTimerRunning: boolean;
}

export const SoundscapePlayer: React.FC<SoundscapePlayerProps> = ({ isTimerRunning }) => {
  const [selectedType, setSelectedType] = useState<SoundscapeType>('none');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.4);

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
    <div style={{ background: '#f8fafc', border: '1.8px solid #121826', borderRadius: '8px', padding: '0.45rem 0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700 }}>
        <Headphones size={13} color="#6366f1" />
        <span>Soundscape:</span>
        <select
          value={selectedType}
          onChange={(e) => handleSelectType(e.target.value as SoundscapeType)}
          style={{ padding: '0.2rem 0.35rem', borderRadius: '5px', border: '1.2px solid #121826', fontSize: '0.72rem', fontWeight: 600, background: '#ffffff' }}
        >
          <option value="none">Off</option>
          <option value="brown_noise">🌊 Brown Noise</option>
          <option value="rain">🌧️ Rain on Window</option>
          <option value="binaural_40hz">⚡ 40Hz Gamma Beats</option>
          <option value="lofi_drone">🌆 Lo-Fi Pad</option>
        </select>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={togglePlay}
          className="nb-btn"
          style={{ padding: '0.2rem 0.45rem', fontSize: '0.7rem', background: isPlaying ? '#fca5a5' : '#86efac' }}
          title={isPlaying ? 'Pause soundscape' : 'Play soundscape'}
        >
          {isPlaying ? <Square size={10} fill="#121826" /> : <Play size={10} fill="#121826" />}
          <span>{isPlaying ? 'Stop' : 'Play'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Volume2 size={12} color="#64748b" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            style={{ width: '45px', cursor: 'pointer' }}
            title={`Volume: ${Math.round(volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
