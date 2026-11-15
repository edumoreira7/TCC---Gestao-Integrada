"""Render the repository's uncompressed draw.io models using Pillow.

Usage: python docs/03-modelagem/render_drawio.py
The editable XML is the source; this renderer supports the shapes/routes used here.
Requires Pillow and Arial (Windows) or DejaVu Sans (Linux).
"""
from pathlib import Path
import html
import math
import re
import xml.etree.ElementTree as ET
from PIL import Image, ImageDraw, ImageFont

BASE = Path(__file__).resolve().parent

def font(size, bold=False):
    candidates = ['C:/Windows/Fonts/arialbd.ttf' if bold else 'C:/Windows/Fonts/arial.ttf',
                  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf']
    for candidate in candidates:
        if Path(candidate).exists(): return ImageFont.truetype(candidate, int(size))
    return ImageFont.load_default(size=int(size))

def style(cell):
    return dict(part.split('=',1) for part in cell.get('style','').split(';') if '=' in part)

def geometry(cell):
    g=cell.find('mxGeometry')
    return tuple(float(g.get(k,'0')) for k in ['x','y','width','height'])

def render(diagram, output):
    model=diagram.find('mxGraphModel')
    cells=model.findall('root/mxCell'); byid={c.get('id'):c for c in cells}
    image=Image.new('RGB',(int(model.get('pageWidth','2120')),int(model.get('pageHeight','1760'))),'white')
    draw=ImageDraw.Draw(image)
    for c in cells:
        if c.get('edge')!='1': continue
        s=style(c); source=byid.get(c.get('source')); target=byid.get(c.get('target'))
        if source is None or target is None: continue
        x,y,w,h=geometry(source); xx,yy,ww,hh=geometry(target)
        start=(x+w*float(s.get('exitX','.5')),y+h*float(s.get('exitY','1')))
        end=(xx+ww*float(s.get('entryX','.5')),yy+hh*float(s.get('entryY','0')))
        points=[start]+[(float(p.get('x')),float(p.get('y'))) for p in c.findall('mxGeometry/Array/mxPoint')]+[end]
        if s.get('dashed')=='1':
            for a,b in zip(points,points[1:]):
                length=math.dist(a,b)
                for offset in range(0,int(length),12):
                    draw.line([(a[0]+(b[0]-a[0])*t/length,a[1]+(b[1]-a[1])*t/length) for t in [offset,min(offset+7,length)]],fill=s.get('strokeColor','#475569'),width=2)
        else: draw.line(points,fill=s.get('strokeColor','#475569'),width=2)
        for location,neighbor,arrow in [(start,points[1],s.get('startArrow')),(end,points[-2],s.get('endArrow'))]:
            if arrow in [None,'none']: continue
            angle=math.atan2(location[1]-neighbor[1],location[0]-neighbor[0]); dx,dy=math.cos(angle),math.sin(angle)
            a=(location[0]-15*dx+6*dy,location[1]-15*dy-6*dx);b=(location[0]-15*dx-6*dy,location[1]-15*dy+6*dx)
            shape=[location,a,(location[0]-30*dx,location[1]-30*dy),b] if arrow=='diamond' else [location,a,b]
            draw.polygon(shape,fill=s.get('strokeColor','#475569'))
    # Paint shapes before labels; labels have a white background over connectors.
    vertices=[c for c in cells if c.get('vertex')=='1']
    vertices.sort(key=lambda c: 'text;' in c.get('style',''))
    for c in vertices:
        x,y,w,h=geometry(c);s=style(c);raw=c.get('value','');istext=c.get('style','').startswith('text;')
        if not istext:
            if 'rhombus;' in c.get('style',''): draw.polygon([(x+w/2,y),(x+w,y+h/2),(x+w/2,y+h),(x,y+h/2)],fill=s.get('fillColor','#F8FAFC'),outline=s.get('strokeColor','#475569'))
            else: draw.rectangle((x,y,x+w,y+h),fill=s.get('fillColor','#F8FAFC'),outline=s.get('strokeColor','#475569'),width=2)
        elif s.get('fillColor'): draw.rectangle((x,y,x+w,y+h),fill=s['fillColor'])
        size=int(s.get('fontSize','18'));padding=0 if istext else 12
        text=html.unescape(re.sub('<[^>]+>','',re.sub(r'<(?:br\s*/?|hr)\s*>','\n',raw)))
        lines=[]
        for paragraph in text.splitlines():
            line=''
            for word in paragraph.split():
                trial=(line+' '+word).strip()
                if line and draw.textlength(trial,font=font(size))>w-2*padding: lines.append(line);line=word
                else: line=trial
            lines.append(line)
        lineheight=size*1.27
        if len(lines)*lineheight > h-2*padding+3:
            raise ValueError(f'Text overflows {diagram.get("id")}/{c.get("id")}: {len(lines)} lines in {h}px')
        top=y+padding if s.get('verticalAlign')=='top' or istext else y+(h-len(lines)*lineheight)/2
        for i,line in enumerate(lines):
            bold=(i==0 and '<b>' in raw) or s.get('fontStyle')=='1'
            f=font(size,bold)
            left=x+padding if s.get('align')=='left' or istext else x+(w-draw.textlength(line,font=f))/2
            draw.text((left,top+i*lineheight),line,font=f,fill=s.get('fontColor','#172033'))
        if '<hr>' in raw: draw.line((x+2,y+padding+lineheight,x+w-2,y+padding+lineheight),fill='#475569',width=1)
    image.save(output)
    print(output.relative_to(BASE))
    return image

if __name__=='__main__':
    for d in ET.parse(BASE/'classes/classes-dominio.drawio').findall('diagram'):
        render(d,BASE/'classes'/f'{d.get("id")}.png')
    d=ET.parse(BASE/'fluxo-macro/fluxo-macro.drawio').find('diagram')
    image=render(d,BASE/'fluxo-macro/fluxo-macro.png')
    image.save(BASE/'fluxo-macro/fluxo-macro.jpg',quality=94)
