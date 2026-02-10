"""
제품 이미지 배경 제거 스크립트
pic 폴더의 모든 이미지에서 배경을 제거하고 투명 PNG로 저장합니다.

사용법:
1. pip install rembg pillow
2. python remove_bg.py
"""

from rembg import remove
from PIL import Image
import os

# 설정
INPUT_FOLDER = "pic"
OUTPUT_FOLDER = "pic_nobg"  # 원본 보존, 별도 폴더에 저장

def remove_background(input_path, output_path):
    """이미지에서 배경을 제거하고 저장"""
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path, "PNG")
        print(f"[완료] {os.path.basename(input_path)}")
        return True
    except Exception as e:
        print(f"[실패] {os.path.basename(input_path)}: {e}")
        return False

def main():
    # 출력 폴더 생성 (다른 폴더로 저장할 경우)
    if OUTPUT_FOLDER != INPUT_FOLDER:
        os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    # 지원 이미지 확장자
    supported_extensions = ('.png', '.jpg', '.jpeg', '.webp')

    # pic 폴더의 모든 이미지 찾기
    images = [f for f in os.listdir(INPUT_FOLDER)
              if f.lower().endswith(supported_extensions)]

    if not images:
        print(f"'{INPUT_FOLDER}' 폴더에 이미지가 없습니다.")
        return

    print(f"\n{len(images)}개 이미지 배경 제거 시작...\n")

    success = 0
    for filename in images:
        input_path = os.path.join(INPUT_FOLDER, filename)
        # 출력 파일명 (확장자를 .png로 변경)
        output_filename = os.path.splitext(filename)[0] + ".png"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)

        if remove_background(input_path, output_path):
            success += 1

    print(f"\n완료! {success}/{len(images)}개 이미지 처리됨")

if __name__ == "__main__":
    main()
