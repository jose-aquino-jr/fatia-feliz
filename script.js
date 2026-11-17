'use strict';
/* ============ UTILITÁRIOS ============ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const brl = c => (c / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); // valores em centavos
const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

/* ============ DADOS (adicione novos produtos aqui) ============ */
let CATS = [
  { id: 'pizzas', name: 'Pizzas' }, { id: 'bebidas', name: 'Bebidas' },
  { id: 'acomp', name: 'Acompanhamentos' }, { id: 'sobremesas', name: 'Sobremesas' },
  { id: 'combos', name: 'Combos' }
];
const BASE = { dough: 'tradicional', border: 'tradicional', sauce: 'tradicional', cheese: 'mussarela' };
let PRODUCTS = [
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
  { id: 'c1', cat: 'combos', name: 'Combo Solo', desc: 'Pizza pequena + refrigerante lata.', price: 3490, image: 'assets/pizza-mussarela.jpg', visuals: ['assets/pizza-mussarela.jpg', 'assets/refrigerante-lata.jpg'] },
  { id: 'c2', cat: 'combos', name: 'Combo Casal', desc: 'Pizza grande + refrigerante 2L.', price: 6290, image: 'assets/pizza-calabresa.jpg', visuals: ['assets/pizza-calabresa.jpg', 'assets/refrigerante.jpg'] },
  { id: 'c3', cat: 'combos', name: 'Combo Família', desc: 'Pizza família + 2L + batata frita.', price: 8490, image: 'assets/pizza-pepperoni.jpg', visuals: ['assets/pizza-pepperoni.jpg', 'assets/refrigerante.jpg', 'assets/batata.jpg'] }
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
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
const assetPath = value => {
  const path = String(value || '');
  return /^assets\/[A-Za-z0-9._/-]+$/.test(path) && !path.split('/').includes('..') ? path : 'assets/pizza-mussarela.jpg';
};

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
const PIZZA_POINTS = [[100,34],[130,42],[155,63],[163,96],[146,128],[119,151],[83,151],[54,129],[37,98],[47,65],[76,43],[104,81],[132,101],[89,119],[119,124]];
const LAYER_ASSETS = {
  doughRaw: 'assets/pizza-layers/dough-raw.png', doughBaked: 'assets/pizza-layers/dough-baked.png',
  sauceTomato: 'assets/pizza-layers/sauce-tomato.png', sauceWhite: 'assets/pizza-layers/sauce-white.png',
  oregano: 'assets/pizza-layers/topping-oregano.png',
  cheese: { mussarela: 'assets/pizza-layers/cheese-mozzarella.png', catupiry: 'assets/pizza-layers/cheese-catupiry.png', cheddar: 'assets/pizza-layers/cheese-cheddar.png' },
  toppings: { pepperoni: 'assets/pizza-layers/topping-pepperoni.png', presunto: 'assets/pizza-layers/topping-ham.png', cebola: 'assets/pizza-layers/topping-red-onion.png', tomate: 'assets/pizza-layers/topping-tomato.png', milho: 'assets/pizza-layers/topping-corn.png', azeitona: 'assets/pizza-layers/topping-olives.png' }
};
function fallbackTopping(key, ki) {
  return `<svg class="pizza-topping-fallback" viewBox="0 0 200 200" aria-hidden="true">${PIZZA_POINTS.slice(0, ING[key].c).map(([x, y], pi) => `<g transform="translate(${x + ((ki * 17 + pi * 11) % 7 - 3)} ${y + ((ki * 13 + pi * 7) % 7 - 3)}) rotate(${(ki * 41 + pi * 29) % 360})">${ING[key].d}</g>`).join('')}</svg>`;
}
function pizzaVisual(c) {
  const description = [c.sauce && optName('sauce', c.sauce), c.cheese && optName('cheese', c.cheese), ...c.ings.map(k => ING[k].n)].filter(Boolean).join(', ') || 'massa';
  const dough = c.dough === 'fina' ? LAYER_ASSETS.doughRaw : LAYER_ASSETS.doughBaked;
  const sauce = c.sauce === 'branco' ? LAYER_ASSETS.sauceWhite : LAYER_ASSETS.sauceTomato;
  const cheese = LAYER_ASSETS.cheese[c.cheese] || LAYER_ASSETS.cheese.mussarela;
  const toppings = c.ings.map((key, ki) => LAYER_ASSETS.toppings[key]
    ? `<img class="pizza-layer pizza-topping" src="${LAYER_ASSETS.toppings[key]}" alt="" loading="lazy">`
    : fallbackTopping(key, ki)).join('');
  const borderColor = c.border === 'catupiry' ? '#f3e5c7' : c.border === 'cheddar' ? '#eaa23d' : 'transparent';
  return `<div class="pizza-art-wrap"><div class="pizza-layer-stack" data-size="${c.size}" data-sauce="${c.sauce || ''}" style="--pizza-border:${borderColor}" role="img" aria-label="Pizza em camadas: ${description}">
    <img class="pizza-layer pizza-dough" src="${dough}" alt="" loading="lazy">
    ${c.sauce ? `<img class="pizza-layer pizza-sauce" data-sauce="${c.sauce}" src="${sauce}" alt="" loading="lazy">` : ''}
    ${c.cheese ? `<img class="pizza-layer pizza-cheese" src="${cheese}" alt="" loading="lazy">` : ''}
    ${c.sauce && c.cheese ? `<img class="pizza-layer pizza-seasoning" src="${LAYER_ASSETS.oregano}" alt="" loading="lazy">` : ''}
    ${toppings}
    ${c.border !== 'tradicional' ? '<span class="pizza-border" aria-hidden="true"></span>' : ''}
  </div></div>`;
}
function productPhoto(p) {
  if (p.cfg) return pizzaPhoto(p.cfg);
  if (p.visuals) return `<div class="combo-photo" role="img" aria-label="${esc(p.name)}: ${esc(p.desc)}">${p.visuals.map((src, i) => `<img class="combo-piece piece-${i + 1}" src="${assetPath(src)}" alt="" loading="lazy">`).join('')}</div>`;
  return `<img src="${assetPath(p.image)}" alt="${esc(p.name)}" loading="lazy">`;
}
function renderLogos() {
  $$('[data-logo]').forEach(e => {
    e.innerHTML = '<span class="brand-mark" aria-hidden="true">F</span><span class="brand-name">Fatia <strong>Feliz</strong></span>';
  });
}

function optionPicture(group, id) {
  const src = group === 'sauce' ? (id === 'branco' ? LAYER_ASSETS.sauceWhite : LAYER_ASSETS.sauceTomato)
    : group === 'cheese' ? (LAYER_ASSETS.cheese[id] || LAYER_ASSETS.cheese.mussarela)
      : group === 'ing' ? LAYER_ASSETS.toppings[id] : null;
  return src ? `<span class="opt-thumb"><img src="${src}" alt="" loading="lazy"></span>` : '<span class="opt-thumb opt-thumb-empty" aria-hidden="true"></span>';
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
  $('#cats').innerHTML = CATS.map(c => `<button class="${c.id === S.cat ? 'on' : ''}" aria-pressed="${c.id === S.cat}" data-a="cat" data-v="${esc(c.id)}">${esc(c.name)}</button>`).join('');
}
function renderProducts() {
  let h = '<div class="grid">';
  if (S.cat === 'pizzas') h += `<button class="build" data-a="custom"><img src="assets/pizza-mussarela.jpg" alt="" loading="lazy"><span>Monte sua pizza<small>Escolha tamanho e sabores</small></span><b aria-hidden="true">›</b></button>`;
  PRODUCTS.filter(p => p.cat === S.cat && p.available !== false).forEach(p => {
    h += `<article class="card"><div class="img">${productPhoto(p)}<span class="photo-label">${p.cat === 'pizzas' ? 'DA CASA' : p.cat === 'combos' ? 'COMBO' : 'FEITO COM CARINHO'}</span></div><div class="product-copy"><h4>${esc(p.name)}</h4><p>${esc(p.desc)}</p></div>
    <div class="product-footer"><div class="price">${brl(p.price)}</div><button class="btn btn-add" aria-label="Adicionar ${esc(p.name)} ao pedido" data-a="add" data-v="${esc(p.id)}">ADICIONAR</button></div></article>`;
  });
  $('#products').innerHTML = h + '</div>';
  updateBar();
}
function updateBar() {
  const q = cartQty(), b = $('#menu-bar');
  b.classList.toggle('hide', !q);
  b.innerHTML = `<div class="total"><small>${q} ${q === 1 ? 'item' : 'itens'}</small><b>${brl(cartTotal())}</b></div><button class="btn btn-primary" data-a="go" data-v="cart">VER PEDIDO</button>`;
}

async function loadCatalog() {
  try {
    const response = await fetch('backend/produtos/listar.php', { headers: { Accept: 'application/json' } });
    const data = await response.json().catch(() => null);
    if (!data) throw new Error('O servidor PHP não retornou o cardápio em JSON.');
    if (!response.ok || !data.success) throw new Error(data.error || 'Não foi possível carregar o cardápio.');
    CATS = data.categories.map(c => ({ id: c.code, name: c.name }));
    PRODUCTS = data.products.map(p => ({
      id: Number(p.id), dbId: Number(p.id), code: p.code, cat: p.category,
      name: p.name, desc: p.description, price: Number(p.price), image: assetPath(p.image),
      visuals: Array.isArray(p.visuals) ? p.visuals.map(assetPath) : undefined,
      available: Boolean(p.available)
    }));
    let changedCart = false;
    S.cart.forEach(item => {
      if (item.pid == null) return;
      const product = typeof item.pid === 'string'
        ? PRODUCTS.find(p => p.code === item.pid)
        : PRODUCTS.find(p => p.dbId === Number(item.pid));
      if (product) {
        item.pid = product.dbId;
        item.key = `p:${product.code}`;
        item.name = product.name;
        item.desc = product.desc;
        item.unit = product.price;
        item.image = product.image;
        if (product.visuals) item.visuals = product.visuals;
        else delete item.visuals;
        delete item.cfg;
        changedCart = true;
      }
    });
    if (changedCart) saveCart();
    if (!CATS.some(c => c.id === S.cat)) S.cat = CATS[0]?.id || 'pizzas';
    renderCategories(); renderProducts(); updateBadge();
  } catch (error) {
    console.info('Cardápio local carregado; confira a conexão PHP/MySQL para sincronizar.', error);
  }
}

/* ============ PIZZA PERSONALIZADA ============ */
function openCustom() {
  S.cfg = { size: 'media', dough: 'tradicional', border: 'tradicional', sauce: null, cheese: null, ings: [] };
  $('#opts').innerHTML = GROUPS.map(([k, t]) => `<div class="opt-group"><h3>${t}</h3><div class="opts">${OPT[k].map(o =>
    `<button class="opt ${k === 'size' || k === 'dough' || k === 'border' ? '' : 'has-thumb'}" aria-pressed="false" data-a="opt" data-k="${k}" data-v="${o[0]}">${k === 'size' || k === 'dough' || k === 'border' ? '' : optionPicture(k, o[0])}<span class="opt-label">${o[1]}<small>${k === 'size' ? brl(o[2]) : o[2] ? '+ ' + brl(o[2]) : 'incluso'}</small></span></button>`).join('')}</div></div>`).join('') +
    `<div class="opt-group"><h3>Ingredientes</h3><div class="opts">${ING_KEYS.map(k =>
    `<button class="opt has-thumb" aria-pressed="false" data-a="ing" data-v="${k}">${optionPicture('ing', k)}<span class="opt-label">${ING[k].n}<small>+ ${brl(ING[k].p)}</small></span></button>`).join('')}</div></div>`;
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
  const p = PRODUCTS.find(x => String(x.id) === String(id));
  if (!p) return;
  addItem({ key: 'p:' + (p.code || id), pid: p.dbId ?? p.id, name: p.name, desc: p.desc, unit: p.price, cfg: p.cfg, image: assetPath(p.image), visuals: p.visuals });
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
  if (it.pid == null && it.cfg) return pizzaVisual(it.cfg);
  if (it.visuals) return `<div class="combo-photo" role="img" aria-label="${esc(it.name)}">${it.visuals.map((src, i) => `<img class="combo-piece piece-${i + 1}" src="${assetPath(src)}" alt="" loading="lazy">`).join('')}</div>`;
  const image = it.image || PRODUCTS.find(p => p.id === it.pid)?.image;
  return image ? `<img src="${assetPath(image)}" alt="${esc(it.name)}" loading="lazy">` : '';
}
function renderCart() {
  const q = cartQty();
  $('#cart-list').innerHTML = q ? S.cart.map((it, i) => `<div class="row"><div class="img">${cartPhoto(it)}</div>
    <div class="row-details"><h4>${esc(it.name)}</h4><p>${esc(it.desc || '')}</p><p class="row-price">${brl(it.unit)} cada <span>•</span> Subtotal <b>${brl(it.unit * it.qty)}</b></p>
    <div class="ctrl"><button class="q" aria-label="Diminuir quantidade de ${esc(it.name)}" data-a="dec" data-v="${i}">−</button><b aria-live="polite">${it.qty}</b><button class="q" aria-label="Aumentar quantidade de ${esc(it.name)}" data-a="inc" data-v="${i}">+</button>
    <button class="rm" aria-label="Remover ${esc(it.name)} do pedido" data-a="rm" data-v="${i}">Remover</button></div></div></div>`).join('')
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
function saveCart() { try { localStorage.setItem('fatia_cart', JSON.stringify(S.cart)); } catch (e) {} }
function validCustomConfig(c) {
  return c && typeof c === 'object'
    && OPT.size.some(o => o[0] === c.size)
    && OPT.dough.some(o => o[0] === c.dough)
    && OPT.border.some(o => o[0] === c.border)
    && (c.sauce === null || OPT.sauce.some(o => o[0] === c.sauce))
    && (c.cheese === null || OPT.cheese.some(o => o[0] === c.cheese))
    && Array.isArray(c.ings) && c.ings.every(k => Object.prototype.hasOwnProperty.call(ING, k));
}
function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('fatia_cart'));
    S.cart = Array.isArray(saved) ? saved.filter(i => i && typeof i.key === 'string' && typeof i.name === 'string' && Number.isInteger(i.unit) && i.unit >= 0 && Number.isInteger(i.qty) && i.qty > 0 && (i.pid != null || validCustomConfig(i.cfg))) : [];
  } catch (e) { S.cart = []; }
}

