#!/usr/bin/env python3
"""Copy the bundled financial dashboard template into a new directory."""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path


def scaffold(output_dir: Path) -> None:
    template_dir = Path(__file__).resolve().parent.parent / "assets" / "dashboard-template"
    if not template_dir.is_dir():
        raise SystemExit(f"Template asset not found: {template_dir}")

    if output_dir.exists() and any(output_dir.iterdir()):
        raise SystemExit(
            f"Output directory is not empty: {output_dir}\n"
            "Choose a new or empty directory; existing files are never overwritten."
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    for source in template_dir.iterdir():
        target = output_dir / source.name
        if source.is_dir():
            shutil.copytree(source, target)
        else:
            shutil.copy2(source, target)

    print(f"Dashboard template created at: {output_dir.resolve()}")
    print("Next: replace all NVIDIA sample data and follow references/dashboard-adaptation.md.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a working offline ECharts financial-report dashboard scaffold."
    )
    parser.add_argument("output_directory", type=Path)
    args = parser.parse_args()
    scaffold(args.output_directory.expanduser().resolve())


if __name__ == "__main__":
    main()
