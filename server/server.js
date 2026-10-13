// ============================================================
//  YURE PINTURAS — Backend (Node.js + Express + Mercado Pago)
//  O que faz:
//   POST /api/checkout       → cria pagamento (Pix/cartão) e devolve link
//   POST /api/webhook        → recebe confirmação do Mercado Pago
//   GET  /api/meus-produtos  → lista acessos liberados de um e-mail
//  Como usar: veja o passo a passo no README.md (raiz do projeto)
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");
const CATALOG = require("../js/products.js"); // mesmo catálogo da vitrine

const app = express();
app.use(cors());
app.use(express.json());

const MP_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const FRONTEND_URL = (process.env.FRONTEND_URL || "").replace(/\/$/, "");
const mp = MP_TOKEN ? new MercadoPagoConfig({ accessToken: MP_TOKEN }) : null;

// ---- "Banco de dados" simples (arquivo). Para produção, use um banco real. ----
const ORDERS_FILE = path.join(__dirname, "orders.json");
function loadOrders() {
  try { return JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8")); }
  catch { return []; }
}
function saveOrders(o) { fs.writeFileSync(ORDERS_FILE, JSON.stringify(o, null, 2)); }
function findProduct(id) { return CATALOG.find((p) => p.id === id); }

app.get("/", (req, res) => res.json({ ok: true, store: "Yure Pinturas API" }));

// ---- Criar pagamento ----
app.post("/api/checkout", async (req, res) => {
  try {
    if (!mp) return res.status(500).json({ error: "MP_ACCESS_TOKEN não configurado" });
    const { items = [], customer = {} } = req.body;
    if (!items.length) return res.status(400).json({ error: "Carrinho vazio" });

    const orderCode = "YP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const mpItems = items.map(({ id, qty }) => {
      const p = findProduct(id);
      if (!p) throw new Error("Produto inválido: " + id);
      return { id: p.id, title: p.name, quantity: qty || 1, unit_price: Number(p.price), currency_id: "BRL" };
    });

    const preference = await new Preference(mp).create({
      body: {
        items: mpItems,
        payer: { name: customer.name, email: customer.email, phone: { number: customer.phone } },
        external_reference: orderCode,
        metadata: { order_code: orderCode, email: customer.email, items: items.map((i) => i.id).join(",") },
        back_urls: {
          success: `${FRONTEND_URL}/meus-produtos.html?status=approved`,
          pending: `${FRONTEND_URL}/meus-produtos.html?status=pending`,
          failure: `${FRONTEND_URL}/checkout.html?status=failure`,
        },
        auto_return: "approved",
      },
    });
    res.json({ init_point: preference.init_point, orderCode });
  } catch (err) {
    console.error("checkout:", err.message);
    res.status(500).json({ error: "Falha ao criar pagamento" });
  }
});

// ---- Receber confirmação do Mercado Pago (configure esta URL no painel MP) ----
app.post("/api/webhook", async (req, res) => {
  try {
    const paymentId = req.body?.data?.id || req.query?.["data.id"] || req.query?.id;
    const topic = req.body?.type || req.query?.topic || req.body?.topic;
    if (mp && paymentId && (topic === "payment" || !topic)) {
      const payment = await new Payment(mp).get({ id: paymentId });
      if (payment.status === "approved") {
        const email = (payment.metadata?.email || payment.payer?.email || "").toLowerCase();
        const ids = (payment.metadata?.items || "").split(",").filter(Boolean);
        const orders = loadOrders();
        if (!orders.find((o) => o.payment_id === String(paymentId))) {
          orders.unshift({
            code: payment.metadata?.order_code || payment.external_reference,
            payment_id: String(paymentId),
            email,
            items: ids.map((id) => {
              const p = findProduct(id);
              return { id, name: p?.name || id, fileUrl: p?.fileUrl || "" };
            }),
            total: payment.transaction_amount,
            date: new Date().toISOString(),
          });
          saveOrders(orders);
          console.log("Pedido liberado:", email, ids.join(","));
        }
      }
    }
    res.sendStatus(200);
  } catch (err) {
    console.error("webhook:", err.message);
    res.sendStatus(200); // sempre 200 para o MP não reenviar em loop
  }
});

// ---- Listar acessos liberados de um e-mail ----
app.get("/api/meus-produtos", (req, res) => {
  const email = (req.query.email || "").toLowerCase().trim();
  if (!email) return res.status(400).json({ error: "email obrigatório" });
  const items = [];
  loadOrders().filter((o) => o.email === email).forEach((o) =>
    o.items.forEach((it) => { if (!items.find((x) => x.id === it.id)) items.push(it); })
  );
  res.json({ items });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Yure Pinturas API rodando na porta ${PORT}`));
