/* ═══════════════════════════════════════════
   I18N — ES/EN toggle. Selector-driven (not
   data-i18n attributes): each DICT entry maps a CSS
   selector to { en, es } innerHTML. Mirrors theme.js's
   persistence pattern (localStorage + no-flash-on-return
   via an early <head> snippet) and dispatches
   'sh-lang-changed' the same way theme.js dispatches
   'leo-theme-changed', so other modules can react.
   ═══════════════════════════════════════════ */

const KEY = 'sh-lang';

// selector -> { en, es } innerHTML. Scoped selectors (e.g. "#about .eyebrow")
// are used wherever a class repeats across multiple sections.
const DICT = {
  '.site-nav .nav a[href="#hero"]': { en: 'Home', es: 'Inicio' },
  '.site-nav .nav a[href="#about"]': { en: 'About', es: 'Nosotros' },
  '.site-nav .nav a[href="#university"]': { en: 'University', es: 'Universidad' },
  '.sh-nav__center span': { en: 'creative studio', es: 'estudio creativo' },
  '.pill-btn--works': { en: 'Works', es: 'Trabajos' },
  '.pill-btn--solid': { en: 'Menu', es: 'Menú' },

  '.menu-overlay__close': { en: 'Close ✕', es: 'Cerrar ✕' },
  '.menu-overlay__nav a:nth-child(1)': { en: 'Home <span>01</span>', es: 'Inicio <span>01</span>' },
  '.menu-overlay__nav a:nth-child(2)': { en: 'About <span>02</span>', es: 'Nosotros <span>02</span>' },
  '.menu-overlay__nav a:nth-child(3)': { en: 'University <span>03</span>', es: 'Universidad <span>03</span>' },
  '.menu-overlay__nav a:nth-child(4)': { en: 'Works <span>04</span>', es: 'Trabajos <span>04</span>' },
  '.menu-overlay__nav a:nth-child(5)': { en: 'Services <span>05</span>', es: 'Servicios <span>05</span>' },
  '.menu-overlay__nav a:nth-child(6)': { en: 'Projects <span>06</span>', es: 'Proyectos <span>06</span>' },
  '.menu-overlay__nav a:nth-child(7)': { en: '<em>Blog</em> <span>07</span>', es: '<em>Blog</em> <span>07</span>' },
  '.menu-overlay__nav a:nth-child(8)': { en: 'Contact <span>08</span>', es: 'Contacto <span>08</span>' },
  '.menu-overlay__foot span:nth-child(2)': { en: 'Based in Argentina — Mexico, working worldwide', es: 'Con base en Argentina — México, trabajando en todo el mundo' },

  '.quick-panel__title': { en: 'Quick <em>Index</em>', es: 'Índice <em>Rápido</em>' },
  '.quick-panel__sub': { en: 'South Hustles — creative studio', es: 'South Hustles — estudio creativo' },
  '.quick-panel__section-title:nth-of-type(1)': { en: 'Index', es: 'Índice' },
  '.quick-panel__section-title:nth-of-type(2)': { en: 'Latest projects', es: 'Últimos proyectos' },
  '.quick-panel__section-title:nth-of-type(3)': { en: 'Preview', es: 'Vista previa' },
  '.quick-panel__index a:nth-child(1)': { en: '<span class="qp-num">01</span> Works <b>→</b>', es: '<span class="qp-num">01</span> Trabajos <b>→</b>' },
  '.quick-panel__index a:nth-child(2)': { en: '<span class="qp-num">02</span> University <b>→</b>', es: '<span class="qp-num">02</span> Universidad <b>→</b>' },
  '.quick-panel__index a:nth-child(3)': { en: '<span class="qp-num">03</span> Journal <b>→</b>', es: '<span class="qp-num">03</span> Diario <b>→</b>' },
  '.quick-panel__index a:nth-child(4)': { en: '<span class="qp-num">04</span> Contact <b>→</b>', es: '<span class="qp-num">04</span> Contacto <b>→</b>' },
  '.qp-card:nth-of-type(1) .qp-card__meta': { en: 'Development · 2024', es: 'Desarrollo · 2024' },
  '.qp-card:nth-of-type(3) .qp-card__meta': { en: 'Development · 2023', es: 'Desarrollo · 2023' },
  '.qp-slot span': { en: 'hands-mountain.glb — asset slot', es: 'hands-mountain.glb — espacio de asset' },
  '.quick-panel__foot': { en: 'Based in Argentina — Mexico, working worldwide', es: 'Con base en Argentina — México, trabajando en todo el mundo' },

  '.sh-hero__side': { en: 'Creative systems that expand culture.', es: 'Sistemas creativos que expanden la cultura.' },
  '.sh-hero__eyebrow': { en: 'South Hustles — Creative Studio · [01]', es: 'South Hustles — Estudio Creativo · [01]' },
  '.sh-giant': { en: 'Creative <em>Systems</em><br />for a <span class="holo-word">Conscious</span> Era', es: 'Sistemas <em>Creativos</em><br />para una <span class="holo-word">Era Consciente</span>' },
  '.sh-hero__scroll': { en: 'Scroll to explore ↓', es: 'Desplazate para explorar ↓' },
  '#hero .bg-note--right': { en: '<b>SH//</b> direction · technology · emotion — built as one living system.', es: '<b>SH//</b> dirección · tecnología · emoción — construido como un solo sistema vivo.' },

  '#live-system .eyebrow': { en: 'Live System <b>[02.a]</b>', es: 'Sistema Vivo <b>[02.a]</b>' },
  '.live-sys__constellation .live-sys__node:nth-of-type(1) text': { en: 'DIRECTION', es: 'DIRECCIÓN' },
  '.live-sys__constellation .live-sys__node:nth-of-type(2) text': { en: 'TECHNOLOGY', es: 'TECNOLOGÍA' },
  '.live-sys__constellation .live-sys__node:nth-of-type(3) text': { en: 'EMOTION', es: 'EMOCIÓN' },
  '.live-sys__constellation .live-sys__node:nth-of-type(4) text': { en: 'SYSTEMS', es: 'SISTEMAS' },
  '.live-sys__constellation .live-sys__node:nth-of-type(5) text': { en: 'CRAFT', es: 'OFICIO' },
  '.live-sys__constellation .live-sys__node:nth-of-type(6) text': { en: 'STUDIO', es: 'ESTUDIO' },
  '.live-sys__hud span:nth-child(1)': { en: 'SYS', es: 'SIS' },
  '.live-sys__hud b:nth-child(2)': { en: 'LIVE', es: 'VIVO' },
  '.live-sys__hud span:nth-child(3)': { en: 'MODE', es: 'MODO' },
  '.live-sys__hud b:nth-child(4)': { en: 'ADDITIVE', es: 'ADITIVO' },
  '.live-sys__card--dark h3': { en: 'How The Studio Runs', es: 'Cómo Funciona El Estudio' },
  '.live-sys__card--dark .lede': { en: 'Every project starts as a system: rules, motions and visuals that grow with the culture it speaks to — not a one-off campaign.', es: 'Cada proyecto arranca como un sistema: reglas, movimientos y visuales que crecen con la cultura a la que le habla — no una campaña de una sola vez.' },
  '.live-sys__card--dark .live-sys__tags span:nth-child(1)': { en: 'Direction', es: 'Dirección' },
  '.live-sys__card--dark .live-sys__tags span:nth-child(2)': { en: 'Technology', es: 'Tecnología' },
  '.live-sys__card--dark .live-sys__tags span:nth-child(3)': { en: 'Emotion', es: 'Emoción' },
  '.live-sys__card--light .live-sys__kicker': { en: 'Workflow <b>→</b>', es: 'Flujo de Trabajo <b>→</b>' },
  '.live-sys__card--light h3': { en: 'From Brief To Living System', es: 'Del Brief Al Sistema Vivo' },
  '.live-sys__card--light p': { en: 'Prototype fast, ship living systems, teach the methods behind them — direction, technology and emotion move as one continuous gesture.', es: 'Prototipamos rápido, lanzamos sistemas vivos, enseñamos los métodos detrás de ellos — dirección, tecnología y emoción se mueven como un solo gesto continuo.' },
  '.live-sys__stats div:nth-child(1) span': { en: 'chapters / project', es: 'capítulos / proyecto' },
  '.live-sys__stats div:nth-child(2) span': { en: 'iterations', es: 'iteraciones' },
  '.live-sys__stats div:nth-child(3) span': { en: 'this system', es: 'este sistema' },

  '#statement-1 .sh-statement > span:nth-of-type(1)': { en: 'WE DESIGN <span class="outline">BRAND LANGUAGES</span>,', es: 'DISEÑAMOS <span class="outline">LENGUAJES DE MARCA</span>,' },
  '#statement-1 .sh-statement > span:nth-of-type(2)': { en: '<em>DIGITAL EXPERIENCES</em> AND', es: '<em>EXPERIENCIAS DIGITALES</em> Y' },
  '#statement-1 .sh-statement > span:nth-of-type(3)': { en: '<span class="font-swap type-erase" data-swap>GENERATIVE VISUALS</span> THAT', es: '<span class="font-swap type-erase" data-swap>VISUALES GENERATIVOS</span> QUE' },
  '#statement-1 .sh-statement > span:nth-of-type(4)': { en: 'CONNECT <span class="outline">ART</span> WITH DATA,', es: 'CONECTAN EL <span class="outline">ARTE</span> CON LOS DATOS,' },
  '#statement-1 .sh-statement > span:nth-of-type(5)': { en: 'HUMAN TOUCH WITH <em>ALGORITHMIC FLOW.</em>', es: 'EL TOQUE HUMANO CON EL <em>FLUJO ALGORÍTMICO.</em>' },
  '#statement-1 .sh-label': { en: 'Our Creative Ecosystem <b>[02]</b>', es: 'Nuestro Ecosistema Creativo <b>[02]</b>' },

  '#ecosystem .eco-card:nth-child(1) .eco-card__meta': { en: 'CREATIVE DIRECTION<br />BRANDING<br />ADVERTISING<br />WEB DEVELOPMENT', es: 'DIRECCIÓN CREATIVA<br />BRANDING<br />PUBLICIDAD<br />DESARROLLO WEB' },
  '#ecosystem .eco-card:nth-child(2) .eco-card__meta': { en: 'VISUAL PROGRAMMING<br />TOUCH DESIGNER<br />PLUG-INS<br />CREATIVE CODING', es: 'PROGRAMACIÓN VISUAL<br />TOUCH DESIGNER<br />PLUG-INS<br />PROGRAMACIÓN CREATIVA' },
  '#ecosystem .eco-card:nth-child(3) .eco-card__meta': { en: 'WHERE WE TEACH THE METHODS<br />BEHIND THE AGENCY AND SYSTEM.', es: 'DONDE ENSEÑAMOS LOS MÉTODOS<br />DETRÁS DE LA AGENCIA Y EL SISTEMA.' },

  '#about .eyebrow': { en: 'The Studio · [03]', es: 'El Estudio · [03]' },
  '.sh-story-lead': { en: 'We believe every project has a story to tell — and a system worth building.', es: 'Creemos que cada proyecto tiene una historia para contar — y un sistema que vale la pena construir.' },
  '.sh-editorial > div:nth-child(1) h3': { en: 'What we are thinking of', es: 'En qué estamos pensando' },
  '.sh-editorial > div:nth-child(1) p:nth-child(2)': { en: 'We design brand languages and living digital experiences where direction meets code. Every South Hustles project starts as a system: a set of rules, motions and visuals that can grow with the culture it speaks to.', es: 'Diseñamos lenguajes de marca y experiencias digitales vivas donde la dirección se encuentra con el código. Cada proyecto de South Hustles arranca como un sistema: un conjunto de reglas, movimientos y visuales que puede crecer con la cultura a la que le habla.' },
  '.sh-editorial > div:nth-child(1) p:nth-child(3)': { en: 'Art with data. Human touch with algorithmic flow. We treat the studio as a laboratory — testing, breaking and refining until the work belongs to the future.', es: 'Arte con datos. Toque humano con flujo algorítmico. Tratamos al estudio como un laboratorio — probando, rompiendo y refinando hasta que el trabajo pertenece al futuro.' },
  '.sh-editorial > div:nth-child(2) h3': { en: 'Our approach made easy', es: 'Nuestro enfoque, simplificado' },
  '.sh-editorial > div:nth-child(2) p:nth-child(2)': { en: 'Direction, technology and emotion are not three departments — they are one continuous gesture. We prototype fast, ship living systems, and teach the methods behind them.', es: 'Dirección, tecnología y emoción no son tres departamentos — son un solo gesto continuo. Prototipamos rápido, lanzamos sistemas vivos, y enseñamos los métodos detrás de ellos.' },
  '.sh-editorial > div:nth-child(2) p:nth-child(3)': { en: 'Based in Argentina and Mexico, working worldwide, building creative systems for a conscious era.', es: 'Con base en Argentina y México, trabajando en todo el mundo, construyendo sistemas creativos para una era consciente.' },
  '#about .bg-note': { en: '<b>note//</b> the studio is the method — not the deliverable.', es: '<b>nota//</b> el estudio es el método — no el entregable.' },

  '#studio-manifesto .sh-label': { en: 'The Studio <b>[03.b]</b>', es: 'El Estudio <b>[03.b]</b>' },
  '.manif__lede': { en: 'South Hustles is a <em>creative studio</em> for a conscious era. We merge direction, technology and emotion into systems that keep producing culture after we ship them — born between the sierra and the sea, built for everywhere.', es: 'South Hustles es un <em>estudio creativo</em> para una era consciente. Fusionamos dirección, tecnología y emoción en sistemas que siguen produciendo cultura después de que los lanzamos — nacido entre la sierra y el mar, construido para todos lados.' },
  '.manif__col:nth-child(1) h3': { en: 'What we believe', es: 'En qué creemos' },
  '.manif__col:nth-child(2) h3': { en: 'How we work', es: 'Cómo trabajamos' },
  '.manif__col:nth-child(3) h3': { en: 'Who we teach', es: 'A quién le enseñamos' },
  '#studio-manifesto .bg-note': { en: '<b>NOTE//</b> precision is a feeling — open me.', es: '<b>NOTA//</b> la precisión es un sentimiento — abrime.' },
  '.manif__col:nth-child(1) h3': { en: 'What we believe', es: 'En qué creemos' },
  '.manif__col:nth-child(1) p': { en: `Brands are living systems, not artifacts. If it can't evolve without us, we haven't finished the job. Every identity we build carries its own rules for breaking its rules.`, es: 'Las marcas son sistemas vivos, no artefactos. Si no puede evolucionar sin nosotros, no terminamos el trabajo. Cada identidad que construimos lleva sus propias reglas para romper sus reglas.' },
  '.manif__col:nth-child(2) p': { en: 'Direction first, pixels last. Async by default, present when it matters. One system per problem, documented so hard it teaches itself. Additive only — we never tear down what works.', es: 'Primero la dirección, últimos los píxeles. Async por defecto, presentes cuando importa. Un sistema por problema, documentado tan a fondo que se enseña solo. Solo aditivo — nunca tiramos abajo lo que funciona.' },
  '.manif__col:nth-child(3) p': { en: 'Everyone who asks. The University shares the methods behind the agency and the system — because students break our tools in ways that improve them, and the best ones never really leave.', es: 'A todos los que preguntan. La Universidad comparte los métodos detrás de la agencia y el sistema — porque los estudiantes rompen nuestras herramientas de maneras que las mejoran, y los mejores nunca se van del todo.' },
  '.mt-beat:nth-child(1) p': { en: 'First hustle — a borrowed laptop, a music video, a name that stuck.', es: 'Primer hustle — una laptop prestada, un videoclip, un nombre que quedó.' },
  '.mt-beat:nth-child(2) p': { en: 'The studio forms: direction + code under one roof for the first time.', es: 'Nace el estudio: dirección + código bajo un mismo techo por primera vez.' },
  '.mt-beat:nth-child(3) p': { en: 'Global reach — first worldwide clients, first system that outlived its campaign.', es: 'Alcance global — primeros clientes internacionales, primer sistema que sobrevivió a su campaña.' },
  '.mt-beat:nth-child(4) p': { en: 'CUSA System is born: our TouchDesigner practice becomes shippable instruments.', es: 'Nace CUSA System: nuestra práctica de TouchDesigner se vuelve instrumentos listos para entregar.' },
  '.mt-beat:nth-child(5) .mt-year': { en: 'NOW', es: 'HOY' },
  '.mt-beat:nth-child(5) p': { en: 'Tandil, Córdoba, La Saladita, Tulum → worldwide. Agency, system and university running as one ecosystem.', es: 'Tandil, Córdoba, La Saladita, Tulum → todo el mundo. Agencia, sistema y universidad funcionando como un solo ecosistema.' },

  '#work .sh-label': { en: 'Selected Projects <b>[04]</b>', es: 'Proyectos Seleccionados <b>[04]</b>' },
  '.projects-preview span': { en: 'PREVIEW', es: 'VISTA PREVIA' },
  '.project-row[data-preview="AGENCY.GIF"] .project-row__col:nth-child(3)': { en: 'CreativeAgency', es: 'Agencia Creativa' },
  '.project-row[data-preview="DATA-SYMPHONY.GIF"] .project-row__col:nth-child(3)': { en: 'Development', es: 'Desarrollo' },
  '.project-row[data-preview="CODECRAFT.GIF"] .project-row__col:nth-child(3)': { en: 'Development', es: 'Desarrollo' },
  '.project-row[data-preview="PIXEL-PERFECT.GIF"] .project-row__col:nth-child(3)': { en: 'Design', es: 'Diseño' },
  '.project-row[data-preview="MOTION-ATLAS.GIF"] .project-row__col:nth-child(3)': { en: 'Development', es: 'Desarrollo' },
  '.discover-btn': { en: 'Discover Now →', es: 'Descubrí Ahora →' },

  '#transmission .eyebrow': { en: 'Transmission <b>[05.pre]</b>', es: 'Transmisión <b>[05.pre]</b>' },
  '.transmission__gray': { en: 'Everything the studio learns building systems flows downhill — into courses, open rigs and field notes. The agency feeds the school; the school sharpens the agency. Nothing we know stays locked in a client deck.', es: 'Todo lo que el estudio aprende construyendo sistemas fluye cuesta abajo — a cursos, rigs abiertos y notas de campo. La agencia alimenta a la escuela; la escuela afila a la agencia. Nada de lo que sabemos queda encerrado en un deck de cliente.' },
  '.transmission__strip:nth-child(1) span': { en: 'Direction becomes curriculum', es: 'La dirección se vuelve currícula' },
  '.transmission__strip:nth-child(2) span': { en: 'Rigs become open tools', es: 'Los rigs se vuelven herramientas abiertas' },
  '.transmission__strip:nth-child(3) span': { en: 'Process becomes field notes', es: 'El proceso se vuelve notas de campo' },
  '.transmission__strip:nth-child(4) span': { en: 'Students become the studio', es: 'Los estudiantes se vuelven el estudio' },

  '#ig-feed .sh-label': { en: 'From The Feed <b>[04.d]</b>', es: 'Desde El Feed <b>[04.d]</b>' },
  '.ig-lede': { en: 'Every drop is a <em>system in miniature</em> — reactive rigs, brand loops and generative posters, shipped to the feed before they scale to clients.', es: 'Cada drop es un <em>sistema en miniatura</em> — rigs reactivos, loops de marca y posters generativos, lanzados al feed antes de escalar a clientes.' },
  '.ig-card--wide .ig-card__kicker': { en: 'DROP · 01 — REEL', es: 'DROP · 01 — REEL' },
  '.ig-card--wide h3': { en: 'Reactive Systems, Live', es: 'Sistemas Reactivos, En Vivo' },
  '.ig-bento .ig-card:nth-child(2) h3': { en: 'Brand Loop 001', es: 'Loop de Marca 001' },
  '.ig-bento .ig-card:nth-child(3) h3': { en: 'Generative Poster Series', es: 'Serie de Pósters Generativos' },
  '.ig-follow': { en: 'Follow the system — @south.hustles', es: 'Seguí el sistema — @south.hustles' },

  '.reel__head .sh-label': { en: 'The Reel <b>[04.a]</b>', es: 'El Reel <b>[04.a]</b>' },
  '.reel__hint': { en: 'SCROLL → THE ROOM MOVES SIDEWAYS', es: 'SCROLL → EL CUARTO SE MUEVE DE COSTADO' },
  '.reel__track .reel-panel:nth-child(1) .reel-panel__big': { en: 'WE KEEP<br /><span class="outline">MOVING</span>', es: 'SEGUIMOS<br /><span class="outline">EN MOVIMIENTO</span>' },
  '.reel__track .reel-panel:nth-child(1) .reel-panel__cap': { en: 'DIRECTION · TECHNOLOGY · EMOTION', es: 'DIRECCIÓN · TECNOLOGÍA · EMOCIÓN' },
  '.reel-panel__quote': { en: `Systems that don't just look advanced — they <em>belong</em> to the future.<footer>— STUDIO NOTES, GENEVA</footer>`, es: 'Sistemas que no solo se ven avanzados — <em>pertenecen</em> al futuro.<footer>— NOTAS DEL ESTUDIO, GENEVA</footer>' },
  '.reel__track .reel-panel:nth-child(3) .reel-panel__cap': { en: 'FROM THE STICKER ROOM', es: 'DESDE EL STICKER ROOM' },
  '.reel__track .reel-panel:nth-child(5) .reel-panel__big': { en: 'HUMAN <em>touch</em><br /><span class="outline">ALGORITHMIC</span> FLOW', es: 'TOQUE <em>humano</em><br /><span class="outline">FLUJO</span> ALGORÍTMICO' },
  '.reel__track .reel-panel:nth-child(5) .reel-panel__cap': { en: 'THE METHOD BEHIND EVERYTHING', es: 'EL MÉTODO DETRÁS DE TODO' },
  '.reel__track .reel-panel:nth-child(6) .reel-panel__cap': { en: 'CREATIVE STUDIO — EST. 2012', es: 'ESTUDIO CREATIVO — DESDE 2012' },

  '.sticker-hint': { en: '<span class="mono">STICKER ROOM //</span> drag them, <em>they fight back.</em>', es: '<span class="mono">STICKER ROOM //</span> arrastralos, <em>se defienden.</em>' },

  '.mq-menu__word[data-icon="SVC"]': { en: 'SERVICES', es: 'SERVICIOS' },
  '.mq-menu__word[data-icon="BLG"]': { en: 'BLOG', es: 'BLOG' },
  '.mq-menu__word[data-icon="CNT"]': { en: 'CONTACT', es: 'CONTACTO' },
  '.mq-menu__word[data-icon="PRJ"]': { en: 'PROJECTS', es: 'PROYECTOS' },
  '.mq-menu__word[data-icon="ABT"]': { en: 'ABOUT', es: 'NOSOTROS' },

  '#statement-2 .sh-statement': {
    en: 'WE MERGE <span class="outline">DIRECTION</span>, TECHNOLOGY AND <em>EMOTION</em> TO BUILD EXPERIENCES THAT <em>LIVE</em> IN DIGITAL SPACE.',
    es: 'FUSIONAMOS LA <span class="outline">DIRECCIÓN</span>, LA TECNOLOGÍA Y LA <em>EMOCIÓN</em> PARA CREAR EXPERIENCIAS QUE <em>VIVEN</em> EN EL ESPACIO DIGITAL.',
  },

  '.sh2-magnetic-copy .sh2-three-giant': { en: 'A FIELD THAT <em>RESPONDS</em>', es: 'UN CAMPO QUE <em>RESPONDE</em>' },
  '.sh2-magnetic-copy .sh2-three-lede': { en: 'Six thousand particles hold formation until you move. The system bends around your cursor — then settles back into place. Interfaces should behave the same way.', es: 'Seis mil partículas mantienen la formación hasta que te movés. El sistema se dobla alrededor de tu cursor — y después vuelve a su lugar. Las interfaces deberían comportarse igual.' },
  '.sh2-gravity-copy .sh2-three-giant': { en: 'WORK IN <em>ZERO GRAVITY</em>', es: 'TRABAJOS EN <em>GRAVEDAD CERO</em>' },
  '.sh2-gravity-copy .sh2-three-note': { en: '14 frames · fibonacci-sphere spread · parallax ×3 — <b>hover one</b>', es: '14 cuadros · esfera fibonacci · parallax ×3 — <b>pasá por uno</b>' },

  '.case__kicker': { en: 'CASE STUDY <b>[04.b]</b> · <em>an identity that listens</em>', es: 'CASO DE ESTUDIO <b>[04.b]</b> · <em>una identidad que escucha</em>' },
  '.case__meta span:nth-child(1)': { en: 'CLIENT — CONCERT HALL, GENEVA', es: 'CLIENTE — SALA DE CONCIERTOS, GENEVA' },
  '.case__meta span:nth-child(2)': { en: 'YEAR — 2022 · MARCEL · JULY', es: 'AÑO — 2022 · MARCEL · JULIO' },
  '.case__meta span:nth-child(3)': { en: 'VECTORS — DEVELOPMENT · GENERATIVE · IDENTITY', es: 'VECTORES — DESARROLLO · GENERATIVO · IDENTIDAD' },
  '.case__epigraph': { en: '« Forty years of programmes, four thousand concerts, one question: what does a season <em>look</em> like? »', es: '« Cuarenta años de programas, cuatro mil conciertos, una pregunta: ¿cómo se <em>ve</em> una temporada? »' },
  '#case-study > div:nth-of-type(2) .case__num': { en: '01 — THE BRIEF', es: '01 — EL BRIEF' },
  '#case-study > div:nth-of-type(2) .case__big': { en: 'THE HALL WANTED ITS <em>music</em> TO BE SEEN BEFORE IT WAS HEARD.', es: 'LA SALA QUERÍA QUE SU <em>música</em> SE VIERA ANTES DE ESCUCHARSE.' },
  '#case-study > div:nth-of-type(2) .case__body': { en: 'Their archive held every programme since 1982 — composers, keys, durations, applause lengths. Data nobody had ever looked at twice. Our brief: turn that archive into the visual identity of the coming season.', es: 'Su archivo guardaba cada programa desde 1982 — compositores, tonalidades, duraciones, largos de aplausos. Datos que nadie había mirado dos veces. Nuestro brief: convertir ese archivo en la identidad visual de la temporada entrante.' },
  '#case-study > div:nth-of-type(2) figcaption': { en: 'FIG.01 — the raw archive, 1982–2022, before the system touched it.', es: 'FIG.01 — el archivo crudo, 1982–2022, antes de que el sistema lo tocara.' },
  '.case__banner-word': { en: 'LISTENING&nbsp;WITH&nbsp;YOUR&nbsp;EYES', es: 'ESCUCHANDO&nbsp;CON&nbsp;LOS&nbsp;OJOS' },
  '#case-study > div:nth-of-type(4) .case__num': { en: '02 — THE SYSTEM', es: '02 — EL SISTEMA' },
  '#case-study > div:nth-of-type(4) .case__big': { en: 'A TOUCHDESIGNER NETWORK THAT <em>composes</em> LIKE THE ORCHESTRA.', es: 'UNA RED DE TOUCHDESIGNER QUE <em>compone</em> COMO LA ORQUESTA.' },
  '#case-study > div:nth-of-type(4) .case__body': { en: 'Audio analysis drives geometry: key signatures choose palettes, tempo bends the grid, applause length decides how long a frame survives. 40,000 generated frames — curated by hand, red marker on printouts, taste over stamina.', es: 'El análisis de audio maneja la geometría: las tonalidades eligen paletas, el tempo dobla la grilla, el largo del aplauso decide cuánto sobrevive un cuadro. 40.000 cuadros generados — curados a mano, marcador rojo sobre impresiones, gusto sobre resistencia.' },
  '#case-study > div:nth-of-type(4) figcaption': { en: 'FIG.03 — the network. every operator is a musician that never tires.', es: 'FIG.03 — la red. cada operador es un músico que nunca se cansa.' },
  '.case__stats div:nth-child(1) span': { en: 'frames generated', es: 'cuadros generados' },
  '.case__stats div:nth-child(2) span': { en: 'concerts mapped', es: 'conciertos mapeados' },
  '.case__stats div:nth-child(3) span': { en: 'living identity', es: 'identidad viva' },
  '.case__stats div:nth-child(4) span': { en: 'seasons it can score', es: 'temporadas que puede musicalizar' },
  '#case-study > div:nth-of-type(6) .case__num': { en: '03 — THE OUTPUT', es: '03 — LA SALIDA' },
  '#case-study > div:nth-of-type(6) .case__big': { en: `EVERY NIGHT'S POSTER IS <em>played</em>, NOT DESIGNED.`, es: 'EL PÓSTER DE CADA NOCHE SE <em>toca</em>, NO SE DISEÑA.' },
  '#case-study > div:nth-of-type(6) .case__body': { en: `The season launched with posters, tickets and façade projections all rendered from the same system — each night unique, all nights unmistakably one voice. The identity now belongs to the hall's own team: they play it, we tuned it.`, es: 'La temporada se lanzó con pósters, entradas y proyecciones de fachada renderizados desde el mismo sistema — cada noche única, todas las noches inconfundiblemente una sola voz. La identidad ahora es del equipo de la sala: ellos la tocan, nosotros la afinamos.' },
  '.case__fullmoment-big': { en: 'THE SYSTEM<br/>TAKES THE <em>stage</em>', es: 'EL SISTEMA<br/>TOMA EL <em>escenario</em>' },
  '.case__others .sh-label': { en: 'More Dossiers <b>[04.c]</b>', es: 'Más Dossiers <b>[04.c]</b>' },
  '.case__other:nth-child(1) .mono-note': { en: '// dev diaries as a brand', es: '// diarios de dev como marca' },
  '.case__other:nth-child(2) .mono-note': { en: '// a grid you can feel', es: '// una grilla que se siente' },
  '.case__other:nth-child(3) .mono-note': { en: '// portraits the model dreamt', es: '// retratos que soñó el modelo' },
  '.case__other:nth-child(4) .mono-note': { en: '// choreography for cursors', es: '// coreografía para cursores' },

  '#journal .wrap > .sh-label': { en: 'Field Notes <b>[07]</b> — <em>read · paint · mark</em>', es: 'Notas de Campo <b>[07]</b> — <em>leé · pintá · marcá</em>' },
  '.dna-strip-wrap .sh-label': { en: 'Your DNA <b>[07.b]</b> <span class="mono-note">// what you marked, kept</span>', es: 'Tu ADN <b>[07.b]</b> <span class="mono-note">// lo que marcaste, guardado</span>' },
  '.dna-empty': { en: 'Nothing marked yet. Open a note and highlight a phrase, or paint over a page.', es: 'Todavía no marcaste nada. Abrí una nota y resaltá una frase, o pintá sobre una página.' },
  '.journal-lede': { en: 'Open a note. Highlight what resonates with the mouse. Arm a tool and paint over the page — marker, fineliner, spray or eraser. Everything you mark feeds the <b>DNA strip</b> below. <span class="mono-note">// backend sync coming soon</span>', es: 'Abrí una nota. Resaltá lo que resuena con el mouse. Armá una herramienta y pintá sobre la página — marcador, fineliner, aerosol o goma. Todo lo que marcás alimenta la <b>tira de ADN</b> de abajo. <span class="mono-note">// sync con backend próximamente</span>' },
  '[data-card-id="creative-systems"] .jc-title': { en: 'Creative Systems, Not Campaigns', es: 'Sistemas Creativos, No Campañas' },
  '[data-card-id="creative-systems"] .jc-teaser': { en: 'Why we build living structures instead of one-off deliverables.', es: 'Por qué construimos estructuras vivas en vez de entregables de una sola vez.' },
  '[data-card-id="touchdesigner-pipelines"] .jc-title': { en: 'TouchDesigner As A Drawing Hand', es: 'TouchDesigner Como Mano Que Dibuja' },
  '[data-card-id="touchdesigner-pipelines"] .jc-teaser': { en: 'Visual programming pipelines from the CUSA System practice.', es: 'Pipelines de programación visual de la práctica CUSA System.' },
  '[data-card-id="branding-rituals"] .jc-title': { en: 'Branding Is A Ritual, Not A Logo', es: 'El Branding Es Un Ritual, No Un Logo' },
  '[data-card-id="branding-rituals"] .jc-teaser': { en: 'The repeatable acts that make identity stick.', es: 'Los actos repetibles que hacen que la identidad quede.' },
  '[data-card-id="generative-art"] .jc-title': { en: 'Art With Data, Touch With Flow', es: 'Arte Con Datos, Toque Con Flujo' },
  '[data-card-id="generative-art"] .jc-teaser': { en: 'Where the human hand meets the algorithm — and who leads.', es: 'Donde la mano humana se encuentra con el algoritmo — y quién lidera.' },
  '[data-card-id="teaching-methods"] .jc-title': { en: 'Teaching The Method Behind The Magic', es: 'Enseñar El Método Detrás De La Magia' },
  '[data-card-id="teaching-methods"] .jc-teaser': { en: 'Visualizing Wisdom — why we open-source our process.', es: 'Visualizing Wisdom — por qué abrimos nuestro proceso.' },
  '[data-card-id="geneva-worldwide"] .jc-title': { en: 'Based In The Sierra And The Sea', es: 'Con Base En La Sierra Y El Mar' },
  '[data-card-id="geneva-worldwide"] .jc-teaser': { en: 'Running a worldwide studio from Tandil, Córdoba, La Saladita and Tulum.', es: 'Cómo llevar un estudio mundial desde Tandil, Córdoba, La Saladita y Tulum.' },
  '.jc-open': { en: 'OPEN →', es: 'ABRIR →' },

  '.perspective-text': { en: `WE COMBINE ARTISTIC <em>INTUITION</em> WITH TECHNOLOGICAL PRECISION TO CREATE VISUAL SYSTEMS THAT DON'T JUST LOOK ADVANCED, THEY <em>BELONG TO THE FUTURE.</em>`, es: 'COMBINAMOS LA <em>INTUICIÓN</em> ARTÍSTICA CON LA PRECISIÓN TECNOLÓGICA PARA CREAR SISTEMAS VISUALES QUE NO SOLO SE VEN AVANZADOS, SINO QUE <em>PERTENECEN AL FUTURO.</em>' },

  '#university .sh-label': { en: 'Visualizing Wisdom · University <b>[05]</b>', es: 'Visualizing Wisdom · Universidad <b>[05]</b>' },
  '.uni-lead': { en: 'Where we teach the methods behind the agency <em>and system.</em> Expert-led courses, engaging workshops and inspiring resources.', es: 'Donde enseñamos los métodos detrás de la agencia <em>y el sistema.</em> Cursos guiados por expertos, talleres que enganchan y recursos que inspiran.' },
  '.uni-tile--red .uni-tile__title': { en: 'Reactive Design Impact', es: 'Impacto del Diseño Reactivo' },
  '.uni-tile--red .uni-tile__type': { en: 'Expert-led course', es: 'Curso guiado por expertos' },
  '.uni-tile--amber .uni-tile__title': { en: 'Power Designs Impact', es: 'Impacto de Diseños con Poder' },
  '.uni-tile--amber .uni-tile__type': { en: 'Engaging workshop', es: 'Taller que engancha' },
  '.uni-tile--green .uni-tile__title': { en: 'TouchDesigner Systems', es: 'Sistemas TouchDesigner' },
  '.uni-tile--green .uni-tile__type': { en: 'Inspiring resource', es: 'Recurso que inspira' },
  '.uni-tile--blue .uni-tile__title': { en: 'Generative Brand Craft', es: 'Oficio Generativo de Marca' },
  '.uni-tile--blue .uni-tile__type': { en: 'Expert-led course', es: 'Curso guiado por expertos' },

  '#systems .sh-label': { en: 'Methods &amp; Tools <b>[06]</b>', es: 'Métodos y Herramientas <b>[06]</b>' },
  '.glass-grid .glass-card:nth-child(1) .glass-card__title': { en: 'Creative Direction', es: 'Dirección Creativa' },
  '.glass-grid .glass-card:nth-child(1) .glass-card__sub': { en: 'DIRECTION · STORY', es: 'DIRECCIÓN · HISTORIA' },
  '.glass-grid .glass-card:nth-child(1) .glass-card__data p': { en: 'We set the narrative before a single pixel moves — tone, pacing, the arc a brand follows across every touchpoint.', es: 'Definimos la narrativa antes de que se mueva un solo píxel — tono, ritmo, el arco que una marca sigue en cada punto de contacto.' },
  '.glass-grid .glass-card:nth-child(2) .glass-card__sub': { en: 'VISUAL PROGRAMMING', es: 'PROGRAMACIÓN VISUAL' },
  '.glass-grid .glass-card:nth-child(2) .glass-card__data p': { en: 'Real-time visual programming for installations, live sets and generative brand assets — nodes instead of timelines.', es: 'Programación visual en tiempo real para instalaciones, sets en vivo y assets de marca generativos — nodos en vez de timelines.' },
  '.glass-grid .glass-card:nth-child(3) .glass-card__title': { en: 'Web Development', es: 'Desarrollo Web' },
  '.glass-grid .glass-card:nth-child(3) .glass-card__sub': { en: 'SYSTEMS · CODE', es: 'SISTEMAS · CÓDIGO' },
  '.glass-grid .glass-card:nth-child(3) .glass-card__data p': { en: `Hand-built front-ends, no bloated framework where it isn't earning its keep — fast, accessible, built to last.`, es: 'Front-ends hechos a mano, sin frameworks inflados que no se ganan su lugar — rápidos, accesibles, hechos para durar.' },
  '.glass-grid .glass-card:nth-child(4) .glass-card__title': { en: 'Creative Coding', es: 'Programación Creativa' },
  '.glass-grid .glass-card:nth-child(4) .glass-card__sub': { en: 'GENERATIVE · SHADERS', es: 'GENERATIVO · SHADERS' },
  '.glass-grid .glass-card:nth-child(4) .glass-card__data p': { en: 'Shaders, particle systems and procedural motion — code as a design material, not just plumbing.', es: 'Shaders, sistemas de partículas y movimiento procedural — el código como material de diseño, no solo plomería.' },
  '.glass-grid .glass-card:nth-child(5) .glass-card__sub': { en: 'IDENTITY · LANGUAGE', es: 'IDENTIDAD · LENGUAJE' },
  '.glass-grid .glass-card:nth-child(5) .glass-card__data p': { en: 'Identity systems that flex — a mark, a voice and a set of rules a team can actually run with.', es: 'Sistemas de identidad que flexionan — una marca, una voz y reglas que un equipo puede usar de verdad.' },
  '.glass-grid .glass-card:nth-child(6) .glass-card__title': { en: 'Advertising', es: 'Publicidad' },
  '.glass-grid .glass-card:nth-child(6) .glass-card__sub': { en: 'CAMPAIGN · MOTION', es: 'CAMPAÑA · MOVIMIENTO' },
  '.glass-grid .glass-card:nth-child(6) .glass-card__data p': { en: 'Campaigns built to move — media planning and motion design that earns attention instead of interrupting it.', es: 'Campañas hechas para moverse — motion design que se gana la atención en vez de interrumpirla.' },

  '#contact .sh-label': { en: 'Start A Project <b>[08]</b>', es: 'Empezá Un Proyecto <b>[08]</b>' },
  '.contact-lede': { en: `Tell us what you're building. Pick a budget, mark your vectors, and we answer within <em>48 hours</em>.`, es: 'Contanos qué estás construyendo. Elegí un presupuesto, marcá tus vectores, y te respondemos en <em>48 horas</em>.' },
  'label[for="cf-name"]': { en: 'Your name', es: 'Tu nombre' },
  '.cf-error': { en: 'needs a real email', es: 'necesita un email real' },
  'fieldset.cf-group:nth-of-type(1) > legend': { en: 'Budget <span class="mono-note">// CHF</span>', es: 'Presupuesto <span class="mono-note">// CHF</span>' },
  'fieldset.cf-group:nth-of-type(2) > legend': { en: 'Vectors <span class="mono-note">// mark all that apply</span>', es: 'Vectores <span class="mono-note">// marcá todos los que apliquen</span>' },
  '.cf-chips .cf-chip:nth-child(1) span': { en: 'Creative Direction', es: 'Dirección Creativa' },
  '.cf-chips .cf-chip:nth-child(3) span': { en: 'Web Development', es: 'Desarrollo Web' },
  '.cf-chips .cf-chip:nth-child(4) span': { en: 'Creative Coding', es: 'Programación Creativa' },
  '.cf-chips .cf-chip:nth-child(6) span': { en: 'University', es: 'Universidad' },
  'label[for="cf-msg"]': { en: 'The project', es: 'El proyecto' },
  '.cf-summary': { en: '> pick your vectors…', es: '> elegí tus vectores…' },
  '.cf-submit': { en: 'SEND IT →', es: 'ENVIALO →' },
  '.cf-success__big': { en: 'RECEIVED.', es: 'RECIBIDO.' },
  '.cf-success p': { en: 'We answer in 48h. Or jump the queue:', es: 'Respondemos en 48h. O saltate la fila:' },

  '.pixelated-block h3': { en: 'Pixelated <em>everything</em>', es: 'Todo <em>pixelado</em>' },
  '.pixelated-block__body': { en: 'Every asset — a poster, a UI, a loading screen — gets pushed through the same grid until it reads as one language. Zoom in and the pixels tell you which studio made it.', es: 'Cada asset — un póster, una UI, una pantalla de carga — pasa por la misma grilla hasta leerse como un solo lenguaje. Hacé zoom y los píxeles te dicen qué estudio lo hizo.' },
  '.pixelated-block .mono': { en: `Explore the innovative 'Pixelated Everything' concept with our TouchDesigner plugin.`, es: `Explorá el concepto innovador 'Pixelated Everything' con nuestro plugin de TouchDesigner.` },
  '.pixelated-block .button:not(.button--primary)': { en: 'Button', es: 'Botón' },
  '.pixelated-block .button--primary': { en: 'Button ›', es: 'Botón ›' },

  '.footer-menu a:nth-child(1)': { en: 'SERVICES', es: 'SERVICIOS' },
  '.footer-menu a:nth-child(3)': { en: 'CONTACT', es: 'CONTACTO' },
  '.footer-menu a:nth-child(4)': { en: 'PROJECTS', es: 'PROYECTOS' },
  '.footer-menu a:nth-child(5)': { en: 'ABOUT', es: 'NOSOTROS' },
  '.footer-giant__type': { en: 'Create memorable <em>experiences</em> <b>together.</b>', es: 'Creemos <em>experiencias</em> memorables <b>juntos.</b>' },
  '.footer-news p': { en: 'Never miss out on the latest updates, trends, and inspirations. Subscribe to our newsletter and join us.', es: 'No te pierdas las últimas novedades, tendencias e inspiraciones. Suscribite a nuestro newsletter y sumate.' },
  'label[for="news-email"]': { en: 'Email address', es: 'Correo electrónico' },
  '.footer-news__form button[type="submit"]': { en: 'Subscribe', es: 'Suscribirme' },
  '.footer__tagline': { en: 'BASED IN ARGENTINA — MEXICO — WORKING WORLDWIDE', es: 'CON BASE EN ARGENTINA — MÉXICO — TRABAJANDO EN TODO EL MUNDO' },
  '.footer-trust div:nth-child(1) b': { en: 'AR·MX', es: 'AR·MX' },
  '.footer-trust div:nth-child(1) span': { en: 'Argentina — México', es: 'Argentina — México' },
  '.footer-trust div:nth-child(2) span': { en: 'Working worldwide', es: 'Trabajando en todo el mundo' },
  '.footer-trust div:nth-child(3) span': { en: 'Tandil · Córdoba · La Saladita · Tulum', es: 'Tandil · Córdoba · La Saladita · Tulum' },
  '.footer__grid > div:nth-child(1) > div:nth-of-type(2)': { en: 'creative studio — creative systems for a conscious era', es: 'estudio creativo — sistemas creativos para una era consciente' },
  '.footer__grid > div:nth-child(1) > div:nth-of-type(4)': { en: 'CP 5152, Argentina · CP 77760, México', es: 'CP 5152, Argentina · CP 77760, México' },
  '.footer__grid > div:nth-child(2) .footer__col-title': { en: 'Studio', es: 'Estudio' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(1) a': { en: 'Work', es: 'Trabajos' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(2) a': { en: 'Studio', es: 'Estudio' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(3) a': { en: 'Services', es: 'Servicios' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(4) a': { en: 'Contact', es: 'Contacto' },
  '.footer__grid > div:nth-child(3) .footer__col-title': { en: 'More', es: 'Más' },
  '.footer__grid > div:nth-child(3) .footer__links li:nth-child(1) a': { en: 'Terms', es: 'Términos' },
  '.footer__grid > div:nth-child(3) .footer__links li:nth-child(3) a': { en: 'University', es: 'Universidad' },
  '.footer__grid > div:nth-child(3) .footer__links li:nth-child(4) a': { en: 'Projects', es: 'Proyectos' },
  '.footer__copy': { en: '© South Hustles 2026 — Based in Argentina and Mexico, working worldwide.', es: '© South Hustles 2026 — Con base en Argentina y México, trabajando en todo el mundo.' }
};

function storedLang() {
  try {
    const l = localStorage.getItem(KEY);
    return l === 'es' || l === 'en' ? l : null;
  } catch {
    return null;
  }
}

export function setLang(next, persist = true) {
  const root = document.documentElement;

  Object.keys(DICT).forEach((sel) => {
    const entry = DICT[sel];
    if (!entry || !entry[next]) return;
    document.querySelectorAll(sel).forEach((el) => {
      el.innerHTML = entry[next];
    });
  });

  root.lang = next;
  root.dataset.lang = next;
  if (persist) {
    try { localStorage.setItem(KEY, next); } catch { /* privacy mode */ }
  }

  const btn = document.querySelector('[data-lang-toggle]');
  if (btn) {
    btn.textContent = next === 'es' ? 'ES' : 'EN';
    btn.setAttribute('aria-label', next === 'es' ? 'Switch to English' : 'Cambiar a español');
  }

  document.dispatchEvent(new CustomEvent('sh-lang-changed', { detail: { lang: next } }));
}

export function initI18n() {
  const initial = storedLang() || 'en';
  // only touch the DOM if the visitor already chose Spanish before —
  // English is the shipped default markup, so setting 'en' on a fresh
  // visit would just re-write every node to its own current text.
  if (initial !== 'en') setLang(initial, false);
  else {
    const btn = document.querySelector('[data-lang-toggle]');
    if (btn) btn.textContent = 'EN';
  }

  const btn = document.querySelector('[data-lang-toggle]');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.dataset.lang || 'en';
      setLang(cur === 'es' ? 'en' : 'es');
    });
  }
}
