"""Generate EBYG Automation letterhead PDF."""
from reportlab.lib.pagesizes import letter
from reportlab.lib.colors import HexColor
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

OUTPUT = "EBYG_Automation_Letterhead_v3.pdf"
WIDTH, HEIGHT = letter

# Brand colors
DARK_NAVY = HexColor("#2a2a45")
ACCENT_BLUE = HexColor("#3a86ff")
ACCENT_GOLD = HexColor("#d4a843")
MEDIUM_GRAY = HexColor("#555555")
LIGHT_GRAY = HexColor("#e0e0e0")
WHITE = HexColor("#ffffff")


def draw_letterhead(c):
    # === TOP HEADER BAR ===
    c.setFillColor(DARK_NAVY)
    c.rect(0, HEIGHT - 1.4 * inch, WIDTH, 1.4 * inch, fill=1, stroke=0)

    # Gold accent line under header
    c.setStrokeColor(ACCENT_GOLD)
    c.setLineWidth(2.5)
    c.line(0, HEIGHT - 1.4 * inch, WIDTH, HEIGHT - 1.4 * inch)

    # Company name - large
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(0.75 * inch, HEIGHT - 0.7 * inch, "EBYG")

    c.setFillColor(ACCENT_BLUE)
    c.setFont("Helvetica", 28)
    c.drawString(0.75 * inch + c.stringWidth("EBYG", "Helvetica-Bold", 28) + 6,
                 HEIGHT - 0.7 * inch, "Automation")

    # Tagline
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Oblique", 9.5)
    c.drawString(0.75 * inch, HEIGHT - 1.0 * inch,
                 "AI Systems Built Around How Your Business Actually Works")

    # Division line
    c.setFillColor(HexColor("#aaaaaa"))
    c.setFont("Helvetica", 7.5)
    c.drawString(0.75 * inch, HEIGHT - 1.22 * inch,
                 "A Division of EBYG Media LLC")

    # Right side - contact info block
    right_x = WIDTH - 0.75 * inch
    c.setFillColor(WHITE)
    c.setFont("Helvetica", 9)
    c.drawRightString(right_x, HEIGHT - 0.55 * inch, "(801) 648-9652")
    c.drawRightString(right_x, HEIGHT - 0.72 * inch, "info@ebygautomation.com")
    c.drawRightString(right_x, HEIGHT - 0.89 * inch, "www.ebygautomation.com")

    # === FOOTER ===
    # Gold accent line above footer
    c.setStrokeColor(ACCENT_GOLD)
    c.setLineWidth(2)
    c.line(0.75 * inch, 0.9 * inch, WIDTH - 0.75 * inch, 0.9 * inch)

    # Footer bar
    c.setFillColor(DARK_NAVY)
    c.rect(0, 0, WIDTH, 0.65 * inch, fill=1, stroke=0)

    # Footer text
    c.setFillColor(LIGHT_GRAY)
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(WIDTH / 2, 0.38 * inch,
                        "(801) 648-9652  |  info@ebygautomation.com  |  www.ebygautomation.com")
    c.setFillColor(ACCENT_GOLD)
    c.setFont("Helvetica-Oblique", 7)
    c.drawCentredString(WIDTH / 2, 0.2 * inch,
                        "Consistent presence. Genuine care. Quiet reliability.")


def main():
    c = canvas.Canvas(OUTPUT, pagesize=letter)
    c.setTitle("EBYG Automation - Letterhead")
    c.setAuthor("EBYG Automation")
    draw_letterhead(c)
    c.showPage()
    c.save()
    print(f"Letterhead saved to: {OUTPUT}")


if __name__ == "__main__":
    main()
