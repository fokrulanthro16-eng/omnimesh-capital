#!/usr/bin/env python3
"""
OmniMesh Capital - Automated 1080p Full HD (60 FPS) Edge-to-Edge Headless Recording Pipeline
Records browser interactions with 100% full-screen responsive layout (no letterboxing or shrinking)
in exact millisecond synchronization with the executive voiceover soundtrack.
"""

import os
import sys
import time
import json
from playwright.sync_api import sync_playwright

def load_timings():
    timings_path = os.path.join(os.path.dirname(__file__), "audio_timings.json")
    if os.path.exists(timings_path):
        with open(timings_path, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"total_duration": 170.63}

def inject_edge_to_edge_layout(page):
    """
    Injects CSS and JS to expand the dashboard container to 100% edge-to-edge
    full screen, removing letterboxing, centered constraints, and scrollbars.
    """
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
        overflow-x: hidden !important;
        zoom: 100% !important;
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
    page.add_style_tag(content=edge_css)

    page.evaluate("""() => {
        document.body.style.zoom = '100%';
        document.documentElement.style.overflow = 'hidden';
    }""")

def inject_virtual_cursor(page):
    """Injects a glowing institutional neon cyan virtual cursor with fluid physics."""
    js = """
    (() => {
        if (document.getElementById('demo-virtual-cursor')) return;
        const c = document.createElement('div');
        c.id = 'demo-virtual-cursor';
        c.style.position = 'fixed';
        c.style.width = '20px';
        c.style.height = '20px';
        c.style.borderRadius = '50%';
        c.style.backgroundColor = 'rgba(6, 182, 212, 0.95)';
        c.style.border = '2px solid #ffffff';
        c.style.boxShadow = '0 0 16px rgba(34, 211, 238, 1), 0 0 32px rgba(6, 182, 212, 0.7)';
        c.style.pointerEvents = 'none';
        c.style.zIndex = '9999999';
        c.style.transform = 'translate(-50%, -50%)';
        c.style.transition = 'left 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.15s ease, background-color 0.15s ease';
        c.style.left = '960px';
        c.style.top = '100px';

        // Trailing glow ring
        const ring = document.createElement('div');
        ring.id = 'demo-virtual-ring';
        ring.style.position = 'fixed';
        ring.style.width = '40px';
        ring.style.height = '40px';
        ring.style.borderRadius = '50%';
        ring.style.border = '1.5px solid rgba(34, 211, 238, 0.6)';
        ring.style.boxShadow = '0 0 15px rgba(6, 182, 212, 0.4)';
        ring.style.pointerEvents = 'none';
        ring.style.zIndex = '9999998';
        ring.style.transform = 'translate(-50%, -50%)';
        ring.style.transition = 'left 0.22s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)';
        ring.style.left = '960px';
        ring.style.top = '100px';

        document.body.appendChild(ring);
        document.body.appendChild(c);

        window.moveCursorTo = (x, y) => {
            c.style.left = `${x}px`;
            c.style.top = `${y}px`;
            ring.style.left = `${x}px`;
            ring.style.top = `${y}px`;
        };

        window.clickCursor = () => {
            c.style.transform = 'translate(-50%, -50%) scale(0.65)';
            c.style.backgroundColor = '#10b981';
            c.style.boxShadow = '0 0 25px rgba(16, 185, 129, 1), 0 0 45px rgba(16, 185, 129, 0.8)';
            setTimeout(() => {
                c.style.transform = 'translate(-50%, -50%) scale(1.0)';
                c.style.backgroundColor = 'rgba(6, 182, 212, 0.95)';
                c.style.boxShadow = '0 0 16px rgba(34, 211, 238, 1), 0 0 32px rgba(6, 182, 212, 0.7)';
            }, 220);
        };
    })();
    """
    page.evaluate(js)

def smooth_move_cursor(page, target_x, target_y, steps=15, duration=0.4):
    """Moves the virtual cursor to a specific screen location with fluid interpolation."""
    curr = page.evaluate("() => { const c = document.getElementById('demo-virtual-cursor'); return c ? { x: parseFloat(c.style.left), y: parseFloat(c.style.top) } : { x: 960, y: 100 }; }")
    start_x, start_y = curr['x'], curr['y']
    step_delay = duration / steps
    for i in range(1, steps + 1):
        t = i / steps
        ease = t * t * (3.0 - 2.0 * t)
        cx = start_x + (target_x - start_x) * ease
        cy = start_y + (target_y - start_y) * ease
        page.evaluate(f"window.moveCursorTo({cx}, {cy})")
        time.sleep(step_delay)

