"""Generate a tiny synthetic resume sample file."""

from __future__ import annotations

from pathlib import Path


def main() -> None:
    output_path = Path(__file__).resolve().parents[1] / "data" / "synthetic" / "synthetic_resume_samples.txt"
    output_path.write_text(
        "Synthetic Resume 1: Python, SQL, Tableau, data analysis\n"
        "Synthetic Resume 2: React, Next.js, Node.js, Express, Docker\n",
        encoding="utf-8",
    )
    print(f"Saved synthetic resume samples to: {output_path}")


if __name__ == "__main__":
    main()
