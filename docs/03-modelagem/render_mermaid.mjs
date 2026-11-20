/** Render the editable Mermaid sources and check README/source correspondence.
 * Requires @mermaid-js/mermaid-cli. Install outside the repo if desired.
 * node docs/03-modelagem/render_mermaid.mjs --cli <mmdc entry .js> --puppeteer <config.json>
 * CLI accepts .js/.mjs entry files or an executable on PATH; no browser service is published.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const args=process.argv.slice(2);
const arg=name=>args.includes(name)?args[args.indexOf(name)+1]:undefined;
const cli=arg('--cli')??'mmdc';
const puppet=arg('--puppeteer');
const config=arg('--config')??path.join(root,'docs/03-modelagem/mermaid-config.json');
const only=arg('--only');
async function files(dir){
  const result=[];
  for(const entry of await fs.readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory())result.push(...await files(full));else result.push(full);
  }
  return result;
}
const all=[...await files(path.join(root,'docs/03-modelagem')),...await files(path.join(root,'docs/04-arquitetura'))];
const sources=all.filter(p=>p.endsWith('.mmd'));
const normalize=s=>s.replace(/\r\n/g,'\n').trim();
const contents=await Promise.all(sources.map(async p=>[p,normalize(await fs.readFile(p,'utf8'))]));
let mirrors=0;
for(const file of all.filter(p=>p.endsWith('.md'))){
  const markdown=await fs.readFile(file,'utf8');
  for(const match of markdown.matchAll(/```mermaid\r?\n([\s\S]*?)```/g)){
    if(!contents.some(([,source])=>source===normalize(match[1])))throw Error('README/source mismatch: '+path.relative(root,file));
    mirrors++;
  }
}
console.log(`${sources.length} editable sources; ${mirrors} README mirrors match.`);
for(const source of sources){
  if(only && !path.relative(root,source).replaceAll('\\','/').startsWith(only))continue;
  const parameters=['-i',source,'-o',source.replace(/\.mmd$/,'.svg'),'-t','neutral','-b','white','--no-font-embed','--quiet'];
  if(puppet)parameters.push('-p',puppet);
  if(config)parameters.push('-c',config);
  if(/\.m?js$/.test(cli))execFileSync(process.execPath,[cli,...parameters],{stdio:'inherit',windowsHide:true});
  else execFileSync(cli,parameters,{stdio:'inherit',windowsHide:true});
  // Preserve word-leading spaces across Mermaid tspans in SVG consumers.
  const output=source.replace(/\.mmd$/,'.svg');
  const svg=await fs.readFile(output,'utf8');
  if(!svg.includes('xml:space='))await fs.writeFile(output,svg.replace('<svg ','<svg xml:space="preserve" '));
  console.log(path.relative(root,source));
}
