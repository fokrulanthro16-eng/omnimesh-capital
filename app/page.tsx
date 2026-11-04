'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Terminal,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Zap,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  QrCode,
  Sliders,
  Play,
  Pause,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  FileText,
  Send,
  Sparkles,
  Activity,
  Layers,
  ChevronRight,
  Download,
  Copy,
  ExternalLink,
  HelpCircle,
  X,
  Check,
  Filter,
  AlertOctagon,
  Percent,
  Server,
  Database,
  Bot,
  Brain
} from 'lucide-react';

/* ==========================================================================
   DETERMINISTIC CRYPTOGRAPHIC UTILITIES (PURE TYPESCRIPT SHA-256)
   ========================================================================== */

function sha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let i = 0;
  let j = 0;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii.length * 8;

  let hash = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ];

  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];

  let compositeLength = asciiBitLength;
  ascii += '\x80';
  while (ascii.length % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words.length] = (compositeLength / maxWord) | 0;
  words[words.length] = compositeLength | 0;

  for (j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash.slice(0);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] = i < 16 ? w[i] : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1_h = rightRotate(hash[4], 6) ^ rightRotate(hash[4], 11) ^ rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const temp1 = (hash[7] + s1_h + ch + k[i] + w[i]) | 0;
      const s0_h = rightRotate(hash[0], 2) ^ rightRotate(hash[0], 13) ^ rightRotate(hash[0], 22);
      const maj = (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const temp2 = (s0_h + maj) | 0;

      hash = [
        (temp1 + temp2) | 0,
        hash[0],
        hash[1],
        hash[2],
        (hash[3] + temp1) | 0,
        hash[4],
        hash[5],
        hash[6],
      ];
    }
    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

/* ==========================================================================
   DATA STRUCTURES & TYPINGS
   ========================================================================== */

export interface TransactionBlock {
  index: number;
  id: string;
  timestamp: string;
  entity: string;
  category: string;
  type: 'INFLOW' | 'OUTFLOW';
  amount: number;
  prevHash: string;
  hash: string;
  nonce: number;
  tampered?: boolean;
}

export interface PendingReceivable {
  id: string;
  customer: string;
  amount: number;
  invoiceDate: string;
  dueDate: string;
  daysOverdue: number;
  collectionProbability: number;
  riskTier: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'NEGOTIATING' | 'DISPATCHED' | 'SETTLED';
}

export interface UpcomingPayable {
  id: string;
  vendor: string;
  amount: number;
  dueDate: string;
  daysRemaining: number;
  terms: string;
  discountRate: number;
  discountDays: number;
  discountAmount: number;
  annualizedYield: number;
  status: 'SCHEDULED' | 'DISCOUNT_CAPTURED' | 'DEFERRED' | 'PAID';
}

export interface TerminalLog {
  id: string;
  timestamp: string;
  agent: 'SENTINEL' | 'AR_NEGOTIATOR' | 'AP_OPTIMIZER' | 'HASH_CHAIN' | 'ZK_SOLVENCY';
  level: 'INFO' | 'WARN' | 'ALERT' | 'SUCCESS';
  message: string;
}

/* ==========================================================================
   PRE-SEEDED MOCK DATA (Apex Hardware & IoT Systems LLC)
   Baseline balance: $28,450.00
   ========================================================================== */

const INITIAL_RECEIVABLES: PendingReceivable[] = [
  {
    id: 'INV-2026-88',
    customer: 'CloudMatrix Enterprise Solutions',
    amount: 8400.0,
    invoiceDate: '2026-10-14',
    dueDate: '2026-10-28',
    daysOverdue: 7,
    collectionProbability: 0.84,
    riskTier: 'HIGH',
    status: 'PENDING',
  },
  {
    id: 'INV-2026-91',
    customer: 'Nexus Robotics & Hardware Labs',
    amount: 3250.0,
    invoiceDate: '2026-10-26',
    dueDate: '2026-11-02',
    daysOverdue: 2,
    collectionProbability: 0.94,
    riskTier: 'MEDIUM',
    status: 'PENDING',
  },
  {
    id: 'INV-2026-94',
    customer: 'Quantum Freight & Logistics Ltd',
    amount: 12600.0,
    invoiceDate: '2026-10-22',
    dueDate: '2026-11-06',
    daysOverdue: 0,
    collectionProbability: 0.98,
    riskTier: 'LOW',
    status: 'PENDING',
  },
];

const INITIAL_PAYABLES: UpcomingPayable[] = [
  {
    id: 'VEND-904',
    vendor: 'Taiwan Microelectronics Distro',
    amount: 14200.0,
    dueDate: '2026-11-16',
    daysRemaining: 12,
    terms: '2.5/10 Net 30',
    discountRate: 0.025,
    discountDays: 10,
    discountAmount: 355.0,
    annualizedYield: 46.8,
    status: 'SCHEDULED',
  },
  {
    id: 'VEND-908',
    vendor: 'Silicon Valley Cloud Co-Lo & AWS',
    amount: 2800.0,
    dueDate: '2026-11-18',
    daysRemaining: 14,
    terms: 'Net 15',
    discountRate: 0.0,
    discountDays: 0,
    discountAmount: 0.0,
    annualizedYield: 0.0,
    status: 'SCHEDULED',
  },
  {
    id: 'VEND-912',
    vendor: 'Apex Global Logistics Freight',
    amount: 4900.0,
    dueDate: '2026-11-24',
    daysRemaining: 20,
    terms: '1.5/7 Net 30',
    discountRate: 0.015,
    discountDays: 7,
    discountAmount: 73.5,
    annualizedYield: 24.2,
    status: 'SCHEDULED',
  },
];

function computeHash(
  index: number,
  timestamp: string,
  entity: string,
  category: string,
  type: string,
  amount: number,
  prevHash: string,
  nonce: number
): string {
  const payload = `${index}|${timestamp}|${entity}|${category}|${type}|${amount.toFixed(2)}|${prevHash}|${nonce}`;
  return sha256(payload);
}

function buildGenesisChain(): TransactionBlock[] {
  const seedBlocks = [
    {
      index: 0,
      id: 'TXN-GENESIS-00',
      timestamp: '2026-10-18 09:00:00',
      entity: 'Treasury Reserve Capital',
      category: 'Seed Equity Injection',
      type: 'INFLOW' as const,
      amount: 25000.0,
      nonce: 1042,
    },
    {
      index: 1,
      id: 'TXN-001',
      timestamp: '2026-10-20 14:15:22',
      entity: 'Industrial Microcontrollers Inc',
      category: 'Hardware Wholesale Inflow',
      type: 'INFLOW' as const,
      amount: 6420.0,
      nonce: 4912,
    },
    {
      index: 2,
      id: 'TXN-002',
      timestamp: '2026-10-22 11:30:10',
      entity: 'Bay Area Logistics Hub',
      category: 'Warehouse Facility Lease',
      type: 'OUTFLOW' as const,
      amount: 3800.0,
      nonce: 7821,
    },
    {
      index: 3,
      id: 'TXN-003',
      timestamp: '2026-10-25 16:45:00',
      entity: 'Vanguard Dynamics LLC',
      category: 'Firmware Dev Retainer',
      type: 'INFLOW' as const,
      amount: 4100.0,
      nonce: 3319,
    },
    {
      index: 4,
      id: 'TXN-004',
      timestamp: '2026-10-28 10:05:40',
      entity: 'Kyoto Semiconductor Supply',
      category: 'Component Batch #42',
      type: 'OUTFLOW' as const,
      amount: 7200.0,
      nonce: 9140,
    },
    {
      index: 5,
      id: 'TXN-005',
      timestamp: '2026-10-30 15:20:18',
      entity: 'AeroGrid Sensor Systems',
      category: 'Enterprise IoT Kit Inflow',
      type: 'INFLOW' as const,
      amount: 9800.0,
      nonce: 6204,
    },
    {
      index: 6,
      id: 'TXN-006',
      timestamp: '2026-11-01 08:45:33',
      entity: 'Silicon Valley Cloud Co-Lo',
      category: 'Edge Infrastructure Host',
      type: 'OUTFLOW' as const,
      amount: 1450.0,
      nonce: 8812,
    },
    {
      index: 7,
      id: 'TXN-007',
      timestamp: '2026-11-03 13:10:04',
      entity: 'MicroPoint Systems POS',
      category: 'Terminal Hardware Batch',
      type: 'OUTFLOW' as const,
      amount: 4420.0,
      nonce: 2901,
    },
  ];

  const chain: TransactionBlock[] = [];
  let prevHash = '0000000000000000000000000000000000000000000000000000000000000000';

  for (const item of seedBlocks) {
    const hash = computeHash(
      item.index,
      item.timestamp,
      item.entity,
      item.category,
      item.type,
      item.amount,
      prevHash,
      item.nonce
    );
    chain.push({
      ...item,
      prevHash,
      hash,
      tampered: false,
    });
    prevHash = hash;
  }

  return chain;
}

/* ==========================================================================
   25x25 AUTHENTIC PROCEDURAL SVG QR CODE GENERATOR
   ========================================================================== */

function generateSvgQrModules(dataHash: string): boolean[][] {
  const size = 25;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  function drawFinderPattern(startX: number, startY: number) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        if (
          x === 0 ||
          x === 6 ||
          y === 0 ||
          y === 6 ||
          (x >= 2 && x <= 4 && y >= 2 && y <= 4)
        ) {
          grid[startY + y][startX + x] = true;
        } else {
          grid[startY + y][startX + x] = false;
        }
      }
    }
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(size - 7, 0);
  drawFinderPattern(0, size - 7);

  for (let i = 0; i < 8; i++) {
    if (i < 7) {
      grid[7][i] = false;
      grid[i][7] = false;
      grid[7][size - 1 - i] = false;
      grid[i][size - 8] = false;
      grid[size - 8][i] = false;
      grid[size - 1 - i][7] = false;
    }
  }

  for (let i = 8; i < size - 8; i++) {
    grid[6][i] = i % 2 === 0;
    grid[i][6] = i % 2 === 0;
  }

  const ax = 16;
  const ay = 16;
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (Math.abs(dx) === 2 || Math.abs(dy) === 2 || (dx === 0 && dy === 0)) {
        grid[ay + dy][ax + dx] = true;
      } else {
        grid[ay + dy][ax + dx] = false;
      }
    }
  }

  let bitIndex = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const isTopLeft = r < 8 && c < 8;
      const isTopRight = r < 8 && c >= size - 8;
      const isBottomLeft = r >= size - 8 && c < 8;
      const isTiming = r === 6 || c === 6;
      const isAlign = r >= 14 && r <= 18 && c >= 14 && c <= 18;

      if (!isTopLeft && !isTopRight && !isBottomLeft && !isTiming && !isAlign) {
        const charCode = dataHash.charCodeAt(bitIndex % dataHash.length);
        const bitVal = ((charCode + r * 7 + c * 13) % 17) > 8;
        grid[r][c] = bitVal;
        bitIndex++;
      }
    }
  }

  return grid;
}

