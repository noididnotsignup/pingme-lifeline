'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, ExternalLink, Smartphone, Check } from 'lucide-react';

interface QrGeneratorModalProps {
  initialCode?: string;
  onClose: () => void;
}

export function QrGeneratorModal({ initialCode = 'LIFE-9021', onClose }: QrGeneratorModalProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const tags = [
    { code: 'LIFE-9021', label: 'Rohan Sharma', tagType: 'Vehicle Tag' },
    { code: 'LIFE-4412', label: 'Sunita Verma', tagType: 'Elder Wristband' },
    { code: 'LIFE-7703', label: 'Aarav Patel', tagType: 'Child ID Card' },
  ];

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/t/${code}`
    : `https://pingme-lifeline.vercel.app/t/${code}`;

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(
        canvasRef.current,
        currentUrl,
        {
          width: 240,
          margin: 2,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
        },
        (error) => {
          if (error) console.error('QR code generation error:', error);
        }
      );
    }
  }, [code, currentUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Smartphone className="w-5 h-5 text-emergency-600" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Scan with Phone Camera</h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Point your real phone camera at the QR code below. No app or login needed!
        </p>

        {/* Tag Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl mb-4">
          {tags.map((t) => (
            <button
              key={t.code}
              onClick={() => setCode(t.code)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                code === t.code
                  ? 'bg-emergency-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <div className="font-mono text-[11px]">{t.code}</div>
              <div className="text-[9px] opacity-80 truncate">{t.label.split(' ')[0]}</div>
            </button>
          ))}
        </div>

        {/* QR Code Canvas Frame */}
        <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border border-slate-200 mb-4">
          <canvas ref={canvasRef} className="mx-auto" />
          <div className="mt-2 text-xs font-mono font-bold text-slate-800 tracking-wider">
            PINGME LIFELINE • {code}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
          <a
            href={`/t/${code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emergency-600 hover:bg-emergency-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-emergency"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Tab</span>
          </a>
        </div>
      </div>
    </div>
  );
}
