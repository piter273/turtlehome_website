#!/usr/bin/env python3
"""Create the dependency-free Cloudflare Pages deployment in dist/."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "dist"
if OUT.is_symlink():
    raise SystemExit("Refusing to build into a symlinked dist directory")
if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
# Copy only public website files; never include Git metadata, scripts or docs.
for pattern in ("*.html", "*.png", "*.svg", "*.ico", "*.txt", "_headers", "_redirects"):
    for source in ROOT.glob(pattern):
        if source.is_file():
            shutil.copy2(source, OUT / source.name)
for name in ("assets", "journal"):
    shutil.copytree(ROOT / name, OUT / name, dirs_exist_ok=True)
print(f"Static website built: {OUT}")
