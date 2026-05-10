"use client";

import { motion } from "framer-motion";

const features = [
  {
    icon: "🎓",
    title: "DIGITAL CERTIFICATES",
    cmd: "--verify-degree",
    desc: "Verify university degrees and diplomas with unforgeable timestamped proofs on-chain.",
    status: "[ACTIVE]"
  },
  {
    icon: "🏠",
    title: "PROPERTY RECORDS",
    cmd: "--trace-ownership",
    desc: "Create immutable ownership trails for real estate and high-value asset transfers.",
    status: "[ACTIVE]"
  },
  {
    icon: "💡",
    title: "PATENTS & IP",
    cmd: "--prove-invention",
    desc: "Prove 'First to Invent' without exposing trade secrets. Timestamp your innovation.",
    status: "[ACTIVE]"
  },
  {
    icon: "⚖️",
    title: "LEGAL CONTRACTS",
    cmd: "--lock-timestamp",
    desc: "Prevent back-dating and ensure both parties agree on a cryptographic snapshot in time.",
    status: "[ACTIVE]"
  },
  {
    icon: "🛡️",
    title: "PRODUCT AUTH",
    cmd: "--verify-origin",
    desc: "Verify luxury goods, warranties, and supply chain integrity with blockchain stamps.",
    status: "[ACTIVE]"
  },
  {
    icon: "📜",
    title: "EVIDENCE ARCHIVE",
    cmd: "--seal-evidence",
    desc: "Tamper-proof digital evidence for court proceedings and regulatory compliance.",
    status: "[ACTIVE]"
  },
];

export default function FeatureGrid() {
  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl text-terminal-green glow uppercase tracking-wider font-bold mb-2">
          USE CASES
        </h2>
        <p className="text-terminal-muted text-xs">
          $ notarynode --list-modules
        </p>
        <p className="text-terminal-muted text-[10px] mt-1">
          {">"} listing available notarization modules...
        </p>
      </div>

      {/* Terminal Window Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="terminal-window hover:glow-box transition-all group"
          >
            {/* Title Bar */}
            <div className="border-b border-terminal-border px-3 py-1.5 flex items-center justify-between">
              <span className="text-terminal-muted text-[10px]">
                +--- {feature.title} ---+
              </span>
              <span className="text-terminal-green text-[10px]">
                {feature.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{feature.icon}</span>
                <code className="text-terminal-amber text-xs glow-amber">
                  {feature.cmd}
                </code>
              </div>
              <p className="text-terminal-green/60 text-xs leading-relaxed">
                {feature.desc}
              </p>
              <div className="text-terminal-muted text-[10px] group-hover:text-terminal-green transition-colors">
                {">"} module ready_<span className="cursor-blink">█</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
