#!/usr/bin/env python3
"""
OmniMesh Capital - End-to-End Master Video Rendering Pipeline
Executes edge-to-edge 1080p Full HD (60 FPS) headless browser recording,
and masters final cinematic MP4 video with FFmpeg.
"""

import os
import sys
import subprocess
import time
import json
import re

def get_file_metadata(file_path):
    """Extracts duration, resolution, and stream details via ffmpeg."""
    cmd = ["ffmpeg", "-i", file_path]
    res = subprocess.run(cmd, capture_output=True, text=True, check=False)
    output = res.stderr

    duration = 0.0
    m_dur = re.search(r"Duration:\s+(\d+):(\d+):([\d\.]+)", output)
    if m_dur:
        h, mn, s = float(m_dur.group(1)), float(m_dur.group(2)), float(m_dur.group(3))
        duration = h * 3600 + mn * 60 + s

    resolution = "Unknown"
    m_res = re.search(r"Video:.*,\s+(\d{3,4}x\d{3,4})", output)
    if m_res:
        resolution = m_res.group(1)

    bitrate = "Unknown"
    m_br = re.search(r"bitrate:\s+(\d+\s+kb/s)", output)
    if m_br:
        bitrate = m_br.group(1)

    return {
        "duration": duration,
        "resolution": resolution,
        "bitrate": bitrate,
        "size_mb": round(os.path.getsize(file_path) / (1024 * 1024), 2)
    }

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    public_dir = os.path.join(base_dir, "public")
    scripts_dir = os.path.join(base_dir, "scripts")
    master_audio = os.path.join(public_dir, "demo_audio.mp3")
    timings_json = os.path.join(scripts_dir, "audio_timings.json")
    final_output = os.path.join(public_dir, "omnimesh_capital_worldclass_demo.mp4")
    rec_dir = os.path.join(base_dir, "temp_recording")

    print("================================================================================")
    print("   OMNIMESH CAPITAL - MASTER 1080P FULL-SCREEN DEMO RENDERING PIPELINE (60 FPS) ")
    print("================================================================================")

    # Clean old raw recordings to avoid confusion
    if os.path.exists(rec_dir):
        for f in os.listdir(rec_dir):
            if f.endswith(".webm"):
                try:
                    os.remove(os.path.join(rec_dir, f))
                except Exception:
                    pass

    # Step 1: Voiceover Verification
    if not os.path.exists(master_audio) or not os.path.exists(timings_json):
        print("\n[*] Step 1: Synthesizing voiceover audio soundtrack...")
        gen_voice_script = os.path.join(scripts_dir, "generate_voiceover.py")
        subprocess.run([sys.executable, gen_voice_script], check=True)
    else:
        print(f"\n[*] Step 1: Master audio exists at {master_audio}")

    # Step 2: Headless 1080p Full-Screen Edge-to-Edge Browser Recording
    print("\n[*] Step 2: Executing headless 1080p Full HD recording (100% edge-to-edge)...")
    record_script = os.path.join(scripts_dir, "record_demo.py")
    subprocess.run([sys.executable, record_script], check=True)

    # Find the newest raw recording in temp_recording
    webm_files = [os.path.join(rec_dir, f) for f in os.listdir(rec_dir) if f.endswith(".webm")]
    if not webm_files:
        print("[!] Error: No webm files found in temp_recording!")
        sys.exit(1)

    raw_video = max(webm_files, key=os.path.getctime)
    raw_meta = get_file_metadata(raw_video)
    print(f"[+] Raw video captured: {raw_video}")
    print(f"    Duration: {raw_meta['duration']:.2f}s | Resolution: {raw_meta['resolution']} | Size: {raw_meta['size_mb']} MB")

    # Step 3: FFmpeg Cinematic Composition & Mastering
    print(f"\n[*] Step 3: Mastering 1080p 60fps edge-to-edge broadcast MP4 with FFmpeg...")
    print(f"    Output target: {final_output}")

    # FFmpeg mastering command with subtle dynamic contrast, 60fps, high bitrate libx264
    ffmpeg_cmd = [
        "ffmpeg", "-y",
        "-i", raw_video,
        "-i", master_audio,
        "-filter_complex", "[0:v]eq=contrast=1.03:brightness=0.01:saturation=1.05[v_out]",
        "-map", "[v_out]",
        "-map", "1:a",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        "-r", "60",
        "-c:a", "aac",
        "-b:a", "320k",
        "-shortest",
        final_output
    ]

    t0 = time.time()
    encode_res = subprocess.run(ffmpeg_cmd, capture_output=True, text=True)
    if encode_res.returncode != 0:
        print(f"[!] FFmpeg error:\n{encode_res.stderr}")
        sys.exit(1)

    encode_time = time.time() - t0
    print(f"[+] FFmpeg mastering finished in {encode_time:.2f}s!")

    # Step 4: Final Verification
    if not os.path.exists(final_output):
        print(f"[!] Critical error: {final_output} was not created!")
        sys.exit(1)

    meta = get_file_metadata(final_output)
    print("\n================================================================================")
    print("                 FINAL FULL-SCREEN 1080P MASTER READY                           ")
    print("================================================================================")
    print(f" File Path:    {final_output}")
    print(f" Resolution:   {meta['resolution']} (Full-Screen Edge-to-Edge 16:9)")
    print(f" Frame Rate:   60 FPS")
    print(f" Duration:     {meta['duration']:.2f} seconds (~{int(meta['duration'] // 60)}m {int(meta['duration'] % 60)}s)")
    print(f" File Size:    {meta['size_mb']} MB")
    print(f" Video Codec:  H.264 High Profile (libx264 slow, CRF 17, yuv420p)")
    print(f" Audio Codec:  AAC 320 kbps Stereo Master")
    print(f" Audio Voice:  en-GB-RyanNeural (Deep Executive Cadence)")
    print("================================================================================")

if __name__ == "__main__":
    main()
