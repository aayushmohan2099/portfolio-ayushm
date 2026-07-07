// src/components/Title/HeaderComp/Left.jsx
import React, { useState, useEffect, useRef } from "react";

// ==========================================
// CONFIGURATION: MUSIC SETTINGS
// ==========================================
const DEFAULT_VOLUME = 0.05; // Volume from 0.0 (mute) to 1.0 (max)

// Add your tracks here. Ensure files exist in public/assets/music/
const TRACKS = [
  {
    id: 1,
    title: "Soldiers Rage",
    artist: "Tha Mechanic",
    src: "/music/01.mp3",
  },
  {
    id: 2,
    title: "Atmosphere 2",
    artist: "System",
    src: "/music/02.mp3",
  },
  {
    id: 3,
    title: "Ambient 3",
    artist: "System",
    src: "/music/03.mp3",
  },
];

const Left = ({ shouldStartMusic }) => {
  const audioRef = useRef(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(DEFAULT_VOLUME * 100);
  const [isCardOpen, setIsCardOpen] = useState(false); // Controls the dropdown card

  const currentTrack = TRACKS[currentTrackIndex];

  // Initialize Volume on mount
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = DEFAULT_VOLUME;
    }
  }, []);

  useEffect(() => {
    if (!shouldStartMusic || !audioRef.current) return;

    audioRef.current
      .play()
      .then(() => setIsPlaying(true))
      .catch(console.error);
  }, [shouldStartMusic]);

  const handleEnded = () => {
    handleNext();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const curr = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(curr);
      setDuration(dur || 0);
      setProgress((curr / dur) * 100 || 0);
    }
  };

  const handleScrub = (e) => {
    if (audioRef.current) {
      const scrubTime = (e.target.value / 100) * duration;
      audioRef.current.currentTime = scrubTime;
      setProgress(e.target.value);
    }
  };

  const handleVolume = (e) => {
    const newVol = e.target.value;
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="h-full w-full flex items-center justify-start pl-2 md:pl-4 mt-2">
      {/* Removed autoPlay. Handled strictly by the Enter button interaction */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        onEnded={handleEnded}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
      />

      {/* Internal CSS strictly adapted from the Uiverse snippet for the playing bars */}
      <style>{`
        @keyframes playing {
          0% { transform: scaleY(0.1); }
          33% { transform: scaleY(0.6); }
          66% { transform: scaleY(0.9); }
          100% { transform: scaleY(0.1); }
        }
        .anim-line {
          animation: playing 1s ease-in-out infinite;
          transform-origin: bottom;
        }
      `}</style>

      {/* Anchor container */}
      <div className="relative flex items-center z-[100] h-12 w-12">
        {/* Trigger Button: Shows the bouncing bars */}
        <button
          onClick={() => setIsCardOpen(!isCardOpen)}
          className="relative h-12 w-12 bg-card border border-border shadow-md rounded-md flex justify-center items-center overflow-hidden hover:bg-muted transition-colors cursor-pointer"
        >
          <div className="flex justify-center gap-[2px] w-[30px] h-[20px]">
            <div
              className="bg-foreground w-[2px] h-[20px] anim-line"
              style={{
                animationDelay: "0.2s",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            ></div>
            <div
              className="bg-foreground w-[2px] h-[20px] anim-line"
              style={{
                animationDelay: "0.5s",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            ></div>
            <div
              className="bg-foreground w-[2px] h-[20px] anim-line"
              style={{
                animationDelay: "0.6s",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            ></div>
            <div
              className="bg-foreground w-[2px] h-[20px] anim-line"
              style={{
                animationDelay: "0.0s",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            ></div>
            <div
              className="bg-foreground w-[2px] h-[20px] anim-line"
              style={{
                animationDelay: "0.4s",
                animationPlayState: isPlaying ? "running" : "paused",
              }}
            ></div>
          </div>
        </button>

        {/* EXPANDING CARD WIDGET
          Mobile: Fixed to the top, taking max width over everything.
          Desktop: Absolute positioned directly under the trigger button.
        */}
        <div
          className={`
            transition-all duration-300 ease-out origin-top-left overflow-hidden flex flex-col gap-2 p-3.5
            bg-card/95 backdrop-blur-xl border border-border shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] rounded-xl
            fixed top-20 left-4 right-4 z-[999] md:absolute md:top-[120%] md:left-0 md:right-auto md:w-[320px]
            ${isCardOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none hidden md:flex"}
          `}
        >
          {/* Top Section: Icon & Texts */}
          <div className="w-full flex items-center gap-3 mb-2 relative">
            <div className="h-10 w-10 bg-muted border border-border rounded flex justify-center items-center shrink-0">
              <div className="flex justify-center gap-[1px] w-[20px] h-[15px]">
                <div
                  className="bg-foreground w-[1.5px] h-full anim-line"
                  style={{
                    animationDelay: "0.2s",
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                ></div>
                <div
                  className="bg-foreground w-[1.5px] h-full anim-line"
                  style={{
                    animationDelay: "0.5s",
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                ></div>
                <div
                  className="bg-foreground w-[1.5px] h-full anim-line"
                  style={{
                    animationDelay: "0.6s",
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                ></div>
                <div
                  className="bg-foreground w-[1.5px] h-full anim-line"
                  style={{
                    animationDelay: "0.0s",
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                ></div>
                <div
                  className="bg-foreground w-[1.5px] h-full anim-line"
                  style={{
                    animationDelay: "0.4s",
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col overflow-hidden w-full">
              <p className="text-foreground text-lg font-black truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-muted-foreground text-xs opacity-80 truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Close Button for Mobile (Only visible on small screens) */}
            <button
              onClick={() => setIsCardOpen(false)}
              className="md:hidden absolute top-0 right-0 p-1 text-muted-foreground hover:text-foreground"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Controls Section */}
          <div className="text-foreground flex justify-evenly items-center w-full">
            {/* Volume Wrapper (Hover to expand slider) */}
            <div className="group/vol flex items-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height="20"
                width="24"
                className="cursor-pointer transition-colors hover:text-foreground/70"
              >
                <path
                  clipRule="evenodd"
                  d="M11.26 3.691A1.2 1.2 0 0 1 12 4.8v14.4a1.199 1.199 0 0 1-2.048.848L5.503 15.6H2.4a1.2 1.2 0 0 1-1.2-1.2V9.6a1.2 1.2 0 0 1 1.2-1.2h3.103l4.449-4.448a1.2 1.2 0 0 1 1.308-.26Zm6.328-.176a1.2 1.2 0 0 1 1.697 0A11.967 11.967 0 0 1 22.8 12a11.966 11.966 0 0 1-3.515 8.485 1.2 1.2 0 0 1-1.697-1.697A9.563 9.563 0 0 0 20.4 12a9.565 9.565 0 0 0-2.812-6.788 1.2 1.2 0 0 1 0-1.697Zm-3.394 3.393a1.2 1.2 0 0 1 1.698 0A7.178 7.178 0 0 1 18 12a7.18 7.18 0 0 1-2.108 5.092 1.2 1.2 0 1 1-1.698-1.698A4.782 4.782 0 0 0 15.6 12a4.78 4.78 0 0 0-1.406-3.394 1.2 1.2 0 0 1 0-1.698Z"
                  fillRule="evenodd"
                ></path>
              </svg>
              <div className="overflow-hidden w-0 opacity-0 group-hover/vol:w-20 group-hover/vol:opacity-100 transition-all duration-300 flex items-center pl-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolume}
                  className="w-full h-1 bg-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>

            {/* Prev Track */}
            <svg
              onClick={handlePrev}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="24"
              width="24"
              className="cursor-pointer transition-colors hover:text-foreground/70"
            >
              <path
                clipRule="evenodd"
                d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm.848-12.352a1.2 1.2 0 0 0-1.696-1.696l-3.6 3.6a1.2 1.2 0 0 0 0 1.696l3.6 3.6a1.2 1.2 0 0 0 1.696-1.696L11.297 13.2H15.6a1.2 1.2 0 1 0 0-2.4h-4.303l1.551-1.552Z"
                fillRule="evenodd"
              ></path>
            </svg>

            {/* Play/Pause */}
            <svg
              onClick={togglePlay}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="24"
              width="24"
              className="cursor-pointer transition-colors hover:text-foreground/70 scale-110"
            >
              {!isPlaying ? (
                // Play Icon (Solid Circle with Triangle)
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2ZM9.6 7.848v8.304a1.2 1.2 0 0 0 1.838.98l6.326-4.152a1.2 1.2 0 0 0 0-1.96l-6.326-4.152A1.2 1.2 0 0 0 9.6 7.848Z"
                ></path>
              ) : (
                // Pause Icon
                <path
                  clipRule="evenodd"
                  d="M21.6 12a9.6 9.6 0 1 1-19.2 0 9.6 9.6 0 0 1 19.2 0ZM8.4 9.6a1.2 1.2 0 1 1 2.4 0v4.8a1.2 1.2 0 1 1-2.4 0V9.6Zm6-1.2a1.2 1.2 0 0 0-1.2 1.2v4.8a1.2 1.2 0 1 0 2.4 0V9.6a1.2 1.2 0 0 0-1.2-1.2Z"
                  fillRule="evenodd"
                ></path>
              )}
            </svg>

            {/* Next Track */}
            <svg
              onClick={handleNext}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height="24"
              width="24"
              className="cursor-pointer transition-colors hover:text-foreground/70"
            >
              <path
                clipRule="evenodd"
                d="M12 21.6a9.6 9.6 0 1 0 0-19.2 9.6 9.6 0 0 0 0 19.2Zm4.448-10.448-3.6-3.6a1.2 1.2 0 0 0-1.696 1.696l1.551 1.552H8.4a1.2 1.2 0 1 0 0 2.4h4.303l-1.551 1.552a1.2 1.2 0 1 0 1.696 1.696l3.6-3.6a1.2 1.2 0 0 0 0-1.696Z"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>

          {/* Song Time & Progress Bar */}
          <div className="w-full relative flex items-center gap-2 mt-1">
            <p className="text-[0.7rem] bg-black/40 dark:bg-black/60 text-white px-2 py-1 rounded-md font-mono shrink-0 shadow-inner">
              {formatTime(currentTime)}
            </p>

            {/* Functional Progress Slider */}
            <div className="relative w-full h-1.5 bg-muted rounded-full cursor-pointer flex items-center group/progress">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleScrub}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className="absolute left-0 top-0 h-full bg-foreground rounded-full pointer-events-none transition-all duration-75"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-[0.7rem] bg-black/40 dark:bg-black/60 text-white px-2 py-1 rounded-md font-mono shrink-0 shadow-inner">
              {formatTime(duration)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Left;
