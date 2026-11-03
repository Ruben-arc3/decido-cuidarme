from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.utils import ImageReader, simpleSplit
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "pitch-decido-cuidarme.pdf"
CAPS = ROOT / "caps"
W, H = 960, 540

INK = colors.HexColor("#172A2D")
MUTED = colors.HexColor("#52676A")
TEAL = colors.HexColor("#087F72")
TEAL_LIGHT = colors.HexColor("#E6F4F0")
PAPER = colors.HexColor("#F8F8F3")
WHITE = colors.white
LINE = colors.HexColor("#DCE5E0")
CORAL = colors.HexColor("#EE765E")
GOLD = colors.HexColor("#E7B94D")
BLUE = colors.HexColor("#667BC1")


def txt(c, x, y, value, size=12, color=INK, font="Helvetica", max_width=None, leading=None):
    c.setFillColor(color)
    c.setFont(font, size)
    lines = [value] if max_width is None else simpleSplit(value, font, size, max_width)
    step = leading or size * 1.42
    for line in lines:
        c.drawString(x, y, line)
        y -= step
    return y


def label(c, x, y, value):
    txt(c, x, y, value.upper(), 8, TEAL, "Helvetica-Bold")


def header(c, section, number):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    label(c, 58, H - 46, section)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.line(58, 44, W - 58, 44)
    txt(c, 58, 27, "DECIDO CUIDARME  /  ALCALDÍA DE PUERTO ESCONDIDO", 7.5, MUTED, "Helvetica-Bold")
    c.setFillColor(TEAL)
    c.circle(W - 64, 28, 12, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(W - 64, 25, f"{number:02d}")


def image_panel(c, filename, x, y, width, height, caption=None):
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.setLineWidth(1)
    c.roundRect(x - 6, y - 6, width + 12, height + 12, 12, fill=1, stroke=1)
    path = CAPS / filename
    reader = ImageReader(str(path))
    iw, ih = reader.getSize()
    scale = min(width / iw, height / ih)
    draw_w, draw_h = iw * scale, ih * scale
    c.drawImage(reader, x + (width - draw_w) / 2, y + (height - draw_h) / 2,
                draw_w, draw_h, preserveAspectRatio=True, mask="auto")
    if caption:
        txt(c, x, y - 20, caption, 8.5, MUTED)


def card(c, x, y, width, height, number, title, body, accent=TEAL):
    c.setFillColor(WHITE)
    c.setStrokeColor(LINE)
    c.roundRect(x, y, width, height, 12, fill=1, stroke=1)
    c.setFillColor(accent)
    c.roundRect(x + 14, y + height - 39, 28, 25, 7, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 9)
    c.drawCentredString(x + 28, y + height - 30, number)
    txt(c, x + 14, y + height - 60, title, 12, INK, "Helvetica-Bold", width - 28)
    txt(c, x + 14, y + height - 84, body, 9.2, MUTED, max_width=width - 28, leading=13)


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H), pageCompression=1)
    c.setTitle("Pitch institucional | Decido Cuidarme")
    c.setAuthor("Alcaldía de Puerto Escondido, Córdoba")
    c.setSubject("Plataforma educativa para campañas de prevención")

    # 1. Opening: real screenshot establishes the product immediately.
    c.setFillColor(colors.HexColor("#102F38"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#17434A"))
    c.circle(915, 505, 185, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#1A5558"))
    c.circle(865, 470, 116, fill=1, stroke=0)
    c.setFillColor(colors.HexColor("#B9E8D9"))
    c.roundRect(58, 465, 248, 25, 13, fill=1, stroke=0)
    txt(c, 72, 474, "CAMPAÑAS DE PREVENCIÓN  ·  PUERTO ESCONDIDO", 8, INK, "Helvetica-Bold")
    txt(c, 58, 396, "Decido", 43, WHITE, "Helvetica-Bold")
    txt(c, 58, 345, "Cuidarme", 43, WHITE, "Helvetica-Bold")
    txt(c, 60, 302, "Aprender, conversar y practicar decisiones", 14, colors.HexColor("#D8E8E5"))
    txt(c, 60, 282, "que protegen la vida.", 14, colors.HexColor("#D8E8E5"))
    c.setFillColor(TEAL)
    c.roundRect(58, 205, 273, 48, 10, fill=1, stroke=0)
    txt(c, 74, 232, "Plataforma educativa comunitaria", 11, WHITE, "Helvetica-Bold")
    txt(c, 74, 215, "Realizada por la Alcaldía de Puerto Escondido, Córdoba", 8.5, WHITE)
    image_panel(c, "Screenshot_100.png", 373, 105, 526, 238, "Vista real del portal central")
    txt(c, 60, 71, "PRESENTACIÓN INSTITUCIONAL", 8, colors.HexColor("#B7D1CD"), "Helvetica-Bold")
    txt(c, 60, 53, "decido-cuidarme.pages.dev", 9, colors.HexColor("#D8E8E5"))
    c.showPage()

    # 2. Why it exists and the shared campaign portal.
    header(c, "EL PROPÓSITO", 2)
    txt(c, 58, 450, "Prevenir también es", 29, INK, "Helvetica-Bold")
    txt(c, 58, 415, "aprender a decidir", 29, TEAL, "Helvetica-Bold")
    txt(c, 58, 373,
        "Decido Cuidarme reúne materiales claros y actividades participativas para acompañar conversaciones de prevención en el aula y la comunidad.",
        11, MUTED, max_width=390, leading=16)
    card(c, 58, 165, 126, 112, "01", "Informar", "Guías y contenidos cercanos.", TEAL)
    card(c, 196, 165, 126, 112, "02", "Practicar", "Juegos con situaciones ficticias.", CORAL)
    card(c, 334, 165, 126, 112, "03", "Acompañar", "Reconocer apoyos y personas de confianza.", BLUE)
    image_panel(c, "Screenshot_1.png", 495, 186, 407, 183, "Campañas principales en el portal")
    c.setFillColor(colors.HexColor("#FFF5D9"))
    c.roundRect(58, 82, 844, 48, 10, fill=1, stroke=0)
    txt(c, 75, 108, "Cuidado y participación", 10, INK, "Helvetica-Bold")
    txt(c, 75, 91, "Las actividades usan ejemplos ficticios y no exigen compartir experiencias personales.", 9, MUTED)
    c.showPage()

    # 3. Four campaign pillars, paired with an actual campaign page.
    header(c, "CUATRO CAMPAÑAS", 3)
    txt(c, 58, 450, "Un mismo propósito,", 28, INK, "Helvetica-Bold")
    txt(c, 58, 417, "cuatro temas de cuidado", 28, TEAL, "Helvetica-Bold")
    campaign_items = [
        ("01", "Consumo de sustancias", "Decisiones informadas, presión de grupo y apoyo entre pares.", TEAL),
        ("02", "Violencia intrafamiliar", "Señales de alerta, escucha respetuosa y acompañamiento seguro.", CORAL),
        ("03", "Abuso sexual", "Límites, consentimiento, seguridad digital y búsqueda de apoyo.", BLUE),
        ("04", "Siniestros viales", "Movilidad segura para peatones, ciclistas y pasajeros.", GOLD),
    ]
    for i, (num, title, body, accent) in enumerate(campaign_items):
        x = 58 + (i % 2) * 202
        y = 266 - (i // 2) * 126
        card(c, x, y, 184, 108, num, title, body, accent)
    image_panel(c, "Screenshot_5.png", 500, 127, 397, 260, "Ejemplo de página de campaña")
    txt(c, 58, 86, "Cada tema combina información, recursos y opciones para participar.", 10, MUTED)
    c.showPage()

    # 4. Learning by doing, including classroom/team use.
    header(c, "APRENDER HACIENDO", 4)
    txt(c, 58, 450, "Del contenido a", 29, INK, "Helvetica-Bold")
    txt(c, 58, 415, "la participación", 29, TEAL, "Helvetica-Bold")
    image_panel(c, "Screenshot_2.png", 58, 113, 504, 294, "Juegos disponibles para el salón")
    txt(c, 606, 367, "Una experiencia para el aula", 16, INK, "Helvetica-Bold")
    steps = [
        ("Elegir", "Entrar a una campaña, explorar una guía o abrir un juego."),
        ("Participar", "Resolver retos, conversar y tomar decisiones en equipo."),
        ("Conectar", "Cerrar la actividad con reflexión y redes de apoyo."),
    ]
    for idx, (title, body) in enumerate(steps):
        y = 316 - idx * 78
        c.setFillColor(TEAL_LIGHT)
        c.circle(619, y + 2, 14, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 9)
        c.drawCentredString(619, y - 1, str(idx + 1))
        txt(c, 646, y + 6, title, 12, INK, "Helvetica-Bold")
        txt(c, 646, y - 13, body, 9.5, MUTED, max_width=245, leading=13)
    c.setFillColor(colors.HexColor("#FFF5D9"))
    c.roundRect(606, 91, 296, 45, 9, fill=1, stroke=0)
    txt(c, 621, 116, "Actividades voluntarias y seguras", 9.5, INK, "Helvetica-Bold")
    txt(c, 621, 99, "No requieren compartir vivencias personales.", 8.5, MUTED)
    c.showPage()

    # 5. Institutional contexts.
    header(c, "COMUNIDAD Y ACCESO", 5)
    txt(c, 58, 450, "Un portal común,", 29, INK, "Helvetica-Bold")
    txt(c, 58, 415, "dos contextos escolares", 29, TEAL, "Helvetica-Bold")
    image_panel(c, "Screenshot_3.png", 58, 173, 496, 222, "Espacios para Vicente Díaz y Villa Esther")
    txt(c, 600, 359, "Institución Educativa", 11, TEAL, "Helvetica-Bold")
    txt(c, 600, 338, "Vicente Díaz", 20, INK, "Helvetica-Bold")
    txt(c, 600, 312, "Acceso a campañas compartidas y recursos para el trabajo escolar.", 10, MUTED, max_width=280, leading=15)
    c.setStrokeColor(LINE)
    c.line(600, 273, 900, 273)
    txt(c, 600, 245, "Institución Educativa", 11, TEAL, "Helvetica-Bold")
    txt(c, 600, 224, "Villa Esther", 20, INK, "Helvetica-Bold")
    txt(c, 600, 198, "Además integra orientación, proyecto de vida, preparación Saber 11 y exploración educativa y laboral.", 10, MUTED, max_width=280, leading=15)
    c.setFillColor(TEAL_LIGHT)
    c.roundRect(58, 91, 844, 48, 10, fill=1, stroke=0)
    txt(c, 76, 119, "Acceso desde distintos dispositivos", 10, INK, "Helvetica-Bold")
    txt(c, 76, 101, "Diseño adaptable y opción PWA; algunos recursos estáticos pueden quedar disponibles sin conexión.", 9, MUTED)
    c.showPage()

    # 6. Support and concrete rollout.
    header(c, "IMPLEMENTACIÓN Y CONTINUIDAD", 6)
    txt(c, 58, 450, "Una campaña que crece", 29, INK, "Helvetica-Bold")
    txt(c, 58, 415, "con la comunidad", 29, TEAL, "Helvetica-Bold")
    txt(c, 58, 376, "La plataforma ofrece una base digital para presentar, facilitar y ampliar acciones educativas de prevención en Puerto Escondido.", 11, MUTED, max_width=415, leading=16)
    image_panel(c, "Screenshot_4.png", 58, 111, 463, 197, "Mapa de apoyo y mensaje de cuidado")
    txt(c, 570, 357, "Siguientes pasos sugeridos", 15, INK, "Helvetica-Bold")
    next_steps = [
        "Socializar el portal con equipos directivos y docentes.",
        "Seleccionar una campaña y una actividad para cada jornada.",
        "Verificar y actualizar las rutas locales de orientación.",
        "Recoger comentarios para priorizar mejoras y recursos.",
    ]
    for i, step in enumerate(next_steps):
        y = 321 - i * 43
        c.setFillColor(TEAL)
        c.circle(579, y + 2, 4, fill=1, stroke=0)
        txt(c, 593, y + 5, step, 9.5, MUTED, max_width=300, leading=13)
    c.setFillColor(colors.HexColor("#EAF0FA"))
    c.roundRect(570, 105, 332, 63, 10, fill=1, stroke=0)
    txt(c, 588, 144, "Seguimiento educativo", 10, INK, "Helvetica-Bold")
    txt(c, 588, 126, "Observar participación, uso de recursos, retroalimentación docente y vigencia de las rutas.", 9, MUTED, max_width=295, leading=12)
    txt(c, 58, 73, "Alcaldía de Puerto Escondido, Córdoba  ·  Campañas de prevención para aprender y cuidarnos en comunidad", 8.5, MUTED)
    c.save()


if __name__ == "__main__":
    build()
