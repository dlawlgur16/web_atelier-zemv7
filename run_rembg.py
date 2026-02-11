#!/usr/bin/env python3
"""
Atelier ZEM — rembg 배경 제거 스크립트
Mac에서 실행:
  pip install rembg[cpu] Pillow numpy
  python3 run_rembg.py
"""
import subprocess
import sys
from pathlib import Path

def main():
    # 1. rembg import
    try:
        from rembg import remove
        from PIL import Image
        import numpy as np
        import io
    except ImportError:
        print("rembg가 설치되어 있지 않습니다.")
        print("먼저 실행하세요: pip install rembg[cpu] Pillow numpy")
        sys.exit(1)

    # 2. 경로 설정
    base = Path(__file__).parent
    pic_dir = base / "pic"
    nobg_dir = base / "pic_nobg"
    nobg_dir.mkdir(exist_ok=True)

    # 3. AI 생성 이미지만 처리 (u31로 시작하는 파일)
    ai_images = sorted([f for f in pic_dir.iterdir() if f.name.startswith("u31") and f.suffix == ".png"])

    print(f"\nAtelier ZEM — rembg 배경 제거")
    print(f"  대상: {len(ai_images)}개 AI 이미지")
    print(f"  출력: {nobg_dir}\n")

    for i, src in enumerate(ai_images, 1):
        dst = nobg_dir / src.name
        short = src.name[:50]
        print(f"  [{i:2d}/{len(ai_images)}] {short}...", end=" ", flush=True)

        try:
            with open(src, "rb") as f:
                input_data = f.read()

            output_data = remove(input_data)

            img = Image.open(io.BytesIO(output_data)).convert("RGBA")
            img.save(dst, "PNG", optimize=True)

            arr = np.array(img)
            trans_pct = (arr[:,:,3] == 0).sum() / (arr.shape[0] * arr.shape[1]) * 100
            print(f"OK ({trans_pct:.0f}% transparent)")

        except Exception as e:
            print(f"FAIL: {e}")

    print(f"\nDone! Check {nobg_dir}")
    print("Refresh goods.html in browser to see results.\n")

if __name__ == "__main__":
    main()
