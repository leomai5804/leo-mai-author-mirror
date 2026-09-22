document.documentElement.classList.add('js');
const button=document.querySelector('.lang');
const pageTitles={
  '/':['Leo Mai 作家官网','Leo Mai Author Website'],
  '/index.html':['Leo Mai 作家官网','Leo Mai Author Website'],
  '/about.html':['关于麦嘉 — Leo Mai','About Leo Mai'],
  '/404.html':['页面未找到 — Leo Mai','Page Not Found — Leo Mai'],
  '/red-snow.html':['《红雪》— Leo Mai','Red Snow by Leo Mai'],
  '/flowers-in-the-ashes.html':['《灰烬中的花》— Leo Mai','Flowers in the Ashes by Leo Mai'],
  '/city-of-silence.html':['《静默之城》— Leo Mai','City of Silence by Leo Mai'],
  '/contact.html':['联系麦嘉 — Leo Mai','Contact Leo Mai'],
  '/reviews.html':['评论与专业视角 — Leo Mai','Reviews & Perspectives — Leo Mai'],
  '/discussion-guides.html':['读者讨论指南 — Leo Mai','Discussion Guides — Leo Mai'],
  '/availability.html':['版本、购买与合作 — Leo Mai','Editions & Enquiries — Leo Mai'],
  '/media.html':['媒体与出版资料 — Leo Mai','Media & Publishing Kit — Leo Mai'],
  '/news-media.html':['动态与媒体 — Leo Mai','News & Media — Leo Mai'],
  '/samples/flowers-excerpt.html':['《灰烬中的花》英文试读 — Leo Mai','Flowers in the Ashes — Excerpt'],
  '/samples/red-snow-excerpt.html':['《红雪》英文试读 — Leo Mai','Red Snow — Excerpt']
};
const mirrorBase='/leo-mai-author-mirror';
const pagePath=window.location.pathname.startsWith(mirrorBase)?window.location.pathname.slice(mirrorBase.length)||'/':window.location.pathname;
const requestedLanguage=new URLSearchParams(window.location.search).get('lang');
let language=requestedLanguage==='zh'||requestedLanguage==='en'?requestedLanguage:(document.documentElement.lang.startsWith('zh')?'zh':'en');
function syncInternalLanguageLinks(){
  document.querySelectorAll('a[href]').forEach(link=>{
    const raw=link.getAttribute('href');
    if(!raw||raw.startsWith('#'))return;
    const target=new URL(raw,window.location.origin);
    if(target.origin!==window.location.origin||target.pathname.endsWith('.pdf'))return;
    target.searchParams.set('lang',language);
    link.href=`${target.pathname}${target.search}${target.hash}`;
  });
}
function applyLanguage(nextLanguage,updateUrl=false){
  language=nextLanguage;
  document.documentElement.lang=language==='zh'?'zh-CN':'en';
  document.querySelectorAll('[data-zh]').forEach(el=>{el.textContent=el.dataset[language]});
  if(button){button.textContent=language==='zh'?'EN':'中文';button.setAttribute('aria-label',language==='zh'?'Switch to English':'切换为中文')}
  const titles=pageTitles[pagePath];if(titles)document.title=titles[language==='zh'?0:1];
  syncInternalLanguageLinks();
  if(updateUrl){const current=new URL(window.location.href);current.searchParams.set('lang',language);history.replaceState(null,'',`${current.pathname}${current.search}${current.hash}`)}
}
applyLanguage(language);
if(button){button.addEventListener('click',()=>applyLanguage(language==='zh'?'en':'zh',true))}
const topbar=document.querySelector('.topbar'),existingNav=topbar?.querySelector('nav');
if(topbar&&existingNav&&!existingNav.id){
  existingNav.id='site-nav';
  const headerActions=document.createElement('div');headerActions.className='header-actions';
  const menuButton=document.createElement('button');menuButton.className='menu';menuButton.type='button';menuButton.setAttribute('aria-label','打开菜单');menuButton.setAttribute('aria-controls','site-nav');menuButton.setAttribute('aria-expanded','false');menuButton.innerHTML='<span></span><span></span>';
  if(button){topbar.insertBefore(headerActions,button);headerActions.append(menuButton,button)}else{topbar.append(headerActions);headerActions.append(menuButton)}
}
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el))}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
const menu=document.querySelector('.menu'),nav=document.querySelector('#site-nav');
function closeMenu(focus=false){if(!menu||!nav)return;nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',language==='zh'?'打开菜单':'Open menu');document.body.classList.remove('menu-open');if(focus)menu.focus()}
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?(language==='zh'?'关闭菜单':'Close menu'):(language==='zh'?'打开菜单':'Open menu'));document.body.classList.toggle('menu-open',open)});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));document.addEventListener('click',event=>{if(nav.classList.contains('open')&&!topbar.contains(event.target))closeMenu()});window.addEventListener('resize',()=>{if(window.innerWidth>640)closeMenu()})}
document.querySelectorAll('.topbar nav a').forEach(link=>{const target=new URL(link.href,window.location.origin);if(target.origin===window.location.origin&&target.pathname===window.location.pathname&&!target.hash)link.setAttribute('aria-current','page')});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav?.classList.contains('open'))closeMenu(true)});
document.querySelectorAll('.copy-email').forEach(copyButton=>{const copyStatus=copyButton.closest('section')?.querySelector('.copy-status');copyButton.addEventListener('click',async()=>{const email=copyButton.dataset.email;try{await navigator.clipboard.writeText(email);if(copyStatus)copyStatus.textContent=language==='zh'?'邮箱已复制，可以粘贴到邮件中。':'Email copied. You can paste it into your message.'}catch{if(copyStatus)copyStatus.textContent=language==='zh'?`请复制：${email}`:`Please copy: ${email}`}})});
fetch('api/public/settings').then(r=>r.ok?r.json():{}).then(s=>{if(s.site_title_zh||s.site_title_en)document.title=language==='zh'?(s.site_title_zh||document.title):(s.site_title_en||document.title);const eyebrow=document.querySelector('.hero .eyebrow');if(eyebrow&&(s.tagline_zh||s.tagline_en)){eyebrow.dataset.zh=s.tagline_zh||eyebrow.dataset.zh;eyebrow.dataset.en=s.tagline_en||eyebrow.dataset.en;eyebrow.textContent=language==='zh'?eyebrow.dataset.zh:eyebrow.dataset.en}if(s.contact_email){const email=String(s.contact_email).trim();document.querySelectorAll('.contact-email strong,.media-contact>p').forEach(e=>e.textContent=email);document.querySelectorAll('.copy-email').forEach(e=>e.dataset.email=email);document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{const query=a.getAttribute('href').split('?')[1];a.href=`mailto:${email}${query?`?${query}`:''}`});document.querySelectorAll('a[href*="mail.google.com/mail/"]').forEach(a=>{const url=new URL(a.href);url.searchParams.set('to',email);a.href=url.toString()})}if(s.show_news==='false')document.querySelector('#news')?.setAttribute('hidden','')}).catch(()=>{});
