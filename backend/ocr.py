"""
ocr.py — wyciąganie tekstu ze zdjęć i PDF-ów
"""

import io
import logging
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from fastapi import HTTPException

logger = logging.getLogger(__name__)


def ocr_image_bytes(image_bytes: bytes) -> str:
    """Wyciąga tekst ze zdjęcia (bytes) przez Tesseract."""
    try:
        import pytesseract
        from PIL import Image
        image = Image.open(io.BytesIO(image_bytes))
        return pytesseract.image_to_string(image, lang="pol").strip()
    except ImportError:
        raise HTTPException(500, "Zainstaluj: pip install pytesseract pillow")
    except Exception as e:
        logger.error(f"OCR błąd: {e}")
        raise HTTPException(422, f"Nie udało się odczytać obrazu: {e}")


def ocr_image_pil(pil_image) -> str:
    """Wyciąga tekst z obiektu PIL.Image."""
    try:
        import pytesseract
        return pytesseract.image_to_string(pil_image, lang="pol").strip()
    except ImportError:
        raise HTTPException(500, "Zainstaluj: pip install pytesseract pillow")


def ocr_pdf(file_bytes: bytes) -> str:
    """
    Wyciąga tekst z PDF.
    Najpierw próbuje bezpośrednio (jeśli PDF ma warstwę tekstową).
    Jeśli to skan — konwertuje strony na obrazy i robi OCR.
    """
    # Próba 1: bezpośrednie wyciągnięcie tekstu
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = "\n".join(
            page.extract_text() or "" for page in reader.pages
        ).strip()
        if len(text) > 50:
            logger.info("PDF z warstwą tekstową — tekst wyciągnięty bezpośrednio")
            return text
    except Exception as e:
        logger.warning(f"PyPDF2 nie zadziałał: {e}")

    # Próba 2: PDF jako skan — OCR przez Tesseract
    logger.info("PDF wygląda jak skan — konwertuję strony na obrazy")
    try:
        from pdf2image import convert_from_bytes
        pages = convert_from_bytes(file_bytes, dpi=200)
        texts = [ocr_image_pil(page) for page in pages]
        return "\n".join(texts).strip()
    except ImportError:
        raise HTTPException(
            500,
            "PDF jest skanem — zainstaluj: pip install pdf2image\n"
            "Oraz poppler: sudo apt install poppler-utils"
        )


def extract_text(filename: str, file_bytes: bytes) -> str:
    """
    Główna funkcja — wybiera metodę OCR na podstawie rozszerzenia.
    Zwraca wyciągnięty tekst lub rzuca HTTPException.
    """
    name = filename.lower()

    if name.endswith(".pdf"):
        text = ocr_pdf(file_bytes)
    elif name.endswith((".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff")):
        text = ocr_image_bytes(file_bytes)
    else:
        raise HTTPException(
            400,
            f"Nieobsługiwany format: {filename}. Użyj JPG, PNG lub PDF."
        )

    if len(text) < 30:
        raise HTTPException(
            422,
            "Nie udało się odczytać tekstu. Upewnij się że zdjęcie jest wyraźne i dobrze oświetlone."
        )

    logger.info(f"OCR wyciągnął {len(text)} znaków z {filename}")
    return text