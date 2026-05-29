"""Export runtime-readable metric summaries."""

from __future__ import annotations

import json
from pathlib import Path


def main() -> None:
    artifacts_dir = Path(__file__).resolve().parents[1] / "artifacts" / "metrics"
    summary = {
        path.name: json.loads(path.read_text(encoding="utf-8"))
        for path in artifacts_dir.glob("*.json")
    }
    output_path = artifacts_dir / "metrics_export.json"
    output_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(f"Saved metrics export to: {output_path}")


if __name__ == "__main__":
    main()
