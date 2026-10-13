# Yure Pinturas — Loja de Produtos Digitais

Loja online completa, feita para vender pelo celular: vitrine de produtos digitais (cursos, e-books, packs), carrinho, checkout com **Mercado Pago (Pix + cartão)** ou **Pix direto com WhatsApp**, página de entrega e painel administrativo.

**Páginas:** `index.html` (vitrine) • `produto.html` (detalhes) • `checkout.html` (pagamento) • `meus-produtos.html` (entrega) • `admin.html` (painel)

---

## PASSO 1 — Coloque seus dados (5 minutos)

Abra a página **`admin.html`** no navegador e preencha:

1. **WhatsApp** — seu número com DDI+DDD, só dígitos. Ex: `5586999999999`
2. **Chave Pix** — para receber no Pix direto (com 5% de desconto p/ o cliente)
3. Salve. Depois clique em **"Baixar config.js"** e substitua o arquivo `js/config.js` aqui no repositório (ou edite o `js/config.js` direto no GitHub).

> Sem isso a loja funciona, mas os pedidos vão para um número/chave de exemplo.

## PASSO 2 — Cadastre seus produtos de verdade

Ainda no `admin.html`, seção **Produtos**: troque nome, preço, descrição e — o mais importante — o **link de entrega** de cada produto (`fileUrl`): pode ser um link do Google Drive, Dropbox, área de membros, Hotmart etc. É esse link que o cliente recebe após pagar.

Depois clique em **"Baixar products.js"** e substitua `js/products.js` no repositório.

Para trocar as capas, coloque suas imagens na pasta `assets/` e informe o caminho no campo "Imagem de capa".

## PASSO 3 — Publique a loja grátis (GitHub Pages)

1. Suba estes arquivos para o repositório no GitHub.
2. Em **Settings → Pages → Deploy from branch**, escolha a branch `main` e a pasta `/ (root)`.
3. Sua loja entra no ar em `https://SEU-USUARIO.github.io/Yurepinturas`.

Alternativas grátis: Netlify ou Vercel (arraste a pasta do projeto para o painel deles).

## PASSO 4 — Ative o Mercado Pago (pagamento automático)

Sem esse passo, a loja vende pelo **Pix direto + WhatsApp** (que já funciona). Para liberar **Pix e cartão automáticos**:

1. Crie sua conta em [mercadopago.com.br](https://www.mercadopago.com.br) e ative como vendedor.
2. Pegue o **Access Token** em Developers → Suas integrações → Credenciais (use as credenciais de **produção**).
3. Publique o backend da pasta `server/` num serviço grátis (ex: Render.com → New → Web Service → conecte este repositório, Root Directory `server`, Start Command `npm start`, e cadastre as variáveis `MP_ACCESS_TOKEN` e `FRONTEND_URL` com a URL da sua loja).
4. No painel do Mercado Pago, cadastre o webhook: `https://SUA-API.onrender.com/api/webhook` (evento: pagamento).
5. Volte ao `admin.html`, preencha a **URL do backend**, salve e baixe o novo `config.js`.

### Testar localmente

```bash
cd server
cp .env.example .env   # preencha com seus dados
npm install
npm start              # API em http://localhost:3001
```

E sirva a loja com qualquer servidor estático (ex: `python3 -m http.server` na raiz).

---

## Como o dinheiro chega até você

| Forma | Como recebe | Taxa |
|---|---|---|
| Mercado Pago (Pix/cartão) | Cai na sua conta Mercado Pago, você transfere ao banco | ~ Pix 0,99% • cartão ~4,99% + parcelamento |
| Pix direto | Cai direto na sua conta, sem intermediário | zero |

## Estrutura

```
├── index.html / produto.html / checkout.html / meus-produtos.html / admin.html
├── css/style.css            # visual da loja (mobile-first, sem dependências)
├── js/config.js             # SEUS DADOS: whatsapp, pix, backend
├── js/products.js           # SEUS PRODUTOS: nome, preço, link de entrega
├── js/store.js              # carrinho, checkout, entrega
├── assets/                  # capas dos produtos + ícone do app
├── manifest.json + sw.js    # loja instalável no celular (PWA)
└── server/                  # backend Mercado Pago (Node.js)
    ├── server.js            # checkout + webhook + liberação
    └── .env.example         # modelo de configuração
```

## Checklist antes de divulgar

- [ ] WhatsApp e Pix reais configurados
- [ ] Produtos reais com link de entrega testado
- [ ] Fez uma compra teste (Pix de R$ 1 ou modo sandbox do MP)
- [ ] Loja publicada com HTTPS (obrigatório p/ Pix e PWA)
- [ ] Webhook do Mercado Pago cadastrado (se usar pagamento automático)
