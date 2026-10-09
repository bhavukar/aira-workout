'use client';

import React, { useState } from 'react';

interface TalkOverDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitCommand: (command: string) => void;
}

export default function TalkOverDrawer({
  isOpen,
  onClose,
  onSubmitCommand,
}: TalkOverDrawerProps) {
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsSubmitting(true);
      onSubmitCommand(inputValue.trim());
      setTimeout(() => {
        setIsSubmitting(false);
        setInputValue('');
      }, 400);
    }
  };

  const handleChipClick = (text: string) => {
    setIsSubmitting(true);
    onSubmitCommand(text);
    setTimeout(() => {
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="absolute inset-x-0 bottom-0 top-[20%] bg-white/95 backdrop-blur-2xl rounded-t-[40px] p-5 z-40 shadow-[0_-12px_40px_rgba(0,0,0,0.12)] flex flex-col justify-between border-t border-black/5 animate-slideUp font-sans">
      {/* Top iOS Sheet Grab Handle */}
      <div className="w-12 h-1 rounded-full bg-neutral-300 mx-auto -mt-1 mb-3 pointer-events-none" />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#141414] text-white flex items-center justify-center shadow-xs">
              <i className="bx bx-microphone text-base text-[#F2541A]"></i>
            </div>
            <div>
              <span className="text-sm font-bold text-neutral-950 block">
                {isSubmitting ? 'AiRA Adapting...' : 'Talk Over AiRA'}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">
                Continuous Duplex Voice Channel
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 hover:text-neutral-950 transition-colors"
            aria-label="Close"
          >
            <i className="bx bx-x text-2xl"></i>
          </button>
        </div>

        <p className="text-xs text-neutral-500 leading-snug">
          Cut in mid-sentence anytime. AiRA adapts biomechanics, pacing, or cues instantly:
        </p>

        {/* Quick Suggestion Prompt Stadium Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => handleChipClick('My knee hurts, give me an alternative')}
            className="w-full py-3.5 px-5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-left text-xs text-neutral-900 font-bold flex items-center justify-between transition-all active:scale-[0.99] group"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-refresh text-[#F2541A] text-base group-hover:rotate-180 transition-transform duration-300"></i>
              &quot;My knee hurts, swap this&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400"></i>
          </button>

          <button
            onClick={() => handleChipClick('Need extra rest, heart rate is too high')}
            className="w-full py-3.5 px-5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-left text-xs text-neutral-900 font-bold flex items-center justify-between transition-all active:scale-[0.99] group"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-wind text-sky-600 text-base"></i>
              &quot;Need extra rest, add 20s&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400"></i>
          </button>

          <button
            onClick={() => handleChipClick("Make it harder, let's go all out")}
            className="w-full py-3.5 px-5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-left text-xs text-neutral-900 font-bold flex items-center justify-between transition-all active:scale-[0.99] group"
          >
            <span className="flex items-center gap-2">
              <i className="bx bxs-zap text-[#F2541A] text-base"></i>
              &quot;Make it harder, Zone 5 push&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400"></i>
          </button>

          <button
            onClick={() => handleChipClick('Finish workout and show my summary')}
            className="w-full py-3.5 px-5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/80 text-left text-xs text-neutral-900 font-bold flex items-center justify-between transition-all active:scale-[0.99] group"
          >
            <span className="flex items-center gap-2">
              <i className="bx bx-check-shield text-emerald-600 text-base"></i>
              &quot;Finish workout and debrief&quot;
            </span>
            <i className="bx bx-chevron-right text-neutral-400"></i>
          </button>
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-3 border-t border-black/5 pb-1">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Speak or type a command..."
          className="flex-1 px-4 py-3.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#141414]"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="w-11 h-11 rounded-full bg-[#141414] text-white flex items-center justify-center disabled:opacity-40 hover:bg-black transition-all active:scale-95 shadow-xs flex-shrink-0"
        >
          <i className="bx bx-send text-base"></i>
        </button>
      </form>
    </div>
  );
}
