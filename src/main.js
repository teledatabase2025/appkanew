const STORAGE_KEY = 'escape-hub-state-v1';
const CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
const slideTypes = [
  'Vypisovací odpověď', 'Potvrzení', 'Audiovzkaz', 'Sol a Luna', 'Více odpovědí', 'Email',
  'Více odpovědí se štítky', 'Výběr jedné odpovědi', 'Rozvětvení hry', 'Závěr hry',
  'Více správných odpovědí', 'Navigace GPS', 'Vypsat více odpovědí', 'Kontakt dcery historika',
];

const seedState = () => ({
  session: null,
  users: [
    { id: 'u-admin', email: 'admin@escape.local', nick: 'Admin', password: 'admin123', role: 'admin' },
    { id: 'u-demo', email: 'hrac@demo.cz', nick: 'PražskýHledač', password: 'demo123', role: 'player' },
  ],
  games: [
    createGame({
      id: 'kodex-ztraceneho-sveta',
      title: 'Kodex Ztraceného světa',
      theme: 'codex',
      status: 'online',
      activationCodes: ['KODX-2026-PRAH', 'MNCH-0192-KODX'],
      description: 'Starý kodex ukrývá sílu schopnou zničit Prahu. Mocichtivý mnich je blíž, než se zdá.',
      slides: [
        basicSlide(2, 'Prolog v klášterní knihovně', 'Stiskni pečeť a přijmi výpravu za ztraceným kodexem.', 'Přijmout výpravu'),
        questionSlide(1, 'Jméno rukopisu', 'Jak se jmenuje artefakt, který hledáš?', ['kodex', 'kodex ztraceného světa']),
        basicSlide(3, 'Hlas mnicha', 'Máte jednu neposlechnutou hlasovou zprávu!'),
        finalSlide(),
      ],
    }),
    createGame({
      id: 'labyrint-stareho-mesta',
      title: 'Labyrint Starého Města',
      theme: 'golem',
      status: 'draft',
      activationCodes: ['GOLE-1609-LOWA', 'PRAG-GLEM-2026'],
      description: 'Rabín Löw kdysi aktivoval ochranný mechanismus Prahy. Stopy vedou židovským městem.',
      slides: [
        basicSlide(2, 'Brána do ghetta', 'Vstup do labyrintu a sleduj hebrejské značky ve zdech.', 'Vstoupit'),
        questionSlide(8, 'Strážce Prahy', 'Kdo podle legendy oživil Golema?', ['rabi low', 'rabín löw', 'rabi löw']),
        finalSlide(),
      ],
    }),
  ],
  runs: [
    { id: 'r-demo-1', userId: 'u-demo', gameId: 'kodex-ztraceneho-sveta', status: 'finished', slideIndex: 3, startedAt: Date.now() - 4680000, finishedAt: Date.now() - 4200000, score: 86, hintsUsed: {}, wrongAnswers: 1, path: [0, 1, 2, 3] },
  ],
  leaderboard: [
    { gameId: 'kodex-ztraceneho-sveta', nick: 'StínMostu', time: 1020, score: 94 },
    { gameId: 'kodex-ztraceneho-sveta', nick: 'PražskýHledač', time: 480, score: 86 },
    { gameId: 'kodex-ztraceneho-sveta', nick: 'Alchymista', time: 1320, score: 77 },
  ],
});

function basicSlide(type, title, text, button = 'Pokračovat') {
  return { id: crypto.randomUUID(), type, title, blocks: [{ kind: 'text', value: text }], hints: [], points: 0, hintPenalty: 0, wrongPenalty: 0, button };
}
function questionSlide(type, title, prompt, answers) {
  return { id: crypto.randomUUID(), type, title, blocks: [{ kind: 'text', value: prompt }], answers, options: ['Kodex', 'Mapa', 'Pečeť'], hints: ['Hledej v úvodním textu.', 'Název je přímo v názvu výpravy.'], points: 100, hintPenalty: 5, wrongPenalty: 10, inventoryFromHere: [] };
}
function finalSlide() { return { id: crypto.randomUUID(), type: 10, title: 'Závěr hry', blocks: [{ kind: 'text', value: 'Výprava je u konce. Výsledky se zapíší do žebříčku.' }], hints: [], points: 0, hintPenalty: 0, wrongPenalty: 0, button: 'Ukončit výpravu!' }; }
function createGame(game) { return { design: { font: game.theme === 'golem' ? 'Frank Ruhl Libre' : 'Cinzel', color: game.theme === 'golem' ? '#d8b56d' : '#86d6ff' }, ...game }; }

