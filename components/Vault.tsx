"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Vault({ onHashGenerated }: { onHashGenerated: (hash: string, fileName: string) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [hashProgress, setHashProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setIsHashing(true);
    setHashProgress(0);

    // Simulate progress for visual effect
    const progressInterval = setInterval(() => {
      setHashProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = "0x" + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      clearInterval(progressInterval);
      setHashProgress(100);

      console.log(`[OK] SHA-256 hash for ${selectedFile.name}: ${hashHex}`);

      setTimeout(() => {
        onHashGenerated(hashHex, selectedFile.name);
      }, 300);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("[ERR] Hashing failed", error);
    } finally {
      setIsHashing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const progressBarWidth = Math.min(Math.round(hashProgress / 5), 20);
  const progressBar = "[" + "█".repeat(progressBarWidth) + "░".repeat(20 - progressBarWidth) + "]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        className={`terminal-window transition-all duration-200 ${
          dragActive ? "border-terminal-green glow-box" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {/* Title Bar */}
        <div className="border-b border-terminal-border px-4 py-2 flex items-center justify-between">
          <span className="text-terminal-muted text-xs">
            +--- SECURE VAULT ---+
          </span>
          <span className="text-terminal-muted text-xs">
            SHA-256 // LOCAL
          </span>
        </div>

        <div className="p-6 min-h-[280px] flex flex-col justify-center">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
          />

          {!file ? (
            <div className="text-center space-y-4">
              {/* ASCII Art Upload Icon */}
              <pre className="text-terminal-green glow text-xs leading-tight inline-block mx-auto">
{`     ┌──────────┐
     │  ▲ FILE  │
     │  │       │
     │  │       │
     └──────────┘`}
              </pre>

              <div className="space-y-2">
                <p className="text-terminal-green text-sm glow">
                  $ awaiting file input...
                </p>
                <p className="text-terminal-muted text-xs">
                  {">"} drag & drop any file to generate cryptographic proof
                </p>
                <p className="text-terminal-muted text-xs">
                  {">"} all hashing runs locally. zero data transmitted.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="terminal-btn text-xs"
                >
                  [ SELECT FILE ]
                </button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3 text-xs"
            >
              {/* File Info */}
              <div className="text-terminal-muted">
                <span className="text-terminal-amber glow-amber">$</span> file loaded:
              </div>
              <div className="terminal-window p-3 space-y-1">
                <p className="text-terminal-green">
                  name: <span className="text-terminal-amber">{file.name}</span>
                </p>
                <p className="text-terminal-green">
                  size: <span className="text-terminal-amber">{(file.size / 1024).toFixed(2)} KB</span>
                </p>
                <p className="text-terminal-green">
                  type: <span className="text-terminal-amber">{file.type || "unknown"}</span>
                </p>
              </div>

              {/* Hashing Progress */}
              {isHashing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1"
                >
                  <p className="text-terminal-amber glow-amber">
                    {">"} running SHA-256 engine...
                  </p>
                  <p className="text-terminal-green terminal-progress glow">
                    {progressBar} {Math.round(hashProgress)}%
                  </p>
                </motion.div>
              )}

              {!isHashing && hashProgress >= 100 && (
                <p className="text-terminal-green glow">
                  [OK] hash generated successfully
                </p>
              )}

              {!isHashing && (
                <button
                  onClick={() => {
                    setFile(null);
                    setHashProgress(0);
                    onHashGenerated("", "");
                  }}
                  className="text-terminal-muted hover:text-terminal-green text-xs transition"
                >
                  {">"} select different file_
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
