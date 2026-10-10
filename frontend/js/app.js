"use strict";
/* ============ helpers ============ */
const $=(s,r=document)=>r.querySelector(s);
const B=(en,te)=>`<span class="en">${en}</span><span class="te">${te}</span>`;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const reduced=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let LANG="te";
const T=(en,te)=>LANG==="te"?te:en;
const spk=(en,te)=>`<button type="button" class="spk" data-en="${esc(en)}" data-te="${esc(te)}" aria-label="Read aloud">🔊</button>`;
let toastT=null;
function toast(m){const t=$("#toast");if(!t)return;t.textContent=m;t.classList.add("show");clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove("show"),4500);}
let spkBtn=null;
function say(text,btn){
  if(!window.speechSynthesis){toast(T("Read-aloud is not supported in this browser.","ఈ బ్రౌజర్‌లో చదివి వినిపించే సౌకర్యం లేదు."));return;}
  try{
    speechSynthesis.cancel();
    if(spkBtn)spkBtn.classList.remove("on");
    if(btn&&btn===spkBtn){spkBtn=null;return;}
    const vs=speechSynthesis.getVoices(),v=vs.find(x=>x.lang&&x.lang.toLowerCase().replace("_","-").startsWith(LANG));
    if(LANG==="te"&&vs.length&&!v){toast(T("Telugu voice is not installed on this device. Add Telugu text-to-speech in your phone settings.","ఈ ఫోన్‌లో తెలుగు వాయిస్ లేదు. ఫోన్ సెట్టింగ్స్‌లో తెలుగు టెక్స్ట్-టు-స్పీచ్ ఇన్‌స్టాల్ చేయండి."));spkBtn=null;return;}
    const u=new SpeechSynthesisUtterance(String(text).replace(/[•*_#]/g," "));u.lang=LANG==="te"?"te-IN":"en-IN";u.rate=.92;if(v)u.voice=v;
    spkBtn=btn||null;if(btn)btn.classList.add("on");
    const done=()=>{if(btn){btn.classList.remove("on");if(spkBtn===btn)spkBtn=null;}};
    u.onend=done;u.onerror=done;speechSynthesis.speak(u);
  }catch(e){}
}
document.addEventListener("click",e=>{const b=e.target.closest(".spk");if(b){e.preventDefault();say(b.dataset[LANG]||b.dataset.en||"",b);}});

/* ============ data ============ */
const SEASONS=[["K",["Kharif (Jun–Sep)","ఖరీఫ్ (జూన్–సెప్)"]],["R",["Rabi (Oct–Jan)","రబీ (అక్టో–జన)"]],["Z",["Summer (Feb–May)","వేసవి (ఫిబ్–మే)"]]];
const SOILS=[["red",["Red","ఎర్ర నేల"]],["black",["Black","నల్ల రేగడి"]],["sandy",["Sandy","ఇసుక నేల"]],["loam",["Loamy / alluvial","ఒండ్రు/గరప నేల"]]];
const WATERS=[[1,["Rain-fed","వర్షాధారం"]],[2,["Some irrigation","కొంత నీటి తడులు"]],[3,["Plenty (canal/borewell)","పుష్కలం (కాలువ/బోరు)"]]];
const WNAME={1:["Low water","తక్కువ నీరు"],2:["Medium water","మధ్యస్థ నీరు"],3:["High water","ఎక్కువ నీరు"]};

const CROPS=[
 {id:"paddy",e:"🌾",n:["Paddy (Rice)","వరి"],S:"KR",soil:["black","loam","red"],w:3,days:130,sp:"20×15 cm",seed:"25 (SRI 2)",u:"kg",tp:1,form:"grass",h:1,fs:1,leaf:0x6fae3f,raw:0x9fc24a,ripe:0xe3b341,
  tip:["Alternate wetting and drying saves water. Add Azolla and use paddy straw as mulch.","అడపాదడపా నీరు పెట్టే (తడి–ఆరబెట్టే) పద్ధతితో నీరు ఆదా అవుతుంది. అజోలా వేసి, వరి గడ్డిని ఆచ్ఛాదనగా వాడండి."],rot:["greengram","bengalgram"]},
 {id:"redgram",e:"🫘",n:["Red gram (Pigeon pea)","కంది"],S:"K",soil:["red","black"],w:1,days:170,sp:"90×20 cm",seed:"4",u:"kg",form:"bush",h:1.15,fs:.8,leaf:0x4f8f3a,raw:0x9bbe4a,ripe:0xb59a45,
  tip:["Grow as an intercrop with groundnut or jowar. Pinch tips at 40 days for more branches.","వేరుశనగ లేదా జొన్నతో అంతర పంటగా వేయండి. 40 రోజులకు చిగుళ్లు తుంచితే ఎక్కువ కొమ్మలు వస్తాయి."],rot:["jowar","groundnut"]},
 {id:"greengram",e:"🌱",n:["Green gram","పెసలు"],S:"KZ",soil:["red","sandy","loam"],w:1,days:65,sp:"30×10 cm",seed:"7",u:"kg",form:"bush",h:.7,fs:.7,leaf:0x5ba040,raw:0x8fb04a,ripe:0x4e4a2a,
  tip:["Short duration and fixes nitrogen. A great crop before paddy or cotton.","తక్కువ కాలపు పంట, నేలలో నత్రజని పెంచుతుంది. వరి లేదా పత్తికి ముందు వేస్తే మంచిది."],rot:["paddy","cotton"]},
 {id:"groundnut",e:"🥜",n:["Groundnut","వేరుశనగ"],S:"KRZ",soil:["red","sandy"],w:2,days:110,sp:"30×10 cm",seed:"60",u:"kg",form:"bush",h:.6,fs:.7,leaf:0x4e9b45,raw:0xf2c94c,ripe:0xf2c94c,
  tip:["Apply about 200 kg gypsum per acre at flowering for good pod filling.","పూత సమయంలో ఎకరానికి సుమారు 200 కిలోల జిప్సం వేస్తే కాయలు బాగా నిండుతాయి."],rot:["jowar","redgram"]},
 {id:"cotton",e:"☁️",n:["Cotton","పత్తి"],S:"K",soil:["black"],w:2,days:160,sp:"90×60 cm",seed:"1.2",u:"kg",form:"bush",h:1.3,fs:1.1,leaf:0x3f8a3c,raw:0x9bbe4a,ripe:0xffffff,
  tip:["Plant marigold and maize border rows and intercrop greengram. Use pheromone traps for pink bollworm.","బంతి, మొక్కజొన్న వరుసలు గట్టున వేసి, పెసర అంతర పంట వేయండి. గులాబీ రంగు కాయతొలుచు పురుగుకు ఫెరోమోన్ ఎరలు పెట్టండి."],rot:["bengalgram","jowar"]},
 {id:"maize",e:"🌽",n:["Maize","మొక్కజొన్న"],S:"KR",soil:["red","loam","black"],w:2,days:105,sp:"60×20 cm",seed:"8",u:"kg",form:"grass",h:1.1,fs:1,leaf:0x5fa83b,raw:0xa8c64a,ripe:0xf2c94c,
  tip:["Intercrop with redgram or greengram. Scout early for fall armyworm.","కంది/పెసరతో అంతర పంట వేయండి. కత్తెర పురుగు కోసం ముందే పొలం పరిశీలించండి."],rot:["greengram","bengalgram"]},
 {id:"chilli",e:"🌶️",n:["Chilli","మిరప"],S:"KR",soil:["red","black"],w:2,days:150,sp:"60×45 cm",seed:"250",u:"g",tp:1,form:"bush",h:.9,fs:.8,leaf:0x3e8e41,raw:0x5fa845,ripe:0xd13b2a,
  tip:["Transplant 35-day seedlings. A marigold border helps. Pick ripe red fruits regularly.","35 రోజుల నారు నాటండి. గట్టుపై బంతి వేయండి. ఎర్రబడిన కాయలను తరచుగా కోయండి."],rot:["greengram","jowar"]},
 {id:"tomato",e:"🍅",n:["Tomato","టమాటా"],S:"KRZ",soil:["red","loam"],w:2,days:110,sp:"75×60 cm",seed:"120",u:"g",tp:1,form:"bush",h:1,fs:1.15,leaf:0x4c9a3f,raw:0x8dba45,ripe:0xe0452f,
  tip:["Stake the plants. Marigold works as a trap crop for fruit borer. Mulch stops blight splashing up.","మొక్కలకు కర్రల ఆసరా ఇవ్వండి. కాయతొలుచు పురుగుకు ఎర పంటగా బంతి వేయండి. ఆచ్ఛాదన వేస్తే తెగులు చినుకులతో వ్యాపించదు."],rot:["maize","greengram"]},
 {id:"brinjal",e:"🍆",n:["Brinjal","వంకాయ"],S:"KRZ",soil:["loam","red","black"],w:2,days:150,sp:"75×60 cm",seed:"150",u:"g",tp:1,form:"bush",h:1,fs:1.2,leaf:0x3f7f3a,raw:0x6e8f3a,ripe:0x5b2a6b,
  tip:["Remove borer-damaged shoots every week and set pheromone traps.","కాయ/కొమ్మ తొలుచు పురుగు సోకిన కొమ్మలను వారం వారం తీసేయండి. ఫెరోమోన్ ఎరలు పెట్టండి."],rot:["greengram","maize"]},
 {id:"bhendi",e:"🥬",n:["Okra (Bhendi)","బెండ"],S:"KZ",soil:["loam","red","sandy"],w:2,days:95,sp:"60×30 cm",seed:"3",u:"kg",form:"bush",h:1,fs:1,leaf:0x57a044,raw:0x7fbf4a,ripe:0x4c9a3a,
  tip:["Yellow vein mosaic spreads by whitefly. Use yellow sticky traps and tolerant varieties.","ఈనెల పసుపు తెగులు తెల్లదోమతో వ్యాపిస్తుంది. పసుపు జిగురు అట్టలు వాడండి, తట్టుకునే రకాలు వేయండి."],rot:["greengram","maize"]},
 {id:"bengalgram",e:"🟤",n:["Bengal gram (Chickpea)","శనగ"],S:"R",soil:["black","red"],w:1,days:100,sp:"30×10 cm",seed:"30",u:"kg",form:"bush",h:.7,fs:.7,leaf:0x6fa844,raw:0x9fbf4a,ripe:0xcfa84e,
  tip:["Needs very little water. Bird perches and pheromone traps help against pod borer.","నీరు చాలా తక్కువ చాలు. శనగపచ్చ పురుగుకు పక్షి స్థావరాలు, ఫెరోమోన్ ఎరలు పెట్టండి."],rot:["jowar","maize"]},
 {id:"jowar",e:"🌾",n:["Sorghum (Jowar)","జొన్న"],S:"KR",soil:["black","red"],w:1,days:105,sp:"45×15 cm",seed:"3.5",u:"kg",form:"grass",h:1.2,fs:1,leaf:0x6cab3c,raw:0x9db84a,ripe:0xb5532b,
  tip:["Hardy and low-water. A good rotation partner for pulses.","కరువును తట్టుకునే పంట, పప్పుధాన్యాలకు మంచి మార్పిడి పంట."],rot:["redgram","greengram"]},
 {id:"sesame",e:"🌼",n:["Sesame (Gingelly)","నువ్వులు"],S:"KZ",soil:["red","sandy","loam"],w:1,days:85,sp:"30×10 cm",seed:"2",u:"kg",form:"bush",h:.8,fs:.6,leaf:0x5a9a42,raw:0x9bbe4a,ripe:0xc9a64a,
  tip:["Needs very little water. Harvest when the lower capsules turn yellow.","చాలా తక్కువ నీరు చాలు. కింది కాయలు పసుపు రంగుకు మారినప్పుడు కోయండి."],rot:["greengram","maize"]},
 {id:"sunflower",e:"🌻",n:["Sunflower","పొద్దుతిరుగుడు"],S:"KRZ",soil:["red","black","loam"],w:2,days:95,sp:"60×30 cm",seed:"2",u:"kg",form:"bush",h:1.3,fs:1.4,leaf:0x4f9a3c,raw:0x7aa33a,ripe:0xe9b52a,
  tip:["Rub flower heads gently in the morning to help pollination. Bird perches protect the seed.","ఉదయం పూల తలలను మెల్లగా రాస్తే పరపరాగ సంపర్కం బాగా జరుగుతుంది. గింజలను కాపాడడానికి పక్షి స్థావరాలు పెట్టండి."],rot:["greengram","jowar"]},
 {id:"castor",e:"🌿",n:["Castor","ఆముదం"],S:"K",soil:["red","sandy","black"],w:1,days:150,sp:"90×60 cm",seed:"4",u:"kg",form:"bush",h:1.4,fs:.9,leaf:0x4a8a45,raw:0x8aa84a,ripe:0x8a4b2a,
  tip:["A hardy rain-fed crop. Also good as a border or intercrop with redgram.","వర్షాధార ప్రాంతాలకు తట్టుకునే పంట. కందితో గట్టు పంటగా లేదా అంతర పంటగా కూడా వేయవచ్చు."],rot:["greengram","jowar"]},
 {id:"ragi",e:"🌾",n:["Finger millet (Ragi)","రాగులు"],S:"KR",soil:["red","sandy","loam"],w:1,days:110,sp:"22×10 cm",seed:"4",u:"kg",form:"grass",h:1,fs:1,leaf:0x6aaa3a,raw:0x9db84a,ripe:0x9a5a2a,
  tip:["Nutritious and drought-hardy. Transplanting 3-week seedlings often gives a better yield.","పోషకాలు ఎక్కువ, కరువును తట్టుకుంటుంది. 3 వారాల నారు నాటితే దిగుబడి మెరుగ్గా ఉంటుంది."],rot:["groundnut","redgram"]},
 {id:"cowpea",e:"🫛",n:["Cowpea (Bobbarlu)","బొబ్బర్లు"],S:"KZ",soil:["red","sandy","loam"],w:1,days:75,sp:"30×10 cm",seed:"8",u:"kg",form:"bush",h:.8,fs:.8,leaf:0x58a042,raw:0x8fb04a,ripe:0xa89a5a,
  tip:["Fast-growing, fixes nitrogen and covers the soil so weeds stay low.","త్వరగా పెరిగి నత్రజనిని నేలలో కలుపుతుంది, నేలను కప్పి కలుపును తగ్గిస్తుంది."],rot:["maize","paddy"]},
 {id:"onion",e:"🧅",n:["Onion","ఉల్లి"],S:"KR",soil:["red","loam","black"],w:2,days:120,sp:"15×10 cm",seed:"4",u:"kg",tp:1,form:"grass",h:.6,fs:.9,leaf:0x6fae4a,raw:0xd9b8a0,ripe:0xb8403a,
  tip:["Stop irrigation about 10 days before harvest and cure bulbs in shade for better storage.","కోతకు సుమారు 10 రోజుల ముందు నీరు ఆపండి, నిల్వ కోసం గడ్డలను నీడలో ఆరబెట్టండి."],rot:["maize","greengram"]},
 {id:"turmeric",e:"🟡",n:["Turmeric","పసుపు"],S:"K",soil:["red","loam","black"],w:2,days:270,sp:"30×15 cm",seed:"800",u:"kg",form:"grass",h:1.1,fs:.6,leaf:0x4a9a3a,raw:0xd9a62a,ripe:0xe0a020,
  tip:["Plant treated rhizomes, mulch heavily with leaves, and give Jeevamrutham every 15 days.","శుద్ధి చేసిన గడ్డలు నాటండి, ఆకులతో మందపాటి ఆచ్ఛాదన వేయండి, 15 రోజులకు ఒకసారి జీవామృతం ఇవ్వండి."],rot:["maize","greengram"]}
];
const CROP=Object.fromEntries(CROPS.map(c=>[c.id,c]));

function stagesFor(c){
  const D=c.days,r=Math.round;
  const r1=CROP[c.rot[0]].n,r2=CROP[c.rot[1]].n;
  const nursery=c.tp?[" Raise seedlings in a nursery and transplant at 30–35 days."," నారు పెంచి 30–35 రోజులకు నాటండి."]:["",""];
  return [
   {d:-15,t:["Prepare the land","పొలం సిద్ధం చేయండి"],x:["Plough deep and let the soil sun-dry. Spread 4 tons of farmyard manure or compost and 100 kg Ghanajeevamrutham per acre.","లోతు దుక్కి చేసి నేలను ఎండనివ్వండి. ఎకరానికి 4 టన్నుల పశువుల ఎరువు/కంపోస్టు, 100 కిలోల ఘనజీవామృతం వేయండి."]},
   {d:-1,t:["Treat the seed","విత్తన శుద్ధి"],x:["Coat seed with Beejamrutham and Trichoderma (4 g per kg seed). Dry in shade for a few hours and sow the same day.","విత్తనాలకు బీజామృతం, ట్రైకోడెర్మా (కిలోకు 4 గ్రా.) పట్టించండి. నీడలో కొన్ని గంటలు ఆరబెట్టి అదే రోజు విత్తండి."]},
   {d:0,t:["Sow","విత్తనం వేయండి"],x:[`Spacing ${c.sp}. Seed about ${c.seed} ${c.u} per acre.${nursery[0]}`,`ఎడం ${c.sp}. విత్తనం ఎకరానికి సుమారు ${c.seed} ${c.u==="kg"?"కిలోలు":"గ్రాములు"}.${nursery[1]}`]},
   {d:r(D*.12),t:["First feed and weeding","మొదటి పోషణ, కలుపు తీత"],x:["Give 200 L Jeevamrutham per acre with irrigation water. Weed by hand and fill any gaps.","నీటితో పాటు ఎకరానికి 200 లీటర్ల జీవామృతం ఇవ్వండి. చేతితో కలుపు తీసి, ఖాళీలు ఉంటే మళ్లీ విత్తండి."]},
   {d:r(D*.25),t:["Mulch and first spray","ఆచ్ఛాదన, మొదటి పిచికారీ"],x:["Mulch with straw or crop residue to hold moisture. Spray Neemastram in the evening.","గడ్డి/పంట అవశేషాలతో ఆచ్ఛాదన వేసి తేమ నిలపండి. సాయంత్రం నీమాస్త్రం పిచికారీ చేయండి."]},
   {d:r(D*.4),t:["Second feed and scouting","రెండో పోషణ, పొలం పరిశీలన"],x:["Give Jeevamrutham again. Put up 10 yellow sticky traps and 4–5 pheromone traps per acre. Check 20 plants every week for pests.","మళ్లీ జీవామృతం ఇవ్వండి. ఎకరానికి 10 పసుపు జిగురు అట్టలు, 4–5 ఫెరోమోన్ ఎరలు పెట్టండి. వారానికి 20 మొక్కలు చూసి పురుగులను గమనించండి."]},
   {d:r(D*.55),t:["Flowering care","పూత దశ జాగ్రత్తలు"],x:["Spray Panchagavya 3% (3 L in 100 L water) in the evening, when bees are not active.","సాయంత్రం, తేనెటీగలు లేని వేళ పంచగవ్య 3% (100 లీ. నీటికి 3 లీ.) పిచికారీ చేయండి."]},
   {d:r(D*.75),t:["Fruit and grain filling","కాయ/గింజ నిండే దశ"],x:["If borers appear, use Agniastram or Brahmastram. Keep soil moist but never waterlogged. Give a last Jeevamrutham.","కాయతొలుచు పురుగులు కనిపిస్తే అగ్నిఅస్త్రం లేదా బ్రహ్మాస్త్రం వాడండి. నేల తేమగా ఉంచండి, నీరు నిలవనీయకండి. చివరి జీవామృతం ఇవ్వండి."]},
   {d:D,t:["Harvest and rest the soil","కోత, నేలకు విశ్రాంతి"],x:[`Harvest when mature and leave residue in the field. Next crop: ${r1[0]} or ${r2[0]}.`,`పక్వానికి వచ్చాక కోయండి, అవశేషాలను పొలంలోనే కలపండి. తర్వాత పంట: ${r1[1]} లేదా ${r2[1]}.`]}
  ];
}

const RECIPES=[
 {id:"jeeva",kw:["jeevam","jivamrut","జీవామృతం"],n:["Jeevamrutham","జీవామృతం"],f:["Liquid booster for soil life. Use every 15–21 days.","నేలలో సూక్ష్మజీవులను పెంచే ద్రవ ఎరువు. 15–21 రోజులకు ఒకసారి వాడండి."],unit:["acres","ఎకరాలు"],base:1,def:1,
  ing:[["Desi cow dung","దేశీ ఆవు పేడ",10,"kg"],["Desi cow urine","దేశీ ఆవు మూత్రం",10,"L"],["Jaggery (bellam)","బెల్లం",2,"kg"],["Pulse flour","పప్పు పిండి",2,"kg"],["Water","నీరు",200,"L"],["Bund soil","గట్టు మట్టి",null,"1 handful|ఒక పిడికెడు"]],
  st:[["Mix everything in a drum.","అన్నింటినీ డ్రమ్‌లో కలపండి."],["Stir clockwise morning and evening. Keep in shade.","ఉదయం, సాయంత్రం కుడివైపు తిప్పండి. నీడలో ఉంచండి."],["Ready in 2–7 days. Use within 7 days.","2–7 రోజుల్లో సిద్ధం. 7 రోజుల్లో వాడండి."]],
  use:["Apply with irrigation water, or filter and spray 10% (10 L in 100 L water).","నీటితో కలిపి ఇవ్వండి, లేదా వడగట్టి 10% (100 లీ. నీటికి 10 లీ.) పిచికారీ చేయండి."]},
 {id:"beeja",kw:["beejam","bijam","బీజామృతం"],n:["Beejamrutham","బీజామృతం"],f:["Seed coating that protects young roots from disease.","లేత వేర్లను తెగుళ్ల నుంచి కాపాడే విత్తన లేపనం."],unit:["kg of seed","విత్తనం (కిలోలు)"],base:100,def:100,
  ing:[["Desi cow dung","దేశీ ఆవు పేడ",5,"kg"],["Desi cow urine","దేశీ ఆవు మూత్రం",5,"L"],["Lime (calcium hydroxide)","సున్నం",50,"g"],["Water","నీరు",20,"L"],["Soil","మట్టి",null,"1 handful|ఒక పిడికెడు"]],
  st:[["Tie the dung in a cloth and soak in water for 12 hours.","పేడను గుడ్డలో కట్టి 12 గంటలు నీటిలో నానబెట్టండి."],["Squeeze it out, then add urine, lime and soil. Mix well.","పిండి, మూత్రం, సున్నం, మట్టి కలపండి."],["Coat the seeds, dry in shade, and sow.","విత్తనాలకు పట్టించి, నీడలో ఆరబెట్టి విత్తండి."]],
  use:["Quantities shown are for the seed weight you enter.","ఇక్కడ చూపిన కొలతలు మీరు ఇచ్చిన విత్తన బరువుకు."]},
 {id:"ghana",kw:["ghana","ఘన"],n:["Ghanajeevamrutham","ఘనజీవామృతం"],f:["Dry compost-like base manure. Store up to 6 months.","ఎండిన పొడి ఎరువు. 6 నెలల వరకు నిల్వ చేయవచ్చు."],unit:["acres","ఎకరాలు"],base:1,def:1,
  ing:[["Desi cow dung","దేశీ ఆవు పేడ",100,"kg"],["Jaggery","బెల్లం",1,"kg"],["Pulse flour","పప్పు పిండి",1,"kg"],["Desi cow urine","దేశీ ఆవు మూత్రం",5,"L"],["Soil","మట్టి",null,"1 handful|ఒక పిడికెడు"]],
  st:[["Mix all, make a heap, and cover with a gunny sack for 48 hours.","అన్నీ కలిపి కుప్ప చేసి, గోనె సంచితో 48 గంటలు కప్పండి."],["Spread in shade to dry for about 7 days, then crush.","నీడలో 7 రోజులు ఆరబెట్టి, పొడి చేయండి."],["Store in a dry place.","పొడి ప్రదేశంలో నిల్వ చేయండి."]],
  use:["Broadcast about 100 kg per acre at sowing.","విత్తేటప్పుడు ఎకరానికి సుమారు 100 కిలోలు చల్లండి."]},
 {id:"neem",kw:["neemastr","నీమాస్త్రం","వేప","neem"],n:["Neemastram","నీమాస్త్రం"],f:["Against sucking pests and small caterpillars.","రసం పీల్చే పురుగులు, చిన్న గొంగళి పురుగులపై."],unit:["acres","ఎకరాలు"],base:1,def:1,
  ing:[["Water","నీరు",200,"L"],["Desi cow urine","దేశీ ఆవు మూత్రం",10,"L"],["Cow dung","ఆవు పేడ",2,"kg"],["Crushed neem leaves","నలిపిన వేప ఆకులు",10,"kg"]],
  st:[["Mix all in a drum and stir twice a day.","అన్నీ డ్రమ్‌లో కలిపి రోజుకు రెండు సార్లు తిప్పండి."],["Ferment for 48 hours in shade.","నీడలో 48 గంటలు పులియనివ్వండి."],["Filter through cloth and spray the same day.","గుడ్డతో వడగట్టి అదే రోజు పిచికారీ చేయండి."]],
  use:["Spray in the evening. Repeat after 10–15 days if needed.","సాయంత్రం పిచికారీ చేయండి. అవసరమైతే 10–15 రోజులకు మళ్లీ చేయండి."]},
 {id:"brahma",kw:["brahma","బ్రహ్మ"],n:["Brahmastram","బ్రహ్మాస్త్రం"],f:["Stronger spray for borers and caterpillars. One batch makes stock for about 3–4 acres.","కాయతొలుచు, గొంగళి పురుగులపై బలమైన పిచికారీ. ఒక బ్యాచ్ సుమారు 3–4 ఎకరాలకు సరిపోతుంది."],unit:["batches","బ్యాచ్‌లు"],base:1,def:1,
  ing:[["Desi cow urine","దేశీ ఆవు మూత్రం",20,"L"],["Neem leaves","వేప ఆకులు",2,"kg"],["Custard apple leaves","సీతాఫలం ఆకులు",2,"kg"],["Papaya leaves","బొప్పాయి ఆకులు",2,"kg"],["Pomegranate leaves","దానిమ్మ ఆకులు",2,"kg"],["Guava leaves","జామ ఆకులు",2,"kg"]],
  st:[["Crush the leaves and boil in the urine until it boils 3–5 times.","ఆకులను నలిపి, మూత్రంలో 3–5 పొంగులు వచ్చే వరకు మరిగించండి."],["Cool and keep covered for 24 hours, then filter.","చల్లార్చి 24 గంటలు మూతపెట్టి, వడగట్టండి."]],
  use:["Mix 2.5 L stock in 100 L water and spray. Wear gloves.","100 లీ. నీటికి 2.5 లీ. కలిపి పిచికారీ చేయండి. చేతి తొడుగులు వాడండి."]},
 {id:"agni",kw:["agni","అగ్ని"],n:["Agniastram","అగ్నిఅస్త్రం"],f:["For stem and fruit borers. Tobacco is toxic: wear gloves and a mask, keep away from children.","కాండం/కాయ తొలుచు పురుగులకు. పొగాకు విషపూరితం: చేతి తొడుగులు, మాస్క్ వాడండి, పిల్లలకు దూరంగా ఉంచండి."],unit:["batches","బ్యాచ్‌లు"],base:1,def:1,
  ing:[["Desi cow urine","దేశీ ఆవు మూత్రం",20,"L"],["Neem leaves","వేప ఆకులు",5,"kg"],["Tobacco powder","పొగాకు పొడి",500,"g"],["Green chilli paste","పచ్చిమిర్చి ముద్ద",500,"g"],["Garlic paste","వెల్లుల్లి ముద్ద",50,"g"]],
  st:[["Boil everything until it boils 4–5 times.","అన్నీ కలిపి 4–5 పొంగులు వచ్చే వరకు మరిగించండి."],["Cool and ferment for 48 hours, stirring twice a day.","చల్లార్చి 48 గంటలు పులియనివ్వండి, రోజుకు రెండు సార్లు తిప్పండి."],["Filter through cloth.","గుడ్డతో వడగట్టండి."]],
  use:["Mix 2–3 L in 100 L water. Do not spray on open flowers.","100 లీ. నీటికి 2–3 లీ. కలపండి. విచ్చుకున్న పూలపై చల్లకండి."]},
 {id:"dasha",kw:["dashaparni","dasaparni","దశపర్ణి"],n:["Dashaparni Kashayam","దశపర్ణి కషాయం"],f:["Ten-leaf extract for general pest and disease protection.","పది రకాల ఆకుల కషాయం, సాధారణ పురుగు/తెగులు నివారణకు."],unit:["batches","బ్యాచ్‌లు"],base:1,def:1,
  ing:[["Water","నీరు",200,"L"],["Desi cow urine","దేశీ ఆవు మూత్రం",10,"L"],["Cow dung","ఆవు పేడ",2,"kg"],["Mixed bitter leaves (10 kinds)","చేదు ఆకులు (10 రకాలు)",10,"kg"]],
  st:[["Use neem, custard apple, castor, calotropis (jilledu), pongamia (kanuga), papaya, guava, pomegranate, vitex (vavili) and similar.","వేప, సీతాఫలం, ఆముదం, జిల్లేడు, కానుగ, బొప్పాయి, జామ, దానిమ్మ, వావిలి వంటి ఆకులు వాడండి."],["Crush and mix all in a drum. Ferment 30 days, stirring daily.","అన్నీ నలిపి డ్రమ్‌లో కలపండి. 30 రోజులు పులియనివ్వండి, రోజూ తిప్పండి."],["Filter before use.","వాడే ముందు వడగట్టండి."]],
  use:["Mix 2–3 L in 100 L water and spray. Quantities vary by region.","100 లీ. నీటికి 2–3 లీ. కలిపి పిచికారీ చేయండి. కొలతలు ప్రాంతాన్ని బట్టి మారతాయి."]},
 {id:"pancha",kw:["panchagavya","పంచగవ్య"],n:["Panchagavya","పంచగవ్య"],f:["Growth tonic for flowering and fruit set.","పూత, కాయ కట్టడానికి పెరుగుదల టానిక్."],unit:["batches","బ్యాచ్‌లు"],base:1,def:1,
  ing:[["Cow dung","ఆవు పేడ",5,"kg"],["Cow ghee","ఆవు నెయ్యి",500,"g"],["Cow urine","ఆవు మూత్రం",3,"L"],["Cow milk","ఆవు పాలు",2,"L"],["Curd","పెరుగు",2,"L"],["Jaggery","బెల్లం",500,"g"],["Tender coconut water","లేత కొబ్బరి నీరు",3,"L"],["Ripe bananas","అరటి పండ్లు",12,"nos|"]],
  st:[["Mix dung and ghee, keep 3 days and stir daily.","పేడ, నెయ్యి కలిపి 3 రోజులు ఉంచి రోజూ కలపండి."],["Add all other items. Ferment 15 days, stirring twice a day.","మిగతావన్నీ కలపండి. 15 రోజులు పులియనివ్వండి, రోజుకు రెండు సార్లు తిప్పండి."]],
  use:["Spray 3% (3 L in 100 L water) at flowering.","పూత సమయంలో 3% (100 లీ. నీటికి 3 లీ.) పిచికారీ చేయండి."]},
 {id:"vermi",kw:["vermi","వర్మీ","compost","కంపోస్టు"],n:["Vermicompost","వర్మీ కంపోస్టు"],f:["Rich compost made by earthworms. Ready in 45–60 days.","వానపాములతో తయారయ్యే మేలైన కంపోస్టు. 45–60 రోజుల్లో సిద్ధం."],unit:["beds (1 m wide)","బెడ్‌లు (1 మీ. వెడల్పు)"],base:1,def:1,
  ing:[["Earthworms (Eisenia fetida)","వానపాములు (ఐసీనియా ఫెటిడా)",1,"kg"],["Half-rotted cow dung","సగం కుళ్లిన పేడ",100,"kg"],["Dry leaves and crop waste","ఎండు ఆకులు, పంట వ్యర్థాలు",50,"kg"]],
  st:[["Make a shaded bed: dry leaves at the bottom, dung above, then worms.","నీడలో బెడ్ చేయండి: అడుగున ఎండు ఆకులు, పైన పేడ, తర్వాత వానపాములు."],["Cover with sacks and sprinkle water to keep it damp, not wet.","గోనె సంచులతో కప్పి, తడిగా (బురదగా కాకుండా) ఉండేలా నీరు చల్లండి."],["Harvest the dark crumbly compost and use 1–2 tons per acre.","ముదురు రంగు పొడి కంపోస్టును తీసి ఎకరానికి 1–2 టన్నులు వాడండి."]],
  use:["Quantities are approximate; follow your local training.","కొలతలు సుమారు మాత్రమే; స్థానిక శిక్షణ ప్రకారం చేయండి."]}
];

const PESTS=[
 {id:"yellow",ic:"🟡",kw:["yellow","pasupu","పసుపు","pale"],l:["Leaves turning yellow","ఆకులు పసుపు రంగుకు మారడం"],
  c:["Often low nitrogen, waterlogging or sucking pests. Old leaves yellow first means nutrient hunger. A pale plant in wet soil means too much water.","నత్రజని లోపం, నీరు నిలవడం, లేదా రసం పీల్చే పురుగులు కారణం కావచ్చు. ముందు ముసలి ఆకులు పసుపు అయితే పోషక లోపం. తడి నేలలో మొక్క పాలిపోతే నీరు ఎక్కువ."],
  r:[["Give Jeevamrutham 200 L per acre with water, or 100 kg Ghanajeevamrutham.","నీటితో ఎకరానికి 200 లీ. జీవామృతం ఇవ్వండి, లేదా 100 కిలోల ఘనజీవామృతం వేయండి."],["Drain extra water and loosen the soil around the roots.","ఎక్కువ నీరు తీసేసి, వేర్ల చుట్టూ మట్టిని గుల్ల చేయండి."],["Check under the leaves. If you see insects, spray Neemastram in the evening.","ఆకుల అడుగున చూడండి. పురుగులు ఉంటే సాయంత్రం నీమాస్త్రం పిచికారీ చేయండి."]]},
 {id:"curl",ic:"🌀",kw:["curl","whitefly","white fly","తెల్లదోమ","ముడత","ముడుచుకు","mosaic"],l:["Leaves curling, small white insects","ఆకులు ముడుచుకోవడం, చిన్న తెల్ల పురుగులు"],
  c:["Whitefly spreads leaf-curl virus. Once a plant has the virus it cannot be cured, so the goal is to stop the spread.","తెల్లదోమ ఆకుముడత వైరస్‌ను వ్యాపింపజేస్తుంది. వైరస్ సోకిన మొక్క బాగుపడదు, కాబట్టి వ్యాప్తిని ఆపడమే లక్ష్యం."],
  r:[["Pull out and bury badly affected plants early.","ఎక్కువగా సోకిన మొక్కలను త్వరగా పీకి పూడ్చండి."],["Hang yellow sticky traps, 10 per acre.","ఎకరానికి 10 పసుపు జిగురు అట్టలు వేలాడదీయండి."],["Spray Neemastram, or neem oil 3 ml plus 1 ml soap per litre of water.","నీమాస్త్రం పిచికారీ చేయండి, లేదా లీటరు నీటికి 3 మి.లీ. వేప నూనె + 1 మి.లీ. సబ్బు ద్రావణం కలపండి."],["Grow 2 border rows of maize or jowar as a barrier.","గట్టున 2 వరుసల మొక్కజొన్న/జొన్న అడ్డుగా వేయండి."]]},
 {id:"holes",ic:"🕳️",kw:["hole","caterpillar","chewed","గొంగళి","రంధ్ర","తిన్న","armyworm","కత్తెర"],l:["Holes in leaves, caterpillars","ఆకులకు రంధ్రాలు, గొంగళి పురుగులు"],
  c:["Leaf-eating caterpillars such as armyworm or leaf webbers.","కత్తెర పురుగు వంటి ఆకులు తినే గొంగళి పురుగులు."],
  r:[["Hand-pick larvae in the morning. Put up bird perches, about 10 per acre.","ఉదయం పురుగులను ఏరివేయండి. ఎకరానికి 10 పక్షి స్థావరాలు పెట్టండి."],["Spray Neemastram, or Brahmastram if the attack is heavy.","నీమాస్త్రం పిచికారీ చేయండి, ఎక్కువగా ఉంటే బ్రహ్మాస్త్రం."],["Bt (Bacillus thuringiensis) is accepted in organic farming. Use it as per the label.","Bt (బాసిల్లస్ తురింజియెన్సిస్) సేంద్రీయంలో అనుమతి ఉన్నది. లేబుల్ ప్రకారం వాడండి."]]},
 {id:"borer",ic:"🐛",kw:["borer","pod","fruit","larva","కాయ","తొలుచు","పురుగు","helicoverpa"],l:["Holes in fruit or pods, grub inside","కాయలు/కాయల్లో రంధ్రాలు, లోపల పురుగు"],
  c:["Fruit or pod borer (Helicoverpa). Moths lay eggs on flowers and young fruit.","కాయ తొలుచు పురుగు (హెలికోవర్పా). పూలు, లేత కాయలపై తల్లి పురుగు గుడ్లు పెడుతుంది."],
  r:[["Set 4–5 pheromone traps per acre to track moths.","తల్లి పురుగులను గమనించడానికి ఎకరానికి 4–5 ఫెరోమోన్ ఎరలు పెట్టండి."],["Spray HaNPV (about 250 larval equivalents per acre) in the evening, or neem seed kernel extract 5%.","సాయంత్రం HaNPV (ఎకరానికి సుమారు 250 LE) లేదా వేప గింజల కషాయం 5% పిచికారీ చేయండి."],["Agniastram for heavy attack. Collect and destroy damaged fruits.","ఎక్కువగా ఉంటే అగ్నిఅస్త్రం వాడండి. పాడైన కాయలను ఏరి నాశనం చేయండి."],["Grow marigold as a trap crop on the border.","గట్టున ఎర పంటగా బంతి వేయండి."]]},
 {id:"powder",ic:"❄️",kw:["powder","white coating","mildew","బూజు","తెల్లని పొడి"],l:["White powder on leaves","ఆకులపై తెల్లని పొడి"],
  c:["Powdery mildew, common in dry days with cool nights and dense foliage.","బూడిద తెగులు (పౌడరీ మిల్డ్యూ), చల్లని రాత్రులు, ఎండ రోజులు, దట్టమైన ఆకుల్లో ఎక్కువ."],
  r:[["Spray sour buttermilk: 1 L in 10 L water.","పుల్లని మజ్జిగ పిచికారీ: 10 లీ. నీటికి 1 లీ."],["Remove badly affected leaves. Open the canopy for air flow.","ఎక్కువగా సోకిన ఆకులు తీసేయండి. గాలి ఆడేలా మొక్కల దట్టం తగ్గించండి."],["Do not irrigate by sprinkling in the evening.","సాయంత్రం చల్లే నీటి తడి ఇవ్వకండి."]]},
 {id:"spots",ic:"🟤",kw:["spot","blight","brown","black","మచ్చ","మాడు","ఎండు తెగులు"],l:["Brown or black spots on leaves","ఆకులపై గోధుమ/నల్ల మచ్చలు"],
  c:["Fungal or bacterial leaf spot or blight. It spreads fast in humid, wet weather.","శిలీంధ్ర/బాక్టీరియా ఆకుమచ్చ లేదా మాడు తెగులు. తేమ, వర్షంలో వేగంగా వ్యాపిస్తుంది."],
  r:[["Remove and burn infected leaves. Do not work in the field when plants are wet.","సోకిన ఆకులను తీసి కాల్చండి. మొక్కలు తడిగా ఉన్నప్పుడు పొలంలో పని చేయకండి."],["Spray Pseudomonas fluorescens 10 g per litre, or Panchagavya 3%.","సూడోమోనాస్ ఫ్లోరెసెన్స్ లీటరు నీటికి 10 గ్రా., లేదా పంచగవ్య 3% పిచికారీ చేయండి."],["Mulch the soil so rain does not splash spores onto leaves.","వర్షపు చినుకులు బీజాంశాలను ఆకులపైకి చిమ్మకుండా నేలపై ఆచ్ఛాదన వేయండి."]]},
 {id:"wilt",ic:"🥀",kw:["wilt","wilting","root rot","వాడు","ఎండిపో","వడలు","కుళ్లు"],l:["Plant wilts even with water","నీరున్నా మొక్క వాడిపోవడం"],
  c:["Soil-borne wilt or root rot (fungi, nematodes). Check whether the stem base is brown or soft.","నేల ద్వారా వచ్చే వడలు/వేరుకుళ్లు తెగులు. కాండం అడుగు గోధుమ రంగులో లేదా మెత్తగా ఉందేమో చూడండి."],
  r:[["Remove wilted plants. Do not let water stand.","వాడిన మొక్కలను తీసేయండి. నీరు నిలవనీయకండి."],["Mix 1–2 kg Trichoderma into 100 kg farmyard manure per acre and apply near roots.","100 కిలోల ఎరువులో 1–2 కిలోల ట్రైకోడెర్మా కలిపి ఎకరానికి వేర్ల దగ్గర వేయండి."],["Add about 100 kg neem cake per acre and drench with Jeevamrutham.","ఎకరానికి సుమారు 100 కిలోల వేప పిండి వేసి, జీవామృతంతో తడపండి."],["Rotate with cereals or pulses for 2–3 seasons.","2–3 సీజన్లు ధాన్యాలు/పప్పుధాన్యాలతో పంట మార్పిడి చేయండి."]]},
 {id:"sticky",ic:"🍯",kw:["sticky","aphid","ants","honeydew","sooty","జిగురు","చీమలు","పేనుబంక"],l:["Sticky leaves, ants, black coating","ఆకులపై జిగురు, చీమలు, నల్లని పొర"],
  c:["Aphids, jassids or mealybugs suck sap and leave sticky honeydew, which grows black sooty mould.","పేనుబంక, పచ్చదోమ, పిండినల్లి రసం పీల్చి జిగురు విసర్జిస్తాయి; దానిపై నల్లని బూజు పెరుగుతుంది."],
  r:[["Wash plants with a strong water jet.","నీటి ధారతో మొక్కలను కడగండి."],["Spray Neemastram, or 5 ml mild soap per litre of water.","నీమాస్త్రం పిచికారీ చేయండి, లేదా లీటరు నీటికి 5 మి.లీ. సబ్బు ద్రావణం."],["Protect ladybird beetles; they eat aphids. Avoid broad-spectrum sprays.","లేడీబర్డ్ పురుగులను కాపాడండి, అవి పేనుబంకను తింటాయి."]]},
 {id:"stunt",ic:"🟣",kw:["stunt","purple","small","growth","ఎదుగుదల","ఊదా","పొట్టి"],l:["Stunted plant, purple leaves","మొక్క ఎదగకపోవడం, ఊదా ఆకులు"],
  c:["Often low phosphorus, cold stress or compacted, waterlogged roots.","భాస్వరం లోపం, చలి ఒత్తిడి, లేదా గట్టిపడిన/నీరు నిలిచిన వేర్లు కారణం కావచ్చు."],
  r:[["Add compost and Jeevamrutham to improve soil life.","నేల జీవం పెంచడానికి కంపోస్టు, జీవామృతం వేయండి."],["Apply PSB bio-culture, about 2 kg per acre mixed with farmyard manure.","ఎకరానికి సుమారు 2 కిలోల PSB జీవ ఎరువును పశువుల ఎరువుతో కలిపి వేయండి."],["Loosen compacted soil and fix drainage.","గట్టిపడిన నేలను గుల్ల చేసి, నీరు పోయే ఏర్పాటు చేయండి."]]},
 {id:"dead",ic:"🌾",kw:["dead heart","stem borer","white ear","leaf folder","ఎండు కంకి","తెల్ల కంకి","కాండం తొలుచు"],l:["Dead heart, white ears (paddy/maize)","చిరు పొట్టలో ఎండిన మొవ్వు, తెల్ల కంకులు (వరి/మొక్కజొన్న)"],
  c:["Stem borer. Larvae tunnel inside the stem and kill the central shoot.","కాండం తొలుచు పురుగు. లార్వా కాండం లోపల తొలిచి మొవ్వును చంపుతుంది."],
  r:[["Release Trichogramma egg cards (follow supplier or KVK dose) every 10 days.","ట్రైకోగ్రామా గుడ్డు అట్టలను (సరఫరాదారు/KVK మోతాదు ప్రకారం) 10 రోజులకు ఒకసారి వదలండి."],["Install pheromone traps and light traps; clip egg masses in the nursery.","ఫెరోమోన్ ఎరలు, లైట్ ట్రాప్‌లు పెట్టండి; నారుమడిలో గుడ్డు సముదాయాలను తీసేయండి."],["Put bird perches and keep bunds free of weeds.","పక్షి స్థావరాలు పెట్టి, గట్లపై కలుపు లేకుండా చూడండి."]]}
];

function fillAll(){
  const opts=CROPS.map(c=>`<option value="${c.id}">${c.e} ${esc(T(c.n[0],c.n[1]))}</option>`).join("");
  const a=$("#allCrops"),p=$("#photoCrop"); if(!a||!p)return;
  const av=state.crop||"",pv=p.value;
  a.innerHTML=`<option value="">${T("Choose a crop…","పంటను ఎంచుకోండి…")}</option>`+opts; a.value=av;
  p.innerHTML=`<option value="">${T("Not sure","తెలియదు")}</option>`+opts; p.value=pv;
  const dc=$("#diaryCrop"); if(dc){const dv=dc.value; dc.innerHTML=`<option value="">${T("No specific crop","ఏ పంట అని లేదు")}</option>`+opts; dc.value=dv;}
}
/* ============ language ============ */
function setLang(l){
  LANG=l; document.documentElement.dataset.lang=l; document.documentElement.lang=l;
  document.querySelectorAll(".langseg button").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.l===l)));
  $("#chatInput").placeholder=T("Ask about your crop…","మీ పంట గురించి అడగండి…");
  renderPlan(); renderSugg(); fillAll(); fillGeo(); renderLocal(); fillTypes(); renderDiary();
}

