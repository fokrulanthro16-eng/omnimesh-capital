#!/usr/bin/env python3
"""
OmniMesh Capital - Automated Voiceover Synthesis Pipeline
Synthesizes ultra-clarity executive voiceover using edge-tts (or gTTS/fallback)
Outputs 5 synchronized audio segments and stitches master public/demo_audio.mp3.
"""

import os
import sys
import json
import asyncio
import subprocess
import re

# Voiceover script sections as mandated:
# Segment 1 (0:00-0:30): Hook & Problem (SME liquidity crisis)
# Segment 2 (0:30-1:15): Cryptographic Merkle auditability & Monte Carlo stochastic runway
# Segment 3 (1:15-1:55): Dual-AI Orchestration (Nebius Llama-3.1-70B & Hugging Face FinBERT)
# Segment 4 (1:55-2:25): ZK-Solvency Passport (Groth16 zk-SNARK attestation)
# Segment 5 (2:25-2:45): $5.2T Market Opportunity & Monetization

SECTIONS = [
    {
        "id": "segment_1",
        "title": "Hook & Problem: The SME Liquidity Crisis",
        "text": (
            "Eighty-two percent of small and medium enterprises do not fail due to a lack of profitability—"
            "they collapse from cash-flow insolvency and opaque credit scores. "
            "For decades, businesses relied on passive accounting ledgers like QuickBooks and Excel. "
            "But passive tools only record history; they cannot defend liquidity. "
            "Welcome to OmniMesh Capital: an autonomous, edge-first liquidity engine "
            "and zero-knowledge solvency protocol engineered to protect enterprise treasury in real time."
        )
    },
    {
        "id": "segment_2",
        "title": "Cryptographic Merkle Auditability & Monte Carlo Stochastic Runway",
        "text": (
            "At the architectural foundation of OmniMesh is a deterministic cryptographic hash-chain engine. "
            "Every single inflow and outflow is cryptographically anchored in local memory using SHA-256 Merkle links, "
            "guaranteeing mathematical immutability and instant fraud detection. "
            "Seamlessly coupled to this ledger is our Monte Carlo Cash Runway Simulator. "
            "By executing over one hundred stochastic Brownian motion paths under severe revenue and burn shock parameters, "
            "OmniMesh computes the exact fifth-percentile worst-case trajectory—"
            "empowering treasurers to foresee cash shortfalls months before they materialize."
        )
    },
    {
        "id": "segment_3",
        "title": "Dual-AI Orchestration: Nebius Llama-3.1-70B & Hugging Face FinBERT",
        "text": (
            "When working capital horizons are stressed, OmniMesh activates its Dual-AI autonomous agent architecture. "
            "On the receivables front, our Recovery Negotiator leverages Nebius AI Studio's seventy-billion-parameter Llama model "
            "to draft psychometrically targeted, legally compliant settlement notices with dynamic early-remittance discounts. "
            "Concurrently, Hugging Face's FinBERT credit sentiment engine audits enterprise narratives, "
            "parsing overdue invoices and vendor payables to calculate real-time institutional risk scores. "
            "All decisions stream live into the autonomous event bus with complete forensic transparency."
        )
    },
    {
        "id": "segment_4",
        "title": "ZK-Solvency Passport: Groth16 zk-SNARK Attestation",
        "text": (
            "For growth-stage enterprises seeking micro-credit, traditional financial disclosures require exposing proprietary bank accounts and margins. "
            "OmniMesh eliminates this vulnerability with our Zero-Knowledge Credit Passport. "
            "Utilizing Groth16 zk-SNARKs and Pedersen commitments across thousands of R1CS gates, "
            "businesses mathematically prove their solvency ratio exceeds institutional hurdles—such as 1.25x—"
            "without revealing a single proprietary revenue figure or client transaction."
        )
    },
    {
        "id": "segment_5",
        "title": "$5.2T Market Opportunity & Monetization",
        "text": (
            "Operating at the intersection of a 5.2-trillion-dollar global trade financing gap, "
            "OmniMesh Capital bridges decentralized cryptographic trust with autonomous artificial intelligence. "
            "With enterprise SaaS subscriptions, automated settlement clearance fees, and decentralized underwriting corridors, "
            "we are redefining modern SME treasury operations. "
            "This is OmniMesh Capital: autonomous liquidity, mathematically guaranteed."
        )
    }
]

