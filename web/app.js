const defaultTickets = [
  { code: "TS-1048", title: "Firewall bloquea VPN de contabilidad", company: "Grupo Cuscatlan", requester: "Ana Martinez", technician: "Carlos Mejia", status: "in_progress", priority: "urgent", sla: "4h", csat: 5 },
  { code: "TS-1049", title: "Equipo POS sin acceso a red", company: "Retail San Miguel", requester: "Mario Lopez", technician: "Karla Rivas", status: "assigned", priority: "high", sla: "8h", csat: null },
  { code: "TS-1050", title: "Solicitud de respaldo para servidor", company: "Clinica Escalon", requester: "Dra. Patricia Arias", technician: "Carlos Mejia", status: "waiting_client", priority: "medium", sla: "24h", csat: 4 },
  { code: "TS-1051", title: "Alta de usuario Microsoft 365", company: "Constructora Pacifico", requester: "Rene Campos", technician: "Luis Hernandez", status: "resolved", priority: "low", sla: "48h", csat: 5 }
];

const defaultOpportunities = [
  { title: "Monitoreo administrado 24/7", company: "Banco Local", stage: "proposal", owner: "Sofia Menendez", value: 18500, close: "2026-05-28" },
  { title: "Renovacion de red Wi-Fi corporativa", company: "Textiles Maya", stage: "negotiation", owner: "Diego Flores", value: 9200, close: "2026-06-04" },
  { title: "Mesa de ayuda mensual", company: "Agroexport SA", stage: "qualified", owner: "Sofia Menendez", value: 3600, close: "2026-05-22" },
  { title: "Camaras y control de acceso", company: "Hotel Costa Azul", stage: "won", owner: "Diego Flores", value: 12750, close: "2026-05-06" }
];

const defaultLeads = [
  { name: "Laura Chacon", company: "Distribuidora Norte", source: "WhatsApp", score: 92, owner: "Sofia Menendez" },
  { name: "Hector Pineda", company: "Colegio Bilingue", source: "Referido", score: 81, owner: "Diego Flores" },
  { name: "Monica Serpas", company: "Laboratorio Central", source: "Sitio web", score: 74, owner: "Sofia Menendez" }
];

const defaultActivities = [
  { subject: "Enviar cotizacion ajustada", owner: "Sofia Menendez", due: "Hoy 2:00 PM", related: "Banco Local" },
  { subject: "Revision de SLA mensual", owner: "Carlos Mejia", due: "Manana 9:30 AM", related: "Grupo Cuscatlan" },
  { subject: "Seguimiento de renovacion", owner: "Diego Flores", due: "Lun 10:00 AM", related: "Textiles Maya" }
];

const demoUsers = {
  "admin@techshieldsv.com": { password: "TechShield2026!", role: "Administrador", route: "dashboard" },
  "tecnico@techshieldsv.com": { password: "TechShield2026!", role: "Tecnico", route: "tickets" },
  "ventas@techshieldsv.com": { password: "TechShield2026!", role: "Vendedor", route: "crm" },
  "cliente@example.com": { password: "TechShield2026!", role: "Cliente", route: "portal" }
};

const config = window.TECHSHIELD_CONFIG || {};
const appCompanyId = config.DEFAULT_COMPANY_ID || "techshield";
const demoRoles = config.DEMO_ROLES || {};
const hasFirebaseConfig = Boolean(
  config.FIREBASE_CONFIG?.apiKey &&
    config.FIREBASE_CONFIG?.authDomain &&
    config.FIREBASE_CONFIG?.projectId &&
    window.firebase
);
const firebaseApp = hasFirebaseConfig ? firebase.initializeApp(config.FIREBASE_CONFIG) : null;
const firestore = firebaseApp ? firebase.firestore() : null;
const auth = firebaseApp ? firebase.auth() : null;

let tickets = readStore("tickets", defaultTickets);
let opportunities = readStore("opportunities", defaultOpportunities);
let leads = readStore("leads", defaultLeads);
let activities = readStore("activities", defaultActivities);

