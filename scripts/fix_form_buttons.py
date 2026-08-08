# -*- coding: utf-8 -*-
from pathlib import Path
p = Path(__file__).resolve().parents[1] / "src/admin/components/ProfileFormModal.jsx"
t = p.read_text(encoding="utf-8")
t = t.replace(">Cancel<", ">\u10d2\u10d0\u10e3\u10e5\u10db\u10d4\u10d1\u10d0<")
t = t.replace(
    "busy ? 'Saving\u2026' : isEdit ? 'Save changes' : 'Create profile'",
    "busy ? '\u10d8\u10dc\u10d0\u10ee\u10d4\u10d1\u10d0\u2026' : isEdit ? '\u10e8\u10d4\u10dc\u10d0\u10ee\u10d5\u10d0' : '\u10e8\u10d4\u10e5\u10db\u10dc\u10d0'",
)
t = t.replace(
    "Drag tiles to reorder. First upload becomes hero if portrait empty.",
    "\u10d2\u10d0\u10d3\u10d0\u10d0\u10d0\u10d3\u10d2\u10d8\u10da\u10d4\u10d7 \u10e0\u10d8\u10d2\u10d8\u10d7 \u10d2\u10d0\u10d3\u10d0\u10da\u10d0\u10d2\u10d4\u10d1\u10d8\u10e1\u10d7\u10d5\u10d8\u10e1.",
)
p.write_text(t, encoding="utf-8")
print("ok" if "\ufffd" not in t else "bad")
