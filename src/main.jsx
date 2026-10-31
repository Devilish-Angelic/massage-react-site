import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Menu, X, ArrowUpRight, Clock3, MapPin, Phone, Sparkles, Sun, Moon } from 'lucide-react';
import './style.css';

const services = [
  { title: 'Классический массаж', category: 'Для восстановления', duration: '60 минут', price: '2 500 ₽', desc: 'Мягкая работа с мышцами, снятие напряжения и возвращение ощущения лёгкости.', tags: ['классический', 'расслабляющий', 'массаж'] },
  { title: 'Расслабляющий массаж', category: 'Для отдыха', duration: '60 минут', price: '2 700 ₽', desc: 'Спокойный ритм, плавные движения и полное переключение от повседневной суеты.', tags: ['релакс', 'спа', 'отдых', 'массаж'] },
  { title: 'Спортивный массаж', category: 'Для тела', duration: '45 минут', price: '2 900 ₽', desc: 'Более интенсивная техника для восстановления после тренировок и нагрузок.', tags: ['спорт', 'восстановление', 'массаж'] },
  { title: 'Массаж спины и шеи', category: 'Точечная забота', duration: '30 минут', price: '1 800 ₽', desc: 'Работа с зонами, в которых чаще всего накапливается напряжение.', tags: ['спина', 'шея', 'массаж'] },
  { title: 'Арома-массаж', category: 'Ритуал спокойствия', duration: '75 минут', price: '3 400 ₽', desc: 'Нежные техники и ароматические масла для глубокого расслабления.', tags: ['арома', 'масло', 'спа', 'массаж'] },
  { title: 'Лимфодренажный массаж', category: 'Лёгкость движения', duration: '50 минут', price: '2 600 ₽', desc: 'Деликатная техника, направленная на ощущение лёгкости и комфорта.', tags: ['лимфодренаж', 'тело', 'массаж'] }
];

const articles = [
  { title: 'Как выбрать свой массаж', text: 'Рассказываем, чем отличаются расслабляющие, классические и спортивные техники.' },
  { title: 'Маленькая пауза — большая польза', text: 'Почему регулярный отдых и забота о себе должны быть частью привычного ритма.' },
  { title: 'Первый визит без волнения', text: 'Как проходит знакомство с мастером и что стоит знать перед сеансом.' }
];

