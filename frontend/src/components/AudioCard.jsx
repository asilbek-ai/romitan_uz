import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiVolume2, FiVolumeX } from 'react-icons/fi';

export default function AudioCard({ audio, onDelete, isAdmin }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current.currentTime);
      });
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolume = (e) => {
    const val = e.target.value / 100;
    setVolume(val);
    audioRef.current.volume = val;
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Waveform style bars animation
  const waveformBars = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className="w-1 bg-primary rounded-full"
      animate={{
        height: isPlaying ? [8, 20, 12, 24, 8] : 8,
      }}
      transition={{
        duration: 0.5,
        repeat: Infinity,
        delay: i * 0.05,
        ease: "easeInOut"
      }}
      style={{ height: isPlaying ? 8 : 8 }}
    />
  ));

  return (
    <div className="p-4 transition-all duration-300 bg-white rounded-xl shadow hover:shadow-lg">
      <audio ref={audioRef} src={audio.url} preload="metadata" />
      
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="relative flex-shrink-0 w-16 h-16 overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
          {audio.thumbnail ? (
            <img src={audio.thumbnail} alt={audio.title} className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <FiMusic className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>

        {/* Info & Player */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold truncate">{audio.title}</h4>
          <p className="text-xs text-gray-500 truncate">{audio.description}</p>
          <p className="text-xs text-primary mt-0.5">{audio.category}</p>

          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={duration ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="flex-1 h-1 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-primary"
            />
            <span className="text-xs text-gray-500">{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-primary hover:bg-primary/90"
            >
              {isPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex items-center gap-1">
              <button onClick={toggleMute} className="text-gray-500 hover:text-primary">
                {isMuted ? <FiVolumeX className="w-4 h-4" /> : <FiVolume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume * 100}
                onChange={handleVolume}
                className="w-20 h-1 rounded-lg appearance-none cursor-pointer bg-gray-200 accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Waveform visualization */}
        <div className="hidden sm:flex items-center gap-0.5 h-8">
          {waveformBars}
        </div>

        {isAdmin && (
          <button
            onClick={() => onDelete?.(audio.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <FiX className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}