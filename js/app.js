'use strict';

// ── DATA ──────────────────────────────────────────────────────────────
const EVENTS = [
  { id:1, title:'Прогулка корги-клуба', tag:'Собаки', emoji:'🐕', bg:'#1a3329', date:'Сб 10:00', place:'Парк Сокольники', price:'Бесплатно', attendees:['АС','МК','ИП'], count:21, desc:'Еженедельная прогулка владельцев корги и других коротколапых. Приходите с питомцами!' },
  { id:2, title:'Книжный клуб: Булгаков', tag:'Книги', emoji:'📚', bg:'#1e1a2e', date:'Вс 18:00', place:'Кофейня «Март»', price:'200 ₽', attendees:['ЕВ','ТН'], count:9, desc:'Обсуждаем "Мастера и Маргариту". Читать не обязательно — приходите просто поговорить.' },
  { id:3, title:'Утренний бег: 5 км', tag:'Бег', emoji:'🏃', bg:'#2a1f0a', date:'Пн 07:30', place:'Лужники', price:'Бесплатно', attendees:['ДМ','КА','ОС'], count:34, desc:'Пробежка для всех уровней подготовки. Темп 6 мин/км. После — кофе вместе.' },
  { id:4, title:'Стартап-завтрак', tag:'Стартапы', emoji:'💡', bg:'#1a2a1e', date:'Ср 09:00', place:'Кластер «Ломоносов»', price:'500 ₽', attendees:['АК','ВС'], count:28, desc:'Нетворкинг для основателей и тех, кто думает запустить свой проект.' },
  { id:5, title:'Джем-сессия: акустика', tag:'Музыка', emoji:'🎸', bg:'#2a1a1a', date:'Пт 19:00', place:'Бар «Точка»', price:'300 ₽', attendees:['НП','СД','ЮА'], count:15, desc:'Приносите инструменты или просто приходите слушать. Жанр свободный.' },
  { id:6, title:'Настольные игры: новичкам', tag:'Настолки', emoji:'🎲', bg:'#1a1e2a', date:'Чт 18:30', place:'Антикафе «Игра»', price:'250 ₽/час', attendees:['МВ','РС'], count:12, desc:'Объясняем правила, подбираем игры под настроение. Идеально для первого раза.' },
  { id:7, title:'Фото-прогулка: рассвет', tag:'Фото', emoji:'📷', bg:'#1a2225', date:'Сб 05:30', place:'Воробьёвы горы', price:'Бесплатно', attendees:['ЛК'], count:7, desc:'Снимаем рассвет над Москвой. Любой уровень, любая техника.' },
  { id:8, title:'Йога в парке', tag:'Йога', emoji:'🧘', bg:'#1e2a1a', date:'Вс 09:00', place:'Парк Горького', price:'Бесплатно', attendees:['ИС','АМ','ТВ'], count:19, desc:'Хатха-йога на свежем воздухе. Коврики берём с собой.' },
];

const CLUBS = [
  { id:1, name:'Корги Москвы', tag:'Собаки', emoji:'🐕', bg:'#1a3329', members:234, freq:'2 события в мес.', mine:true },
  { id:2, name:'Книжный клуб', tag:'Книги', emoji:'📚', bg:'#1e1a2e', members:89, freq:'4 события в мес.', mine:true },
  { id:3, name:'Бегуны Сокольников', tag:'Бег', emoji:'🏃', bg:'#2a1f0a', members:512, freq:'Каждое утро', mine:false },
  { id:4, name:'Джемы и живая музыка', tag:'Музыка', emoji:'🎸', bg:'#2a1a1a', members:167, freq:'Каждую пятницу', mine:false },
  { id:5, name:'Стартап-клуб Москвы', tag:'Стартапы', emoji:'💡', bg:'#1a2a1e', members:341, freq:'1 событие в нед.', mine:false },
  { id:6, name:'Настольные игры', tag:'Настолки', emoji:'🎲', bg:'#1a1e2a', members:203, freq:'2 раза в нед.', mine:false },
];

