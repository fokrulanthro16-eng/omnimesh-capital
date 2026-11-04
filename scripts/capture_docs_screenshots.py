#!/usr/bin/env python3
"""
OmniMesh Capital - Documentation Screenshot Capture Pipeline
Captures high-res institutional screenshots for README.md and documentation.
"""

import os
import time
from playwright.sync_api import sync_playwright

def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    docs_img_dir = os.path.join(base_dir, "docs", "screenshots")
    os.makedirs(docs_img_dir, exist_ok=True)

    edge_css = """
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
    }
    """

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=["--start-maximized", "--window-size=1920,1080", "--hide-scrollbars"]
        )

        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=1
        )
        page = context.new_page()
        page.goto("http://localhost:3000", wait_until="networkidle")
        page.add_style_tag(content=edge_css)
        page.wait_for_timeout(1000)

        # 1. Main Dashboard Overview
        print("[*] Capturing dashboard.png...")
        page.screenshot(path=os.path.join(docs_img_dir, "dashboard.png"))

        # 2. Monte Carlo Runway Simulator
        print("[*] Capturing monte_carlo.png...")
        page.evaluate("window.scrollTo(0, 240)")
        page.wait_for_timeout(600)
        page.screenshot(path=os.path.join(docs_img_dir, "monte_carlo.png"))

        # 3. Hash Chain Ledger
        print("[*] Capturing hash_chain.png...")
        page.locator('button:has-text("Hash-Chain")').first.click()
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(docs_img_dir, "hash_chain.png"))

        # 4. Dual-AI Operations (Nebius 70B & FinBERT)
        print("[*] Capturing ai_operations.png...")
        page.locator('button:has-text("Autonomous AI Operations")').first.click()
        page.wait_for_timeout(500)
        # Execute AI actions to show populated state
        page.locator('button:has-text("Run Nebius 70B Debt Settlement")').first.click()
        page.locator('button:has-text("Run Hugging Face Financial Audit")').first.click()
        page.wait_for_timeout(5500)
        page.evaluate("window.scrollTo(0, 260)")
        page.screenshot(path=os.path.join(docs_img_dir, "ai_operations.png"))

        # 5. ZK Solvency Passport Modal
        print("[*] Capturing zk_passport.png...")
        page.evaluate("window.scrollTo(0, 0)")
        page.locator('button:has-text("ZK Solvency Passport")').first.click()
        page.wait_for_timeout(800)
        page.screenshot(path=os.path.join(docs_img_dir, "zk_passport.png"))

        context.close()
        browser.close()

    print("[+] All documentation screenshots captured successfully in docs/screenshots/!")

if __name__ == "__main__":
    main()
