// Ověřeno 6. 10. 2026. U cen má přednost původní web před katalogy.
export const gallery=[
 ['chata-leto','Chata v létě','chata','Letní pohled na Chatu Mariánka s červenou střechou'],
 ['chata-zima','Zima na Mariánské Hoře','chata','Chata Mariánka obklopená sněhem'],
 ['chata-prijezd','Příjezd k chatě','chata','Příjezdová cesta a přední část chaty'],
 ['chata-zahrada','Chata ze zahrady','chata','Roubená část chaty a okolní zeleň'],
 ['pokoj-drevo','Pokoj s dřevěným obložením','pokoje','Lůžka, palanda a stůl v dřevem obloženém pokoji'],
 ['pokoj-rodinny','Pokoj s posezením','pokoje','Ubytovací pokoj s postelemi a stolem u okna'],
 ['pokoj-palandy','Lůžka a palanda','pokoje','Dřevěná palanda a samostatné lůžko'],
 ['pokoj-dvouluzko','Detail lůžek','pokoje','Dvě vedle sebe umístěná lůžka s povlečením'],
 ['koupelna','Vlastní sociální zařízení','pokoje','Umyvadlo, toaleta a topný žebřík v koupelně'],
 ['spolecenska-mistnost','Společenská místnost','zazemi','Jídelna připravená na společné setkání'],
 ['jidelna','Jídelna','zazemi','Stoly a židle v prostorné jídelně'],
 ['oslavy','Pro společné oslavy','zazemi','Slavnostně prostřená jídelna s barem'],
 ['detsky-koutek','Dětský koutek','deti','Police s hračkami v dětském koutku'],
 ['detske-postylky','Dětské postýlky','deti','Dětské cestovní a dřevěná postýlka'],
 ['detske-zidlicky','Pro nejmenší hosty','deti','Dětské jídelní židličky a houpačka'],
 ['fotbalek','Stolní fotbálek','zazemi','Herní stůl na stolní fotbal'],
 ['kulecnik','Kulečník','zazemi','Malý kulečníkový stůl s koulemi a tágy'],
 ['ohniste','Večery u ohniště','venku','Ohniště a lavičky z kulatiny za chatou'],
 ['les','Les za chalupou','venku','Lesní okraj a travnatá plocha v okolí chaty'],
 ['okolni-louka','Prostor kolem chaty','venku','Chata Mariánka v krajině Mariánské Hory']
];
export const places=[
 {id:'svetly-vrch',name:'Rozhledna Světlý vrch',lat:50.763794,lon:15.292592,seasons:['leto'],type:'Pěší výlet · výhledy',description:'Krátký výlet nad Albrechtice zakončený výhledem z rozhledny ve tvaru ptačího hnízda. Na cestě od parkoviště U Hany potěší děti dřevěné sochy lesních duchů.',note:'Pro rodiny zvyklé na chůzi do kopce. Závěr vede lesní stezkou.',url:'https://www.albrechtice-jh.cz/turista/aktivity-leto-1/rozhledna-svetly-vrch/',coordinateSource:'https://www.visitliberec.eu/en/vyhledavani/?cat=zajimavosti_a_cile&detail=28270'},
 {id:'prehrada',name:'Protržená přehrada',lat:50.8012481,lon:15.2766089,seasons:['leto'],type:'Turistika · historie',description:'Lesní cesta vás dovede ke zbytkům hráze na Bílé Desné. Naučná stezka připomíná příběh přehrady a události roku 1916.',note:'Klidný cíl na delší procházku. Vezměte si pohodlné boty.',url:'https://www.jizerky.cz/cile/protrzena-prehrada-desna'},
 {id:'boudy',name:'Mariánskohorské boudy',lat:50.7975158,lon:15.2675358,seasons:['leto','zima'],type:'Turistika · cyklistika',winterType:'Běžky · Jizerská magistrála',description:'Horská osada na loukách mezi lesy si zachovala svůj osobitý charakter. Zastavte se při pěším výletu nebo vyjížďce po značených cestách.',winterDescription:'Vyrazte z Mariánské Hory po trasách Jizerské magistrály směrem k horské osadě. Další okruh si zvolte podle kondice a aktuálně upravených stop.',note:'Trasy v chráněné krajině; držte se značených cest.',winterNote:'Úpravu a sněhové podmínky si ověřte u Jizerské o.p.s.',url:'https://www.jizerky.cz/cile/marianskohorske-boudy',winterUrl:'https://www.jizerskaops.cz/magistrala/nastupni-mista/'},
 {id:'rozhledna-spicak',name:'Rozhledna Tanvaldský Špičák',lat:50.7515472,lon:15.28245,seasons:['leto'],type:'Výhledy · pěší výlet',description:'Vydejte se na výrazný vrchol nad Albrechticemi. Rozhledna nabízí další pohled na Jizerské hory; v letní sezóně lze výlet spojit s jízdou lanovkou podle jejího provozu.',note:'Provoz rozhledny i lanovky si před výletem ověřte.',url:'https://www.tanvaldskyspicak.cz/',coordinateSource:'https://tanvaldsky-spicak.ceskehory.cz/'},
 {id:'jizerka',name:'Osada Jizerka',lat:50.8182481,lon:15.3456461,seasons:['leto','zima'],type:'Turistika · horská osada',winterType:'Běžky · zimní krajina',description:'Chalupy roztroušené po horské louce, potok a okolní lesy. Jizerka je příjemným cílem celodenního výletu i zastávkou na delší cyklotrase.',winterDescription:'Zasněžená Jizerka má své zvláštní kouzlo. Pro běžkařský výlet využijte nástupní místo Mořina a zvolte trasu podle aktuální úpravy.',note:'V chráněném území se pohybujte po vyznačených cestách.',winterNote:'Na mapě je střed osady; parkování a nástup do stop jsou na Mořině.',url:'https://www.jizerky.cz/cile/osada-jizerka',winterUrl:'https://www.jizerskaops.cz/magistrala/nastupni-mista/'},
 {id:'ski-spicak',name:'Ski areál Tanvaldský Špičák',lat:50.7598358,lon:15.2812942,seasons:['zima'],type:'Sjezdové lyžování · rodiny',description:'Sjezdovky pro první obloučky i zkušené lyžaře. V Albrechticích je k dispozici také lyžařská škola a zázemí pro děti.',note:'Podle původního webu chaty přibližně 2,5 km; bod mapy označuje část areálu Špičák II.',url:'https://www.skijizerky.cz/cz/zima/skiarena/skiareal-tanvaldsky-spicak/o-skiarealu-tanvaldsky-spicak',coordinateSource:'https://www.jizerskehory.cz/lyzarska-strediska/ski-areal-tanvaldsky-spicak/'},
 {id:'severak',name:'Ski areál Severák',lat:50.7772,lon:15.1857,seasons:['zima'],type:'Lyžování · děti a začátečníci',description:'Mírnější svahy v Hraběticích jsou dobrou volbou pro rodiny a pro ty, kteří s lyžováním začínají. Lyžařská škola pomůže s prvními jízdami.',note:'Před cestou ověřte provoz vleků a dostupnost výuky.',url:'https://www.skijizerky.cz/cz/zima/skiarena/skiareal-severak',coordinateSource:'https://skiarena.cz/jizerske/severak/stredisko'},
 {id:'bedrichov',name:'Bedřichov – lyžařský stadion',lat:50.7957025,lon:15.1438294,seasons:['zima'],type:'Běžky · výchozí bod',description:'Známý výchozí bod pro běžkařské výlety do Jizerských hor. Nabízí možnost vybrat si kratší projížďku i delší trasu po magistrále.',note:'Délku výletu přizpůsobte počasí, kondici a úpravě stop.',url:'https://www.jizerskaops.cz/magistrala/nastupni-mista/',coordinateSource:'https://behejlesy.cz/clanky/187-nejdulezitejsi-info-pred-startem'}
];
export function distance(place){const rad=x=>x*Math.PI/180;const a=rad(50.768718),b=rad(place.lat),dl=rad(place.lon-15.292308),dp=b-a;return +(6371*2*Math.atan2(Math.sqrt(Math.sin(dp/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(dl/2)**2),Math.sqrt(1-(Math.sin(dp/2)**2+Math.cos(a)*Math.cos(b)*Math.sin(dl/2)**2)))).toFixed(1);}
