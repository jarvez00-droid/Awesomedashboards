/* ============================================================
   WEB DEL PROCESO CNG — app.js v2 (2026-08-07)
   1) Gate de password (patron sessionStorage de los dashboards)
   2) Toggle ES/EN por data-attributes (html[data-lang] + [data-i18n])
   3) Barra de progreso de lectura
   4) Nav movil (hamburguesa) + nav activa
   5) GLOSARIO compartido (window.CNG_GLOSARIO) + tooltips [.glo]
   6) Tabs ([data-tabs])
   7) Print abre <details>
   Sin CDNs, sin dependencias: autocontenido.
   API estable para las paginas: cngLang(), cngT(es,en),
   eventos 'cng:ready' y 'cng:lang'.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 1. GATE DE PASSWORD ----------
     Mismo patron que los dashboards (sessionStorage, ofuscacion
     consciente de contenido interno — no es seguridad fuerte).
     Clave provisional: CNG2026  [VERIFICAR CON JOSE]              */
  var PW = 'CNG2026';
  var KEY = 'cng_proceso_auth';

  function buildGate() {
    document.body.classList.add('cng-locked');
    var g = document.createElement('div');
    g.id = 'cng-gate';
    g.innerHTML =
      '<div class="g-box">' +
      '<h1>CNG &middot; Proceso</h1>' +
      '<p data-i18n="es">Material interno del equipo. Ingresa la clave.</p>' +
      '<p data-i18n="en">Internal team material. Enter the password.</p>' +
      '<input id="cng-pw" type="password" autocomplete="off" />' +
      '<button id="cng-pw-btn" data-i18n="es">Entrar</button>' +
      '<button id="cng-pw-btn-en" data-i18n="en">Enter</button>' +
      '<div class="g-err" id="cng-pw-err"><span data-i18n="es">Clave incorrecta</span><span data-i18n="en">Wrong password</span></div>' +
      '</div>';
    document.body.appendChild(g);
    var tryPw = function () {
      if (document.getElementById('cng-pw').value === PW) {
        sessionStorage.setItem(KEY, '1');
        unlock();
      } else {
        document.getElementById('cng-pw-err').style.visibility = 'visible';
      }
    };
    document.getElementById('cng-pw-btn').addEventListener('click', tryPw);
    document.getElementById('cng-pw-btn-en').addEventListener('click', tryPw);
    document.getElementById('cng-pw').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === 'Return' || e.keyCode === 13) tryPw();
    });
    setTimeout(function () { var i = document.getElementById('cng-pw'); if (i) i.focus(); }, 60);
  }

  function unlock() {
    document.body.classList.remove('cng-locked');
    var g = document.getElementById('cng-gate');
    if (g) g.remove();
    document.dispatchEvent(new CustomEvent('cng:ready'));
  }

  /* ---------- 2. IDIOMA (ES/EN por data-attributes) ---------- */
  function getLang() {
    try { return localStorage.getItem('cng_lang') || 'es'; } catch (e) { return 'es'; }
  }
  function setLang(l) {
    document.documentElement.setAttribute('data-lang', l);
    try { localStorage.setItem('cng_lang', l); } catch (e) { /* privado */ }
    var b = document.getElementById('cng-lang-btn');
    if (b) b.textContent = (l === 'es') ? 'EN' : 'ES';
    document.dispatchEvent(new CustomEvent('cng:lang', { detail: l }));
  }
  window.cngLang = getLang;                 // paginas lo usan para textos generados por JS
  window.cngT = function (es, en) { return getLang() === 'es' ? es : en; };

  /* ---------- 3. GLOSARIO COMPARTIDO ----------
     Fuente UNICA de los tooltips (.glo[data-g]) y de la tabla de
     glosario.html. Cada entrada: t=termino, es/en=definicion,
     g=grupo (obra | ciudad | registro | rol).
     Fuentes: canon v4 §2/§4/§5/§6/§7/§8 + Track A S2 + brief.   */
  window.CNG_GLOSARIO = {
    /* --- roles y herramientas --- */
    gc:            { t: 'GC (general contractor)', g: 'rol', es: 'Contratista general: la empresa que dirige la obra pero NO la ejecuta con cuadrillas propias — subcontrata cada trade. Eso es CNG.', en: 'General contractor: the company that runs the job but does NOT build with its own crews — it subcontracts every trade. That is CNG.' },
    trade:         { t: 'trade', g: 'rol', es: 'Un oficio o especialidad de la obra (plomería, framing, pintura…). En CNG cada trade es también un GRUPO de tareas en el schedule, con su propia cadena.', en: 'A construction specialty (plumbing, framing, paint…). At CNG each trade is also a GROUP of tasks in the schedule, with its own chain.' },
    sub:           { t: 'sub (subcontratista)', g: 'rol', es: 'La empresa o cuadrilla externa que ejecuta un trade. CNG le paga contra Work Order firmada e inspección.', en: 'The outside company or crew that executes a trade. CNG pays them against a signed Work Order and an inspection.' },
    crew:          { t: 'crew (cuadrilla)', g: 'rol', es: 'El equipo de trabajadores del sub que llega a la obra.', en: 'The sub’s team of workers that shows up on site.' },
    jobtread:      { t: 'JobTread (JT)', g: 'rol', es: 'El software donde vive TODO el registro: schedule, tareas, budgets, Work Orders, pagos. “La columna vertebral de la operación a nivel administrativo.”', en: 'The software where ALL the record lives: schedule, tasks, budgets, Work Orders, payments. “The administrative backbone of the operation.”' },
    companycam:    { t: 'CompanyCam (CC)', g: 'rol', es: 'La app de fotos de obra: fotos CON descripción, checklists por trade (Before/During/After) y reportes SOW/Take-off.', en: 'The jobsite photo app: photos WITH descriptions, per-trade checklists (Before/During/After) and SOW/Take-off reports.' },
    kitbot:        { t: 'KITBOT', g: 'rol', es: 'El asistente de IA por Telegram, uno por puesto: organiza el día, responde dudas técnicas a nivel experto, persigue esperas y audita documentación.', en: 'The AI assistant on Telegram, one per position: organizes the day, answers technical questions, chases waits and audits documentation.' },
    dashboard:     { t: 'AwesomeDashboards', g: 'rol', es: 'Los dashboards en vivo de CNG (schedule, finanzas, productividad, compras). Desarrollo propio: conecta JobTread + CompanyCam + Telegram.', en: 'CNG’s live dashboards (schedule, finance, productivity, purchases). Built in-house: connects JobTread + CompanyCam + Telegram.' },
    pm:            { t: 'PM (Project Manager)', g: 'rol', es: 'El gestor de la obra: contrata subs, supervisa, documenta y mantiene su schedule como espejo de la realidad. No ejecuta con sus manos — GESTIONA.', en: 'The project manager: hires subs, supervises, documents and keeps the schedule mirroring reality. Doesn’t swing the hammer — MANAGES.' },
    purchases:     { t: 'Purchases (Compras)', g: 'rol', es: 'La posición (Romina, Perú) que cuantifica, cotiza con 3 proveedores y compra el material para que llegue ANTES que la cuadrilla.', en: 'The position (Romina, Peru) that quantifies, quotes with 3 suppliers and buys material so it arrives BEFORE the crew.' },
    backoffice:    { t: 'Backoffice / Data-Entry', g: 'rol', es: 'La posición que registra TODO en JobTread (schedule + libros), re-fecha los schedules tras la reunión de 2:30 y audita la documentación.', en: 'The position that records EVERYTHING in JobTread (schedule + books), re-dates schedules after the 2:30 meeting and audits documentation.' },
    admin:         { t: 'Administradora', g: 'rol', es: 'Milagros: la gatekeeper del dinero. “Nada se paga sin pasar por ella” — aplica los 4 filtros a cada solicitud de pago.', en: 'Milagros: the money gatekeeper. “Nothing gets paid without going through her” — she applies the 4 filters to every payment request.' },
    asm:           { t: 'ASM (vendedor)', g: 'rol', es: 'Account Success Manager: el vendedor. Canal ÚNICO del cliente durante el planeamiento; genera el Sales Report al cerrar la venta.', en: 'Account Success Manager: the salesperson. The client’s ONLY channel during planning; produces the Sales Report at closing.' },
    planning:      { t: 'Planning', g: 'rol', es: 'El equipo de arquitectura en Perú (Claudia): planos, permisos con la ciudad y el Portafolio del PM. Nunca habla directo con el cliente — todo pasa por el vendedor.', en: 'The architecture team in Peru (Claudia): drawings, city permits and the PM’s Portfolio. Never talks to the client directly — everything goes through the salesperson.' },
    leadpm:        { t: 'lead PM', g: 'rol', es: 'La posición que asigna obras, supervisa PMs y recibe escalamientos. Hoy la hace el CEO.', en: 'The position that assigns jobs, supervises PMs and receives escalations. Today the CEO covers it.' },
    theturn:       { t: 'The Turn', g: 'rol', es: 'El momento en que el proyecto pasa de Ventas/Planning al PM: se le entrega Sales Report + Portafolio + planos y arranca la operación.', en: 'The moment the project passes from Sales/Planning to the PM: Sales Report + Portfolio + drawings are handed over and operations start.' },
    vendor:        { t: 'vendor (proveedor)', g: 'rol', es: 'Como JobTread llama a cualquiera a quien CNG le paga: un sub o una tienda de materiales. Para poder firmar una WO o recibir un pago, el vendor tiene que estar registrado en JobTread (nombre, email, teléfono, documentación).', en: 'What JobTread calls anyone CNG pays: a sub or a material supplier. To sign a WO or receive a payment, the vendor must be registered in JobTread (name, email, phone, documents).' },
    lead:          { t: 'lead', g: 'rol', es: 'Una persona interesada en construir que todavía NO es cliente. Marketing los genera, Ventas los convierte. Un lead de hoy es un contrato de dentro de ~6 meses.', en: 'A person interested in building who is NOT a client yet. Marketing generates them, Sales converts them. Today’s lead is a contract ~6 months out.' },
    funnel:        { t: 'funnel (embudo)', g: 'rol', es: 'El camino por el que pasa un lead hasta firmar: entran muchos arriba y salen pocos abajo (contactado → visitado → estimado → firmado). Por eso se cuida el TOPE del embudo: sin leads hoy no hay obras en 6 meses.', en: 'The path a lead travels to signing: many enter at the top, few come out the bottom (contacted → visited → estimated → signed). That’s why the TOP of the funnel matters: no leads today = no jobs in 6 months.' },
    sistema:       { t: '"el sistema"', g: 'rol', es: 'Cuando en esta web decimos "el sistema", hablamos del conjunto de programas de CNG que leen JobTread + CompanyCam + Telegram y producen los reportes solos: KITBOT (por Telegram) y los AwesomeDashboards. Nadie redacta los reportes a mano.', en: 'When this site says "the system", it means CNG’s software that reads JobTread + CompanyCam + Telegram and produces the reports on its own: KITBOT (on Telegram) and the AwesomeDashboards. Nobody writes the reports by hand.' },
    /* --- registro (schedule + libros + documentos) --- */
    schedule:      { t: 'schedule (cronograma)', g: 'registro', es: 'El cronograma del proyecto en JobTread: refleja lo que pasó en la realidad y proyecta (optimista) lo que pasará. Agrupa por TRADE — los detalles de ejecución viven en los checklists, no aquí.', en: 'The project schedule in JobTread: reflects what really happened and (optimistically) projects what will. Grouped by TRADE — execution details live in the checklists, not here.' },
    checklist:     { t: 'checklist (CompanyCam)', g: 'registro', es: 'La lista de verificación por trade en CompanyCam, en 3 momentos: Before (×2), During y After. Ahí viven los DETALLES (“cubre los muebles…”). El After desbloquea el pago.', en: 'The per-trade verification list in CompanyCam, at 3 moments: Before (×2), During and After. That’s where DETAILS live (“cover the furniture…”). The After unlocks payment.' },
    template:      { t: 'template (maestro)', g: 'registro', es: 'El schedule modelo oficial: 34 grupos-trade, 411 tareas, en días numerados (día 15…171). Cada obra nace copiándolo y borrando los trades no vendidos.', en: 'The official model schedule: 34 trade groups, 411 tasks, on numbered days (day 15…171). Every job starts by copying it and deleting unsold trades.' },
    baseline:      { t: 'baseline (línea base)', g: 'registro', es: 'La foto del schedule cada VIERNES 11:00 PM: el “ideal” de la semana siguiente. En los reportes: GRIS = ideal, VERDE = lo que realmente sucedió.', en: 'The snapshot of the schedule every FRIDAY 11:00 PM: next week’s “ideal”. In reports: GRAY = ideal, GREEN = what really happened.' },
    cp:            { t: 'Critical Path (ruta crítica)', g: 'registro', es: 'La cadena de trabajos donde un retraso retrasa TODA la obra. En el schedule van en azul; el tipo de tarea “Critical Path” los marca.', en: 'The chain of work where a delay delays the WHOLE job. Blue in the schedule; the “Critical Path” task type marks them.' },
    action:        { t: 'Action Task', g: 'registro', es: 'El trabajo real que ejecuta el sub (ej. instalar sheetrock). Si además está en la ruta crítica, se marca como Critical Path.', en: 'The real work the sub executes (e.g., hang sheetrock). If it’s also on the critical path, it’s marked Critical Path.' },
    sow:           { t: 'SOW (Scope of Work)', g: 'registro', es: 'El alcance de trabajo: reporte en CompanyCam con TODO lo que el sub debe hacer (dibujos, medidas, fotos de dónde va cada cosa). Sin lugar a interpretación.', en: 'The Scope of Work: a CompanyCam report with EVERYTHING the sub must do (drawings, measurements, photos of where each thing goes). No room for interpretation.' },
    wo:            { t: 'WO (Work Order)', g: 'registro', es: 'El contrato con el sub: scope adentro + monto + Payment Breakdown + firma electrónica. NINGÚN trabajo inicia sin WO firmada — “no es como acuerdo de palabra”.', en: 'The contract with the sub: scope inside + amount + Payment Breakdown + e-signature. NO work starts without a signed WO — “it’s not a handshake deal”.' },
    bid:           { t: 'bid request / quote', g: 'registro', es: 'El pedido de cotización (el SOW se envía a ≥3 subs) / la cotización que responde el sub.', en: 'The request for quote (the SOW goes to ≥3 subs) / the quote the sub sends back.' },
    takeoff:       { t: 'take-off', g: 'registro', es: 'Cuantificar el material que necesita un trade (ej. pies lineales de siding por locación). Lo arma Compras; el PM confirma medidas EN OBRA.', en: 'Quantifying the material a trade needs (e.g., linear feet of siding per location). Purchasing builds it; the PM confirms measurements ON SITE.' },
    eta:           { t: 'ETA', g: 'registro', es: 'Fecha estimada de llegada del material, POR ESCRITO del proveedor. Un ETA sin confirmar “le miente al cronograma”.', en: 'Estimated arrival date of material, IN WRITING from the supplier. An unconfirmed ETA “lies to the schedule”.' },
    bill:          { t: 'Bill', g: 'registro', es: 'El documento contable de un pago a sub en JobTread (como recibo por honorarios).', en: 'The accounting document for a sub payment in JobTread (like a service invoice).' },
    expense:       { t: 'Expense', g: 'registro', es: 'El documento contable de una compra de material (la factura/boleta de la tienda).', en: 'The accounting document for a material purchase (the store invoice/receipt).' },
    addexp:        { t: 'Additional Expense', g: 'registro', es: 'El tipo de tarea para gastos del día a día (Home Depot, caja chica, bolsas de basura). TODO gasto se anota al proyecto — sin excepción.', en: 'The task type for day-to-day spend (Home Depot, petty cash, trash bags). EVERY expense is logged to the project — no exceptions.' },
    refund:        { t: 'Refund', g: 'registro', es: 'Reembolso registrado al proyecto (ej. gasolina de los PMs).', en: 'A reimbursement recorded to the project (e.g., PM gas).' },
    budget:        { t: 'budget', g: 'registro', es: 'El estimado firmado convertido en presupuesto de obra, por trades y line items. De ahí sale el costo máximo que el PM puede pagar a un sub.', en: 'The signed estimate turned into the job budget, by trades and line items. It sets the maximum cost a PM can pay a sub.' },
    lineitem:      { t: 'line item', g: 'registro', es: 'Una línea del budget: cantidad · unidad · costo unitario · costo extendido (unitario × cantidad). Unidad típica: square feet.', en: 'One budget line: quantity · unit · unit cost · extended cost (unit × quantity). Typical unit: square feet.' },
    margen:        { t: 'margen (costo vs precio)', g: 'registro', es: 'Precio = lo que paga el cliente; costo = lo que CNG puede pagar al sub. La diferencia (normalmente 40%) es el margen: costo = precio × (1 − margen).', en: 'Price = what the client pays; cost = what CNG can pay the sub. The difference (normally 40%) is the margin: cost = price × (1 − margin).' },
    portafolio:    { t: 'Portafolio', g: 'registro', es: '“La biblia del PM”: layout antes/después, medidas (ventanas “W3”), plano eléctrico, medidas de carpintería + la lista para Compras. Lo produce Planning. Portafolio 2 = renders + acabados.', en: '“The PM’s bible”: before/after layout, measurements (“W3” windows), electrical plan, carpentry measurements + the list for Purchasing. Produced by Planning. Portfolio 2 = renders + finishes.' },
    salesreport:   { t: 'Sales Report', g: 'registro', es: 'Lo que entrega el vendedor al cerrar: plano de planta, información de sus visitas y análisis de factibilidad.', en: 'What the salesperson delivers at closing: floor plan, visit notes and feasibility analysis.' },
    changeorder:   { t: 'change order', g: 'registro', es: 'Cambio al contrato firmado (alcance o precio) — se documenta y firma, nunca se acuerda de palabra.', en: 'A change to the signed contract (scope or price) — documented and signed, never verbal.' },
    downpayment:   { t: 'downpayment', g: 'registro', es: 'Pago inicial a un sub ANTES del trabajo. Es EXCEPCIÓN: solo ciertos subs/trades (framing, MEP rough-ins). La regla general: a los subs nunca se les paga al inicio.', en: 'An initial payment to a sub BEFORE the work. It’s an EXCEPTION: only certain subs/trades (framing, MEP rough-ins). General rule: subs are never paid upfront.' },
    draw:          { t: 'draw', g: 'registro', es: 'Desembolso del banco al avanzar la obra: cada trade terminado se convierte en cobro (lo gestiona el CEO).', en: 'A bank disbursement as the job advances: each finished trade becomes a collection (managed by the CEO).' },
    lienrelease:   { t: 'lien release', g: 'registro', es: 'Documento legal de seguridad al cierre de obra.', en: 'A legal safety document at project closeout.' },
    lienwaiver:    { t: 'lien waiver', g: 'registro', es: 'Renuncia de gravamen — parte del expediente de pago de un sub.', en: 'A lien waiver — part of a sub’s payment file.' },
    completionform:{ t: 'Completion Form', g: 'registro', es: 'La conformidad firmada del cliente al cierre: libera a la empresa de lo no cubierto por garantía.', en: 'The client’s signed acceptance at closeout: releases the company from anything not covered by warranty.' },
    viernes:       { t: 'viernes-vs-viernes', g: 'registro', es: 'La ley de evaluación: cuenta qué se CERRÓ entre un viernes y el siguiente, contra la foto del viernes (baseline). Nunca se acusa por schedules “sin mover”.', en: 'The evaluation law: what counts is what got CLOSED between one Friday and the next, against the Friday snapshot (baseline).' },
    reglaoro:      { t: 'la regla de oro', g: 'registro', es: 'Un Action/EXECUTE solo puede tener fecha si su cadena previa está 100% cerrada: SOW + WO firmada + schedule confirmado + material con ETA + inspección Before.', en: 'An Action/EXECUTE may only carry a date if its prior chain is 100% closed: SOW + signed WO + confirmed schedule + material with ETA + Before inspection.' },
    gantt:         { t: 'gantt', g: 'registro', es: 'El dibujo del cronograma en barras horizontales: cada barra es una tarea y su largo son los días que dura. En los reportes de CNG se pintan DOS barras encima: GRIS = lo planificado (el baseline) y VERDE = lo que realmente pasó.', en: 'The schedule drawn as horizontal bars: each bar is a task and its length is how many days it takes. CNG’s reports overlay TWO bars: GRAY = what was planned (the baseline) and GREEN = what actually happened.' },
    kanban:        { t: 'kanban', g: 'registro', es: 'Una vista en columnas donde cada columna es un día (o un estado) y cada tarjeta es una tarea. Sirve para ver de un vistazo la carga de la semana, sin leer una lista larga.', en: 'A column view where each column is a day (or a state) and each card is a task. It shows the week’s load at a glance without reading a long list.' },
    overhead:      { t: 'overhead (costos fijos)', g: 'registro', es: 'Lo que a CNG le cuesta existir cada mes aunque no se ponga un solo ladrillo: sueldos, oficina, software, seguros. Si la obra produce menos que el overhead, el mes pierde plata.', en: 'What it costs CNG to exist each month even if not a single brick is laid: salaries, office, software, insurance. If the jobs produce less than overhead, the month loses money.' },
    paybreak:      { t: 'Payment Breakdown', g: 'registro', es: 'La parte de la WO que dice CUÁNDO y CONTRA QUÉ se le paga al sub (ej. "50% al pasar el rough-in, 50% el viernes siguiente al término"). Siempre va dentro de la WO: es lo que evita discusiones de pago después.', en: 'The part of the WO that states WHEN and AGAINST WHAT the sub gets paid (e.g., "50% on passing rough-in, 50% the Friday after completion"). It always goes inside the WO: it’s what prevents payment arguments later.' },
    signoff:       { t: 'sign-off (del trade anterior)', g: 'registro', es: 'La confirmación firmada/registrada de que el trade que iba ANTES terminó bien y dejó el sitio listo. Sin ese sign-off el trade siguiente no arranca — así se evita construir encima de un error ajeno.', en: 'The signed/recorded confirmation that the PREVIOUS trade finished well and left the site ready. Without that sign-off the next trade doesn’t start — that’s how you avoid building on top of someone else’s mistake.' },
    holdpoint:     { t: 'hold point', g: 'registro', es: 'Un punto del trabajo donde hay que PARAR y dejar evidencia antes de continuar (ej. foto de la pared abierta antes de taparla con drywall). Después de taparlo ya no hay forma de probar cómo quedó.', en: 'A point in the work where you must STOP and leave evidence before continuing (e.g., a photo of the open wall before drywall covers it). Once it’s covered there’s no way to prove how it was left.' },
    clockin:       { t: 'clock in / clock out', g: 'registro', es: 'Marcar entrada y salida del día en JobTread. Es lo que deja constancia de la jornada del PM; forma parte de su "Día Cumplido".', en: 'Clocking in and out of the day in JobTread. It’s what records the PM’s workday; part of their "Day Done".' },
    diacumplido:   { t: 'Día Cumplido', g: 'registro', es: 'La lista corta de checks que define si tu día está terminado — igual para todos los días y verificable por el sistema. No es "sentir" que trabajaste: es que los checks se cumplan.', en: 'The short checklist that defines whether your day is finished — the same every day and verifiable by the system. It’s not "feeling" you worked: it’s the checks being met.' },
    escalar:       { t: 'escalar', g: 'registro', es: 'Pasar un problema que TÚ no puedes resolver a quien sí puede (lead PM/CEO, Administradora, Jose), el MISMO día y con el problema + un camino propuesto. Escalar no es quejarse ni delegar: es no dejar que el cronograma pague la espera.', en: 'Handing a problem YOU can’t solve to whoever can (lead PM/CEO, Administrator, Jose), the SAME day, with the problem + a proposed path. Escalating isn’t complaining or delegating: it’s not letting the schedule pay for the wait.' },
    carrera:       { t: 'la Carrera', g: 'registro', es: 'El nombre del reporte #11: compara el avance del mes contra el baseline con el que arrancó el mes. La metáfora: el mes es una carrera contra el plan — o vas ganando o vas perdiendo.', en: 'The name of report #11: it compares the month’s progress against the baseline the month started with. The metaphor: the month is a race against the plan — you’re either winning or losing it.' },
    additionals:   { t: 'additionals', g: 'registro', es: 'El total de Additional Expenses (gastos del día a día) acumulados por proyecto. Se miran juntos porque muchos gastos chicos sin control se comen el margen del trade.', en: 'The total of Additional Expenses (day-to-day spend) accumulated per project. They’re watched together because many small uncontrolled buys eat the trade’s margin.' },
    eod:           { t: 'EOD (end of day)', g: 'registro', es: 'Fin de la jornada. "Daily Schedule Update by EOD" = los schedules quedan cuadrados antes de cerrar el día (antes de las 8 PM, que es cuando el sistema genera los reportes).', en: 'End of day. "Daily Schedule Update by EOD" = schedules are squared before the day closes (before 8 PM, when the system generates the reports).' },
    opsdb:         { t: 'ops.db', g: 'registro', es: 'La base de datos interna donde el Backoffice deja las discrepancias y decisiones de la reunión diaria. Es la memoria de "qué se dijo" que después alimenta los reportes.', en: 'The internal database where the Backoffice logs the daily meeting’s discrepancies and decisions. It’s the memory of "what was said" that later feeds the reports.' },
    /* --- ciudad --- */
    permit:        { t: 'permit (permiso)', g: 'ciudad', es: 'La autorización de la ciudad para construir. La gestiona Planning; ~1 de cada 100 la ciudad la niega definitivamente.', en: 'The city’s authorization to build. Managed by Planning; ~1 in 100 the city denies for good.' },
    inspeccion:    { t: 'city inspection', g: 'ciudad', es: 'El día en que un inspector de la ciudad revisa un trabajo y autoriza continuar. “Los ítems rojitos” del schedule.', en: 'The day a city inspector reviews work and authorizes continuing. The schedule’s “little red items”.' },
    redtag:        { t: 'red tag', g: 'ciudad', es: 'Rechazo de una inspección de ciudad. Cuesta días. Se evita verificando secuencia + planos aprobados FÍSICAMENTE en obra antes de llamar.', en: 'A failed city inspection. Costs days. Avoided by verifying sequence + approved plans PHYSICALLY on site before calling.' },
    survey:        { t: 'survey', g: 'ciudad', es: 'Inspección de un tercero (no la ciudad) — ej. verificar el formboard de la fundación.', en: 'A third-party inspection (not the city) — e.g., verifying the foundation formboard.' },
    ocho11:        { t: '811', g: 'ciudad', es: 'La verificación de líneas subterráneas ANTES de excavar (email de verificación a la ciudad + inspección 811). El primer paso de toda obra.', en: 'The buried-utility check BEFORE digging (city verification email + 811 inspection). The first step of every job.' },
    finalinsp:     { t: 'final inspection', g: 'ciudad', es: 'La inspección final la hace LA CIUDAD (no un tercero) porque la responsabilidad legal recae en la ciudad. Autoriza la entrega.', en: 'The final inspection is done by THE CITY (not a third party) because legal responsibility falls on the city. It authorizes delivery.' },
    punchlist:     { t: 'punch list', g: 'ciudad', es: 'La lista de correcciones que sale del recorrido con el cliente antes de entregar.', en: 'The list of fixes that comes out of the client walkthrough before delivery.' },
    walkthrough:   { t: 'pre-delivery walk', g: 'ciudad', es: 'El recorrido con el cliente contrastando la obra contra el contrato.', en: 'The walkthrough with the client, checking the job against the contract.' },
    /* --- obra (vocabulario de campo) --- */
    foundation:    { t: 'foundation', g: 'obra', es: 'La losa de concreto sobre la que se construye todo.', en: 'The concrete slab everything is built on.' },
    formboard:     { t: 'formboard', g: 'obra', es: 'Delimitar el plano en el terreno con madera, antes de excavar y tirar concreto.', en: 'Outlining the floor plan on the ground with wood, before digging and pouring.' },
    concretepour:  { t: 'concrete pour / curing', g: 'obra', es: 'Tirado del concreto y su curado (~10 días en los que NO se puede construir encima).', en: 'Pouring the concrete and letting it cure (~10 days when you canNOT build on it).' },
    framing:       { t: 'framing', g: 'obra', es: 'El esqueleto de madera de la casa (en Texas toda la estructura es madera).', en: 'The wooden skeleton of the house (in Texas the whole structure is wood).' },
    sheathing:     { t: 'exterior sheathing', g: 'obra', es: 'La envolvente de madera impermeable que cierra el esqueleto por fuera.', en: 'The weather-resistant wood envelope that closes the skeleton from outside.' },
    roofdecking:   { t: 'roof decking', g: 'obra', es: 'Lo mismo que el sheathing, pero para el techo.', en: 'Same as sheathing, but for the roof.' },
    mep:           { t: 'MEP', g: 'obra', es: 'Mechanical (aire acondicionado) + Electrical + Plumbing: las instalaciones. Van en 3 fases: in-ground → rough-in → trim.', en: 'Mechanical (HVAC) + Electrical + Plumbing: the systems. Done in 3 phases: in-ground → rough-in → trim.' },
    inground:      { t: 'in-ground', g: 'obra', es: 'Fase 1 de MEP: instalaciones bajo tierra (tuberías, puesta a tierra), ANTES de la fundación.', en: 'MEP phase 1: below-ground systems (pipes, grounding), BEFORE the foundation.' },
    roughin:       { t: 'rough-in', g: 'obra', es: 'Fase 2 de MEP: las instalaciones dentro de la casa, con las paredes aún abiertas.', en: 'MEP phase 2: the systems inside the house, with the walls still open.' },
    trimmep:       { t: 'trim (MEP)', g: 'obra', es: 'Fase 3 de MEP: los acabados finales (luminarias, panel eléctrico, rejillas, caños, duchas).', en: 'MEP phase 3: the final finishes (fixtures, electrical panel, vents, faucets, showers).' },
    ziptape:       { t: 'zip tape', g: 'obra', es: 'El sellado de uniones y ventanas: la impermeabilización.', en: 'Sealing joints and windows: the waterproofing.' },
    insulation:    { t: 'insulation', g: 'obra', es: 'Aislamiento térmico: fibra de vidrio o espuma. ⚠ La espuma no va cerca de líneas de agua caliente/gas (riesgo de incendio — ya pasó y hubo retrabajo).', en: 'Thermal insulation: fiberglass or foam. ⚠ Foam must not touch hot-water/gas lines (fire risk — it happened and caused rework).' },
    drywall:       { t: 'drywall / sheetrock', g: 'obra', es: 'La tablaroca: las planchas que forman las paredes interiores.', en: 'The gypsum boards that form the interior walls.' },
    hang:          { t: 'hang (drywall)', g: 'obra', es: 'Colgar la tablaroca: fijar las planchas. Marca el FIN de la Fase 1 (estructura).', en: 'Hanging the drywall: fastening the boards. Marks the END of Phase 1 (structure).' },
    tapebed:       { t: 'tape, bed & texture', g: 'obra', es: 'Cinta en las uniones + masilla + textura de la pared.', en: 'Tape on the joints + mud + wall texture.' },
    primer:        { t: 'primer', g: 'obra', es: 'La primera capa de pintura. CNG cambió el proceso: aquí SOLO primer — la pintura final va AL FINAL para no arruinarla con los trabajos posteriores.', en: 'The first coat of paint. CNG changed the process: ONLY primer here — final paint goes at THE END so later work doesn’t ruin it.' },
    flooring:      { t: 'flooring', g: 'obra', es: 'Los pisos: laminados o madera.', en: 'The floors: laminate or wood.' },
    tiles:         { t: 'tiles', g: 'obra', es: 'La cerámica (cocina, baños).', en: 'The tile work (kitchen, bathrooms).' },
    grout:         { t: 'grout', g: 'obra', es: 'La fragua / el pegamento de la cerámica.', en: 'The tile grout / adhesive.' },
    interiordoors: { t: 'interior doors', g: 'obra', es: 'Las puertas interiores: colgarlas y pintarlas.', en: 'The interior doors: hanging and painting them.' },
    baseboards:    { t: 'baseboards', g: 'obra', es: 'Los zócalos: la madera al pie de las paredes.', en: 'The baseboards: the wood at the foot of the walls.' },
    trims:         { t: 'trims (carpintería)', g: 'obra', es: 'Contornos y molduras de carpintería.', en: 'Carpentry trims and moldings.' },
    cabinets:      { t: 'cabinets', g: 'obra', es: 'Los gabinetes de cocina (+ islas).', en: 'The kitchen cabinets (+ islands).' },
    vanities:      { t: 'vanities', g: 'obra', es: 'Los gabinetes de baño.', en: 'The bathroom cabinets.' },
    countertops:   { t: 'countertops', g: 'obra', es: 'Las cubiertas de piedra. Dependen de los cabinets (se miden sobre ellos).', en: 'The stone countertops. They depend on the cabinets (measured on top of them).' },
    bricks:        { t: 'bricks', g: 'obra', es: 'La fachada de ladrillo. Decorativa, NO estructural.', en: 'The brick façade. Decorative, NOT structural.' },
    siding:        { t: 'siding', g: 'obra', es: 'Paneles decorativos de fachada (opcional).', en: 'Decorative façade panels (optional).' },
    gutters:       { t: 'gutters', g: 'obra', es: 'Las canaletas del techo (+ gutter guard = su protector).', en: 'The roof gutters (+ gutter guard = their cover).' },
    adu:           { t: 'ADU / attach', g: 'obra', es: 'Los 2 tipos de adición: attach = expansión pegada a la casa; ADU = unidad independiente (se trata como obra nueva).', en: 'The 2 addition types: attach = expansion glued to the house; ADU = independent unit (treated as new construction).' }
  };

  /* ---------- 4. TOOLTIPS DE GLOSARIO (.glo[data-g]) ---------- */
  var tipEl = null, tipFor = null;
  function buildTip() {
    tipEl = document.createElement('div');
    tipEl.id = 'cng-tip';
    document.body.appendChild(tipEl);
  }
  function showTip(el) {
    var key = el.getAttribute('data-g');
    var d = window.CNG_GLOSARIO[key];
    if (!d) return;
    var lang = getLang();
    tipEl.innerHTML = '<span class="t-term"></span><span class="t-def"></span>' +
      '<span class="t-link"><a></a></span>';
    tipEl.querySelector('.t-term').textContent = d.t;
    tipEl.querySelector('.t-def').textContent = (lang === 'en' ? d.en : d.es);
    var a = tipEl.querySelector('.t-link a');
    a.textContent = (lang === 'en' ? 'Glossary →' : 'Ver glosario →');
    a.href = (location.pathname.indexOf('/posiciones/') !== -1 ? '../glosario.html' : 'glosario.html');
    tipEl.style.display = 'block';
    tipEl.classList.remove('abajo');
    var r = el.getBoundingClientRect();
    var top = r.bottom + window.scrollY + 9;
    var left = Math.max(8, Math.min(r.left + window.scrollX - 12, window.innerWidth - tipEl.offsetWidth - 12));
    /* si no cabe abajo, arriba */
    if (r.bottom + tipEl.offsetHeight + 20 > window.innerHeight && r.top > tipEl.offsetHeight + 20) {
      top = r.top + window.scrollY - tipEl.offsetHeight - 9;
      tipEl.classList.add('abajo');
    }
    tipEl.style.top = top + 'px';
    tipEl.style.left = left + 'px';
    tipFor = el;
  }
  function hideTip() {
    if (tipEl) tipEl.style.display = 'none';
    tipFor = null;
  }
  function initTips() {
    buildTip();
    document.addEventListener('click', function (e) {
      var g = e.target.closest ? e.target.closest('.glo') : null;
      if (g) {
        e.preventDefault();
        if (tipFor === g) { hideTip(); } else { showTip(g); }
      } else if (!tipEl.contains(e.target)) {
        hideTip();
      }
    });
    document.addEventListener('mouseover', function (e) {
      var g = e.target.closest ? e.target.closest('.glo') : null;
      if (g && tipFor !== g) showTip(g);
    });
    document.addEventListener('mouseout', function (e) {
      var g = e.target.closest ? e.target.closest('.glo') : null;
      if (g && (!e.relatedTarget || !tipEl.contains(e.relatedTarget))) hideTip();
    });
    window.addEventListener('scroll', hideTip, { passive: true });
  }

  /* ---------- 5. TABS ([data-tabs]) ---------- */
  function initTabs() {
    document.querySelectorAll('[data-tabs]').forEach(function (box) {
      var btns = box.querySelectorAll('.tabs-nav button[data-tab]');
      var panels = box.querySelectorAll('.tab-panel[data-panel]');
      function abrir(id) {
        btns.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-tab') === id); });
        panels.forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-panel') === id); });
      }
      btns.forEach(function (b) {
        b.addEventListener('click', function () { abrir(b.getAttribute('data-tab')); });
      });
      if (btns.length && !box.querySelector('.tabs-nav button.on')) abrir(btns[0].getAttribute('data-tab'));
    });
  }

  /* ---------- 6. BARRA DE PROGRESO DE LECTURA ---------- */
  function initProgress() {
    var bar = document.createElement('div');
    bar.id = 'cng-progress';
    document.body.appendChild(bar);
    function upd() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, p)) + '%';
    }
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
  }

  /* ---------- 7. NAV MOVIL (hamburguesa) ---------- */
  function initNav() {
    var header = document.querySelector('header.site');
    if (!header) return;
    var bar = header.querySelector('.bar');
    var nav = header.querySelector('nav');
    if (!bar || !nav) return;
    var btn = document.createElement('button');
    btn.className = 'nav-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Menu');
    btn.textContent = '☰';
    var langBtn = document.getElementById('cng-lang-btn');
    if (langBtn) { bar.insertBefore(btn, langBtn); } else { bar.appendChild(btn); }
    btn.addEventListener('click', function () { header.classList.toggle('nav-open'); });
    nav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) header.classList.remove('nav-open');
    });
    /* nav activa: comparar la URL RESUELTA del link contra la pagina actual
       (funciona en la raiz y en posiciones/ con sus hrefs relativos) */
    var herePath = location.pathname.replace(/\/$/, '/index.html');
    nav.querySelectorAll('a').forEach(function (a) {
      try {
        var target = new URL(a.getAttribute('href') || '', location.href).pathname;
        if (target === herePath) a.classList.add('active');
      } catch (e) { /* href raro: se ignora */ }
    });
  }

  /* ---------- 8. INIT ---------- */
  function init() {
    setLang(getLang());

    var b = document.getElementById('cng-lang-btn');
    if (b) b.addEventListener('click', function () {
      setLang(getLang() === 'es' ? 'en' : 'es');
    });

    initNav();
    initProgress();
    initTips();
    initTabs();

    /* print: abrir todos los <details> y restaurar despues */
    var touched = [];
    window.addEventListener('beforeprint', function () {
      touched = [];
      document.querySelectorAll('details:not([open])').forEach(function (d) {
        d.setAttribute('open', ''); touched.push(d);
      });
    });
    window.addEventListener('afterprint', function () {
      touched.forEach(function (d) { d.removeAttribute('open'); });
      touched = [];
    });

    /* gate */
    if (sessionStorage.getItem(KEY) === '1') {
      document.dispatchEvent(new CustomEvent('cng:ready'));
    } else {
      buildGate();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