/* ============ advisor ============ */
const state={season:"R",soil:"red",water:2,crop:null,day:45,sow:new Date(),st:"AP",dist:""};
(function initSeason(){const m=new Date().getMonth()+1;state.season=m>=6&&m<=9?"K":(m>=10||m===1)?"R":"Z";})();

const DROWS=[
["srikakulam","Srikakulam","శ్రీకాకుళం","AP","loam,red",3,"paddy,greengram,maize,sesame,ragi"],
["parvathipuram","Parvathipuram Manyam","పార్వతీపురం మన్యం","AP","red",2,"paddy,ragi,maize,greengram,turmeric"],
["vizianagaram","Vizianagaram","విజయనగరం","AP","red,loam",3,"paddy,maize,greengram,sesame,ragi"],
["visakhapatnam","Visakhapatnam","విశాఖపట్నం","AP","red",2,"paddy,ragi,sesame,maize,cowpea"],
["asr","Alluri Sitharama Raju","అల్లూరి సీతారామరాజు","AP","red",2,"ragi,paddy,turmeric,maize,cowpea"],
["anakapalli","Anakapalli","అనకాపల్లి","AP","red,loam",3,"paddy,maize,ragi,sesame,greengram"],
["kakinada","Kakinada","కాకినాడ","AP","loam",3,"paddy,maize,greengram,bhendi,brinjal"],
["eastgodavari","East Godavari","తూర్పు గోదావరి","AP","loam",3,"paddy,maize,greengram,bhendi,sesame"],
["konaseema","Dr. B.R. Ambedkar Konaseema","డా. బి.ఆర్. అంబేడ్కర్ కోనసీమ","AP","loam",3,"paddy,greengram,brinjal,bhendi,cowpea"],
["westgodavari","West Godavari","పశ్చిమ గోదావరి","AP","loam",3,"paddy,maize,greengram,bhendi,brinjal"],
["eluru","Eluru","ఏలూరు","AP","loam,black",3,"paddy,maize,greengram,cotton,chilli"],
["krishna","Krishna","కృష్ణా","AP","loam,black",3,"paddy,greengram,maize,bhendi,brinjal"],
["ntr","NTR","ఎన్టీఆర్","AP","black,loam",3,"paddy,cotton,chilli,maize,greengram"],
["guntur","Guntur","గుంటూరు","AP","black",2,"cotton,chilli,paddy,bengalgram,maize"],
["palnadu","Palnadu","పల్నాడు","AP","black",2,"cotton,chilli,redgram,bengalgram,paddy"],
["bapatla","Bapatla","బాపట్ల","AP","black,loam",3,"paddy,cotton,greengram,bengalgram,maize"],
["prakasam","Prakasam","ప్రకాశం","AP","black,red",2,"bengalgram,cotton,chilli,sunflower,paddy"],
["nellore","Sri Potti Sriramulu Nellore","శ్రీ పొట్టి శ్రీరాములు నెల్లూరు","AP","loam,sandy",3,"paddy,groundnut,greengram,sesame,maize"],
["kurnool","Kurnool","కర్నూలు","AP","black",2,"cotton,bengalgram,sunflower,onion,jowar"],
["nandyal","Nandyal","నంద్యాల","AP","black",2,"bengalgram,cotton,paddy,sunflower,redgram"],
["anantapuramu","Anantapuramu","అనంతపురం","AP","red",1,"groundnut,redgram,sunflower,jowar,castor"],
["sss","Sri Sathya Sai","శ్రీ సత్యసాయి","AP","red",1,"groundnut,redgram,sunflower,tomato,jowar"],
["kadapa","YSR Kadapa","వైఎస్సార్ కడప","AP","red,black",3,"paddy,groundnut,bengalgram,turmeric,sunflower,cotton"],
["annamayya","Annamayya","అన్నమయ్య","AP","red",2,"groundnut,tomato,paddy,ragi,redgram"],
["chittoor","Chittoor","చిత్తూరు","AP","red",2,"groundnut,paddy,tomato,ragi,brinjal"],
["tirupati","Tirupati (Sri Balaji)","తిరుపతి","AP","red,loam",2,"paddy,groundnut,sesame,greengram,tomato"],
["adilabad","Adilabad","ఆదిలాబాద్","TG","black",2,"cotton,redgram,jowar,bengalgram,maize"],
["bhadradri","Bhadradri Kothagudem","భద్రాద్రి కొత్తగూడెం","TG","red,black",2,"paddy,cotton,chilli,maize,redgram"],
["hanumakonda","Hanumakonda","హనుమకొండ","TG","black,red",2,"paddy,cotton,maize,redgram"],
["hyderabad","Hyderabad","హైదరాబాద్","TG","red",2,"tomato,brinjal,bhendi,maize"],
["jagtial","Jagtial","జగిత్యాల","TG","black,loam",3,"paddy,maize,turmeric,cotton"],
["jangaon","Jangaon","జనగాం","TG","red,black",2,"paddy,cotton,maize"],
["bhupalpally","Jayashankar Bhupalpally","జయశంకర్ భూపాలపల్లి","TG","red",2,"paddy,cotton,maize,chilli"],
["gadwal","Jogulamba Gadwal","జోగులాంబ గద్వాల","TG","red,black",2,"paddy,cotton,groundnut,redgram"],
["kamareddy","Kamareddy","కామారెడ్డి","TG","black",2,"paddy,maize,redgram,jowar"],
["karimnagar","Karimnagar","కరీంనగర్","TG","loam,black",3,"paddy,maize,cotton"],
["khammam","Khammam","ఖమ్మం","TG","black,red",3,"paddy,cotton,chilli,maize"],
["asifabad","Kumuram Bheem Asifabad","కుమురం భీం ఆసిఫాబాద్","TG","black",2,"cotton,redgram,paddy,jowar"],
["mahabubabad","Mahabubabad","మహబూబాబాద్","TG","red",3,"paddy,chilli,cotton,maize"],
["mahabubnagar","Mahabubnagar","మహబూబ్‌నగర్","TG","red",2,"paddy,redgram,groundnut,cotton,castor"],
["mancherial","Mancherial","మంచిర్యాల","TG","black",2,"cotton,paddy,maize,redgram"],
["medak","Medak","మెదక్","TG","red,black",2,"paddy,maize,redgram,jowar"],
["medchal","Medchal–Malkajgiri","మేడ్చల్–మల్కాజిగిరి","TG","red",2,"paddy,brinjal,tomato,maize"],
["mulugu","Mulugu","ములుగు","TG","red",2,"paddy,maize,chilli,cotton"],
["nagarkurnool","Nagarkurnool","నాగర్‌కర్నూల్","TG","red,black",2,"cotton,paddy,groundnut,redgram,castor"],
["nalgonda","Nalgonda","నల్గొండ","TG","red,black",3,"paddy,cotton,redgram,castor"],
["narayanpet","Narayanpet","నారాయణపేట","TG","red,black",1,"redgram,jowar,cotton,paddy,castor"],
["nirmal","Nirmal","నిర్మల్","TG","black",2,"paddy,maize,cotton,redgram,jowar"],
["nizamabad","Nizamabad","నిజామాబాద్","TG","black,loam",3,"paddy,maize,turmeric,redgram"],
["peddapalli","Peddapalli","పెద్దపల్లి","TG","black,loam",3,"paddy,cotton,maize"],
["sircilla","Rajanna Sircilla","రాజన్న సిరిసిల్ల","TG","loam",3,"paddy,maize,cotton"],
["rangareddy","Rangareddy","రంగారెడ్డి","TG","red",2,"maize,redgram,cotton,tomato,brinjal"],
["sangareddy","Sangareddy","సంగారెడ్డి","TG","red,black",2,"redgram,bengalgram,jowar,maize,sunflower"],
["siddipet","Siddipet","సిద్దిపేట","TG","black",2,"paddy,maize,cotton,redgram"],
["suryapet","Suryapet","సూర్యాపేట","TG","red,black",3,"paddy,cotton,redgram,greengram"],
["vikarabad","Vikarabad","వికారాబాద్","TG","red",1,"redgram,jowar,greengram,maize,bengalgram"],
["wanaparthy","Wanaparthy","వనపర్తి","TG","red",2,"paddy,groundnut,redgram,cotton,castor"],
["warangal","Warangal","వరంగల్","TG","black,red",2,"paddy,cotton,maize,chilli"],
["yadadri","Yadadri Bhuvanagiri","యాదాద్రి భువనగిరి","TG","red,black",2,"paddy,cotton,redgram,castor"]
];
const DIST_BY={};
DROWS.forEach(r=>{DIST_BY[r[0]]={id:r[0],n:[r[1],r[2]],st:r[3],soils:r[4].split(","),w:r[5],crops:r[6].split(",")};});
const STATES=[["AP",["Andhra Pradesh","ఆంధ్రప్రదేశ్"]],["TG",["Telangana","తెలంగాణ"]]];
function fillGeo(){
  const dopts=`<option value="">${T("Not selected","ఎంచుకోలేదు")}</option>`+DROWS.filter(r=>r[3]===state.st).map(r=>`<option value="${r[0]}">${esc(T(r[1],r[2]))}</option>`).join("");
  const sopts=STATES.map(([v,n])=>`<option value="${v}">${esc(T(n[0],n[1]))}</option>`).join("");
  ["selState","wState"].forEach(id=>{const e=$("#"+id);if(e){e.innerHTML=sopts;e.value=state.st;}});
  ["selDist","wDist"].forEach(id=>{const e=$("#"+id);if(e){e.innerHTML=dopts;e.value=state.dist;}});
}
function renderLocal(){
  const d=DIST_BY[state.dist],el=$("#localCrops"); if(!el)return;
  if(!d){el.innerHTML="";$("#distNote").innerHTML="";return;}
  el.innerHTML=`<span class="chip" style="background:none;padding-left:0">${B(`Commonly grown in ${esc(d.n[0])}:`,`${esc(d.n[1])} లో ఎక్కువగా వేసేవి:`)}</span>`+d.crops.map(id=>`<button type="button" class="chip" data-id="${id}" style="border:0;cursor:pointer">${CROP[id].e} ${B(esc(CROP[id].n[0]),esc(CROP[id].n[1]))}</button>`).join("");
  $("#distNote").innerHTML=B(`Crops commonly grown in ${esc(d.n[0])} are shown first (approximate). You can still change soil and water below.`,`${esc(d.n[1])} లో ఎక్కువగా వేసే పంటలను ముందు చూపిస్తున్నాం (సుమారు). క్రింద నేల, నీరు మార్చుకోవచ్చు.`);
}
function applyDist(){
  const d=DIST_BY[state.dist];
  if(d){state.soil=d.soils[0];state.water=d.w;refreshSegs();}
  renderResults();renderLocal();renderWizardCrops();
}
function refreshSegs(){seg($("#segSeason"),SEASONS,"season");seg($("#segSoil"),SOILS,"soil");seg($("#segWater"),WATERS,"water");const w=$("#wSeason");if(w)seg(w,SEASONS,"season");}
function seg(el,items,key){
  el.innerHTML=items.map(([v,n])=>`<button type="button" role="radio" data-v="${v}" aria-checked="${String(state[key])===String(v)}">${B(n[0],n[1])}</button>`).join("");
  el.onclick=e=>{const b=e.target.closest("button");if(!b)return;state[key]=key==="water"?+b.dataset.v:b.dataset.v;
    refreshSegs();renderResults();renderWizardCrops();if(key==="season")updateMood();};
}
function scoreCrop(c){
  const s=c.S.includes(state.season)?40:0, so=c.soil.includes(state.soil)?35:0;
  const w=c.w<=state.water?25:(c.w===state.water+1?8:0);
  const d=DIST_BY[state.dist],loc=!!(d&&d.crops.includes(c.id));
  return {total:Math.min(100,s+so+w+(loc?20:0)),s:!!s,so:!!so,w:c.w<=state.water,loc};
}
function renderResults(){
  const list=CROPS.map(c=>({c,sc:scoreCrop(c)})).filter(x=>x.sc.total>=40).sort((a,b)=>b.sc.total-a.sc.total).slice(0,9);
  const el=$("#results");
  if(!list.length){el.innerHTML=`<p class="empty">${B("No strong match. Try another soil or season.","సరిపోయే పంట లేదు. వేరే నేల లేదా సీజన్ ప్రయత్నించండి.")}</p>`;return;}
  el.innerHTML=list.map(({c,sc})=>`<div class="crop-wrap">${spk(c.n[0]+", "+sc.total+" percent match",c.n[1]+", "+sc.total+" శాతం సరిపోతుంది")}<button type="button" class="crop-card" data-id="${c.id}">
    <span class="em" aria-hidden="true">${c.e}</span><span class="nm">${B(esc(c.n[0]),esc(c.n[1]))}</span><span class="pct">${sc.total}%</span>
    <span class="bar"><i style="width:${sc.total}%"></i></span>
    <span class="why">${sc.loc?"★ "+B("Common in your district","మీ జిల్లాలో ఎక్కువగా వేస్తారు")+" · ":""}${sc.s?"✓":"–"} ${B("Season","సీజన్")} · ${sc.so?"✓":"–"} ${B("Soil","నేల")} · ${sc.w?"✓":"–"} ${B(WNAME[c.w][0],WNAME[c.w][1])}</span></button></div>`).join("");
}
$("#results").addEventListener("click",e=>{const b=e.target.closest(".crop-card");if(b){selectCrop(b.dataset.id);$("#plan").scrollIntoView();}});

