#!/usr/bin/env python3
"""
Andistro Software Center Launcher
Using pywebview for cross-platform desktop app
"""

import webview
import os
import sys

def main():
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the HTML file
    html_path = os.path.join(script_dir, 'public', 'index.html')
    
    # Check if HTML file exists
    if not os.path.exists(html_path):
        print(f"Error: HTML file not found at {html_path}")
        sys.exit(1)
    
    # Create the webview window
    try:
        webview.create_window(
            'Andistro Software Center',
            f'file://{html_path}',
            width=1200,
            height=800,
            min_size=(800, 600)
        )
        webview.start(debug=False)
    except Exception as e:
        print(f"Error starting application: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()