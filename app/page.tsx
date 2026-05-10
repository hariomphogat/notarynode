"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import WalletConnect from "@/components/WalletConnect";
import Vault from "@/components/Vault";
import FeatureGrid from "@/components/FeatureGrid";
import { notarizeHash, verifyHash } from "@/lib/web3";
import { ethers } from "ethers";

/* ===== Typewriter Hook ===== */
function useTypewriter(text: string, speed: number = 40) {
  const [displayText, setDisplayText] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayText("");
    setDone(false);
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(timer);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, done };
}

/* ===== Stats Data ===== */
const stats = [
  { label: "HASHING ENGINE", value: "SHA-256", sub: "client-side" },
  { label: "DATA UPLOADED", value: "0 BYTES", sub: "100% private" },
  { label: "NETWORK", value: "POLYGON", sub: "amoy testnet" },
  { label: "COST", value: "~FREE", sub: "testnet gas only" },
];

export default function Home() {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [currentHash, setCurrentHash] = useState("");
  const [currentFileName, setCurrentFileName] = useState("");

  const [status, setStatus] = useState<"idle" | "verifying" | "notarizing" | "success" | "error" | "found">("idle");
  const [message, setMessage] = useState("");
  const [txHash, setTxHash] = useState("");

  const heroText = "THE IMMUTABLE TRUTH FOR YOUR DIGITAL ASSETS.";
  const { displayText: heroTyped, done: heroDone } = useTypewriter(heroText, 35);

  const handleConnect = (walletSigner: ethers.Signer | null, address: string) => {
    setSigner(walletSigner);
    setUserAddress(address);
  };

  const handleHashGenerated = async (hash: string, fileName: string) => {
    setCurrentHash(hash);
    setCurrentFileName(fileName);
    setStatus("idle");
    setMessage("");
    setTxHash("");

    if (!hash) return;
    if (!signer) {
      setMessage("[ERR] wallet not connected. run: connect --wallet");
      setStatus("error");
      return;
    }

    try {
      setStatus("verifying");
      const timestamp = await verifyHash(signer.provider!, hash);
      if (timestamp > BigInt(0)) {
        const date = new Date(Number(timestamp) * 1000).toLocaleString();
        setStatus("found");
        setMessage(`[OK] proof located. notarized: ${date}`);
      } else {
        setStatus("idle");
        setMessage("[OK] hash is unique. ready to seal on-chain.");
      }
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.message || "[ERR] blockchain verification failed.");
    }
  };

  const handleSeal = async () => {
    if (!signer || !currentHash) return;

    try {
      setStatus("notarizing");
      setMessage("> broadcasting transaction to polygon amoy...");
      const receipt = await notarizeHash(signer, currentHash);
      setStatus("success");
      setMessage("[OK] file sealed on polygon amoy blockchain.");
      setTxHash(receipt.hash || receipt.transactionHash);
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMessage(err.shortMessage || err.message || "[ERR] transaction rejected.");
    }
  };

  return (
    <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col min-h-screen relative z-1">

      {/* ===== HEADER ===== */}
      <header className="flex justify-between items-center w-full mb-10 border-b border-terminal-border pb-4">
        <div className="flex items-center gap-3">
          <span className="text-terminal-green glow text-sm font-bold tracking-widest">
            {">"}_ NOTARYNODE.EXE
          </span>
          <span className="text-terminal-muted text-[10px]">v1.0.0</span>
        </div>
        <WalletConnect onConnect={handleConnect} />
      </header>

      {/* ===== HERO ===== */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        {/* Status line */}
        <p className="text-terminal-muted text-xs mb-6 flicker">
          {">"} INITIALIZING SYSTEM PROTOCOLS...
        </p>

        {/* ASCII Logo */}
        <pre className="text-terminal-green glow text-[8px] sm:text-[10px] md:text-xs leading-tight mb-8 hidden sm:block">
          {`███╗   ██╗ ██████╗ ████████╗ █████╗ ██████╗ ██╗   ██╗
████╗  ██║██╔═══██╗╚══██╔══╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██╔██╗ ██║██║   ██║   ██║   ███████║██████╔╝ ╚████╔╝
██║╚██╗██║██║   ██║   ██║   ██╔══██║██╔══██╗  ╚██╔╝
██║ ╚████║╚██████╔╝   ██║   ██║  ██║██║  ██║   ██║
╚═╝  ╚═══╝ ╚═════╝    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝`}
        </pre>

        {/* Typewriter Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-5xl text-terminal-green glow font-bold tracking-wider uppercase leading-tight mb-6">
          {heroTyped}
          {!heroDone && <span className="cursor-blink">█</span>}
        </h1>

        {/* Description block with left border (like reference) */}
        <div className="border-l-2 border-terminal-muted pl-4 max-w-2xl space-y-2 mb-8">
          <p className="text-terminal-green/70 text-sm">
            Notarize documents, certificates, and IP on the blockchain.
            Instant proof. Zero data storage. 100% private.
          </p>
        </div>

        {/* CTA Buttons (like reference) */}
        <div className="flex flex-wrap gap-4">
          <a href="#vault" className="terminal-btn-filled text-xs px-6 py-2.5 inline-block">
            Start Notarizing
          </a>
          <a href="#how" className="terminal-btn text-xs px-6 py-2.5 inline-block">
            [ How It Works ]
          </a>
        </div>
      </motion.section>

      {/* ===== STATUS BAR ===== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mb-12"
      >
        <p className="text-terminal-amber text-[10px] glow-amber mb-6">
          STATUS: Decentralized notarization powered by Polygon Amoy Testnet
        </p>

        {/* Stats Grid (like reference) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="stat-card"
            >
              <p className="text-terminal-muted text-[10px] uppercase tracking-wider mb-2">
                {stat.label}
              </p>
              <p className="text-terminal-green text-xl sm:text-2xl font-bold glow">
                {stat.value}
              </p>
              <p className="text-terminal-amber text-[10px] mt-1">
                {stat.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ===== DASHED SEPARATOR ===== */}
      <hr className="dashed-sep" />

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="mb-12">
        <h2 className="text-lg text-terminal-green glow uppercase tracking-widest mb-6">
          $ notarynode --help
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Explanation */}
          <div className="space-y-4">
            <p className="text-terminal-green/70 text-xs leading-relaxed">
              <span className="text-terminal-amber glow-amber">{">>"}</span> NotaryNode uses client-side
              SHA-256 hashing to generate a unique cryptographic fingerprint of your
              file — directly in your browser. No data ever leaves your machine.
            </p>
            <p className="text-terminal-green/70 text-xs leading-relaxed">
              <span className="text-terminal-amber glow-amber">{">>"}</span> The fingerprint is then stored
              on the Polygon Amoy blockchain with an immutable timestamp, proving
              your file existed at that exact moment. Re-uploading the same file
              will instantly verify its proof.
            </p>

            {/* Terminal-style process log */}
            <div className="terminal-window p-3 mt-4">
              <p className="text-terminal-muted text-[10px] mb-1">root@notarynode:~$ ./notarize.sh</p>
              <p className="text-terminal-green text-[10px]">... reading file buffer</p>
              <p className="text-terminal-green text-[10px]">... computing SHA-256 hash (local)</p>
              <p className="text-terminal-green text-[10px]">... broadcasting to polygon amoy</p>
              <p className="text-terminal-green text-[10px]">... awaiting block confirmation</p>
              <p className="text-terminal-amber text-[10px] glow-amber">Done. Proof sealed.</p>
            </div>
          </div>

          {/* Right: Privacy Box */}
          <div className="terminal-window p-4 flex flex-col justify-center">
            <div className="border border-terminal-amber/30 p-4 mb-4">
              <p className="text-terminal-amber text-xs glow-amber font-bold mb-2">
                ⚠ PRIVACY NOTICE:
              </p>
              <p className="text-terminal-amber/70 text-[11px] leading-relaxed">
                We never see your files. Our local SHA-256 engine generates a
                unique cryptographic fingerprint right in your browser.
                Only the fingerprint is stored on-chain. Open DevTools → Network
                tab during upload to verify: zero bytes transmitted.
              </p>
            </div>
            <div className="text-center">
              <pre className="text-terminal-green/30 text-[8px] leading-tight inline-block">
                {`┌─────────────────────────┐
│   YOUR BROWSER          │
│   ┌───────────────┐     │
│   │  FILE → SHA256 │     │
│   └───────┬───────┘     │
│           │  hash only  │
│           ▼             │
│   ┌───────────────┐     │
│   │  BLOCKCHAIN   │     │
│   └───────────────┘     │
└─────────────────────────┘`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DASHED SEPARATOR ===== */}
      <hr className="dashed-sep" />

      {/* ===== VAULT ===== */}
      <section id="vault" className="mb-8">
        <Vault onHashGenerated={handleHashGenerated} />
      </section>

      {/* ===== STATUS AREA ===== */}
      {currentHash && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto w-full mb-8"
        >
          {/* Hash Display */}
          <div className="terminal-window p-3 mb-4">
            <p className="text-terminal-muted text-[10px] mb-1">GENERATED HASH:</p>
            <p className="text-terminal-green text-[10px] glow break-all">
              {currentHash}
            </p>
          </div>

          {status === "verifying" && (
            <div className="terminal-window p-4">
              <p className="text-terminal-amber text-xs glow-amber animate-pulse">
                {">"} querying blockchain for existing proof...
                <span className="cursor-blink">█</span>
              </p>
            </div>
          )}

          {(status === "idle" && message) && (
            <div className="terminal-window p-4 space-y-4">
              <p className="text-terminal-green text-xs glow">{message}</p>
              <button
                onClick={handleSeal}
                className="terminal-btn-filled text-xs w-full py-3 glitch-hover"
              >
                [ SEAL ON BLOCKCHAIN ]
              </button>
            </div>
          )}

          {status === "notarizing" && (
            <div className="terminal-window p-4 border-terminal-amber/50">
              <p className="text-terminal-amber text-xs glow-amber animate-pulse">
                {message}
                <span className="cursor-blink">█</span>
              </p>
              <p className="text-terminal-muted text-[10px] mt-2">
                awaiting metamask confirmation...
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="terminal-window p-4" style={{ borderColor: 'rgba(255,51,51,0.5)' }}>
              <p className="text-terminal-red text-xs">
                {message}
              </p>
            </div>
          )}

          {status === "found" && (
            <div className="terminal-window p-4 glow-box">
              <p className="text-terminal-green text-sm glow font-bold mb-1">
                ✓ PROOF VERIFIED
              </p>
              <p className="text-terminal-green/80 text-xs">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="terminal-window p-4 glow-box">
              <p className="text-terminal-green text-sm glow font-bold mb-1">
                ✓ TRANSACTION CONFIRMED
              </p>
              <p className="text-terminal-green/80 text-xs mb-2">{message}</p>
              {txHash && (
                <a
                  href={`https://amoy.polygonscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-terminal-amber text-xs glow-amber hover:underline"
                >
                  {">"} view on polygonscan: {txHash.slice(0, 20)}...
                </a>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* ===== DASHED SEPARATOR ===== */}
      <hr className="dashed-sep" />

      {/* ===== FEATURE GRID ===== */}
      <FeatureGrid />

      {/* ===== FOOTER ===== */}
      <footer className="mt-auto pt-6 pb-4">
        <hr className="dashed-sep" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 mt-4">
          <p className="text-terminal-muted text-[10px]">
            © {new Date().getFullYear()} Hariom Phogat // NotaryNode — Decentralized Evidence Management
          </p>
          <p className="text-terminal-muted text-[10px]">
            network: polygon amoy testnet // chain_id: 80002
          </p>
        </div>
      </footer>
    </main>
  );
}
