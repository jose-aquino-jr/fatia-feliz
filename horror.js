'use strict';
/* ============ UTILITÁRIOS ============ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const brl = c => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // valores em centavos
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ============ DADOS (adicione novos produtos aqui) ============ */
const CATS = [
  { id: 'pizzas', name: 'Pizzas' }, { id: 'bebidas', name: 'Bebidas' },
  { id: 'acomp', name: 'Acompanhamentos' }, { id: 'sobremesas', name: 'Sobremesas' },
  { id: 'combos', name: 'Combos' }
];
const BASE = { dough: 'tradicional', border: 'tradicional', sauce: 'tradicional', cheese: 'mussarela' };
const PRODUCTS = [
  { id: 'p1', cat: 'pizzas', name: 'Pizza Calabresa', desc: 'Molho de tomate, mussarela, calabresa e cebola.', price: 3990, image: 'assets/pizza-calabresa.jpg', cfg: { ...BASE, ings: ['calabresa', 'cebola'] } },
  { id: 'p2', cat: 'pizzas', name: 'Pizza Mussarela', desc: 'Molho de tomate, mussarela, tomate e azeitona.', price: 3490, image: 'assets/pizza-mussarela.jpg', cfg: { ...BASE, ings: ['tomate', 'azeitona'] } },
  { id: 'p3', cat: 'pizzas', name: 'Pizza Pepperoni', desc: 'Molho de tomate, mussarela e muito pepperoni.', price: 4390, image: 'assets/pizza-pepperoni.jpg', cfg: { ...BASE, ings: ['pepperoni'] } },
  { id: 'p4', cat: 'pizzas', name: 'Frango c/ Catupiry', desc: 'Frango desfiado, milho e catupiry cremoso.', price: 4290, image: 'assets/pizza-frango.jpg', cfg: { ...BASE, cheese: 'catupiry', ings: ['frango', 'milho'] } },
  { id: 'p5', cat: 'pizzas', name: 'Pizza Portuguesa', desc: 'Presunto, cebola, tomate, azeitona e mussarela.', price: 4490, image: 'assets/pizza-portuguesa.jpg', cfg: { ...BASE, ings: ['presunto', 'cebola', 'tomate', 'azeitona'] } },
  { id: 'p6', cat: 'pizzas', name: 'Pizza Bacon', desc: 'Mussarela, bacon crocante e milho.', price: 4290, image: 'assets/pizza-bacon.jpg', cfg: { ...BASE, ings: ['bacon', 'milho'] } },
  { id: 'b1', cat: 'bebidas', name: 'Refrigerante lata', desc: '350 ml, bem gelado.', price: 600, image: 'assets/refrigerante-lata.jpg' },
  { id: 'b2', cat: 'bebidas', name: 'Refrigerante 2L', desc: 'Ideal para dividir.', price: 1400, image: 'assets/refrigerante.jpg' },
  { id: 'b3', cat: 'bebidas', name: 'Suco natural', desc: 'Laranja, 400 ml.', price: 900, image: 'assets/suco.jpg' },
  { id: 'b4', cat: 'bebidas', name: 'Água mineral', desc: '500 ml, sem gás.', price: 500, image: 'assets/agua.jpg' },
  { id: 'a1', cat: 'acomp', name: 'Batata frita', desc: 'Porção crocante com sal.', price: 1890, image: 'assets/batata.jpg' },
  { id: 'a2', cat: 'acomp', name: 'Pão de alho', desc: '6 unidades com manteiga de alho.', price: 1590, image: 'assets/pao-de-alho.jpg' },
  { id: 'a3', cat: 'acomp', name: 'Anéis de cebola', desc: 'Empanados e sequinhos.', price: 1990, image: 'assets/aneis-de-cebola.jpg' },
  { id: 's1', cat: 'sobremesas', name: 'Brownie', desc: 'Chocolate intenso, quentinho.', price: 1490, image: 'assets/brownie.jpg' },
  { id: 's2', cat: 'sobremesas', name: 'Sorvete', desc: 'Duas bolas à sua escolha.', price: 1290, image: 'assets/sorvete.jpg' },
  { id: 's3', cat: 'sobremesas', name: 'Fatia de bolo', desc: 'Bolo da casa com cobertura.', price: 1390, image: 'assets/bolo.jpg' },
  { id: 'c1', cat: 'combos', name: 'Combo Solo', desc: 'Pizza pequena + refrigerante lata.', price: 3490, image: 'assets/pizza-mussarela.jpg' },
  { id: 'c2', cat: 'combos', name: 'Combo Casal', desc: 'Pizza grande + refrigerante 2L.', price: 6290, image: 'assets/pizza-calabresa.jpg' },
  { id: 'c3', cat: 'combos', name: 'Combo Família', desc: 'Pizza família + 2L + batata frita.', price: 8490, image: 'assets/pizza-pepperoni.jpg' }
];

