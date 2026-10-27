const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');const path=require('node:path');const http=require('node:http');
const {chromium}=require('playwright');
test('child profile contains only account and policy; responsive anchors and sign-out work',async()=>{
 const html=fs.readFileSync(path.join(__dirname,'../kid/index.html'),'utf8');
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html)});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'msedge'});
 try {
  const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/kid/`);
  assert.equal(await page.locator('#games,#scenario,.preview-controls,#game-dialog,[data-game],#game-search').count(),0);
  assert.equal(await page.locator('#remaining').textContent(),'155');
  for(const width of [320,390,768,1440]){
   await page.setViewportSize({width,height:1000});
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   assert.deepEqual(await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);
   if([390,1440].includes(width))await page.screenshot({path:path.join(__dirname,`../test-results/kid-profile-${width}.png`),fullPage:true});
  }
  await page.locator('.hero-link').click();assert.equal(await page.locator('#profile').isVisible(),true);
  await page.locator('.help summary').click();assert.equal(await page.locator('.help p').isVisible(),true);
  await page.locator('#logout').click();assert.equal(await page.locator('#account').isVisible(),false);
  assert.equal(await page.locator('#out-title').evaluate(e=>e===document.activeElement),true);
  await page.locator('#return').click();assert.equal(await page.locator('#account').isVisible(),true);
  assert.equal(await page.locator('#account input,#account select').count(),0);assert.deepEqual(errors,[]);
 }finally{await browser.close();server.close();}
});