/* ============ crop plan ============ */
function fmtDate(d){return d.toLocaleDateString(LANG==="te"?"te-IN":"en-IN",{day:"numeric",month:"short"});}
function dateAt(dd){const d=new Date(state.sow);d.setDate(d.getDate()+dd);return d;}
function selectCrop(id){
  state.crop=id; const c=CROP[id]; const sel=$("#allCrops"); if(sel)sel.value=id; const dcs=$("#diaryCrop"); if(dcs)dcs.value=id; state.day=Math.round(c.days*.45);
  const sl=$("#daySlider"); sl.max=c.days; sl.value=state.day;
  stopPlay();
  if(viewer){viewer.setCrop(c);viewer.setTarget(state.day/c.days,true);}
  renderPlan(); chatCtx();
}
function renderPlan(){
  const id=state.crop; if(!id)return; const c=CROP[id];
  $("#planTitle").innerHTML=`${c.e} ${B(esc(c.n[0]),esc(c.n[1]))}`;
  $("#planChips").innerHTML=[
    B(`${c.days} days`,`${c.days} రోజులు`),B(`Spacing ${c.sp}`,`ఎడం ${c.sp}`),
    B(`Seed ${c.seed} ${c.u} / acre`,`విత్తనం ${c.seed} ${c.u==="kg"?"కిలోలు":"గ్రా."} / ఎకరా`),B(WNAME[c.w][0],WNAME[c.w][1])
  ].map(x=>`<span class="chip">${x}</span>`).join("");
  $("#planTip").innerHTML=`<b>${B("Tip","చిట్కా")}:</b> ${B(esc(c.tip[0]),esc(c.tip[1]))} ${spk(c.tip[0],c.tip[1])}`;
  const st=stagesFor(c);
  $("#timeline").innerHTML=st.map((s,i)=>`<li data-d="${s.d}" data-i="${i}"><time>${fmtDate(dateAt(s.d))} · ${B(s.d<0?`${-s.d} days before sowing`:`Day ${s.d}`,s.d<0?`విత్తడానికి ${-s.d} రోజులు ముందు`:`${s.d}వ రోజు`)}</time><h4>${B(esc(s.t[0]),esc(s.t[1]))}</h4><p>${B(esc(s.x[0]),esc(s.x[1]))}</p>${spk(s.t[0]+". "+s.x[0],s.t[1]+". "+s.x[1])}</li>`).join("");
  updateDay();
}
function updateDay(){
  const c=CROP[state.crop]; if(!c)return; const day=state.day, st=stagesFor(c);
  let active=0; st.forEach((s,i)=>{if(s.d<=day)active=i;});
  $("#timeline").querySelectorAll("li").forEach((li,i)=>{li.classList.toggle("on",i===active);li.classList.toggle("done",i<active);});
  const s=st[active], pct=Math.round(day/c.days*100);
  $("#viewCap").innerHTML=`${B(`Day ${day} of ${c.days}`,`${day}వ రోజు / ${c.days}`)} · ${B(esc(s.t[0]),esc(s.t[1]))}<small>${B(`Growth ${pct}% · ${fmtDate(dateAt(day))}`,`పెరుగుదల ${pct}% · ${fmtDate(dateAt(day))}`)}</small>`;
}
$("#daySlider").addEventListener("input",e=>{stopPlay();state.day=+e.target.value;const c=CROP[state.crop];if(viewer)viewer.setTarget(state.day/c.days);updateDay();});
$("#sowDate").addEventListener("change",e=>{const d=new Date(e.target.value);if(!isNaN(d))state.sow=d;renderPlan();});
let playTimer=null;
function stopPlay(){if(playTimer){clearInterval(playTimer);playTimer=null;}$("#playBtn").textContent="▶";}
$("#playBtn").addEventListener("click",()=>{
  if(playTimer){stopPlay();return;} const c=CROP[state.crop]; if(!c)return;
  $("#playBtn").textContent="❚❚"; if(state.day>=c.days)state.day=0;
  const step=Math.max(1,Math.round(c.days/160));
  playTimer=setInterval(()=>{state.day=Math.min(c.days,state.day+step);$("#daySlider").value=state.day;if(viewer)viewer.setTarget(state.day/c.days);updateDay();if(state.day>=c.days)stopPlay();},60);
});
function ymd(d){return d.getFullYear()+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0");}
/* plan download (.txt) */
$("#icsBtn").addEventListener("click",async()=>{
  const c=CROP[state.crop]; if(!c)return;
  const out=[`${c.n[1]} / ${c.n[0]}`,`${c.days} days · ${c.sp}`,"",""];
  stagesFor(c).forEach(s=>{out.push(`${fmtDate(dateAt(s.d))} (day ${s.d})`,`${s.t[1]} / ${s.t[0]}`,s.x[1],s.x[0],"");});
  out.push("Kisan Call Centre: 1800-180-1551");
  try{const dl=window.claude?await window.claude.use("downloads"):null;
    if(!dl){alert(T("Saving files is not available here.","ఇక్కడ ఫైల్ సేవ్ చేయడం సాధ్యం కాదు."));return;}
    await dl.save({filename:`organicmitra-${c.id}-plan.txt`,data:out.join("\n")});
  }catch(e){}
});

/* ============ recipes ============ */
function fillRecipeSpk(r,el,f){
  const part=(i,k)=>i[2]===null?i[k]+", "+i[3].split("|")[k]:(i[3]==="nos|"?i[k]+" "+Math.round(i[2]*f):i[k]+" "+fmtQ(i[2],f)+" "+i[3]);
  const en=r.n[0]+". "+r.ing.map(i=>part(i,0)).join(", ")+". "+r.st.map(x=>x[0]).join(" ")+" "+r.use[0];
  const te=r.n[1]+". "+r.ing.map(i=>part(i,1)).join(", ")+". "+r.st.map(x=>x[1]).join(" ")+" "+r.use[1];
  const slot=el.querySelector(".spkslot");if(slot)slot.innerHTML=spk(en,te);
}
function fmtQ(q,f){const v=q*f;return (v>=100?Math.round(v):Math.round(v*10)/10).toString();}
function renderRecipes(){
  $("#recipes").innerHTML=RECIPES.map(r=>`<article class="recipe" id="r-${r.id}" data-id="${r.id}">
    <div class="rh"><h3>${B(esc(r.n[0]),esc(r.n[1]))}</h3><span class="spkslot"></span></div><p class="for">${B(esc(r.f[0]),esc(r.f[1]))}</p>
    <div class="field"><label>${B("For","కొలత")} (${B(esc(r.unit[0]),esc(r.unit[1]))})</label><input type="number" min="0.1" step="${r.base>1?10:0.5}" value="${r.def}" data-scale></div>
    <ul class="ing"></ul>
    <div class="use">${B(esc(r.use[0]),esc(r.use[1]))}</div>
    <details><summary>${B("How to make","తయారీ విధానం")}</summary><ol>${r.st.map(s=>`<li>${B(esc(s[0]),esc(s[1]))}</li>`).join("")}</ol></details></article>`).join("");
  RECIPES.forEach(r=>updateRecipe(r.id));
}
function updateRecipe(id){
  const r=RECIPES.find(x=>x.id===id), el=$("#r-"+id), v=parseFloat(el.querySelector("[data-scale]").value)||r.def, f=v/r.base;
  el.querySelector(".ing").innerHTML=r.ing.map(i=>{
    let q; if(i[2]===null){const [e,t]=i[3].split("|");q=B(e,t);}
    else if(i[3]==="nos|"){q=Math.round(i[2]*f)+" "+B("nos","సంఖ్య");}
    else q=`${fmtQ(i[2],f)} ${i[3]}`;
    return `<li><span>${B(esc(i[0]),esc(i[1]))}</span><b>${q}</b></li>`;}).join("");
  fillRecipeSpk(r,el,f);
}
$("#recipes").addEventListener("input",e=>{const a=e.target.closest(".recipe");if(a&&e.target.matches("[data-scale]"))updateRecipe(a.dataset.id);});

/* ============ pest doctor ============ */
function renderSymp(){
  $("#symp").innerHTML=PESTS.map(p=>`<button type="button" data-id="${p.id}" aria-pressed="false"><span class="ic" aria-hidden="true">${p.ic}</span><span>${B(esc(p.l[0]),esc(p.l[1]))}</span></button>`).join("");
}
$("#symp").addEventListener("click",e=>{
  const b=e.target.closest("button");if(!b)return;
  $("#symp").querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",String(x===b)));
  const p=PESTS.find(x=>x.id===b.dataset.id), d=$("#diag"); d.hidden=false;
  d.innerHTML=`<h3>${p.ic} ${B(esc(p.l[0]),esc(p.l[1]))}${spk(p.l[0]+". "+p.c[0]+" "+p.r.map(x=>x[0]).join(" "),p.l[1]+". "+p.c[1]+" "+p.r.map(x=>x[1]).join(" "))}</h3><p>${B(esc(p.c[0]),esc(p.c[1]))}</p>
   <h4 style="margin-top:16px">${B("Organic remedy","సేంద్రీయ పరిష్కారం")}</h4>
   <ol>${p.r.map(s=>`<li>${B(esc(s[0]),esc(s[1]))}</li>`).join("")}</ol>
   <p class="warn">${B("If more than about 10–15% of plants are affected and it keeps spreading, call your local KVK or Kisan Call Centre 1800-180-1551.","10–15% కంటే ఎక్కువ మొక్కలు సోకి, ఇంకా వ్యాపిస్తుంటే మీ స్థానిక KVK లేదా కిసాన్ కాల్ సెంటర్ 1800-180-1551 కు ఫోన్ చేయండి.")}</p>`;
});

/* ============ savings ============ */
function renderSavings(){
  const a=+$("#acres").value||0, sp=+$("#spend").value||0, pc=+$("#pct").value, n=+$("#seasons").value;
  $("#pctVal").textContent=pc+"%";
  const chem=a*sp*n, org=chem*pc/100, saved=chem-org, fmt=v=>"₹"+Math.round(v).toLocaleString("en-IN");
  $("#saveBig").textContent=fmt(saved);
  const sv=$("#saveSpk");if(sv){sv.dataset.en=`You could save about ${fmt(saved)} per year, spending ${fmt(org)} instead of ${fmt(chem)}.`;sv.dataset.te=`సంవత్సరానికి సుమారు ${fmt(saved)} ఆదా చేయవచ్చు. ${fmt(chem)} బదులు ${fmt(org)} ఖర్చు అవుతుంది.`;}
  $("#bars").innerHTML=`<div class="bar-row"><div class="lab"><span>${B("Chemical inputs / year","రసాయన ఖర్చు / సంవత్సరం")}</span><b>${fmt(chem)}</b></div><div class="track"><i style="width:100%;background:var(--chili)"></i></div></div>
   <div class="bar-row"><div class="lab"><span>${B("Organic inputs / year","సేంద్రీయ ఖర్చు / సంవత్సరం")}</span><b>${fmt(org)}</b></div><div class="track"><i style="width:${pc}%;background:var(--leaf)"></i></div></div>`;
}
["acres","spend","pct","seasons"].forEach(i=>$("#"+i).addEventListener("input",renderSavings));

/* ============ chat ============ */
const SUGG=[["My tomato leaves are turning yellow. What should I do?","నా టమాటా ఆకులు పసుపు రంగులోకి మారుతున్నాయి, ఏం చేయాలి?"],["How do I make Jeevamrutham?","జీవామృతం ఎలా తయారు చేయాలి?"],["Which crop is good in red soil in rabi?","రబీలో ఎర్ర నేలకు ఏ పంట మంచిది?"],["Organic remedy for pink bollworm in cotton?","పత్తిలో గులాబీ రంగు కాయతొలుచు పురుగుకు సేంద్రీయ పరిష్కారం?"]];
function renderSugg(){$("#sugg").innerHTML=SUGG.map((s,i)=>`<button type="button" data-i="${i}">${T(s[0],s[1])}</button>`).join("");}
$("#sugg").addEventListener("click",e=>{const b=e.target.closest("button");if(b)ask(SUGG[+b.dataset.i][LANG==="te"?1:0]);});

const RULES=()=>`You are Mitra, a friendly organic-farming assistant for small farmers in Andhra Pradesh and Telangana, India.
Rules:
- Reply in the same language the farmer wrote in. If they write Telugu in English letters (Tanglish), reply in Telugu script. Use simple, everyday words.
- Suggest ONLY organic, natural-farming solutions (no synthetic fertilizers or pesticides). Bt, NPV, Trichoderma, Pseudomonas, neem, pheromone traps and sticky traps are fine.
- Be practical: give quantities per acre, when to apply, and the order of steps. Keep the answer under 150 words. Plain text only, use "-" for lists, no tables, no markdown headings.
- If the symptom is unclear, give the most likely cause and ask ONE short question.
- For serious or fast-spreading problems tell them to contact the local KVK or Kisan Call Centre 1800-180-1551.
- Do not invent product names or exact doses you are not sure about; say "ask your local KVK for the exact dose" instead.
Known traditional recipes (per acre unless stated): ${JSON.stringify(RECIPES.map(r=>({name:r.n[0],basis:r.unit[0],items:r.ing.map(i=>i[0]+(i[2]!==null?" "+i[2]+" "+i[3]:""))})))}
Farmer context: ${state.crop?"selected crop "+CROP[state.crop].n[0]+"; ":""}season ${state.season}, soil ${state.soil}${state.dist?", district "+DIST_BY[state.dist].n[0]+" ("+(DIST_BY[state.dist].st==="AP"?"Andhra Pradesh":"Telangana")+")":""}.`;

let turns=[], sampleFn=null, sampleChecked=false, ctl=null, speakOn=false;
async function getSample(){
  if(sampleChecked)return sampleFn; sampleChecked=true;
  try{sampleFn=window.claude?await window.claude.use("sample"):null;}catch(e){sampleFn=null;}
  return sampleFn;
}
function chatCtx(){}
function bubble(cls,html){const d=document.createElement("div");d.className="msg "+cls;d.innerHTML=html;$("#msgs").appendChild(d);$("#msgs").scrollTop=1e9;return d;}
function fmtBot(t){return esc(t).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>");}
function greet(){turns=[];$("#msgs").innerHTML="";bubble("bot",B("Namaste! I am Mitra. Ask me about crops, organic sprays or plant problems. You can type or tap the mic.","నమస్కారం! నేను మిత్ర. పంటలు, సేంద్రీయ పిచికారీలు, మొక్కల సమస్యల గురించి అడగండి. టైప్ చేయండి లేదా మైక్ నొక్కండి."));}
function offlineAnswer(q){
  const s=q.toLowerCase();
  const rec=RECIPES.find(r=>r.kw.some(k=>s.includes(k.toLowerCase())));
  if(rec){return T(`${rec.n[0]} (${rec.unit[0]}: ${rec.def}):\n`+rec.ing.map(i=>`- ${i[0]}: ${i[2]!==null?i[2]+" "+i[3]:i[3].split("|")[0]}`).join("\n")+"\n"+rec.st.map((x,i)=>`${i+1}. ${x[0]}`).join("\n")+"\n"+rec.use[0],
    `${rec.n[1]} (${rec.unit[1]}: ${rec.def}):\n`+rec.ing.map(i=>`- ${i[1]}: ${i[2]!==null?i[2]+" "+i[3]:i[3].split("|")[1]}`).join("\n")+"\n"+rec.st.map((x,i)=>`${i+1}. ${x[1]}`).join("\n")+"\n"+rec.use[1]);}
  const p=PESTS.find(x=>x.kw.some(k=>s.includes(k.toLowerCase())));
  if(p){return T(p.l[0]+"\n"+p.c[0]+"\n"+p.r.map(x=>"- "+x[0]).join("\n"),p.l[1]+"\n"+p.c[1]+"\n"+p.r.map(x=>"- "+x[1]).join("\n"));}
  return T("I could not reach the AI right now. Try the Pest doctor or Organic inputs sections above, or call Kisan Call Centre 1800-180-1551.","ఇప్పుడు AI అందుబాటులో లేదు. పైన ఉన్న పురుగు/తెగులు లేదా సేంద్రీయ ఎరువుల విభాగాలు చూడండి, లేదా కిసాన్ కాల్ సెంటర్ 1800-180-1551 కు ఫోన్ చేయండి.");
}
function speak(text){
  if(!speakOn||!window.speechSynthesis)return;
  try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text.replace(/[-*]/g," "));u.lang=/[\u0C00-\u0C7F]/.test(text)?"te-IN":"en-IN";speechSynthesis.speak(u);}catch(e){}
}
async function ask(text){
  text=(text||"").trim(); if(!text||ctl)return;
  $("#chatInput").value=""; bubble("me",esc(text));
  const out=bubble("bot",`<i>${B("Thinking…","ఆలోచిస్తున్నాను…")}</i>`);
  const sample=await getSample();
  $("#sendBtn").hidden=true; $("#stopBtn").hidden=false;
  if(!sample){out.textContent=offlineAnswer(text);$("#sendBtn").hidden=false;$("#stopBtn").hidden=true;return;}
  ctl=new AbortController();
  const hist=turns.concat([{role:"user",content:text}]);
  const input=hist.map((t,i)=>i===0?{role:"user",content:RULES()+"\n\nFarmer: "+t.content}:t);
  try{
    const {text:ans}=await sample(input,{cache:false,modelTier:"quick",signal:ctl.signal,onText:({text:t})=>{out.innerHTML=fmtBot(t);$("#msgs").scrollTop=1e9;}});
    out.innerHTML=fmtBot(ans)+" "+spk(ans,ans); turns=hist.concat([{role:"assistant",content:ans}]).slice(-8); speak(ans);
  }catch(e){
    if(e&&e.code==="cancelled"){out.innerHTML=e.text?fmtBot(e.text):"…";}
    else if(e&&e.code==="not_granted"){out.textContent=T("Claude access was declined, so here is the built-in guide:\n","Claude అనుమతి ఇవ్వలేదు, అందుకే అంతర్నిర్మిత గైడ్ నుండి:\n")+offlineAnswer(text);}
    else if(e&&e.code==="rate_limited"){out.textContent=T("Too many questions at once. Please wait a few seconds and try again.","ఒకేసారి చాలా ప్రశ్నలు. కొన్ని సెకన్లు ఆగి మళ్లీ ప్రయత్నించండి.");}
    else{out.textContent=offlineAnswer(text);}
  }finally{ctl=null;$("#sendBtn").hidden=false;$("#stopBtn").hidden=true;$("#msgs").scrollTop=1e9;}
}
$("#chatForm").addEventListener("submit",()=>ask($("#chatInput").value));
$("#stopBtn").addEventListener("click",()=>{if(ctl)ctl.abort();});
$("#clearBtn").addEventListener("click",()=>{if(ctl)ctl.abort();greet();});
$("#speakTog").addEventListener("click",e=>{speakOn=!speakOn;e.currentTarget.setAttribute("aria-pressed",String(speakOn));if(!speakOn&&window.speechSynthesis)speechSynthesis.cancel();});
(function mic(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition, b=$("#micBtn");
  if(!SR){b.hidden=true;return;}
  let rec=null;
  b.addEventListener("click",()=>{
    if(rec){rec.stop();return;}
    try{rec=new SR();rec.lang=LANG==="te"?"te-IN":"en-IN";rec.interimResults=true;rec.continuous=false;
      rec.onresult=e=>{$("#chatInput").value=[...e.results].map(r=>r[0].transcript).join("");};
      rec.onend=()=>{b.classList.remove("on");const v=$("#chatInput").value.trim();rec=null;if(v)ask(v);};
      rec.onerror=()=>{b.classList.remove("on");rec=null;bubble("bot",B("The microphone is not available here. Please type your question.","మైక్ ఇక్కడ అందుబాటులో లేదు. దయచేసి టైప్ చేయండి."));};
      rec.start();b.classList.add("on");}catch(e){rec=null;}
  });
})();

