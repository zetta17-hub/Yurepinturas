// ============================================================
//  YURE PINTURAS — Lógica da loja (carrinho, checkout, entrega)
// ============================================================
const LS_CART = "yp_cart";
const LS_CFG = "yp_config_override";
const LS_PROD = "yp_products_override";
const LS_ORDERS = "yp_orders";
const PIX_DESCONTO = 0.05; // 5% de desconto pagando no Pix manual

/* ---------- Config + catálogo (com overrides do admin) ---------- */
function getConfig() {
  try {
    const o = JSON.parse(localStorage.getItem(LS_CFG) || "{}");
    return { ...STORE_CONFIG, ...o };
  } catch { return { ...STORE_CONFIG }; }
}
function getProducts() {
  try {
    const o = JSON.parse(localStorage.getItem(LS_PROD) || "null");
    if (Array.isArray(o) && o.length) return o;
  } catch {}
  return DEFAULT_PRODUCTS;
}
function getProduct(id) { return getProducts().find((p) => p.id === id); }
function money(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function desconto(p) {
  if (!p.oldPrice || p.oldPrice <= p.price) return 0;
  return Math.round((1 - p.price / p.oldPrice) * 100);
}

/* ---------- Carrinho ---------- */
function getCart() {
  try { return JSON.parse(localStorage.getItem(LS_CART) || "[]"); }
  catch { return []; }
}
function saveCart(c) {
  localStorage.setItem(LS_CART, JSON.stringify(c));
  updateCartBadge();
  renderCartDrawer();
}
function cartCount() { return getCart().reduce((s, i) => s + (i.qty || 1), 0); }
function cartTotal() {
  return getCart().reduce((s, i) => {
    const p = getProduct(i.id);
    return s + (p ? p.price * (i.qty || 1) : 0);
  }, 0);
}
function addToCart(id, openAfter = true) {
  const c = getCart();
  if (!c.find((i) => i.id === id)) c.push({ id, qty: 1 });
  saveCart(c);
  toast("Adicionado ao carrinho");
  if (openAfter) openCart();
}
function removeFromCart(id) { saveCart(getCart().filter((i) => i.id !== id)); }

/* ---------- Pedidos locais (Pix manual / WhatsApp) ---------- */
function getOrders() {
  try { return JSON.parse(localStorage.getItem(LS_ORDERS) || "[]"); }
  catch { return []; }
}
function saveOrder(order) {
  const all = getOrders();
  all.unshift(order);
  localStorage.setItem(LS_ORDERS, JSON.stringify(all));
}
function newOrderCode() {
  return "YP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

/* ---------- WhatsApp ---------- */
function waLink(message) {
  const cfg = getConfig();
  return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(message);
}

/* ---------- Toast ---------- */
function toast(msg) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "toast-wrap";
    document.body.appendChild(wrap);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2600);
}

/* ---------- Ícones SVG ---------- */
const ICONS = {
  cart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
  home: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>',
  box: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.3 7l8.7 5 8.7-5M12 22V12"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
  star: '<svg width="15" height="15" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>',
  x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  shield: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  bolt: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  phone: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>',
  card: '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>',
};
function starsHTML() {
  return '<span class="star-row">' + ICONS.star.repeat(5) + "</span>";
}

/* ---------- Drawer do carrinho + barra mobile (injetados) ---------- */
function injectShell() {
  if (document.getElementById("yp-overlay")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div class="overlay" id="yp-overlay" onclick="closeCart()"></div>
    <aside class="drawer" id="yp-drawer" aria-label="Carrinho">
      <div class="drawer-head"><span>Seu carrinho</span>
        <button onclick="closeCart()" aria-label="Fechar">${ICONS.x}</button></div>
      <div class="drawer-body" id="yp-drawer-body"></div>
      <div class="drawer-foot" id="yp-drawer-foot"></div>
    </aside>
    <nav class="bottom-nav">
      <a href="index.html" data-nav="index">${ICONS.home}Início</a>
      <a href="meus-produtos.html" data-nav="meus">${ICONS.box}Meus produtos</a>
      <button onclick="openCart()" data-nav="cart">${ICONS.cart}Carrinho
        <span class="mini-badge" id="yp-mini-badge" style="display:none">0</span></button>
    </nav>`);
  const page = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  document.querySelectorAll(".bottom-nav [data-nav]").forEach((el) => {
    const k = el.dataset.nav;
    if ((page === "" || page === "index") && k === "index") el.classList.add("active");
    if (page === "meus-produtos" && k === "meus") el.classList.add("active");
  });
  renderCartDrawer();
}
function openCart() {
  renderCartDrawer();
  document.getElementById("yp-drawer").classList.add("open");
  document.getElementById("yp-overlay").classList.add("show");
}
function closeCart() {
  document.getElementById("yp-drawer").classList.remove("open");
  document.getElementById("yp-overlay").classList.remove("show");
}
function renderCartDrawer() {
  const body = document.getElementById("yp-drawer-body");
  const foot = document.getElementById("yp-drawer-foot");
  if (!body || !foot) return;
  const cart = getCart();
  if (!cart.length) {
    body.innerHTML = `<div class="drawer-empty">
      <p style="font-size:2.4rem;margin-bottom:8px">${ICONS.cart}</p>
      <p><strong>Seu carrinho está vazio</strong></p>
      <p class="small">Que tal começar por um dos nossos best-sellers?</p></div>`;
    foot.innerHTML = `<button class="btn btn-primary btn-block" onclick="closeCart()">Ver produtos</button>`;
    return;
  }
  body.innerHTML = cart.map((i) => {
    const p = getProduct(i.id);
    if (!p) return "";
    return `<div class="cart-item">
      <img src="${p.cover}" alt="${p.name}" loading="lazy">
      <div class="info"><h4>${p.name}</h4>
        <div class="price">${money(p.price)}</div>
        <button class="rm" onclick="removeFromCart('${p.id}')">Remover</button>
      </div></div>`;
  }).join("");
  foot.innerHTML = `
    <div class="total-row"><span>Total</span><span>${money(cartTotal())}</span></div>
    <a class="btn btn-primary btn-block" href="checkout.html">Finalizar compra</a>
    <button class="btn btn-outline btn-block mt" onclick="closeCart()">Continuar comprando</button>`;
}
function updateCartBadge() {
  const n = cartCount();
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = n;
    el.style.display = n ? "flex" : "none";
  });
  const mini = document.getElementById("yp-mini-badge");
  if (mini) { mini.textContent = n; mini.style.display = n ? "flex" : "none"; }
}

/* ---------- Checkout Mercado Pago (via backend) ---------- */
async function pagarComMercadoPago(customer) {
  const cfg = getConfig();
  if (!cfg.backendUrl) return { error: "no-backend" };
  const items = getCart().map((i) => ({ id: i.id, qty: i.qty || 1 }));
  const res = await fetch(cfg.backendUrl.replace(/\/$/, "") + "/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, customer }),
  });
  if (!res.ok) throw new Error("Falha ao criar pagamento");
  return res.json(); // { init_point, orderCode }
}

/* ---------- Inicialização ---------- */
document.addEventListener("DOMContentLoaded", () => {
  injectShell();
  updateCartBadge();
  // Aplica nome da loja onde houver data-store
  const cfg = getConfig();
  document.querySelectorAll("[data-store-name]").forEach((el) => (el.textContent = cfg.storeName));
  document.querySelectorAll("[data-store-tagline]").forEach((el) => (el.textContent = cfg.tagline));
});
