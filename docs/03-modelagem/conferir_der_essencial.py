from pathlib import Path
from io import BytesIO
import hashlib
import json
import re
import zipfile
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont
import pypdfium2 as pdfium
from pypdf import PdfReader, PdfWriter, Transformation
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE = Path(__file__).resolve().parent / 'der-artigo-essencial'
manifesto = json.loads((BASE / 'manifesto.json').read_text(encoding='utf-8'))
PREVIA = BASE.parent / '.conferencia-der-essencial'
PREVIA.mkdir(exist_ok=True)
titulos = [
    'Visão geral do núcleo operacional',
    'Pedido e produção',
    'Produto, receita e matéria-prima',
    'Reserva e consumo de matéria-prima',
    'Produção, etapas e produtos acabados',
]
pdfmetrics.registerFont(TTFont('ArialLocal', 'C:/Windows/Fonts/arial.ttf'))
escritor = PdfWriter()
for indice, nome in enumerate(manifesto['arquivos']):
    ET.parse(BASE / (nome+'.svg'))
    leitor = PdfReader(BASE / (nome+'.pdf'))
    assert len(leitor.pages)==1, nome
    pagina = leitor.pages[0]
    texto = re.sub(r'\s+', '', pagina.extract_text())
    fonte = (BASE/'fontes'/(nome+'.mmd')).read_text(encoding='utf-8')
    esperados = list(manifesto['rotulos_geral'].values()) if indice==0 else re.findall(r'^\s*(\w+)\s*\{', fonte, re.M)
    assert all(re.sub(r'\s+', '', esperado) in texto for esperado in esperados), nome
    buffer = BytesIO()
    pagina_capa = canvas.Canvas(buffer, pagesize=A4)
    pagina_capa.setFont('ArialLocal', 14)
    pagina_capa.drawString(2*cm, A4[1]-1.7*cm, titulos[indice])
    pagina_capa.setFont('ArialLocal', 9)
    nota = 'Visão sem atributos; os subsistemas complementares estão no modelo completo.' if indice==0 else 'Recorte com atributos essenciais; campos omitidos permanecem no modelo completo.'
    pagina_capa.drawString(2*cm, A4[1]-2.3*cm, nota)
    pagina_capa.drawString(2*cm, 1.2*cm, 'Fonte: autores. Modelagem preservada.  |  '+str(indice+1)+'/5')
    pagina_capa.save()
    buffer.seek(0)
    destino = PdfReader(buffer).pages[0]
    largura, altura = float(pagina.mediabox.width), float(pagina.mediabox.height)
    escala = min(17*cm/largura, 23*cm/altura)
    esquerda = (A4[0]-largura*escala)/2
    inferior = (A4[1]-3*cm)-altura*escala
    destino.merge_transformed_page(pagina, Transformation().scale(escala).translate(esquerda,inferior))
    escritor.add_page(destino)
escritor.write(BASE/'DER-geral-e-recortes-essenciais.pdf')
documento = pdfium.PdfDocument(str(BASE/'DER-geral-e-recortes-essenciais.pdf'))
folha = Image.new('RGB', (1800, 1700), 'white')
desenho = ImageDraw.Draw(folha)
fonte_preview = ImageFont.truetype('C:/Windows/Fonts/arial.ttf', 19)
for indice in range(len(documento)):
    imagem = documento[indice].render(scale=1.6).to_pil().convert('RGB')
    imagem.save(PREVIA/f'pagina-{indice+1}.png')
    miniatura=imagem.copy()
    miniatura.thumbnail((570, 780))
    coluna, linha = indice%3, indice//3
    desenho.text((coluna*600+10, linha*850+10),titulos[indice], font=fonte_preview, fill='black')
    folha.paste(miniatura,(coluna*600+(600-miniatura.width)//2,linha*850+45))
documento.close()
folha.save(PREVIA/'contato.png')
arquivos=sorted(arquivo for arquivo in BASE.rglob('*') if arquivo.is_file() and arquivo.suffix!='.zip' and arquivo.name!='SHA256SUMS.txt')
(BASE/'SHA256SUMS.txt').write_text('\n'.join(hashlib.sha256(arquivo.read_bytes()).hexdigest()+'  '+arquivo.relative_to(BASE).as_posix() for arquivo in arquivos)+'\n',encoding='utf-8')
with zipfile.ZipFile(BASE/'DER-artigo-essencial.zip','w',zipfile.ZIP_DEFLATED) as pacote:
    for arquivo in arquivos+[BASE/'SHA256SUMS.txt']:
        pacote.write(arquivo,arquivo.relative_to(BASE).as_posix())
with zipfile.ZipFile(BASE/'DER-artigo-essencial.zip') as pacote:
    assert pacote.testzip() is None
print('Cinco figuras conferidas; caderno A4 e pacote ZIP prontos.')
