(() => {
  'use strict';
  const {videos, regions, books} = window.DEMO_DATA;
  const main = document.querySelector('#main');
  const cart = new Map();
  let mapPromise;
  let toastTimer;
  let routeVersion = 0;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = n => `${n.toLocaleString('he-IL')} ₪`;
  const regionName = id => regions.find(r => r.id === id)?.name || '';
  const iconArrow = '<span aria-hidden="true">←</span>';
  const pill = text => `<span class="pill">${esc(text)}</span>`;
  const tags = v => v.regions.map(r => `<a class="tag" href="#/region/${r}">${regionName(r)}</a>`).join('');
  const thumb = (v, cls='', eager=false) => `<img class="${cls}" src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="${eager?'eager':'lazy'}" decoding="async">`;
  const play = '<span class="play" aria-hidden="true">▶</span>';
  const card = (v, small=false) => `<article class="video-card ${small?'compact':''}"><a class="thumbnail" href="#/watch/${v.id}" tabindex="-1" aria-hidden="true">${thumb(v)}${play}<span class="thumb-label">${esc(v.type)}</span></a><div class="video-copy"><div class="card-kicker">${esc(v.topic)}</div><h3><a href="#/watch/${v.id}">${esc(v.title)}</a></h3><div class="tags">${tags(v)}</div></div></article>`;
  const sectionHead = (label,title,link='',href='') => `<div class="section-heading"><div><div class="eyebrow">${label}</div><h2>${title}</h2></div>${link?`<a class="text-link" href="${href}">${link} ${iconArrow}</a>`:''}</div>`;
  const pageHead = (eyebrow,title,description) => `<section class="page-heading wrap"><div class="eyebrow">${eyebrow}</div><h1>${title}</h1><p>${description}</p></section>`;
  const note = '';
  const regionLinks = (active='') => `<div class="region-links">${regions.map((r,i)=>`<a href="#/region/${r.id}" class="region-link ${active===r.id?'selected':''}"><span class="index">0${i+1}</span><span>${r.name}</span><span class="region-count">${videos.filter(v=>v.regions.includes(r.id)).length} תכנים</span>${iconArrow}</a>`).join('')}</div>`;
  function atlas(compact=false, active='') {
    return `<div class="atlas ${compact?'atlas-compact':''}" data-active="${active}"><div class="atlas-top"><span>אטלס התוכן</span><span class="atlas-coordinates" dir="ltr">EXPLORE / 06 REGIONS</span></div><div class="map-canvas" role="group" aria-label="מפת ניווט לאזורי התוכן"><div class="map-drawing" aria-hidden="true"></div><div class="map-grid" aria-hidden="true"></div>${[
      {id:'europe',x:28,y:27,label:'אירופה'},
      {id:'israel',x:36,y:49,label:'ישראל והאזור'},
      {id:'iran',x:46,y:43,label:'איראן'},
      {id:'yemen',x:43,y:66,label:'תימן'},
      {id:'east-asia',x:77,y:47,label:'מזרח אסיה'}
    ].map(r=>`<a class="map-pin ${active===r.id?'active':''}" style="--x:${r.x}%;--y:${r.y}%" href="#/region/${r.id}" aria-label="לתכנים על ${r.label}"><i></i><span>${r.label}</span></a>`).join('')}<span class="sea-label sea-one" aria-hidden="true">האוקיינוס ההודי</span></div><div class="atlas-bottom"><span><i class="live-dot"></i> בחרו מקום. גלו את ההקשר.</span></div></div>`;
  }
  async function fillMaps(version) {
    const targets = [...document.querySelectorAll('.map-drawing')];
    if (!targets.length) return;
    try {
      mapPromise ||= fetch('assets/world.geo.json').then(r=> {if(!r.ok) throw Error('map'); return r.json();});
      const geo = await mapPromise;
      if(version !== routeVersion) return;
      const project = ([lon,lat]) => `${((lon+25)*900/170).toFixed(1)},${((72-lat)*510/82).toFixed(1)}`;
      const path = geometry => (geometry.type==='Polygon'?[geometry.coordinates]:geometry.coordinates).map(poly=>poly.map(ring=>'M'+ring.map(project).join('L')+'Z').join('')).join('');
      const highlights = regions.flatMap(r=>r.countries);
      targets.forEach(target=> {
        const active = regions.find(r=>r.id===target.closest('.atlas').dataset.active);
        target.innerHTML = `<svg viewBox="0 0 900 510" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">${geo.features.filter(f=>['Polygon','MultiPolygon'].includes(f.geometry.type)).map(f=>`<path d="${path(f.geometry)}" class="${active?.countries.includes(f.properties.name)?'country-active':highlights.includes(f.properties.name)?'country-highlight':''}"/>`).join('')}</svg>`;
      });
    } catch { targets.forEach(t=> {t.innerHTML='<span class="map-fallback">המפה אינה זמינה כרגע. אפשר לבחור אזור מהרשימה.</span>';}); }
  }
  function home() {
    return `<section class="cinematic-hero"><img class="hero-earth" src="assets/earth-hero.png" alt="המחשה אמנותית של כדור הארץ והמזרח התיכון באורות זהובים" fetchpriority="high"><div class="hero-shade"></div><div class="wrap hero-content"><div class="eyebrow">לאומנות / עם רמי רחמיאל</div><h1>להבין את הכוחות<br>שמעצבים את העולם.</h1><p>סקירות, ניתוחים וידע גאופוליטי.<br>מבט אחד רחב, על עולם שממשיך להשתנות.</p><div class="hero-actions"><a href="#/current">לסקירות ולאקטואליה <span>←</span></a><a href="#/explore">לגלות לפי אזור <span>←</span></a></div></div></section>
    <section class="home-intro wrap" id="home-discover"><form class="hero-search" id="home-search-form"><label class="sr-only" for="home-search">חיפוש בתכני לאומנות</label><input id="home-search" name="q" type="search" placeholder="חפשו מדינה, נושא או סדרה" autocomplete="off"><button type="submit" aria-label="חיפוש"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg></button></form></section>
    <section class="current-section wrap section">${sectionHead('אקטואליה','התמונה שמאחורי הכותרת.','לכל הסקירות','#/current')}<div class="home-current-grid">${[videos[0],videos[1],videos[2]].map(v=>card(v)).join('')}</div></section>
    <section class="geography-section"><div class="wrap">${sectionHead('לפי אזור','בחרו את נקודת המבט שלכם.','לאטלס התוכן','#/explore')}<nav class="geo-tabs" aria-label="אזורים גאוגרפיים">${regions.map(r=>`<a href="#/region/${r.id}">${r.name}</a>`).join('')}</nav><div class="home-geography"><div class="geography-copy"><div class="eyebrow">אטלס התוכן</div><h3>מהזירה הקרובה<br>אל העולם כולו.</h3><p>האירועים, השחקנים ויחסי הכוחות. בחרו אזור במפה, והמשיכו מהעדכון אל הרקע שמאחוריו.</p><a class="text-link" href="#/explore">לכל האזורים ${iconArrow}</a></div>${atlas()}</div></div></section>
    <section class="context-section"><div class="context-image"><img src="assets/earth-hero.png" alt="מבט אמנותי על כדור הארץ" loading="lazy"></div><div class="wrap context-grid"><div><div class="eyebrow light">מהאירוע אל ההבנה</div><h2>כל כותרת היא חלק<br>מסיפור גדול יותר.</h2><p>מתחילים בעדכון מתימן. ממשיכים לאסטרטגיה של החות׳ים. מחברים את הפרטים לתמונה שלמה.</p><a class="text-link" href="#/region/yemen">לגלות את הזירה התימנית ${iconArrow}</a></div><div class="context-path">${[videos[2],videos[4]].map((v,i)=>`<a href="#/watch/${v.id}" class="path-card"><span class="path-number">0${i+1}</span><div><span>${i?'להבין את האסטרטגיה':'להתחיל מהאירוע'}</span><h3>${esc(v.title)}</h3></div>${thumb(v)}</a>`).join('')}</div></div></section>
    <section class="wrap section">${sectionHead('ממשיכים להעמיק','מעבר לכותרות.','לסדרות ולעומק','#/series')}<div class="video-grid">${[videos[5],videos[10],videos[11]].map(v=>card(v)).join('')}</div></section>
    <section class="book-teaser"><div class="wrap book-teaser-inner"><div><div class="eyebrow">הספרים של רמי רחמיאל</div><h2>מבט רחב.<br>גם בין הדפים.</h2><p>מגאופוליטיקה ועד המערכה הרב־זירתית.<br>ממשיכים להעמיק, בקצב שלכם.</p><a href="#/books" class="text-link">לגלות את הספרים ${iconArrow}</a></div><div class="teaser-covers">${books.slice(0,3).map(b=>`<a href="#/books" aria-label="${esc(b.title)}"><img src="${b.image}" alt="עטיפת הספר ${esc(b.title)}" loading="lazy"></a>`).join('')}</div></div></section>
    <section class="about-strip wrap"><img src="assets/author.png" alt="רמי רחמיאל" loading="lazy"><div><div class="eyebrow">מאחורי לאומנות</div><h2>רמי רחמיאל</h2><p>הסרטונים, הניתוחים והספרים של יוצר ערוץ לאומנות — במרחב אחד שמזמין להמשיך ללמוד.</p></div><a class="text-link" href="https://www.youtube.com/@leumanut" target="_blank" rel="noopener noreferrer">להכיר את הערוץ ↗</a></section>`;
  }
  function explore() {
    return `${pageHead('אטלס התוכן','איפה בעולם מעניין אתכם?','בחרו אזור במפה או ברשימה. מכאן תוכלו להגיע לעדכונים, להסברים ולתכני הרקע שלו.')}<section class="wrap explore-layout">${atlas()}<aside class="region-panel"><div class="eyebrow">בוחרים מקום</div><h2>האזורים</h2>${regionLinks()}</aside></section><section class="wrap section">${sectionHead('עוד דרך לגלות','מהארכיון, מסביב לעולם')}<div class="video-grid">${[videos[10],videos[11],videos[4]].map(v=>card(v)).join('')}</div></section>`;
  }
  function regionPage(id) {
    const r=regions.find(r=>r.id===id); if(!r) return notFound();
    const all=videos.filter(v=>v.regions.includes(id));
    const current=all.filter(v=>v.type==='אקטואליה');
    const background=all.filter(v=>v.type!=='אקטואליה'&&v.type!=='הספרים');
    return `<div class="wrap breadcrumb"><a href="#/explore">לפי אזור</a><span>/</span><span>${r.name}</span></div><section class="region-hero wrap"><div><div class="eyebrow">${r.eyebrow} / אטלס התוכן</div><h1>${r.name}<span class="heading-dot">.</span></h1><p>${r.description}</p><div class="region-summary"><span>${all.length} תכנים במבחר</span><span>וידאו · רקע · הקשר</span></div></div>${atlas(true,id)}</section>${current.length?`<section class="wrap section">${sectionHead('הזירה במוקד','אקטואליה באזור')}${note}<div class="video-grid">${current.map(v=>card(v)).join('')}</div></section>`:''}${background.length?`<section class="background-section"><div class="wrap">${sectionHead('הצעד הבא','להבין את הרקע')}<div class="video-grid">${background.slice(0,3).map(v=>card(v)).join('')}</div></div></section>`:''}<section class="wrap section">${sectionHead('הארכיון המקומי',`כל התכנים על ${r.name}`)}${filters(all,id)}<div class="video-grid" id="filtered-results">${all.map(v=>card(v)).join('')}</div><div id="results-status" role="status" class="results-status"></div></section><section class="wrap region-footer"><h2>ממשיכים למקום אחר?</h2>${regionLinks(id)}</section>`;
  }
  function filters(list,region='') {
    return `<form class="filter-bar" id="filter-form" data-region="${region}"><label class="filter-search"><span>חיפוש בתכנים</span><input name="q" type="search" placeholder="כותרת, אזור או נושא…" autocomplete="off"></label><label><span>נושא</span><select name="topic"><option value="">כל הנושאים</option>${[...new Set(list.map(v=>v.topic))].map(t=>`<option>${esc(t)}</option>`).join('')}</select></label><label><span>סוג תוכן</span><select name="type"><option value="">כל סוגי התוכן</option>${[...new Set(list.map(v=>v.type))].map(t=>`<option>${esc(t)}</option>`).join('')}</select></label><button class="filter-reset" type="reset">איפוס</button></form>`;
  }
  function current() {
    return `${pageHead('על סדר היום','אקטואליה, עם הקשר.','האירועים והזירות שבמוקד — עם דרך קצרה אל תכני הרקע שמאחוריהם.')}<section class="wrap"><div class="current-feature">${card(videos[0])}<div class="current-feature-copy"><div class="eyebrow">במוקד / ישראל והאזור</div><h2>מהמעגל הקרוב<br>לתמונה הרחבה.</h2><p>מתחילים בסרטון, ממשיכים לזירות הקשורות אליו, ומעמיקים בסדרת סקירות המלחמה.</p><a class="button primary" href="#/watch/${videos[0].id}">לצפייה בסרטון ${iconArrow}</a></div></div><div class="topic-tabs" role="group" aria-label="סינון לפי זירה"><button class="active" data-current-region="">כל הזירות</button>${regions.filter(r=>['israel','iran','lebanon','yemen'].includes(r.id)).map(r=>`<button data-current-region="${r.id}">${r.name}</button>`).join('')}</div><div id="current-results" class="video-grid">${videos.filter(v=>v.type==='אקטואליה').map(v=>card(v)).join('')}</div><div id="current-status" class="results-status" role="status"></div></section><section class="wrap war-banner"><div><div class="eyebrow light">סדרה במוקד</div><h2>המלחמה בישראל</h2><p>סקירות מימי המלחמה הראשונים ועד הסיכומים החודשיים. מסלול אחד בין זירות ושלבים.</p></div><a href="#/series" class="button gold">לסדרת הסקירות ${iconArrow}</a></section>`;
  }
  function series() {
    const seriesVideos=videos.filter(v=>v.series);
    return `${pageHead('לצפות. לחבר. להבין.','סדרות ותכני עומק','מסלולי צפייה נבחרים מתוך הערוץ, למי שרוצה להמשיך מעבר לעדכון אחד.')}<section class="wrap series-layout"><aside class="series-intro"><div class="eyebrow light">סדרה במוקד</div><h2>המלחמה<br>בישראל</h2><p>חמש נקודות לאורך סדרת הסקירות — מתחילת המלחמה ועד הסיכומים החודשיים.</p><a href="https://www.youtube.com/playlist?list=PLAeqxQosjxeVxit_QX1Xx9FpfgROQTI-D" target="_blank" rel="noopener noreferrer">לרשימת ההשמעה המקורית ↗</a></aside><div class="episode-list">${seriesVideos.map((v,i)=>`<a href="#/watch/${v.id}" class="episode"><span class="episode-number">0${i+1}</span>${thumb(v)}<div><span>${v.type}</span><h3>${esc(v.title)}</h3><small>${v.regions.map(regionName).join(' · ')}</small></div><span class="episode-arrow">←</span></a>`).join('')}</div></section><section class="wrap section">${sectionHead('להרחיב את המבט','תכני רקע נבחרים')}<div class="video-grid">${[videos[4],videos[10],videos[11]].map(v=>card(v)).join('')}</div></section>`;
  }
  function watch(id) {
    const v=videos.find(v=>v.id===id); if(!v) return notFound();
    const related=videos.filter(other=>other.id!==id && other.regions.some(r=>v.regions.includes(r))).sort((a,b)=>(b.topic===v.topic)-(a.topic===v.topic)).slice(0,3);
    return `<div class="wrap breadcrumb"><a href="#/">בית</a><span>/</span><a href="#/region/${v.regions[0]}">${regionName(v.regions[0])}</a><span>/</span><span>צפייה</span></div><section class="watch-section wrap"><div class="watch-main"><div class="player"><iframe id="youtube-player" src="https://www.youtube-nocookie.com/embed/${v.id}" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="watch-meta"><span>${v.type}</span><a href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener noreferrer">לסרטון המקורי ביוטיוב ↗</a></div><h1>${esc(v.title)}</h1><div class="tags">${tags(v)}${pill(v.topic)}</div><p class="watch-description">${v.description}</p>${v.chapters?`<div class="chapters"><h2>קופצים לנושא</h2>${v.chapters.map(c=>`<button data-chapter="${c.time}" data-video="${v.id}"><span>${c.label}</span><time dir="ltr">${formatTime(c.time)}</time><span aria-hidden="true">▶</span></button>`).join('')}</div>`:''}</div><aside class="watch-aside"><div class="eyebrow">ההקשר הרחב</div><h2>הסיפור לא<br>נגמר כאן.</h2><p>חזרו לזירה כדי למצוא עוד סרטונים שמחברים את התמונה.</p>${v.regions.map(r=>`<a class="aside-region" href="#/region/${r}"><span>כל התכנים על ${regionName(r)}</span>${iconArrow}</a>`).join('')}<div class="aside-author"><img src="assets/author.png" alt=""><div><strong>רמי רחמיאל</strong><span>יוצר ערוץ לאומנות</span></div></div></aside></section><section class="wrap section">${sectionHead('ממשיכים מכאן','עוד שכבה של הבנה')}<div class="video-grid">${related.map(v=>card(v)).join('')}</div></section>`;
  }
  const formatTime=s=>`${Math.floor(s/3600)?Math.floor(s/3600)+':':''}${String(Math.floor(s/60)%60).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  const bookCard=b=>`<article class="book-card"><div class="book-stage"><span class="book-category">${b.tag}</span><img src="${b.image}" alt="עטיפת הספר ${esc(b.title)}" loading="lazy"></div><div class="book-info"><h2>${b.title}</h2><p>${b.subtitle}</p><div class="book-purchase"><strong>${money(b.price)}</strong><button class="button primary" data-add-book="${b.id}">הוספה לסל <span>+</span></button></div><a class="book-source" href="${encodeURI(b.url)}" target="_blank" rel="noopener noreferrer">פרטי הספר באתר Bookpod ↗</a></div></article>`;
  function bookshop() {
    return `<section class="bookshop-hero"><div class="wrap"><div class="eyebrow">הספרים של רמי רחמיאל</div><h1>להבין לעומק.<br><span>גם בין הדפים.</span></h1><p>מגאופוליטיקה ועד המערכה הרב־זירתית.<br>ארבעה ספרים, עוד דרך להסתכל על העולם.</p></div><div class="bookshop-lines" aria-hidden="true"></div></section><section class="wrap shop-section"><div class="book-grid">${books.map(bookCard).join('')}</div></section><section class="wrap book-video"><div><div class="eyebrow">מהמחבר, בקולו</div><h2>על הספר<br>והמערכה הרב־זירתית.</h2><a class="text-link" href="#/watch/gp3Nntqb9g4">לצפייה בסרטון על הספר ${iconArrow}</a></div>${card(videos.find(v=>v.id==='gp3Nntqb9g4'))}</section>`;
  }
  function cartPage() {
    const entries=[...cart.entries()].map(([id,quantity])=>({...books.find(b=>b.id===id),quantity}));
    const total=entries.reduce((sum,b)=>sum+b.price*b.quantity,0);
    return `${pageHead('הספרים','סל הספרים שלכם','הספרים שבחרתם, במקום אחד.')}<section class="wrap cart-layout">${entries.length?`<div class="cart-items">${entries.map(b=>`<article class="cart-item"><img src="${b.image}" alt="עטיפת ${esc(b.title)}"><div class="cart-item-copy"><h2>${b.title}</h2><p>${b.subtitle}</p><strong>${money(b.price)}</strong><div class="quantity"><button data-quantity="${b.id}" data-delta="-1" aria-label="הפחתת כמות ${esc(b.title)}">−</button><span aria-label="כמות">${b.quantity}</span><button data-quantity="${b.id}" data-delta="1" aria-label="הגדלת כמות ${esc(b.title)}">+</button><button class="remove" data-remove="${b.id}">הסרה</button></div></div><strong class="item-total">${money(b.price*b.quantity)}</strong></article>`).join('')}<a class="text-link" href="#/books">→ חזרה לספרים</a></div><aside class="order-summary"><div class="eyebrow">סיכום הספרים</div><h2>עוד רגע על המדף.</h2><div class="summary-row"><span>ספרים (${entries.reduce((s,b)=>s+b.quantity,0)})</span><strong>${money(total)}</strong></div><div class="summary-row total"><span>סך הכול</span><strong>${money(total)}</strong></div><button class="button primary" id="complete-order">סיום ${iconArrow}</button></aside>`:`<div class="empty-state"><span class="empty-symbol" aria-hidden="true">＋</span><h2>יש עוד מקום לספר טוב.</h2><p>הסל ריק. בחרו ספר כדי להוסיף אותו לסל.</p><a href="#/books" class="button primary">לבחירת ספרים ${iconArrow}</a></div>`}</section>`;
  }
  function searchPage(query='') {
    return `${pageHead('מוצאים את ההקשר','מה מעניין אתכם?','חיפוש בכותרות, בנושאים ובאזורים.')}<section class="wrap search-page"><form id="search-form" class="large-search"><label for="search-input" class="sr-only">חיפוש סרטונים</label><input id="search-input" type="search" name="q" value="${esc(query)}" placeholder="למשל: איראן, החות׳ים או סין" autofocus><button class="button primary">חיפוש ${iconArrow}</button></form><div class="search-suggestions"><span>אפשר להתחיל עם</span>${['איראן','תימן','סין','המלחמה בישראל'].map(q=>`<a href="#/search?q=${encodeURIComponent(q)}">${q}</a>`).join('')}</div><div id="search-status" class="search-status" role="status"></div><div class="video-grid" id="search-results"></div></section>`;
  }
  const notFound=()=>`<section class="wrap empty-state"><div class="eyebrow">404</div><h1>העמוד הזה לא נמצא.</h1><p>אפשר להמשיך לגלות דרך המפה או לחזור לדף הבית.</p><a class="button primary" href="#/">בחזרה לבית ${iconArrow}</a></section>`;
  function normalized(s) {return s.toLocaleLowerCase('he').replace(/[׳״'"?־–—|]/g,' ').replace(/\s+/g,' ').trim();}
  function matches(v,q) {const text=normalized([v.title,v.description,v.topic,v.type,...v.regions.map(regionName)].join(' ')); return normalized(q).split(' ').every(word=>text.includes(word));}
  function renderSearch(q) {
    const found=videos.filter(v=>matches(v,q));
    document.querySelector('#search-status').textContent=q?`${found.length} תכנים עבור ״${q}״`:`כל ${videos.length} התכנים בספרייה`;
    document.querySelector('#search-results').innerHTML=found.length?found.map(v=>card(v)).join(''):'<div class="empty-state"><h2>עוד לא מצאנו התאמה.</h2><p>נסו שם של אזור או מילת חיפוש קצרה יותר.</p></div>';
  }
  function renderFilters(form) {
    const values=new FormData(form); const q=values.get('q'),topic=values.get('topic'),type=values.get('type');
    const found=videos.filter(v=>(!form.dataset.region||v.regions.includes(form.dataset.region))&&matches(v,q)&&(!topic||v.topic===topic)&&(!type||v.type===type));
    document.querySelector('#filtered-results').innerHTML=found.length?found.map(v=>card(v)).join(''):'<div class="empty-state"><h3>לא נמצאו תכנים בסינון הזה.</h3><p>אפשר לאפס את הסינון ולנסות שוב.</p></div>';
    document.querySelector('#results-status').textContent=`מוצגים ${found.length} תכנים`;
  }
  function updateCartCount() { const count=[...cart.values()].reduce((a,b)=>a+b,0); document.querySelector('#cart-count').textContent=count;document.querySelector('.cart-toggle').setAttribute('aria-label',`סל הספרים, ${count} ספרים`); }
  function refreshCartFocus(id,delta) {
    const scroll=window.scrollY;
    main.innerHTML=cartPage();
    const preferred=delta===undefined?main.querySelector(`[data-remove="${id}"]`):main.querySelector(`[data-quantity="${id}"][data-delta="${delta}"]`);
    const next=preferred||main.querySelector('[data-quantity], .empty-state a, .cart-items a');
    next?.focus({preventScroll:true});
    window.scrollTo(0,scroll);
  }
  function notify(text) {const el=document.querySelector('#toast');el.textContent=text;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4000);}
  function render() {
    routeVersion++;
    const raw=location.hash.slice(1)||'/';const [pathname,queryString]=raw.split('?');const parts=pathname.split('/').filter(Boolean);const page=parts[0]||'home';const query=new URLSearchParams(queryString||'').get('q')||'';
    const renderers={home,explore,current,series,region:()=>regionPage(parts[1]),watch:()=>watch(parts[1]),books:bookshop,cart:cartPage,search:()=>searchPage(query)};
    document.body.dataset.page=page;
    main.innerHTML=(Object.hasOwn(renderers,page)?renderers[page]:notFound)();
    const titles={home:'לראות את התמונה הרחבה',explore:'לפי אזור',current:'אקטואליה',series:'סדרות ועומק',region:regionName(parts[1]),watch:videos.find(v=>v.id===parts[1])?.title,books:'הספרים',cart:'סל הספרים',search:'חיפוש'};
    document.title=`${Object.hasOwn(titles,page)&&titles[page]?titles[page]:'העמוד לא נמצא'} | לאומנות`;
    document.querySelectorAll('[data-nav]').forEach(a=> {const active=a.dataset.nav===(page==='region'?'explore':page);a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.querySelector('.main-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');
    if(page==='search') renderSearch(query);
    fillMaps(routeVersion);
    window.scrollTo({top:0,behavior:'instant'});
    main.focus({preventScroll:true});
  }
  document.addEventListener('click',event=> {
    if(event.target.closest('.skip-link')){event.preventDefault();main.focus({preventScroll:false});return;}
    const menu=event.target.closest('.menu-toggle');if(menu){const open=document.querySelector('.main-nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));return;}
    const add=event.target.closest('[data-add-book]');if(add){const id=add.dataset.addBook;if(!books.some(b=>b.id===id))return;cart.set(id,Math.min((cart.get(id)||0)+1,20));updateCartCount();notify('הספר נוסף לסל. אפשר להמשיך לסל בראש העמוד.');return;}
    const quantity=event.target.closest('[data-quantity]');if(quantity){const id=quantity.dataset.quantity;const n=Math.min(20,Math.max(0,(cart.get(id)||0)+Number(quantity.dataset.delta)));n?cart.set(id,n):cart.delete(id);updateCartCount();refreshCartFocus(id,quantity.dataset.delta);return;}
    const remove=event.target.closest('[data-remove]');if(remove){cart.delete(remove.dataset.remove);updateCartCount();refreshCartFocus(remove.dataset.remove);notify('הספר הוסר מהסל');return;}
    if(event.target.closest('#complete-order')){const count=[...cart.values()].reduce((a,b)=>a+b,0);if(!count)return;cart.clear();updateCartCount();main.innerHTML=`<section class="wrap order-success" tabindex="-1"><div class="success-mark" aria-hidden="true">✓</div><div class="eyebrow">סיכום הבחירה</div><h1>הבחירה הושלמה.</h1><p>${count} ספרים נבחרו.<br><strong>לא בוצע חיוב או נשלחה הזמנה.</strong></p><a class="button primary" href="#/books">חזרה לספרים ${iconArrow}</a><a class="text-link" href="#/">בחזרה לגלות תוכן</a></section>`;main.querySelector('.order-success').focus();document.title='סיכום הבחירה | לאומנות';window.scrollTo(0,0);return;}
    const tab=event.target.closest('[data-current-region]');if(tab){document.querySelectorAll('[data-current-region]').forEach(b=>{const active=b===tab;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});const found=videos.filter(v=>v.type==='אקטואליה'&&(!tab.dataset.currentRegion||v.regions.includes(tab.dataset.currentRegion)));document.querySelector('#current-results').innerHTML=found.map(v=>card(v)).join('');document.querySelector('#current-status').textContent=`מוצגים ${found.length} תכנים`;return;}
    const chapter=event.target.closest('[data-chapter]');if(chapter){document.querySelector('#youtube-player').src=`https://www.youtube-nocookie.com/embed/${chapter.dataset.video}?start=${Number(chapter.dataset.chapter)}&autoplay=1`;document.querySelector('.player').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});notify(`נבחר פרק: ${chapter.querySelector('span').textContent}`);}
  });
  document.addEventListener('submit',event=>{if(['search-form','home-search-form'].includes(event.target.id)){event.preventDefault();const q=new FormData(event.target).get('q').trim();const target=`#/search?q=${encodeURIComponent(q)}`;if(location.hash===target)renderSearch(q);else location.hash=target;}if(event.target.id==='filter-form')event.preventDefault();});
  document.addEventListener('input',event=>{const form=event.target.closest('#filter-form');if(form)renderFilters(form);});
  document.addEventListener('change',event=>{const form=event.target.closest('#filter-form');if(form)renderFilters(form);});
  document.addEventListener('reset',event=>{if(event.target.id==='filter-form')setTimeout(()=>renderFilters(event.target),0);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){document.querySelector('.main-nav').classList.remove('open');document.querySelector('.menu-toggle').setAttribute('aria-expanded','false');}});
  window.addEventListener('hashchange',render);
  render();
})();