// Opções da pizza personalizada: [id, nome, preço em centavos]
const OPT = {
  size: [['pequena', 'Pequena', 2900], ['media', 'Média', 3500], ['grande', 'Grande', 4500], ['familia', 'Família', 5500]],
  dough: [['tradicional', 'Tradicional', 0], ['fina', 'Fina', 0], ['integral', 'Integral', 300]],
  border: [['tradicional', 'Tradicional', 0], ['catupiry', 'Catupiry', 600], ['cheddar', 'Cheddar', 600]],
  sauce: [['tradicional', 'Tradicional', 0], ['barbecue', 'Barbecue', 200], ['branco', 'Branco', 200]],
  cheese: [['mussarela', 'Mussarela', 0], ['catupiry', 'Catupiry', 400], ['cheddar', 'Cheddar', 400], ['parmesao', 'Parmesão', 500]]
};
const GROUPS = [['size', 'Tamanho'], ['dough', 'Massa'], ['border', 'Borda'], ['sauce', 'Molho'], ['cheese', 'Queijo']];

// Ingredientes: nome, preço, quantidade de peças e desenho (centrado em 0,0)
const ING = {
  calabresa: { n: 'Calabresa', p: 400, c: 9, d: '<circle r="7" fill="#B5342B"/><circle cx="-2" cy="-2" r="1.3" fill="#E8756B"/><circle cx="2.5" cy="2" r="1.2" fill="#E8756B"/>' },
  pepperoni: { n: 'Pepperoni', p: 500, c: 9, d: '<circle r="7.5" fill="#8E1B1B"/><circle cx="2" cy="-2" r="2" fill="#C0392B"/>' },
  bacon: { n: 'Bacon', p: 400, c: 8, d: '<rect x="-9" y="-3" width="18" height="6" rx="2" fill="#C4574A"/><rect x="-9" y="-.5" width="18" height="2" fill="#F1B6A8"/>' },
  frango: { n: 'Frango', p: 400, c: 8, d: '<ellipse rx="7" ry="5" fill="#F3D9A4" stroke="#D9B26F" stroke-width="1"/>' },
  presunto: { n: 'Presunto', p: 350, c: 8, d: '<rect x="-7" y="-6" width="14" height="12" rx="3" fill="#F4A5B0"/>' },
  cebola: { n: 'Cebola', p: 200, c: 10, d: '<circle r="6" fill="none" stroke="#F6EBFA" stroke-width="2"/>' },
  tomate: { n: 'Tomate', p: 200, c: 8, d: '<circle r="6" fill="#E4372B"/><circle r="3" fill="#F26B5E"/>' },
  milho: { n: 'Milho', p: 200, c: 14, d: '<circle cx="-2" r="2.2" fill="#FFD23F"/><circle cx="2.5" cy="-1" r="2.2" fill="#FFD23F"/><circle cx="1" cy="3" r="2.2" fill="#FFD23F"/>' },
  azeitona: { n: 'Azeitona', p: 200, c: 9, d: '<circle r="4.5" fill="#2B2B2B"/><circle r="1.6" fill="#777"/>' },
  champignon: { n: 'Champignon', p: 350, c: 8, d: '<rect x="-2.5" y="0" width="5" height="6" rx="1.5" fill="#D7C6A5"/><ellipse rx="7" ry="5" cy="-1" fill="#E9DCC3"/>' }
};
const ING_KEYS = Object.keys(ING);
const PAY = { pix: 'PIX', credito: 'Crédito', debito: 'Débito', dinheiro: 'Dinheiro' };

/* ============ ESTADO ============ */
const S = { cat: 'pizzas', cart: [], cfg: null, pay: 'pix', received: 0 };
const optName = (g, id) => (OPT[g].find(o => o[0] === id) || [, ''])[1];
const optPrice = (g, id) => (OPT[g].find(o => o[0] === id) || [0, 0, 0])[2];

