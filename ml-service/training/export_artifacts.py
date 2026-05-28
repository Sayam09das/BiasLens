"""Export artifact inventory metadata for trained files."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS_DIR = ROOT / "artifacts"
OUTPUT_PATH = ARTIFACTS_DIR / "artifact_manifest.json"


def main() -> None:
    """Create a machine-readable artifact manifest."""
    manifest = []
    for path in sorted(ARTIFACTS_DIR.rglob("*")):
        if path.is_file():
            manifest.append(
                {
                    "path": str(path.relative_to(ROOT)),
                    "size_bytes": path.stat().st_size,
                }
            )

    with OUTPUT_PATH.open("w", encoding="utf-8") as handle:
        json.dump({"artifacts": manifest}, handle, indent=2)
    print(f"Saved artifact manifest to: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
