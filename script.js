/**
 * JR BURGUER — Premium Cardápio
 * Para trocar imagens: substitua o valor de `image` pelo caminho real.
 */

/* ======================================================
   DADOS — HAMBÚRGUERES
====================================================== */
const BURGERS = [
  {
    id: 1,
    name: "JR Burguer",
    desc: "Pão artesanal, molho caseiro especial, hambúrguer bovino 200g e queijo cheddar.",
    price: 20.0,
    image: "jrburguer.png"
  },
  {
    id: 2,
    name: "JR Salada",
    desc: "Pão artesanal, molho caseiro, hambúrguer 200g, queijo cheddar, alface crocante e tomate.",
    price: 25.0,
    image: "jrsalada.png"
  },
  {
    id: 3,
    name: "JR Bacon",
    desc: "Pão artesanal, molho caseiro, hambúrguer 200g, queijo cheddar, bacon crocante, alface e tomate.",
    price: 30.0,
    image: "jrbacon.png"
  },
  {
    id: 4,
    name: "JR Duplo",
    desc: "Pão artesanal, molho caseiro, hambúrguer duplo (400g), queijo cheddar, alface e tomate.",
    price: 40.0,
    image: "jrduplo.png"
  },
  {
    id: 5,
    name: "JR Bacon Duplo",
    desc: "Pão artesanal, molho caseiro, hambúrguer duplo (400g), queijo cheddar, bacon, alface e tomate. O mais completo!",
    price: 45.0,
    image: "jrbaconduplo.png"
  }
];

/* ======================================================
   DADOS — BEBIDAS
====================================================== */
const DRINKS = [
  { id: 101, name: "Coca-Cola Original (2L)", price: 15.0, image: "coca cola original.png", badge: null },
  { id: 102, name: "Coca-Cola Zero (Lata 350ml)", price: 6.0, image: "coca cola zero.png", badge: null },
  { id: 103, name: "Coca-Cola Lata (350ml)", price: 6.0, image: "coca lata.png", badge: null },
  { id: 104, name: "Guaraná (Lata 350ml)", price: 6.0, image: "guaraná lata.png", badge: null },
  { id: 105, name: "Fanta Laranja (Lata 350ml)", price: 6.0, image: "fanta laranja.png", badge: null },
  { id: 106, name: "Fanta Uva (Lata 350ml)", price: 6.0, image: "fanta uva.png", badge: null }
];

/* ======================================================
  DADOS — SOBREMESAS (SOB CONSULTA)
====================================================== */
const DESSERTS = [
  {
    id: 201,
    name: "Cone Recheado (sabor a consultar)",
    desc: "Consulte no WhatsApp os sabores disponiveis no momento.",
    price: 10.0,
    image: "conessss.png"
  }
];

/* ======================================================
   CONFIGURAÇÕES
====================================================== */
const BANNER_IMAGE    = "banner cardápio.png";
const PROFILE_IMAGE   = "logojrburguer.jpeg";
const WHATSAPP_NUMBER = "5542998462451";

/* ======================================================
   ESTADO GLOBAL
====================================================== */
let cart           = [];
let currentProduct = null;
let modalQty       = 1;

/* ======================================================
   HELPERS
====================================================== */
function fmt(value) {
  return "R$ " + value.toFixed(2).replace(".", ",");
}

/* ======================================================
   SELOS — ROTAÇÃO DIÁRIA AUTOMÁTICA
   A cada dia, dois produtos diferentes recebem os selos.
   O índice muda com base no número do dia do ano.
====================================================== */
const BADGES = ["Mais Vendido 🔥", "Top da Casa ⭐"];

function assignDailyBadges() {
  // número do dia do ano (0–364) como semente de rotação
  const now     = new Date();
  const start   = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);

  // gera dois índices distintos usando o dia como base
  const total = BURGERS.length;
  const idx1  = dayOfYear % total;
  const idx2  = (dayOfYear + 2) % total === idx1
    ? (dayOfYear + 3) % total
    : (dayOfYear + 2) % total;

  BURGERS.forEach((b, i) => {
    if (i === idx1)      b.badge = BADGES[0];
    else if (i === idx2) b.badge = BADGES[1];
    else                 b.badge = null;
  });
}