let state = loadState();
let view = { name: 'auth', tab: 'login', adminGameId: state.games[0]?.id, runId: null, testMode: false };
const root = document.getElementById('root');

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return seedState();
  try { return JSON.parse(saved); } catch { return seedState(); }
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function currentUser() { return state.users.find((user) => user.id === state.session); }
function escapeHtml(value = '') { return value.toString().replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char])); }
function renderRichText(value = '') {
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}
function normalize(value = '') { return value.toString().trim().toLocaleLowerCase('cs-CZ').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
function duration(seconds) { const minutes = Math.floor(seconds / 60); return `${minutes}:${String(seconds % 60).padStart(2, '0')}`; }
function route(name, extra = {}) { view = { ...view, name, ...extra }; render(); }
function update(mutator) { mutator(); save(); render(); }

function shell(content) {
  const user = currentUser();
  return `<main class="app-shell">
    <header class="topbar">
      <button class="brand" data-route="home"><span>✦</span><strong>Escape Codex</strong></button>
      ${user ? `<div class="account"><button data-route="account">${escapeHtml(user.nick)}</button>${user.role === 'admin' ? '<button data-route="admin">Admin</button>' : ''}<button data-action="logout">Odhlásit</button></div>` : ''}
    </header>${content}</main>`;
}

function authView() {
  return shell(`<section class="auth-panel card"><div><p class="eyebrow">Tajemné mobilní výpravy</p><h1>Únikové hry, které se ukládají po každém kroku.</h1><p>Prototyp obsahuje registraci, aktivaci kódem XXXX-XXXX-XXXX, hráčské hry, žebříčky i administrační editor slidů.</p><p class="install-note">Aplikace je připravena jako PWA: v mobilním prohlížeči ji lze přidat na plochu a používat jako instalovatelnou aplikaci.</p></div>
    <form class="login-form" data-form="${view.tab}">
      <div class="tabs"><button type="button" class="${view.tab === 'login' ? 'active' : ''}" data-tab="login">Přihlášení</button><button type="button" class="${view.tab === 'register' ? 'active' : ''}" data-tab="register">Registrace</button></div>
      <label>Email<input name="email" type="email" required value="${view.tab === 'login' ? 'hrac@demo.cz' : ''}"></label>
      <label>Heslo<input name="password" type="password" required value="${view.tab === 'login' ? 'demo123' : ''}"></label>
      ${view.tab === 'register' ? '<label>Unikátní nick<input name="nick" required maxlength="24"></label>' : ''}
      <button class="primary" type="submit">${view.tab === 'register' ? 'Vytvořit účet' : 'Přihlásit se'}</button>
      <small>Admin demo: admin@escape.local / admin123</small>
    </form></section>`);
}

function homeView() {
  const user = currentUser();
  return shell(`<section class="hero"><p class="eyebrow">Vítej, ${escapeHtml(user.nick)}</p><h1>Vyber další stopu.</h1><div class="menu-grid">
    <button class="menu-card" data-route="activate"><span>⌁</span><strong>Aktivovat hru</strong><small>Zadej 12místný kód.</small></button>
    <button class="menu-card" data-route="my-games"><span>◈</span><strong>Moje hry</strong><small>Rozehrané, nové i dokončené výpravy.</small></button>
    <button class="menu-card" data-route="leaderboard"><span>≋</span><strong>Srovnání výsledků</strong><small>Žebříčky podle času a bodů.</small></button>
  </div></section>`);
}

function activateView(message = '') {
  return shell(`<section class="card narrow"><p class="eyebrow">Aktivace</p><h1>Aktivační kód</h1><p>Zadej kód ve formátu <strong>XXXX-XXXX-XXXX</strong>. Podle kódu se hra přiřadí k účtu.</p><form data-form="activate"><input name="code" placeholder="KODX-2026-PRAH" maxlength="14"><button class="primary">Aktivovat hru</button></form>${message ? `<p class="message">${escapeHtml(message)}</p>` : ''}</section>`);
}

function myGamesView() {
  const user = currentUser();
  const activeGameIds = new Set(state.runs.filter((run) => run.userId === user.id).map((run) => run.gameId));
  const cards = state.games.filter((game) => activeGameIds.has(game.id)).map((game) => {
    const run = state.runs.find((item) => item.userId === user.id && item.gameId === game.id);
    const status = run.status === 'finished' ? `Dokončeno · čas ${duration(Math.round((run.finishedAt - run.startedAt) / 1000))} · ${run.score} bodů` : run.status === 'active' ? `Probíhá · pokračuješ od slidu ${run.slideIndex + 1}` : 'Aktivováno · nezačato';
    return `<article class="game-card ${game.theme}"><h2>${escapeHtml(game.title)}</h2><p>${escapeHtml(game.description)}</p><p class="pill">${status}</p><button class="primary" data-play="${run.id}">${run.status === 'finished' ? 'Zobrazit summary' : run.status === 'active' ? 'Pokračovat' : 'Začít hru'}</button></article>`;
  }).join('') || '<p class="empty">Zatím nemáš aktivovanou žádnou hru.</p>';
  return shell(`<section><p class="eyebrow">Moje hry</p><h1>Aktivované výpravy</h1><div class="cards">${cards}</div></section>`);
}

function leaderboardView() {
  const user = currentUser();
  const playedIds = [...new Set(state.runs.filter((run) => run.userId === user.id).map((run) => run.gameId))];
  const selected = view.gameId || playedIds[0] || state.games[0].id;
  const rows = state.leaderboard.filter((row) => row.gameId === selected).sort((a, b) => b.score - a.score || a.time - b.time);
  return shell(`<section><p class="eyebrow">Srovnání výsledků</p><h1>Žebříček</h1><div class="select-row">${playedIds.map((id) => `<button class="chip ${id === selected ? 'active' : ''}" data-leaderboard="${id}">${escapeHtml(state.games.find((game) => game.id === id)?.title)}</button>`).join('') || '<span>Nejdřív dokonči nebo aktivuj hru.</span>'}</div><table><thead><tr><th>#</th><th>Nick</th><th>Čas</th><th>Body</th></tr></thead><tbody>${rows.map((row, index) => `<tr class="${row.nick === user.nick ? 'me' : ''}"><td>${index + 1}</td><td>${escapeHtml(row.nick)}</td><td>${duration(row.time)}</td><td>${row.score}</td></tr>`).join('')}</tbody></table></section>`);
}

function accountView() {
  const user = currentUser();
  return shell(`<section class="card narrow"><p class="eyebrow">Účet</p><h1>${escapeHtml(user.nick)}</h1><p>Email je uložen jen pro přihlášení a není veřejně dostupný.</p><dl><dt>Email</dt><dd>${escapeHtml(user.email)}</dd><dt>Role</dt><dd>${user.role}</dd></dl></section>`);
}

function gameView() {
  const run = state.runs.find((item) => item.id === view.runId);
  const game = state.games.find((item) => item.id === run.gameId);
  const slide = game.slides[run.slideIndex];
  if (run.status === 'finished' && !view.testMode) return summaryView(run, game);
  const usedHints = run.hintsUsed?.[slide.id] || 0;
  const inventory = game.slides.slice(0, run.slideIndex + 1).flatMap((item) => item.inventoryFromHere || []);
  return shell(`<section class="play ${game.theme}" style="--accent:${game.design.color};font-family:${game.design.font}, system-ui, sans-serif">
    <nav class="gamebar"><button data-action="back-slide">← Zpět</button><button data-action="hint">💡 NÁPOVĚDA ${usedHints}/${slide.hints.length}</button><button data-action="itinerary">🗺 ITINERÁŘ</button><button data-action="inventory">🎒 Inventář (${inventory.length})</button>${view.testMode ? '<button data-action="skip-slide">Přeskočit</button><button data-route="admin">Ukončit test</button>' : ''}</nav>
    <article class="slide-card"><p class="eyebrow">${escapeHtml(slideTypes[slide.type - 1] || 'Slide')}</p>${slide.blocks.map(blockMarkup).join('')}${slideMarkup(slide)}</article>
  </section>`);
}
function blockMarkup(block) { if (block.kind === 'image') return `<img class="story-image" src="${escapeHtml(block.value)}" alt="Herní obrázek">`; if (block.kind === 'audio') return `<audio controls src="${escapeHtml(block.value)}"></audio>`; return `<p class="story-text">${renderRichText(block.value)}</p>`; }
function slideMarkup(slide) {
  if ([1, 5, 7, 13].includes(slide.type)) return `<form data-form="answer"><input name="answer" placeholder="Tvoje odpověď"><button class="primary">Odeslat</button></form>`;
  if ([8, 9, 11].includes(slide.type)) return `<div class="options">${(slide.options || []).map((option) => `<button data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>`;
  if (slide.type === 3) return '<p class="notice">Máte jednu neposlechnutou hlasovou zprávu!</p><button class="primary" data-action="audio-message">Poslechnout zprávu!</button><button data-action="next-slide">Opustit záznam hlasových zpráv</button>';
  if (slide.type === 6) return '<p class="notice">Máte nový nepřečtený email!</p><button class="primary" data-action="download-mail">Stáhnout!</button><button data-action="next-slide">Opustit emailovou schránku!</button>';
  if (slide.type === 12) return '<p class="gps">Vzdálenost od cíle: 84 m. Slide se přepne po dosažení nastaveného okruhu.</p><button class="primary" data-action="next-slide">Simulovat dosažení cíle</button>';
  if (slide.type === 14) return '<button class="primary" data-action="audio-message">KONTAKTOVAT DCERU HISTORIKA</button><button data-action="next-slide">ZANECHAT VZKAZ</button>';
  return `<button class="primary" data-action="next-slide">${escapeHtml(slide.button || 'Pokračovat')}</button>`;
}
function summaryView(run, game) {
  return shell(`<section class="card narrow"><p class="eyebrow">Výprava ukončena</p><h1>${escapeHtml(game.title)}</h1><p>Čas: <strong>${duration(Math.round((run.finishedAt - run.startedAt) / 1000))}</strong></p><p>Body: <strong>${run.score}</strong></p><button class="primary" data-route="leaderboard" data-game-id="${game.id}">Srovnání výsledků</button></section>`);
}

function adminView() {
  const game = state.games.find((item) => item.id === view.adminGameId) || state.games[0];
  return shell(`<section class="admin-grid"><aside class="card"><p class="eyebrow">Administrace</p><button class="primary" data-action="new-game">Vytvořit novou hru</button>${state.games.map((item) => `<button class="admin-game ${item.id === game.id ? 'active' : ''}" data-admin-game="${item.id}">${escapeHtml(item.title)}<small>${item.status === 'online' ? 'Online' : 'Koncept'}</small></button>`).join('')}</aside>
    <section class="card editor"><p class="eyebrow">Detail hry</p><form data-form="game"><label>Název<input name="title" value="${escapeHtml(game.title)}"></label><label>Popis<textarea name="description">${escapeHtml(game.description)}</textarea></label><label>Font<input name="font" value="${escapeHtml(game.design.font)}"></label><label>Barva<input name="color" type="color" value="${escapeHtml(game.design.color)}"></label><button class="primary">Uložit hru</button></form><div class="admin-actions"><button data-action="publish-game">Spustit hru online</button><button data-action="test-game">Test hry</button><button data-action="add-slide">Přidat slide</button></div><h2>Slidy</h2><div class="slides-list">${game.slides.map((slide, index) => slideEditor(game, slide, index)).join('')}</div></section></section>`);
}
function slideEditor(game, slide, index) {
  return `<details class="slide-editor"><summary>${index + 1}. ${escapeHtml(slide.title)} <small>Typ ${slide.type}</small></summary><form data-form="slide" data-slide-id="${slide.id}"><label>Název pro admina<input name="title" value="${escapeHtml(slide.title)}"></label><label>Typ slidu<select name="type">${slideTypes.map((name, i) => `<option value="${i + 1}" ${slide.type === i + 1 ? 'selected' : ''}>${i + 1} — ${escapeHtml(name)}</option>`).join('')}</select></label><label>Text / zadání<textarea name="text">${escapeHtml(slide.blocks.find((block) => block.kind === 'text')?.value || '')}</textarea></label><div class="small-grid"><label>Body<input name="points" type="number" value="${slide.points || 0}"></label><label>Srážka za nápovědu<input name="hintPenalty" type="number" value="${slide.hintPenalty || 0}"></label><label>Srážka za chybu<input name="wrongPenalty" type="number" value="${slide.wrongPenalty || 0}"></label></div><label>Správné odpovědi / možnosti<textarea name="answers">${escapeHtml((slide.answers || slide.options || []).join('\n'))}</textarea></label><label>Nápovědy<textarea name="hints">${escapeHtml((slide.hints || []).join('\n'))}</textarea></label><button class="primary">Uložit slide</button><button type="button" data-remove-slide="${slide.id}">Odstranit slide</button></form></details>`;
}

function handleSubmit(event) {
  const form = event.target.closest('form'); if (!form) return; event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (form.dataset.form === 'login') {
    const user = state.users.find((item) => item.email === data.email && item.password === data.password);
    if (!user) return alert('Neplatné přihlášení.');
    return update(() => { state.session = user.id; view.name = 'home'; });
  }
  if (form.dataset.form === 'register') {
    if (state.users.some((user) => normalize(user.nick) === normalize(data.nick))) return alert('Tento nick už existuje.');
    if (state.users.some((user) => normalize(user.email) === normalize(data.email))) return alert('Email už je registrovaný.');
    return update(() => { const user = { id: crypto.randomUUID(), email: data.email, nick: data.nick, password: data.password, role: 'player' }; state.users.push(user); state.session = user.id; view.name = 'home'; alert('Registrační email byl odeslán (v prototypu simulováno).'); });
  }
  if (form.dataset.form === 'activate') return activateCode(data.code);
  if (form.dataset.form === 'answer') return answerCurrent(data.answer);
  if (form.dataset.form === 'game') return update(() => { const game = state.games.find((item) => item.id === view.adminGameId); game.title = data.title; game.description = data.description; game.design.font = data.font; game.design.color = data.color; });
  if (form.dataset.form === 'slide') return update(() => { const game = state.games.find((item) => item.id === view.adminGameId); const slide = game.slides.find((item) => item.id === form.dataset.slideId); slide.title = data.title; slide.type = Number(data.type); slide.blocks = [{ kind: 'text', value: data.text }]; slide.points = Number(data.points); slide.hintPenalty = Number(data.hintPenalty); slide.wrongPenalty = Number(data.wrongPenalty); slide.answers = data.answers.split('\n').filter(Boolean); slide.options = data.answers.split('\n').filter(Boolean); slide.hints = data.hints.split('\n').filter(Boolean); });
}
function activateCode(code = '') {
  const normalized = code.trim().toUpperCase();
  if (!CODE_PATTERN.test(normalized)) return alert('Kód musí mít formát XXXX-XXXX-XXXX.');
  const game = state.games.find((item) => item.activationCodes.includes(normalized));
  if (!game) return alert('Kód neodpovídá žádné hře.');
  if (game.status !== 'online') return alert('Tato hra ještě není spuštěna online.');
  update(() => { const user = currentUser(); if (!state.runs.some((run) => run.userId === user.id && run.gameId === game.id)) state.runs.push({ id: crypto.randomUUID(), userId: user.id, gameId: game.id, status: 'new', slideIndex: 0, startedAt: null, finishedAt: null, score: 0, hintsUsed: {}, wrongAnswers: 0, path: [0] }); view.name = 'my-games'; });
}
function answerCurrent(answer) {
  const run = state.runs.find((item) => item.id === view.runId); const game = state.games.find((item) => item.id === run.gameId); const slide = game.slides[run.slideIndex];
  const ok = (slide.answers || []).some((item) => normalize(item) === normalize(answer));
  if (!ok) return update(() => { run.score -= slide.wrongPenalty || 0; run.wrongAnswers += 1; alert('Odpověď není správně. Zkus to znovu.'); });
  update(() => { run.score += slide.points || 0; moveNext(run, game); });
}
function moveNext(run, game) {
  if (!run.startedAt) run.startedAt = Date.now();
  if (game.slides[run.slideIndex]?.type === 10 || run.slideIndex >= game.slides.length - 1) { run.status = 'finished'; run.finishedAt = Date.now(); state.leaderboard.push({ gameId: game.id, nick: currentUser().nick, time: Math.max(1, Math.round((run.finishedAt - run.startedAt) / 1000)), score: run.score }); return; }
  run.status = 'active'; run.slideIndex += 1; run.path.push(run.slideIndex);
}
function handleClick(event) {
  const target = event.target.closest('button, [data-play], [data-route], [data-answer]'); if (!target) return;
  if (target.dataset.tab) return route('auth', { tab: target.dataset.tab });
  if (target.dataset.route) return route(target.dataset.route, target.dataset.gameId ? { gameId: target.dataset.gameId } : {});
  if (target.dataset.play) return update(() => { const run = state.runs.find((item) => item.id === target.dataset.play); if (run.status === 'new') { run.status = 'active'; run.startedAt = Date.now(); } view.name = 'play'; view.runId = run.id; view.testMode = false; });
  if (target.dataset.leaderboard) return route('leaderboard', { gameId: target.dataset.leaderboard });
  if (target.dataset.adminGame) return route('admin', { adminGameId: target.dataset.adminGame });
  if (target.dataset.answer) return answerCurrent(target.dataset.answer);
  if (target.dataset.removeSlide) return update(() => { const game = state.games.find((item) => item.id === view.adminGameId); game.slides = game.slides.filter((slide) => slide.id !== target.dataset.removeSlide); });
  const action = target.dataset.action;
  if (action === 'logout') return update(() => { state.session = null; view.name = 'auth'; });
  if (action === 'new-game') return update(() => { const game = createGame({ id: `hra-${Date.now()}`, title: 'Nová úniková hra', theme: 'codex', status: 'draft', activationCodes: [`TEST-${String(Date.now()).slice(-4)}-GAME`], description: 'Nový koncept hry.', slides: [basicSlide(2, 'Úvod', 'Začátek nové hry.'), finalSlide()] }); state.games.push(game); view.adminGameId = game.id; });
  if (action === 'publish-game') return update(() => { state.games.find((item) => item.id === view.adminGameId).status = 'online'; });
  if (action === 'add-slide') return update(() => { state.games.find((item) => item.id === view.adminGameId).slides.splice(-1, 0, questionSlide(1, 'Nová otázka', 'Zadej text otázky.', ['odpověď'])); });
  if (action === 'test-game') return update(() => { const game = state.games.find((item) => item.id === view.adminGameId); const run = { id: crypto.randomUUID(), userId: currentUser().id, gameId: game.id, status: 'active', slideIndex: 0, startedAt: Date.now(), score: 0, hintsUsed: {}, wrongAnswers: 0, path: [0] }; state.runs.push(run); view.name = 'play'; view.runId = run.id; view.testMode = true; });
  if (action === 'next-slide' || action === 'skip-slide') return update(() => { const run = state.runs.find((item) => item.id === view.runId); const game = state.games.find((item) => item.id === run.gameId); moveNext(run, game); });
  if (action === 'back-slide') return update(() => { const run = state.runs.find((item) => item.id === view.runId); run.slideIndex = Math.max(0, run.slideIndex - 1); });
  if (action === 'hint') return update(() => { const run = state.runs.find((item) => item.id === view.runId); const game = state.games.find((item) => item.id === run.gameId); const slide = game.slides[run.slideIndex]; const used = run.hintsUsed[slide.id] || 0; if (used >= slide.hints.length) return alert('Žádné další nápovědy.'); run.hintsUsed[slide.id] = used + 1; run.score -= slide.hintPenalty || 0; alert(slide.hints[used]); });
  if (['itinerary', 'inventory', 'audio-message', 'download-mail'].includes(action)) return alert('Tato funkce je v prototypu připravena jako modal/náhled.');
}

function render() {
  if (!currentUser()) root.innerHTML = authView();
  else if (view.name === 'home') root.innerHTML = homeView();
  else if (view.name === 'activate') root.innerHTML = activateView();
  else if (view.name === 'my-games') root.innerHTML = myGamesView();
  else if (view.name === 'leaderboard') root.innerHTML = leaderboardView();
  else if (view.name === 'account') root.innerHTML = accountView();
  else if (view.name === 'admin') root.innerHTML = currentUser().role === 'admin' ? adminView() : homeView();
  else if (view.name === 'play') root.innerHTML = gameView();
  else root.innerHTML = homeView();
}

document.addEventListener('submit', handleSubmit);
document.addEventListener('click', handleClick);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
render();
