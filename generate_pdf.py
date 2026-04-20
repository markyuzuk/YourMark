#!/usr/bin/env python3
from playwright.sync_api import sync_playwright
import os

def generate_pdf():
    html_path = os.path.abspath('invoice-sensorium.html')
    pdf_path = os.path.abspath('invoice-sensorium.pdf')
    
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(f'file://{html_path}')
        page.pdf(path=pdf_path, format='Letter', print_background=True)
        browser.close()
    
    print(f"✅ PDF created: {pdf_path}")

if __name__ == '__main__':
    generate_pdf()
