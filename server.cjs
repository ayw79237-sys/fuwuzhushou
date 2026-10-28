'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'dist'),port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT 必须是 1–65535 的整数');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return}
  let file;try{const url=new URL(req.url,'http://localhost');const name=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}}catch{res.writeHead(400);res.end('Bad request');return}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data)})
});
server.on('error',error=>{console.error('启动失败：'+error.message);process.exitCode=1});
server.listen(port,'127.0.0.1',()=>console.log('办好了本地预览：http://127.0.0.1:'+port));
