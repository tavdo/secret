# -*- coding: utf-8 -*-
from pathlib import Path
import re

p = Path(__file__).resolve().parents[1] / 'src' / 'admin' / 'pages' / 'AdminLogin.jsx'
t = p.read_text(encoding='utf-8')

t = re.sub(
    r"err\?\.code === 'NOT_ADMIN'[\s\S]{0,200}?setError\(msg\);",
    "err?.code === 'NOT_ADMIN'\n"
    "          ? '\u10d4\u10e1 \u10d0\u10dc\u10d2\u10d0\u10e0\u10d8\u10e8\u10d8 \u10d0\u10d3\u10db\u10d8\u10dc\u10d8 \u10d0\u10e0 \u10d0\u10e0\u10d8\u10e1.'\n"
    "          : err?.response?.data?.error || err?.message || '\u10e8\u10d4\u10e1\u10d5\u10da\u10d0 \u10d5\u10d4\u10e0 \u10db\u10dd\u10ee\u10d4\u10e0\u10ee\u10d3\u10d0';\n"
    "      setError(msg);",
    t,
    count=1,
)

help_ka = (
    "\u10e5\u10db\u10dc\u10d8\u10e1 \u10de\u10d8\u10e0\u10d5\u10d4\u10da \u10d0\u10d3\u10db\u10d8\u10dc\u10e1, "
    "\u10d7\u10e3 \u10d0\u10e0\u10ea\u10d4\u10e0\u10d7\u10d8 \u10d0\u10e0 \u10d0\u10e0\u10e1\u10d4\u10d1\u10dd\u10d1\u10e1. "
    "\u10d2\u10d0\u10db\u10dd\u10d8\u10e7\u10d4\u10dc\u10d4\u10d7 \u10d4\u10e0\u10d7\u10ee\u10d4\u10da, "
    "\u10e8\u10d4\u10db\u10d3\u10d4\u10d2 \u10e8\u10d4\u10d3\u10d8\u10d7 \u10e9\u10d5\u10d4\u10e3\u10da\u10d4\u10d1\u10e0\u10d8\u10d5\u10d0\u10d3."
)
t = re.sub(
    r'(<p className="text-xs text-zinc-500 leading-relaxed">)[\s\S]*?(</p>\s*\) : null\})',
    rf"\1\n              {help_ka}\n            \2",
    t,
    count=1,
)

p.write_text(t, encoding='utf-8')
print('fffd' if '\ufffd' in t else 'ok', p)