/* ============ photo check ============ */
let photoFile=null,photoCtl=null;
function setPhoto(f){
  if(!f)return;
  if(!/^image\//.test(f.type)){$("#photoMsg").textContent=T("Please choose an image file.","దయచేసి ఫోటో ఫైల్ ఎంచుకోండి.");return;}
  photoFile=f;
  const r=new FileReader();
  r.onload=()=>{const im=$("#photoPrev");im.src=r.result;im.hidden=false;$("#dropHint").hidden=true;};
  r.readAsDataURL(f);
  $("#photoGo").disabled=false;$("#photoMsg").textContent="";
}
$("#photoFile").addEventListener("change",e=>setPhoto(e.target.files[0]));
["dragenter","dragover"].forEach(ev=>$("#drop").addEventListener(ev,e=>{e.preventDefault();$("#drop").classList.add("over");}));
["dragleave","drop"].forEach(ev=>$("#drop").addEventListener(ev,e=>{e.preventDefault();$("#drop").classList.remove("over");}));
$("#drop").addEventListener("drop",e=>{if(e.dataTransfer&&e.dataTransfer.files[0])setPhoto(e.dataTransfer.files[0]);});
$("#photoStop").addEventListener("click",()=>{if(photoCtl)photoCtl.abort();});
const PHOTO_DISC=()=>`<span class="disc">${T("This is an estimate from a photo. Many diseases look alike, so confirm serious problems with your local KVK or call 1800-180-1551.","ఇది ఫోటో ఆధారంగా చేసిన అంచనా మాత్రమే. చాలా తెగుళ్లు ఒకేలా కనిపిస్తాయి; తీవ్రమైన సమస్యను మీ స్థానిక KVKతో సరిచూసుకోండి లేదా 1800-180-1551 కు ఫోన్ చేయండి.")}</span>`;
$("#photoGo").addEventListener("click",async()=>{
  if(!photoFile||photoCtl)return;
  const out=$("#photoOut");out.hidden=false;out.innerHTML=`<i>${B("Looking at your photo…","మీ ఫోటోను పరిశీలిస్తున్నాను…")}</i>`;
  out.scrollIntoView({block:"nearest"});
  const sample=await getSample();let caps=null;
  try{caps=sample?await sample.limits():null;}catch(e){caps=null;}
  if(!sample||!caps||!caps.images){out.innerHTML=T("Photo check needs Claude access, which is not available here. Use the symptom tiles in the Pest doctor section above.","ఫోటో పరీక్షకు Claude అనుమతి కావాలి, ఇక్కడ అందుబాటులో లేదు. పైన పురుగు/తెగులు విభాగంలోని లక్షణాలను ఎంచుకోండి.");return;}
  photoCtl=new AbortController();$("#photoGo").hidden=true;$("#photoStop").hidden=false;
  const cv=$("#photoCrop").value,note=$("#photoNote").value.trim();
  const prompt=`You are Mitra, an organic-farming plant doctor for small farmers in Andhra Pradesh and Telangana, India. Look carefully at the attached photo of a crop plant.
Answer in ${LANG==="te"?"Telugu (Telugu script, simple everyday words)":"simple English"}. Plain text only, no markdown tables or headings. Use these short labelled parts:
1. What I see (the plant/crop if you can tell, and the visible symptoms)
2. Likely problem (give your confidence: high, medium or low; mention one other possibility if the signs overlap)
3. Why it happens
4. What to do now (organic steps only, with quantities per acre and timing)
5. How to prevent it next time
6. When to call the local KVK
Rules: only organic or natural-farming solutions (Bt, NPV, Trichoderma, Pseudomonas, neem, pheromone and sticky traps, buttermilk spray, Jeevamrutham, Neemastram, Brahmastram, Agniastram, Panchagavya are fine); no synthetic fertilizers or pesticides. Do not invent exact doses you are unsure of; say "ask your local KVK for the dose". If the photo is not a plant, is blurry, too dark or too far away, say so and tell the farmer how to retake it instead of guessing. Keep it under 220 words.
Known recipes: ${JSON.stringify(RECIPES.map(r=>({name:r.n[0],basis:r.unit[0],items:r.ing.map(i=>i[0]+(i[2]!==null?" "+i[2]+" "+i[3]:""))})))}
Farmer says the crop is: ${cv?CROP[cv].n[0]:"not specified"}. Farmer's note: ${note||"none"}.`;
  try{
    const {text}=await sample(prompt,{images:photoFile,cache:false,signal:photoCtl.signal,onText:({text:t})=>{out.innerHTML=fmtBot(t);}});
    out.innerHTML=fmtBot(text)+PHOTO_DISC()+spk(text,text);
  }catch(e){
    const c=e&&e.code;
    if(c==="cancelled")out.innerHTML=(e.text?fmtBot(e.text):"…");
    else if(c==="not_granted")out.textContent=T("Claude access was declined, so the photo was not sent. You can still use the symptom tiles above.","Claude అనుమతి ఇవ్వలేదు, కాబట్టి ఫోటో పంపబడలేదు. పైన లక్షణాల ఎంపికను వాడవచ్చు.");
    else if(c==="image_rejected")out.textContent=T("This photo could not be used. Please try a JPG or PNG under 20 MB.","ఈ ఫోటో వాడడం సాధ్యం కాలేదు. 20 MB కంటే తక్కువ JPG లేదా PNG ప్రయత్నించండి.");
    else if(c==="rate_limited")out.textContent=T("Please wait a few seconds and try again.","కొన్ని సెకన్లు ఆగి మళ్లీ ప్రయత్నించండి.");
    else out.textContent=T("Could not check the photo right now. Try again, or use the symptom tiles above.","ఇప్పుడు ఫోటోను పరీక్షించలేకపోయాను. మళ్లీ ప్రయత్నించండి, లేదా పైన లక్షణాల ఎంపికను వాడండి.");
  }finally{photoCtl=null;$("#photoGo").hidden=false;$("#photoStop").hidden=true;}
});

/* ============ farm diary ============ */
const DTYPES=[["sow","🌱",["Sowing","విత్తనం"]],["feed","🪣",["Organic feed (Jeevamrutham etc.)","సేంద్రీయ ఎరువు (జీవామృతం మొ.)"]],["spray","💧",["Organic spray","సేంద్రీయ పిచికారీ"]],["weed","🧑‍🌾",["Weeding","కలుపు తీత"]],["irrig","🚿",["Irrigation","నీటి తడి"]],["mulch","🍂",["Mulching","ఆచ్ఛాదన"]],["pest","🐛",["Pest or disease seen","పురుగు/తెగులు గమనిక"]],["harvest","🧺",["Harvest","కోత"]],["cost","💰",["Expense","ఖర్చు"]],["plan","📅",["From crop plan","పంట ప్రణాళిక నుండి"]],["other","📝",["Other","ఇతర"]]];
const DT=Object.fromEntries(DTYPES.map(t=>[t[0],t]));
const DKEY="om_diary_v1";
let diary=[],memOnly=false;
function loadDiary(){try{const v=JSON.parse(localStorage.getItem(DKEY)||"[]");diary=Array.isArray(v)?v:[];}catch(e){diary=[];memOnly=true;}}
function saveDiary(){try{localStorage.setItem(DKEY,JSON.stringify(diary));}catch(e){memOnly=true;}}
function todayStr(){return ymd(new Date()).replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");}
function dateLabel(ds){const a=String(ds).split("-").map(Number);if(a.length<3||a.some(isNaN))return esc(ds);return fmtDate(new Date(a[0],a[1]-1,a[2]))+" "+a[0];}
function fillTypes(){
  const el=$("#dType");if(!el)return;const v=el.value||"feed";
  el.innerHTML=DTYPES.filter(t=>t[0]!=="plan").map(t=>`<option value="${t[0]}">${t[1]} ${esc(T(t[2][0],t[2][1]))}</option>`).join("");el.value=v;
}
function addEntry(e){diary.push(Object.assign({id:Date.now()+Math.floor(Math.random()*1000)},e));saveDiary();renderDiary();}
function renderDiary(){
  const el=$("#diaryList");if(!el)return;
  const list=diary.slice().sort((a,b)=>a.d<b.d?1:a.d>b.d?-1:b.id-a.id);
  const spend=diary.reduce((t,e)=>t+(+e.amt||0),0),org=diary.filter(e=>e.type==="feed"||e.type==="spray").length,sp=spend.toLocaleString("en-IN");
  $("#diarySum").innerHTML=diary.length?B(`${diary.length} entries · ₹${sp} spent · ${org} organic inputs applied`,`${diary.length} నమోదులు · ₹${sp} ఖర్చు · ${org} సేంద్రీయ ఎరువు/పిచికారీలు`):"";
  el.innerHTML=list.length?list.map(e=>{const t=DT[e.type]||DT.other,c=CROP[e.crop];
    return `<li class="dent"><span class="dic" aria-hidden="true">${t[1]}</span><div><b>${B(esc(t[2][0]),esc(t[2][1]))}</b>${c?` · ${c.e} ${B(esc(c.n[0]),esc(c.n[1]))}`:""}<div class="dmeta">${dateLabel(e.d)}${e.amt?` · ₹${(+e.amt).toLocaleString("en-IN")}`:""}</div>${e.note?`<p>${esc(e.note)}</p>`:""}</div><button class="dx" type="button" data-id="${e.id}" aria-label="Delete entry">✕</button></li>`;}).join(""):`<li class="dempty">${B("No entries yet. Log your first task above.","ఇంకా నమోదులు లేవు. పైన మీ మొదటి పనిని నమోదు చేయండి.")}</li>`;
  $("#diaryMsg").textContent=memOnly?T("Saving is not available in this browser. Entries last only until you close the page.","ఈ బ్రౌజర్‌లో సేవ్ చేయడం కుదరదు. పేజీ మూసే వరకే నమోదులు ఉంటాయి."):"";
}
$("#dDate").value=todayStr();
$("#dSave").addEventListener("click",()=>{
  const d=$("#dDate").value||todayStr(),amt=parseFloat($("#dAmt").value);
  addEntry({d,crop:$("#diaryCrop").value,type:$("#dType").value,note:$("#dNote").value.trim().slice(0,300),amt:isNaN(amt)||amt<=0?0:amt});
  $("#dNote").value="";$("#dAmt").value="";$("#diaryMsg").textContent=T("Saved.","నమోదు అయింది.");
  if(memOnly)renderDiary();
});
$("#diaryList").addEventListener("click",e=>{const b=e.target.closest(".dx");if(!b)return;diary=diary.filter(x=>String(x.id)!==b.dataset.id);saveDiary();renderDiary();});
let clearT=null;
$("#dClear").addEventListener("click",e=>{
  const b=e.currentTarget;
  if(!clearT){b.innerHTML=B("Tap again to confirm","నిర్ధారించడానికి మళ్లీ నొక్కండి");clearT=setTimeout(()=>{clearT=null;b.innerHTML=B("Clear all","అన్నీ తొలగించు");},4000);return;}
  clearTimeout(clearT);clearT=null;b.innerHTML=B("Clear all","అన్నీ తొలగించు");diary=[];saveDiary();renderDiary();
});
$("#dCsv").addEventListener("click",async()=>{
  if(!diary.length){$("#diaryMsg").textContent=T("Nothing to download yet.","డౌన్‌లోడ్ చేయడానికి ఇంకా ఏమీ లేదు.");return;}
  const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"';
  const rows=[["date","crop","activity","note","amount_rs"]].concat(diary.slice().sort((a,b)=>a.d<b.d?-1:1).map(e=>[e.d,e.crop?CROP[e.crop].n[0]:"",DT[e.type]?DT[e.type][2][0]:e.type,e.note,e.amt||""]));
  try{const dl=window.claude?await window.claude.use("downloads"):null;
    if(!dl){$("#diaryMsg").textContent=T("Saving files is not available here.","ఇక్కడ ఫైల్ సేవ్ చేయడం సాధ్యం కాదు.");return;}
    await dl.save({filename:"organicmitra-diary.csv",data:"\uFEFF"+rows.map(r=>r.map(q).join(",")).join("\n")});
  }catch(e){}
});
$("#logStage").addEventListener("click",()=>{
  const c=CROP[state.crop];if(!c)return;
  const st=stagesFor(c);let a=0;st.forEach((x,i)=>{if(x.d<=state.day)a=i;});
  addEntry({d:todayStr(),crop:c.id,type:"plan",note:T(st[a].t[0],st[a].t[1]),amt:0});
  $("#logMsg").textContent=T("Saved in Farm diary.","పొలం డైరీలో నమోదు అయింది.");
  setTimeout(()=>{$("#logMsg").textContent="";},3000);
});
loadDiary();

/* ============ hero mood, start wizard, soil UI, tab bar ============ */
const MOODTXT={K:["☔","Kharif rains","ఖరీఫ్ వర్షాలు"],R:["🌅","Rabi sunrise","రబీ ఉదయం"],Z:["☀️","Summer heat","వేసవి ఎండ"]};
let soil=null;
function updateMood(){const h=$("#home");if(h)h.dataset.mood=state.season;if(hero)hero.setMood(state.season);}
$("#heroListen").addEventListener("click",e=>say(T("Grow without chemicals. Know which crop to grow, what to do each day, and what to spray, in your language.","రసాయనాలు లేకుండా పండించండి. ఏ పంట వేయాలో, ప్రతి రోజు ఏం చేయాలో, ఏం పిచికారీ చేయాలో మీ భాషలో తెలుసుకోండి."),e.currentTarget));

let wStep=1;
function rankCrops(){return CROPS.map(c=>({c,sc:scoreCrop(c)})).filter(x=>x.sc.total>=40).sort((a,b)=>b.sc.total-a.sc.total);}
function renderWizardCrops(){
  const el=$("#wCrops");if(!el)return;
  const list=rankCrops().slice(0,8);
  el.innerHTML=list.length?list.map(({c,sc})=>`<button type="button" class="wcrop" data-id="${c.id}"><span class="em" aria-hidden="true">${c.e}</span><span>${B(esc(c.n[0]),esc(c.n[1]))}</span><small>${sc.total}%</small></button>`).join(""):`<p class="empty">${B("No strong match. Try another season.","సరిపోయే పంట లేదు. వేరే సీజన్ ప్రయత్నించండి.")}</p>`;
}
function nameOf(arr,key){const f=arr.find(x=>String(x[0])===String(key));return f?f[1]:["",""];}
function renderWizardPlan(){
  const c=CROP[state.crop];if(!c)return;
  const d=DIST_BY[state.dist],se=nameOf(SEASONS,state.season),so=nameOf(SOILS,state.soil),wa=nameOf(WATERS,state.water);
  $("#wSummary").innerHTML=`<p style="font-size:1.3rem;font-weight:800;margin:6px 0">${c.e} ${B(esc(c.n[0]),esc(c.n[1]))}</p>
   <div class="chips">${d?`<span class="chip">📍 ${B(esc(d.n[0]),esc(d.n[1]))}</span>`:""}<span class="chip">${B(esc(se[0]),esc(se[1]))}</span><span class="chip">${B(esc(so[0]),esc(so[1]))}</span><span class="chip">${B(esc(wa[0]),esc(wa[1]))}</span><span class="chip">${B(`${c.days} days`,`${c.days} రోజులు`)}</span></div>`;
}
function showStep(n){
  wStep=n;[1,2,3].forEach(i=>{$("#wp"+i).hidden=i!==n;});
  $("#wSteps").querySelectorAll("button").forEach(b=>{const i=+b.dataset.s;b.classList.toggle("on",i===n);b.classList.toggle("done",i<n);});
  if(n===2)renderWizardCrops();if(n===3)renderWizardPlan();
}
$("#wSteps").addEventListener("click",e=>{const b=e.target.closest("button");if(b)showStep(+b.dataset.s);});
$("#wNext1").addEventListener("click",()=>showStep(2));
$("#wBack2").addEventListener("click",()=>showStep(1));
$("#wBack3").addEventListener("click",()=>showStep(2));
$("#wCrops").addEventListener("click",e=>{const b=e.target.closest(".wcrop");if(b){selectCrop(b.dataset.id);showStep(3);}});
$("#wAsk").addEventListener("click",()=>{
  const c=CROP[state.crop];if(!c)return;
  $("#chatInput").value=T(`How do I grow ${c.n[0]} organically in my area?`,`${c.n[1]} ను నా ప్రాంతంలో సేంద్రీయంగా ఎలా పండించాలి?`);
  $("#ask").scrollIntoView();setTimeout(()=>{try{$("#chatInput").focus({preventScroll:true});}catch(e){}},500);
});

let soilTimer=null,soilPlayed=false;
function soilUpdate(){
  const v=+$("#soilSlider").value,y=(v/100*5).toFixed(1);
  if(soil)soil.setT(v/100);
  $("#soilYear").innerHTML=B(`Year ${y} of 5`,`${y} వ సంవత్సరం / 5`);
}
function soilStop(){if(soilTimer){clearInterval(soilTimer);soilTimer=null;}$("#soilPlay").textContent="▶";}
function soilInit(){
  $("#soilSlider").addEventListener("input",()=>{soilStop();soilUpdate();});
  $("#soilPlay").addEventListener("click",()=>{
    if(soilTimer){soilStop();return;}
    const sl=$("#soilSlider");if(+sl.value>=100)sl.value=0;$("#soilPlay").textContent="❚❚";
    soilTimer=setInterval(()=>{sl.value=Math.min(100,+sl.value+1);soilUpdate();if(+sl.value>=100)soilStop();},70);
  });
  if(reduced)$("#soilSlider").value=100;
  soilUpdate();
  new IntersectionObserver(es=>{if(es[0].isIntersecting&&!soilPlayed){soilPlayed=true;if(!reduced)$("#soilPlay").click();}},{threshold:.5}).observe($("#soilStage"));
}

(function tabs(){
  const map={home:"home",start:"crop",advisor:"crop",plan:"plan",doctor:"doc",photo:"doc",ask:"ask"};
  const io=new IntersectionObserver(es=>{es.forEach(en=>{if(en.isIntersecting){const t=map[en.target.id]||"";document.querySelectorAll("#tabbar a").forEach(a=>a.classList.toggle("on",a.dataset.t===t));}});},{rootMargin:"-45% 0px -50% 0px"});
  ["home","start","why","advisor","plan","inputs","doctor","photo","diary","savings","ask"].forEach(id=>{const el=document.getElementById(id);if(el)io.observe(el);});
})();

/* ============ 3D field (three.js) ============ */
const fields=[]; let viewer=null, hero=null;
function makeField(canvas,opt){
  if(typeof THREE==="undefined")return null;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){return null;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  const scene=new THREE.Scene(), camera=new THREE.PerspectiveCamera(36,1,.1,120);
  const hemi=new THREE.HemisphereLight(0xffffff,0x8a7a5a,.9);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xfff0cf,1.15); sun.position.set(7,11,5); sun.castShadow=true; sun.shadow.mapSize.set(1024,1024);
  Object.assign(sun.shadow.camera,{left:-10,right:10,top:8,bottom:-8,near:1,far:35}); scene.add(sun);
  const island=new THREE.Group(); scene.add(island);
  const lam=c=>new THREE.MeshLambertMaterial({color:c});
  [[14,.6,10,0,0x4b3325],[13.6,.7,9.6,-.65,0x8b6b4b],[13,.6,9,-1.3,0xb99a6c],[11.2,.5,7.4,-1.85,0xcdb78a]].forEach(([w,h,d,y,c],i)=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lam(c)); m.position.y=y; if(i===0)m.receiveShadow=true; island.add(m);});
  const ROWS=8,COLS=16,N=ROWS*COLS;
  const ridgeGeo=new THREE.BoxGeometry(13.2,.2,.62),ridgeMat=lam(0x6a4a32);
  for(let r=0;r<ROWS;r++){const m=new THREE.Mesh(ridgeGeo,ridgeMat);m.position.set(0,.4,(r-3.5)*1.1);m.receiveShadow=true;island.add(m);}
  const stemGeo=new THREE.CylinderGeometry(.035,.05,1,5);stemGeo.translate(0,.5,0);
  const stems=new THREE.InstancedMesh(stemGeo,lam(0x4a7a35),N);
  const leaves=new THREE.InstancedMesh(new THREE.SphereGeometry(1,6,4),lam(0xffffff),N*5);
  const fruits=new THREE.InstancedMesh(new THREE.SphereGeometry(1,8,6),lam(0xffffff),N*3);
  [stems,leaves,fruits].forEach(m=>{m.castShadow=true;m.frustumCulled=false;island.add(m);});
  const px=[],pz=[],ph=[],sz=[],dl=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){px.push((c-7.5)*.8);pz.push((r-3.5)*1.1);ph.push(Math.random()*6.28);sz.push(.88+Math.random()*.25);dl.push(Math.random()*.2);}
  const dummy=new THREE.Object3D(); dummy.rotation.order="YZX";
  const col=new THREE.Color(),cRaw=new THREE.Color(),cRipe=new THREE.Color();
  let cfg=null,gCur=0,gTgt=0,lastCol=-1,rotY=0.5,drag=false,lastX=0,mx=.5;
  function setCrop(c){
    cfg=c; cRaw.set(c.raw); cRipe.set(c.ripe);
    for(let i=0;i<N*5;i++){col.set(c.leaf).offsetHSL(0,0,(Math.random()-.5)*.08);leaves.setColorAt(i,col);}
    leaves.instanceColor.needsUpdate=true; lastCol=-1; dirty=true;
  }
  let dirty=true;
  function update(g,t){
    const grass=cfg.form==="grass",H0=(grass?1.5:1.05)*cfg.h,doCol=Math.abs(g-lastCol)>.008;
    for(let i=0;i<N;i++){
      const gi=clamp(g*1.2-dl[i]),e=gi*gi*(3-2*gi),H=H0*sz[i]*e,vis=H>.01?1:.0001,x=px[i],z=pz[i],p=ph[i];
      dummy.rotation.set(0,0,0);dummy.position.set(x,.5,z);dummy.scale.set(vis,Math.max(H,.0001),vis);dummy.updateMatrix();stems.setMatrixAt(i,dummy.matrix);
      for(let k=0;k<5;k++){
        const idx=i*5+k, f=.2+k*.17, lg=clamp((e-f*.6)/.35), sw=Math.sin(t*1.6+p+k)*.06*e, a=k*2.4+p;
        if(!grass){
          const L=.36*sz[i]*lg*(.8+cfg.h*.3);
          dummy.position.set(x+Math.cos(a)*L*.9,.5+H*f,z-Math.sin(a)*L*.9);dummy.rotation.set(0,a,.35+sw);dummy.scale.set(Math.max(L,.0001),Math.max(.045*lg,.0001),Math.max(L*.55,.0001));
        }else{
          const A=k*1.26+p, ang=.22+.1*k+sw, len=H*.8*clamp((e-.04*k)/.5), cl=len/2;
          dummy.position.set(x+Math.sin(ang)*Math.cos(A)*cl,.5+Math.cos(ang)*cl,z-Math.sin(ang)*Math.sin(A)*cl);dummy.rotation.set(0,A,-ang);dummy.scale.set(.045*(len>0?1:0)+.0001,Math.max(cl,.0001),.022);
        }
        dummy.updateMatrix();leaves.setMatrixAt(idx,dummy.matrix);
      }
      const fg=clamp((gi-.55)/.4), ripeT=clamp((gi-.7)/.3);
      for(let m=0;m<3;m++){
        const idx=i*3+m; let s=0;
        if(!grass){const a=m*2.1+p, y=.5+H*(.32+m*.15), r=.14*sz[i]; s=.075*fg*cfg.fs;
          dummy.position.set(x+Math.cos(a)*r,y,z-Math.sin(a)*r);dummy.rotation.set(0,0,0);dummy.scale.set(s+.0001,s+.0001,s+.0001);}
        else{ if(m===0){dummy.position.set(x+Math.sin(t*1.5+p)*.03*e,.5+H+.04,z);dummy.rotation.set(0,0,0);dummy.scale.set(.07*fg*cfg.fs+.0001,.22*fg*cfg.fs+.0001,.07*fg*cfg.fs+.0001);}
          else{dummy.position.set(x,.5,z);dummy.scale.set(.0001,.0001,.0001);dummy.rotation.set(0,0,0);} }
        dummy.updateMatrix();fruits.setMatrixAt(idx,dummy.matrix);
        if(doCol){col.copy(cRaw).lerp(cRipe,ripeT);fruits.setColorAt(idx,col);}
      }
    }
    stems.instanceMatrix.needsUpdate=leaves.instanceMatrix.needsUpdate=fruits.instanceMatrix.needsUpdate=true;
    if(doCol){fruits.instanceColor.needsUpdate=true;lastCol=g;}
  }
  /* scenery */
  let clouds=null,pollen=null,rain=null,rainPos=null,cm=null;
  if(opt.scenery){
    clouds=new THREE.Group(); cm=new THREE.MeshLambertMaterial({color:0xffffff,transparent:true,opacity:.92});
    for(let c=0;c<4;c++){const g=new THREE.Group();for(let j=0;j<5;j++){const s=new THREE.Mesh(new THREE.SphereGeometry(.5+Math.random()*.5,10,8),cm);s.position.set(j*.7-1.4,Math.random()*.3,Math.random()*.4);s.scale.y=.7;g.add(s);}
      g.position.set(-14+c*8,5.2+Math.random()*1.2,-4-Math.random()*3);g.userData.sp=.25+Math.random()*.25;clouds.add(g);}
    scene.add(clouds);
    const n=140,pos=new Float32Array(n*3);for(let i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*15;pos[i*3+1]=.8+Math.random()*4;pos[i*3+2]=(Math.random()-.5)*11;}
    const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
    pollen=new THREE.Points(pg,new THREE.PointsMaterial({color:0xffe27a,size:.07,transparent:true,opacity:.85}));scene.add(pollen);
    const RN=450;rainPos=new Float32Array(RN*3);for(let i=0;i<RN;i++){rainPos[i*3]=(Math.random()-.5)*16;rainPos[i*3+1]=Math.random()*9;rainPos[i*3+2]=(Math.random()-.5)*12;}
    const rg=new THREE.BufferGeometry();rg.setAttribute("position",new THREE.BufferAttribute(rainPos,3));
    rain=new THREE.Points(rg,new THREE.PointsMaterial({color:0xd6ecff,size:.1,transparent:true,opacity:.8}));rain.visible=false;scene.add(rain);
  }
  const MOODS={K:{sc:0xb8c8d8,si:.55,hi:.95,sp:[5,9,5],cloud:0x8d9aa4,co:.95},R:{sc:0xffc27a,si:1.25,hi:.75,sp:[11,3.8,4],cloud:0xffd3a1,co:.9},Z:{sc:0xfff6dd,si:1.4,hi:1,sp:[1.5,14,2],cloud:0xffffff,co:.5}};
  function setMood(m){
    const c=MOODS[m]||MOODS.R;sun.color.set(c.sc);sun.intensity=c.si;hemi.intensity=c.hi;sun.position.set(c.sp[0],c.sp[1],c.sp[2]);
    if(cm){cm.color.set(c.cloud);cm.opacity=c.co;}
    if(clouds)clouds.children.forEach((g,i)=>{g.visible=m==="Z"?i<2:true;});
    if(rain)rain.visible=m==="K";
    if(pollen){pollen.material.color.set(m==="Z"?0xe8c98a:0xffe27a);pollen.visible=m!=="K";}
    dirty=true;
  }
  function resize(){
    const w=canvas.clientWidth||300,h=canvas.clientHeight||300;renderer.setSize(w,h,false);camera.aspect=w/h;
    const d=Math.max(21,27.5/camera.aspect);camera.position.set(0,d*.44,d*.9);camera.lookAt(0,-.2,0);camera.updateProjectionMatrix();dirty=true;
  }
  new ResizeObserver(resize).observe(canvas);
  if(opt.interactive){
    canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId);canvas.style.cursor="grabbing";});
    canvas.addEventListener("pointermove",e=>{if(drag){rotY+=(e.clientX-lastX)*.01;lastX=e.clientX;dirty=true;}});
    const up=()=>{drag=false;canvas.style.cursor="grab";};canvas.addEventListener("pointerup",up);canvas.addEventListener("pointercancel",up);
  }
  if(opt.parallax)window.addEventListener("pointermove",e=>{mx=e.clientX/window.innerWidth;dirty=true;});
  const api={visible:true,setCrop,setMood,setTarget(g,snap){gTgt=clamp(g);if(snap||reduced)gCur=gTgt;dirty=true;},
    tick(t,dt){
      if(!cfg)return;
      if(opt.auto){const r=opt.auto(t);if(r.crop&&r.crop!==cfg.id)setCrop(CROP[r.crop]);gTgt=r.g;gCur=r.g;}
      else gCur+=(gTgt-gCur)*Math.min(1,dt*7);
      if(!reduced||dirty){
        if(!drag&&!reduced)rotY+=dt*(opt.auto?.12:.18);
        island.rotation.y=rotY+(opt.parallax?(mx-.5)*.5:0);
        update(gCur,t);
        if(clouds)clouds.children.forEach(c=>{c.position.x+=c.userData.sp*dt;if(c.position.x>16)c.position.x=-16;});
        if(pollen&&!reduced)pollen.rotation.y=t*.03;
        if(rain&&rain.visible&&!reduced){for(let i=0;i<rainPos.length;i+=3){rainPos[i+1]-=dt*(10+(i%7));if(rainPos[i+1]<.4)rainPos[i+1]=8+Math.random()*2;}rain.geometry.attributes.position.needsUpdate=true;}
        renderer.render(scene,camera);dirty=false;
      }
    },get g(){return gCur;},get cfg(){return cfg;}};
  fields.push(api);
  new IntersectionObserver(es=>{api.visible=es[0].isIntersecting;dirty=true;}).observe(canvas);
  resize(); return api;
}
function makeSoil(canvas){
  if(typeof THREE==="undefined")return null;
  let renderer;try{renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true});}catch(e){return null;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,100);
  scene.add(new THREE.HemisphereLight(0xffffff,0x8a7a5a,1));
  const dl=new THREE.DirectionalLight(0xfff0cf,.8);dl.position.set(3,8,10);scene.add(dl);
  const W=5,DP=3,H1=1.3,H2=1.4,H3=1,SX=3.1,PX=[-1.5,0,1.5];
  const lam=c=>new THREE.MeshLambertMaterial({color:c});
  const unit=new THREE.CylinderGeometry(.03,.02,1,5);unit.translate(0,-.5,0);
  const sph=new THREE.SphereGeometry(1,8,6);
  const rootMat=lam(0xf3e6c4),wormMat=lam(0xe39a9a),leafMat=lam(0x5aa045),stemMat=lam(0x4a7a35);
  const cT0=new THREE.Color(0x7a5a3c),cOrg=new THREE.Color(0x35200f),cChem=new THREE.Color(0xb39a72),cS0=new THREE.Color(0x9a7a56),cSO=new THREE.Color(0x7a5a3a),cSC=new THREE.Color(0xb59d78);
  function side(x,organic){
    const g=new THREE.Group();g.position.x=x;scene.add(g);
    const top=new THREE.Mesh(new THREE.BoxGeometry(W,H1,DP),lam(0x7a5a3c));top.position.y=-H1/2;g.add(top);
    const sub=new THREE.Mesh(new THREE.BoxGeometry(W,H2,DP),lam(0x9a7a56));sub.position.y=-H1-H2/2;g.add(sub);
    const base=new THREE.Mesh(new THREE.BoxGeometry(W,H3,DP),lam(0xb8a07a));base.position.y=-H1-H2-H3/2;g.add(base);
    const crust=new THREE.Mesh(new THREE.BoxGeometry(W,.07,DP),new THREE.MeshLambertMaterial({color:0xefe8da,transparent:true,opacity:0}));crust.position.y=.035;g.add(crust);
    PX.forEach(px=>{
      const st=new THREE.Mesh(new THREE.CylinderGeometry(.03,.04,.55,5),stemMat);st.position.set(px,.3,1.2);g.add(st);
      [-1,1].forEach(sg=>{const lf=new THREE.Mesh(sph,leafMat);lf.position.set(px+sg*.18,.5,1.2);lf.scale.set(.2,.05,.1);lf.rotation.z=sg*.5;g.add(lf);});
    });
    const mains=[],lats=[];
    PX.forEach(px=>{
      const m=new THREE.Mesh(unit,rootMat);m.position.set(px,0,1.52);g.add(m);mains.push(m);
      for(let k=0;k<6;k++){const d=.3+.33*k,l=new THREE.Mesh(unit,rootMat);l.position.set(px,-d,1.52);l.rotation.z=(k%2?1:-1)*(.9+.1*(k%3));g.add(l);lats.push({m:l,d});}
    });
    const worms=[];
    for(let w=0;w<10;w++){const segs=[];for(let i=0;i<8;i++){const m=new THREE.Mesh(sph,wormMat);g.add(m);segs.push(m);}
      worms.push({segs,cx:-2+((w*37)%40)/10,cy:-.45-((w*53)%19)/10,ph:w*1.7});}
    const N=160,pos=new Float32Array(N*3);
    for(let i=0;i<N;i++){pos[i*3]=(Math.random()-.5)*(W-.3);pos[i*3+1]=-.1-Math.random()*(H1+H2-.3);pos[i*3+2]=1.53;}
    const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
    const pts=new THREE.Points(pg,new THREE.PointsMaterial({color:organic?0x1b0f08:0xf4efe2,size:.075,transparent:true,opacity:.9}));g.add(pts);
    return function(t,time){
      if(organic){top.material.color.copy(cT0).lerp(cOrg,t);sub.material.color.copy(cS0).lerp(cSO,t*.6);}
      else{top.material.color.copy(cT0).lerp(cChem,t);sub.material.color.copy(cS0).lerp(cSC,t*.5);crust.material.opacity=clamp((t-.15)/.6)*.9;}
      const mainLen=organic?1.1+1.6*t:1.1-.15*t,bush=organic?.45+.55*t:.45-.12*t;
      mains.forEach(m=>m.scale.set(1,mainLen,1));
      lats.forEach(o=>{const v=clamp((mainLen-o.d)/.3);o.m.scale.set(1,Math.max(v*bush,.0001),1);});
      const cnt=organic?4+6.5*t:4-3.6*t;
      worms.forEach((w,wi)=>{const sc=clamp(cnt-wi);w.segs.forEach((m,i)=>{
        m.position.set(w.cx+(i-3.5)*.12,w.cy+Math.sin(time*2.2+w.ph+i*.8)*.06,1.52);const r=.075*sc+.0001;m.scale.set(r,r,r);});});
      pts.geometry.setDrawRange(0,Math.round(organic?20+140*t:10+100*t));
    };
  }
  const upChem=side(-SX,false),upOrg=side(SX,true);
  let tCur=0,tTgt=0,dirty=true;
  function resize(){
    const w=canvas.clientWidth||300,h=canvas.clientHeight||300;renderer.setSize(w,h,false);camera.aspect=w/h;
    const d=Math.max(14,17.5/camera.aspect);camera.position.set(0,2.2,d);camera.lookAt(0,-1.5,0);camera.updateProjectionMatrix();dirty=true;
  }
  new ResizeObserver(resize).observe(canvas);
  const api={visible:true,setT(v){tTgt=clamp(v);if(reduced)tCur=tTgt;dirty=true;},
    tick(time,dt){
      if(!reduced)tCur+=(tTgt-tCur)*Math.min(1,dt*6);
      if(!reduced||dirty){
        upChem(tCur,time);upOrg(tCur,time);
        camera.position.x=reduced?0:Math.sin(time*.35)*.6;camera.lookAt(0,-1.5,0);
        renderer.render(scene,camera);dirty=false;
      }
    }};
  fields.push(api);
  new IntersectionObserver(es=>{api.visible=es[0].isIntersecting;dirty=true;}).observe(canvas);
  resize();return api;
}
let tPrev=0;
function loop(ms){
  const t=ms/1000,dt=Math.min(.05,t-tPrev||.016);tPrev=t;
  if(!document.hidden)fields.forEach(f=>f.visible&&f.tick(t,dt));
  requestAnimationFrame(loop);
}

