window.DEMO_DATA = {
  regions: [
    {id:'israel',name:'ישראל',eyebrow:'המזרח התיכון',description:'הזירה הישראלית בתוך התמונה האזורית: מלחמה, אסטרטגיה ויחסי כוחות.',lat:31.5,lon:35,countries:['Israel'],topics:['המלחמה בישראל','אסטרטגיה']},
    {id:'iran',name:'איראן',eyebrow:'המזרח התיכון',description:'מהמהלכים האזוריים ועד היחסים עם ארצות הברית — התוכן על איראן, במקום אחד.',lat:33,lon:53,countries:['Iran'],topics:['יחסים בינלאומיים','אסטרטגיה']},
    {id:'lebanon',name:'לבנון',eyebrow:'המזרח התיכון',description:'הזירה הצפונית והקשר שלה למערכה הרחבה. כניסה דרך סקירות רב־זירתיות.',lat:34,lon:35.8,countries:['Lebanon'],topics:['המלחמה בישראל','אסטרטגיה']},
    {id:'yemen',name:'תימן',eyebrow:'חצי האי ערב',description:'החות׳ים, הזירה התימנית והקשרים למאבקי הכוח באזור.',lat:15.5,lon:47.5,countries:['Yemen'],topics:['החות׳ים','אסטרטגיה']}
  ],
  videos: [
    {id:'yTT5cGsDCxk',title:'ישראל אוחזת היטב במעגל הראשון',regions:['israel','lebanon'],type:'אקטואליה',topic:'אסטרטגיה',description:'מבחר האקטואליה של לאומנות: מבט על הזירה הישראלית ועל המעגל האזורי שסביבה.'},
    {id:'w-WZTJ80lHk',title:'ארה״ב מרכזת כוחות מול איראן',regions:['iran','israel'],type:'אקטואליה',topic:'יחסים בינלאומיים',description:'הזירה האיראנית במוקד: סרטון מהערוץ העוסק בריכוז הכוחות האמריקאיים מול איראן.'},
    {id:'URObW39_ySY',title:'המתקפה בתימן נבלמה',regions:['yemen'],type:'אקטואליה',topic:'החות׳ים',description:'עדכון מהזירה התימנית, עם אפשרות להמשיך מכאן לתכני הרקע על החות׳ים.'},
    {id:'7U_dZ6qCj20',title:'ישראל נגד החות׳ים',regions:['israel','yemen'],type:'להבין את הרקע',topic:'החות׳ים',description:'תוכן רקע מהערוץ על ישראל והחות׳ים. חלק מהמסלול להבנת הזירה התימנית.'},
    {id:'cVeoEJKLh-0',title:'מה האסטרטגיה של החות׳ים?',regions:['yemen'],type:'להבין את הרקע',topic:'אסטרטגיה',description:'ממשיכים מהעדכון אל השאלה הרחבה: האסטרטגיה של החות׳ים.'},
    {id:'ttTL9Atp0sE',title:'מלחמת 7.10 — היום הראשון',regions:['israel'],type:'סדרת המלחמה',topic:'המלחמה בישראל',description:'הסקירה מתחילת המלחמה. אפשר לעבור ממנה ליום השני ולסקירות החודשיות.',series:1},
    {id:'l8IHXYFFEfE',title:'מלחמת 7.10 — היום השני',regions:['israel'],type:'סדרת המלחמה',topic:'המלחמה בישראל',description:'הפרק השני במסלול הצפייה מתוך סקירות המלחמה.',series:2},
    {id:'cJPGuprWyU4',title:'חודש למלחמה',regions:['israel','lebanon'],type:'סדרת המלחמה',topic:'המלחמה בישראל',description:'סקירת החודש הראשון, מתוך סדרת הסקירות על המלחמה.',series:3},
    {id:'AGA4LNSbGQg',title:'המלחמה — החודש ה־29',regions:['israel','lebanon','iran'],type:'סדרת המלחמה',topic:'המלחמה בישראל',description:'סקירה רב־זירתית מתוך סדרת המלחמה של לאומנות.',series:4,chapters:[{time:2008,label:'לבנון'}]},
    {id:'5-62xJ87Z8E',title:'המלחמה — החודש ה־31',regions:['israel','lebanon','iran'],type:'סדרת המלחמה',topic:'המלחמה בישראל',description:'סקירה רב־זירתית עם פרקים המאפשרים להגיע ישירות לזירה שמעניינת אתכם.',series:5,chapters:[{time:1822,label:'הפסקת האש בלבנון'},{time:4590,label:'משא ומתן'},{time:5022,label:'עזה'},{time:6352,label:'איראן'}]}
  ],
  books: [
    {id:'war',title:'מלחמת ה7.10',subtitle:'המערכה הרב־זירתית',price:90,image:'assets/book-war.png',url:'https://bookpod.co.il/en/book/מלחמת-ה7.10-|-המערכה-הרב-זירתית-26894',tag:'המלחמה בישראל'},
    {id:'middle-east',title:'המזרח התיכון ב־2025',subtitle:'רמי רחמיאל',price:90,image:'assets/book-middle-east.png',url:'https://bookpod.co.il/en/book/המזרח-התיכון-ב-2025-26929',tag:'המזרח התיכון'},
    {id:'israel',title:'עליית המעצמה הישראלית',subtitle:'רמי רחמיאל',price:100,image:'assets/book-israel.jpg',url:'https://bookpod.co.il/en/book/עליית-המעצמה-הישראלית-26906',tag:'ישראל'},
    {id:'geopolitics',title:'גאופוליטיקה',subtitle:'רמי רחמיאל',price:90,image:'assets/book-geopolitics.jpg',url:'https://bookpod.co.il/en/book/גאופוליטיקה-26904',tag:'להבין את העולם'}
  ]
};
// Exact public titles verified against YouTube oEmbed. No unverified dates or durations.
Object.entries({
  'w-WZTJ80lHk':'ארה״ב מרכזת כוחות מול איראן — ההיערכות ליום שאחרי הבחירות',
  'URObW39_ySY':'המתקפה בתימן נבלמה — הרחפנים החות׳יים גובים מחיר כבד',
  '7U_dZ6qCj20':"ישראל נגד החות'ים", 'cVeoEJKLh-0':"מה האסטרטגיה של החות'ים?",
  'ttTL9Atp0sE':'המלחמה בישראל | היום ה-1', 'l8IHXYFFEfE':'המלחמה בישראל | היום ה-2',
  'cJPGuprWyU4':'המלחמה בישראל | החודש ה-1','AGA4LNSbGQg':'המלחמה בישראל | החודש ה-29',
  '5-62xJ87Z8E':'המלחמה בישראל | החודש ה-31'
}).forEach(([id,title]) => { window.DEMO_DATA.videos.find(v => v.id === id).title = title; });
window.DEMO_DATA.regions.push(
  {id:'east-asia',name:'מזרח אסיה',eyebrow:'אסיה',description:'מבט אל סין והקשרים שלה עם ישראל. נקודת כניסה לתכני הארכיון על אסיה.',lat:35,lon:105,countries:['China'],topics:['יחסים בינלאומיים']},
  {id:'europe',name:'אירופה',eyebrow:'אירופה',description:'רוסיה, אוקראינה ונאט״ו — תכני רקע מתוך ארכיון הערוץ.',lat:50,lon:25,countries:['Ukraine','Russia'],topics:['יחסים בינלאומיים']}
);
window.DEMO_DATA.videos.push(
  {id:'re-EICe55rA',title:'יחסי ישראל-סין',regions:['east-asia','israel'],type:'מהארכיון',topic:'יחסים בינלאומיים',description:'תוכן מארכיון לאומנות על יחסי ישראל וסין. '},
  {id:'W6-7FFZW9hE',title:'נאט"ו משתמשים באוקראינה להחלשת רוסיה',regions:['europe'],type:'מהארכיון',topic:'יחסים בינלאומיים',description:'ניתוח מתוך ארכיון הערוץ על נאט״ו, אוקראינה ורוסיה. '},
  {id:'gp3Nntqb9g4',title:'מלחמת ה7.10 | המערכה הרב-זירתית(הספר)',regions:['israel'],type:'הספרים',topic:'המלחמה בישראל',description:'סרטון היוצר על הספר מלחמת ה7.10 — המערכה הרב־זירתית.'}
);
