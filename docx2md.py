"""Convert DOCX to Markdown using python-docx + markdownify."""
import sys
import re
from pathlib import Path
from docx import Document
from docx.oxml.ns import qn
from markdownify import markdownify as md


def para_to_html(para):
    """Convert a docx paragraph to HTML, preserving inline formatting."""
    html = ""
    for run in para.runs:
        text = run.text
        if not text:
            continue

        # Escape HTML special chars
        text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

        # Wrap with formatting tags
        if run.bold:
            text = f"<strong>{text}</strong>"
        if run.italic:
            text = f"<em>{text}</em>"
        if run.underline:
            text = f"<u>{text}</u>"

        # Hyperlink
        link = run._element.find(qn('w:rPr'))
        if link is not None:
            hlink = link.find(qn('w:rStyle'))
        # Check for hyperlinks via parent paragraph
        hyperlink = run._element.getparent()
        if hyperlink is not None and hyperlink.tag == qn('w:hyperlink'):
            rId = hyperlink.get(qn('r:id'))
            if rId and para.part:
                try:
                    target = para.part.rels[rId].target_ref
                    text = f'<a href="{target}">{text}</a>'
                except (KeyError, AttributeError):
                    pass

        html += text
    return html


def style_to_heading_level(style_name):
    """Extract heading level from style name."""
    if style_name is None:
        return None
    match = re.match(r'[Hh]eading\s*(\d)', style_name)
    if match:
        return int(match.group(1))
    # Chinese heading styles
    match = re.match(r'标题\s*(\d)', style_name)
    if match:
        return int(match.group(1))
    return None


def is_list_paragraph(para):
    """Check if paragraph is a list item."""
    numPr = para._element.find(qn('w:pPr'))
    if numPr is None:
        return None
    numId = numPr.find(qn('w:numPr'))
    if numId is None:
        return None
    numId_val = numId.find(qn('w:numId'))
    if numId_val is not None:
        return numId_val.get(qn('w:val'))
    return None


def para_to_md(para, doc, md_lines, list_counter, prev_was_list):
    """Convert a single paragraph to markdown lines. Returns (new_list_counter, new_prev_was_list)."""
    style_name = para.style.name if para.style else ""
    text = para.text.strip()
    html_content = para_to_html(para)

    if not text and not html_content:
        md_lines.append("")
        return list_counter, False

    # Heading
    heading_level = style_to_heading_level(style_name)
    if heading_level and 1 <= heading_level <= 6:
        prefix = "#" * heading_level
        md_lines.append(f"{prefix} {text}")
        return list_counter, False

    # Check for list
    numId = is_list_paragraph(para)
    if numId is not None:
        numPr = para._element.find(qn('w:pPr')).find(qn('w:numPr'))
        ilvl_elem = numPr.find(qn('w:ilvl'))
        ilvl = int(ilvl_elem.get(qn('w:val'))) if ilvl_elem is not None else 0

        indent = "  " * ilvl

        # Determine if ordered or unordered
        is_ordered = False
        numbering_part = doc.part.numbering_part
        if numbering_part:
            num_element = numbering_part.element
            num = num_element.find(f'{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}num[@{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}numId="{numId}"]')
            if num is not None:
                abstNumId = num.find(qn('w:abstractNumId'))
                if abstNumId is not None:
                    abstNum = num_element.find(f'{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}abstractNum[@{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}abstractNumId="{abstNumId.get(qn("w:val"))}"]')
                    if abstNum is not None:
                        lvl = abstNum.find(f'{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}lvl[@{{http://schemas.openxmlformats.org/wordprocessingml/2006/main}}ilvl="{ilvl}"]')
                        if lvl is not None:
                            numFmt = lvl.find(qn('w:numFmt'))
                            if numFmt is not None:
                                fmt = numFmt.get(qn('w:val'))
                                is_ordered = fmt != 'bullet'

        if is_ordered:
            key = (numId, ilvl)
            list_counter[key] = list_counter.get(key, 0) + 1
            prefix = f"{indent}{list_counter[key]}."
        else:
            prefix = f"{indent}-"

        if html_content:
            converted = md(html_content, heading_style="ATX").strip()
            md_lines.append(f"{prefix} {converted}")
        else:
            md_lines.append(f"{prefix} {text}")
        return list_counter, True

    # Reset list counters when leaving lists
    if prev_was_list and text:
        list_counter = {}

    # Regular paragraph
    if html_content:
        converted = md(html_content, heading_style="ATX").strip()
        md_lines.append(converted)
    else:
        md_lines.append(text)

    md_lines.append("")
    return list_counter, False


def table_to_md(table, md_lines):
    """Convert a docx table to markdown lines."""
    md_lines.append("")
    if table.rows:
        header_cells = [cell.text.replace("\n", " ") for cell in table.rows[0].cells]
        md_lines.append("| " + " | ".join(header_cells) + " |")
        md_lines.append("| " + " | ".join(["---"] * len(header_cells)) + " |")
        for row in table.rows[1:]:
            cells = [cell.text.replace("\n", " ") for cell in row.cells]
            md_lines.append("| " + " | ".join(cells) + " |")
    md_lines.append("")


def docx_to_markdown(docx_path):
    """Convert a DOCX file to Markdown string, preserving document order."""
    doc = Document(docx_path)
    md_lines = []
    list_counter = {}
    prev_was_list = False

    # Iterate body elements in document order (paragraphs + tables interleaved)
    for child in doc.element.body:
        if child.tag == qn('w:p'):
            para = doc.paragraphs[0]  # fallback, should not be used
            # Find the matching Paragraph object — python-docx doesn't expose
            # a direct mapping, so we process the XML paragraph independently.
            # We create a synthetic Paragraph-like wrapper.
            from docx.text.paragraph import Paragraph
            para = Paragraph(child, doc)
            list_counter, prev_was_list = para_to_md(para, doc, md_lines, list_counter, prev_was_list)
        elif child.tag == qn('w:tbl'):
            from docx.table import Table
            table = Table(child, doc)
            table_to_md(table, md_lines)
            prev_was_list = False

    return "\n".join(md_lines)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python docx2md.py <file.docx> [output.md]")
        sys.exit(1)

    input_path = Path(sys.argv[1])
    if not input_path.exists():
        print(f"File not found: {input_path}")
        sys.exit(1)

    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else input_path.with_suffix(".md")

    print(f"Converting: {input_path} -> {output_path}")
    md_content = docx_to_markdown(input_path)
    output_path.write_text(md_content, encoding="utf-8")
    print(f"Done! Output: {output_path}")
