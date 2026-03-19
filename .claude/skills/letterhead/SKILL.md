---
name: letterhead
description: Generate an EBYG Automation branded PDF letterhead or document with the approved brand style. Use when creating letters, proposals, invoices, reports, or any official company documentation.
argument-hint: "[output-filename]"
allowed-tools: Read, Write, Bash
---

# EBYG Automation Letterhead Generator

Generate a branded PDF document using reportlab with the EBYG Automation approved style.

Output filename: $ARGUMENTS (default: `EBYG_Automation_Letterhead.pdf` if no argument given)

## Company Info
- **Company Name**: EBYG Automation
- **Parent**: A Division of EBYG Media LLC
- **Tagline**: "AI Systems Built Around How Your Business Actually Works"
- **Philosophy**: "Consistent presence. Genuine care. Quiet reliability."
- **Phone**: (801) 648-9652
- **Email**: info@ebygautomation.com
- **Website**: www.ebygautomation.com

## Brand Colors (MUST use these exact values)
| Name         | Hex       | Usage                                       |
|--------------|-----------|----------------------------------------------|
| Dark Navy    | `#2a2a45` | Header bar, footer bar backgrounds           |
| Accent Blue  | `#3a86ff` | "Automation" text, accent elements            |
| Accent Gold  | `#d4a843` | Tagline, accent lines, philosophy text        |
| Medium Gray  | `#555555` | Body text                                     |
| Light Gray   | `#e0e0e0` | Footer contact text                           |
| White        | `#ffffff` | "EBYG" text, header contact info              |
| Muted Gray   | `#aaaaaa` | Division subtitle                             |

## Page Layout (US Letter 8.5" x 11")

### Header (top 1.4 inches)
- Full-width dark navy (`#2a2a45`) rectangle, 1.4" tall
- 2.5pt accent gold line underneath, full width
- **Left side** (0.75" from left):
  - "EBYG" in Helvetica-Bold 28pt white
  - "Automation" in Helvetica 28pt accent blue, 6px gap after "EBYG"
  - Tagline in Helvetica-Oblique 9.5pt accent gold, at 1.0" from top
  - "A Division of EBYG Media LLC" in Helvetica 7.5pt muted gray, at 1.22" from top
- **Right side** (0.75" from right edge, right-aligned):
  - Phone in Helvetica 9pt white, at 0.55" from top
  - Email in Helvetica 9pt white, at 0.72" from top
  - Website in Helvetica 9pt white, at 0.89" from top

### Body
- Clean/empty — no decorative elements
- 0.75" side margins
- Body text when added: Helvetica 10pt medium gray

### Footer (bottom 0.9 inches)
- 2pt accent gold line at 0.9" from bottom, inset 0.75" from each side
- Full-width dark navy rectangle, 0.65" tall from bottom edge
- Centered contact: Helvetica 7.5pt light gray — `(801) 648-9652  |  info@ebygautomation.com  |  www.ebygautomation.com`
- Centered philosophy: Helvetica-Oblique 7pt accent gold — `Consistent presence. Genuine care. Quiet reliability.`

## Implementation

Use Python with `reportlab` to generate the PDF. Write a Python script, execute it, then open the resulting PDF for the user. Reference implementation is at `generate_letterhead.py` in the project root.

If the user provides body content (letter text, proposal content, etc.), add it to the body area using the body text style (Helvetica 10pt, medium gray, 0.85" left margin).
