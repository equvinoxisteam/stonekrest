// Stonekrest Business Banking Dashboard (client: Equvinoxis)

const initApp = () => {
  if (window.__equvinoxisInitialized) return;
  window.__equvinoxisInitialized = true;
  console.log("✓ Stonekrest app initializing...");
  // --- MOCK DATABASE STATE ---
  const state = {
    balances: {
      checking: 2483291.12,
      savings: 12500000.00,
      gatewayCollections: 1847200.00,
      usdReceivable: 42800.00,
      eurReceivable: 18200.00
    },
    fxRates: { USD: 83.52, EUR: 90.0, GBP: 105.2 },
    cards: [
      { id: "c1", label: "Equvinoxis Business Debit", type: "physical", last4: "4291", holder: "EQUVINOXIS", limit: 500000, spend: 79000, frozen: false },
      { id: "c2", label: "Marketing Spend", type: "virtual", last4: "8821", holder: "Aniketh", limit: 1500000, spend: 1245000, frozen: false },
      { id: "c3", label: "SaaS Subscriptions", type: "virtual", last4: "1198", holder: "Finance Team", limit: 250000, spend: 198000, frozen: false }
    ],
    transactions: [
      { id: "tx1", date: "Jun 10, 2026", type: "upi", desc: "Razorpay settlement — Order #SK-9281", asset: "INR", status: "Completed", amount: 142050.00 },
      { id: "tx2", date: "Jun 09, 2026", type: "neft", desc: "NEFT from Acme India Pvt Ltd", asset: "INR", status: "Completed", amount: 520000.00 },
      { id: "tx3", date: "Jun 08, 2026", type: "fiat", desc: "Interest credit — Smart Savings", asset: "INR", status: "Completed", amount: 52128.00 },
      { id: "tx4", date: "Jun 07, 2026", type: "upi", desc: "Paytm Business collection", asset: "INR", status: "Completed", amount: 49950.00 },
      { id: "tx5", date: "Jun 06, 2026", type: "card", desc: "AWS India", asset: "INR", status: "Completed", amount: -42000.00 },
      { id: "tx6", date: "Jun 05, 2026", type: "imps", desc: "IMPS to vendor — TCS Payroll", asset: "INR", status: "Pending", amount: -2500000.00 },
      { id: "tx7", date: "Jun 03, 2026", type: "swift", desc: "SWIFT inward — Client US wire", asset: "USD", status: "Completed", amount: 8500.00 }
    ],
    gatewaySettlements: [
      { date: "Today", gateway: "Razorpay", ref: "pay_RCJWoetDq0xyic", status: "Settled", amount: 428150 },
      { date: "Yesterday", gateway: "Paytm", ref: "PTM-8829102", status: "Settled", amount: 192400 },
      { date: "Jun 08", gateway: "PhonePe", ref: "PP-GW-44102", status: "Settled", amount: 88500 }
    ],
    maskBalances: false
  };

  // --- HTML TEMPLATES FOR INJECTED MODE ---
  const WORKING_CAPITAL_HTML = `
    <div class="slash-hero-header">
      <div class="slash-badge">SLASH CAPITAL</div>
      <h1>Flexible Revenue-Based Working Capital</h1>
      <p>Accelerate your growth without equity dilution. Access up to $250,000 instantly, repaid automatically as your business drives revenue.</p>
      
      <div class="capital-perks">
        <div class="perk"><i data-lucide="check-circle-2"></i><span>No Personal Guarantees</span></div>
        <div class="perk"><i data-lucide="check-circle-2"></i><span>Flat fees as low as 6%</span></div>
        <div class="perk"><i data-lucide="check-circle-2"></i><span>Flexible repayments tied to daily sales</span></div>
      </div>
    </div>

    <div class="capital-layout-grid">
      <div class="grid-card">
        <div class="card-header border-bottom"><h3>Your Active Financing</h3></div>
        <div class="card-body active-advance-status" id="active-advance-box"></div>
      </div>

      <div class="grid-card">
        <div class="card-header border-bottom"><h3>Calculate Capital Funding Terms</h3></div>
        <div class="card-body calculator-body">
          <div class="calculator-control">
            <div class="control-label"><span>Funding Amount</span><span class="control-value" id="calc-amount-label">$100,000</span></div>
            <input type="range" id="slider-capital-amount" min="10000" max="250000" step="5000" value="100000" class="premium-slider" />
            <div class="slider-bounds"><span>$10,000</span><span>$250,000</span></div>
          </div>

          <div class="calculator-control">
            <div class="control-label"><span>Repayment Share (% of daily sales)</span><span class="control-value" id="calc-repay-label">10%</span></div>
            <input type="range" id="slider-repay-rate" min="5" max="25" step="1" value="10" class="premium-slider" />
            <div class="slider-bounds"><span>5% Daily Share</span><span>25% Daily Share</span></div>
          </div>

          <div class="pricing-summary-box">
            <div class="summary-row"><span class="text-secondary">Cash Advance Principal</span><span class="font-medium" id="summary-principal">$100,000.00</span></div>
            <div class="summary-row"><span class="text-secondary">Flat Capital Fee (8%)</span><span class="font-medium text-purple" id="summary-fee">$8,000.00</span></div>
            <div class="divider"></div>
            <div class="summary-row total-row"><span>Total Repayment Obligation</span><span class="font-bold text-white" id="summary-total">$108,000.00</span></div>
            <div class="summary-row alert-row"><span class="text-secondary">Estimated Payoff Time</span><span class="font-medium" id="summary-timeline">180 Days</span></div>
          </div>

          <button class="btn btn-purple btn-block" id="btn-request-capital"><i data-lucide="zap"></i> Apply & Disburse Instantly</button>
        </div>
      </div>
    </div>
  `;

  const STABLECOIN_PAYMENTS_HTML = `
    <div class="slash-hero-header emerald-glow">
      <div class="slash-badge badge-green-glow">SLASH STABLECOINS</div>
      <h1>Bridges Fiat & Digital Asset Payments</h1>
      <p>Receive USDC & USDT deposits via Ethereum, Solana, and Arbitrum. Convert them automatically into USD on receipt or send crypto payroll anywhere in the world instantly.</p>
    </div>

    <div class="stablecoin-grid">
      <div class="grid-card">
        <div class="card-header border-bottom"><h3>Stablecoin Wallets</h3></div>
        <div class="card-body">
          <div class="asset-balance-row">
            <div class="asset-meta"><div class="coin-logo logo-usdc"></div><div><span class="asset-name">USDC (USD Coin)</span><span class="asset-subtext font-mono">Multi-chain ERC20/SPL</span></div></div>
            <div class="asset-value filter-balance" id="wallet-usdc-val" data-amount="84200.00">$84,200.00</div>
          </div>
          <div class="asset-balance-row">
            <div class="asset-meta"><div class="coin-logo logo-usdt"></div><div><span class="asset-name">USDT (Tether)</span><span class="asset-subtext font-mono">Multi-chain ERC20/SPL</span></div></div>
            <div class="asset-value filter-balance" id="wallet-usdt-val" data-amount="15500.00">$15,500.00</div>
          </div>
          <div class="auto-convert-box">
            <div class="auto-convert-meta">
              <div class="font-medium text-white flex-align-center gap-1.5"><i data-lucide="zap" class="text-green size-4"></i><span>Instant Dollar Auto-Conversion</span></div>
              <p class="asset-subtext">Automatically swap deposits to USD and route to checking account (0.1% swap fee).</p>
            </div>
            <label class="switch"><input type="checkbox" id="toggle-auto-convert" checked><span class="slider round"></span></label>
          </div>
        </div>
      </div>

      <div class="grid-card">
        <div class="card-header border-bottom"><h3>Receive Stablecoins</h3></div>
        <div class="card-body receive-card-body">
          <div class="chain-selector-wrapper">
            <span class="text-secondary font-medium">Select Network:</span>
            <div class="chain-pills">
              <button class="chain-pill active" data-chain="eth">Ethereum</button>
              <button class="chain-pill" data-chain="sol">Solana</button>
              <button class="chain-pill" data-chain="arb">Arbitrum</button>
            </div>
          </div>
          <div class="qr-address-box">
            <div class="qr-code-mock"><div class="mock-qr-dots" id="deposit-qr-visual"></div></div>
            <div class="address-copy-container">
              <div class="address-box-heading text-secondary">USDC/USDT Deposit Address</div>
              <div class="address-string font-mono" id="deposit-address-string">0x71C7656EC7ab88b098defB751B7401B5f6d8976F</div>
              <button class="btn btn-secondary btn-sm" id="btn-copy-deposit-addr"><i data-lucide="copy" class="size-3"></i> Copy Address</button>
            </div>
          </div>
          <div class="sim-actions-box">
            <span class="text-secondary font-medium block margin-bottom-8">Developer Simulator</span>
            <div class="flex gap-2">
              <button class="btn btn-secondary btn-sm flex-grow" id="btn-sim-deposit"><i data-lucide="arrow-down-to-line" class="size-3 text-green"></i> Simulate Stablecoin Deposit (+$5,000)</button>
            </div>
          </div>
        </div>
      </div>

      <div class="grid-card col-span-2">
        <div class="card-header border-bottom"><h3>Send Stablecoin Payment</h3></div>
        <div class="card-body">
          <form id="stablecoin-send-form" class="crypto-form">
            <div class="form-row-2">
              <div class="form-group"><label>Asset</label><select id="send-crypto-asset" required><option value="USDC">USDC (USD Coin)</option><option value="USDT">USDT (Tether)</option></select></div>
              <div class="form-group"><label>Destination Network</label><select id="send-crypto-network" required><option value="Ethereum (ERC-20)">Ethereum Mainnet</option><option value="Solana (SPL)">Solana</option><option value="Arbitrum (One)">Arbitrum One</option><option value="Base (ERC-20)">Base Network</option></select></div>
            </div>
            <div class="form-group"><label>Recipient Wallet Address</label><input type="text" id="send-crypto-address" placeholder="e.g. 0x71C... or Solana address" required class="font-mono" /></div>
            <div class="form-row-2">
              <div class="form-group"><label>Amount</label><div class="input-prefix-wrapper"><span class="input-prefix">$</span><input type="number" id="send-crypto-amount" placeholder="0.00" min="10" step="1" required /></div></div>
              <div class="crypto-fee-estimate-box">
                <div class="fee-estimate-row"><span class="text-secondary">Estimated Gas Fee:</span><span class="font-medium" id="crypto-gas-fee">$1.50</span></div>
                <div class="fee-estimate-row"><span class="text-secondary">Total Billable USD:</span><span class="font-semibold text-white" id="crypto-total-billable">$0.00</span></div>
              </div>
            </div>
            <button type="submit" class="btn btn-purple btn-block" id="btn-submit-crypto-transfer"><i data-lucide="send"></i> Dispatch Stablecoin Transfer</button>
          </form>
        </div>
      </div>
    </div>
  `;

  // --- MODE DETECTION ---
  // Determine mode and initialize immediately (script loaded at end of HTML, so DOM is ready)
  const isInjectedMode = document.querySelector('.tab-panel') === null && (document.querySelector('script[src*="cdn.mercury.com"]') !== null || window.__MOCK_PRODUCTION__ === true);
  if (isInjectedMode) {
    initInjectedMode();
  } else {
    initStandaloneMode();
  }

  // ==========================================
  // 1. INJECTED MODE ENGINE (Mercury + Slash Inject)
  // ==========================================
    function initInjectedMode() {
    console.log("[Mercury-Slash] Running in Production Dynamic Injection Mode.");
    // Try primary selector used in previous versions
    const primarySelector = "a._l1Link_1fg65_9";
    const fallbackSelector = ".menu-item"; // generic fallback for newer builds
    const genericSelector = "nav a, a[data-tab]"; // broad selector for any sidebar links
    const interval = setInterval(() => {
      let links = document.querySelectorAll(primarySelector);
      if (links.length === 0) {
        links = document.querySelectorAll(fallbackSelector);
      }
      if (links.length === 0) {
        links = document.querySelectorAll(genericSelector);
      }
      console.log('[Mercury-Slash] Link detection attempt, count:', links.length);
      if (links.length > 0) {
        clearInterval(interval);
        console.log('[Mercury-Slash] Sidebar links detected (count:', links.length, ')');
        setupInjectedSidebar(links);
      }
    }, 200);
  }

  function setupInjectedSidebar(links) {
    if (document.getElementById("slash-wc-link")) return; // Prevent double injection

    const templateLink = links[0];
    const parentContainer = templateLink.parentNode;

    // Create Working Capital L1 Sidebar Link
    const wcLink = templateLink.cloneNode(true);
    wcLink.id = "slash-wc-link";
    wcLink.classList.remove("active");
    wcLink.setAttribute("href", "#working-capital");
    wcLink.querySelector("span:nth-child(2) span").innerText = "Working Capital";
    wcLink.querySelector("span:first-child").innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
    `;
    
    const wcBadge = document.createElement("span");
    wcBadge.innerText = "Slash";
    wcBadge.className = "badge badge-purple";
    wcBadge.style.cssText = "font-size: 8px; font-weight: 700; padding: 2px 4px; border-radius: 4px; background: #8B5CF6; color: #FFFFFF; margin-left: 8px; text-transform: uppercase;";
    wcLink.querySelector("span:nth-child(2)").appendChild(wcBadge);

    // Create Stablecoin Payments L1 Sidebar Link
    const stableLink = templateLink.cloneNode(true);
    stableLink.id = "slash-stable-link";
    stableLink.classList.remove("active");
    stableLink.setAttribute("href", "#stablecoin-payments");
    stableLink.querySelector("span:nth-child(2) span").innerText = "Stablecoin Payments";
    stableLink.querySelector("span:first-child").innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-coins"><circle cx="8" cy="8" r="6"></circle><circle cx="18" cy="18" r="6"></circle><path d="M12 2v20"></path></svg>
    `;

    const stableBadge = document.createElement("span");
    stableBadge.innerText = "USDC";
    stableBadge.className = "badge badge-green";
    stableBadge.style.cssText = "font-size: 8px; font-weight: 700; padding: 2px 4px; border-radius: 4px; background: #10B981; color: #000000; margin-left: 8px; text-transform: uppercase;";
    stableLink.querySelector("span:nth-child(2)").appendChild(stableBadge);

    // Try to append after 'Payments' or 'Accounts'
    let insertAfterNode = null;
    links.forEach(l => {
      const text = l.querySelector("span:nth-child(2) span")?.innerText;
      if (text === "Payments" || text === "Accounts") {
        insertAfterNode = l;
      }
    });

    if (insertAfterNode) {
      insertAfterNode.parentNode.insertBefore(wcLink, insertAfterNode.nextSibling);
      wcLink.parentNode.insertBefore(stableLink, wcLink.nextSibling);
      console.log('[Mercury-Slash] Injected Working Capital link ID:', wcLink.id);
      console.log('[Mercury-Slash] Injected Stablecoin Payments link ID:', stableLink.id);
    } else {
      parentContainer.appendChild(wcLink);
      parentContainer.appendChild(stableLink);
    }

    // Set up click interception
    const navLinks = parentContainer.querySelectorAll("a");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (href === "#working-capital" || href === "#stablecoin-payments" || link.id === "slash-wc-link" || link.id === "slash-stable-link") {
          e.preventDefault();
          e.stopPropagation();

          // Set active state visually on links
          navLinks.forEach(l => l.classList.remove("active"));
          link.classList.add("active");

          const viewId = (href === "#working-capital" || link.id === "slash-wc-link") ? "working-capital" : "stablecoin-payments";
          showInjectedView(viewId);
        } else {
          // Standard React links: restore standard display
          restoreReactViews();
        }
      });
    });

    // Create Toast Container
    if (!document.getElementById("toast-container")) {
      const tc = document.createElement("div");
      tc.id = "toast-container";
      tc.className = "toast-container";
      document.body.appendChild(tc);
    }
  }

  function showInjectedView(viewId) {
    const layout = document.querySelector("div._layout_1r8y7_18");
    if (!layout) return;

    // Locate sidebar container
    const link = layout.querySelector("a._l1Link_1fg65_9");
    const sidebar = link ? link.closest("div") || link.parentNode.parentNode : null;

    // Hide all other children of layout (the React pages)
    Array.from(layout.children).forEach(child => {
      if (child !== sidebar && child.id !== "custom-overlay-container") {
        child.style.display = "none";
      }
    });

    // Mount overlay container inside flex layout
    let overlay = document.getElementById("custom-overlay-container");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "custom-overlay-container";
      overlay.style.cssText = "flex-grow: 1; height: 100vh; overflow-y: auto; background: #050608; padding: 40px; display: flex; flex-direction: column; z-index: 10;";
      layout.appendChild(overlay);
    }
    overlay.style.display = "flex";

    // Inject matching template HTML
    if (viewId === "working-capital") {
      overlay.innerHTML = WORKING_CAPITAL_HTML;
      bindCapitalCalculator();
      renderActiveAdvance();
    } else {
      overlay.innerHTML = STABLECOIN_PAYMENTS_HTML;
      bindStablecoinSystem();
    }

    lucide.createIcons();
  }

  function restoreReactViews() {
    const layout = document.querySelector("div._layout_1r8y7_18");
    if (!layout) return;

    const link = layout.querySelector("a._l1Link_1fg65_9");
    const sidebar = link ? link.closest("div") || link.parentNode.parentNode : null;

    // Show original React content elements again
    Array.from(layout.children).forEach(child => {
      if (child !== sidebar && child.id !== "custom-overlay-container") {
        child.style.display = "";
      }
    });

    // Hide custom overlay
    const overlay = document.getElementById("custom-overlay-container");
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  // ==========================================
  // 2. STANDALONE MODULE ENGINE
  // ==========================================
  function initStandaloneMode() {
    console.log("[Equvinoxis] Running in Standalone Mode.");

    const TAB_ALIASES = {
      "neft-rtgs": "payments",
      "upi-mandates": "payment-gateways",
    };

    const TAB_SUBMENU = {
      accounts: "submenu-accounts",
      treasury: "submenu-accounts",
      financing: "submenu-accounts",
      transactions: "submenu-transactions",
      insights: "submenu-transactions",
      accounting: "submenu-transactions",
      cards: "submenu-cards",
      "credit-card": "submenu-cards",
      payments: "submenu-payments",
      "mercury-payments": "submenu-payments",
      "payment-gateways": "submenu-payments",
      "international-receive": "submenu-payments",
      "bill-pay": "submenu-payments",
      recipients: "submenu-payments",
      taxes: "submenu-payments",
      invoicing: "submenu-invoicing",
      "recurring-series": "submenu-invoicing",
      customers: "submenu-invoicing",
      catalog: "submenu-invoicing",
    };

    const TAB_TITLES = {
      home: "Home",
      accounts: "Accounts",
      treasury: "Treasury",
      financing: "Financing",
      transactions: "Transactions",
      insights: "Insights",
      accounting: "Accounting",
      cards: "Cards",
      "credit-card": "Credit Card",
      payments: "Payments",
      "mercury-payments": "Payment Gateways",
      "payment-gateways": "UPI & Wallets",
      "international-receive": "International Receive",
      "bill-pay": "Bill Pay",
      recipients: "Recipients",
      taxes: "Taxes",
      invoicing: "Invoicing",
      "recurring-series": "Recurring Series",
      customers: "Customers",
      catalog: "Catalog",
      "ops-payroll": "Ops / Payroll",
      "transactions-insights": "Transactions Insights",
      reimbursements: "Reimbursements",
      "receive-client": "Receive from Clients",
      "receive-platforms": "Marketplaces",
      "receive-amazon": "Amazon India",
      settings: "Settings",
      "wire-drawdowns": "SWIFT Mandates",
      "ach-authorizations": "e-NACH Mandates",
    };

    const resolveTab = (tabName) => TAB_ALIASES[tabName] || tabName;

    const openSubmenuForTab = (tabName) => {
      const resolved = resolveTab(tabName);
      document.querySelectorAll(".menu-item-submenu").forEach((sub) => sub.classList.remove("open"));
      document.querySelectorAll(".menu-item-parent").forEach((p) => {
        p.classList.remove("open", "active");
      });
      const submenuId = TAB_SUBMENU[resolved];
      if (!submenuId) return;
      const submenu = document.getElementById(submenuId);
      const parent = document.querySelector(`[data-toggle="${submenuId}"]`);
      if (submenu) submenu.classList.add("open");
      if (parent) parent.classList.add("open", "active");
    };

    const switchToTab = (tabName) => {
      const raw = tabName || "home";
      const resolved = resolveTab(raw);

      document.querySelectorAll(".tab-panel").forEach((tab) => tab.classList.remove("active"));
      document.querySelectorAll(".menu-item:not(.menu-item-parent)").forEach((mi) => mi.classList.remove("active"));

      const selectedTab = document.getElementById(`tab-${resolved}`);
      if (selectedTab) {
        selectedTab.classList.add("active");
        document.querySelector(".main-layout")?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        console.warn("[Equvinoxis] Tab not found:", resolved);
        showToast(`Section "${raw}" is loading…`, "default");
      }

      document.querySelectorAll(".menu-item:not(.menu-item-parent)").forEach((mi) => {
        const miTab = mi.getAttribute("data-tab");
        const miHref = (mi.getAttribute("href") || "").replace(/^#/, "");
        if (miTab === resolved || miHref === raw || miHref === resolved) {
          mi.classList.add("active");
        }
      });

      openSubmenuForTab(resolved);

      const titleLabel = TAB_TITLES[resolved] || TAB_TITLES[raw] || resolved;
      document.title = `${titleLabel} | Stonekrest`;

      if (typeof lucide !== "undefined") lucide.createIcons();
    };

    const closeMobileSidebar = () => {
      document.querySelector('.sidebar')?.classList.remove('open');
      document.getElementById('sidebar-backdrop')?.classList.remove('active');
      document.documentElement.classList.remove('nav-open');
      const menuBtn = document.getElementById('btn-mobile-menu');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    };

    const openMobileSidebar = () => {
      document.querySelector('.sidebar')?.classList.add('open');
      document.getElementById('sidebar-backdrop')?.classList.add('active');
      document.documentElement.classList.add('nav-open');
      const menuBtn = document.getElementById('btn-mobile-menu');
      if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    };

    document.getElementById('btn-mobile-menu')?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = document.querySelector('.sidebar')?.classList.contains('open');
      if (isOpen) closeMobileSidebar();
      else openMobileSidebar();
    });

    document.getElementById('sidebar-backdrop')?.addEventListener('click', closeMobileSidebar);

    window.addEventListener('resize', () => {
      if (window.innerWidth > 992) closeMobileSidebar();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileSidebar();
    });

    const handleMenuNavigate = (menuItem, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const tabName = (menuItem.getAttribute("href") || "").replace(/^#/, "") || menuItem.getAttribute("data-tab");
      if (tabName) {
        window.location.hash = tabName;
        switchToTab(tabName);
        closeMobileSidebar();
      }
    };

    const handleSidebarInteraction = (e) => {
      const sidebarEl = document.getElementById('main-sidebar');
      if (!sidebarEl) return;

      const parent = e.target.closest('.menu-item-parent');
      if (parent && sidebarEl.contains(parent)) {
        e.preventDefault();
        e.stopPropagation();
        const submenuId = parent.getAttribute('data-toggle');
        const submenu = document.getElementById(submenuId);
        const isOpen = submenu?.classList.contains('open');
        if (submenu) {
          if (isOpen) {
            submenu.classList.remove('open');
            parent.classList.remove('open');
          } else {
            document.querySelectorAll('.menu-item-submenu').forEach(s => s.classList.remove('open'));
            document.querySelectorAll('.menu-item-parent').forEach(p => p.classList.remove('open'));
            submenu.classList.add('open');
            parent.classList.add('open');
          }
        }
        return;
      }

      const link = e.target.closest('a.menu-item');
      if (link && sidebarEl.contains(link)) {
        handleMenuNavigate(link, e);
      }
    };

    const sidebarNav = document.getElementById('main-sidebar');
    sidebarNav?.addEventListener('click', handleSidebarInteraction);

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      if (link.classList.contains("menu-item") || link.classList.contains("app-brand")) return;
      link.addEventListener("click", (e) => {
        const hash = link.getAttribute("href").slice(1);
        if (!hash || !document.getElementById(`tab-${resolveTab(hash)}`)) return;
        e.preventDefault();
        window.location.hash = hash;
        switchToTab(hash);
        closeMobileSidebar();
      });
    });
    
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash.slice(1) || 'home';
      switchToTab(hash);
    });
    
    switchToTab(window.location.hash.slice(1) || 'home');
    
    const balanceToggleBtn = document.getElementById("btn-balance-toggle");
    const balanceEyeIcon = document.getElementById("balance-eye-icon");
    const balanceValues = document.querySelectorAll(".filter-balance");
    const moneyDrawerOverlay = document.getElementById("money-drawer-overlay");
    const btnMoveMoney = document.getElementById("btn-move-money");
    const btnCloseDrawer = document.getElementById("btn-close-drawer");
    const drawerOptions = document.querySelectorAll(".drawer-option");

    balanceToggleBtn?.addEventListener("click", () => {
      state.maskBalances = !state.maskBalances;
      if (state.maskBalances) {
        balanceEyeIcon.setAttribute("data-lucide", "eye-off");
        balanceValues.forEach(elem => {
          elem.classList.add("masked-val");
          elem.innerText = "••••••";
        });
        showToast("Financial balances hidden.");
      } else {
        balanceEyeIcon.setAttribute("data-lucide", "eye");
        updateBalanceUI();
        showToast("Financial balances visible.");
      }
      lucide.createIcons();
    });

    const openMoveMoneyDrawer = () => {
      moneyDrawerOverlay?.classList.add("active");
      const mainScreen = document.getElementById("drawer-screen-main");
      if (mainScreen) {
        document.querySelectorAll(".drawer-screen").forEach(s => s.classList.remove("active"));
        mainScreen.classList.add("active");
      }
    };

    btnMoveMoney?.addEventListener("click", openMoveMoneyDrawer);
    document.getElementById("btn-hero-transfer")?.addEventListener("click", openMoveMoneyDrawer);
    document.getElementById("btn-hero-statement")?.addEventListener("click", () => {
      showToast("Statement download started — check your email.");
    });

    document.querySelector(".app-brand")?.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.hash = "home";
      switchToTab("home");
      closeMobileSidebar();
    });

    const closeDrawer = () => moneyDrawerOverlay?.classList.remove("active");

    btnCloseDrawer?.addEventListener("click", closeDrawer);
    document.querySelectorAll(".close-drawer-btn").forEach(btn => btn.addEventListener("click", closeDrawer));

    moneyDrawerOverlay?.addEventListener("click", (e) => {
      if (e.target === moneyDrawerOverlay) closeDrawer();
    });

    const switchDrawerScreen = (screenId) => {
      if (!screenId) return;
      document.querySelectorAll(".drawer-screen").forEach(screen => screen.classList.remove("active"));
      document.getElementById(screenId)?.classList.add("active");
      if (typeof lucide !== "undefined") lucide.createIcons();
    };

    document.querySelectorAll(".drawer-option[data-screen]").forEach(option => {
      option.addEventListener("click", () => switchDrawerScreen(option.getAttribute("data-screen")));
    });

    document.querySelectorAll(".drawer-back-btn[data-screen]").forEach(btn => {
      btn.addEventListener("click", () => switchDrawerScreen(btn.getAttribute("data-screen")));
    });

    drawerOptions.forEach(option => {
      if (!option.getAttribute("data-route")) return;
      option.addEventListener("click", () => {
        const route = option.getAttribute("data-route");
        const method = option.getAttribute("data-method");
        closeDrawer();
        closeMobileSidebar();
        if (route) {
          window.location.hash = route;
          switchToTab(route);
          if (method) showPaymentForm(method);
        }
      });
    });

    document.getElementById("btn-export-csv")?.addEventListener("click", () => {
      showToast("Transaction export started — CSV will download shortly.", "green");
    });

    document.getElementById("btn-issue-card")?.addEventListener("click", () => {
      showToast("Virtual card issued successfully.", "green");
    });

    document.getElementById("btn-copy-card")?.addEventListener("click", () => {
      showToast("Card number copied to clipboard.", "green");
    });

    document.getElementById("btn-freeze-card")?.addEventListener("click", () => {
      showToast("Card frozen for security.", "default");
    });
    
    // Payment method selection
    document.querySelectorAll(".btn-select-payment").forEach(btn => {
      btn.addEventListener("click", () => {
        const method = btn.getAttribute("data-method");
        showPaymentForm(method);
      });
    });

    // Close payment form
    const btnClosePaymentForm = document.getElementById("btn-close-payment-form");
    btnClosePaymentForm?.addEventListener("click", () => {
      const paymentForm = document.getElementById("payment-form-card");
      if (paymentForm) paymentForm.classList.add("hidden");
    });

    // Run static renderers
    updateBalanceUI();
    renderTransactions();
    renderCards();
    renderAccounts();
    initChart();
    
    // Bind features static elements
    bindIndiaBanking();

    initializeEquvinoxisPayments();

    lucide.createIcons();
  }

  // ==========================================
  // SHARED FEATURES ACTIONS
  // ==========================================

  // --- TOAST NOTIFICATIONS ---
  function showToast(message, type = "default") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast`;
    if (type === "purple") toast.classList.add("toast-purple");
    if (type === "green") toast.classList.add("toast-green");
    
    let iconStr = "info";
    if (type === "green") iconStr = "check-circle-2";
    if (type === "purple") iconStr = "zap";
    
    toast.innerHTML = `
      <i data-lucide="${iconStr}"></i>
      <span>${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons();
    
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(50px)";
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
  // --- BALANCE SYNCS ---
  function updateBalanceUI() {
    if (state.maskBalances) return;

    document.querySelectorAll(".metric-value.filter-balance").forEach(elem => {
      const amount = parseFloat(elem.getAttribute("data-amount"));
      if (!isNaN(amount)) elem.innerText = formatCurrency(amount);
    });

    const gatewayVal = document.getElementById("gateway-collections-val");
    if (gatewayVal) gatewayVal.innerText = formatCurrency(state.balances.gatewayCollections);

    const usdVal = document.getElementById("fx-usd-val");
    if (usdVal) usdVal.innerText = formatCurrency(state.balances.usdReceivable, 'USD');

    const eurVal = document.getElementById("fx-eur-val");
    if (eurVal) eurVal.innerText = formatCurrency(state.balances.eurReceivable, 'EUR');
  }

  function formatCurrency(num, currency = 'INR') {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
    }
    if (currency === 'EUR') {
      return new Intl.NumberFormat('en-EU', { style: 'currency', currency: 'EUR' }).format(num);
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num);
  }

  // --- WORKING CAPITAL ---
  function bindCapitalCalculator() {
    const sliderCapital = document.getElementById("slider-capital-amount");
    const sliderRepay = document.getElementById("slider-repay-rate");
    if (!sliderCapital || !sliderRepay) return;

    const updateCalc = () => {
      const principal = parseInt(sliderCapital.value);
      const repayRate = parseInt(sliderRepay.value);

      let feeRate = 0.08;
      if (repayRate <= 7) feeRate = 0.10;
      else if (repayRate >= 18) feeRate = 0.06;

      const fee = principal * feeRate;
      const total = principal + fee;
      const dailyPayback = 8000 * (repayRate / 100);
      const estDays = Math.ceil(total / dailyPayback);

      document.getElementById("calc-amount-label").innerText = formatCurrency(principal);
      document.getElementById("calc-repay-label").innerText = `${repayRate}%`;

      document.getElementById("summary-principal").innerText = formatCurrency(principal);
      document.getElementById("summary-fee").innerText = `${formatCurrency(fee)} (${(feeRate * 100).toFixed(0)}%)`;
      document.getElementById("summary-total").innerText = formatCurrency(total);
      document.getElementById("summary-timeline").innerText = `~${estDays} days (at typical $8,000 daily sales)`;
    };

    sliderCapital.addEventListener("input", updateCalc);
    sliderRepay.addEventListener("input", updateCalc);
    updateCalc();

    document.getElementById("btn-request-capital")?.addEventListener("click", () => {
      if (state.activeAdvance) {
        showToast("You already have an active advance. Clear your current obligation first.", "default");
        return;
      }

      const principal = parseInt(sliderCapital.value);
      const repayRate = parseInt(sliderRepay.value);
      let feeRate = 0.08;
      if (repayRate <= 7) feeRate = 0.10;
      else if (repayRate >= 18) feeRate = 0.06;

      const fee = principal * feeRate;
      const total = principal + fee;

      state.activeAdvance = {
        principal: principal,
        repayRate: repayRate,
        fee: fee,
        totalObligation: total,
        repaid: 0
      };

      state.balances.checking += principal;
      state.transactions.unshift({
        id: "tx_" + Date.now(),
        date: "Today",
        type: "fiat",
        desc: "Slash Working Capital Disbursal",
        asset: "USD",
        status: "Completed",
        amount: principal
      });

      showToast(`Success! Disbursed ${formatCurrency(principal)} to your dollar accounts.`, "purple");

      updateBalanceUI();
      renderActiveAdvance();
      renderTransactions();
      renderAccounts();
    });
  }

  function renderActiveAdvance() {
    const box = document.getElementById("active-advance-box");
    if (!box) return;

    if (!state.activeAdvance) {
      box.innerHTML = `
        <i data-lucide="info" class="empty-state-icon"></i>
        <span class="font-medium text-white block margin-bottom-8">No Active Capital Line</span>
        <p class="subtitle" style="max-width: 300px; font-size: 13px;">Equvinoxis Inc. is eligible for up to $250,000. Use the calculator to request funding.</p>
      `;
    } else {
      const adv = state.activeAdvance;
      const pct = (adv.repaid / adv.totalObligation) * 100;

      box.innerHTML = `
        <div class="active-advance-card">
          <div class="active-advance-stat">
            <span class="label">Total Obligation</span>
            <span class="val text-purple">${formatCurrency(adv.totalObligation)}</span>
          </div>
          <div class="active-advance-stat">
            <span class="label">Amount Paid Back</span>
            <span class="val">${formatCurrency(adv.repaid)}</span>
          </div>
          <div class="card-quick-stats">
            <div class="card-stat-row">
              <span class="text-secondary">Progress Repaid</span>
              <span class="font-medium text-white">${pct.toFixed(1)}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar purple" style="width: ${pct}%;"></div>
            </div>
            <div class="card-stat-row">
              <span class="text-secondary">Deduction Share</span>
              <span class="font-medium text-white">${adv.repayRate}% of Credit Sales</span>
            </div>
          </div>
          <div class="flex gap-2" style="margin-top: 10px;">
            <button class="btn btn-secondary btn-sm flex-grow" id="btn-repay-chunk">Deduct $2,500 Payback</button>
            <button class="btn btn-purple btn-sm" id="btn-repay-full">Repay Full</button>
          </div>
        </div>
      `;

      document.getElementById("btn-repay-chunk")?.addEventListener("click", () => {
        const amount = Math.min(2500, adv.totalObligation - adv.repaid);
        if (state.balances.checking < amount) {
          showToast("Deduction failed: insufficient checking funds.", "default");
          return;
        }

        state.balances.checking -= amount;
        adv.repaid += amount;

        state.transactions.unshift({
          id: "tx_" + Date.now(),
          date: "Today",
          type: "fiat",
          desc: "Slash Capital: Revenue Payback Share",
          asset: "USD",
          status: "Completed",
          amount: -amount
        });

        if (adv.repaid >= adv.totalObligation) {
          state.activeAdvance = null;
          showToast("Congratulations! Fully repaid Working Capital advance.", "green");
        } else {
          showToast(`Paid back ${formatCurrency(amount)} from card revenue share.`, "purple");
        }

        updateBalanceUI();
        renderActiveAdvance();
        renderTransactions();
        renderAccounts();
      });

      document.getElementById("btn-repay-full")?.addEventListener("click", () => {
        const remaining = adv.totalObligation - adv.repaid;
        if (state.balances.checking < remaining) {
          showToast("Insufficient checking funds.", "default");
          return;
        }

        state.balances.checking -= remaining;
        state.transactions.unshift({
          id: "tx_" + Date.now(),
          date: "Today",
          type: "fiat",
          desc: "Slash Capital: Settlement Repayment",
          asset: "USD",
          status: "Completed",
          amount: -remaining
        });

        state.activeAdvance = null;
        showToast("Settled active advance balance in full.", "green");

        updateBalanceUI();
        renderActiveAdvance();
        renderTransactions();
        renderAccounts();
      });
    }

    lucide.createIcons();
  }

  // --- STABLECOINS ---
  function bindIndiaBanking() {
    renderGatewaySettlements();

    document.getElementById("btn-refresh-gateway-txn")?.addEventListener("click", renderGatewaySettlements);

    document.addEventListener("click", (e) => {
      const copyBtn = e.target.closest(".api-key-copy");
      if (!copyBtn) return;
      const targetId = copyBtn.getAttribute("data-copy-target");
      const el = targetId ? document.getElementById(targetId) : null;
      const text = el?.textContent?.trim();
      if (!text || text === "—") return;
      navigator.clipboard?.writeText(text).then(() => {
        showToast("Copied to clipboard", "green");
      }).catch(() => {});
    });

    document.querySelectorAll(".sk-segmented").forEach(group => {
      group.querySelectorAll(".sk-segment").forEach(btn => {
        btn.addEventListener("click", () => {
          group.querySelectorAll(".sk-segment").forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
        });
      });
    });

    document.getElementById("btn-copy-upi")?.addEventListener("click", () => {
      showToast("UPI ID copied: equvinoxis@icici", "green");
    });

    document.getElementById("btn-sim-upi-collection")?.addEventListener("click", () => {
      const amt = 5000;
      state.balances.gatewayCollections += amt;
      state.balances.checking += amt;
      state.transactions.unshift({
        id: "tx_" + Date.now(), date: "Today", type: "upi",
        desc: "UPI collection — equvinoxis@icici", asset: "INR", status: "Completed", amount: amt
      });
      state.gatewaySettlements.unshift({ date: "Today", gateway: "UPI", ref: "UPI-" + Date.now(), status: "Settled", amount: amt });
      showToast(`UPI collection of ${formatCurrency(amt)} credited`, "green");
      updateBalanceUI();
      renderTransactions();
      renderGatewaySettlements();
    });

    document.getElementById("btn-sim-swift-inward")?.addEventListener("click", () => {
      const usd = 5000;
      state.balances.usdReceivable += usd;
      state.transactions.unshift({
        id: "tx_" + Date.now(), date: "Today", type: "swift",
        desc: "SWIFT inward remittance — US client", asset: "USD", status: "Completed", amount: usd
      });
      showToast(`SWIFT inward $${usd.toLocaleString()} received`, "green");
      updateBalanceUI();
      renderTransactions();
    });

    document.getElementById("fx-convert-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const cur = document.getElementById("fx-from-currency")?.value || "USD";
      const amt = parseFloat(document.getElementById("fx-amount")?.value) || 0;
      const rate = state.fxRates[cur] || 83.52;
      const inr = amt * rate * 0.9965;
      if (cur === "USD") state.balances.usdReceivable = Math.max(0, state.balances.usdReceivable - amt);
      if (cur === "EUR") state.balances.eurReceivable = Math.max(0, state.balances.eurReceivable - amt);
      state.balances.checking += inr;
      state.transactions.unshift({
        id: "tx_" + Date.now(), date: "Today", type: "fiat",
        desc: `FX conversion ${cur} → INR`, asset: "INR", status: "Completed", amount: inr
      });
      showToast(`Converted to ${formatCurrency(inr)} in current account`, "green");
      updateBalanceUI();
      renderTransactions();
      renderAccounts();
    });

    const fxAmount = document.getElementById("fx-amount");
    const fxCurrency = document.getElementById("fx-from-currency");
    const updateFxEstimate = () => {
      const cur = fxCurrency?.value || "USD";
      const amt = parseFloat(fxAmount?.value) || 0;
      const rate = state.fxRates[cur] || 83.52;
      const est = amt * rate * 0.9965;
      const rateEl = document.getElementById("fx-live-rate");
      const estEl = document.getElementById("fx-inr-estimate");
      if (rateEl) rateEl.textContent = `1 ${cur} = ₹${rate.toFixed(2)}`;
      if (estEl) estEl.textContent = formatCurrency(est);
    };
    fxAmount?.addEventListener("input", updateFxEstimate);
    fxCurrency?.addEventListener("change", updateFxEstimate);
    updateFxEstimate();

    document.querySelectorAll(".btn-copy-inline").forEach(btn => {
      btn.addEventListener("click", () => {
        showToast(`Copied: ${btn.getAttribute("data-copy")}`, "green");
      });
    });

    document.getElementById("btn-bulk-payout")?.addEventListener("click", () => showToast("Upload CSV for bulk NEFT/IMPS payroll", "default"));
    document.getElementById("btn-create-payment-link")?.addEventListener("click", () => showToast("Payment link created — share via WhatsApp or email", "green"));
    document.getElementById("btn-download-firc-pack")?.addEventListener("click", () => showToast("FIRC pack downloading…", "green"));
    document.getElementById("btn-razorpay-dashboard")?.addEventListener("click", () => {
      window.location.hash = "mercury-payments";
      document.querySelector('.menu-item[data-tab="mercury-payments"]')?.click();
    });
    document.getElementById("btn-paytm-link")?.addEventListener("click", () => showToast("Paytm payment link generated", "green"));
    document.getElementById("btn-connect-phonepe")?.addEventListener("click", () => showToast("PhonePe onboarding started", "purple"));
  }

  function renderGatewaySettlements() {
    const tbody = document.getElementById("gateway-settlements-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    state.gatewaySettlements.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date}</td><td>${row.gateway}</td><td class="font-mono">${row.ref}</td>
        <td><span class="badge badge-green">${row.status}</span></td>
        <td class="text-right font-semibold text-green">+${formatCurrency(row.amount)}</td>
      `;
      tbody.appendChild(tr);
    });
    renderMercuryPaymentsTxnTable();
  }

  function renderMercuryPaymentsTxnTable() {
    const tbody = document.getElementById("mercury-payments-txn-tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    state.gatewaySettlements.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.gateway}</td>
        <td class="font-mono">${row.ref}</td>
        <td><span class="badge badge-green">${row.status}</span></td>
        <td class="text-right font-semibold text-green">+${formatCurrency(row.amount)}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // --- STANDALONE PAYMENT FORMS ---
  function showPaymentForm(method) {
    const paymentFormWrapper = document.getElementById("payment-form-card");
    const paymentForm = document.getElementById("active-payment-form");
    if (!paymentFormWrapper || !paymentForm) return;

    paymentFormWrapper.classList.remove("hidden");
    paymentForm.innerHTML = "";
    
    let title = "";
    let formHTML = "";

    if (method === "upi") {
      title = "UPI Payout";
      formHTML = `
        <div class="form-row-2">
          <div class="form-group"><label>Beneficiary UPI ID</label><input type="text" id="pay-recipient" placeholder="name@bank or mobile@upi" required class="font-mono" /></div>
          <div class="form-group"><label>From account</label><select id="pay-source" required><option value="checking">Current Account (${formatCurrency(state.balances.checking)})</option></select></div>
        </div>
        <div class="form-group"><label>Amount (INR)</label><div class="input-prefix-wrapper"><span class="input-prefix">₹</span><input type="number" id="pay-amount" placeholder="0" min="1" step="1" required /></div></div>
        <div class="form-group"><label>Remarks</label><input type="text" id="pay-remarks" placeholder="Invoice #, salary, etc." /></div>
        <button type="submit" class="btn btn-primary btn-block">Send UPI Payment</button>
      `;
    } else if (method === "neft") {
      title = "NEFT / RTGS / IMPS Transfer";
      formHTML = `
        <div class="form-row-2">
          <div class="form-group"><label>Beneficiary name</label><input type="text" id="pay-recipient" placeholder="Registered account name" required /></div>
          <div class="form-group"><label>Transfer mode</label><select id="pay-mode"><option value="IMPS">IMPS (instant)</option><option value="NEFT">NEFT</option><option value="RTGS">RTGS (₹2L+)</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>IFSC code</label><input type="text" id="pay-routing" placeholder="e.g. HDFC0001234" pattern="[A-Z]{4}0[A-Z0-9]{6}" required class="font-mono" /></div>
          <div class="form-group"><label>Account number</label><input type="text" id="pay-account" placeholder="Beneficiary account" required /></div>
        </div>
        <div class="form-group"><label>Amount (INR)</label><div class="input-prefix-wrapper"><span class="input-prefix">₹</span><input type="number" id="pay-amount" placeholder="0" min="1" step="1" required /></div></div>
        <button type="submit" class="btn btn-primary btn-block">Submit Bank Transfer</button>
      `;
    } else if (method === "paytm") {
      title = "Paytm for Business Payout";
      formHTML = `
        <div class="form-group"><label>Paytm registered mobile / merchant ID</label><input type="text" id="pay-recipient" placeholder="+91 or merchant ID" required /></div>
        <div class="form-group"><label>Amount (INR)</label><div class="input-prefix-wrapper"><span class="input-prefix">₹</span><input type="number" id="pay-amount" placeholder="0" min="1" required /></div></div>
        <button type="submit" class="btn btn-primary btn-block">Send Paytm Payout</button>
      `;
    } else if (method === "ach") {
      title = "New ACH Outward Payment";
      formHTML = `
        <div class="form-row-2">
          <div class="form-group"><label>Recipient Name</label><input type="text" id="pay-recipient" placeholder="e.g. Stripe Inc." required /></div>
          <div class="form-group"><label>Deducting Account</label><select id="pay-source" required><option value="checking">Operating Checking ($${state.balances.checking.toLocaleString()})</option></select></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>ABA Routing Number</label><input type="text" id="pay-routing" placeholder="9 digits" pattern="[0-9]{9}" required /></div>
          <div class="form-group"><label>Account Number</label><input type="text" id="pay-account" placeholder="Enter bank account number" required /></div>
        </div>
        <div class="form-group"><label>Transfer Amount (USD)</label><div class="input-prefix-wrapper"><span class="input-prefix">$</span><input type="number" id="pay-amount" placeholder="0.00" min="1" step="any" required /></div></div>
        <button type="submit" class="btn btn-primary btn-block">Confirm Outward ACH</button>
      `;
    } else if (method === "wire") {
      title = "New Express Wire Transfer";
      formHTML = `
        <div class="form-group"><label>Recipient Legal Name</label><input type="text" id="pay-recipient" placeholder="e.g. Equvinoxis Legal LLP" required /></div>
        <div class="form-row-2">
          <div class="form-group"><label>Deducting Account</label><select id="pay-source" required><option value="checking">Operating Checking ($${state.balances.checking.toLocaleString()})</option></select></div>
          <div class="form-group"><label>Wire Routing Number / SWIFT</label><input type="text" id="pay-routing" placeholder="Domestic Routing or SWIFT" required /></div>
        </div>
        <div class="form-row-2">
          <div class="form-group"><label>Recipient Bank Account Number</label><input type="text" id="pay-account" placeholder="Account Number" required /></div>
          <div class="form-group"><label>Recipient Bank Name</label><input type="text" placeholder=" chase, silicon valley bank" required /></div>
        </div>
        <div class="form-group"><label>Transfer Amount (USD)</label><div class="input-prefix-wrapper"><span class="input-prefix">$</span><input type="number" id="pay-amount" placeholder="0.00" min="5" step="any" required /></div></div>
        <button type="submit" class="btn btn-primary btn-block">Dispatch Wire</button>
      `;
    }

    document.getElementById("payment-form-title").innerText = title;
    paymentForm.innerHTML = formHTML;

    paymentForm.onsubmit = (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById("pay-amount").value);
      const recipient = document.getElementById("pay-recipient").value;
      
      if (state.balances.checking < amount) {
        showToast("Insufficient balance in source checking account.", "default");
        return;
      }

      const mode = document.getElementById("pay-mode")?.value || method.toUpperCase();
      const label = method === "neft" ? mode : method.toUpperCase();
      
      state.balances.checking -= amount;
      state.transactions.unshift({
        id: "tx_" + Date.now(),
        date: "Today",
        type: method === "upi" ? "upi" : method === "neft" ? "imps" : "fiat",
        desc: `${label} to ${recipient}`,
        asset: "INR",
        status: method === "upi" || method === "paytm" ? "Completed" : "Pending",
        amount: -amount
      });
      
      showToast(`${label} of ${formatCurrency(amount)} sent successfully!`, "green");
      paymentFormWrapper.classList.add("hidden");
      
      updateBalanceUI();
      renderTransactions();
      renderAccounts();
    };
  }

  // --- STATS VIEW POPULATORS ---
  function renderTransactions() {
    const home = document.getElementById("home-transactions-tbody");
    const all = document.getElementById("all-transactions-tbody");
    if (!home && !all) return;

    const data = [...state.transactions];
    if (home) {
      home.innerHTML = "";
      data.slice(0, 5).forEach(tx => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${tx.date}</td><td>${tx.desc}</td><td><span class="badge ${tx.type === 'upi' ? 'badge-green-glow' : tx.type === 'swift' ? 'badge-purple-flat' : 'badge-secondary'}">${tx.type}</span></td>
          <td><div class="status-dot-wrapper"><span class="status-dot ${tx.status === 'Completed' ? 'status-completed' : 'status-pending'}"></span><span>${tx.status}</span></div></td>
          <td class="text-right font-semibold ${tx.amount > 0 ? 'text-green' : ''}">${tx.amount > 0 ? '+' : ''}${formatCurrency(tx.amount)}</td>
        `;
        home.appendChild(tr);
      });
    }

    if (all) {
      all.innerHTML = "";
      data.forEach(tx => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${tx.date}</td><td><span class="badge ${tx.type === 'upi' ? 'badge-green-glow' : tx.type === 'swift' ? 'badge-purple-flat' : 'badge-secondary'}">${tx.type}</span></td>
          <td class="font-medium">${tx.desc}</td><td class="font-mono">${tx.asset}</td>
          <td><div class="status-dot-wrapper"><span class="status-dot ${tx.status === 'Completed' ? 'status-completed' : 'status-pending'}"></span><span>${tx.status}</span></div></td>
          <td class="text-right font-semibold ${tx.amount > 0 ? 'text-green' : ''}">${tx.amount > 0 ? '+' : ''}${formatCurrency(tx.amount)}</td>
        `;
        all.appendChild(tr);
      });
    }
  }

  function renderCards() {
    const c = document.getElementById("cards-list-container");
    if (!c) return;
    c.innerHTML = "";
    state.cards.forEach(card => {
      const el = document.createElement("div");
      el.className = "issuer-card-item";
      const pct = (card.spend / card.limit) * 100;
      el.innerHTML = `
        <div class="issuer-card-top"><div class="font-medium text-white">${card.label}</div><span class="issuer-status-badge ${card.frozen ? 'frozen' : ''}">${card.frozen ? 'Frozen' : 'Active'}</span></div>
        <div class="issuer-card-middle"><div class="issuer-card-number">•••• •••• •••• ${card.last4}</div><div class="account-number-string">Holder: ${card.holder}</div></div>
        <div class="issuer-card-bottom"><div class="card-quick-stats" style="width: 100%;">
          <div class="card-stat-row"><span class="text-secondary">Spend Limit</span><span>${formatCurrency(card.spend)} / ${formatCurrency(card.limit)}</span></div>
          <div class="progress-bar-container"><div class="progress-bar" style="width: ${pct}%;"></div></div>
          <div class="card-quick-actions"><button class="btn btn-secondary btn-sm" onclick="alert('Card Details Copied!')">Copy Details</button></div>
        </div></div>
      `;
      c.appendChild(el);
    });
  }

  function renderAccounts() {
    const c = document.getElementById("accounts-list-container");
    if (!c) return;
    c.innerHTML = "";
    const items = [
      { name: "Equvinoxis Current Account", type: "INR · ICICI Bank", balance: state.balances.checking },
      { name: "Smart Savings Account", type: "INR · 7.1% p.a.", balance: state.balances.savings },
      { name: "Gateway Collections (unsettled)", type: "Razorpay · Paytm · UPI", balance: state.balances.gatewayCollections }
    ];
    items.forEach(i => {
      const el = document.createElement("div");
      el.className = "account-row-card";
      el.innerHTML = `
        <div class="account-meta-row"><div><div class="account-label">${i.name}</div><div class="account-number-string">${i.type}</div></div></div>
        <div class="account-bal">${formatCurrency(i.balance)}</div>
      `;
      c.appendChild(el);
    });
  }

  // --- CHART (Chart.js) ---
  function initChart() {
    const c = document.getElementById("cashFlowChart");
    if (!c) return;
    const ctx = c.getContext("2d");
    const isDarkHome = c.closest(".sk-home");
    const gridColor = isDarkHome ? "rgba(255,255,255,0.06)" : "#E7E5E0";
    const tickColor = isDarkHome ? "#A0A0A0" : "#A8A29E";
    const inflowColor = isDarkHome ? "#00D166" : "#00D166";
    const inflowFill = isDarkHome ? "rgba(0, 209, 102, 0.12)" : "rgba(0, 209, 102, 0.08)";
    const outflowColor = isDarkHome ? "rgba(160, 160, 160, 0.6)" : "#FF9933";
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["May 20", "May 24", "May 28", "Jun 01", "Jun 05", "Jun 09"],
        datasets: [
          { label: "Inflows", data: [180000, 240000, 150000, 480000, 320000, 560000], borderColor: inflowColor, backgroundColor: inflowFill, borderWidth: 2, fill: true, tension: 0.3 },
          { label: "Outflows", data: [90000, 180000, 80000, 240000, 140000, 190000], borderColor: outflowColor, borderWidth: 1.5, fill: false, tension: 0.3 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: tickColor, boxWidth: 12, padding: 16 } } },
        scales: {
          x: { ticks: { color: tickColor }, grid: { color: gridColor } },
          y: { ticks: { color: tickColor }, grid: { color: gridColor } }
        }
      }
    });
  }
};

// Equvinoxis Payments onboarding (Razorpay integration flow)
function initializeEquvinoxisPayments() {
  let paymentsStep = 1;
  let paymentSuccess = false;

  function generateRandomKey(length, prefix = '') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = prefix;
    for (let i = 0; i < length; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  }

  function updateTestKeysModal() {
    const keyId = generateRandomKey(14, 'rzp_test_');
    const keySecret = generateRandomKey(16);
    const now = new Date();
    const dateStr = now.toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });

    const keyIdEl = document.getElementById('test-key-id');
    const keySecretEl = document.getElementById('test-key-secret');
    if (keyIdEl) keyIdEl.textContent = keyId;
    if (keySecretEl) keySecretEl.textContent = keySecret;

    const dateEl = document.getElementById('test-key-generated-date');
    if (dateEl) dateEl.textContent = `Generated on ${dateStr}`;

    const keyIdInput = document.getElementById('razorpay-key-id');
    const keySecretInput = document.getElementById('razorpay-key-secret');
    if (keyIdInput) keyIdInput.value = keyId;
    if (keySecretInput) keySecretInput.value = keySecret;

    const inlineKeyId = document.getElementById('inline-key-id');
    const inlineKeySecret = document.getElementById('inline-key-secret');
    if (inlineKeyId) inlineKeyId.textContent = keyId;
    if (inlineKeySecret) inlineKeySecret.textContent = keySecret;

    document.getElementById('api-key-preview')?.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function goToPaymentsStep(step) {
    paymentsStep = step;
    document.querySelectorAll('.mercury-payments-step').forEach((el, idx) => {
      el.classList.toggle('active', idx + 1 === step);
    });
    document.querySelectorAll('.mercury-payments-step-content').forEach(el => el.classList.add('hidden'));
    const activeContent = document.getElementById(`mercury-payments-step-${step}`);
    if (activeContent) activeContent.classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function openTestKeysModal() {
    updateTestKeysModal();
    const modal = document.getElementById('test-keys-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
    }
  }

  function closeTestKeysModal() {
    const modal = document.getElementById('test-keys-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function openCheckoutModal() {
    const modal = document.getElementById('razorpay-checkout-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.style.display = 'flex';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('razorpay-checkout-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.display = 'none';
    }
  }

  function setupCheckoutTabs() {
    document.querySelectorAll('.razorpay-method-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.razorpay-method-tab').forEach(t => {
          t.classList.remove('active');
          t.style.color = '#9ca3af';
          t.style.borderBottom = 'none';
        });
        tab.classList.add('active');
        tab.style.color = '#0f9d58';
        tab.style.borderBottom = '2px solid #0f9d58';
        document.querySelectorAll('.razorpay-method-content').forEach(el => {
          el.classList.add('hidden');
          el.classList.remove('active');
        });
        const methodContent = document.getElementById(`method-${tab.getAttribute('data-method')}`);
        if (methodContent) {
          methodContent.classList.remove('hidden');
          methodContent.classList.add('active');
        }
      });
    });
  }

  function simulatePayment() {
    closeCheckoutModal();
    paymentSuccess = true;
    const finishBtn = document.getElementById('mercury-payments-btn-3');
    if (finishBtn) {
      finishBtn.disabled = false;
      finishBtn.style.opacity = '1';
    }
  }

  function showPaymentsDashboard() {
    document.getElementById('mercury-payments-onboarding-container')?.classList.add('hidden');
    document.getElementById('mercury-payments-dashboard')?.classList.remove('hidden');
  }

  document.getElementById('btn-mercury-generate-api-key')?.addEventListener('click', openTestKeysModal);
  document.getElementById('close-test-keys-modal')?.addEventListener('click', closeTestKeysModal);
  document.getElementById('btn-regenerate-key')?.addEventListener('click', updateTestKeysModal);
  document.getElementById('mercury-payments-btn-1')?.addEventListener('click', () => goToPaymentsStep(2));
  document.getElementById('mercury-payments-btn-2')?.addEventListener('click', () => goToPaymentsStep(3));
  document.getElementById('mercury-payments-back-2')?.addEventListener('click', () => goToPaymentsStep(1));
  document.getElementById('mercury-payments-back-3')?.addEventListener('click', () => goToPaymentsStep(2));
  document.getElementById('btn-test-razorpay-checkout')?.addEventListener('click', openCheckoutModal);
  document.getElementById('close-razorpay-modal')?.addEventListener('click', closeCheckoutModal);
  document.getElementById('pay-upi')?.addEventListener('click', simulatePayment);
  document.getElementById('pay-card')?.addEventListener('click', simulatePayment);
  document.getElementById('pay-netbanking')?.addEventListener('click', simulatePayment);
  document.getElementById('mercury-payments-btn-3')?.addEventListener('click', showPaymentsDashboard);
  document.getElementById('btn-disconnect-razorpay')?.addEventListener('click', () => {
    document.getElementById('mercury-payments-dashboard')?.classList.add('hidden');
    document.getElementById('mercury-payments-onboarding-container')?.classList.remove('hidden');
    goToPaymentsStep(1);
    paymentSuccess = false;
    const finishBtn = document.getElementById('mercury-payments-btn-3');
    if (finishBtn) {
      finishBtn.disabled = true;
      finishBtn.style.opacity = '0.5';
    }
  });
  document.getElementById('btn-back-to-payments')?.addEventListener('click', () => {
    document.getElementById('payments-table-view')?.classList.remove('hidden');
    document.getElementById('payment-detail-view')?.classList.add('hidden');
  });
  document.querySelector('.payment-row')?.addEventListener('click', () => {
    document.getElementById('payments-table-view')?.classList.add('hidden');
    document.getElementById('payment-detail-view')?.classList.remove('hidden');
  });

  setupCheckoutTabs();
}

// --- INITIALIZE APP ---
window.addEventListener('load', initApp);
// Also try immediate execution in case window.load already fired
if (document.body) {
  initApp();
}
