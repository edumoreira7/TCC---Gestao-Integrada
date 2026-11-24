from pathlib import Path
import hashlib
import zipfile

BASE = Path(__file__).resolve().parent / 'figuras-artigo'
arquivos = sorted(arquivo for arquivo in BASE.rglob('*') if arquivo.is_file() and arquivo.suffix != '.zip' and arquivo.name != 'SHA256SUMS.txt')
linhas = [f'{hashlib.sha256(arquivo.read_bytes()).hexdigest()}  {arquivo.relative_to(BASE).as_posix()}' for arquivo in arquivos]
(BASE / 'SHA256SUMS.txt').write_text('\n'.join(linhas) + '\n', encoding='utf-8')
with zipfile.ZipFile(BASE / 'Figuras-artigo.zip', 'w', zipfile.ZIP_DEFLATED) as pacote:
    for arquivo in arquivos + [BASE / 'SHA256SUMS.txt']:
        pacote.write(arquivo, arquivo.relative_to(BASE).as_posix())
with zipfile.ZipFile(BASE / 'Figuras-artigo.zip') as pacote:
    assert pacote.testzip() is None, 'Pacote corrompido'
print(f'Pacote validado: {len(arquivos)+1} arquivos, {(BASE / "Figuras-artigo.zip").stat().st_size:,} bytes.')