/* hero cycle: seed to harvest, then replant with the next crop */
const HERO_CROPS=["tomato","paddy","chilli","maize","cotton","brinjal"];
function heroAuto(t){
  const CYC=22, idx=Math.floor(t/CYC), p=(t%CYC)/CYC;
  const g=reduced?.85:(p<.86?p/.86:1-(p-.86)/.14);
  const L=DIST_BY[state.dist]?DIST_BY[state.dist].crops:HERO_CROPS;return {crop:L[idx%L.length],g:clamp(g)};
}

/* ============ init ============ */
function init(){
  refreshSegs();
  renderResults();renderRecipes();renderSymp();renderSavings();greet();fillGeo();
  ["selState","wState"].forEach(id=>$("#"+id).addEventListener("change",e=>{state.st=e.target.value;state.dist="";fillGeo();applyDist();}));
  ["selDist","wDist"].forEach(id=>$("#"+id).addEventListener("change",e=>{state.dist=e.target.value;applyDist();}));
  $("#localCrops").addEventListener("click",e=>{const b=e.target.closest("button");if(b){selectCrop(b.dataset.id);$("#plan").scrollIntoView();}});
  $("#allCrops").addEventListener("change",e=>{if(e.target.value){selectCrop(e.target.value);$("#plan").scrollIntoView();}});
  $("#sowDate").value=ymd(state.sow).replace(/(\d{4})(\d{2})(\d{2})/,"$1-$2-$3");
  const hc=$("#heroCanvas");
  hero=makeField(hc,{scenery:true,parallax:true,auto:heroAuto});
  viewer=makeField($("#viewCanvas"),{interactive:true});
  if(!hero){$("#heroStage").innerHTML=`<div class="nowebgl" style="display:block">🌱 ${B("3D view needs WebGL, which this browser does not support.","3D వీక్షణకు WebGL కావాలి, ఈ బ్రౌజర్‌లో లేదు.")}</div>`;}
  if(hero)hero.setCrop(CROP[HERO_CROPS[0]]);
  updateMood();
  soil=makeSoil($("#soilCanvas"));
  if(!soil){$("#soilStage").innerHTML=`<div class="nowebgl" style="display:block">🌱 ${B("3D view needs WebGL, which this browser does not support.","3D వీక్షణకు WebGL కావాలి, ఈ బ్రౌజర్‌లో లేదు.")}</div>`;}
  soilInit();
  showStep(1);
  selectCrop(state.season==="R"?"bengalgram":"tomato");
  setInterval(()=>{if(!hero||!hero.cfg)return;const c=hero.cfg,d=Math.round(hero.g*c.days);
    const dd=DIST_BY[state.dist],M=MOODTXT[state.season]||MOODTXT.R;
    $("#heroCap").innerHTML=`${M[0]} ${B(esc(M[1]),esc(M[2]))} · ${c.e} ${B(`${dd?esc(dd.n[0])+" · ":""}${esc(c.n[0])} · day ${d} of ${c.days}`,`${dd?esc(dd.n[1])+" · ":""}${esc(c.n[1])} · ${d}వ రోజు / ${c.days}`)}`;},400);
  document.querySelectorAll(".langseg button").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.l)));
  setLang("te");
  requestAnimationFrame(loop);
}
init();