const MATCHES = [
  { name:'Анна С.', city:'Москва, Сокольники', initials:'АС', bg:'#1a3329', color:'#5DCAA5', pct:87, tags:['Корги','Книги','Стартапы'], reason:'Оба ходите в книжный клуб и оба записались на прогулку корги в эту субботу' },
  { name:'Михаил К.', city:'Москва, Арбат', initials:'МК', bg:'#1e1a2e', color:'#AFA9EC', pct:74, tags:['Инвестиции','Стартапы'], reason:'Оба интересуетесь стартапами и инвестициями. Михаил — основатель, вы думаете о своём проекте' },
  { name:'Татьяна Н.', city:'Москва, Чистые пруды', initials:'ТН', bg:'#2a1f0a', color:'#EF9F27', pct:61, tags:['Книги','Кино'], reason:'Одинаковые литературные вкусы — оба отметили Булгакова и Достоевского' },
  { name:'Дмитрий Р.', city:'Москва, Замоскворечье', initials:'ДР', bg:'#1a2a1e', color:'#97C459', pct:55, tags:['Бег','Велосипед'], reason:'Регулярно бегаете в одном районе. Дмитрий ищет партнёра для утренних пробежек' },
];

// ── STATE ──────────────────────────────────────────────────────────────
let state = {
  name: '', city: 'Москва', interests: [], role: '',
  going: new Set(),
  joinedClubs: new Set([1, 2]),
  skippedMatches: new Set(),
  activeFilter: 'all',
};

// ── INIT ──────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
  const saved = localStorage.getItem('krugi_user');
  if (saved) {
    Object.assign(state, JSON.parse(saved));
    state.going = new Set(state.going || []);
    state.joinedClubs = new Set(state.joinedClubs || [1, 2]);
    state.skippedMatches = new Set(state.skippedMatches || []);
    showApp();
  } else {
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      show('onboard');
    }, 2200);
  }

  // Interest buttons
  document.querySelectorAll('.int-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('sel');
      const tag = btn.dataset.tag;
      if (btn.classList.contains('sel')) {
        state.interests.push(tag);
      } else {
        state.interests = state.interests.filter(t => t !== tag);
      }
    });
  });

  // Role buttons
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
      state.role = btn.dataset.role;
    });
  });

  // Filter tags
  document.querySelectorAll('.filter-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeFilter = btn.dataset.filter;
      renderEvents();
    });
  });

  // Close modals on overlay click
  document.getElementById('eventModal').addEventListener('click', e => {
    if (e.target === document.getElementById('eventModal')) hideModal('eventModal');
  });
  document.getElementById('createClubModal').addEventListener('click', e => {
    if (e.target === document.getElementById('createClubModal')) hideModal('createClubModal');
  });
});

// ── ONBOARDING ──────────────────────────────────────────────────────
function goStep(n) {
  if (n === 2) {
    const name = document.getElementById('userName').value.trim();
    if (!name) { toast('Введите ваше имя'); return; }
    state.name = name;
    state.city = document.getElementById('userCity').value;
  }
  if (n === 3 && state.interests.length === 0) {
    toast('Выберите хотя бы один интерес');
    return;
  }
  document.querySelectorAll('.onboard-step').forEach(s => s.classList.remove('active'));
  document.getElementById(`step-${n}`).classList.add('active');
}

function finishOnboard() {
  if (!state.role) { toast('Выберите, кто вы'); return; }
  saveState();
  hide('onboard');
  showApp();
}

// ── APP ──────────────────────────────────────────────────────────────
function showApp() {
  show('app');
  const initials = (state.name || 'Я').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  document.getElementById('topbarAvatar').textContent = initials;
  document.getElementById('topbarCity').textContent = state.city;
  document.getElementById('feedGreeting').textContent = `Привет, ${state.name || 'друг'}!`;
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileName').textContent = state.name || 'Пользователь';
  document.getElementById('profileCityLabel').textContent = state.city;

  const tagsEl = document.getElementById('profileTags');
  tagsEl.innerHTML = (state.interests.slice(0, 6)).map(t => `<span class="profile-tag">${t}</span>`).join('');

  const filtered = EVENTS.filter(e => state.interests.length === 0 || state.interests.includes(e.tag));
  const count = filtered.length || EVENTS.length;
  document.getElementById('feedCount').textContent = `${count} событий на этой неделе`;

  renderEvents();
  renderClubs();
  renderMatches();
}

