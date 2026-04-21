"""PDF generation utility for marketing plans."""

from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    PageBreak,
    Image,
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY


def generate_pdf(goal: str, strategy: dict) -> BytesIO:
    """
    Generate a professional PDF for the marketing strategy.
    
    Args:
        goal: The marketing goal
        strategy: Dictionary with 'planning', 'research', and 'execution' keys
    
    Returns:
        BytesIO object containing the PDF
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=0.75*inch, leftMargin=0.75*inch)
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Define custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#1F2937'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#2563EB'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold',
        borderColor=colors.HexColor('#2563EB'),
        borderWidth=2,
        borderPadding=8,
    )
    
    subheading_style = ParagraphStyle(
        'SubHeading',
        parent=styles['Heading3'],
        fontSize=12,
        textColor=colors.HexColor('#059669'),
        spaceAfter=8,
        spaceBefore=8,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        leading=16,
    )
    
    # Build content
    content = []
    
    # Header
    content.append(Paragraph("AI Marketing Strategy Plan", title_style))
    content.append(Spacer(1, 0.2*inch))
    
    # Goal section
    goal_para = Paragraph(f"<b>Marketing Goal:</b><br/>{goal}", body_style)
    content.append(goal_para)
    content.append(Spacer(1, 0.15*inch))
    
    # Date
    date_para = Paragraph(f"<i>Generated on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</i>", 
                         ParagraphStyle('DateStyle', parent=styles['Normal'], fontSize=9, textColor=colors.grey))
    content.append(date_para)
    content.append(Spacer(1, 0.3*inch))
    
    # Planning Section
    content.append(Paragraph("1. Strategic Planning", heading_style))
    planning_items = []
    for i, step in enumerate(strategy.get('planning', []), 1):
        planning_items.append([
            Paragraph(f"<b>Step {i}</b>", body_style),
            Paragraph(step, body_style)
        ])
    
    if planning_items:
        planning_table = Table(planning_items, colWidths=[1*inch, 5.5*inch])
        planning_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#DBEAFE')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')]),
        ]))
        content.append(planning_table)
    
    content.append(Spacer(1, 0.2*inch))
    
    # Research Section
    content.append(Paragraph("2. Market Research & Insights", heading_style))
    research_items = []
    for item in strategy.get('research', []):
        research_items.append([
            Paragraph(f"<b>{item.get('title', 'Insight')}</b>", subheading_style),
            Paragraph(item.get('insight', ''), body_style)
        ])
    
    if research_items:
        research_table = Table(research_items, colWidths=[1.5*inch, 5*inch])
        research_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#DCFCE7')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')]),
        ]))
        content.append(research_table)
    
    content.append(Spacer(1, 0.2*inch))
    
    # Execution Section
    content.append(Paragraph("3. Execution Plan", heading_style))
    execution_items = []
    for item in strategy.get('execution', []):
        execution_items.append([
            Paragraph(f"<b>{item.get('channel', 'Action')}</b>", subheading_style),
            Paragraph(item.get('action', ''), body_style)
        ])
    
    if execution_items:
        execution_table = Table(execution_items, colWidths=[1.5*inch, 5*inch])
        execution_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#FEE2E2')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 12),
            ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#E5E7EB')),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')]),
        ]))
        content.append(execution_table)
    
    content.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_style = ParagraphStyle(
        'FooterStyle',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=TA_CENTER,
        borderColor=colors.HexColor('#E5E7EB'),
        borderWidth=1,
        borderPadding=8,
    )
    content.append(Paragraph(
        "Generated by AI Marketing Planning Generator | Powered by CrewAI",
        footer_style
    ))
    
    # Build PDF
    doc.build(content)
    buffer.seek(0)
    return buffer
