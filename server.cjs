'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),{Readable}=require('node:stream');
const root=path.join(__dirname,'dist'),port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT 必须是 1–65535 的整数');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml'};
const voiceReady=import('./services/voice-router.mjs').then(({createVoiceHandler})=>createVoiceHandler());
const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD','POST'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD, POST'});res.end();return}
  let url;try{url=new URL(req.url,'http://'+req.headers.host);if(!['localhost','127.0.0.1'].includes(url.hostname)||Number(url.port||80)!==port)throw Error('host')}catch{res.writeHead(400);res.end('Bad request');return}
  if(url.pathname.startsWith('/api/voice/')){try{const headers=new Headers();for(const [key,value] of Object.entries(req.headers))if(value!==undefined)headers.set(key,Array.isArray(value)?value.join(', '):value);headers.set('oai-authenticated-user-id','local-development');const init={method:req.method,headers};if(!['GET','HEAD'].includes(req.method)){init.body=Readable.toWeb(req);init.duplex='half'}const response=await(await voiceReady)(new Request(url,init),process.env);if(!response){res.writeHead(404);res.end('Not found');return}res.writeHead(response.status,Object.fromEntries(response.headers));if(response.body)Readable.fromWeb(response.body).pipe(res);else res.end()}catch{res.writeHead(500,{'content-type':'application/json'});res.end('{"message":"本地语音服务异常"}')};return}
  if(req.method==='POST'){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return}
  let file;try{const name=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);file=path.resolve(root,'.'+name);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}}catch{res.writeHead(400);res.end('Bad request');return}
  fs.readFile(file,(error,data)=>{if(error){res.writeHead(404);res.end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data)})
});
server.on('error',error=>{console.error('启动失败：'+error.message);process.exitCode=1});
server.listen(port,'127.0.0.1',()=>console.log('办好了本地预览：http://127.0.0.1:'+port));