def get_audio_duration(file_path):
    """Calculates duration of an audio file using ffmpeg."""
    try:
        cmd = ["ffmpeg", "-i", file_path]
        res = subprocess.run(cmd, capture_output=True, text=True, check=False)
        m = re.search(r"Duration:\s+(\d+):(\d+):([\d\.]+)", res.stderr)
        if m:
            h, mn, s = float(m.group(1)), float(m.group(2)), float(m.group(3))
            return h * 3600 + mn * 60 + s
    except Exception as e:
        print(f"Error reading duration for {file_path}: {e}")
    return 0.0

async def synthesize_section(text, output_file, voice="en-GB-RyanNeural"):
    """Synthesizes text to an mp3 file using edge-tts with fallback to gTTS."""
    try:
        import edge_tts
        communicate = edge_tts.Communicate(text, voice=voice, rate="-2%", pitch="-1Hz")
        await communicate.save(output_file)
        return True
    except Exception as e:
        print(f"edge-tts failed: {e}. Trying fallback...")
        try:
            from gtts import gTTS
            tts = gTTS(text=text, lang="en", tld="co.uk")
            tts.save(output_file)
            return True
        except Exception as e2:
            print(f"Fallback gTTS also failed: {e2}")
            return False

def generate_silence(duration_sec, output_file):
    """Generates a high-quality silent mp3 buffer using ffmpeg."""
    cmd = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", f"anullsrc=r=44100:cl=stereo",
        "-t", str(duration_sec),
        "-c:a", "libmp3lame", "-b:a", "192k",
        output_file
    ]
    subprocess.run(cmd, capture_output=True, check=True)

async def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    public_dir = os.path.join(base_dir, "public")
    temp_dir = os.path.join(base_dir, "temp_voice")
    os.makedirs(public_dir, exist_ok=True)
    os.makedirs(temp_dir, exist_ok=True)

    voice = "en-GB-RyanNeural"
    print(f"[*] Initializing voiceover synthesis pipeline with voice: {voice}")

    segment_files = []
    cues = []
    current_time = 0.0
    pause_between_sections = 1.0  # 1.0s breath buffer between segments

    silence_file = os.path.join(temp_dir, "silence.mp3")
    generate_silence(pause_between_sections, silence_file)

    for idx, sec in enumerate(SECTIONS, 1):
        seg_file = os.path.join(temp_dir, f"seg_{idx}.mp3")
        print(f"[*] Synthesizing Segment {idx}/5: {sec['title']}...")
        success = await synthesize_section(sec["text"], seg_file, voice=voice)
        if not success:
            print(f"[!] Critical error synthesizing segment {idx}")
            sys.exit(1)

        dur = get_audio_duration(seg_file)
        print(f"    -> Duration: {dur:.2f}s")

        cue = {
            "index": idx,
            "id": sec["id"],
            "title": sec["title"],
            "start_time": round(current_time, 2),
            "duration": round(dur, 2),
            "end_time": round(current_time + dur, 2)
        }
        cues.append(cue)
        segment_files.append(seg_file)

        current_time += dur
        if idx < len(SECTIONS):
            current_time += pause_between_sections

    print(f"[*] Total master audio duration: {current_time:.2f}s (~{int(current_time // 60)}m {int(current_time % 60)}s)")

    # Write concat list for ffmpeg
    concat_list_file = os.path.join(temp_dir, "concat_list.txt")
    with open(concat_list_file, "w", encoding="utf-8") as f:
        for idx, seg_f in enumerate(segment_files):
            f.write(f"file '{seg_f.replace(chr(92), '/')}'\n")
            if idx < len(segment_files) - 1:
                f.write(f"file '{silence_file.replace(chr(92), '/')}'\n")

    master_audio = os.path.join(public_dir, "demo_audio.mp3")
    print(f"[*] Stitched master audio -> {master_audio}")
    concat_cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", concat_list_file,
        "-c:a", "libmp3lame", "-b:a", "320k", "-ar", "44100",
        master_audio
    ]
    subprocess.run(concat_cmd, capture_output=True, check=True)

    # Save timing cues
    cues_output = {
        "voice": voice,
        "total_duration": round(current_time, 2),
        "segments": cues
    }
    cues_json_path = os.path.join(os.path.dirname(__file__), "audio_timings.json")
    with open(cues_json_path, "w", encoding="utf-8") as f:
        json.dump(cues_output, f, indent=2)

    print(f"[+] Audio pipeline complete! Timings written to {cues_json_path}")
    print(json.dumps(cues_output, indent=2))

if __name__ == "__main__":
    asyncio.run(main())
