// ============================================================
//  YURE PINTURAS — Catálogo de produtos (EXEMPLOS — troque pelos seus!)
//  Como trocar: edite este arquivo ou use a página admin.html
//  - price / oldPrice: números com ponto decimal. Ex: 97.00
//  - cover: caminho da imagem de capa
//  - fileUrl: link de entrega do produto (Google Drive, Dropbox, área de
//    membros, Hotmart etc.). O cliente só vê depois do pagamento.
// ============================================================
const DEFAULT_PRODUCTS = [
  {
    id: "curso-pintura-profissional",
    name: "Curso Pintura Residencial Profissional",
    category: "Cursos",
    price: 97.0,
    oldPrice: 197.0,
    badge: "MAIS VENDIDO",
    cover: "assets/curso-pintura.jpg",
    rating: 4.9,
    reviews: 132,
    short: "Do zero ao acabamento perfeito: técnicas profissionais para pintar casas e conquistar clientes.",
    description: "Um passo a passo completo em vídeo para você dominar a pintura residencial: preparação de superfície, massas, lixamento, escolha de tintas, aplicação com rolo e pincel, efeitos decorativos e precificação de serviços. Ideal para quem quer começar na profissão ou subir o nível do acabamento e cobrar mais caro.",
    includes: [
      "Mais de 40 vídeo-aulas diretas ao ponto",
      "Módulo de preparação de paredes e tetos",
      "Módulo de pintura com rolo, pincel e pistola",
      "Aula de orçamento e precificação de serviços",
      "Certificado de conclusão",
      "Acesso vitalício + atualizações gratuitas",
    ],
    delivery: "Acesso imediato à área de membros por e-mail, assim que o pagamento for confirmado.",
    fileUrl: "",
  },
  {
    id: "ebook-pintura-perfeita",
    name: "E-book Pintura Perfeita",
    category: "E-books",
    price: 27.0,
    oldPrice: 47.0,
    badge: "OFERTA",
    cover: "assets/ebook-pintura.jpg",
    rating: 4.8,
    reviews: 89,
    short: "O guia ilustrado com cores, combinações e truques de acabamento para nunca mais errar.",
    description: "Um e-book direto e ilustrado com tudo que você precisa para acertar nas cores e no acabamento: círculo cromático simplificado, combinações que valorizam cada ambiente, tipos de tinta para cada superfície, erros comuns que mancham a pintura e o checklist profissional antes de entregar o serviço.",
    includes: [
      "120 páginas ilustradas (PDF)",
      "Guia de cores e combinações por ambiente",
      "Tabela de tintas: qual usar em cada caso",
      "Checklist de entrega profissional",
      "Leitura no celular, tablet ou computador",
    ],
    delivery: "Download liberado por e-mail e na página Meus Produtos após a confirmação do pagamento.",
    fileUrl: "",
  },
  {
    id: "pack-pintor-pro",
    name: "Pack Pintor PRO: Artes + Planilha de Orçamento",
    category: "Packs",
    price: 47.0,
    oldPrice: 97.0,
    badge: "NOVO",
    cover: "assets/pack-pintor.jpg",
    rating: 5.0,
    reviews: 41,
    short: "50 artes editáveis para divulgar seu trabalho + planilha que calcula o orçamento sozinha.",
    description: "O kit para o pintor parecer profissional e fechar mais serviços: 50 artes editáveis para Instagram e WhatsApp (antes/depois, promoções, depoimentos), planilha de orçamento que calcula tinta, mão de obra e lucro automaticamente, modelo de contrato de prestação de serviço e tabela de preços sugeridos por m².",
    includes: [
      "50 artes editáveis para redes sociais",
      "Planilha de orçamento automática (Excel/Google)",
      "Modelo de contrato de serviço",
      "Tabela de preços sugeridos por m²",
      "Tutorial em vídeo de como usar tudo",
    ],
    delivery: "Link de download enviado por e-mail e liberado em Meus Produtos após o pagamento.",
    fileUrl: "",
  },
];

// Permite reaproveitar este mesmo catálogo no backend (Node.js)
if (typeof module !== "undefined" && module.exports) {
  module.exports = DEFAULT_PRODUCTS;
}
