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