/* ======================================================
   RENDER — CARDS HAMBÚRGUERES
====================================================== */
function renderBurgers() {
  const grid = document.getElementById("burgersGrid");
  grid.innerHTML = "";

  BURGERS.forEach((p) => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      ${p.badge ? `<span class="product-card__badge">${p.badge}</span>` : ""}
      <img class="product-card__img" src="${encodeURI(p.image)}" alt="${p.name}" loading="lazy" />
      <div class="product-card__body">
        <h4 class="product-card__name">${p.name}</h4>
        <p class="product-card__desc">${p.desc}</p>
        <div class="product-card__footer">
          <span class="product-card__price"><small>R$</small> ${p.price.toFixed(2).replace(".",",")}</span>
          <button type="button" class="btn-card" aria-label="Adicionar ${p.name}">+</button>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(p));
    card.querySelector(".btn-card").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p, 1);
      animateCardBtn(e.currentTarget);
    });

    grid.appendChild(card);
  });
}

/* ======================================================
   RENDER — CARDS BEBIDAS
====================================================== */
function renderDrinks() {
  const grid = document.getElementById("drinksGrid");
  grid.innerHTML = "";

  DRINKS.forEach((p) => {
    const card = document.createElement("article");
    card.className = "drink-card";

    card.innerHTML = `
      <img class="drink-card__img" src="${encodeURI(p.image)}" alt="${p.name}" loading="lazy" />
      <div class="drink-card__info">
        <p class="drink-card__name">${p.name}</p>
        <span class="drink-card__price">${fmt(p.price)}</span>
      </div>
      <button type="button" class="btn-card" aria-label="Adicionar ${p.name}">+</button>
    `;

    card.addEventListener("click", () => openModal(p));
    card.querySelector(".btn-card").addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(p, 1);
      animateCardBtn(e.currentTarget);
    });

    grid.appendChild(card);
  });
}

/* ======================================================
  RENDER — SOBREMESAS (CONSULTA SIMPLES)
====================================================== */
function sendDessertInquiry() {
  const dessert = DESSERTS[0];
  const msg = [
    "Oi! Quero verificar a disponibilidade dos cones recheados.",
    "",
    `• ${dessert.name} — ${fmt(dessert.price)}`,
    "",
    "Quais sabores estao disponiveis hoje? 🍦"
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

function renderDesserts() {
  const grid = document.getElementById("dessertsGrid");
  grid.innerHTML = "";

  DESSERTS.forEach((dessert) => {
    const card = document.createElement("article");
    card.className = "dessert-card";
    card.dataset.id = dessert.id;

    card.innerHTML = `
      <img class="dessert-card__img" src="${encodeURI(dessert.image)}" alt="${dessert.name}" loading="lazy" />
      <div class="dessert-card__body">
        <p class="dessert-card__name">${dessert.name}</p>
        <p class="dessert-card__desc">${dessert.desc}</p>
        <span class="dessert-card__price">R$ ${dessert.price.toFixed(2).replace(".", ",")}</span>
      </div>
      <button type="button" class="dessert-card__check" aria-label="Verificar disponibilidade de cones">
        Verificar disponibilidade
      </button>
    `;

    card.querySelector(".dessert-card__check").addEventListener("click", sendDessertInquiry);

    grid.appendChild(card);
  });
}

/* ======================================================
   MODAL — CARROSSEL
====================================================== */
let modalList  = [];   // lista atual de produtos exibida no modal
let modalIndex = 0;    // índice do produto ativo

function openModal(product) {
  // determina a lista de produtos da mesma categoria
  const inBurgers = BURGERS.some((b) => b.id === product.id);
  modalList  = inBurgers ? BURGERS : DRINKS;
  modalIndex = modalList.findIndex((p) => p.id === product.id);
  if (modalIndex < 0) modalIndex = 0;

  modalQty = 1;
  buildCarousel();
  syncModalInfo();

  document.getElementById("productModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function buildCarousel() {
  const carousel = document.getElementById("modalCarousel");
  const dots     = document.getElementById("modalDots");
  carousel.innerHTML = "";
  dots.innerHTML     = "";

  modalList.forEach((p, i) => {
    // slide
    const slide = document.createElement("div");
    slide.className = "modal__slide" + (i === modalIndex ? " active" : "");
    slide.dataset.index = i;
    slide.innerHTML = `<img src="${encodeURI(p.image)}" alt="${p.name}" loading="lazy" />`;
    slide.addEventListener("click", () => goToSlide(i));
    carousel.appendChild(slide);

    // dot
    const dot = document.createElement("button");
    dot.className  = "modal__dot" + (i === modalIndex ? " active" : "");
    dot.dataset.index = i;
    dot.setAttribute("aria-label", p.name);
    dot.addEventListener("click", () => goToSlide(i));
    dots.appendChild(dot);
  });

  // scroll para o slide ativo sem animação
  requestAnimationFrame(() => {
    const activeSlide = carousel.querySelector(".modal__slide.active");
    if (activeSlide) {
      carousel.scrollLeft = activeSlide.offsetLeft - carousel.offsetLeft;
    }
  });

  // detectar scroll manual para sincronizar
  carousel.onscroll = debounce(() => {
    const slideWidth = carousel.querySelector(".modal__slide")?.offsetWidth || 1;
    const newIndex   = Math.round(carousel.scrollLeft / (slideWidth + 12));
    if (newIndex !== modalIndex) goToSlide(newIndex);
  }, 80);
}

function goToSlide(index) {
  if (index < 0 || index >= modalList.length) return;

  const carousel = document.getElementById("modalCarousel");
  const slides   = carousel.querySelectorAll(".modal__slide");
  const dots     = document.getElementById("modalDots").querySelectorAll(".modal__dot");

  slides.forEach((s, i) => s.classList.toggle("active", i === index));
  dots.forEach((d, i) => d.classList.toggle("active", i === index));

  slides[index]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

  modalIndex = index;
  currentProduct = modalList[index];
  modalQty = 1;
  syncModalInfo();
}

function syncModalInfo() {
  const p = modalList[modalIndex];

  // categoria
  const inBurgers = BURGERS.some((b) => b.id === p.id);
  document.getElementById("modalCategory").textContent = inBurgers ? "🍔 Hambúrgueres" : "🥤 Bebidas";

  document.getElementById("modalName").textContent  = p.name;
  document.getElementById("modalQtyVal").textContent = "1";
  document.getElementById("modalPrice").textContent  = fmt(p.price);
  updateModalTotal();
}

function closeModal() {
  document.getElementById("productModal").classList.remove("open");
  document.body.style.overflow = "";
  currentProduct = null;
}

function updateModalTotal() {
  if (!currentProduct) return;
  document.getElementById("modalAddTotal").textContent = fmt(currentProduct.price * modalQty);
}

function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* ======================================================
   CARRINHO
====================================================== */
function addToCart(product, qty) {
  const existing = cart.find((i) => i.id === product.id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty
    });
  }
  updateCartUI();
  showToast(`✅ ${product.name} adicionado!`);
  bumpBadge();
}

function changeCartQty(id, delta) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter((i) => i.id !== id);
  updateCartUI();
}