// ── RENDER EVENTS ────────────────────────────────────────────────────
function renderEvents() {
  const list = document.getElementById('eventsList');
  const filter = state.activeFilter;
  let events = EVENTS;
  if (filter !== 'all') events = events.filter(e => e.tag === filter);

  if (events.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div>Нет событий по этому фильтру.<br>Попробуйте другую категорию.</div>`;
    return;
  }

  list.innerHTML = events.map(e => {
    const going = state.going.has(e.id);
    const avas = e.attendees.map((a, i) => `<div class="ava" style="background:${['#1D9E75','#534AB7','#BA7517'][i%3]};color:#fff">${a}</div>`).join('');
    return `
    <div class="event-card" onclick="openEvent(${e.id})">
      <div class="event-banner" style="background:${e.bg}">${e.emoji}</div>
      <div class="event-body">
        <div class="event-title">${e.title}</div>
        <div class="event-meta">${e.date} · ${e.place} · ${e.price}</div>
        <div class="event-footer">
          <div style="display:flex;align-items:center;">
            <div class="avatar-stack">${avas}</div>
            <span class="ava-count">+${going ? e.count + 1 : e.count} идут</span>
          </div>
          <button class="go-btn ${going ? 'going' : ''}" onclick="toggleGoing(event,${e.id})">${going ? 'Иду ✓' : 'Иду'}</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleGoing(ev, id) {
  ev.stopPropagation();
  if (state.going.has(id)) {
    state.going.delete(id);
    toast('Отменено');
  } else {
    state.going.add(id);
    toast('Вы идёте! 🎉');
  }
  saveState();
  renderEvents();
}

// ── RENDER CLUBS ──────────────────────────────────────────────────────
function renderClubs() {
  const mine = CLUBS.filter(c => state.joinedClubs.has(c.id));
  const rec = CLUBS.filter(c => !state.joinedClubs.has(c.id));

  document.getElementById('myClubsList').innerHTML = mine.length
    ? mine.map(clubCard).join('')
    : `<div class="empty-state"><div class="empty-icon">👥</div>Вы ещё не вступили ни в один клуб.<br>Посмотрите рекомендации ниже.</div>`;

  document.getElementById('recClubsList').innerHTML = rec.map(c => clubCard(c, true)).join('');
}

function clubCard(c, showJoin = false) {
  return `
  <div class="club-card">
    <div class="club-icon" style="background:${c.bg}">${c.emoji}</div>
    <div class="club-info">
      <div class="club-name">${c.name}</div>
      <div class="club-sub">${c.members.toLocaleString('ru')} участников · ${c.freq}</div>
    </div>
    ${showJoin
      ? `<button class="club-join" onclick="joinClub(${c.id})">Вступить</button>`
      : `<span class="club-chevron">›</span>`}
  </div>`;
}

function joinClub(id) {
  state.joinedClubs.add(id);
  saveState();
  renderClubs();
  toast('Вы вступили в клуб! 🎉');
}

// ── RENDER MATCHES ────────────────────────────────────────────────────
function renderMatches() {
  const list = document.getElementById('matchesList');
  const visible = MATCHES.filter((_, i) => !state.skippedMatches.has(i));

  if (visible.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">✨</div>Вы просмотрели все совпадения.<br>Скоро появятся новые.</div>`;
    return;
  }

  list.innerHTML = visible.map((m, i) => `
  <div class="match-card" id="match-${i}">
    <div class="match-head">
      <div class="match-ava" style="background:${m.bg};color:${m.color}">${m.initials}</div>
      <div>
        <div class="match-name">${m.name}</div>
        <div class="match-city-lbl">${m.city}</div>
      </div>
      <div class="match-pct">${m.pct}%</div>
    </div>
    <div class="match-tags">${m.tags.map(t => `<span class="match-tag">${t}</span>`).join('')}</div>
    <div class="match-reason">${m.reason}</div>
    <div class="match-actions">
      <button class="match-skip" onclick="skipMatch(${MATCHES.indexOf(m)})">Пропустить</button>
      <button class="match-connect" onclick="connectMatch('${m.name}')">Познакомиться →</button>
    </div>
  </div>`).join('');
}

function skipMatch(i) {
  state.skippedMatches.add(i);
  saveState();
  renderMatches();
}

function connectMatch(name) {
  toast(`Запрос отправлен ${name}! 👋`);
}

// ── EVENT MODAL ───────────────────────────────────────────────────────
function openEvent(id) {
  const e = EVENTS.find(ev => ev.id === id);
  if (!e) return;
  const going = state.going.has(e.id);
  const avas = e.attendees.map((a, i) => `<div class="ava" style="width:28px;height:28px;font-size:11px;background:${['#1D9E75','#534AB7','#BA7517'][i%3]};color:#fff">${a}</div>`).join('');

  document.getElementById('eventModalContent').innerHTML = `
    <div class="modal-header">
      <h3 class="modal-title">${e.title}</h3>
      <button class="modal-close" onclick="hideModal('eventModal')">✕</button>
    </div>
    <div class="modal-event-banner" style="background:${e.bg}">${e.emoji}</div>
    <div class="modal-event-title">${e.title}</div>
    <div class="modal-event-meta">
      <span>📅 ${e.date}</span>
      <span>📍 ${e.place}</span>
      <span>💰 ${e.price}</span>
    </div>
    <p style="font-size:13px;color:var(--text2);line-height:1.6;margin-bottom:16px;">${e.desc}</p>
    <div class="modal-attendees">
      <div class="modal-attendees-label">${going ? e.count + 1 : e.count} участников идут</div>
      <div class="modal-attendees-row">
        <div class="avatar-stack">${avas}</div>
      </div>
    </div>
    <button class="modal-btn ${going ? 'going' : ''}" onclick="toggleGoing(event,${e.id});hideModal('eventModal')" style="${going ? 'background:transparent;border:1px solid var(--accent);color:var(--accent);' : ''}">
      ${going ? 'Отменить участие' : 'Записаться →'}
    </button>`;
  show('eventModal');
}

// ── CREATE CLUB ───────────────────────────────────────────────────────
function showCreateClub() { show('createClubModal'); }

function createClub() {
  const name = document.getElementById('newClubName').value.trim();
  const tag = document.getElementById('newClubTag').value;
  if (!name) { toast('Введите название клуба'); return; }
  if (!tag) { toast('Выберите тематику'); return; }

  const emojis = { Собаки:'🐕',Книги:'📚',Бег:'🏃',Стартапы:'💡',Йога:'🧘',Кино:'🎬',Настолки:'🎲',Фото:'📷',Велосипед:'🚴',Музыка:'🎸',Походы:'⛺',Готовка:'👨‍🍳' };
  const newId = Date.now();
  CLUBS.push({ id: newId, name, tag, emoji: emojis[tag] || '⭐', bg:'#1a2225', members:1, freq:'Новый клуб', mine:true });
  state.joinedClubs.add(newId);
  saveState();
  hideModal('createClubModal');
  document.getElementById('newClubName').value = '';
  document.getElementById('newClubDesc').value = '';
  renderClubs();
  toast(`Клуб «${name}» создан! 🎉`);
  switchScreen('clubs', document.querySelector('[data-screen="clubs"]'));
}

// ── NAV & SCREENS ──────────────────────────────────────────────────────
function switchScreen(name, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(`screen-${name}`).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// ── HELPERS ───────────────────────────────────────────────────────────
function show(id) { document.getElementById(id).classList.remove('hidden'); }
function hide(id) { document.getElementById(id).classList.add('hidden'); }
function hideModal(id) { document.getElementById(id).classList.add('hidden'); }

function toast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2200);
}

function saveState() {
  const toSave = {
    ...state,
    going: [...state.going],
    joinedClubs: [...state.joinedClubs],
    skippedMatches: [...state.skippedMatches],
  };
  localStorage.setItem('krugi_user', JSON.stringify(toSave));
}

function resetApp() {
  if (!confirm('Сбросить профиль и начать заново?')) return;
  localStorage.removeItem('krugi_user');
  location.reload();
}

// ── MAP DATA ─────────────────────────────────────────────────────────
const MAP_MARKERS = [
  { clubId:1, left:'24%', top:'34%' },
  { clubId:2, left:'63%', top:'26%' },
  { clubId:3, left:'76%', top:'54%' },
  { clubId:4, left:'39%', top:'68%' },
  { clubId:5, left:'55%', top:'19%' },
  { clubId:6, left:'18%', top:'58%' },
];

let selectedMapClub = null;

function renderMap() {
  const markersEl = document.getElementById('mapMarkers');
  markersEl.innerHTML = MAP_MARKERS.map(m => {
    const c = CLUBS.find(cl => cl.id === m.clubId);
    if (!c) return '';
    return `
    <div class="map-marker" id="mm-${c.id}" style="left:${m.left};top:${m.top};" onclick="selectMapClub(${c.id})">
      <div class="marker-pin" style="background:${c.bg};">
        <span class="marker-emoji">${c.emoji}</span>
      </div>
      <div class="marker-label">${c.name.split(' ')[0]} · ${c.members}</div>
    </div>`;
  }).join('');

  // select first by default
  selectMapClub(CLUBS[0].id);
}

function selectMapClub(id) {
  selectedMapClub = id;
  document.querySelectorAll('.map-marker').forEach(m => m.classList.remove('selected'));
  const el = document.getElementById('mm-' + id);
  if (el) el.classList.add('selected');

  const c = CLUBS.find(cl => cl.id === id);
  if (!c) return;

  document.getElementById('mapBottomInner').innerHTML = `
    <div class="map-card-row">
      <div class="map-card-icon" style="background:${c.bg};">${c.emoji}</div>
      <div>
        <div class="map-card-title">${c.name}</div>
        <div class="map-card-sub">${c.members.toLocaleString('ru')} участников · ${c.freq}</div>
      </div>
      <button class="map-card-btn" onclick="openClubPage(${c.id}, 'map')">Открыть →</button>
    </div>`;
}

function mapFilter(type, btn) {
  document.querySelectorAll('.map-filt').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── CLUB PAGE ─────────────────────────────────────────────────────────
let currentClubId = null;
let clubFromScreen = 'clubs';

const CLUB_MEMBERS = {
  1: [
    { initials:'АС', bg:'#1a3329', color:'#5DCAA5', name:'Анна С.', role:'Организатор · Сокольники', pct:92 },
    { initials:'МК', bg:'#1e1a2e', color:'#AFA9EC', name:'Михаил К.', role:'Участник · Арбат', pct:74 },
    { initials:'ТН', bg:'#2a1f0a', color:'#EF9F27', name:'Татьяна Н.', role:'Участник · Чистые пруды', pct:61 },
  ],
  2: [
    { initials:'ЕВ', bg:'#1e1a2e', color:'#AFA9EC', name:'Елена В.', role:'Организатор · Арбат', pct:88 },
    { initials:'ТН', bg:'#2a1f0a', color:'#EF9F27', name:'Татьяна Н.', role:'Участник', pct:71 },
  ],
};

const CLUB_DESCS = {
  1: 'Еженедельные прогулки владельцев корги и других коротколапых. Приходите с питомцами, знакомьтесь с хозяевами.',
  2: 'Обсуждаем книги раз в две недели. Русская и зарубежная классика, современная проза. Читать необязательно.',
  3: 'Бегаем каждое утро от Лужников. Темп 6 мин/км, после — кофе. Для всех уровней.',
  4: 'Живые джем-сессии каждую пятницу. Приносите инструменты или просто приходите слушать.',
  5: 'Нетворкинг для основателей и тех, кто думает о своём проекте. Завтраки, лекции, демо-дни.',
  6: 'Играем в настолки дважды в неделю. Объясняем правила, подбираем игры по настроению.',
};

function openClubPage(id, fromScreen) {
  currentClubId = id;
  clubFromScreen = fromScreen || 'clubs';
  const c = CLUBS.find(cl => cl.id === id);
  if (!c) return;

  document.getElementById('clubBackLabel').textContent = fromScreen === 'map' ? 'Карта' : 'Клубы';
  document.getElementById('clubHero').style.background = c.bg;
  document.getElementById('clubHero').textContent = c.emoji;
  document.getElementById('clubInfoName').textContent = c.name;
  document.getElementById('clubInfoMeta').textContent = `${c.members.toLocaleString('ru')} участников · ${c.freq}`;
  document.getElementById('clubInfoTags').innerHTML = `<span class="club-info-tag">${c.tag}</span>`;
  document.getElementById('clubInfoDesc').textContent = CLUB_DESCS[c.id] || 'Клуб по интересам.';

  const joined = state.joinedClubs.has(id);
  const btn = document.getElementById('clubJoinBtn');
  btn.textContent = joined ? 'Вы участник ✓' : 'Вступить в клуб';
  btn.className = 'club-join-big' + (joined ? ' joined' : '');
  const adminBtn = document.getElementById('clubAdminBtn');
  if (adminBtn) adminBtn.style.display = c.mine ? 'block' : 'none';

  // events for this club tag
  const clubEvents = EVENTS.filter(e => e.tag === c.tag).slice(0, 2);
  document.getElementById('clubEventsList').innerHTML = clubEvents.map(e => `
    <div class="club-event-row">
      <div class="club-event-icon" style="background:${e.bg};">${e.emoji}</div>
      <div>
        <div class="club-event-title">${e.title}</div>
        <div class="club-event-meta">${e.date} · ${e.place} · ${e.price}</div>
      </div>
      <button class="club-event-btn" onclick="toggleGoing(event,${e.id})">${state.going.has(e.id) ? 'Иду ✓' : 'Иду'}</button>
    </div>`).join('') || '<div style="padding:12px 16px;font-size:13px;color:var(--text3);">Событий пока нет</div>';

  // members
  const members = CLUB_MEMBERS[id] || [];
  document.getElementById('clubMembersList').innerHTML = members.map(m => `
    <div class="club-member-row">
      <div class="club-member-ava" style="background:${m.bg};color:${m.color};">${m.initials}</div>
      <div>
        <div class="club-member-name">${m.name}</div>
        <div class="club-member-role">${m.role}</div>
      </div>
      <span class="club-member-pct">${m.pct}% совпадение</span>
    </div>`).join('')
    + `<div style="padding:10px 16px;font-size:12px;color:var(--text3);text-align:center;">+ ещё ${c.members - members.length} участников</div>`;

  switchScreen('club', null);
}

function joinCurrentClub() {
  if (!currentClubId) return;
  if (state.joinedClubs.has(currentClubId)) return;
  joinClub(currentClubId);
  const btn = document.getElementById('clubJoinBtn');
  btn.textContent = 'Вы участник ✓';
  btn.className = 'club-join-big joined';
}

// patch club cards to be clickable
const _origClubCard = clubCard;
// override clubCard to open club page on click
function clubCard(c, showJoin = false) {
  return `
  <div class="club-card" onclick="openClubPage(${c.id}, 'clubs')">
    <div class="club-icon" style="background:${c.bg}">${c.emoji}</div>
    <div class="club-info">
      <div class="club-name">${c.name}</div>
      <div class="club-sub">${c.members.toLocaleString('ru')} участников · ${c.freq}</div>
    </div>
    ${showJoin
      ? `<button class="club-join" onclick="event.stopPropagation();joinClub(${c.id})">Вступить</button>`
      : `<span class="club-chevron">›</span>`}
  </div>`;
}

// patch switchScreen to render map on first open
const _origSwitchScreen = switchScreen;
function switchScreen(name, btn) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (name === 'map') renderMap();
  if (name === 'club') {
    // no nav highlight for club page
  }
}

// ── INTERESTS PAGE ────────────────────────────────────────────────────
const ALL_INTERESTS = [
  '🐕 Собаки','📚 Книги','🏃 Бег','💡 Стартапы','🧘 Йога','🎬 Кино',
  '🎲 Настолки','📷 Фото','🚴 Велосипед','📈 Инвестиции','🎸 Музыка',
  '⛺ Походы','👨‍🍳 Готовка','🌍 Языки','🎨 Искусство','💃 Танцы'
];

function openInterests() {
  renderInterestsPage();
  switchScreen('interests', null);
}

function renderInterestsPage() {
  const sel = document.getElementById('selectedTagsPage');
  const all = document.getElementById('allTagsPage');

  sel.innerHTML = state.interests.map(t => `
    <span class="int-tag sel" onclick="removeInterest('${t}')">${t} ✕</span>`).join('');
  if (!sel.innerHTML) sel.innerHTML = '<span style="font-size:12px;color:var(--text3);">Пока не выбрано</span>';

  all.innerHTML = ALL_INTERESTS
    .filter(t => !state.interests.includes(t.split(' ').slice(1).join(' ')))
    .map(t => `<span class="int-tag" onclick="toggleInterestTag(this,'${t}')">${t}</span>`).join('');
}

function removeInterest(tag) {
  state.interests = state.interests.filter(t => t !== tag);
  renderInterestsPage();
}

function toggleInterestTag(el, tag) {
  el.classList.toggle('sel');
  const label = tag.split(' ').slice(1).join(' ');
  if (el.classList.contains('sel')) {
    if (!state.interests.includes(label)) state.interests.push(label);
  } else {
    state.interests = state.interests.filter(t => t !== label);
  }
}

function addCustomInterest() {
  const inp = document.getElementById('customInterestInput');
  const val = inp.value.trim();
  if (!val) { toast('Введите название интереса'); return; }
  if (!state.interests.includes(val)) state.interests.push(val);
  inp.value = '';
  renderInterestsPage();
  toast('Интерес добавлен!');
}

function addSuggestInterest(el) {
  const label = el.textContent.split(' ').slice(1).join(' ');
  if (!state.interests.includes(label)) state.interests.push(label);
  el.classList.add('used');
  renderInterestsPage();
}

function saveInterests() {
  saveState();
  renderMatches();
  const tagsEl = document.getElementById('profileTags');
  if (tagsEl) tagsEl.innerHTML = state.interests.slice(0,6).map(t => `<span class="profile-tag">${t}</span>`).join('');
  switchScreen('profile', document.querySelector('[data-screen=profile]'));
  toast('Интересы сохранены!');
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────
function openAdminPage(clubId) {
  const c = CLUBS.find(cl => cl.id === clubId);
  if (!c) return;

  document.getElementById('adminBackLabel').textContent = c.name;
  document.getElementById('adminClubHeader').innerHTML = `
    <div class="club-icon-sm" style="background:${c.bg};">${c.emoji}</div>
    <div>
      <div style="font-size:14px;font-weight:500;color:var(--text);">${c.name}</div>
      <span class="club-role-badge">Организатор</span>
    </div>`;

  document.getElementById('adminStats').innerHTML = `
    <div class="admin-stat"><div class="admin-stat-n">${c.members}</div><div class="admin-stat-l">участников</div></div>
    <div class="admin-stat"><div class="admin-stat-n">12</div><div class="admin-stat-l">событий</div></div>
    <div class="admin-stat"><div class="admin-stat-n">+18</div><div class="admin-stat-l">за месяц</div></div>`;

  document.getElementById('adminMenuItems').innerHTML = `
    <div class="admin-menu-item">
      <div class="admin-menu-icon" style="background:#1a3329;">📅</div>
      <div><div class="admin-menu-name">Создать событие</div><div class="admin-menu-desc">Новое мероприятие для клуба</div></div>
      <span style="color:var(--text3);font-size:16px;">›</span>
    </div>
    <div class="admin-menu-item">
      <div class="admin-menu-icon" style="background:#1e1a2e;">📢</div>
      <div><div class="admin-menu-name">Объявление участникам</div><div class="admin-menu-desc">Отправить сообщение всем</div></div>
      <span class="admin-badge pro">Pro</span>
    </div>
    <div class="admin-menu-item">
      <div class="admin-menu-icon" style="background:#2a1f0a;">✅</div>
      <div><div class="admin-menu-name">Заявки на вступление</div><div class="admin-menu-desc">3 заявки ожидают</div></div>
      <span class="admin-badge warn">3</span>
    </div>
    <div class="admin-menu-item">
      <div class="admin-menu-icon" style="background:#1a2a1e;">📊</div>
      <div><div class="admin-menu-name">Аналитика клуба</div><div class="admin-menu-desc">Рост, активность, удержание</div></div>
      <span class="admin-badge pro">Pro</span>
    </div>`;

  const members = CLUB_MEMBERS[clubId] || [];
  document.getElementById('adminMembersList').innerHTML = members.map((m, i) => `
    <div class="member-manage-row">
      <div class="mm-ava" style="background:${m.bg};color:${m.color};">${m.initials}</div>
      <div style="flex:1;">
        <div class="mm-name">${m.name}</div>
        <div class="mm-role">${m.role}</div>
      </div>
      <div class="mm-btns">
        ${i === 0 ? '' : `<button class="mm-btn promote" onclick="toast('${m.name} назначен модератором')">Модер.</button>
        <button class="mm-btn remove" onclick="toast('${m.name} удалён из клуба')">Удалить</button>`}
      </div>
    </div>`).join('');

  switchScreen('admin', null);
}