/* ============ CHECKOUT ============ */
function qrSVG() {
  let s = '<svg class="qr" viewBox="0 0 25 25" shape-rendering="crispEdges"><rect width="25" height="25" fill="#fff"/>';
  for (let y = 0; y < 25; y++) for (let x = 0; x < 25; x++) if (!((x < 8 && y < 8) || (x > 16 && y < 8) || (x < 8 && y > 16)) && rnd(x * 25 + y) > .5) s += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  [[0, 0], [18, 0], [0, 18]].forEach(([x, y]) => s += `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`);
  return s + '</svg>';
}
function renderCheckout() {
  const t = cartTotal();
  $('#summary').innerHTML = S.cart.map(i => `<div class="line"><span>${i.qty}× ${esc(i.name)}</span><span>${brl(i.unit * i.qty)}</span></div>`).join('') +
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
async function confirmOrder() {
  if (!S.cart.length) { go('menu'); return; }
  const btn = $('#btn-confirm'); btn.disabled = true; btn.textContent = 'ENVIANDO PEDIDO…';
  const payload = {
    payment: S.pay,
    items: S.cart.map(item => item.pid == null
      ? { custom: item.cfg, quantity: item.qty }
      : Number.isInteger(item.pid)
        ? { product_id: item.pid, quantity: item.qty }
        : { product_code: String(item.pid), quantity: item.qty })
  };
  try {
    const response = await fetch('backend/pedidos/criar.php', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json().catch(() => null);
    if (!result) throw new Error('O servidor não retornou uma resposta válida. Confira se o PHP está ativo.');
    if (!response.ok || !result.success) throw new Error(result.error || 'Não foi possível registrar o pedido.');
    finishOrder(result.order);
  } catch (error) {
    btn.disabled = false; btn.textContent = 'CONFIRMAR PEDIDO';
    if (S.pay === 'dinheiro') updateCash();
    toast(error.message || 'Não foi possível conectar ao servidor PHP/MySQL.', 3600);
  }
}
function finishOrder(order) {
  const total = Number(order.total);
  if (!Number.isInteger(total) || total < 0) { toast('Resposta inválida do servidor.', 3600); return; }
  $('#ok-num').textContent = '#' + String(order.number).padStart(4, '0');
  $('#ok-total').textContent = brl(total);
  $('#ok-pay').textContent = PAY[order.payment] || PAY[S.pay];
  $('#ok-items').textContent = (order.items || []).map(i => `${i.quantity} × ${i.name}`).join(' · ');
  S.cart = []; S.received = 0; saveCart(); updateBadge();
  go('success');
}

/* ============ FEEDBACK ============ */
let tt;
function toast(msg, duration = 1300) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('show'), duration);
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
  checkout: () => { if (S.cart.length) { S.received = 0; go('checkout'); } },
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
renderLogos(); loadCart(); updateBadge(); loadCatalog();