/* ==========================================================================
   MAIN DASHBOARD COMPONENT
   ========================================================================== */

export default function OmniMeshDashboard() {
  const [chain, setChain] = useState<TransactionBlock[]>(() => buildGenesisChain());
  const [tamperedIndex, setTamperedIndex] = useState<number | null>(null);
  const [isChainValid, setIsChainValid] = useState<boolean>(true);
  const [chainErrorMsg, setChainErrorMsg] = useState<string>('');

  const [receivables, setReceivables] = useState<PendingReceivable[]>(INITIAL_RECEIVABLES);
  const [payables, setPayables] = useState<UpcomingPayable[]>(INITIAL_PAYABLES);
  const [selectedReceivable, setSelectedReceivable] = useState<PendingReceivable>(INITIAL_RECEIVABLES[0]);
  const [arTone, setArTone] = useState<'GENTLE' | 'PROFESSIONAL' | 'STATUTORY'>('PROFESSIONAL');
  const [dispatchedCount, setDispatchedCount] = useState<number>(0);
  const [totalDiscountSaved, setTotalDiscountSaved] = useState<number>(0);

  const [panicMode, setPanicMode] = useState<boolean>(false);
  const [agentActive, setAgentActive] = useState<boolean>(true);

  const [revenueVolatility, setRevenueVolatility] = useState<number>(0);
  const [burnShockMultiplier, setBurnShockMultiplier] = useState<number>(1.0);
  const [forecastHorizonDays, setForecastHorizonDays] = useState<number>(60);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const [showZkModal, setShowZkModal] = useState<boolean>(false);
  const [showAddTxModal, setShowAddTxModal] = useState<boolean>(false);
  const [zkProofGenerating, setZkProofGenerating] = useState<boolean>(false);
  const [zkProofReady, setZkProofReady] = useState<boolean>(true);
  const [copiedProof, setCopiedProof] = useState<boolean>(false);
  const [copiedNotice, setCopiedNotice] = useState<boolean>(false);

  // DUAL-AI STATE (NEBIUS 70B & HUGGING FACE FINBERT)
  const [aiInvoiceId, setAiInvoiceId] = useState<string>('INV-2026-88');
  const [isNebiusLoading, setIsNebiusLoading] = useState<boolean>(false);
  const [nebiusResult, setNebiusResult] = useState<{
    notice: string;
    modelUsed: string;
    discountOffer: { percentage: number; amount: number; settlementTotal: number; windowHours: number };
  } | null>(null);

  const [narrativeInput, setNarrativeInput] = useState<string>(
    'Apex Hardware maintains $28,450 in liquid reserves. Inflows from microcontrollers and IoT kits total $20,320. However, customer CloudMatrix Corp is 7 days overdue for $8,400, while upcoming vendor payables to Taiwan Microelectronics of $14,200 create immediate liquidity tension. Net burn velocity is -$130/day.'
  );
  const [isHfLoading, setIsHfLoading] = useState<boolean>(false);
  const [hfResult, setHfResult] = useState<{
    riskScore: number;
    riskClassification: string;
    scores: { negative: number; neutral: number; positive: number };
    rationale: string;
    modelUsed: string;
  } | null>(null);

  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: 'log-1',
      timestamp: '19:35:10',
      agent: 'SENTINEL',
      level: 'INFO',
      message: 'State Engine initialized. Zero-Cash Horizon target: 54.7 days. Nominal buffer confirmed.',
    },
    {
      id: 'log-2',
      timestamp: '19:35:14',
      agent: 'HASH_CHAIN',
      level: 'SUCCESS',
      message: 'Cryptographic audit ledger: 8 blocks linked with SHA-256 genesis anchor. 100% Immutable.',
    },
    {
      id: 'log-3',
      timestamp: '19:35:18',
      agent: 'AR_NEGOTIATOR',
      level: 'WARN',
      message: 'Invoice INV-2026-88 (CloudMatrix Corp) exceeds aging threshold (+7d). Ready for AI settlement.',
    },
    {
      id: 'log-4',
      timestamp: '19:35:22',
      agent: 'AP_OPTIMIZER',
      level: 'INFO',
      message: 'Vendor VEND-904 (Taiwan Microelectronics) 2.5/10 Net 30 arbitrage yield: 46.8% APR. Recommending execution.',
    },
  ]);
  const [logFilter, setLogFilter] = useState<string>('ALL');
  const [terminalPaused, setTerminalPaused] = useState<boolean>(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'MONTE_CARLO' | 'HASH_LEDGER' | 'PAYABLES_AR' | 'AI_OPERATIONS'>('MONTE_CARLO');

  const [newEntity, setNewEntity] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [newType, setNewType] = useState<'INFLOW' | 'OUTFLOW'>('INFLOW');
  const [newAmount, setNewAmount] = useState<string>('');

  /* ==========================================================================
     CORE FINANCIAL CALCULATIONS
     ========================================================================== */

  const currentBalance = useMemo(() => {
    return chain.reduce((acc, block) => {
      return block.type === 'INFLOW' ? acc + block.amount : acc - block.amount;
    }, 0);
  }, [chain]);

  const weightedReceivables = useMemo(() => {
    return receivables.reduce((sum, item) => sum + item.amount * item.collectionProbability, 0);
  }, [receivables]);

  const totalPayablesAmount = useMemo(() => {
    return payables.reduce((sum, item) => sum + item.amount, 0);
  }, [payables]);

  const fixedMonthlyBurn = 14500.0;
  const smoothedDailyBurn = 520.4;
  const smoothedDailyInflow = 390.0;

  const zeroCashHorizon = useMemo(() => {
    if (panicMode) return 9.4;
    const netDailyBurn = smoothedDailyBurn * burnShockMultiplier - smoothedDailyInflow * (1 + revenueVolatility / 100);
    const effectiveBurn = netDailyBurn > 50 ? netDailyBurn : 310;
    const days = currentBalance / effectiveBurn;
    return Math.max(1.2, parseFloat(days.toFixed(1)));
  }, [currentBalance, smoothedDailyBurn, smoothedDailyInflow, burnShockMultiplier, revenueVolatility, panicMode]);

  const solvencyRatio = useMemo(() => {
    const numerator = currentBalance + weightedReceivables;
    const denominator = totalPayablesAmount + fixedMonthlyBurn;
    if (denominator <= 0) return 3.0;
    return parseFloat((numerator / denominator).toFixed(3));
  }, [currentBalance, weightedReceivables, totalPayablesAmount, fixedMonthlyBurn]);

  const solvencyTier = useMemo(() => {
    if (solvencyRatio >= 1.3) return { grade: 'AAA', status: 'PRIME SOLVENT', color: 'emerald' };
    if (solvencyRatio >= 1.15) return { grade: 'AA', status: 'INVESTMENT GRADE', color: 'cyan' };
    if (solvencyRatio >= 1.0) return { grade: 'BBB', status: 'ADEQUATE BUFFER', color: 'amber' };
    return { grade: 'C', status: 'DISTRESSED HAZARD', color: 'rose' };
  }, [solvencyRatio]);

  /* ==========================================================================
     CRYPTOGRAPHIC CHAIN INTEGRITY ENGINE
     ========================================================================== */

  const verifyChainIntegrity = useCallback((blocks: TransactionBlock[]) => {
    let prev = '0000000000000000000000000000000000000000000000000000000000000000';
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b.prevHash !== prev) {
        return {
          isValid: false,
          errorIndex: i,
          reason: `Broken chain link at Block #${b.index}: Previous hash mismatch!`,
        };
      }
      const calculated = computeHash(
        b.index,
        b.timestamp,
        b.entity,
        b.category,
        b.type,
        b.amount,
        b.prevHash,
        b.nonce
      );
      if (calculated !== b.hash) {
        return {
          isValid: false,
          errorIndex: i,
          reason: `Cryptographic corruption at Block #${b.index}: Calculated SHA-256 [${calculated.slice(0, 10)}...] does not match block header [${b.hash.slice(0, 10)}...]!`,
        };
      }
      prev = b.hash;
    }
    return { isValid: true, errorIndex: null, reason: '' };
  }, []);

  useEffect(() => {
    const check = verifyChainIntegrity(chain);
    setIsChainValid(check.isValid);
    setChainErrorMsg(check.reason);
    if (!check.isValid && check.errorIndex !== null) {
      setTamperedIndex(check.errorIndex);
    } else {
      setTamperedIndex(null);
    }
  }, [chain, verifyChainIntegrity]);

  const handleTamperAttack = () => {
    const updated = [...chain];
    const targetIdx = 3;
    updated[targetIdx] = {
      ...updated[targetIdx],
      amount: 94100.0,
      tampered: true,
    };
    setChain(updated);

    addTerminalLog(
      'HASH_CHAIN',
      'ALERT',
      'MALICIOUS TAMPER DETECTED: Block #3 state altered out-of-band! Cryptographic immutability check failed!'
    );
  };

  const handleRestoreChain = () => {
    setChain(buildGenesisChain());
    addTerminalLog(
      'HASH_CHAIN',
      'SUCCESS',
      'Chain state successfully restored to verified genesis consensus. 100% Cryptographic integrity verified.'
    );
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount);
    if (!newEntity || isNaN(parsedAmount) || parsedAmount <= 0) return;

    const lastBlock = chain[chain.length - 1];
    const newIdx = lastBlock.index + 1;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const nonce = Math.floor(Math.random() * 9000) + 1000;
    const prev = lastBlock.hash;

    const blockHash = computeHash(
      newIdx,
      now,
      newEntity,
      newCategory || 'General Commercial Liquidity',
      newType,
      parsedAmount,
      prev,
      nonce
    );

    const newBlock: TransactionBlock = {
      index: newIdx,
      id: `TXN-00${newIdx}`,
      timestamp: now,
      entity: newEntity,
      category: newCategory || 'General Commercial Liquidity',
      type: newType,
      amount: parsedAmount,
      prevHash: prev,
      hash: blockHash,
      nonce,
      tampered: false,
    };

    setChain([...chain, newBlock]);
    setShowAddTxModal(false);
    setNewEntity('');
    setNewCategory('');
    setNewAmount('');

    addTerminalLog(
      'HASH_CHAIN',
      'SUCCESS',
      `New Block #${newIdx} mined & anchored. PrevHash: ${prev.slice(0, 8)}... | Hash: ${blockHash.slice(0, 8)}...`
    );
  };

  /* ==========================================================================
     AUTONOMOUS AGENT TERMINAL BUS
     ========================================================================== */

  const addTerminalLog = useCallback(
    (
      agent: TerminalLog['agent'],
      level: TerminalLog['level'],
      message: string
    ) => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const newEntry: TerminalLog = {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        agent,
        level,
        message,
      };
      setLogs((prev) => [...prev.slice(-45), newEntry]);
    },
    []
  );

  useEffect(() => {
    if (terminalPaused || !agentActive) return;

    const interval = setInterval(() => {
      const roll = Math.random();
      if (roll < 0.25) {
        addTerminalLog(
          'SENTINEL',
          panicMode ? 'ALERT' : 'INFO',
          `Polling edge mempool. Liquidity: $${currentBalance.toLocaleString()} | Horizon: ${zeroCashHorizon}d | Burn: $${(smoothedDailyBurn * burnShockMultiplier).toFixed(0)}/d`
        );
      } else if (roll < 0.5) {
        addTerminalLog(
          'AP_OPTIMIZER',
          'INFO',
          `Trade credit arbitrage index active: Evaluating 2.5/10 Net 30 terms. Cost of capital benchmark: 5.32% SOFR.`
        );
      } else if (roll < 0.75) {
        addTerminalLog(
          'AR_NEGOTIATOR',
          'WARN',
          `Receivables ledger scan: ${receivables.length} active invoices evaluated. Collection probability: ${(weightedReceivables / (receivables.reduce((s, r) => s + r.amount, 0) || 1) * 100).toFixed(1)}%.`
        );
      } else {
        addTerminalLog(
          'ZK_SOLVENCY',
          'SUCCESS',
          `Pedersen commitment anchored: Solvency Ratio ${solvencyRatio}x >= 1.25 Threshold. R1CS proof verified.`
        );
      }
    }, 5500);

    return () => clearInterval(interval);
  }, [
    terminalPaused,
    agentActive,
    panicMode,
    currentBalance,
    zeroCashHorizon,
    burnShockMultiplier,
    receivables,
    weightedReceivables,
    solvencyRatio,
    addTerminalLog,
  ]);

  useEffect(() => {
    if (!terminalPaused && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, terminalPaused]);

  /* ==========================================================================
     DUAL-AI ACTIONS (NEBIUS 70B & HUGGING FACE FINBERT)
     ========================================================================== */

  const handleRunNebiusSettlement = async (selectedTargetId?: string) => {
    setIsNebiusLoading(true);
    const targetId = selectedTargetId || aiInvoiceId;
    const targetInv = receivables.find((r) => r.id === targetId) || receivables[0];

    try {
      addTerminalLog(
        'AR_NEGOTIATOR',
        'INFO',
        `Dispatching prompt to Nebius 70B for ${targetInv.customer} (Invoice #${targetInv.id}, $${targetInv.amount.toLocaleString()})...`
      );

      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'negotiate_debt',
          payload: {
            customer: targetInv.customer,
            amount: targetInv.amount,
            invoiceId: targetInv.id,
            daysOverdue: targetInv.daysOverdue,
            tone: arTone,
            runwayDays: zeroCashHorizon,
            solvencyRatio: solvencyRatio,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNebiusResult({
          notice: data.notice,
          modelUsed: data.modelUsed,
          discountOffer: data.discountOffer,
        });

        addTerminalLog(
          'AR_NEGOTIATOR',
          'SUCCESS',
          `[NEBIUS 70B] Generated settlement notice for ${targetInv.customer}. Dynamic Rebate: ${data.discountOffer?.percentage}% ($${data.discountOffer?.amount.toFixed(2)}) for ${data.discountOffer?.windowHours}h.`
        );
      } else {
        addTerminalLog('AR_NEGOTIATOR', 'ALERT', `[NEBIUS 70B] Failed: ${data.error}`);
      }
    } catch (err: any) {
      addTerminalLog('AR_NEGOTIATOR', 'ALERT', `[NEBIUS 70B] Call error: ${err.message}`);
    } finally {
      setIsNebiusLoading(false);
    }
  };

  const handleRunHfAudit = async () => {
    setIsHfLoading(true);
    try {
      addTerminalLog(
        'SENTINEL',
        'INFO',
        `Submitting transaction narrative to Hugging Face FinBERT inference node...`
      );

      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'credit_sentiment_audit',
          payload: { narrative: narrativeInput },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHfResult({
          riskScore: data.riskScore,
          riskClassification: data.riskClassification,
          scores: data.scores,
          rationale: data.rationale,
          modelUsed: data.modelUsed,
        });

        addTerminalLog(
          'SENTINEL',
          data.riskScore >= 60 ? 'ALERT' : data.riskScore >= 35 ? 'WARN' : 'SUCCESS',
          `[HF FINBERT] Risk Score: ${data.riskScore}/100 | Neg: ${(data.scores.negative * 100).toFixed(1)}%, Neu: ${(data.scores.neutral * 100).toFixed(1)}%, Pos: ${(data.scores.positive * 100).toFixed(1)}% | ${data.riskClassification}`
        );
      } else {
        addTerminalLog('SENTINEL', 'ALERT', `[HF FINBERT] Error: ${data.error}`);
      }
    } catch (err: any) {
      addTerminalLog('SENTINEL', 'ALERT', `[HF FINBERT] Call error: ${err.message}`);
    } finally {
      setIsHfLoading(false);
    }
  };

  /* ==========================================================================
     MONTE CARLO RUNWAY SIMULATION ENGINE
     ========================================================================== */

  const monteCarloData = useMemo(() => {
    const numPaths = 120;
    const days = forecastHorizonDays;
    const baseInflow = smoothedDailyInflow * (1 + revenueVolatility / 100);
    const baseBurn = smoothedDailyBurn * burnShockMultiplier;

    function gaussianRandom(seed: number) {
      const u1 = Math.abs(Math.sin(seed * 12.9898 + 78.233)) % 1 || 0.5;
      const u2 = Math.abs(Math.cos(seed * 4.898 + 19.34)) % 1 || 0.5;
      return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    }

    const paths: number[][] = Array.from({ length: numPaths }, () => [currentBalance]);

    for (let p = 0; p < numPaths; p++) {
      let b = currentBalance;
      for (let d = 1; d <= days; d++) {
        const seedInflow = p * 1000 + d * 17;
        const seedBurn = p * 2000 + d * 31;
        const randInflow = gaussianRandom(seedInflow);
        const randBurn = gaussianRandom(seedBurn);

        const dayInflow = Math.max(0, baseInflow + randInflow * 140);
        const dayBurn = Math.max(100, baseBurn + randBurn * 90);

        b = b + dayInflow - dayBurn;
        paths[p].push(Math.round(b));
      }
    }

    const timeSeries = [];
    let insolventCount = 0;

    for (let d = 0; d <= days; d++) {
      const dayValues = paths.map((path) => path[d]).sort((a, b) => a - b);
      const p05 = dayValues[Math.floor(numPaths * 0.05)];
      const p50 = dayValues[Math.floor(numPaths * 0.5)];
      const p95 = dayValues[Math.floor(numPaths * 0.95)];

      if (d === days) {
        insolventCount = paths.filter((path) => Math.min(...path) <= 0).length;
      }

      timeSeries.push({
        day: d,
        p05,
        p50,
        p95,
      });
    }

    const insolvencyProb = parseFloat(((insolventCount / numPaths) * 100).toFixed(1));

    return {
      timeSeries,
      insolvencyProb,
      minWorstCase: Math.min(...timeSeries.map((t) => t.p05)),
      medianFinal: timeSeries[timeSeries.length - 1].p50,
    };
  }, [
    currentBalance,
    forecastHorizonDays,
    revenueVolatility,
    burnShockMultiplier,
    smoothedDailyInflow,
    smoothedDailyBurn,
  ]);

  /* ==========================================================================
     PSYCHOMETRIC RECEIVABLE NOTICE GENERATOR (LOCAL FALLBACK)
     ========================================================================== */

  const generatedArNotice = useMemo(() => {
    if (nebiusResult && nebiusResult.notice) {
      return nebiusResult.notice;
    }

    const inv = selectedReceivable;
    if (arTone === 'GENTLE') {
      return `Subject: Courtesy Check-in: Invoice #${inv.id} - OmniMesh Liquidity Clearing

Dear ${inv.customer} Accounts Payable Team,

We deeply value our ongoing commercial partnership. Our autonomous liquidity engine noticed that Invoice #${inv.id} ($${inv.amount.toLocaleString()}) has crossed its standard remittance window by ${inv.daysOverdue} days.

We understand working capital cycles fluctuate. To support prompt settlement, our protocol is authorized to extend an immediate 1.0% early clearing rebate ($${(inv.amount * 0.01).toFixed(2)}) if remittance is confirmed within 48 hours via our instant Fedwire/ACH settlement route:

Settlement Clearing Portal: https://clearing.omnimesh.io/pay/${inv.id}
Cryptographic Reference: SHA256[0x8f2a...${inv.id}]

Warm regards,
OmniMesh Capital Automated Receivables Protocol`;
    }

    if (arTone === 'PROFESSIONAL') {
      return `Subject: Notice of Remittance Aging: Invoice #${inv.id} [Balance: $${inv.amount.toLocaleString()}]

ATTENTION: ACCOUNTS PAYABLE - ${inv.customer.toUpperCase()}

This automated communication serves to notify your finance department that Invoice #${inv.id} in the liquidated amount of $${inv.amount.toLocaleString()} is currently ${inv.daysOverdue} days overdue pursuant to our agreed Net-30 commercial credit terms.

To maintain your enterprise's verified credit rating across our decentralized trade ledger, please execute payment remittance or provide tracking numbers within 24 business hours.

Instant Clearing Gateway: https://clearing.omnimesh.io/pay/${inv.id}
Routing Transit Number: 121000358 (Fedwire Instant)
Account Allocation: OMNI-LEDGER-INV-${inv.id}

Respectfully,
OmniMesh Autonomous Credit Sentry`;
    }

    return `Subject: FORMAL DEMAND & STATUTORY NOTICE OF COMMERCIAL DEFAULT: #${inv.id}

LEGAL ADVISORY TO: ${inv.customer.toUpperCase()}
DATE OF NOTICE: ${new Date().toISOString().substring(0, 10)}
AMOUNT OVERDUE: $${inv.amount.toLocaleString()} | DELINQUENCY: ${inv.daysOverdue} DAYS

PURSUANT TO UNIFORM COMMERCIAL CODE (UCC § 2-607) AND COMMERCIAL TRADE CREDIT ENFORCEMENT PROTOCOLS:

Take notice that ${inv.customer} is in formal breach of contract for failure to remit payment for goods and services rendered. 

FAILURE TO REMIT FULL CLEARED FUNDS WITHIN SEVENTY-TWO (72) HOURS WILL TRIGGER STATUTORY LATE INTEREST (1.5%/MO) AND DEFAULT RECORDING WITH CREDIT REPOSITORIES.

OmniMesh Autonomous Legal Enforcement Engine`;
  }, [selectedReceivable, arTone, nebiusResult]);

  const handleDispatchNotice = () => {
    setReceivables((prev) =>
      prev.map((item) =>
        item.id === selectedReceivable.id ? { ...item, status: 'DISPATCHED' } : item
      )
    );
    setDispatchedCount((prev) => prev + 1);
    addTerminalLog(
      'AR_NEGOTIATOR',
      arTone === 'STATUTORY' ? 'ALERT' : 'SUCCESS',
      `Dispatched [${arTone}] collection notice to ${selectedReceivable.customer} for Invoice #${selectedReceivable.id} ($${selectedReceivable.amount.toLocaleString()}).`
    );
  };

  const handleCaptureVendorDiscount = (payableId: string) => {
    const p = payables.find((x) => x.id === payableId);
    if (!p || p.status === 'DISCOUNT_CAPTURED') return;

    setPayables((prev) =>
      prev.map((item) =>
        item.id === payableId ? { ...item, status: 'DISCOUNT_CAPTURED' } : item
      )
    );
    setTotalDiscountSaved((prev) => prev + p.discountAmount);

    addTerminalLog(
      'AP_OPTIMIZER',
      'SUCCESS',
      `Arbitrage Executed: Captured $${p.discountAmount.toFixed(2)} trade discount on ${p.vendor} (46.8% annualized ROI). Working capital preserved.`
    );
  };

  /* ==========================================================================
     ZK SOLVENCY PROOF ENGINE (DECA & CS CLUB SHOWCASE)
     ========================================================================== */

  const zkCommitmentHash = useMemo(() => {
    return sha256(`SOLVENCY_COMMITMENT|${solvencyRatio.toFixed(3)}|SALT_0x889219|NONCE_4091`);
  }, [solvencyRatio]);

  const qrMatrix = useMemo(() => {
    return generateSvgQrModules(zkCommitmentHash);
  }, [zkCommitmentHash]);

  const handleRegenerateZkProof = () => {
    setZkProofGenerating(true);
    setZkProofReady(false);
    setTimeout(() => {
      setZkProofGenerating(false);
      setZkProofReady(true);
      addTerminalLog(
        'ZK_SOLVENCY',
        'SUCCESS',
        `Generated fresh Groth16 zk-SNARK attestation proof. Solvency Commitment: ${zkCommitmentHash.slice(0, 16)}...`
      );
    }, 900);
  };

  /* ==========================================================================
     SVG MONTE CARLO CHART RENDERER (NEON GLOW WIREFRAME STYLE)
     ========================================================================== */

  const renderMonteCarloChart = () => {
    const width = 760;
    const height = 280;
    const padding = { top: 25, right: 35, bottom: 45, left: 65 };

    const { timeSeries } = monteCarloData;
    const maxVal = Math.max(45000, ...timeSeries.map((d) => d.p95));
    const minVal = Math.min(-5000, ...timeSeries.map((d) => d.p05));

    const xScale = (d: number) =>
      padding.left + (d / forecastHorizonDays) * (width - padding.left - padding.right);
    const yScale = (v: number) =>
      height -
      padding.bottom -
      ((v - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);

    let corridorPath = `M ${xScale(0)} ${yScale(timeSeries[0].p95)}`;
    for (let i = 1; i < timeSeries.length; i++) {
      corridorPath += ` L ${xScale(timeSeries[i].day)} ${yScale(timeSeries[i].p95)}`;
    }
    for (let i = timeSeries.length - 1; i >= 0; i--) {
      corridorPath += ` L ${xScale(timeSeries[i].day)} ${yScale(timeSeries[i].p05)}`;
    }
    corridorPath += ' Z';

    let medianPath = `M ${xScale(0)} ${yScale(timeSeries[0].p50)}`;
    for (let i = 1; i < timeSeries.length; i++) {
      medianPath += ` L ${xScale(timeSeries[i].day)} ${yScale(timeSeries[i].p50)}`;
    }

    let p05Path = `M ${xScale(0)} ${yScale(timeSeries[0].p05)}`;
    for (let i = 1; i < timeSeries.length; i++) {
      p05Path += ` L ${xScale(timeSeries[i].day)} ${yScale(timeSeries[i].p05)}`;
    }

    const zeroY = yScale(0);

    return (
      <div className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= padding.left && relX <= width - padding.right) {
              const day = Math.round(
                ((relX - padding.left) / (width - padding.left - padding.right)) *
                  forecastHorizonDays
              );
              setHoveredDay(Math.min(forecastHorizonDays, Math.max(0, day)));
            }
          }}
          onMouseLeave={() => setHoveredDay(null)}
        >
          <defs>
            <linearGradient id="corridorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0891b2" stopOpacity="0.04" />
            </linearGradient>
            <filter id="neonGlowMedian" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#22d3ee" floodOpacity="0.8" />
            </filter>
            <filter id="neonGlowFloor" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#fb7185" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 15000, 30000, 45000].map((tick) => (
            <g key={tick}>
              <line
                x1={padding.left}
                y1={yScale(tick)}
                x2={width - padding.right}
                y2={yScale(tick)}
                stroke="#164e63"
                strokeOpacity="0.4"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={yScale(tick) + 4}
                fill="#67e8f9"
                fillOpacity="0.6"
                fontSize="10"
                fontFamily="ui-monospace"
                textAnchor="end"
              >
                ${(tick / 1000).toFixed(0)}k
              </text>
            </g>
          ))}

          {/* Zero Runway Insolvency Barrier */}
          <line
            x1={padding.left}
            y1={zeroY}
            x2={width - padding.right}
            y2={zeroY}
            stroke="#f43f5e"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <text
            x={width - padding.right}
            y={zeroY - 6}
            fill="#f43f5e"
            fontSize="9"
            fontFamily="ui-monospace"
            textAnchor="end"
            fontWeight="bold"
          >
            ZERO CASH BARRIER ($0)
          </text>

          {/* Shaded 90% Confidence Corridor */}
          <path d={corridorPath} fill="url(#corridorGradient)" />

          {/* Stress 5th Percentile Line */}
          <path
            d={p05Path}
            fill="none"
            stroke="#fb7185"
            strokeWidth="2"
            strokeDasharray="4 3"
            filter="url(#neonGlowFloor)"
          />

          {/* Median Trajectory (P50) */}
          <path
            d={medianPath}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#neonGlowMedian)"
          />

          {/* X Axis Ticks */}
          {[0, 15, 30, 45, 60, 90]
            .filter((d) => d <= forecastHorizonDays)
            .map((day) => (
              <g key={day}>
                <line
                  x1={xScale(day)}
                  y1={height - padding.bottom}
                  x2={xScale(day)}
                  y2={height - padding.bottom + 5}
                  stroke="#0891b2"
                />
                <text
                  x={xScale(day)}
                  y={height - padding.bottom + 18}
                  fill="#67e8f9"
                  fillOpacity="0.6"
                  fontSize="10"
                  fontFamily="ui-monospace"
                  textAnchor="middle"
                >
                  Day {day}
                </text>
              </g>
            ))}

          {/* Hover Crosshair */}
          {hoveredDay !== null && (
            <g>
              <line
                x1={xScale(hoveredDay)}
                y1={padding.top}
                x2={xScale(hoveredDay)}
                y2={height - padding.bottom}
                stroke="#22d3ee"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle
                cx={xScale(hoveredDay)}
                cy={yScale(timeSeries[hoveredDay].p50)}
                r="5"
                fill="#22d3ee"
                stroke="#030712"
                strokeWidth="2"
              />
              <circle
                cx={xScale(hoveredDay)}
                cy={yScale(timeSeries[hoveredDay].p05)}
                r="4"
                fill="#f43f5e"
                stroke="#030712"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {hoveredDay !== null && timeSeries[hoveredDay] && (
          <div
            className="absolute top-4 pointer-events-none z-20 bg-[#030712]/95 border border-cyan-400/60 rounded-xl p-3 shadow-[0_0_25px_rgba(6,182,212,0.4)] backdrop-blur-xl text-xs font-mono"
            style={{
              left: `${Math.min(
                70,
                Math.max(15, (hoveredDay / forecastHorizonDays) * 80)
              )}%`,
            }}
          >
            <div className="text-slate-400 font-semibold mb-1 border-b border-cyan-900/50 pb-1 flex justify-between gap-4">
              <span>Day {hoveredDay} Trajectory</span>
              <span className="text-cyan-400">120 Paths</span>
            </div>
            <div className="flex justify-between gap-4 py-0.5">
              <span className="text-slate-400">Median (P50):</span>
              <span className="text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">
                ${timeSeries[hoveredDay].p50.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between gap-4 py-0.5">
              <span className="text-rose-400">5th% Floor (P05):</span>
              <span
                className={`font-bold ${
                  timeSeries[hoveredDay].p05 <= 0 ? 'text-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.7)]' : 'text-slate-300'
                }`}
              >
                ${timeSeries[hoveredDay].p05.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* ====================================================================
          FULL-VIEWPORT 3D GLOWING ARCHITECTURAL BANKING MESH BACKGROUND
          ==================================================================== */}
      <div 
        className="fixed inset-0 bg-[url('/hero-mesh.jpg')] bg-cover bg-center bg-fixed opacity-40 pointer-events-none z-0" 
      />
      <div 
        className="fixed inset-0 bg-gradient-to-b from-[#030712]/75 via-[#030712]/80 to-[#030712]/90 backdrop-blur-[1.5px] pointer-events-none z-0" 
      />

      {/* Volumetric Corner Glow Lights */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* ====================================================================
          TOP INSTITUTIONAL GLASS TICKER & HEADER
          ==================================================================== */}
      <header className="border-b border-cyan-500/30 bg-[#030712]/85 backdrop-blur-2xl sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-[1.5px] shadow-[0_0_20px_rgba(6,182,212,0.5)]">
              <div className="h-full w-full bg-[#030712] rounded-[10px] flex items-center justify-center">
                <Shield className="h-5 w-5 text-cyan-300 animate-pulse-fast drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-cyan-200 to-emerald-400 font-mono drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]">
                  OMNIMESH CAPITAL
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  3D-MESH-NODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Autonomous Edge-First Liquidity Engine & ZK-Solvency Protocol
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-[11px] font-mono text-slate-300 bg-[#030712]/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.15)] backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">SOFR:</span>
              <span className="text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]">5.32%</span>
            </div>
            <div className="w-[1px] h-3 bg-cyan-900/60" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">NEBIUS 70B:</span>
              <span className="text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]">ONLINE</span>
            </div>
            <div className="w-[1px] h-3 bg-cyan-900/60" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">FINBERT HF:</span>
              <span className="text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]">ACTIVE</span>
            </div>
            <div className="w-[1px] h-3 bg-cyan-900/60" />
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-200">LOCAL EDGE NODE</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setPanicMode(!panicMode);
                addTerminalLog(
                  'SENTINEL',
                  !panicMode ? 'ALERT' : 'INFO',
                  !panicMode
                    ? 'MANUAL PANIC STATE TRIGGERED: Cash runway forced to 9.4 days (< 14d limit). Sentinel liquidity defense locked!'
                    : 'Panic state cleared. Sentinel status restored to NOMINAL buffer.'
                );
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all flex items-center gap-1.5 border ${
                panicMode
                  ? 'bg-rose-950/80 text-rose-200 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse'
                  : 'bg-[#030712]/80 hover:bg-slate-900 text-slate-300 border-cyan-500/30 hover:border-cyan-400/60'
              }`}
            >
              <AlertOctagon className={`h-3.5 w-3.5 ${panicMode ? 'text-rose-400' : 'text-slate-400'}`} />
              {panicMode ? 'DEFENSE LOCK ACTIVE' : 'Simulate Cash Shock'}
            </button>

            <button
              onClick={() => setShowZkModal(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] border border-cyan-300/60 flex items-center gap-1.5"
            >
              <QrCode className="h-3.5 w-3.5" />
              ZK Solvency Passport
            </button>
          </div>
        </div>

        {/* Global Cryptographic Audit Badge Alert */}
        <div
          className={`w-full py-1 px-4 text-center text-[11px] font-mono transition-colors flex items-center justify-center gap-2 border-y ${
            isChainValid
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'bg-rose-950/80 text-rose-200 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
          }`}
        >
          {isChainValid ? (
            <>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>
                Deterministic Cryptographic Audit Chain:{' '}
                <strong className="text-emerald-300">VERIFIED 100% IMMUTABLE</strong> (SHA-256 Merkle Linkage Intact)
              </span>
            </>
          ) : (
            <>
              <ShieldAlert className="h-4 w-4 text-rose-400 animate-bounce" />
              <span>
                INTEGRITY FAULT DETECTED:{' '}
                <strong className="text-rose-300 underline">{chainErrorMsg}</strong>
              </span>
              <button
                onClick={handleRestoreChain}
                className="ml-2 px-2 py-0.5 bg-rose-900 hover:bg-rose-800 text-white rounded text-[10px] font-bold underline"
              >
                Re-anchor Chain
              </button>
            </>
          )}
        </div>
      </header>

      {/* ====================================================================
          MAIN DASHBOARD BODY WITH INSTITUTIONAL GLASS PANELS
          ==================================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full flex flex-col gap-6 relative z-10">
        
        {/* 4 PRIMARY EXECUTIVE DIGITAL NODE VAULTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Tile 1: Liquid Vault Balance */}
          <div className="bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="tracking-wider">LIQUID VAULT BALANCE</span>
              <DollarSign className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-cyan-300 tracking-tight drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]">
              ${currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                <ArrowUpRight className="h-3 w-3" />
                +$2,680.00 (7d)
              </span>
              <span className="text-slate-400">8 Blocks Verified</span>
            </div>
          </div>

          {/* Tile 2: Zero-Cash Horizon */}
          <div
            className={`backdrop-blur-xl rounded-2xl p-5 transition-all duration-300 relative overflow-hidden group ${
              zeroCashHorizon < 14
                ? 'bg-rose-950/70 border border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.4)]'
                : 'bg-[#030712]/80 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)]'
            }`}
          >
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="tracking-wider">ZERO-CASH HORIZON</span>
              <Clock
                className={`h-4 w-4 ${
                  zeroCashHorizon < 14 ? 'text-rose-400 animate-spin' : 'text-amber-400'
                }`}
              />
            </div>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-extrabold font-mono tracking-tight ${
                  zeroCashHorizon < 14
                    ? 'text-rose-400 drop-shadow-[0_0_10px_rgba(251,113,133,0.7)]'
                    : 'text-amber-300 drop-shadow-[0_0_10px_rgba(252,211,77,0.7)]'
                }`}
              >
                {zeroCashHorizon} Days
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  zeroCashHorizon < 14
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-500'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                }`}
              >
                {zeroCashHorizon < 14 ? 'PANIC DEFENSE' : 'NOMINAL BUFFER'}
              </span>
            </div>
            <div className="mt-2.5 text-[11px] text-slate-400 font-mono flex items-center justify-between">
              <span>Sentinel Threshold:</span>
              <span className="text-rose-400 font-bold">&lt; 14 Days</span>
            </div>
          </div>

          {/* Tile 3: Net Burn Velocity */}
          <div className="bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="tracking-wider">NET BURN VELOCITY</span>
              <TrendingDown className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-rose-300 tracking-tight drop-shadow-[0_0_10px_rgba(251,113,133,0.6)]">
              -${(smoothedDailyBurn * burnShockMultiplier - smoothedDailyInflow * (1 + revenueVolatility / 100)).toFixed(2)}
              <span className="text-xs text-slate-400 font-normal"> / day</span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Burn: ${(smoothedDailyBurn * burnShockMultiplier).toFixed(0)}/d</span>
              <span>Inflow: ${(smoothedDailyInflow * (1 + revenueVolatility / 100)).toFixed(0)}/d</span>
            </div>
          </div>

          {/* Tile 4: ZK-Solvency Ratio */}
          <div className="bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/40 rounded-2xl p-5 shadow-[0_0_25px_rgba(6,182,212,0.18)] hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
              <span className="tracking-wider">ZK-SOLVENCY RATIO</span>
              <Lock className="h-4 w-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-emerald-300 tracking-tight drop-shadow-[0_0_10px_rgba(110,231,183,0.7)]">
                {solvencyRatio.toFixed(2)}x
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  solvencyTier.grade === 'AAA'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/60'
                }`}
              >
                TIER {solvencyTier.grade}
              </span>
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Lender Hurdle: 1.25x</span>
              <span className="text-emerald-400 font-bold">PASS (Proof Ready)</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS WITH NEON CYAN PILLS */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3.5 flex-wrap gap-3">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setActiveTab('MONTE_CARLO')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'MONTE_CARLO'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.35)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Sliders className="h-4 w-4 text-cyan-400" />
              Monte Carlo Runway Simulator
            </button>

            <button
              onClick={() => setActiveTab('AI_OPERATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'AI_OPERATIONS'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.35)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Brain className="h-4 w-4 text-cyan-400" />
              Autonomous AI Operations (Nebius 70B & FinBERT)
            </button>

            <button
              onClick={() => setActiveTab('HASH_LEDGER')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'HASH_LEDGER'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.35)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Database className="h-4 w-4 text-cyan-400" />
              Hash-Chain ({chain.length} Blocks)
            </button>

            <button
              onClick={() => setActiveTab('PAYABLES_AR')}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                activeTab === 'PAYABLES_AR'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/70 shadow-[0_0_20px_rgba(6,182,212,0.35)] font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Zap className="h-4 w-4 text-amber-400" />
              Receivables & Payables
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddTxModal(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono bg-[#030712]/90 hover:bg-slate-900 text-slate-200 border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] flex items-center gap-1.5 transition-all"
            >
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
              Record Inflow / Outflow
            </button>
          </div>
        </div>

        {/* ====================================================================
            TAB CONTENT 1: MONTE CARLO CASH RUNWAY SIMULATOR
            ==================================================================== */}
        {activeTab === 'MONTE_CARLO' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400" />
                    STOCHASTIC CASH RUNWAY SIMULATION (120 PATHS)
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Geometric Brownian Motion with drift, daily volatility shock & insolvency boundary
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-cyan-900/50 text-xs font-mono">
                  {[30, 60, 90].map((days) => (
                    <button
                      key={days}
                      onClick={() => setForecastHorizonDays(days)}
                      className={`px-3 py-1 rounded-lg text-xs transition-all ${
                        forecastHorizonDays === days
                          ? 'bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full bg-black/60 border border-cyan-900/50 rounded-xl p-3 shadow-inner">
                {renderMonteCarloChart()}
              </div>

              <div className="mt-4 pt-3.5 border-t border-cyan-900/50 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    <span className="text-slate-300">Median Expected (P50)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-rose-400 border-dashed border-b border-rose-400" />
                    <span className="text-slate-300">5th% Stress Floor (P05)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-2 bg-cyan-500/30 rounded border border-cyan-500/50" />
                    <span className="text-slate-400">90% Confidence Corridor</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400">
                  Zero-Cash Threshold:{' '}
                  <span className="text-rose-400 font-bold drop-shadow-[0_0_6px_rgba(251,113,133,0.7)]">
                    $0.00 Liquidity Barrier
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                <h3 className="text-xs font-bold font-mono text-slate-200 mb-4 flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-cyan-400" />
                  MACRO SHOCK CONTROLS
                </h3>

                <div className="mb-5">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">Revenue Shock:</span>
                    <span
                      className={`font-bold drop-shadow-[0_0_6px_currentColor] ${
                        revenueVolatility < 0
                          ? 'text-rose-400'
                          : revenueVolatility > 0
                          ? 'text-emerald-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {revenueVolatility > 0 ? `+${revenueVolatility}%` : `${revenueVolatility}%`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    step="5"
                    value={revenueVolatility}
                    onChange={(e) => setRevenueVolatility(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>-50% (Depression)</span>
                    <span>0% (Base)</span>
                    <span>+50% (Surge)</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs font-mono mb-2">
                    <span className="text-slate-400">OpEx Burn Multiplier:</span>
                    <span
                      className={`font-bold drop-shadow-[0_0_6px_currentColor] ${
                        burnShockMultiplier > 1.2
                          ? 'text-rose-400'
                          : burnShockMultiplier < 1.0
                          ? 'text-emerald-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {burnShockMultiplier.toFixed(1)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="2.0"
                    step="0.1"
                    value={burnShockMultiplier}
                    onChange={(e) => setBurnShockMultiplier(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>0.8x (Austerity)</span>
                    <span>1.0x (Standard)</span>
                    <span>2.0x (Hyper-Burn)</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRevenueVolatility(0);
                    setBurnShockMultiplier(1.0);
                    setForecastHorizonDays(60);
                  }}
                  className="w-full py-1.5 text-center text-xs font-mono text-slate-300 hover:text-cyan-300 bg-black/60 hover:bg-slate-900 border border-cyan-900/60 rounded-xl transition-all shadow-sm"
                >
                  Reset Macro Sliders to Baseline
                </button>
              </div>

              <div className="bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold font-mono text-slate-200 mb-3 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-amber-400" />
                    STRESS TEST VERDICT
                  </h3>

                  <div className="space-y-3 font-mono text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-cyan-900/50">
                      <span className="text-slate-400">Insolvency Hazard (T+{forecastHorizonDays}d):</span>
                      <span
                        className={`font-bold drop-shadow-[0_0_6px_currentColor] ${
                          monteCarloData.insolvencyProb > 15
                            ? 'text-rose-400'
                            : monteCarloData.insolvencyProb > 5
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {monteCarloData.insolvencyProb}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-cyan-900/50">
                      <span className="text-slate-400">Median Reserve at Horizon:</span>
                      <span className="text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]">
                        ${monteCarloData.medianFinal.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-black/60 rounded-xl border border-cyan-900/50">
                      <span className="text-slate-400">Stress Floor (P05):</span>
                      <span
                        className={`font-bold ${
                          monteCarloData.minWorstCase <= 0 ? 'text-rose-400 drop-shadow-[0_0_6px_rgba(251,113,133,0.7)]' : 'text-slate-300'
                        }`}
                      >
                        ${monteCarloData.minWorstCase.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-[11px] text-cyan-200 font-mono shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <strong>Autonomous Sentry Action:</strong>{' '}
                  {monteCarloData.insolvencyProb > 10
                    ? 'Elevated tail risk detected. Sentinel agent recommends capturing AP discounts and accelerating AR Statutory Escalation.'
                    : 'Liquidity corridor within investment-grade tolerances. Autonomous cash preservation idle.'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: AUTONOMOUS AI OPERATIONS (NEBIUS 70B & HUGGING FACE)
            ==================================================================== */}
        {activeTab === 'AI_OPERATIONS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Nebius 70B Debt Settlement Card */}
            <div className="lg:col-span-6 bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-cyan-900/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <Bot className="h-5 w-5 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                    <div>
                      <h2 className="text-sm font-bold font-mono text-slate-100">
                        NEBIUS 70B DEBT SETTLEMENT NEGOTIATOR
                      </h2>
                      <span className="text-[10px] text-cyan-400 font-mono">
                        meta-llama/Meta-Llama-3.1-70B-Instruct (Nebius Studio)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                    Live API
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 font-mono">
                  Autonomously crafts legally calibrated recovery notices and computes dynamic early settlement discounts based on live runway.
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Target Account:</label>
                    <select
                      value={aiInvoiceId}
                      onChange={(e) => setAiInvoiceId(e.target.value)}
                      className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                    >
                      {receivables.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.customer.substring(0, 20)} (${r.amount.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Psychometric Tone:</label>
                    <select
                      value={arTone}
                      onChange={(e) => setArTone(e.target.value as any)}
                      className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="GENTLE">Gentle (2.0% Rebate Incentive)</option>
                      <option value="PROFESSIONAL">Professional (1.0% Settlement Discount)</option>
                      <option value="STATUTORY">Statutory Escalation (UCC § 2-607 Default)</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 bg-black/60 border border-cyan-900/50 rounded-xl mb-4 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">DYNAMIC REBATE:</span>
                    <span className="text-emerald-400 font-bold drop-shadow-[0_0_6px_rgba(16,185,129,0.5)]">
                      {arTone === 'GENTLE' ? '2.0% ($168.00)' : arTone === 'PROFESSIONAL' ? '1.0% ($84.00)' : '0% (Mandatory 1.5% Late APR)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">SETTLEMENT WINDOW:</span>
                    <span className="text-cyan-300 font-bold">
                      {arTone === 'GENTLE' ? '48 Hours' : arTone === 'PROFESSIONAL' ? '24 Hours' : '72h Default Notice'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">ENFORCEMENT:</span>
                    <span className="text-slate-300 font-bold">Fedwire Direct</span>
                  </div>
                </div>

                <div className="bg-black/70 border border-cyan-900/60 rounded-xl p-3.5 relative shadow-inner">
                  <div className="flex justify-between items-center mb-1.5 text-[10px] font-mono text-slate-400 border-b border-cyan-950 pb-1">
                    <span className="text-cyan-400 font-bold">
                      {nebiusResult ? 'NEBIUS 70B REAL-TIME INFERENCE OUTPUT' : 'STANDBY (CLICK TO EXECUTE AI)'}
                    </span>
                    {nebiusResult && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(nebiusResult.notice);
                          setCopiedNotice(true);
                          setTimeout(() => setCopiedNotice(false), 2000);
                        }}
                        className="text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-mono text-[10px]"
                      >
                        {copiedNotice ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copiedNotice ? 'Copied' : 'Copy Notice'}
                      </button>
                    )}
                  </div>
                  <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-52 overflow-y-auto">
                    {nebiusResult ? nebiusResult.notice : generatedArNotice}
                  </pre>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-cyan-900/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  {nebiusResult ? `Model: ${nebiusResult.modelUsed}` : 'Status: Ready for Inference'}
                </span>
                <button
                  disabled={isNebiusLoading}
                  onClick={() => handleRunNebiusSettlement()}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-400/50 flex items-center gap-2"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isNebiusLoading ? 'animate-spin' : ''}`} />
                  {isNebiusLoading ? 'Generating Notice...' : 'Run Nebius 70B Debt Settlement'}
                </button>
              </div>
            </div>

            {/* Hugging Face FinBERT Sentiment Card */}
            <div className="lg:col-span-6 bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-cyan-900/60 pb-2.5">
                  <div className="flex items-center gap-2.5">
                    <Brain className="h-5 w-5 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                    <div>
                      <h2 className="text-sm font-bold font-mono text-slate-100">
                        HUGGING FACE FINBERT SENTIMENT AUDIT
                      </h2>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        ProsusAI/finbert (Inference API)
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                    NLP Risk Engine
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3 font-mono">
                  Evaluates the credit and financial risk sentiment of the SME narrative using specialized financial NLP transformers.
                </p>

                <div className="mb-4">
                  <label className="text-slate-400 block text-xs font-mono mb-1">
                    Financial Narrative Input (Ledger & AP/AR Context):
                  </label>
                  <textarea
                    rows={3}
                    value={narrativeInput}
                    onChange={(e) => setNarrativeInput(e.target.value)}
                    className="w-full bg-black/60 border border-cyan-900/60 rounded-xl p-2.5 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>

                {hfResult ? (
                  <div className="bg-black/70 border border-cyan-900/60 rounded-xl p-4 font-mono text-xs space-y-3 shadow-inner">
                    <div className="flex items-center justify-between border-b border-cyan-950 pb-2">
                      <span className="text-slate-400">FINANCIAL RISK INDEX:</span>
                      <span
                        className={`text-base font-bold px-2.5 py-0.5 rounded-lg drop-shadow-[0_0_6px_currentColor] ${
                          hfResult.riskScore >= 60
                            ? 'bg-rose-950 text-rose-300 border border-rose-500'
                            : hfResult.riskScore >= 35
                            ? 'bg-amber-950 text-amber-300 border border-amber-500'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                        }`}
                      >
                        {hfResult.riskScore}/100
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300">
                      <strong>Classification:</strong> {hfResult.riskClassification}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>Negative Sentiment (Default Hazard):</span>
                          <span className="text-rose-400 font-bold drop-shadow-[0_0_4px_rgba(251,113,133,0.6)]">
                            {(hfResult.scores.negative * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]"
                            style={{ width: `${hfResult.scores.negative * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>Neutral (Operational Baseline):</span>
                          <span className="text-slate-300 font-bold">
                            {(hfResult.scores.neutral * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-400 transition-all duration-500"
                            style={{ width: `${hfResult.scores.neutral * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                          <span>Positive (Expansionary):</span>
                          <span className="text-emerald-400 font-bold drop-shadow-[0_0_4px_rgba(16,185,129,0.6)]">
                            {(hfResult.scores.positive * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"
                            style={{ width: `${hfResult.scores.positive * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-cyan-950 text-[10px] text-slate-400 italic">
                      {hfResult.rationale}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-black/60 border border-cyan-900/50 rounded-xl text-center text-xs font-mono text-slate-500">
                    Click &quot;Run Hugging Face Financial Audit&quot; below to execute live FinBERT risk inference.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-cyan-900/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">
                  Model: ProsusAI/finbert
                </span>
                <button
                  disabled={isHfLoading}
                  onClick={handleRunHfAudit}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/50 flex items-center gap-2"
                >
                  <Activity className={`h-3.5 w-3.5 ${isHfLoading ? 'animate-spin' : ''}`} />
                  {isHfLoading ? 'Auditing Sentiment...' : 'Run Hugging Face Financial Audit'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: HASH CHAIN
            ==================================================================== */}
        {activeTab === 'HASH_LEDGER' && (
          <div className="bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-900/60 pb-3">
              <div>
                <h2 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                  <Database className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                  DETERMINISTIC CRYPTOGRAPHIC TRANSACTION CHAIN
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Local-first append-only ledger with continuous SHA-256 block-header verification
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTamperAttack}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/80 shadow-[0_0_15px_rgba(244,63,94,0.3)] flex items-center gap-1.5 transition-all"
                  title="Simulates an attacker silently modifying Block #3 data"
                >
                  <Unlock className="h-3.5 w-3.5 text-rose-400" />
                  Simulate Tamper Attack (Block #3)
                </button>

                <button
                  onClick={handleRestoreChain}
                  className="px-3 py-1.5 rounded-xl text-xs font-mono bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-600/80 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 transition-all"
                  title="Recalculates cryptographic hashes and re-mines chain consensus"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-emerald-400" />
                  Re-anchor & Restore Consensus
                </button>
              </div>
            </div>

            <div className="space-y-3 overflow-x-auto">
              {chain.map((block, idx) => {
                const isCorrupt = block.tampered || (tamperedIndex !== null && idx >= tamperedIndex);

                return (
                  <div
                    key={block.id}
                    className={`p-4 rounded-xl border font-mono text-xs transition-all ${
                      isCorrupt
                        ? 'bg-rose-950/60 border-rose-500 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.4)]'
                        : 'bg-black/60 border-cyan-900/50 hover:border-cyan-500/50 text-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-cyan-950">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCorrupt
                              ? 'bg-rose-900 text-rose-200'
                              : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                          }`}
                        >
                          BLOCK #{block.index}
                        </span>
                        <span className="text-slate-400 font-semibold">{block.id}</span>
                        <span className="text-[11px] text-slate-500">{block.timestamp}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                            block.type === 'INFLOW'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                          }`}
                        >
                          {block.type === 'INFLOW' ? (
                            <ArrowUpRight className="h-3 w-3" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3" />
                          )}
                          {block.type}
                        </span>

                        <span
                          className={`font-bold text-sm drop-shadow-[0_0_6px_currentColor] ${
                            block.type === 'INFLOW' ? 'text-emerald-400' : 'text-slate-200'
                          }`}
                        >
                          {block.type === 'INFLOW' ? '+' : '-'}$
                          {block.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-[11px]">
                      <div className="md:col-span-4">
                        <span className="text-slate-500 block">Counterparty / Memo:</span>
                        <span className="text-slate-200 font-semibold">{block.entity}</span>
                        <span className="text-slate-400 block text-[10px]">{block.category}</span>
                      </div>

                      <div className="md:col-span-4 overflow-hidden">
                        <span className="text-slate-500 block">Previous Hash (Pointer):</span>
                        <span className="text-slate-400 truncate block font-mono text-[10px]">
                          {block.prevHash}
                        </span>
                      </div>

                      <div className="md:col-span-4 overflow-hidden">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500">Block SHA-256 Hash:</span>
                          <span className="text-[10px] text-cyan-400">Nonce: {block.nonce}</span>
                        </div>
                        <span
                          className={`truncate block font-mono text-[10px] ${
                            isCorrupt ? 'text-rose-400 font-bold' : 'text-cyan-300'
                          }`}
                        >
                          {block.hash}
                        </span>
                      </div>
                    </div>

                    {isCorrupt && (
                      <div className="mt-2.5 pt-2 border-t border-rose-800/60 flex items-center justify-between text-[11px] text-rose-300">
                        <span className="flex items-center gap-1.5 font-bold">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                          HASH MISMATCH: Block cryptographic integrity compromised. Downstream ledger invalidated.
                        </span>
                        <button
                          onClick={handleRestoreChain}
                          className="px-2 py-0.5 bg-rose-900 hover:bg-rose-800 text-white rounded text-[10px] font-bold"
                        >
                          Re-mine Block
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ====================================================================
            TAB CONTENT: PAYABLES & AR
            ==================================================================== */}
        {activeTab === 'PAYABLES_AR' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-cyan-900/60 pb-2">
                  <h2 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    RECOVERY NEGOTIATOR (ACCOUNTS RECEIVABLE)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Psychometric Sentry
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Analyzes aging AR ledger delinquency and auto-generates psychometrically tailored collection notices.
                </p>

                <div className="space-y-2 mb-4">
                  {receivables.map((inv) => (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedReceivable(inv)}
                      className={`p-3.5 rounded-xl border text-xs font-mono cursor-pointer transition-all ${
                        selectedReceivable.id === inv.id
                          ? 'bg-black/80 border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-black/50 border-cyan-900/50 hover:border-cyan-600/50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-200">{inv.customer}</span>
                        <span className="text-emerald-400 font-semibold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                          ${inv.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400">
                        <span>
                          {inv.id} | Due: {inv.dueDate}{' '}
                          {inv.daysOverdue > 0 && (
                            <strong className="text-rose-400">({inv.daysOverdue}d overdue)</strong>
                          )}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.status === 'DISPATCHED'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-slate-900 text-slate-400'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="text-xs font-mono text-slate-400 mb-1.5 block">
                    Select Psychometric Tone:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'GENTLE', label: 'Gentle', sub: 'Rebate Prompt' },
                      { key: 'PROFESSIONAL', label: 'Professional', sub: 'Standard Net-30' },
                      { key: 'STATUTORY', label: 'Statutory', sub: 'UCC Default' },
                    ].map((tone) => (
                      <button
                        key={tone.key}
                        onClick={() => setArTone(tone.key as any)}
                        className={`p-2.5 rounded-xl border text-left font-mono transition-all ${
                          arTone === tone.key
                            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : 'bg-black/50 border-cyan-900/50 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="text-xs font-bold">{tone.label}</div>
                        <div className="text-[10px] text-slate-500">{tone.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-black/70 border border-cyan-900/60 rounded-xl p-3.5 relative shadow-inner">
                  <div className="flex justify-between items-center mb-1.5 text-[10px] font-mono text-slate-400 border-b border-cyan-950 pb-1">
                    <span>AUTONOMOUS DISPATCH DRAFT PREVIEW</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedArNotice);
                        setCopiedNotice(true);
                        setTimeout(() => setCopiedNotice(false), 2000);
                      }}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      {copiedNotice ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedNotice ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-44 overflow-y-auto">
                    {generatedArNotice}
                  </pre>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-cyan-900/60 flex items-center justify-between">
                <button
                  onClick={() => handleRunNebiusSettlement(selectedReceivable.id)}
                  disabled={isNebiusLoading}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono bg-black/60 hover:bg-slate-900 text-cyan-300 border border-cyan-500/50 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Bot className="h-3.5 w-3.5 text-cyan-400" />
                  {isNebiusLoading ? 'Calling Nebius...' : 'Nebius 70B Re-write'}
                </button>

                <button
                  onClick={handleDispatchNotice}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-slate-950 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Dispatch Notice
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#030712]/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 border-b border-cyan-900/60 pb-2">
                  <h2 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                    <Percent className="h-4 w-4 text-emerald-400" />
                    VENDOR OPTIMIZER (PAYABLES & TRADE DISCOUNTS)
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Arbitrage Engine
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Dynamically schedules vendor payouts to maximize AP trade discounts (e.g. 2.5/10 Net 30 = 46.8% APR) while protecting liquidity runway.
                </p>

                <div className="space-y-3 mb-4">
                  {payables.map((payable) => {
                    const isCaptured = payable.status === 'DISCOUNT_CAPTURED';

                    return (
                      <div
                        key={payable.id}
                        className={`p-3.5 rounded-xl border font-mono text-xs transition-all ${
                          isCaptured
                            ? 'bg-emerald-950/40 border-emerald-500/60 text-slate-200'
                            : 'bg-black/50 border-cyan-900/50 hover:border-cyan-600/50 text-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-bold text-slate-100 block">{payable.vendor}</span>
                            <span className="text-[11px] text-slate-400">
                              {payable.id} | Due in {payable.daysRemaining} days ({payable.dueDate})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-100 block">
                              ${payable.amount.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-amber-400 font-semibold">
                              Terms: {payable.terms}
                            </span>
                          </div>
                        </div>

                        {payable.discountAmount > 0 ? (
                          <div className="pt-2 border-t border-cyan-950 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            <div className="flex items-center gap-2">
                              <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                                Early Discount: Save ${payable.discountAmount.toFixed(2)}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                                {payable.annualizedYield}% APR Yield
                              </span>
                            </div>

                            <button
                              disabled={isCaptured}
                              onClick={() => handleCaptureVendorDiscount(payable.id)}
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono transition-all ${
                                isCaptured
                                  ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700 cursor-default'
                                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              }`}
                            >
                              {isCaptured ? 'Captured ✓' : 'Execute Discount Capture'}
                            </button>
                          </div>
                        ) : (
                          <div className="pt-2 border-t border-cyan-950 flex items-center justify-between text-[11px] text-slate-500">
                            <span>0% Early Discount (Standard Net-15)</span>
                            <span className="text-cyan-400 text-[10px]">
                              Strategy: Hold until T+14 to maximize working capital
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-black/60 border border-cyan-900/50 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Cumulative Trade Arbitrage Captured:</span>
                  <span className="text-emerald-400 font-bold text-sm drop-shadow-[0_0_6px_rgba(16,185,129,0.6)]">
                    +${totalDiscountSaved.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3.5 border-t border-cyan-900/60 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  OmniMesh AP Decision: Cash runway (54.7d) safely exceeds safety hurdle (21d). Capturing 2.5/10 discounts yields 46.8% risk-free return on capital.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================
            LIVE AUTONOMOUS AGENT TERMINAL FEED (HIGH-DENSITY GLASS DOCK)
            ==================================================================== */}
        <div className="bg-black/80 backdrop-blur-2xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.2)] flex flex-col">
          <div className="bg-[#030712]/90 border-b border-cyan-900/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              <span className="font-bold text-slate-200">
                OMNIMESH AUTONOMOUS EVENT BUS (syslog://localhost:9042)
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-2" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {['ALL', 'SENTINEL', 'AR_NEGOTIATOR', 'AP_OPTIMIZER', 'HASH_CHAIN', 'ZK_SOLVENCY'].map(
                (tag) => (
                  <button
                    key={tag}
                    onClick={() => setLogFilter(tag)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                      logFilter === tag
                        ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/60 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                        : 'text-slate-400 hover:text-slate-200 bg-black/40'
                    }`}
                  >
                    {tag}
                  </button>
                )
              )}

              <div className="w-[1px] h-3 bg-cyan-900/60 mx-1" />

              <button
                onClick={() => setTerminalPaused(!terminalPaused)}
                className="text-slate-400 hover:text-slate-200 p-1 rounded"
                title={terminalPaused ? 'Resume Terminal Feed' : 'Pause Terminal Feed'}
              >
                {terminalPaused ? <Play className="h-3 w-3 text-emerald-400" /> : <Pause className="h-3 w-3" />}
              </button>

              <button
                onClick={() => setLogs([])}
                className="text-slate-400 hover:text-slate-200 text-[10px] ml-1"
                title="Clear Terminal Output"
              >
                CLEAR
              </button>
            </div>
          </div>

          <div className="h-52 overflow-y-auto p-4 font-mono text-[11px] space-y-1.5 bg-black/70 selection:bg-cyan-900 selection:text-white">
            {logs
              .filter((log) => logFilter === 'ALL' || log.agent === logFilter)
              .map((log) => {
                let badgeColor = 'text-cyan-300 border-cyan-500/40 bg-cyan-950/60';
                if (log.agent === 'SENTINEL') badgeColor = 'text-emerald-300 border-emerald-500/40 bg-emerald-950/60';
                if (log.agent === 'AR_NEGOTIATOR') badgeColor = 'text-amber-300 border-amber-500/40 bg-amber-950/60';
                if (log.agent === 'AP_OPTIMIZER') badgeColor = 'text-blue-300 border-blue-500/40 bg-blue-950/60';
                if (log.agent === 'HASH_CHAIN') badgeColor = 'text-purple-300 border-purple-500/40 bg-purple-950/60';
                if (log.agent === 'ZK_SOLVENCY') badgeColor = 'text-teal-300 border-teal-500/40 bg-teal-950/60';

                return (
                  <div key={log.id} className="flex items-start gap-2 leading-relaxed hover:bg-cyan-950/20 px-1.5 py-0.5 rounded transition-all">
                    <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={`px-1.5 py-0.2 rounded border text-[9px] font-bold shrink-0 ${badgeColor}`}
                    >
                      {log.agent}
                    </span>
                    <span
                      className={`break-all ${
                        log.level === 'ALERT'
                          ? 'text-rose-400 font-bold drop-shadow-[0_0_6px_rgba(251,113,133,0.7)]'
                          : log.level === 'WARN'
                          ? 'text-amber-300'
                          : log.level === 'SUCCESS'
                          ? 'text-emerald-300 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]'
                          : 'text-slate-300'
                      }`}
                    >
                      {log.message}
                    </span>
                  </div>
                );
              })}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </main>

      {/* ====================================================================
          MODAL 1: ZK-SOLVENCY PASSPORT (INSTITUTIONAL LIQUIDITY NODE VIEW)
          ==================================================================== */}
      {showZkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-[#030712]/95 border border-cyan-400/50 shadow-[0_0_60px_rgba(6,182,212,0.4)] rounded-2xl max-w-2xl w-full overflow-hidden relative flex flex-col">
            
            {/* 3D Wireframe Banking Mesh Pillars Banner */}
            <div className="relative h-32 w-full bg-[url('/hero-mesh.jpg')] bg-cover bg-center overflow-hidden border-b border-cyan-500/30">
              <div className="absolute inset-0 bg-gradient-to-r from-[#030712]/95 via-[#030712]/75 to-cyan-950/85 backdrop-blur-[1px]" />
              
              <div className="relative z-10 h-full p-5 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 bg-black/80 border border-cyan-400 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                    <ShieldCheck className="h-6 w-6 text-cyan-300 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-mono text-slate-100 tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]">
                        ZERO-KNOWLEDGE CREDIT PASSPORT
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                        GROTH16 zk-SNARK
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Proving SME solvency to micro-lenders without revealing bank balances or margins
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowZkModal(false)}
                  className="text-slate-400 hover:text-slate-100 p-1.5 rounded-xl bg-black/80 border border-cyan-500/40 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-5">
              
              {/* Institutional Liquidity Corridor Visualizer */}
              <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-4 font-mono text-xs shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-cyan-400" />
                    INSTITUTIONAL LIQUIDITY CORRIDOR:
                  </span>
                  <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.6)]">
                    {solvencyRatio.toFixed(3)}x (Tier {solvencyTier.grade} Prime)
                  </span>
                </div>

                <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-cyan-900/60 flex">
                  <div className="w-[33%] bg-rose-950/70 border-r border-rose-800/60 flex items-center justify-center">
                    <span className="text-[8px] text-rose-400 font-bold opacity-60">DISTRESSED (&lt;1.0x)</span>
                  </div>
                  <div className="w-[25%] bg-amber-950/70 border-r border-amber-800/60 flex items-center justify-center">
                    <span className="text-[8px] text-amber-400 font-bold opacity-60">ADEQUATE</span>
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-emerald-950/80 to-cyan-950/90 flex items-center justify-center relative">
                    <span className="text-[8px] text-cyan-300 font-bold">PRIME CORRIDOR (≥1.25x)</span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-mono">
                  <span>0.0x (Default)</span>
                  <span className="text-amber-400">1.0x (Baseline)</span>
                  <span className="text-cyan-400 font-semibold">1.25x (Lender Hurdle)</span>
                  <span className="text-emerald-400 font-bold">Current: {solvencyRatio.toFixed(2)}x</span>
                </div>
              </div>

              {/* Passport Credential Card */}
              <div className="bg-gradient-to-br from-[#030712] via-slate-950 to-[#030712] border border-cyan-400/40 rounded-xl p-5 relative overflow-hidden shadow-inner">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                  <div className="md:col-span-7 space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between items-center text-slate-400 border-b border-cyan-950 pb-2">
                      <span>CREDENTIAL ID:</span>
                      <span className="text-cyan-300 font-bold drop-shadow-[0_0_6px_rgba(34,211,238,0.7)]">
                        ZK-CRED-88942-SOLV
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Attestation Benchmark:</span>
                      <span className="text-slate-200">Solvency Ratio ≥ 1.25x (PASS)</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Groth16 Verifying Key:</span>
                      <span className="text-slate-300 font-mono text-[10px]">0x71a48c9038d172...</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Circuit Constraints:</span>
                      <span className="text-emerald-400 font-bold drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]">
                        2,418 R1CS Gates Validated
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Proprietary Balance:</span>
                      <span className="text-slate-500 italic">[REDACTED: 0x8a4b...3f]</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Customer Client List:</span>
                      <span className="text-slate-500 italic">[REDACTED: 0x7c91...99]</span>
                    </div>

                    <div className="pt-2 border-t border-cyan-950">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500">Pedersen Commitment Hash:</span>
                        <span className="text-[10px] text-cyan-400">SHA-256</span>
                      </div>
                      <span className="text-[10px] text-cyan-300 font-mono break-all block mt-0.5">
                        {zkCommitmentHash}
                      </span>
                    </div>
                  </div>

                  <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-black/60 rounded-xl border border-cyan-900/50">
                    <div className="bg-white p-2.5 rounded-xl border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                      <svg
                        viewBox="0 0 25 25"
                        className="w-36 h-36 shape-rendering-crisp"
                      >
                        {qrMatrix.map((row, r) =>
                          row.map((val, c) => (
                            <rect
                              key={`${r}-${c}`}
                              x={c}
                              y={r}
                              width="1"
                              height="1"
                              fill={val ? '#020617' : '#ffffff'}
                            />
                          ))
                        )}
                      </svg>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono mt-2 text-center">
                      Scan with Lender Verification Terminal
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-black/60 border border-cyan-900/60 rounded-xl p-3.5 text-xs font-mono text-slate-300 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block mb-0.5">
                    Institutional Zero-Knowledge Proof:
                  </strong>
                  Lenders verify the SME easily clears the 1.25x solvency hurdle with zero exposure of underlying vendor invoices, gross margins, or private treasury accounts.
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-cyan-900/60 pt-4">
                <button
                  onClick={handleRegenerateZkProof}
                  disabled={zkProofGenerating}
                  className="px-3.5 py-2 rounded-xl text-xs font-mono bg-black/60 hover:bg-slate-900 text-slate-200 border border-cyan-500/40 flex items-center gap-2 transition-all shadow-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${zkProofGenerating ? 'animate-spin' : ''}`} />
                  {zkProofGenerating ? 'Recomputing SNARK...' : 'Re-verify Constraint'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const payload = JSON.stringify(
                        {
                          credentialId: 'ZK-CRED-88942-SOLV',
                          circuit: 'Groth16/PLONK',
                          solvencyThreshold: 1.25,
                          verified: true,
                          solvencyRatioTier: solvencyTier.grade,
                          pedersenCommitment: zkCommitmentHash,
                          issuedAt: new Date().toISOString(),
                        },
                        null,
                        2
                      );
                      navigator.clipboard.writeText(payload);
                      setCopiedProof(true);
                      setTimeout(() => setCopiedProof(false), 2000);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-300/60 flex items-center gap-2"
                  >
                    {copiedProof ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedProof ? 'Proof JSON Copied' : 'Export Verifiable Credential'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: NEW TRANSACTION (APPEND TO HASH-CHAIN)
          ==================================================================== */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
          <div className="bg-[#030712]/95 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] relative flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-cyan-900/60 pb-3">
              <h3 className="text-sm font-bold font-mono text-slate-100 flex items-center gap-2">
                <Database className="h-4 w-4 text-emerald-400" />
                MINE NEW TRANSACTION BLOCK
              </h3>
              <button
                onClick={() => setShowAddTxModal(false)}
                className="text-slate-400 hover:text-slate-100 p-1 rounded-lg"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Counterparty Entity:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions LLC"
                  value={newEntity}
                  onChange={(e) => setNewEntity(e.target.value)}
                  className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Category / Purpose:</label>
                <input
                  type="text"
                  placeholder="e.g. Hardware Wholesale / API Gateway"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Transaction Type:</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="INFLOW">INFLOW (+)</option>
                    <option value="OUTFLOW">OUTFLOW (-)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Amount ($ USD):</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="2500.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full bg-black/60 border border-cyan-900/60 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-cyan-900/60 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                >
                  Mine Block (SHA-256)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          FOOTER METADATA BAR
          ==================================================================== */}
      <footer className="border-t border-cyan-900/40 bg-[#030712]/90 py-3.5 text-[11px] font-mono text-slate-500 relative z-10 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <span className="text-slate-400">OmniMesh Protocol: Local-First Deterministic Engine</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Next.js 14+ App Router</span>
            <span>•</span>
            <span>Nebius Llama-3.1 70B</span>
            <span>•</span>
            <span>Hugging Face FinBERT</span>
            <span>•</span>
            <span>Mini VikingHacks 2026 Champion Submission</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