function readStore(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(`techshield-${key}`)) || [...fallback];
  } catch {
    return [...fallback];
  }
}

function saveStore() {
  localStorage.setItem("techshield-tickets", JSON.stringify(tickets));
  localStorage.setItem("techshield-opportunities", JSON.stringify(opportunities));
  localStorage.setItem("techshield-leads", JSON.stringify(leads));
  localStorage.setItem("techshield-activities", JSON.stringify(activities));
}

function nextTicketCode() {
  const max = tickets.reduce((value, item) => {
    const number = Number(String(item.code || "").replace(/\D/g, ""));
    return Number.isFinite(number) ? Math.max(value, number) : value;
  }, 1051);
  return `TS-${max + 1}`;
}

const money = {
  format(value) {
    try {
      return new Intl.NumberFormat("es-SV", { style: "currency", currency: "USD" }).format(value);
    } catch {
      return `$${Number(value).toFixed(2)}`;
    }
  }
};

async function loadFirebaseData() {
  if (!firestore || !auth?.currentUser) return;

  try {
    const [ticketSnap, opportunitySnap, leadSnap, activitySnap] = await Promise.all([
      firestore.collection("tickets").where("companyId", "==", appCompanyId).limit(40).get(),
      firestore.collection("opportunities").where("companyId", "==", appCompanyId).limit(40).get(),
      firestore.collection("leads").where("companyId", "==", appCompanyId).limit(40).get(),
      firestore.collection("activities").where("companyId", "==", appCompanyId).limit(40).get()
    ]);

    if (ticketSnap.empty && opportunitySnap.empty && leadSnap.empty && activitySnap.empty && currentUserRole() !== "client") {
      await seedFirebaseDemoData();
      return loadFirebaseData();
    }

    if (!ticketSnap.empty) tickets = sortByCreatedAt(ticketSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    if (!opportunitySnap.empty) opportunities = sortByCreatedAt(opportunitySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    if (!leadSnap.empty) leads = sortByCreatedAt(leadSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    if (!activitySnap.empty) activities = sortByCreatedAt(activitySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    saveStore();
  } catch (error) {
    console.warn("Firebase no pudo cargar datos; usando cache local.", error);
  }
}

function sortByCreatedAt(items) {
  return [...items].sort((a, b) => {
    const left = a.createdAt?.seconds || 0;
    const right = b.createdAt?.seconds || 0;
    return right - left;
  });
}

function currentUserRole() {
  try {
    return JSON.parse(localStorage.getItem("techshield-user"))?.role || "client";
  } catch {
    return "client";
  }
}

async function persist(collectionName, record) {
  if (firestore && auth?.currentUser) {
    try {
      await firestore.collection(collectionName).add({
        ...record,
        companyId: appCompanyId,
        createdBy: auth.currentUser.uid,
        createdByEmail: auth.currentUser.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    } catch (error) {
      console.warn("No se pudo guardar en Firebase; se conserva localmente.", error);
    }
  }
  saveStore();
}

async function ensureUserProfile(user) {
  if (!firestore || !user) return null;

  const email = user.email?.toLowerCase() || "";
  const role = demoRoles[email] || "client";
  const displayName = user.displayName || email.split("@")[0] || "Usuario";
  const profile = {
    email,
    role,
    fullName: displayName,
    companyId: appCompanyId,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  await firestore.collection("users").doc(user.uid).set(
    {
      ...profile,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );
  localStorage.setItem("techshield-user", JSON.stringify({ email, role }));
  return profile;
}

async function seedFirebaseDemoData() {
  if (!firestore || !auth?.currentUser) return;

  const stamp = firebase.firestore.FieldValue.serverTimestamp();
  const owner = auth.currentUser.uid;
  const ownerEmail = auth.currentUser.email;
  const withMeta = (item) => ({
    ...item,
    companyId: appCompanyId,
    createdBy: owner,
    createdByEmail: ownerEmail,
    createdAt: stamp
  });

  const batch = firestore.batch();
  defaultTickets.forEach((item) => batch.set(firestore.collection("tickets").doc(), withMeta(item)));
  defaultLeads.forEach((item) => batch.set(firestore.collection("leads").doc(), withMeta(item)));
  defaultOpportunities.forEach((item) => batch.set(firestore.collection("opportunities").doc(), withMeta(item)));
  defaultActivities.forEach((item) => batch.set(firestore.collection("activities").doc(), withMeta(item)));
  await batch.commit();
}

function badge(text, tone = "") {
  return `<span class="badge ${tone}">${text.replace("_", " ")}</span>`;
}

function priorityTone(priority) {
  if (priority === "urgent") return "red";
  if (priority === "high") return "amber";
  if (priority === "low") return "green";
  return "";
}

function metric(title, value, hint) {
  return `<article class="card pad"><p class="muted">${title}</p><div class="metric-value">${value}</div><small class="muted">${hint}</small></article>`;
}

const pages = {
  dashboard() {
    const open = tickets.filter((t) => !["resolved", "closed"].includes(t.status)).length;
    const sales = opportunities.filter((o) => o.stage === "won").reduce((sum, item) => sum + item.value, 0);
    return `
      <section class="page">
        <div class="hero">
          <div>
            <p class="eyebrow">TechShield Support CRM</p>
            <h1>Centro ejecutivo</h1>
            <p class="muted">Tickets, ventas, SLA y actividades comerciales en una sola operacion para clientes de El Salvador.</p>
          </div>
          <div><button class="button">Exportar reporte</button> <button class="button primary">Nuevo ticket</button></div>
        </div>
        <div class="grid metrics">
          ${metric("Tickets abiertos", open, "2 con prioridad alta o urgente")}
          ${metric("SLA promedio", "94%", "Cumplimiento de los ultimos 30 dias")}
          ${metric("Ventas del mes", money.format(sales), "Cotizaciones aprobadas")}
          ${metric("Satisfaccion", "4.7/5", "Encuestas cerradas")}
        </div>
        <div class="grid two-col">
          <article class="card">
            <div class="card-header"><h2>Tickets prioritarios</h2><p class="muted">Incidentes activos con seguimiento tecnico.</p></div>
            <div class="card-body list">
              ${tickets.slice(0, 3).map((t) => `<div class="item"><div class="item-line"><strong>${t.code}</strong>${badge(t.priority, priorityTone(t.priority))}</div><p>${t.title}</p><small class="muted">${t.company} - Tecnico: ${t.technician} - SLA ${t.sla}</small></div>`).join("")}
            </div>
          </article>
          <article class="card">
            <div class="card-header"><h2>Agenda inteligente</h2><p class="muted">Seguimientos por correo, WhatsApp y reuniones.</p></div>
            <div class="card-body list">
              ${activities.map((a) => `<div class="item"><strong>${a.subject}</strong><p class="muted">${a.related} - ${a.owner} - ${a.due}</p></div>`).join("")}
            </div>
          </article>
        </div>
      </section>`;
  },
  tickets() {
    return `
      <section class="page">
        <div class="toolbar"><div><h1>Sistema de tickets</h1><p class="muted">Creacion, asignacion, adjuntos, comentarios, SLA y cierre con encuesta.</p></div><button class="button primary">Crear ticket</button></div>
        <article class="card pad">
          <h2>Nuevo ticket</h2>
          <form class="form inline-form" id="ticketForm">
            <label class="field">Titulo<input name="title" required placeholder="Ej. Internet intermitente en sucursal" /></label>
            <label class="field">Empresa<input name="company" required placeholder="Cliente o empresa" /></label>
            <label class="field">Solicitante<input name="requester" required placeholder="Nombre del contacto" /></label>
            <label class="field">Prioridad<select name="priority"><option value="low">Baja</option><option value="medium" selected>Media</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></label>
            <button class="button primary" type="submit">Guardar</button>
            <p class="notice" hidden id="ticketNotice"></p>
          </form>
        </article>
        <article class="card">
          <div class="card-header"><h2>Cola de soporte</h2><p class="muted">Tickets activos organizados para el equipo tecnico.</p></div>
          <div class="card-body table-wrap">
            <table>
              <thead><tr><th>Ticket</th><th>Cliente</th><th>Tecnico</th><th>Estado</th><th>SLA</th><th>CSAT</th></tr></thead>
              <tbody>
                ${tickets.map((t) => `<tr><td><strong>${t.code}</strong><br><span class="muted">${t.title}</span></td><td>${t.company}</td><td>${t.technician}</td><td>${badge(t.status)}</td><td>${t.sla}</td><td>${t.csat || "Pendiente"}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>
        </article>
        <div class="grid three-col">
          ${["Adjuntos en Firebase Storage", "Historial de comentarios", "Notificaciones por correo y WhatsApp"].map((x) => `<article class="card pad"><h3>${x}</h3><p class="muted">Preparado para conectarse a backend cuando lo necesites.</p></article>`).join("")}
        </div>
      </section>`;
  },
  crm() {
    const stages = ["prospecting", "qualified", "proposal", "negotiation", "won"];
    return `
      <section class="page">
        <div class="toolbar"><div><h1>CRM comercial</h1><p class="muted">Leads, clientes, oportunidades, cotizaciones y actividades de seguimiento.</p></div><button class="button primary">Nueva oportunidad</button></div>
        <div class="grid metrics">
          ${metric("Leads activos", leads.length, "Priorizados por score comercial")}
          ${metric("Oportunidades", opportunities.length, "Pipeline actual")}
          ${metric("Pipeline total", money.format(opportunities.reduce((sum, item) => sum + item.value, 0)), "Valor estimado")}
          ${metric("Ganado este mes", money.format(opportunities.filter((o) => o.stage === "won").reduce((sum, item) => sum + item.value, 0)), "Cotizaciones aprobadas")}
        </div>
        <article class="card">
          <div class="card-header"><h2>Pipeline Kanban</h2><p class="muted">Vista comercial similar a HubSpot.</p></div>
          <div class="card-body kanban">
            ${stages.map((stage) => `<div class="column"><div class="item-line"><strong>${stage}</strong>${badge(opportunities.filter((o) => o.stage === stage).length)}</div><div class="list">${opportunities.filter((o) => o.stage === stage).map((o) => `<div class="item"><strong>${o.title}</strong><p class="muted">${o.company}</p><b>${money.format(o.value)}</b><p class="muted">${o.owner} - ${o.close}</p></div>`).join("")}</div></div>`).join("")}
          </div>
        </article>
        <article class="card pad">
          <h2>Nuevo lead</h2>
          <form class="form inline-form" id="leadForm">
            <label class="field">Nombre<input name="name" required placeholder="Nombre del contacto" /></label>
            <label class="field">Empresa<input name="company" required placeholder="Empresa" /></label>
            <label class="field">Fuente<select name="source"><option>WhatsApp</option><option>Sitio web</option><option>Referido</option><option>Evento</option></select></label>
            <label class="field">Responsable<input name="owner" value="Sofia Menendez" /></label>
            <button class="button primary" type="submit">Guardar</button>
            <p class="notice" hidden id="leadNotice"></p>
          </form>
        </article>
        <div class="grid three-col">${leads.map((l) => `<article class="card pad"><div class="item-line"><strong>${l.name}</strong>${badge(l.score, l.score > 85 ? "green" : "amber")}</div><p class="muted">${l.company} - ${l.source}</p></article>`).join("")}</div>
      </section>`;
  },
  portal() {
    return `
      <section class="page">
        <div><h1>Portal del cliente</h1><p class="muted">Autoservicio para crear tickets, consultar estados y aprobar cotizaciones.</p></div>
        <div class="grid three-col">
          ${["Crear tickets", "Descargar reportes", "Aprobar cotizaciones"].map((x) => `<article class="card pad"><h2>${x}</h2><p class="muted">Disponible para contactos autorizados.</p><button class="button">Abrir</button></article>`).join("")}
        </div>
        <article class="card pad">
          <h2>Reportar incidente</h2>
          <form class="form inline-form" id="portalTicketForm">
            <label class="field">Titulo<input name="title" required placeholder="Describe el problema" /></label>
            <label class="field">Empresa<input name="company" required placeholder="Tu empresa" /></label>
            <label class="field">Contacto<input name="requester" required placeholder="Tu nombre" /></label>
            <label class="field">Prioridad<select name="priority"><option value="low">Baja</option><option value="medium" selected>Media</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></label>
            <button class="button primary" type="submit">Enviar</button>
            <p class="notice" hidden id="portalTicketNotice"></p>
          </form>
        </article>
        <article class="card"><div class="card-header"><h2>Mis tickets recientes</h2></div><div class="card-body list">${tickets.map((t) => `<div class="item"><div class="item-line"><strong>${t.code}</strong>${badge(t.status, t.status === "resolved" ? "green" : "")}</div><p>${t.title}</p><small class="muted">${t.requester} - ${t.company}</small></div>`).join("")}</div></article>
      </section>`;
  },
  knowledge() {
    return `
      <section class="page">
        <div><h1>Base de conocimiento</h1><p class="muted">Articulos internos y publicos para reducir tickets repetitivos.</p></div>
        <label class="field"><input placeholder="Buscar guia, politica o procedimiento" /></label>
        <div class="grid four-col">
          ${["Como reportar incidentes criticos", "Guia rapida para reiniciar equipos de red", "Politica de respaldos y restauracion", "Checklist de seguridad para nuevos usuarios"].map((x) => `<article class="card pad"><h3>${x}</h3><p class="muted">Publicado para tecnicos y clientes autorizados.</p><button class="button">Leer</button></article>`).join("")}
        </div>
      </section>`;
  },
  reports() {
    return `
      <section class="page">
        <div class="toolbar"><div><h1>Reportes</h1><p class="muted">Indicadores de soporte, ventas, productividad y cumplimiento de SLA.</p></div><button class="button primary">Descargar reporte</button></div>
        <div class="grid three-col">
          ${metric("Tiempo medio de respuesta", "18 min", "Primer contacto en tickets nuevos")}
          ${metric("Resolucion al primer intento", "71%", "Casos cerrados sin reapertura")}
          ${metric("Forecast comercial", "$43.8k", "Pipeline ponderado")}
        </div>
        <div class="grid three-col">${["Correo al asignar ticket", "WhatsApp si SLA esta en riesgo", "Encuesta CSAT al cerrar ticket"].map((x) => `<article class="card pad"><h3>${x}</h3><p class="muted">Plantilla, evento y registro en notifications.</p></article>`).join("")}</div>
      </section>`;
  },
  settings() {
    return `
      <section class="page">
        <div><h1>Ajustes del sistema</h1><p class="muted">Roles, seguridad, integraciones y parametros operativos.</p></div>
        <div class="grid three-col">
          <article class="card pad"><h2>Roles</h2><p>${["admin", "technician", "sales", "client"].map((r) => badge(r)).join(" ")}</p></article>
          <article class="card pad"><h2>Seguridad</h2><p class="muted">Firebase Auth y reglas de Firestore por rol cuando se active backend.</p></article>
          <article class="card pad"><h2>Integraciones</h2><p class="muted">Correo, WhatsApp, Storage, Netlify y GitHub.</p></article>
        </div>
      </section>`;
  },
  login() {
    const modeText = hasFirebaseConfig
      ? "Conectado a Firebase. Usa usuarios creados en Firebase Authentication."
      : "Demo local sin servidor. Puedes entrar con las credenciales de prueba.";

    return `
      <section class="page">
        <article class="card pad" style="max-width: 460px; margin: 40px auto;">
          <img src="./assets/techshield-isotipo.png" alt="TechShield" style="width:72px;height:72px;object-fit:contain;display:block;margin:auto;" />
          <h1 style="text-align:center;">Acceso TechShield</h1>
          <p class="muted" style="text-align:center;">${modeText}</p>
          <form class="form" id="loginForm">
            <label class="field">Correo<input id="loginEmail" value="admin@techshieldsv.com" type="email" /></label>
            <label class="field">Contrasena<input id="loginPassword" value="TechShield2026!" type="password" /></label>
            <button class="button primary" type="submit">Entrar</button>
            <p class="notice" hidden id="loginNotice"></p>
          </form>
          <div class="item" style="margin-top:16px;">
            <strong>Credenciales demo</strong>
            <p class="muted">Admin: admin@techshieldsv.com / TechShield2026!</p>
            <p class="muted">Cliente: cliente@example.com / TechShield2026!</p>
          </div>
        </article>
      </section>`;
  }
};

function render(route = "dashboard") {
  const view = pages[route] ? route : "dashboard";
  document.querySelector("#app").innerHTML = pages[view]();
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === view);
  });
  const form = document.querySelector("#loginForm");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
      const password = document.querySelector("#loginPassword").value;
      const notice = document.querySelector("#loginNotice");

      if (auth) {
        notice.textContent = "Validando en Firebase...";
        notice.hidden = false;
        try {
          const credential = await auth.signInWithEmailAndPassword(email, password);
          const profile = await ensureUserProfile(credential.user);
          await loadFirebaseData();
          notice.textContent = `Acceso validado como ${profile?.role || "usuario"}. Redirigiendo...`;
          setTimeout(() => {
            window.location.hash = "dashboard";
            render("dashboard");
          }, 500);
        } catch (error) {
          notice.textContent = `Firebase rechazo el acceso: ${error.message}`;
          return;
        }
        return;
      }

      const user = demoUsers[email];
      if (!user || user.password !== password) {
        notice.textContent = "Credenciales incorrectas. Usa una cuenta demo o configura Firebase para usuarios reales.";
        notice.hidden = false;
        return;
      }

      localStorage.setItem("techshield-user", JSON.stringify({ email, role: user.role }));
      notice.textContent = `Acceso demo validado como ${user.role}. Redirigiendo...`;
      notice.hidden = false;
      setTimeout(() => {
        window.location.hash = user.route;
      }, 500);
    });
  }

  bindTicketForm("#ticketForm", "#ticketNotice");
  bindTicketForm("#portalTicketForm", "#portalTicketNotice");
  bindLeadForm();
}

function bindTicketForm(formSelector, noticeSelector) {
  const form = document.querySelector(formSelector);
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const record = {
      code: nextTicketCode(),
      title: data.get("title").trim(),
      company: data.get("company").trim(),
      requester: data.get("requester").trim(),
      technician: "Mesa de ayuda",
      status: "new",
      priority: data.get("priority"),
      sla: data.get("priority") === "urgent" ? "4h" : "24h",
      csat: null
    };
    tickets.unshift(record);
    await persist("tickets", record);
    showNotice(noticeSelector, `Ticket ${record.code} creado correctamente.`);
    form.reset();
    setTimeout(() => render(currentRoute()), 650);
  });
}

function bindLeadForm() {
  const form = document.querySelector("#leadForm");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const record = {
      name: data.get("name").trim(),
      company: data.get("company").trim(),
      source: data.get("source"),
      score: Math.floor(70 + Math.random() * 25),
      owner: data.get("owner").trim() || "Ventas"
    };
    leads.unshift(record);
    await persist("leads", record);
    showNotice("#leadNotice", "Lead creado correctamente.");
    form.reset();
    setTimeout(() => render("crm"), 650);
  });
}

function showNotice(selector, text) {
  const notice = document.querySelector(selector);
  if (!notice) return;
  notice.textContent = text;
  notice.hidden = false;
}

function currentRoute() {
  const hashRoute = window.location.hash.replace("#", "");
  if (hashRoute) return hashRoute;

  const pathRoute = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return pathRoute || "dashboard";
}

window.addEventListener("hashchange", () => render(currentRoute()));
window.addEventListener("popstate", () => render(currentRoute()));

document.querySelector("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("techshield-theme", document.body.classList.contains("dark") ? "dark" : "light");
});

if (localStorage.getItem("techshield-theme") === "dark") {
  document.body.classList.add("dark");
}

if (auth) {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      await ensureUserProfile(user);
      await loadFirebaseData();
    }
    render(currentRoute());
  });
} else {
  render(currentRoute());
}