/* ============ VISUAL (fotografia de produto e marca) ============ */
function pizzaPhoto(c) {
  const image = c.ings.includes('pepperoni') ? 'assets/pizza-pepperoni.jpg'
    : c.ings.includes('calabresa') ? 'assets/pizza-calabresa.jpg'
      : c.ings.includes('bacon') ? 'assets/pizza-bacon.jpg'
        : c.ings.includes('frango') ? 'assets/pizza-frango.jpg'
          : c.ings.includes('presunto') ? 'assets/pizza-portuguesa.jpg' : 'assets/pizza-mussarela.jpg';
  const toppings = c.ings.length ? c.ings.map(k => ING[k].n).join(' · ') : 'Sem ingredientes adicionais';
  return `<div class="pizza-photo-wrap"><img src="${image}" alt="Fotografia de pizza com ${toppings}" loading="lazy"><span class="photo-toppings">${toppings}</span></div>`;
}
let pizzaArtId = 0;
const PIZZA_POINTS = [[100,34],[130,42],[155,63],[163,96],[146,128],[119,151],[83,151],[54,129],[37,98],[47,65],[76,43],[104,81],[132,101],[89,119],[119,124]];
function pizzaVisual(c) {
  const id = `pizza-art-${++pizzaArtId}`;
  const sauce = c.sauce === 'branco' ? '#eee1c8' : c.sauce === 'barbecue' ? '#713729' : '#b83b2b';
  const cheese = c.cheese === 'catupiry' ? '#fff1cb' : c.cheese === 'cheddar' ? '#f0a83a' : c.cheese === 'parmesao' ? '#f5e3a8' : '#f4df9b';
  const dough = c.dough === 'integral' ? '#a66b3b' : c.dough === 'fina' ? '#d29b58' : '#c98747';
  const border = c.border === 'catupiry' ? '#fff0c7' : c.border === 'cheddar' ? '#e99b36' : dough;
  const surfaceShape = 'M100 18 C111 19 118 23 128 22 C138 24 141 31 150 35 C158 40 158 48 166 55 C171 64 168 71 174 80 C178 91 172 98 177 107 C176 117 169 122 171 132 C166 141 158 143 154 152 C146 158 137 156 130 164 C120 167 113 162 103 170 C92 172 86 165 76 168 C66 164 62 156 52 155 C45 148 47 139 39 133 C35 124 39 117 32 108 C29 98 34 91 30 81 C33 71 40 66 40 56 C47 48 55 47 61 38 C70 34 77 37 86 29 C91 25 96 24 100 18Z';
  const cheeseShape = 'M100 27 C109 27 116 29 123 29 C130 29 132 34 139 36 C145 39 145 45 151 49 C156 54 153 60 158 66 C162 73 158 79 163 86 C166 94 160 99 164 106 C162 114 156 117 158 124 C154 131 147 133 145 140 C139 146 132 143 127 150 C119 153 114 148 106 155 C97 157 92 151 84 154 C76 151 73 145 65 144 C59 139 61 132 55 127 C51 120 55 115 50 108 C48 100 53 94 50 87 C53 79 59 75 58 67 C63 61 70 60 73 53 C80 49 85 51 91 44 C95 40 98 35 100 27Z';
  const toppings = c.ings.map((key, ki) => {
    const markup = {
      calabresa: '<path d="M-8-4 Q-7-9-1-8 L7-5 Q10-2 7 4 L3 8 Q-2 10-7 5Z" fill="#9e3327" stroke="#71271f" stroke-width="1"/><path d="M-4-4l2 1m5 1 1 2m-7 3 2 1" stroke="#dc8262" stroke-width="1.7" stroke-linecap="round"/>',
      pepperoni: '<path d="M-7-6Q-2-10 5-7Q10-3 7 4Q4 10-3 8Q-10 5-7-2Z" fill="#a92d27" stroke="#76211c" stroke-width="1.5"/><path d="M-3-4l2 2m5-1-1 2m-4 4 2-1" stroke="#e28a69" stroke-width="2" stroke-linecap="round"/>',
      bacon: '<path d="M-9-4Q-4-8 0-4T9-5L8 1Q3 4-1 1T-8 4Z" fill="#a64036"/><path d="M-8-2Q-4-5 0-1T8-3M-7 2Q-3-1 1 3T8 1" fill="none" stroke="#edb48b" stroke-width="2"/>',
      frango: '<path d="M-8-3Q-6-8-2-5L1-8Q5-7 4-3L9-1Q9 4 5 4L3 8Q-2 9-3 5L-8 4Z" fill="#e7c68e" stroke="#b48b56" stroke-width="1"/><path d="M-4-2l3 2m2 2 3-2" stroke="#fff0cb" stroke-width="1.5"/>',
      presunto: '<path d="M-7-6L3-8 8-3 6 6-2 8-8 2Z" fill="#df8890" stroke="#b9636f" stroke-width="1"/><path d="M-4-3l3 1m3 3 2-1" stroke="#f6c1bd" stroke-width="1.5"/>',
      cebola: '<path d="M-7 0C-7-9 7-9 7 0S-7 9-7 0Z" fill="none" stroke="#fff4dd" stroke-width="3"/><path d="M-4 0C-4-5 4-5 4 0S-4 5-4 0Z" fill="none" stroke="#d7aeb0" stroke-width="1.5"/>',
      tomate: '<path d="M-7-4Q-5-9 1-7L7-3 6 4Q2 9-4 6L-8 1Z" fill="#d94232" stroke="#a92f25" stroke-width="1"/><circle cx="-2" cy="-1" r="1" fill="#ffd58d"/><circle cx="3" cy="2" r="1" fill="#ffd58d"/>',
      milho: '<ellipse cx="-3" cy="-3" rx="2.4" ry="3" fill="#ffd24d"/><ellipse cx="2" cy="-4" rx="2.4" ry="3" fill="#f3b92f"/><ellipse cx="5" cy="1" rx="2.4" ry="3" fill="#ffda59"/><ellipse cx="-1" cy="3" rx="2.4" ry="3" fill="#edb128"/>',
      azeitona: '<ellipse rx="5.8" ry="6.8" fill="#292923"/><ellipse rx="2.3" ry="3.1" fill="#d0a45f"/><ellipse cx="-1.7" cy="-2.5" rx="1" ry="1.4" fill="#66624d"/>',
      champignon: '<path d="M-7-1Q-5-8 0-8T7-1L5 1H-5Z" fill="#e4d4b8" stroke="#ad9877" stroke-width="1"/><path d="M-3 1H3L4 6Q0 9-4 6Z" fill="#cfb997" stroke="#ad9877" stroke-width="1"/>'
    }[key];
    return PIZZA_POINTS.map(([x, y], pi) => {
      const dx = (ki * 17 + pi * 11) % 7 - 3;
      const dy = (ki * 13 + pi * 7) % 7 - 3;
      const rotate = (ki * 41 + pi * 29) % 360;
      return `<g transform="translate(${x + dx} ${y + dy}) rotate(${rotate})">${markup}</g>`;
    }).join('');
  }).join('');
  const cheeseSpecks = Array.from({ length: 28 }, (_, i) => {
    const x = 43 + (i * 37) % 115, y = 42 + (i * 53) % 116;
    return `<ellipse cx="${x}" cy="${y}" rx="${1 + i % 2}" ry="${1.2 + i % 2}" fill="${i % 3 ? '#fff1c7' : '#c8853d'}" opacity="${i % 3 ? '.38' : '.22'}"/>`;
  }).join('');
  const crustBlisters = Array.from({ length: 34 }, (_, i) => {
    const angle = i * 2.39996, radius = 85 + (i % 4) * 1.15;
    const x = 100 + Math.cos(angle) * radius, y = 96 + Math.sin(angle) * radius;
    return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(1.2 + i % 3).toFixed(1)}" ry="${(1 + i % 2).toFixed(1)}" transform="rotate(${i * 23} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${i % 3 ? '#7a452a' : '#ffdfa0'}" opacity="${i % 3 ? '.2' : '.35'}"/>`;
  }).join('');
  const doughSpecks = Array.from({ length: 26 }, (_, i) => {
    const x = 39 + (i * 41) % 122, y = 34 + (i * 59) % 124;
    return `<ellipse cx="${x}" cy="${y}" rx="${1 + i % 2}" ry="1.1" fill="${i % 2 ? '#f1d29a' : '#986337'}" opacity=".2"/>`;
  }).join('');
  return `<div class="pizza-art-wrap"><svg class="pizza-art" viewBox="0 0 200 200" role="img" aria-label="Pizza em camadas: ${[c.sauce && optName('sauce', c.sauce), c.cheese && optName('cheese', c.cheese), ...c.ings.map(k => ING[k].n)].filter(Boolean).join(', ') || 'massa'}">
    <defs>
      <radialGradient id="${id}-crust" cx="44%" cy="35%"><stop stop-color="#f4d18c"/><stop offset=".76" stop-color="${dough}"/><stop offset="1" stop-color="#84502c"/></radialGradient>
      <radialGradient id="${id}-sauce" cx="42%" cy="38%"><stop stop-color="${sauce}"/><stop offset="1" stop-color="${c.sauce === 'branco' ? '#d8c6a8' : '#812e26'}"/></radialGradient>
      <radialGradient id="${id}-cheese" cx="43%" cy="37%"><stop stop-color="#fff0bf"/><stop offset=".8" stop-color="${cheese}"/><stop offset="1" stop-color="#e1bd6e"/></radialGradient>
      <filter id="${id}-shadow" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur stdDeviation="3"/></filter>
      <mask id="${id}-rim"><rect width="200" height="200" fill="#000"/><circle cx="100" cy="96" r="91" fill="#fff"/><circle cx="100" cy="96" r="78" fill="#000"/></mask>
      <clipPath id="${id}-surface"><path d="${surfaceShape}"/></clipPath>
      <clipPath id="${id}-cheese"><path d="${cheeseShape}"/></clipPath>
    </defs>
    <ellipse cx="101" cy="105" rx="91" ry="91" fill="#25160f" opacity=".2" filter="url(#${id}-shadow)"/>
    <circle cx="100" cy="96" r="91" fill="url(#${id}-crust)" stroke="#83502c" stroke-width="2"/>
    <image href="assets/pizza-mussarela.jpg" x="9" y="5" width="182" height="182" preserveAspectRatio="xMidYMid slice" mask="url(#${id}-rim)" opacity=".72"/>
    ${crustBlisters}
    <path d="${surfaceShape}" fill="${c.sauce ? `url(#${id}-sauce)` : '#d9a968'}"/>
    ${doughSpecks}
    ${c.sauce ? `<g clip-path="url(#${id}-surface)">${Array.from({ length: 19 }, (_, i) => `<ellipse cx="${39 + (i * 43) % 122}" cy="${37 + (i * 29) % 118}" rx="${3 + i % 4}" ry="${1.5 + i % 2}" transform="rotate(${i * 37} ${39 + (i * 43) % 122} ${37 + (i * 29) % 118})" fill="${c.sauce === 'branco' ? '#fff2d6' : '#e36c4b'}" opacity=".22"/>`).join('')}</g>` : ''}
    ${c.cheese ? `<path d="${cheeseShape}" fill="url(#${id}-cheese)"/><g clip-path="url(#${id}-cheese)">${cheeseSpecks}</g>` : ''}
    ${c.border !== 'tradicional' ? `<circle cx="100" cy="96" r="84" fill="none" stroke="${border}" stroke-width="8" opacity=".96"/><circle cx="100" cy="96" r="79" fill="none" stroke="#fff1d2" stroke-width="1.5" opacity=".65"/>` : ''}
    <g>${toppings}</g>
    <circle cx="100" cy="96" r="91" fill="none" stroke="#fff0c8" stroke-width="2" opacity=".5"/>
  </svg></div>`;
}
function productPhoto(p) {
  return p.cfg ? pizzaPhoto(p.cfg) : `<img src="${p.image}" alt="${p.name}" loading="lazy">`;
}
function renderLogos() {
  $$('[data-logo]').forEach(e => {
    e.innerHTML = '<span class="brand-mark" aria-hidden="true">F</span><span class="brand-name">Fatia <strong>Feliz</strong></span>';
  });
}

/* ============ NAVEGAÇÃO ============ */
function go(id) {
  $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  if (id === 'menu') { renderCategories(); renderProducts(); }
  if (id === 'cart') renderCart();
  if (id === 'checkout') renderCheckout();
  updateBadge();
}

/* ============ CARDÁPIO ============ */
function renderCategories() {
  $('#cats').innerHTML = CATS.map(c => `<button class="${c.id === S.cat ? 'on' : ''}" aria-pressed="${c.id === S.cat}" data-a="cat" data-v="${c.id}">${c.name}</button>`).join('');
}
function renderProducts() {
  let h = '<div class="grid">';
  if (S.cat === 'pizzas') h += `<button class="build" data-a="custom"><img src="assets/pizza-mussarela.jpg" alt="" loading="lazy"><span>Monte sua pizza<small>Escolha tamanho e sabores</small></span><b aria-hidden="true">›</b></button>`;
  PRODUCTS.filter(p => p.cat === S.cat).forEach(p => {
    h += `<article class="card"><div class="img">${productPhoto(p)}</div><div class="product-copy"><h4>${p.name}</h4><p>${p.desc}</p></div>
    <div class="product-footer"><div class="price">${brl(p.price)}</div><button class="btn btn-add" aria-label="Adicionar ${p.name} ao pedido" data-a="add" data-v="${p.id}">ADICIONAR</button></div></article>`;
  });
  $('#products').innerHTML = h + '</div>';
  updateBar();
}
function updateBar() {
  const q = cartQty(), b = $('#menu-bar');
  b.classList.toggle('hide', !q);
  b.innerHTML = `<div class="total"><small>${q} ${q === 1 ? 'item' : 'itens'}</small><b>${brl(cartTotal())}</b></div><button class="btn btn-primary" data-a="go" data-v="cart">VER PEDIDO</button>`;
}

/* ============ PIZZA PERSONALIZADA ============ */
function openCustom() {
  S.cfg = { size: 'media', dough: 'tradicional', border: 'tradicional', sauce: null, cheese: null, ings: [] };
  $('#opts').innerHTML = GROUPS.map(([k, t]) => `<div class="opt-group"><h3>${t}</h3><div class="opts">${OPT[k].map(o =>
    `<button class="opt" aria-pressed="false" data-a="opt" data-k="${k}" data-v="${o[0]}">${o[1]}<small>${k === 'size' ? brl(o[2]) : o[2] ? '+ ' + brl(o[2]) : 'incluso'}</small></button>`).join('')}</div></div>`).join('') +
    `<div class="opt-group"><h3>Ingredientes</h3><div class="opts">${ING_KEYS.map(k =>
    `<button class="opt" aria-pressed="false" data-a="ing" data-v="${k}">${ING[k].n}<small>+ ${brl(ING[k].p)}</small></button>`).join('')}</div></div>`;
  $('#custom-scroll').scrollTop = 0;
  go('custom'); updatePizza();
}
function pizzaLines(c) { // única fonte do preço: lista de [descrição, centavos]
  const L = [[`Pizza ${optName('size', c.size).toLowerCase()}`, optPrice('size', c.size)]];
  [['dough', 'Massa'], ['border', 'Borda'], ['sauce', 'Molho'], ['cheese', 'Queijo']].forEach(([g, t]) => {
    const p = c[g] ? optPrice(g, c[g]) : 0; if (p) L.push([`${t} ${optName(g, c[g])}`, p]);
  });
  c.ings.forEach(k => L.push([ING[k].n, ING[k].p]));
  return L;
}
const calcPrice = c => pizzaLines(c).reduce((t, l) => t + l[1], 0);
function pizzaItems(c) { // resumo em texto
  const r = [optName('size', c.size), `Massa ${optName('dough', c.dough).toLowerCase()}`, `Borda ${optName('border', c.border)}`];
  if (c.sauce) r.push(`Molho ${optName('sauce', c.sauce).toLowerCase()}`);
  if (c.cheese) r.push(optName('cheese', c.cheese));
  return r.concat(c.ings.map(k => ING[k].n));
}
function updatePizza() {
  const c = S.cfg;
  $('#preview-pizza').innerHTML = pizzaVisual(c);
  $('#preview-pizza').dataset.size = c.size;
  $('#preview-size').textContent = `Pizza ${optName('size', c.size).toLowerCase()}`;
  $$('#opts [data-a]').forEach(b => {
    const selected = b.dataset.a === 'ing' ? c.ings.includes(b.dataset.v) : c[b.dataset.k] === b.dataset.v;
    b.classList.toggle('on', selected);
    b.setAttribute('aria-pressed', selected);
  });
  $('#custom-total').textContent = brl(calcPrice(c));
  const ok = c.sauce && c.cheese, b = $('#btn-review');
  b.disabled = !ok; b.textContent = ok ? 'REVISAR PIZZA' : 'ESCOLHA MOLHO + QUEIJO';
}
function reviewPizza() {
  const c = S.cfg;
  $('#sheet').innerHTML = `<h2>Sua pizza</h2><ul>${pizzaItems(c).map(i => `<li>${i}</li>`).join('')}</ul>
  <div class="total"><small>Total</small><b>${brl(calcPrice(c))}</b></div>
  <div class="btns"><button class="btn btn-ghost" data-a="closeModal">VOLTAR</button><button class="btn btn-primary" data-a="addCustom">ADICIONAR AO PEDIDO</button></div>`;
  $('#modal').classList.add('open');
}

/* ============ CARRINHO ============ */
const cartQty = () => S.cart.reduce((t, i) => t + i.qty, 0);
const cartTotal = () => S.cart.reduce((t, i) => t + i.unit * i.qty, 0);
function addItem(item) {
  const found = S.cart.find(i => i.key === item.key);
  found ? found.qty++ : S.cart.push({ ...item, qty: 1 });
  saveCart(); updateBadge(); updateBar(); toast(`✓ ${item.name} adicionado`);
}
function addProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  addItem({ key: 'p:' + id, pid: id, name: p.name, desc: p.desc, unit: p.price, cfg: p.cfg, image: p.image });
}
function addCustom() {
  const c = JSON.parse(JSON.stringify(S.cfg)), unit = calcPrice(c);
  const desc = c.ings.map(k => ING[k].n).concat([optName('cheese', c.cheese), c.border !== 'tradicional' ? 'Borda ' + optName('border', c.border) : null]).filter(Boolean).join(' • ');
  $('#modal').classList.remove('open');
  addItem({ key: 'c:' + JSON.stringify(c), name: `Pizza ${optName('size', c.size)}`, desc, unit, cfg: c });
  go('menu');
}
function changeQty(i, d) { S.cart[i].qty += d; if (S.cart[i].qty < 1) return removeItem(i); saveCart(); renderCart(); }
function removeItem(i) { S.cart.splice(i, 1); saveCart(); renderCart(); }
function cartPhoto(it) {
  if (it.cfg) return pizzaVisual(it.cfg);
  const image = it.image || PRODUCTS.find(p => p.id === it.pid)?.image;
  return image ? `<img src="${image}" alt="${it.name}" loading="lazy">` : '';
}
function renderCart() {
  const q = cartQty();
  $('#cart-list').innerHTML = q ? S.cart.map((it, i) => `<div class="row"><div class="img">${cartPhoto(it)}</div>
    <div class="row-details"><h4>${it.name}</h4><p>${it.desc || ''}</p><p class="row-price">${brl(it.unit)} cada <span>•</span> Subtotal <b>${brl(it.unit * it.qty)}</b></p>
    <div class="ctrl"><button class="q" data-a="dec" data-v="${i}">−</button><b>${it.qty}</b><button class="q" data-a="inc" data-v="${i}">+</button>
    <button class="rm" aria-label="Remover ${it.name} do pedido" data-a="rm" data-v="${i}">Remover</button></div></div></div>`).join('')
    : '<div class="empty"><p>Seu pedido está vazio.</p><span>Escolha seus itens no cardápio para continuar.</span></div>';
  $('#cart-bar').innerHTML = q ? `<div class="total"><small>${q} ${q === 1 ? 'item' : 'itens'} • Total</small><b>${brl(cartTotal())}</b></div><button class="btn btn-primary" data-a="checkout">CONTINUAR</button>`
    : '<button class="btn btn-primary" style="width:100%" data-a="go" data-v="menu">VER CARDÁPIO</button>';
  updateBadge();
}
function updateBadge() {
  const q = cartQty();
  $('#badge').textContent = q;
  $$('[data-cart-count]').forEach(e => { e.textContent = q; });
  $('.cart-btn').setAttribute('aria-label', `Abrir pedido, ${q} ${q === 1 ? 'item' : 'itens'}`);
}

/* ============ LOCALSTORAGE ============ */
function saveCart() { try { localStorage.setItem('fatia_horror_cart', JSON.stringify(S.cart)); } catch (e) {} }
function loadCart() { try { S.cart = JSON.parse(localStorage.getItem('fatia_horror_cart')) || []; } catch (e) { S.cart = []; } }

/* ============ CHECKOUT ============ */
function qrSVG() {
  let s = '<svg class="qr" viewBox="0 0 25 25" shape-rendering="crispEdges"><rect width="25" height="25" fill="#fff"/>';
  for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) if (!((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) && rnd(x * 25 + y) > .5) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  [[0, 0], [18, 0], [0, 18]].forEach(([x, y]) => s += `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`);
  return s + '</svg>';
}
function renderCheckout() {
  const t = cartTotal();
  $('#summary').innerHTML = S.cart.map(i => `<div class="line"><span>${i.qty}× ${i.name}</span><span>${brl(i.unit * i.qty)}</span></div>`).join('') +
    `<div class="line"><span>Subtotal</span><span>${brl(t)}</span></div><div class="line sum"><span>Total</span><span>${brl(t)}</span></div>`;
  $('#co-total').textContent = brl(t);
  $('#pay-tabs').innerHTML = Object.entries(PAY).map(([k, v]) => `<button class="${k === S.pay ? 'on' : ''}" aria-pressed="${k === S.pay}" data-a="pay" data-v="${k}"><span class="pay-icon" aria-hidden="true">${k === 'pix' ? 'PIX' : k === 'dinheiro' ? '$' : '••'}</span>${v}</button>`).join('');
  const p = S.pay;
  $('#pay-panel').innerHTML = p === 'pix' ? `${qrSVG()}<b>Escaneie com o app do seu banco</b><div class="code">00020126 FATIA-FELIZ SIMULACAO 5204 0000 5303 986</div><small>Tela ilustrativa — nenhum pagamento real é feito.</small>`
    : p === 'dinheiro' ? `<div>Valor do pedido: <b>${brl(t)}</b></div><label for="cash">Valor recebido</label><input id="cash" inputmode="decimal" placeholder="R$ 0,00" autocomplete="off" value="${S.received ? (S.received / 100).toFixed(2).replace('.', ',') : ''}">
      <div class="quick"><button data-a="cashq" data-v="${t}">Valor exato</button>${[5000, 10000, 20000].map(v => `<button data-a="cashq" data-v="${v}">${brl(v)}</button>`).join('')}</div><div id="troco" class="troco"></div>`
    : `<div class="term" aria-hidden="true"><span>••••</span></div><b>${PAY[p]}: insira ou aproxime o cartão</b><small>Simulação — nenhum dado de cartão é solicitado.</small>`;
  updateCash();
}
function updateCash() {
  const t = cartTotal(), btn = $('#btn-confirm'); btn.disabled = false; btn.textContent = 'CONFIRMAR PEDIDO';
  if (S.pay !== 'dinheiro') return;
  const el = $('#troco'), ok = S.received >= t;
  el.className = 'troco' + (ok ? '' : ' bad');
  el.textContent = !S.received ? 'Informe o valor recebido' : ok ? `Troco: ${brl(S.received - t)}` : `Faltam ${brl(t - S.received)}`;
  btn.disabled = !ok;
}
function confirmOrder() {
  const btn = $('#btn-confirm'); btn.disabled = true; btn.textContent = 'PROCESSANDO…';
  setTimeout(finishOrder, 900);
}
function finishOrder() {
  const total = cartTotal(); let n = 248;
  try { n = (+localStorage.getItem('fatia_horror_order') || 247) + 1; localStorage.setItem('fatia_horror_order', n); } catch (e) {}
  $('#ok-num').textContent = '#' + String(n).padStart(4, '0');
  $('#ok-total').textContent = brl(total);
  $('#ok-pay').textContent = PAY[S.pay];
  S.cart = []; S.received = 0; saveCart(); updateBadge();
  go('success');
}

/* ============ FEEDBACK ============ */
let tt;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), 1300);
  $$('.cart-btn,#menu-bar b').forEach(e => { e.classList.remove('bump'); void e.offsetWidth; e.classList.add('bump'); });
}

/* ============ EVENTOS ============ */
const ACTIONS = {
  start: () => go('menu'),
  go: v => go(v),
  cat: v => { S.cat = v; renderCategories(); renderProducts(); $('#products').scrollTop = 0; },
  add: (v, b) => { addProduct(v); b.classList.add('done'); b.textContent = '✓ ADICIONADO'; setTimeout(() => { b.classList.remove('done'); b.textContent = 'ADICIONAR'; }, 900); },
  custom: openCustom,
  opt: (v, b) => { S.cfg[b.dataset.k] = v; updatePizza(); },
  ing: v => { const a = S.cfg.ings, i = a.indexOf(v); i < 0 ? a.push(v) : a.splice(i, 1); updatePizza(); },
  review: reviewPizza,
  closeModal: () => $('#modal').classList.remove('open'),
  addCustom,
  inc: v => changeQty(+v, 1), dec: v => changeQty(+v, -1), rm: v => removeItem(+v),
  checkout: () => { S.received = 0; go('checkout'); },
  pay: v => { S.pay = v; renderCheckout(); },
  cashq: v => { S.received = +v; renderCheckout(); },
  confirm: confirmOrder,
  newOrder: () => { S.cat = 'pizzas'; go('home'); }
};
document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (b && ACTIONS[b.dataset.a]) ACTIONS[b.dataset.a](b.dataset.v, b); });
document.addEventListener('input', e => {
  if (e.target.id !== 'cash') return;
  const n = parseFloat(e.target.value.replace(/[^\d,]/g, '').replace(',', '.'));
  S.received = isNaN(n) ? 0 : Math.round(n * 100); updateCash();
});

/* ============ INÍCIO ============ */
renderLogos(); loadCart(); updateBadge();

/* ============ CAMERA SYSTEM / EVENTOS OCULTOS ============ */
const cameraNames = ['CAM 01 — SALÃO', 'CAM 02 — CORREDOR', 'CAM 03 — ESTOQUE', 'CAM 04 — OFFLINE'];
const cameraMessages = ['CAMERA CONNECTION LOST', 'NO EMPLOYEE FOUND', 'PLEASE REMAIN SEATED', 'SISTEMA OPERACIONAL'];
const cameraOpen = $('#camera-open');
const cameraPanel = $('#camera-panel');
const cameraFeed = $('#camera-feed');
const startedAt = Date.now();
let interactionCount = 0;
let lastAnomalyAt = 0;
let currentCamera = 0;

function selectCamera(index, transient = false) {
  currentCamera = index;
  $$('.camera-tab').forEach((tab, i) => {
    tab.classList.toggle('selected', i === index);
    tab.setAttribute('aria-selected', String(i === index));
  });
  cameraFeed.className = `camera-feed feed-${index}` + (transient ? ' camera-flicker' : '');
  $('#feed-label').textContent = cameraNames[index];
  $('#camera-feed').setAttribute('aria-label', `Câmera de segurança: ${cameraNames[index].replace('CAM 0' + (index + 1) + ' — ', '')}`);
  $('#feed-status').textContent = index === 3 ? 'SIGNAL: LOST' : 'SIGNAL: STABLE';
  $('#camera-foot').innerHTML = index === 3 ? 'CAMERA 04 — OFFLINE <span>×</span>' : 'CONEXÃO ESTABELECIDA <span>●</span>';
}

function openCameras() {
  cameraPanel.classList.add('open');
  cameraPanel.setAttribute('aria-hidden', 'false');
  cameraOpen.setAttribute('aria-expanded', 'true');
  selectCamera(currentCamera);
}

function closeCameras() {
  cameraPanel.classList.remove('open');
  cameraPanel.setAttribute('aria-hidden', 'true');
  cameraOpen.setAttribute('aria-expanded', 'false');
}

function showAnomaly(type) {
  const now = Date.now();
  if (now - startedAt < 18000 || now - lastAnomalyAt < 28000) return;
  lastAnomalyAt = now;
  const message = $('#anomaly-message');
  if (type === 'glitch') {
    const active = $('.screen.active');
    active.classList.add('glitch');
    setTimeout(() => active.classList.remove('glitch'), 420);
  } else if (type === 'image_flicker') {
    const image = $('.screen.active .home-photo img, .screen.active .card .img img, .screen.active .build img');
    if (image) {
      image.classList.add('camera-flicker');
      setTimeout(() => image.classList.remove('camera-flicker'), 700);
    } else {
      $('#totem').classList.add('noise-burst');
      setTimeout(() => $('#totem').classList.remove('noise-burst'), 650);
    }
  } else if (type === 'camera_change') {
    if (cameraPanel.classList.contains('open')) selectCamera(Math.floor(Math.random() * 4), true);
    else {
      message.textContent = 'CAMERA CONNECTION LOST';
      message.classList.remove('show');
      void message.offsetWidth;
      message.classList.add('show');
    }
  } else if (type === 'text_corruption') {
    message.textContent = cameraMessages[Math.floor(Math.random() * cameraMessages.length)];
    message.classList.remove('show');
    void message.offsetWidth;
    message.classList.add('show');
  } else if (type === 'shadow') {
    if (cameraPanel.classList.contains('open')) {
      cameraFeed.classList.add('shadow-pass');
      setTimeout(() => cameraFeed.classList.remove('shadow-pass'), 1100);
    } else {
      const photo = $('.screen.active .home-photo');
      if (photo) {
        photo.classList.add('shadow-pass');
        setTimeout(() => photo.classList.remove('shadow-pass'), 850);
      }
    }
  } else {
    $('#totem').classList.add('noise-burst');
    setTimeout(() => $('#totem').classList.remove('noise-burst'), 650);
  }
}

function maybeAnomaly(source) {
  if (Date.now() - startedAt < 18000 || Date.now() - lastAnomalyAt < 28000) return;
  const chance = source === 'interaction' ? (interactionCount < 5 ? .008 : .025) : .09;
  if (Math.random() < chance) {
    const events = ['glitch', 'image_flicker', 'camera_change', 'text_corruption', 'shadow', 'screen_noise'];
    showAnomaly(events[Math.floor(Math.random() * events.length)]);
  }
}

cameraOpen.addEventListener('click', openCameras);
$('#camera-close').addEventListener('click', closeCameras);
$$('.camera-tab').forEach(tab => tab.addEventListener('click', () => selectCamera(Number(tab.dataset.camera))));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && cameraPanel.classList.contains('open')) closeCameras();
});
document.addEventListener('click', event => {
  if (event.target.closest('[data-a]')) {
    interactionCount++;
    maybeAnomaly('interaction');
  }
});
window.setInterval(() => {
  const now = new Date();
  $('#sys-clock').textContent = now.toLocaleTimeString('pt-BR', { hour12: false });
  if (Date.now() - startedAt > 24000) cameraOpen.classList.add('ready');
  if (Math.random() < .12) maybeAnomaly('idle');
}, 7000);
