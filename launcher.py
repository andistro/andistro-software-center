#!/usr/bin/env python3
import os
import sys
import gi
gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.0')
from gi.repository import Gtk, WebKit2, Gdk

class AndistroSoftwareCenter(Gtk.Window):
    def __init__(self):
        super().__init__(title="Andistro Software Center")
        
        # Set window icon to ic_store.svg
        icon_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "assets", "ic_store.svg")
        if os.path.exists(icon_path):
            self.set_icon_from_file(icon_path)
        
        self.set_default_size(1200, 800)
        self.set_position(Gtk.WindowPosition.CENTER)
        
        # Create WebView
        self.webview = WebKit2.WebView()
        
        # Load the application
        html_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "index.html")
        if os.path.exists(html_path):
            self.webview.load_uri(f"file://{html_path}")
        else:
            print(f"Error: HTML file not found at {html_path}")
        
        self.add(self.webview)
        
        # Connect close event
        self.connect("delete-event", Gtk.main_quit)

if __name__ == "__main__":
    app = AndistroSoftwareCenter()
    app.show_all()
    Gtk.main()