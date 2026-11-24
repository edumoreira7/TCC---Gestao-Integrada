import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const base = path.dirname(fileURLToPath(import.meta.url));
const destino = path.join(base, 'figuras-artigo');
const argumentos = process.argv.slice(2);
const parametro = nome => argumentos[argumentos.indexOf(nome) + 1];
const runtime = parametro('--runtime');
const navegador = parametro('--browser');
const cli = parametro('--mermaid');
if (!runtime || !navegador || !cli) throw new Error('Informe --runtime, --browser e --mermaid com caminhos locais.');
const require = createRequire(path.join(runtime, 'package.json'));
const {chromium} = require('playwright');
const manifesto = JSON.parse(await fs.readFile(path.join(destino, 'manifesto.json'), 'utf8'));
const config = path.join(base, 'mermaid-config.json');
const puppeteer = path.join(destino, 'puppeteer-local.json');
await fs.writeFile(puppeteer, JSON.stringify({executablePath:navegador,headless:true}));
for (const nome of ['00-der-completo', '09-arquitetura-componentes', ...manifesto.detalhes]) {
  execFileSync(process.execPath, [cli, '-i', path.join(destino,'fontes',nome+'.mmd'), '-o', path.join(destino,nome+'.svg'), '-c',config,'-p',puppeteer,'-t','neutral','-b','white','--no-font-embed','--quiet'], {stdio:'inherit',windowsHide:true});
  const arquivo = path.join(destino, nome+'.svg');
  const svg = await fs.readFile(arquivo,'utf8');
  await fs.writeFile(arquivo, svg.replace('<svg ', '<svg xml:space="preserve" '));
}
await fs.unlink(puppeteer);
const browser = await chromium.launch({executablePath:navegador,headless:true});
try {
  for (const nome of manifesto.arquivos) {
    const page = await browser.newPage({deviceScaleFactor:2});
    const svg = await fs.readFile(path.join(destino,nome+'.svg'),'utf8');
    const partes = svg.match(/viewBox="([^\"]+)"/)[1].split(/\s+/).map(Number);
    const largura = Math.ceil(partes[2])+32;
    const altura = Math.ceil(partes[3])+32;
    await page.setViewportSize({width:largura,height:altura});
    await page.setContent(`<html><head><meta charset="utf-8"><style>@page{size:${largura}px ${altura}px;margin:0}*{box-sizing:border-box}html,body{margin:0;background:white;width:${largura}px;height:${altura}px;overflow:hidden}svg{position:absolute;left:16px;top:16px;display:block;margin:0;width:${partes[2]}px!important;height:${partes[3]}px!important;max-width:none!important}</style></head><body>${svg}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({path:path.join(destino,nome+'.png'),fullPage:true});
    await page.pdf({path:path.join(destino,nome+'.pdf'),preferCSSPageSize:true,printBackground:true,scale:1});
    await page.close();
    console.log(nome);
  }
} finally { await browser.close(); }
