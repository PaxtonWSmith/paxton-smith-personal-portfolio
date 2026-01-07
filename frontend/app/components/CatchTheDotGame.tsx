"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  size?: number;
  timeLimit?: number;
};

export default function CatchTheDotGame({ size = 320, timeLimit = 20 }: Props) {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moveInterval = useRef<number | null>(null);

  const placeDot = () => {
    setPos({
      x: Math.random() * 80 + 10, // keep inside bounds (10% - 90%)
      y: Math.random() * 80 + 10,
    });
  };

  useEffect(() => {
    if (!playing) return;

    setTimeLeft(timeLimit);
    setScore(0);
    placeDot();

    const tick = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    // move dot periodically to keep the game dynamic
    moveInterval.current = window.setInterval(() => {
      placeDot();
    }, 900);

    return () => {
      clearInterval(tick);
      if (moveInterval.current) clearInterval(moveInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    if (timeLeft <= 0 && playing) {
      setPlaying(false);
      if (moveInterval.current) clearInterval(moveInterval.current);
    }
  }, [timeLeft, playing]);

  const handleStart = () => {
    setPlaying(true);
  };

  const handleReset = () => {
    setPlaying(false);
    setScore(0);
    setTimeLeft(timeLimit);
    placeDot();
  };

  const handleHit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!playing) return;
    setScore((s) => s + 1);
    placeDot();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (!playing) return;
      setScore((s) => s + 1);
      placeDot();
    }
  };

  return (
    <div style={{ textAlign: "center", fontFamily: 'inherit' }}>
      <div style={{ marginBottom: 8, color: 'inherit' }}>
        <strong>Catch the Dot</strong> — click the dot to score points
      </div>

      <div
        ref={containerRef}
        className="catch-game-container"
        style={{
          width: size,
          height: size,
          margin: '0 auto',
          position: 'relative',
          borderRadius: 12,
          background: 'rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => {
          // miss click moves dot a little
          if (playing) placeDot();
        }}
      >
        {/* dot */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleHit}
          onKeyDown={handleKeyDown}
          className="catch-dot"
          style={{
            position: 'absolute',
            left: `${pos.x}%`,
            top: `${pos.y}%`,
            transform: 'translate(-50%, -50%)',
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #fff, #ffd1e6 30%, #ff6b9a 60%)',
            boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
            cursor: playing ? 'pointer' : 'default',
            transition: 'transform 0.08s linear',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 10 }}>
        <button onClick={handleStart} style={{ padding: '8px 12px', borderRadius: 8 }}>
          Start
        </button>
        <button onClick={handleReset} style={{ padding: '8px 12px', borderRadius: 8 }}>
          Reset
        </button>
      </div>

      <div style={{ marginTop: 10, color: 'inherit' }}>
        <span style={{ marginRight: 12 }}><strong>Score:</strong> {score}</span>
        <span><strong>Time:</strong> {timeLeft}s</span>
      </div>
    </div>
  );
}