def cursor_click_selector(page, selector, dwell_after=0.8):
    """Moves cursor to element center, triggers click animation and dispatches click."""
    try:
        loc = page.locator(selector).first
        if loc.count() > 0:
            loc.scroll_into_view_if_needed()
            time.sleep(0.15)
            box = loc.bounding_box()
            if box:
                cx = box['x'] + box['width'] / 2
                cy = box['y'] + box['height'] / 2
                smooth_move_cursor(page, cx, cy, steps=18, duration=0.45)
                time.sleep(0.1)
                page.evaluate("window.clickCursor()")
                loc.click()
                time.sleep(dwell_after)
                return True
    except Exception as e:
        print(f"    [!] Warning clicking {selector}: {e}")
    return False

def smooth_scroll(page, target_y, duration=1.0, steps=20):
    """Smoothly scrolls the window to target_y."""
    curr_y = page.evaluate("() => window.scrollY")
    step_delay = duration / steps
    for i in range(1, steps + 1):
        t = i / steps
        ease = t * t * (3.0 - 2.0 * t)
        sy = curr_y + (target_y - curr_y) * ease
        page.evaluate(f"window.scrollTo(0, {sy})")
        time.sleep(step_delay)

def set_slider_value(page, slider_index, value):
    """Safely updates React range slider value."""
    js = f"""
    (() => {{
        const sliders = document.querySelectorAll('input[type="range"]');
        if (sliders[{slider_index}]) {{
            const s = sliders[{slider_index}];
            const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
            setter.call(s, '{value}');
            s.dispatchEvent(new Event('input', {{ bubbles: true }}));
            s.dispatchEvent(new Event('change', {{ bubbles: true }}));
        }}
    }})();
    """
    page.evaluate(js)

