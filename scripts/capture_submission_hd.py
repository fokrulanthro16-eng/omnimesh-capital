#!/usr/bin/env python3
"""
OmniMesh Capital - Ultra-HD (4K Crisp 3840x2160) Presentation Screenshot Generator
Optimized specifically for Devpost gallery submission.
Captures 6 institutional-grade views showcasing core FinTech & ZK-SNARK innovations.
"""

import os
import sys
import time
import subprocess
import re
from playwright.sync_api import sync_playwright

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    out_dir = os.path.join(base_dir, "public", "submission_screenshots")
    os.makedirs(out_dir, exist_ok=True)

    print("================================================================================")
    print("      OMNIMESH CAPITAL - DEVPOST ULTRA-HD (4K 3840x2160) SCREENSHOT PIPELINE    ")
    print("================================================================================")
    print(f"[*] Target Directory: {out_dir}")

    edge_css = """
    /* Force 100% edge-to-edge full screen across all containers */
    .max-w-7xl {
        max-width: 100% !important;
        width: 100% !important;
        padding-left: 28px !important;
        padding-right: 28px !important;
    }
    html, body {
        width: 100vw !important;
        max-width: 100vw !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
    }
    main {
        max-width: 100% !important;
        width: 100% !important;
    }
    header {
        width: 100% !important;
    }
    ::-webkit-scrollbar {
        display: none !important;
        width: 0px !important;
        background: transparent !important;
    }
    * {
        scrollbar-width: none !important;
    }
    """

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=[
                "--start-maximized",
                "--window-size=1920,1080",
                "--hide-scrollbars",
                "--disable-gpu",
                "--no-sandbox",
                "--disable-dev-shm-usage",
            ]
        )

        # 1920x1080 with device_scale_factor=2 renders native 3840x2160 Ultra-Retina UHD
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=2
        )

        page = context.new_page()
        print("[*] Loading OmniMesh Capital at http://localhost:3000...")
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.add_style_tag(content=edge_css)
        page.evaluate("""() => {
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            document.body.style.zoom = '100%';
        }""")
        page.wait_for_timeout(1500)

        # ----------------------------------------------------------------------
        # 1. 01_OmniMesh_Command_Center_4K.png
        # ----------------------------------------------------------------------
        print("\n[1/6] Capturing: 01_OmniMesh_Command_Center_4K.png")
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(1000)
        img1_path = os.path.join(out_dir, "01_OmniMesh_Command_Center_4K.png")
        page.screenshot(path=img1_path)
        print(f"      -> Saved: {img1_path}")

        # ----------------------------------------------------------------------
        # 2. 02_Monte_Carlo_Stochastic_Runway_4K.png
        # ----------------------------------------------------------------------
        print("\n[2/6] Capturing: 02_Monte_Carlo_Stochastic_Runway_4K.png")
        page.locator('button:has-text("Monte Carlo Runway Simulator")').first.click()
        page.wait_for_timeout(800)
        # Position viewport cleanly on the 120-path chart and stress verdict panel
        page.evaluate("window.scrollTo(0, 240)")
        page.wait_for_timeout(1000)
        img2_path = os.path.join(out_dir, "02_Monte_Carlo_Stochastic_Runway_4K.png")
        page.screenshot(path=img2_path)
        print(f"      -> Saved: {img2_path}")

        # ----------------------------------------------------------------------
        # 3. 03_Dual_AI_Autonomous_Orchestrator_4K.png
        # ----------------------------------------------------------------------
        print("\n[3/6] Capturing: 03_Dual_AI_Autonomous_Orchestrator_4K.png")
        page.locator('button:has-text("Autonomous AI Operations")').first.click()
        page.wait_for_timeout(600)
        # Trigger both AI engines to ensure rich visual outputs
        print("      -> Invoking Nebius 70B & Hugging Face FinBERT for populated state...")
        page.locator('button:has-text("Run Nebius 70B Debt Settlement")').first.click()
        page.locator('button:has-text("Run Hugging Face Financial Audit")').first.click()
        page.wait_for_timeout(5500)
        page.evaluate("window.scrollTo(0, 220)")
        page.wait_for_timeout(1000)
        img3_path = os.path.join(out_dir, "03_Dual_AI_Autonomous_Orchestrator_4K.png")
        page.screenshot(path=img3_path)
        print(f"      -> Saved: {img3_path}")

        # ----------------------------------------------------------------------
        # 4. 04_Autonomous_Event_Bus_Syslog_4K.png
        # ----------------------------------------------------------------------
        print("\n[4/6] Capturing: 04_Autonomous_Event_Bus_Syslog_4K.png")
        # Scroll down so the active streaming event bus terminal is front-and-center
        page.evaluate("window.scrollTo(0, 680)")
        page.wait_for_timeout(1000)
        img4_path = os.path.join(out_dir, "04_Autonomous_Event_Bus_Syslog_4K.png")
        page.screenshot(path=img4_path)
        print(f"      -> Saved: {img4_path}")

        # ----------------------------------------------------------------------
        # 5. 05_ZK_Solvency_Passport_Modal_4K.png
        # ----------------------------------------------------------------------
        print("\n[5/6] Capturing: 05_ZK_Solvency_Passport_Modal_4K.png")
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(600)
        # Open ZK Modal
        page.locator('button:has-text("ZK Solvency Passport")').first.click()
        page.wait_for_timeout(1200)
        img5_path = os.path.join(out_dir, "05_ZK_Solvency_Passport_Modal_4K.png")
        page.screenshot(path=img5_path)
        print(f"      -> Saved: {img5_path}")

        # Close modal
        page.evaluate("""() => {
            const btns = document.querySelectorAll('button');
            for (const b of btns) {
                if (b.querySelector('svg.lucide-x')) { b.click(); break; }
            }
        }""")
        page.wait_for_timeout(800)

        # ----------------------------------------------------------------------
        # 6. 06_Merkle_Chain_Cryptographic_Integrity_4K.png
        # ----------------------------------------------------------------------
        print("\n[6/6] Capturing: 06_Merkle_Chain_Cryptographic_Integrity_4K.png")
        page.locator('button:has-text("Hash-Chain")').first.click()
        page.wait_for_timeout(800)
        page.evaluate("window.scrollTo(0, 220)")
        page.wait_for_timeout(1000)
        img6_path = os.path.join(out_dir, "06_Merkle_Chain_Cryptographic_Integrity_4K.png")
        page.screenshot(path=img6_path)
        print(f"      -> Saved: {img6_path}")

        context.close()
        browser.close()

    # Verification of dimensions and file sizes
    print("\n================================================================================")
    print("                    SCREENSHOT VERIFICATION & METADATA                          ")
    print("================================================================================")
    for fname in sorted(os.listdir(out_dir)):
        if fname.endswith(".png"):
            fpath = os.path.join(out_dir, fname)
            fsize_mb = round(os.path.getsize(fpath) / (1024 * 1024), 2)
            res = subprocess.run(["ffmpeg", "-i", fpath], capture_output=True, text=True, check=False)
            m = re.search(r"Video:.*,\s+(\d{3,4}x\d{3,4})", res.stderr)
            res_str = m.group(1) if m else "Unknown"
            print(f"  • {fname:<45} | Res: {res_str} | Size: {fsize_mb} MB")

    print("\n[+] Direct Absolute Folder Path for Devpost Upload:")
    print(f"    {out_dir}")
    print("================================================================================")

if __name__ == "__main__":
    main()
