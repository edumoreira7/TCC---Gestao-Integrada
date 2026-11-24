from pathlib import Path
import json
import re
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont
import pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter

BASE = Path(__file__).resolve().parent / 'figuras-artigo'
manifesto = json.loads((BASE / 'manifesto.json').read_text(encoding='utf-8'))
previews = BASE.parent / '.conferencia-figuras-artigo'
previews.mkdir(exist_ok=True)
font = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 22)
folha = Image.new('RGB', (2100, 2400), 'white')
desenho = ImageDraw.Draw(folha)
detalhes_folha = Image.new('RGB', (2100, 1600), 'white')
detalhes_desenho = ImageDraw.Draw(detalhes_folha)
escritor = PdfWriter()
numero = 0
for nome in sorted(manifesto['arquivos']):
    ET.parse(BASE / (nome + '.svg'))
    leitor = PdfReader(BASE / (nome + '.pdf'))
    assert len(leitor.pages) == 1, nome
    texto = leitor.pages[0].extract_text()
    assert texto and len(texto) > 30, (nome, 'PDF sem texto pesquisável')
    fonte_mermaid = BASE / 'fontes' / (nome + '.mmd')
    if fonte_mermaid.exists():
        fonte_texto = fonte_mermaid.read_text(encoding='utf-8')
        entidades = re.findall(r'^\s*(\w+)\s*\{', fonte_texto, re.M)
        normalizado = re.sub(r'\s+', '', texto)
        assert all(entidade in normalizado for entidade in entidades), (nome, 'Nome de entidade ausente no PDF')
    if nome.startswith(('06-', '07-', '08-')):
        fonte = (BASE / (nome + '.svg')).read_text(encoding='utf-8')
        assert set(re.findall(r'CU\d+', fonte)) <= set(re.findall(r'CU\d+', texto)), nome
    documento = pdfium.PdfDocument(str(BASE / (nome + '.pdf')))
    imagem = documento[0].render(scale=min(1.5, 1800 / float(leitor.pages[0].mediabox.width))).to_pil().convert('RGB')
    imagem.save(previews / (nome + '.png'))
    if nome in manifesto.get('detalhes', []):
        indice = manifesto['detalhes'].index(nome)
        miniatura = imagem.copy()
        miniatura.thumbnail((660, 720))
        coluna, linha = indice % 3, indice // 3
        detalhes_desenho.text((coluna * 700 + 12, linha * 800 + 8), nome[:44], font=font, fill='black')
        detalhes_folha.paste(miniatura, (coluna * 700 + (700-miniatura.width)//2, linha * 800 + 48))
    if not nome.startswith('00-') and nome not in manifesto.get('detalhes', []):
        miniatura = imagem.copy()
        miniatura.thumbnail((660, 720))
        coluna = numero % 3
        linha = numero // 3
        desenho.text((coluna * 700 + 12, linha * 800 + 8), nome[:44], font=font, fill='black')
        folha.paste(miniatura, (coluna * 700 + (700-miniatura.width)//2, linha * 800 + 48))
        numero += 1
        escritor.add_page(leitor.pages[0])
    documento.close()
folha.save(previews / 'contato.png')
detalhes_folha.save(previews / 'detalhes.png')
escritor.write(BASE / 'Diagramas-para-artigo.pdf')
print('PDFs reabertos, texto pesquisável, SVGs válidos e caderno de nove vistas criado.')
print(previews / 'contato.png')