function updateCartUI() {
  const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  document.getElementById("cartBadge").textContent = String(totalQty);
  document.getElementById("cartTotal").textContent = fmt(totalPrice);
  document.getElementById("cartItemCount").textContent =
    `${totalQty} ${totalQty === 1 ? "item" : "itens"}`;

  const list   = document.getElementById("cartList");
  const empty  = document.getElementById("cartEmpty");
  const footer = document.getElementById("cartFooter");

  list.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <img class="cart-item__img" src="${encodeURI(item.image)}" alt="${item.name}" />
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <p class="cart-item__price">${fmt(item.price)} cada</p>
        <div class="cart-item__controls">
          <button type="button" class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>
    `;
    list.appendChild(li);
  });

  list.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () =>
      changeCartQty(Number(btn.dataset.id), Number(btn.dataset.delta))
    );
  });

  const isEmpty = cart.length === 0;
  empty.style.display  = isEmpty ? "flex" : "none";
  footer.style.display = isEmpty ? "none" : "flex";
}

function openCart() {
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

/* ======================================================
   WHATSAPP + MODAL DE ENDEREÇO
====================================================== */
function openAddrModal() {
  if (!cart.length) { showToast("❗ Carrinho vazio!"); return; }
  // limpa campos
  ["addrName", "addrStreet", "addrNeighborhood", "addrRef", "addrCashChange"].forEach((id) => {
    document.getElementById(id).value = "";
  });
  document.getElementById("addrPayment").value = "";
  document.getElementById("addrCashChangeField").classList.add("is-hidden");
  document.getElementById("addrOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
  document.getElementById("addrName").focus();
}

function closeAddrModal() {
  document.getElementById("addrOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function finalizarPedido() {
  const nome    = document.getElementById("addrName").value.trim();
  const rua     = document.getElementById("addrStreet").value.trim();
  const bairro  = document.getElementById("addrNeighborhood").value.trim();
  const pagamento = document.getElementById("addrPayment").value;
  const troco   = document.getElementById("addrCashChange").value.trim();
  const ref     = document.getElementById("addrRef").value.trim();

  if (!rua || !bairro) {
    showToast("❗ Informe a rua e o bairro!");
    document.getElementById(rua ? "addrNeighborhood" : "addrStreet").focus();
    return;
  }

  if (!pagamento) {
    showToast("❗ Selecione a forma de pagamento!");
    document.getElementById("addrPayment").focus();
    return;
  }

  closeAddrModal();

  const lines = cart.map((i) => `• ${i.name} x${i.qty} — ${fmt(i.price * i.qty)}`);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const enderecoBloco = [
    nome    ? `👤 *Nome:* ${nome}`          : null,
    `🏠 *Rua:* ${rua}`,
    `📌 *Bairro:* ${bairro}`,
    ref     ? `🔖 *Referência:* ${ref}`     : null,
  ].filter(Boolean).join("\n");

  const pagamentoLabel = {
    pix: "Pix",
    dinheiro: "Dinheiro",
    cartao: "Cartão"
  }[pagamento];

  const pagamentoBloco = [
    `💳 *Pagamento:* ${pagamentoLabel}`,
    pagamento === "dinheiro" ? `💵 *Troco para:* ${troco || "Não precisa de troco"}` : null
  ].filter(Boolean).join("\n");

  const msg = [
    `🍔 *JR BURGUER — Novo Pedido*`,
    ``,
    ...lines,
    ``,
    `💰 *Subtotal: ${fmt(total)}*`,
    `🛵 *Taxa de entrega: a confirmar pelo atendente*`,
    ``,
    pagamentoBloco,
    ``,
    `📍 *Endereço de entrega:*`,
    enderecoBloco,
    ``,
    `⏳ Aguardo confirmação do pedido e o valor da taxa de entrega! 😊`
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ======================================================
   ANIMAÇÕES / FEEDBACK
====================================================== */
let toastTimer = null;
function showToast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2200);
}

function animateCardBtn(btn) {
  btn.textContent = "✓";
  btn.classList.add("added");
  setTimeout(() => { btn.textContent = "+"; btn.classList.remove("added"); }, 900);
}

function bumpBadge() {
  const el = document.getElementById("cartBadge");
  el.classList.remove("bump");
  void el.offsetWidth;
  el.classList.add("bump");
}

/* ======================================================
   INICIALIZAÇÃO
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  /* Banner + Logo */
  document.getElementById("bannerImage").src = encodeURI(BANNER_IMAGE);
  document.getElementById("profileLogo").src  = encodeURI(PROFILE_IMAGE);

  /* Selos diários + render */
  assignDailyBadges();
  renderBurgers();
  renderDrinks();
  renderDesserts();
  updateCartUI();

  /* Tabs de categoria */
  const tabs = document.querySelectorAll(".cat-btn");
  const sectionsByCategory = {
    burgers: document.getElementById("burgersSection"),
    drinks: document.getElementById("drinksSection"),
    desserts: document.getElementById("dessertsSection")
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const selectedCategory = tab.dataset.category;
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      Object.entries(sectionsByCategory).forEach(([category, section]) => {
        section.classList.toggle("is-hidden", category !== selectedCategory);
      });
    });
  });

  /* Modal */
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalBackdrop").addEventListener("click", closeModal);

  document.getElementById("modalQtyMinus").addEventListener("click", () => {
    if (modalQty <= 1) return;
    modalQty--;
    document.getElementById("modalQtyVal").textContent = modalQty;
    updateModalTotal();
  });

  document.getElementById("modalQtyPlus").addEventListener("click", () => {
    modalQty++;
    document.getElementById("modalQtyVal").textContent = modalQty;
    updateModalTotal();
  });

  document.getElementById("modalAdd").addEventListener("click", (e) => {
    if (!currentProduct) return;
    addToCart(currentProduct, modalQty);
    const btn = e.currentTarget;
    const label = document.getElementById("modalAddLabel");
    label.textContent = "Adicionado ✓";
    btn.classList.add("added");
    setTimeout(() => {
      label.textContent = "Adicionar ao pedido";
      btn.classList.remove("added");
      closeModal();
    }, 900);
  });

  /* Carrinho */
  document.getElementById("cartFab").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeCart();
  });
  document.getElementById("cartCheckout").addEventListener("click", openAddrModal);

  /* Modal de endereço */
  const paymentSelect = document.getElementById("addrPayment");
  const cashChangeField = document.getElementById("addrCashChangeField");
  const cashChangeInput = document.getElementById("addrCashChange");

  const syncPaymentFields = () => {
    const isCash = paymentSelect.value === "dinheiro";
    cashChangeField.classList.toggle("is-hidden", !isCash);
    if (!isCash) cashChangeInput.value = "";
  };

  paymentSelect.addEventListener("change", syncPaymentFields);
  document.getElementById("addrCancel").addEventListener("click", closeAddrModal);
  document.getElementById("addrConfirm").addEventListener("click", finalizarPedido);
  document.getElementById("addrOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAddrModal();
  });

  /* Teclado */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeCart(); closeAddrModal(); }
  });

  /* Cart footer oculto por padrão */
  document.getElementById("cartFooter").style.display = "none";
});
