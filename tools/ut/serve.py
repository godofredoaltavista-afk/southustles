#!/usr/bin/env python3
"""Serve the existing app tree locally with the same asset MIME types as Nginx."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".css": "text/css",
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".ttf": "font/ttf",
        ".otf": "font/otf",
        ".svg": "image/svg+xml",
        ".glb": "model/gltf-binary",
        ".gltf": "model/gltf+json",
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4173)
    parser.add_argument("--bind", default="127.0.0.1")
    args = parser.parse_args()
    app_directory = Path(__file__).resolve().parents[2] / "app"
    handler = partial(PreviewHandler, directory=str(app_directory))
    with ThreadingHTTPServer((args.bind, args.port), handler) as server:
        print(f"UT preview: http://{args.bind}:{args.port}/UT/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