// Дистанция Дамерау — Левенштейна: учитывает одну замену, удаление,
// вставку или перестановку соседних букв.
function editDistanceAtMostOne(a, b) {
  a = a.toLocaleLowerCase('ru-RU');
  b = b.toLocaleLowerCase('ru-RU');
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    edits++;
    if (edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  if (i < a.length || j < b.length) edits++;
  return edits <= 1;
}

function fuzzyIncludes(haystack, query) {
  const q = query.trim().toLocaleLowerCase('ru-RU');
  if (!q) return true;
  const text = haystack.toLocaleLowerCase('ru-RU');
  if (text.includes(q)) return true;
  const words = text.split(/[^а-яёa-z0-9]+/i).filter(Boolean);
  // Проверяем и целую фразу, и отдельные слова: «Мессаж» найдёт «массаж».
  return words.some(word => editDistanceAtMostOne(word, q) ||
    (q.length >= 4 && [...word].some((_, index) =>
      editDistanceAtMostOne(word.slice(index, index + q.length), q))));
}

function App() {
  const [tone, setTone] = useState(22);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const palette = useMemo(() => {
    const t = tone / 100;
    const mix = (a, b) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
    const rgb = c => `rgb(${c.join(', ')})`;
    const light = {
      bg: [248, 244, 238], surface: [255, 253, 249], ink: [54, 48, 43],
      muted: [125, 113, 101], primary: [153, 112, 83], secondary: [226, 211, 193], accent: [185, 139, 105]
    };
    const dark = {
      bg: [30, 29, 28], surface: [43, 41, 39], ink: [244, 237, 226],
      muted: [180, 168, 154], primary: [205, 157, 119], secondary: [79, 67, 57], accent: [225, 176, 132]
    };
    return Object.fromEntries(Object.keys(light).map(k => [`--${k}`, rgb(mix(light[k], dark[k]))]));
  }, [tone]);

  const filteredServices = services.filter(s => fuzzyIncludes(
    [s.title, s.category, s.desc, ...s.tags].join(' '), query
  ));
  const filteredArticles = articles.filter(a => fuzzyIncludes(a.title + ' ' + a.text, query));
  const hasQuery = query.trim().length > 0;

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="site" style={palette}>
      <header className="header">
        <a className="brand" href="#top" aria-label="Тихая сила — на главную">
          <span className="brand-mark"><Sparkles size={19}/></span>
          <span>ТИХАЯ СИЛА<small>СТУДИЯ МАССАЖА</small></span>
        </a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <a href="#services" onClick={() => setMenuOpen(false)}>Услуги</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>О студии</a>
          <a href="#contacts" onClick={() => setMenuOpen(false)}>Контакты</a>
          <button className="nav-book" onClick={scrollToBooking}>Записаться <ArrowUpRight size={16}/></button>
        </nav>
        <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
          {menuOpen ? <X/> : <Menu/>}
        </button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span/> ПРОСТРАНСТВО ЗАБОТЫ О СЕБЕ</div>
            <h1>Остановись.<br/><em>Почувствуй</em> себя.</h1>
            <p className="hero-text">Место, где можно выдохнуть, отпустить напряжение и снова услышать своё тело.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={scrollToBooking}>Выбрать массаж <ArrowUpRight size={17}/></button>
              <a className="text-link" href="#services">Посмотреть услуги <span>↓</span></a>
            </div>
            <div className="hero-note"><span className="note-line"/> Индивидуальный подход · Спокойная атмосфера</div>
          </div>
          <div className="hero-art">
            <div className="art-circle circle-one"/><div className="art-circle circle-two"/>
            <div className="art-label">ВРЕМЯ ДЛЯ СЕБЯ <span>✳</span></div>
            <div className="art-caption">slow down<br/><i>and breathe</i></div>
            <div className="art-number">01 / 06</div>
          </div>
        </section>

        <section className="tuner" aria-label="Настройка цветовой темы">
          <div className="tuner-title"><span className="tuner-icon"><Sun size={17}/></span><div><b>Настроение сайта</b><small>Выбери комфортную глубину оттенков</small></div></div>
          <div className="range-wrap">
            <Sun size={17} className="range-sun"/><input aria-label="Яркость цветовой темы" type="range" min="0" max="100" value={tone} onChange={e => setTone(Number(e.target.value))} style={{'--range-progress': `${tone}%`}}/><Moon size={17} className="range-moon"/>
            <div className="range-labels"><span>Светлая тема</span><span>Глубокая тема</span></div>
          </div>
          <div className="swatches"><span/><span/><span/></div>
        </section>

        <section className="search-section">
          <div><div className="eyebrow">НАЙДИ СВОЙ РИТУАЛ</div><h2>Что сегодня нужно <em>тебе?</em></h2></div>
          <label className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Например, массаж спины..." aria-label="Поиск по услугам и статьям"/>{query && <button onClick={() => setQuery('')} aria-label="Очистить поиск"><X size={17}/></button>}</label>
        </section>

        <section className="services section" id="services">
          <div className="section-heading"><div><div className="eyebrow">НАШИ ПРАКТИКИ</div><h2>Выбери своё <em>состояние</em></h2></div><span className="section-count">0{filteredServices.length} / 06</span></div>
          {filteredServices.length ? <div className="service-grid">
            {filteredServices.map((s, i) => <article className="service-card" key={s.title}>
              <div className="card-top"><span>0{i + 1}</span><span className="card-symbol">✳</span></div>
              <div className="card-category">{s.category}</div><h3>{s.title}</h3><p>{s.desc}</p>
              <div className="card-bottom"><span><Clock3 size={14}/> {s.duration}</span><b>{s.price}</b></div>
            </article>)}
          </div> : <div className="empty-state"><Search size={24}/><b>Ничего не нашлось</b><span>Попробуй изменить запрос — поиск понимает небольшие опечатки.</span></div>}
          {hasQuery && filteredArticles.length > 0 && <div className="article-results"><div className="eyebrow">ПОЛЕЗНОЕ ПО ТЕМЕ</div>{filteredArticles.map(a => <div className="article-result" key={a.title}><b>{a.title}</b><span>{a.text}</span></div>)}</div>}
        </section>

        <section className="about section" id="about">
          <div className="about-art"><div className="about-orbit"/><span>ТВОЙ<br/>МOMЕНТ<br/><i>тишины</i></span><small>✳</small></div>
          <div className="about-copy"><div className="eyebrow">НЕ ПРОСТО МАССАЖ</div><h2>Здесь не нужно<br/><em>никуда спешить.</em></h2><p>Мы создали небольшую студию, в которой важна каждая деталь: от тёплого света и спокойной музыки до внимательного отношения мастера.</p><p>Наша философия проста — забота о себе не должна быть редкой наградой. Пусть она станет хорошей привычкой.</p><button className="outline-btn" onClick={scrollToBooking}>Познакомиться со студией <ArrowUpRight size={16}/></button></div>
        </section>

        <section className="booking section" id="booking">
          <div className="booking-copy"><div className="eyebrow">СЛЕДУЮЩИЙ ШАГ — ЗА ТОБОЙ</div><h2>Подарить себе<br/><em>час тишины?</em></h2><p>Оставь заявку, и мы свяжемся с тобой, чтобы подобрать удобное время.</p></div>
          <form className="booking-form" onSubmit={e => {e.preventDefault(); setSubmitted(true);}}>
            {submitted ? <div className="success"><Sparkles size={28}/><h3>Заявка готова!</h3><p>Это демонстрационная форма — подключи отправку, чтобы получать реальные заявки.</p><button type="button" className="outline-btn" onClick={() => setSubmitted(false)}>Заполнить ещё раз</button></div> : <>
              <label>Твоё имя<input required placeholder="Как к тебе обращаться?"/></label>
              <label>Номер телефона<input required type="tel" placeholder="+7 (___) ___-__-__"/></label>
              <label>Что интересует?<select defaultValue=""><option value="" disabled>Выбери услугу</option>{services.map(s => <option key={s.title}>{s.title}</option>)}</select></label>
              <button className="primary-btn form-submit" type="submit">Оставить заявку <ArrowUpRight size={17}/></button>
              <small>Нажимая кнопку, ты соглашаешься на обработку персональных данных.</small>
            </>}</form>
        </section>
      </main>

      <footer id="contacts"><a className="brand footer-brand" href="#top"><span className="brand-mark"><Sparkles size={19}/></span><span>ТИХАЯ СИЛА<small>СТУДИЯ МАССАЖА</small></span></a><div className="footer-info"><span><MapPin size={15}/> Москва, ул. Примерная, 12</span><span><Phone size={15}/> +7 (900) 000-00-00</span></div><span className="copyright">© 2026 Тихая сила</span></footer>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App/>);