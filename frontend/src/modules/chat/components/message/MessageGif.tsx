"use client";

import { Download } from "lucide-react";
import { useRef, useState } from "react";

interface MessageGifProps {
  url: string;
}

export function MessageGif({ url }: MessageGifProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      className="relative mb-2 overflow-hidden rounded-lg bg-black/5"
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen(true);
      }}
      onMouseDown={() => {
        clearPress();
        timerRef.current = setTimeout(() => setMenuOpen(true), 450);
      }}
      onMouseUp={clearPress}
      onMouseLeave={clearPress}
      onTouchStart={() => {
        clearPress();
        timerRef.current = setTimeout(() => setMenuOpen(true), 450);
      }}
      onTouchEnd={clearPress}
      onTouchCancel={clearPress}
    >
      <img
        src={url}
        alt="GIF message"
        className="max-h-64 w-full object-cover"
        draggable={false}
      />

      {menuOpen ? (
        <div className="absolute inset-0 grid place-items-center bg-black/35 p-3">
          <a
            href={url}
            download
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[var(--dove-primary)] shadow-lg"
            onClick={() => setMenuOpen(false)}
          >
            <Download className="size-4" />
            Tai xuong
          </a>
        </div>
      ) : null}
    </div>
  );
}
