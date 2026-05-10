"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function WalletConnect({ onConnect }: { onConnect: (signer: any, address: string) => void }) {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const { connectWallet } = await import("@/lib/web3");
      const { signer, address } = await connectWallet();
      setAddress(address);
      localStorage.removeItem("walletDisconnected");
      onConnect(signer, address);
    } catch (error: any) {
      console.error("Connection error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    localStorage.setItem("walletDisconnected", "true");
    onConnect(null, "");
  };

  return (
    <div>
      {address ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="terminal-window flex items-center gap-3 px-4 py-2"
        >
          <span className="text-terminal-green cursor-blink text-sm">█</span>
          <span className="text-terminal-green text-xs glow">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="text-terminal-muted text-xs">|</span>
          <span className="text-terminal-green text-xs">AMOY</span>
          <button
            onClick={disconnect}
            className="text-terminal-red text-xs hover:bg-terminal-red hover:text-[#0a0a0a] px-2 py-0.5 border border-terminal-red/30 hover:border-terminal-red transition-all"
          >
            [DISCONNECT]
          </button>
        </motion.div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="terminal-btn text-xs glitch-hover"
        >
          {loading ? "[ CONNECTING... ]" : "[ CONNECT WALLET ]"}
        </button>
      )}
    </div>
  );
}