def run_recording():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    public_dir = os.path.join(base_dir, "public")
    video_raw_dir = os.path.join(base_dir, "temp_recording")
    os.makedirs(video_raw_dir, exist_ok=True)
    os.makedirs(public_dir, exist_ok=True)

    timings = load_timings()
    total_audio_duration = timings.get("total_duration", 170.63)
    print(f"[*] Target synchronized recording duration: {total_audio_duration}s")

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

        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1,
            record_video_dir=video_raw_dir,
            record_video_size={"width": 1920, "height": 1080}
        )

        page = context.new_page()
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.wait_for_timeout(1000)

        # Inject edge-to-edge layout & remove container shrinking
        inject_edge_to_edge_layout(page)
        inject_virtual_cursor(page)
        page.wait_for_timeout(600)

        start_time = time.time()
        print(f"[+] Recording started at 1920x1080 Full HD (100% Edge-to-Edge) at t=0.0s")

        # ----------------------------------------------------------------------
        # SEGMENT 1 (0.0s - 30.95s): Hook & Problem (SME Liquidity Crisis)
        # ----------------------------------------------------------------------
        print("[*] Segment 1: Hook & Problem - Showcasing Full-Screen 3D Mesh & Vault Tiles")
        smooth_move_cursor(page, 280, 50, steps=25, duration=1.5)  # OmniMesh Brand
        time.sleep(1.5)

        smooth_move_cursor(page, 1050, 50, steps=20, duration=1.2)  # SOFR / Nebius / FinBERT Ticker
        time.sleep(2.0)

        # Move across 4 full-width Digital Node Vaults
        smooth_move_cursor(page, 240, 160, steps=22, duration=1.2)  # Tile 1: Liquid Vault Balance
        time.sleep(3.0)

        smooth_move_cursor(page, 720, 160, steps=22, duration=1.2)  # Tile 2: Zero-Cash Horizon
        time.sleep(3.0)

        smooth_move_cursor(page, 1200, 160, steps=22, duration=1.2)  # Tile 3: Net Burn Velocity
        time.sleep(2.5)

        # Trigger Cash Shock Panic Defense
        print("    -> Triggering Sentinel Cash Shock Panic Defense")
        cursor_click_selector(page, 'button:has-text("Simulate Cash Shock")', dwell_after=3.5)

        # Clear Panic Mode back to nominal
        cursor_click_selector(page, 'button:has-text("DEFENSE LOCK ACTIVE")', dwell_after=2.0)

        # Ensure we sync with end of segment 1 (~30.95s)
        while time.time() - start_time < 30.95:
            time.sleep(0.2)

        # ----------------------------------------------------------------------
        # SEGMENT 2 (30.95s - 70.21s): Merkle Hash-Chain & Monte Carlo Runway
        # ----------------------------------------------------------------------
        print("[*] Segment 2: Merkle Hash-Chain & Monte Carlo Stochastic Runway")
        smooth_scroll(page, 240, duration=1.0)
        time.sleep(0.5)

        # Hover over Monte Carlo Runway Simulator Tab
        smooth_move_cursor(page, 280, 290, steps=15, duration=0.8)
        time.sleep(1.5)

        # Move to Monte Carlo Sliders (right panel)
        print("    -> Interacting with Monte Carlo Revenue Volatility Slider")
        smooth_move_cursor(page, 1550, 480, steps=20, duration=1.2)
        time.sleep(0.5)

        # Drag Revenue Volatility from 0% to -35%
        for v in [-10, -20, -35]:
            set_slider_value(page, 0, v)
            time.sleep(0.8)

        # Drag Burn Shock Multiplier to 1.6x
        print("    -> Interacting with OpEx Burn Multiplier Slider")
        smooth_move_cursor(page, 1550, 560, steps=15, duration=0.8)
        time.sleep(0.4)
        for b in [1.2, 1.4, 1.6]:
            set_slider_value(page, 1, b)
            time.sleep(0.8)

        # Reset Macro Sliders to Baseline
        cursor_click_selector(page, 'button:has-text("Reset Macro Sliders to Baseline")', dwell_after=1.5)

        # Click Hash-Chain Tab
        print("    -> Switching to Cryptographic Hash-Chain tab")
        cursor_click_selector(page, 'button:has-text("Hash-Chain")', dwell_after=1.5)

        # Scroll through verified Merkle blocks
        smooth_scroll(page, 380, duration=1.2)
        time.sleep(2.0)

        # Simulate Tamper Attack on Block #3
        print("    -> Simulating Tamper Attack (Block #3)")
        cursor_click_selector(page, 'button:has-text("Simulate Tamper Attack")', dwell_after=3.5)

        # Recalculate & Heal Chain
        print("    -> Recalculating and Healing Hash-Chain")
        cursor_click_selector(page, 'button:has-text("Recalculate & Heal Chain")', dwell_after=2.5)

        while time.time() - start_time < 70.21:
            time.sleep(0.2)

        # ----------------------------------------------------------------------
        # SEGMENT 3 (70.21s - 108.32s): Dual-AI Orchestration (Nebius 70B & HF)
        # ----------------------------------------------------------------------
        print("[*] Segment 3: Dual-AI Orchestration (Nebius 70B & Hugging Face FinBERT)")
        smooth_scroll(page, 200, duration=0.8)

        # Switch to Autonomous AI Operations tab
        cursor_click_selector(page, 'button:has-text("Autonomous AI Operations")', dwell_after=1.5)

        # Smooth scroll down to AI action cards
        smooth_scroll(page, 320, duration=1.0)
        time.sleep(1.0)

        # Select Gentle Tone in dropdown (second select element)
        print("    -> Selecting Gentle Tone for Debt Recovery Notice")
        try:
            tone_select = page.locator("select").nth(1)
            if tone_select.count() > 0:
                tone_select.scroll_into_view_if_needed()
                box = tone_select.bounding_box()
                if box:
                    smooth_move_cursor(page, box['x'] + box['width'] / 2, box['y'] + box['height'] / 2, steps=15, duration=0.6)
                    tone_select.select_option("GENTLE")
                    page.evaluate("window.clickCursor()")
                    time.sleep(1.0)
            else:
                cursor_click_selector(page, 'button:has-text("Gentle")', dwell_after=1.0)
        except Exception as e:
            print(f"    [!] Tone selection: {e}")

        # Click Run Nebius 70B Debt Settlement
        print("    -> Executing Nebius 70B Debt Settlement Notice Generator")
        cursor_click_selector(page, 'button:has-text("Run Nebius 70B Debt Settlement")', dwell_after=6.0)

        # Move to Hugging Face FinBERT Audit
        print("    -> Executing Hugging Face FinBERT Credit Sentiment Audit")
        cursor_click_selector(page, 'button:has-text("Run Hugging Face Financial Audit")', dwell_after=3.5)

        # Scroll down to Autonomous Event Bus live terminal
        print("    -> Inspecting Autonomous Event Bus live terminal feed")
        smooth_scroll(page, 620, duration=1.2)
        smooth_move_cursor(page, 960, 680, steps=20, duration=1.2)
        time.sleep(4.0)

        while time.time() - start_time < 108.32:
            time.sleep(0.2)

        # ----------------------------------------------------------------------
        # SEGMENT 4 (109.32s - 141.96s): ZK-Solvency Passport (Groth16 zk-SNARK)
        # ----------------------------------------------------------------------
        print("[*] Segment 4: ZK-Solvency Passport (Groth16 zk-SNARK Attestation)")
        smooth_scroll(page, 0, duration=1.2)
        time.sleep(0.8)

        # Click ZK Solvency Passport button in header
        print("    -> Opening ZK Solvency Passport Modal")
        cursor_click_selector(page, 'button:has-text("ZK Solvency Passport")', dwell_after=2.0)

        # Hover over Institutional Liquidity Corridor Visualizer
        smooth_move_cursor(page, 960, 420, steps=20, duration=1.2)
        time.sleep(3.5)

        # Hover over ZK Credential Card & R1CS gates
        smooth_move_cursor(page, 850, 560, steps=20, duration=1.2)
        time.sleep(3.5)

        # Click Export Verifiable Credential (Copy proof)
        print("    -> Exporting Verifiable Groth16 Credential")
        cursor_click_selector(page, 'button:has-text("Export Verifiable Credential")', dwell_after=3.0)

        # Close Modal
        print("    -> Closing Modal")
        page.evaluate("() => { const btns = document.querySelectorAll('button'); for (const b of btns) { if (b.querySelector('svg.lucide-x')) { b.click(); break; } } }")
        time.sleep(1.5)

        while time.time() - start_time < 141.96:
            time.sleep(0.2)

        # ----------------------------------------------------------------------
        # SEGMENT 5 (142.96s - 170.63s): $5.2T Market Opportunity & Overview
        # ----------------------------------------------------------------------
        print("[*] Segment 5: Market Opportunity & Full-Screen Grand Finale")
        smooth_scroll(page, 200, duration=0.8)

        # Switch to Receivables & Payables tab
        cursor_click_selector(page, 'button:has-text("Receivables & Payables")', dwell_after=3.0)

        # Switch back to Monte Carlo Runway Simulator
        cursor_click_selector(page, 'button:has-text("Monte Carlo Runway Simulator")', dwell_after=2.0)

        # Scroll to pristine executive overview
        smooth_scroll(page, 80, duration=1.2)
        smooth_move_cursor(page, 960, 240, steps=25, duration=2.0)

        # Hold steady for narration conclusion
        rem = total_audio_duration - (time.time() - start_time)
        if rem > 0:
            print(f"    -> Holding steady on executive dashboard for {rem:.2f}s...")
            time.sleep(rem)

        # Extra buffer before close
        time.sleep(1.0)
        print(f"[+] Recording completed in {time.time() - start_time:.2f}s")

        page.close()
        context.close()
        browser.close()

    # Find recorded webm
    recorded_files = [os.path.join(video_raw_dir, f) for f in os.listdir(video_raw_dir) if f.endswith(".webm")]
    if not recorded_files:
        print("[!] No recorded video found in temp_recording!")
        sys.exit(1)

    latest_video = max(recorded_files, key=os.path.getctime)
    print(f"[+] Raw 1080p WebM captured: {latest_video} ({os.path.getsize(latest_video)} bytes)")
    return latest_video

if __name__ == "__main__":
    run_recording()
