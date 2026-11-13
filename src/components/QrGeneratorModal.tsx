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
            dark: '#1C1917',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-brand-border text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-secondary hover:text-brand-navy rounded-full hover:bg-brand-bg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <Smartphone className="w-5 h-5 text-brand-primary" />
          <h3 className="text-lg font-bold text-brand-navy">Scan with Phone Camera</h3>
        </div>
        <p className="text-xs text-text-secondary mb-4">
          Point your real phone camera at the QR code below. No app or login needed!
        </p>

        {/* Tag Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-brand-bg rounded-xl mb-4 border border-brand-border">
          {tags.map((t) => (
            <button
              key={t.code}
              onClick={() => setCode(t.code)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                code === t.code
                  ? 'bg-brand-primary text-brand-navy shadow-subtle'
                  : 'text-text-secondary hover:bg-brand-tint/60'
              }`}
            >
              <div className="font-mono text-[11px] font-bold">{t.code}</div>
              <div className="text-[9px] opacity-80 truncate">{t.label.split(' ')[0]}</div>
            </button>
          ))}
        </div>

        {/* QR Code Canvas Frame */}
        <div className="inline-block p-4 bg-white rounded-2xl shadow-inner border border-brand-border mb-4">
          <canvas ref={canvasRef} className="mx-auto" />
          <div className="mt-2 text-xs font-mono font-bold text-brand-navy tracking-wider">
            PINGME LIFELINE • {code}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-bg hover:bg-brand-tint text-brand-navy rounded-xl text-xs font-bold transition-colors border border-brand-border"
          >
            {copied ? <Check className="w-4 h-4 text-fresh-green" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
          <a
            href={`/t/${code}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-brand-primary hover:bg-brand-dark text-brand-navy rounded-xl text-xs font-black transition-colors shadow-subtle"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Open in Tab</span>
          </a>
        </div>
      </div>
    </div>
  );
}
