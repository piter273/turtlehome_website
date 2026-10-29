#!/usr/bin/env python3
"""Validate the public site's links, anchors, metadata and script syntax."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]

class Document(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids, self.refs, self.meta = set(), [], {}
        self.title = False
        self.h1_count = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get('id'):
            assert attrs['id'] not in self.ids, f"Duplicate ID: {attrs['id']}"
            self.ids.add(attrs['id'])
        if tag == 'title':
            self.title = True
        if tag == 'h1':
            self.h1_count += 1
        if tag == 'meta' and attrs.get('name'):
            self.meta[attrs['name']] = attrs.get('content', '')
        for key in ('href', 'src', 'data-image'):
            if attrs.get(key):
                self.refs.append(attrs[key])

paths = [*ROOT.glob('*.html'), *ROOT.glob('journal/*.html')]
docs = {path: Document(path.read_text()) for path in paths}
requests = 0
for path, doc in docs.items():
    assert doc.title and doc.h1_count == 1, f'{path}: missing title or wrong H1 count'
    assert doc.meta.get('description'), f'{path}: missing description'
    for ref in doc.refs:
        url = urlsplit(ref)
        if url.scheme or url.netloc:
            continue
        target = ((ROOT / unquote(url.path).lstrip('/')) if url.path.startswith('/')
                  else path.parent / unquote(url.path)) if url.path else path
        target = target.resolve()
        if target.is_dir():
            target /= 'index.html'
        assert target.is_relative_to(ROOT), f'Escapes root: {path}: {ref}'
        assert target.is_file(), f'Broken reference: {path}: {ref}'
        if url.fragment:
            assert target in docs and unquote(url.fragment) in docs[target].ids, f'Broken fragment: {path}: {ref}'
        requests += 1
if shutil.which('node'):
    subprocess.run(['node', '--check', str(ROOT / 'assets/site.js')], check=True)
else:
    print('SKIP: JavaScript syntax (Node.js unavailable)')
print(f'PASS: {len(docs)} pages; {requests} local references; unique anchors, H1 and metadata')
