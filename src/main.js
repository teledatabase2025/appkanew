const VIDEO_URL = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
const GOOGLE_URL = 'https://www.google.com';

const normalize = (value) =>
  value
    .toString()
    .trim()
    .toLocaleLowerCase('cs-CZ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[„“”]/g, '"')
    .replace(/\s+/g, ' ');

const oneOf = (...answers) => (value) => answers.map(normalize).includes(normalize(value));
const exactlySet = (answers) => (values) => {
  const expected = answers.map(normalize).sort();
  const actual = values.map(normalize).filter(Boolean).sort();
  return expected.length === actual.length && expected.every((answer, index) => answer === actual[index]);
};
const requiredSet = (answers) => (values) => {
  const expected = answers.map(normalize).sort();
  const actual = values.map(normalize).filter(Boolean).sort();
  return expected.length === actual.length && expected.every((answer, index) => answer === actual[index]);
};

const HAVELKA = ['Tomáš Havelka', 'Tomáše Havelku', 'Tomášovi Havelkovi', 'Tomáši Havelkovi'];
const FILIP = ['Filip Procházka', 'Filipa Procházku', 'Filipovi Procházkovi', 'Filipu Procházkovi'];

const slides = [
  {
    kind: 'intro',
    eyebrow: 'Interní systém O.R.I.O.N.',
    title: 'Operativní Rozhraní Interního Odboru Nálezů',
    body: [
      'Interní vyšetřovací systém s přístupem pouze pro autorizované vyšetřovatele.',
      'Režim: Detektiv',
      'Případ: 2254578/2026 (interní označení: ŠEPOTY STROMŮ)',
      'Stav: Čeká se na spuštění',
      'Systém aktivní',
    ],
    videoLabel: 'Úvodní video k případu',
    button: 'Zahájit vyšetřování',
  },
  { kind: 'video', file: '1. spis', title: 'Úvodní video ke kapitole I.', button: 'Pokračovat k výslechu' },
  {
    kind: 'single', file: '1. spis',
    prompt: 'Jakou nesrovnalost jsme ve výpovědích přehlédli?',
    options: [
      'Lesník Král tvrdil, že volal z mýtiny, ale přitom se nacházel v Podlesí.',
      'Lesník Král tvrdil, že se opil v hospodě a byl tam minimálně do jedenácti, což není pravda.',
      'Dvořákovi nemohli jít spát tak, jak tvrdí, protože měli mít ještě otevřenou hospodu.',
      'Lesník Král si nemohl chodit pro závadnou vodu z Černého potoka, protože ho před jejími škodlivými účinky Jakub Dvořák varoval.',
    ], correct: [1],
    hints: ['Podívej se na výslech lesníka Krále i manželů Dvořákových.', 'Odpověď a) nemůže být správná. Přesně tohle totiž bylo u výslechu lesníku Královi vyčteno, takže to nikdo z našich lidí určitě neopomněl.', 'Odpověď d) taky není správná. Jakub Dvořák sice lesníka Krále před škodlivými účinky vody z Černého potoka varoval, lesník Král si tam ale stejně pro vodu chodil. To víme z deníku Jakuba Dvořáka. V tomto tedy lesník určitě nelhal.', 'Správně není ani odpověď c). Dvořákovi sice ještě měli mít otevřenou hospodu, ale sami uvedli, že toho dne všichni její návštěvníci odešli dřív, a tak nemělo smysl ji nechávat otevřenou.', 'Správně je možnost b). Lesník Král tvrdil, že se opil v hospodě a byl tam minimálně do jedenácti. Přitom ve výpovědi manželů Dvořákových stojí, že lesník odešel neobvykle brzo. Takže zabít Jakuba Dvořáka mohl klidně stihnout.']
  },
  { kind: 'textMany', file: '1. spis', prompt: 'Jaký je význam tří černobílých symbolů v deníku Jakuba Dvořáka?', fields: ['Symbol', 'Symbol', 'Symbol'], validate: exactlySet(['ROD','ŘÁD','OSUD']), hints: ['První symbol odkazuje na stranu 127 v deníku. Druhý symbol odkazuje na stranu 126 a srovnává ji se stranou 103. Zkus to porovnat. A třetí symbol podle mě taky odkazuje na strany v deníku.', 'K prvnímu symbolu. Dvořák zřejmě na některou mluvnickou kategorii zapomněl, nemyslíš?', 'U druhého symbolu jsou ty písmena VTSVVMMA na straně 103 prvními písmeny z každého řádku druhého odstavce. Nepoužil něco podobného?', 'Třetí symbol? Není to náhodou označení strany, řádku, slova a písmena?', 'Čtyři mluvnické kategorie, které se určují u podstatných jmen jsou pád, číslo, rod a vzor. To nám dost pomůže. Na straně 126 první písmena básně také dávají dohromady slovo a třetí symbol už máš určitě rozluštěný.', 'Správné odpovědi jsou ROD, ŘÁD a OSUD.'] },
  { kind: 'textOne', file: '1. spis', prompt: 'Koho kontaktujeme za účelem pomoci s odhalením významu symbolů nalezených na místě činu na oltáři a na stromě v blízkosti oltáře? Napiš jeho jméno.', validate: oneOf('Historik','historika','Tomáš Havelka','Tomáše Havelku'), hints: ['Zkus si ještě jednou a pozorněji prohlédnout Domažlický list Plzeňského kurýra.', 'Zaměř se na druhou stranu novin a článek, který pojednává o vzácné návštěvě.', 'Nemohl by nám s tím náhodou pomoci světově uznávaný historik Tomáš Havelka, který je zrovna v Česku?'] },
  { kind: 'video', file: '1. spis', title: 'Závěrečné video 1. spisu', button: 'Otevřít 2. spis' },
  { kind: 'video', file: '2. spis', title: 'Úvodní video 2. spisu', notice: '2. spis zatím neotevírej. Shlédni úvodní video a pak si poslechni vzkaz historika Tomáše Havelky.', button: 'Poslechnout vzkaz' },
  { kind: 'audio', file: '2. spis', title: 'Vzkaz historika Tomáše Havelky', transcript: 'Nyní otevři spis a pokračuj.', button: 'Otevřít databázi' },
  { kind: 'textOne', file: '2. spis', prompt: 'Jaké má Jakub Dvořák heslo do své emailové schránky?', validate: oneOf('Veles'), hints: ['Všimni si v té tabulce abeced v Dvořákově souboru různých barev. Neviděli jsme je už někde?', 'Podívej se do deníku Jakuba Dvořáka. Jsou tam nakreslené symboly a každý je jinou barvou. Nemůže to souviset?', 'Ty šipky vedle symbolů v deníku Jakuba Dvořáka mají jistě určovat směr, jakým se v abecedách máme od konkrétního písmene pohybovat.', 'Nemůže to být náhodou Veles?'] },
  { kind: 'single', file: '2. spis', prompt: 'Na jakém dokumentu je něco zvláštního a co to je?', options: ['Výslech Filipa Procházky. Podle konverzace ze sociálních sítí jasně vyplynulo, že se vůbec nesešli.', 'Facebookový příspěvek Jakuba Dvořáka. Filip Procházka odhalil Jakubova vraha.', 'Wikipedie historika a zvláštní poznámka v závorce odkazující na Peruna na nevhodném místě.'], correct: [2], hints: ['Projdi si znovu ty dokumenty, ať víš, o čem se tu přesně bavíme.', 'Z konverzace Filipa Procházky a Jakuba Dvořáka určitě nevyplynulo, že se nesešli. Filip Procházka to navíc při výslechu objasnil.', 'To, že je farář vrahem, zdaleka není jisté.', 'Ta poznámka Perun je ale hodně zvláštní co?'] },
  { kind: 'textOne', file: '2. spis', prompt: 'Co znamená Mstitelův tajný vzkaz?', validate: oneOf('Je čas!'), hints: ['Podívej se na facebookový příspěvek Jakuba Dvořáka, tam ten vzkaz najdeš.', 'Při bližším prozkoumání mi všechny ty tečky a čárky připomínají Morseův kód. Zkus ho použít, jestli se z toho nedá něco vyvodit.', 'Byla to skutečně zpráva zašifrovaná Morseovou abecedou. Stálo v ní Je čas! Nezapomeň na vykřičník.'] },
  { kind: 'video', file: '2. spis', title: 'Závěrečné video 2. spisu', button: 'Otevřít 3. spis' },
  { kind: 'video', file: '3. spis', title: 'Úvodní video 3. spisu', notice: '3. spis zatím neotevírej. Shlédni úvodní video a pak si poslechni vzkaz historika Tomáše Havelky.', button: 'Poslechnout vzkaz' },
  { kind: 'audio', file: '3. spis', title: 'Vzkaz historika Tomáše Havelky', transcript: 'Nyní otevři spis a pokračuj.', button: 'Pokračovat' },
  { kind: 'single', file: '3. spis', prompt: 'Ty nápisy v kostele na zdech musejí být z Bible. Ověřil sis, co říkají? V čem se shodují?', options: ['Připomínají, že utrpení je zkouškou víry spravedlivých.', 'Varují, že pravda bude odhalena a vina nezůstane bez následků.', 'Předpovídají příchod apokalyptických pohrom.', 'Zdůrazňují milosrdenství, které převažuje nad trestem.'], correct: [1], hints: ['Verše nemluví o náhodném neštěstí. Vždy existuje příčina a odpověď na ni.', 'Texty spojuje myšlenka, že nic nezůstane skryto a žádný čin nezůstane bez odezvy. To, co bylo zaseto, musí být sklizeno.', 'Utrpení zde není jen osobní. Důsledky mohou přesahovat samotného viníka, vina se vrací.', 'Správná odpověď je b).'] },
  { kind: 'textOne', file: '3. spis', prompt: 'Jaký tajný vzkaz zanechal neznámý pachatel na náhrobní desce v kostele?', validate: oneOf('smrt'), hints: ['Zkus se pořádně podívat na tu náhrobní desku. Je tam něco, co tam nepatří.', 'Kamínky na desce jsou systematicky rozmístěné a společně tvoří jeden celek.', 'Když budeš číst písmena, pod kterými jsou kamínky v pořadí, v jakém se čte text, získáš slovo SMRT.'] },
  { kind: 'textOne', file: '3. spis', prompt: 'Jakým heslem se dostaneme do přílohy Dvořákova emailu?', validate: oneOf('MORANA'), hints: ['Dvořák v emailu píše, že význam BSIUAP pochopí pouze ten, kdo zná KubaDvorak87. Neviděli jsme už tuto formulaci někde?', 'KubaDvorak87 vytvořil českou verzi wikipedie o Tomáši Havelkovi. A zřejmě si tam něco ukryl. Něco nám už předtím přišlo podezřelé. A všechno to nějak souvisí s Vigenèrovou šifrou.', 'Vigenèrova šifra funguje podobně jako Caesarova šifra. Tedy vezmu slovo, které chci zašifrovat, vytvořím si klíčové slovo, podle kterého budu šifrovat a pak vytvořím šifru. Při dekódování postupujeme opačně.', 'Když kódujeme pomocí Vigenèra, posouváme písmena dopředu. My ale dekódujeme, takže posouváme písmena dozadu.', 'Tak jsme to projeli systémem, který si s Vigenèrem hravě poradí. A vypadlo nám z toho jedno slovo. MORANA.'] },
  { kind: 'textOne', file: '3. spis', prompt: 'Objevila se zpětně nějaká nová nesrovnalost v některém z výslechů? Pokud ano, uveď jméno osoby, které se tato nesrovnalost týká.', validate: oneOf('Kamila Dvořáková'), hints: ['Zkus si projít i starší výslechy.', 'Detektive, myslím, že zmíněný výslech se objevil už v prvním spisu.', 'Není náhodou ve výpovědích rodičů Jakuba Dvořáka nějaká nesrovnalost s tím, co si on sám zapsal do svého emailu?', 'Nesrovnalost se jistě týká Kamily Dvořákové.'] },
  { kind: 'video', file: '3. spis', title: 'Závěrečné video 3. spisu', button: 'Otevřít 4. spis' },
  { kind: 'video', file: '4. spis', title: 'Úvodní video 4. spisu', notice: '4. spis zatím neotevírej. Shlédni úvodní video a pak si poslechni vzkaz historika Tomáše Havelky.', button: 'Poslechnout vzkaz' },
  { kind: 'audio', file: '4. spis', title: 'Vzkaz historika Tomáše Havelky', transcript: 'Nyní otevři spis a pokračuj.', button: 'Pokračovat' },
  { kind: 'single', file: '4. spis', prompt: 'Výhružky u Dvořáka na sociálních sítích odkazují očividně znovu na biblické verše. Jaký je jejich hlavní společný význam?', options: ['Ujištění o Božím milosrdenství a odpuštění bez ohledu na vinu.', 'Varování před nemocí a fyzickým utrpením způsobeným démony.', 'Zdůraznění nevyhnutelného trestu, bolesti a následků hříchu. I skrze generace.'], correct: [2], hints: ['Detektive, ve všech citovaných úryvcích se objevuje silná emoce a reakce na předchozí čin. Nejde o náhodné utrpení. Vidíš to v tom?', 'Texty spojuje myšlenka, že bolest není bez příčiny. Něco jí předchází a něco ji ospravedlňuje. Víš, co to je?', 'Hele, ve všech verších se opakuje stejný vzorec, a to provinění a následek. Utrpení je zde chápáno jako odpověď na vinu. To už je vcelku jasné, ne?', 'Správná odpověď je c)'] },
  { kind: 'textOne', file: '4. spis', prompt: 'Všiml sis u Dvořáka na sociálních sítích ještě něčeho? Není tam kromě biblických veršů i jiný vzkaz? Jak zní?', validate: oneOf('Utrpení'), hints: ['Zkus se podívat znovu na výhružky Dvořákovi. Jsou tam zvláštní bubliny.', 'Bubliny se vzájemně prolínají z jednoho obrázku do druhého. Co to jen může znamenat?', 'Všiml sis, detektive, že je v těch bublinách kromě písmene vždy ještě malá indexovaná číslice? Nemůže to být klíč?', 'Já myslím, že je třeba ty písmena uspořádat podle těch čísel. Pak už to odhalíš snadno.', 'Seřazené bubliny dávají dohromady slovo UTRPENÍ.'] },
  { kind: 'single', file: '4. spis', prompt: 'Kterou osobu můžeme zbavit podezření, protože má alibi?', options: ['Rostislava Dvořáka', 'Filipa Procházku', 'Kamilu Dvořákovou', 'Františka Krále', 'Břetislava Macha', 'Růženu Machovou'], correct: [3], hints: ['Zkus se podívat do místních novin, zda tam nenarazíš na užitečné informace.', 'Jeden z nich to určitě spáchat nemohl, protože byl hospitalizován na protialkoholní záchytné stanici.', 'Nemohl to spáchat František Král.'] },
  { kind: 'multi', file: '4. spis', prompt: 'Dokážeš identifikovat alespoň dvě osoby z fotky u oltáře, kterou přinesl Dvořák?', options: ['Kamila Dvořáková', 'Rostislav Dvořák', 'Břetislav Mach', 'Růžena Machová', 'Jakub Dvořák', 'Filip Procházka', 'Norbert Malina'], correct: [2,3], hints: ['Máme školní fotku, která visí na nástěnce v hospodě. Nejsou na ní náhodou stejní lidé?', 'Nemohl by to být někdo z našich podezřelých?', 'Kdo dodnes v Podlesí dodržuje pohanské zvyky?', 'Je tam Břetislav Mach a Růžena Machová.'] },
  { kind: 'interlude', file: '4. spis', title: 'Meziřeč historika', transcript: 'Detektive,\n\nještě jedna věc. Ten rodný list Jakuba Dvořáka je opravdu zajímavý. Chtělo by to o jeho původu zjistit trochu víc. Nemám teď čas, zkus napsat na analytické oddělení, zda by ti nezpracovali rešerši ze starých archivních dokumentů. Do mailu stačí napsat: “Prověřit rodný list Jakuba Dvořáka.”', hints: ['Zkus se podívat na adresář obvodního oddělení policie města Hvozdná nad Radbuzou.', 'Napiš email na analytické oddělení a počkej na odpověď.'] },
  { kind: 'textOne', file: '4. spis', prompt: 'Kdo udal Barboru Novotnou v roce 1986 a kdo byl zároveň spolupracovníkem StB pod krycím jménem VAŘEČKA?', validate: oneOf('Rostislav Dvořák'), hints: ['Zkus se zamyslet nad krycím jménem VAŘEČKA.', 'Neříká ti něco adresa trvalého pobytu spolupracovníka StB? Neviděli jsme ji už někde?', 'Nebydlel na adrese Podlesí 26 i Jakub Dvořák?', 'Na adrese Podlesí 26 bydlí i Dvořákovi.', 'Spolupracovníkem StB, který udal Barboru Novotnou, byl Rostislav Dvořák.'] },
  { kind: 'video', file: '4. spis', title: 'Závěrečné video 4. spisu', button: 'Otevřít 5. spis' },
  { kind: 'video', file: '5. spis', title: 'Úvodní video 5. spisu', notice: '5. spis zatím neotevírej. Shlédni úvodní video a pak si poslechni vzkaz historika Tomáše Havelky.', button: 'Poslechnout vzkaz' },
  { kind: 'audio', file: '5. spis', title: 'Vzkaz historika Tomáše Havelky', transcript: 'Nyní otevři spis a pokračuj.', button: 'Pokračovat' },
  { kind: 'textMany', file: '5. spis', prompt: 'Podařilo se ti zjistit, co se skrývá v ručně psaném vzkazu, který byl nalezen u Machových vložený v knize?', fields: Array.from({length:12}, (_,i)=>`Slovo ${i+1}`), validate: requiredSet(['Přátelé','vracím','se','co','se','stalo','to','se','neodpouští','potřebuji','vaši','pomoc']), hints: ['Vzkaz je na první pohled zvláštní, že, detektive? Tam, kde by měla být velká písmena, tam nejsou, a tam, kde by být neměla, tak jsou.', 'Musí to mít něco společného s těmi velkými písmeny.', 'Zkusme vzít v potaz jen slova s velkými písmeny na začátku.', 'Je tam ukrytý vzkaz: “přátelé vracím se co se stalo to se neodpouští potřebuji vaši pomoc”'] },
  { kind: 'textOne', file: '5. spis', prompt: 'Jaké je heslo k flashce Jakuba Dvořáka?', validate: oneOf('STRIGA'), hints: ['Zkus si znovu projít věci nalezené na místě vraždy Jakuba Dvořáka.', 'Mezi věcmi nalezenými na místě činu byly i klíče Jakuba Dvořáka a na nich přívěsek.', 'Znaky, které jsou na přívěsku Jakuba Dvořáka, už jsme někde viděli, ne?', 'Znaky na přívěsku jsou starým slovanským runovým písmem. Jejich transliteraci najdeme v knize Tomáše Havelky.', 'Heslo k flashce Jakuba Dvořáka je STRIGA.'] },
  { kind: 'textOne', file: '5. spis', prompt: 'Už víme, že Jakub Dvořák byl adoptovaný. Jeho matkou byla Barbora Novotná. Tušíš však, kdo byl (je) jeho otcem?', validate: oneOf('Tomáš Havelka'), hints: ['Jméno Barbory Novotné jsme kromě rodného listu a výpisu z analytického oddělení viděli ještě někde jinde, ne?', 'Prozkoumej rok narození Jakuba Dvořáka v jeho rodném listu a rok smrti Barbory Novotné ve Wikipedii o historikovi Tomáši Havelkovi. Možná ti to začne dávat smysl.', 'Otcem Jakuba Dvořáka je Tomáš Havelka.'] },
  { kind: 'interlude', file: '5. spis', title: 'Meziřeč historika', transcript: 'Děkuji za tvou zprávu, detektive. Jdeš na to dobře. Kdo by to řekl, že heslo k flashce ti prozradí přívěšek na klíčích, na který se už dávno zapomnělo.\nCo je ale důležitější, je to, že vrah Jakuba i faráře je zřejmě ve spojení s Machovými. Jde jen o to přijít na to, jak moc o tom Machovi vědí.\nMusím teď na kobereček k šéfovi. Chce se mnou řešit, odkud prosakují informace o vraždách v Podlesí na veřejnost, a tak se na tu flashku nemám čas podívat. Každopádně jsem ti její obsah nasdílel. Můžeš se na to podívat ty?\nDíky. Ozvu se, jak to půjde.', link: GOOGLE_URL },
  { kind: 'textOne', file: '5. spis', prompt: 'Komu patří pero nalezené na místě vraždy Jakuba Dvořáka?', validate: oneOf(...HAVELKA), hints: ['Nemůže být odpověď na tuto otázku na flashce Jakuba Dvořáka?', 'Neodkazují některé odkazy v dokumentech na flashce na externí zdroje?', 'Zkus se podívat do souboru Úkoly.', 'V souboru Úkoly je externí odkaz na historickou anketu (Historia magistra vitae). Otevři si tuto webovou stránku.', 'Nedostal toto ocenění Tomáš Havelka?', 'Tomáš Havelka dostal ocenění, k němuž náleželo pero s nápisem “Historia magistra vitae 2022”'] },
  { kind: 'video', file: '5. spis', title: 'Závěrečné video 5. spisu', button: 'Otevřít 6. spis' },
  { kind: 'video', file: '6. spis', title: 'Úvodní video 6. spisu', notice: 'Můžeš otevřít 6. spis', button: 'Otevřít otázky' },
  { kind: 'yesno', file: '6. spis', prompt: 'Mohl se Tomáš Havelka dostat do Podlesí? Mohl to stihnout?', options: ['Ano','Ne'], correct: [0], hints: ['Žádné auto kromě auta Filipa Procházky ten večer do Podlesí nepřijelo. Co takhle jiný dopravní prostředek?', 'Nejlepší bude prověřit odjezdy autobusů z Plzně a porovnat je s koncem přednášky Tomáše Havelky.', 'Detektive, zkus se nedívat jen do jízdních řádů, ale mrkni taky na starší dokumenty.', 'Nepíše se o tom náhodou v novinách, které vyšly ještě před smrtí Jakuba Dvořáka?', 'V novinách se píše o posílení spojů, které není uvedeno v běžném jízdním řádu. Takže ano, Tomáš Havelka se mohl do Podlesí dostat autobusem ve 20:00 z Plzně.'] },
  { kind: 'textOne', file: '6. spis', prompt: 'Komu patří prezentér nalezený na místě činu, kde byl zabit Jakub Dvořák?', validate: oneOf(...FILIP), hints: ['Zkus se podívat na detail rozebraného prezentéru', 'Není pod krytem prezentéru adresa?', 'Vzpomeneš si, kdo na této škole učí?', 'Neučí tam náhodou Filip Procházka?'] },
  { kind: 'textOne', file: '6. spis', prompt: 'Kdo psal výhružný vzkaz faráři a stejně tak i vzkaz, který se objevil u Machů?', validate: oneOf('Tomáš Havelka'), hints: ['Vím, že nejsi grafolog, detektive. Ale rozhodně stojí za to písma na vzkazech prozkoumat.', 'Neměli jsme tady ještě nějaký jiný rukopis, o kterém víme, komu patří?', 'Mrkni na věnování v knize Jakuba Dvořáka.', 'No je patrné, že písmo, kterým jsou napsané vzkazy, se shoduje s písmem, kterým napsal Tomáš Havelka Jakubovi věnování do knihy.'] },
  { kind: 'ack', file: '6. spis', prompt: 'Koho zadržíme či po kom vyhlásíme pátrání? Rozhoduj moudře, detektive. Špatná volba může způsobit, že pachatele činu už nemusíme nikdy dopadnout.', options: ['Tomáše Havelku','Filipa Procházku'], decisionKey: 'suspect' },
  { kind: 'interlude', file: '6. spis', title: 'Operativní rozbor rozhodnutí', transcript: 'Tak to by mě nenapadlo, detektive. Havelka to skutečně mohl do Podlesí stihnout. Vždyť dle Domažlického listu byly kvůli Festivalu světel přidány i pozdější autobusy. Jenže on tvrdí, že jel hned z přednášky v Malostranské besedě do hotelu. Je potřeba to prověřit, ať ho můžeme zbavit podezření.\n\nNa místě činu bylo Havelkovo pero, to už víme. Ale tak trochu jsme opomněli, že se tam nacházel i prezentér Filipa Procházky. Prozradila nám to adresa školy uvnitř prezentéru, na které Filip Procházka učí. To nám vyšetřování trochu komplikuje.\n\nJenže proti Havelkovi svědčí i výhružný vzkaz, který napsal farářovi. Je to sice neurčitý vzkaz, ale člověk, který ho napsal, může mít na svědomí i malby citátů z Bible po kostele a kamínky na náhrobku. Mohl by být historik Mstitel?\n\nA teď k tvému rozhodnutí.', dynamic: true, link: GOOGLE_URL },
  { kind: 'ack', file: '6. spis', prompt: 'Má podle hotelových logů Havelka alibi? Nebo ti tam přijde něco podezřelého?', options: ['má alibi','přijde mi tam něco podezřelého'], hints: ['Projdi si soubor s hotelovými logy a porovnej důležitá data.', 'Stěžejní je pro nás den konání přednášky, den, kdy někdo Malinovi pomaloval kostel a den, kdy byl farář zavražděn.', 'Jde o 9.3., 12.3. a 13.3.'] },
  { kind: 'interlude', file: '6. spis', title: 'Telefonát s asistentkou', transcript: 'Havelka byl podle hotelových logů skutečně na hotelu. Ale stačí to? Pro jistotu jsme kontaktovali i jeho asistentku, aby nám potvrdila jeho alibi.\n\n“Dobrý den, slečno Náhlíková, tady nadporučík Vávra. Volám vám ohledně potvrzení alibi Tomáše Havelky. Jde nám zejména o to, zda víte, kde se nacházel ihned po skončení přednášky v Měšťanské besedě. Prověřili jsme logy jeho pokoje 307, takže tohle už je jen formalita.”\n\n“Dobrý den, pane nadporučíku. Jestli si dobře vzpomínám, tak autogramiáda skončila po 19. hodině. Pan Havelka se cítil unaven a tak si objednal taxi a kolem tři čtvrtě na osm odjel do hotelu. Já měla ještě nějaké administrativní povinnosti v budově, a tak jsem vyrazila o něco později. Ale na hotelu jsem byla něco před devátou. Psala jsem panu Havelkovi a on mi potvrdil, že už se chystá ke spánku. Ráno jsme se už kolem osmé sešli na snídani. Takže ano, určitě byl na hotelu.”\n\nAle nebyla jste přímo s ním?\n\n“No, nebyla.”\n\nDobře. Děkuji vám za informaci.\n\n“Počkejte ještě. Vy jste říkal logy pokoje 307?”\n\nAno, přístupy do pokoje Tomáše Havelky.\n\n“Tady muselo dojít k omylu. Pokoj 307 je můj. Pan Havelka je ubytovaný vedle. Na pokoji 305.”\n\nDěkuji vám, slečno.' },
  { kind: 'single', file: '6. spis', prompt: 'Kdo zabil Jakuba Dvořáka a faráře Norberta Malinu?', options: ['Filip Procházka','Tomáš Havelka'], correct: [1], hints: [] },
  { kind: 'textOne', file: '6. spis', prompt: 'Jak se Havelka dostal do Podlesí po přednášce v den vraždy Jakuba Dvořáka?', validate: oneOf('autobusem'), hints: ['Žádné auto, kromě auta Filipa Procházky, ten večer na odbočce do Podlesí nesjelo.', 'Pěšky by se tam určitě nedostal. Zbývá jediný způsob', 'Autobusem'] },
  { kind: 'textMany', file: '6. spis', prompt: 'V kolik hodin vyjížděl Havelka autobusem z Plzně a v kolik měl být v Podlesí?', fields: ['ODJEZD Z PLZNĚ','PŘÍJEZD DO PODLESÍ'], validate: exactlySet(['20:00','21:30']), hints: ['Podívej se do jízdních řádů a zjisti, jak dlouho trvá cesta do Podlesí z Plzně CAN.', 'Podívej se do novin, v kolik odjížděl jediný autobus do Podlesí, který mohl Havelka stihnout.', 'Z Plzně odjížděl ve 20:00 a na místě byl ve 21:30.'] },
  { kind: 'textOne', file: '6. spis', prompt: 'Jak se Havelka dostal do Podlesí, když zanechal farářovi výhružné vzkazy a stejně tak, když ho zavraždil?', validate: oneOf('taxíkem','taxikem','taxi službou','taxislužbou','vozem taxislužby'), hints: ['Podívej se nejen na logy hotelového pokoje 305 ve dnech 12. a 13.3., ale zkontroluj i další část dokumentu', 'Podívej se na Havelkovi objednávky odvozů.', 'Taxíkem'] },
  { kind: 'textOne', file: '6. spis', prompt: 'Kde byla v době těchto vražd asistentka Tomáše Havelky?', validate: oneOf('na hotelu','v hotelu','hotel','na pokoji','v pokoji','pokoj'), hints: ['Podívej se do hotelových logů Havelkovy asistentky.', 'Je to pokoj 307.', 'Podle hotelových logů byla na pokoji.'] },
  { kind: 'final', title: 'Případ je vyřešen.', body: 'Podívej se na jeho závěrečné video.', button: 'Ukončit vyšetřování!' },
];


function html(strings, ...values) { return strings.reduce((out, str, i) => out + str + (values[i] ?? ''), ''); }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch])); }
let index = 0;
let decisions = {};
let feedbackTimer;
let audioContext;
function playAudio(variant = 0) {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext = audioContext || new AudioContext();
  const ctx = audioContext;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = variant % 2 ? 'triangle' : 'sine';
  osc.frequency.setValueAtTime(420 + variant * 70, ctx.currentTime);
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.85);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.9);
}
function videoBlock(label = 'Videozáznam') {
  return html`<div class="video-card"><div class="video-toolbar"><span class="rec-dot"></span>${escapeHtml(label)}</div><iframe src="${VIDEO_URL}" title="${escapeHtml(label)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
}
function hintsBlock(hints = []) {
  if (!hints.length) return '';
  return html`<aside class="hint-panel" data-visible="0"><div class="hint-head"><span>Nápovědy</span><button class="phone" type="button" data-audio="0" title="Přehrát zvukovou nápovědu">☎</button></div><div class="hint-actions">${hints.map((_, i) => `<button type="button" data-hint="${i}">NÁPOVĚDA ${i + 1}</button>`).join('')}</div><div class="hint-texts"></div></aside>`;
}
function renderHints(panel, hints) {
  const visible = Number(panel.dataset.visible || 0);
  panel.querySelectorAll('[data-hint]').forEach((button, i) => button.classList.toggle('used', i < visible));
  panel.querySelector('.hint-texts').innerHTML = hints.slice(0, visible).map((hint, i) => `<p class="typewriter" style="--chars:${Math.min(hint.length, 120)};--delay:${i * .08}s">▸ ${escapeHtml(hint)}</p>`).join('');
}
function initHints(slide) {
  const panel = document.querySelector('.hint-panel');
  if (!panel) return;
  renderHints(panel, slide.hints || []);
  panel.querySelector('.phone').addEventListener('click', () => playAudio(Number(panel.dataset.visible || 0)));
  panel.querySelectorAll('[data-hint]').forEach(button => button.addEventListener('click', () => {
    const nextVisible = Math.max(Number(panel.dataset.visible || 0), Number(button.dataset.hint) + 1);
    panel.dataset.visible = nextVisible;
    playAudio(Number(button.dataset.hint));
    renderHints(panel, slide.hints || []);
  }));
}
function showFeedback(type, onDone) {
  clearTimeout(feedbackTimer);
  const root = document.getElementById('feedback-root');
  const label = type === 'ok' ? 'SCHVÁLENO' : type === 'ack' ? 'BEREME NA VĚDOMÍ!' : 'BEZ DŮKAZŮ';
  root.innerHTML = `<div class="feedback ${type}">${label}</div>`;
  feedbackTimer = setTimeout(() => { root.innerHTML = ''; if (onDone) onDone(); }, type === 'bad' ? 1200 : 900);
}
function next() { index = Math.min(slides.length - 1, index + 1); render(); }
function selectedIndices() { return [...document.querySelectorAll('.options button.selected')].map(b => Number(b.dataset.index)); }
function submitQuestion(slide) {
  const selected = selectedIndices();
  const values = [...document.querySelectorAll('.inputs input')].map(input => input.value);
  let ok = false;
  if (['single','yesno'].includes(slide.kind)) ok = slide.correct.includes(selected[0]);
  else if (slide.kind === 'multi') ok = selected.length === slide.correct.length && slide.correct.every(item => selected.includes(item));
  else if (slide.kind === 'ack') { ok = selected.length > 0; if (ok && slide.decisionKey) decisions[slide.decisionKey] = slide.options[selected[0]]; }
  else ok = slide.validate(values.length ? values : ['']);
  if (ok) showFeedback(slide.kind === 'ack' ? 'ack' : 'ok', next); else showFeedback('bad');
}
function questionMarkup(slide) {
  const choiceKinds = ['single','multi','yesno','ack'];
  return html`<div class="question-layout"><section class="case-card question-card"><p class="question-type">Databázový dotaz</p><h2>${escapeHtml(slide.prompt)}</h2>${choiceKinds.includes(slide.kind) ? `<div class="options">${slide.options.map((option, i) => `<button type="button" data-index="${i}">${escapeHtml(option)}</button>`).join('')}</div>` : ''}${['textOne','textMany'].includes(slide.kind) ? `<div class="inputs">${(slide.fields || ['Odpověď']).map((label, i) => `<label>${escapeHtml(label)}<input data-index="${i}" /></label>`).join('')}</div>` : ''}<button class="primary" type="button" id="submit">Ověřit v systému</button></section>${hintsBlock(slide.hints)}</div>`;
}
function initQuestion(slide) {
  document.querySelectorAll('.options button').forEach(button => button.addEventListener('click', () => {
    if (slide.kind === 'multi') button.classList.toggle('selected');
    else { document.querySelectorAll('.options button').forEach(b => b.classList.remove('selected')); button.classList.add('selected'); }
  }));
  document.querySelectorAll('.inputs input').forEach(input => input.addEventListener('keydown', event => { if (event.key === 'Enter') submitQuestion(slide); }));
  document.getElementById('submit')?.addEventListener('click', () => submitQuestion(slide));
  initHints(slide);
}
function audioMarkup(slide) {
  const decisionText = slide.dynamic ? ((decisions.suspect || '').includes('Filipa') ? 'Rozhodl ses stíhat Filipa Procházku. Bylo to skutečně správné rozhodnutí? Přišly nám hotelové logy z hotelu, ve kterém se ubytoval Tomáš Havelka. Mrkni na ně a pak mi dej vědět, jestli má Havelka alibi.' : 'Rozhodl ses zadržet Tomáše Havelku. Bylo to skutečně správné rozhodnutí? Přišly nám hotelové logy z hotelu, ve kterém se ubytoval Tomáš Havelka. Mrkni na ně a pak mi dej vědět, jestli má Havelka alibi.') : '';
  return html`<div class="question-layout"><section class="case-card"><p class="question-type">Audio záznam</p><h2>${escapeHtml(slide.title)}</h2><button class="audio-play" type="button" id="play-main">▶ Přehrát vzkaz</button><pre class="transcript">${escapeHtml(slide.transcript)}${decisionText ? '\n\n' + escapeHtml(decisionText) : ''}</pre>${slide.link ? `<a class="external-link" href="${slide.link}" target="_blank" rel="noreferrer">Otevřít sdílený odkaz</a>` : ''}<button class="primary" type="button" id="next-main">${escapeHtml(slide.button || 'Pokračovat')}</button></section>${hintsBlock(slide.hints)}</div>`;
}
function render() {
  const slide = slides[index];
  const progress = Math.round(((index + 1) / slides.length) * 100);
  let content = '';
  if (slide.kind === 'intro') content = `<section class="hero case-card"><div><p class="eyebrow">${escapeHtml(slide.eyebrow)}</p><h1>${escapeHtml(slide.title)}</h1>${slide.body.map(line => `<p>${escapeHtml(line)}</p>`).join('')}<button class="primary" type="button" id="next-main">${escapeHtml(slide.button)}</button></div>${videoBlock(slide.videoLabel)}</section>`;
  else if (slide.kind === 'video') content = `<section class="case-card centered"><h1>${escapeHtml(slide.file)}</h1><h2>${escapeHtml(slide.title)}</h2>${slide.notice ? `<p class="notice">${escapeHtml(slide.notice)}</p>` : ''}${videoBlock(slide.title)}<button class="primary" type="button" id="next-main">${escapeHtml(slide.button)}</button></section>`;
  else if (['audio','interlude'].includes(slide.kind)) content = audioMarkup(slide);
  else if (['single','multi','textOne','textMany','yesno','ack'].includes(slide.kind)) content = questionMarkup(slide);
  else content = `<section class="case-card centered"><h1>${escapeHtml(slide.title)}</h1><p>${escapeHtml(slide.body)}</p>${videoBlock('Závěrečné video případu')}<button class="primary danger" type="button" id="end-main">${escapeHtml(slide.button)}</button></section>`;
  document.getElementById('root').innerHTML = `<main class="orion-shell"><header class="topbar"><div><strong>O.R.I.O.N.</strong><span>Interní vyšetřovací systém</span></div><div class="status"><span></span>SYSTÉM AKTIVNÍ</div></header><div class="progress"><span style="width:${progress}%"></span></div><section class="workspace"><div class="meta-row"><span>${escapeHtml(slide.file || 'Případ 2254578/2026')}</span><span>Slide ${index + 1} / ${slides.length}</span></div>${content}</section><div id="feedback-root"></div></main>`;
  document.getElementById('next-main')?.addEventListener('click', next);
  document.getElementById('play-main')?.addEventListener('click', () => playAudio(3));
  document.getElementById('end-main')?.addEventListener('click', () => alert('Vyšetřování ukončeno.'));
  if (['single','multi','textOne','textMany','yesno','ack'].includes(slide.kind)) initQuestion(slide);
  if (['audio','interlude'].includes(slide.kind)) initHints(slide);
}
render();
