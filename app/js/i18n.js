/* ═══════════════════════════════════════════
   I18N — ES/PT/EN cycle. Selector-driven (not
   data-i18n attributes): each DICT entry maps a CSS
   selector to { en, es, pt } innerHTML. Mirrors theme.js's
   persistence pattern (localStorage + no-flash-on-return
   via an early <head> snippet) and dispatches
   'sh-lang-changed' the same way theme.js dispatches
   'leo-theme-changed', so other modules can react.
   ═══════════════════════════════════════════ */

const KEY = 'sh-lang';
const LANGS = ['es', 'pt', 'en'];

// selector -> { en, es, pt } innerHTML. Scoped selectors (e.g. "#about .eyebrow")
// are used wherever a class repeats across multiple sections.
const DICT = {
  '.site-nav .nav a[href="#hero"]': { en: 'Home', es: 'Inicio', pt: 'Início' },
  '.site-nav .nav a[href="#about"]': { en: 'About', es: 'Nosotros', pt: 'Sobre' },
  '.site-nav .nav a[href="#university"]': { en: 'University', es: 'Universidad', pt: 'Universidade' },
  '.sh-nav__center span': { en: 'creative studio', es: 'estudio creativo', pt: 'estúdio criativo' },
  '.footer-hud__text': { en: 'AR · MEX — WORKING WORLDWIDE', es: 'AR · MEX — TRABAJO GLOBAL', pt: 'AR · MEX — TRABALHO GLOBAL' },
  '.pill-btn--works': { en: 'Works', es: 'Trabajos', pt: 'Trabalhos' },
  '.pill-btn--solid': { en: 'Menu', es: 'Menú', pt: 'Menu' },

  '.menu-overlay__close': { en: 'Close ✕', es: 'Cerrar ✕', pt: 'Fechar ✕' },
  '.menu-overlay__nav a:nth-child(1)': { en: 'Home <span>01</span>', es: 'Inicio <span>01</span>', pt: 'Início <span>01</span>' },
  '.menu-overlay__nav a:nth-child(2)': { en: 'About <span>02</span>', es: 'Nosotros <span>02</span>', pt: 'Sobre <span>02</span>' },
  '.menu-overlay__nav a:nth-child(3)': { en: 'University <span>03</span>', es: 'Universidad <span>03</span>', pt: 'Universidade <span>03</span>' },
  '.menu-overlay__nav a:nth-child(4)': { en: 'Works <span>04</span>', es: 'Trabajos <span>04</span>', pt: 'Trabalhos <span>04</span>' },
  '.menu-overlay__nav a:nth-child(5)': { en: 'Services <span>05</span>', es: 'Servicios <span>05</span>', pt: 'Serviços <span>05</span>' },
  '.menu-overlay__nav a:nth-child(6)': { en: 'Projects <span>06</span>', es: 'Proyectos <span>06</span>', pt: 'Projetos <span>06</span>' },
  '.menu-overlay__nav a:nth-child(7)': { en: '<em>Blog</em> <span>07</span>', es: '<em>Blog</em> <span>07</span>', pt: '<em>Blog</em> <span>07</span>' },
  '.menu-overlay__nav a:nth-child(8)': { en: 'Contact <span>08</span>', es: 'Contacto <span>08</span>', pt: 'Contato <span>08</span>' },
  '.menu-overlay__foot span:nth-child(2)': { en: 'Based in Argentina — Mexico, working worldwide', es: 'Con base en Argentina — México, trabajando en todo el mundo', pt: 'Sediados na Argentina — México, trabalhando no mundo todo' },

  '.quick-panel__title': { en: 'Quick <em>Index</em>', es: 'Índice <em>Rápido</em>', pt: 'Índice <em>Rápido</em>' },
  '.quick-panel__sub': { en: 'South Hustles — creative studio', es: 'South Hustles — estudio creativo', pt: 'South Hustles — estúdio criativo' },
  '.quick-panel__section-title:nth-of-type(1)': { en: 'Index', es: 'Índice', pt: 'Índice' },
  '.quick-panel__section-title:nth-of-type(2)': { en: 'Latest projects', es: 'Últimos proyectos', pt: 'Últimos projetos' },
  '.quick-panel__section-title:nth-of-type(3)': { en: 'Preview', es: 'Vista previa', pt: 'Prévia' },
  '.quick-panel__index a:nth-child(1)': { en: '<span class="qp-num">01</span> Works <b>→</b>', es: '<span class="qp-num">01</span> Trabajos <b>→</b>', pt: '<span class="qp-num">01</span> Trabalhos <b>→</b>' },
  '.quick-panel__index a:nth-child(2)': { en: '<span class="qp-num">02</span> University <b>→</b>', es: '<span class="qp-num">02</span> Universidad <b>→</b>', pt: '<span class="qp-num">02</span> Universidade <b>→</b>' },
  '.quick-panel__index a:nth-child(3)': { en: '<span class="qp-num">03</span> Journal <b>→</b>', es: '<span class="qp-num">03</span> Diario <b>→</b>', pt: '<span class="qp-num">03</span> Diário <b>→</b>' },
  '.quick-panel__index a:nth-child(4)': { en: '<span class="qp-num">04</span> Contact <b>→</b>', es: '<span class="qp-num">04</span> Contacto <b>→</b>', pt: '<span class="qp-num">04</span> Contato <b>→</b>' },
  '.qp-card:nth-of-type(1) .qp-card__meta': { en: 'Development · 2024', es: 'Desarrollo · 2024', pt: 'Desenvolvimento · 2024' },
  '.qp-card:nth-of-type(3) .qp-card__meta': { en: 'Development · 2023', es: 'Desarrollo · 2023', pt: 'Desenvolvimento · 2023' },
  '.qp-slot span': { en: 'hands-mountain.glb — asset slot', es: 'hands-mountain.glb — espacio de asset', pt: 'hands-mountain.glb — espaço de asset' },
  '.quick-panel__foot': { en: 'Based in Argentina — Mexico, working worldwide', es: 'Con base en Argentina — México, trabajando en todo el mundo', pt: 'Sediados na Argentina — México, trabalhando no mundo todo' },

  '.sh-hero__side': { en: 'Creative systems that expand culture.', es: 'Sistemas creativos que expanden la cultura.', pt: 'Sistemas criativos que expandem a cultura.' },
  '.sh-hero__eyebrow': { en: 'South Hustles — Creative Studio · [01]', es: 'South Hustles — Estudio Creativo · [01]', pt: 'South Hustles — Estúdio Criativo · [01]' },
  '.sh-giant': { en: 'Creative <em>Systems</em><br />for a <span class="holo-word">Conscious</span> Era', es: 'Sistemas <em>Creativos</em><br />para una <span class="holo-word">Era Consciente</span>', pt: 'Sistemas <em>Criativos</em><br />para uma <span class="holo-word">Era Consciente</span>' },
  '.sh-hero__scroll': { en: 'Scroll to explore ↓', es: 'Desplazate para explorar ↓', pt: 'Role para explorar ↓' },
  '#hero .bg-note--right': { en: '<b>SH//</b> direction · technology · emotion — built as one living system.', es: '<b>SH//</b> dirección · tecnología · emoción — construido como un solo sistema vivo.', pt: '<b>SH//</b> direção · tecnologia · emoção — construído como um único sistema vivo.' },

  '#live-system .eyebrow': { en: 'Live System <b>[02.a]</b>', es: 'Sistema Vivo <b>[02.a]</b>', pt: 'Sistema Vivo <b>[02.a]</b>' },
  '.live-sys__constellation .live-sys__node:nth-of-type(1) text': { en: 'DIRECTION', es: 'DIRECCIÓN', pt: 'DIREÇÃO' },
  '.live-sys__constellation .live-sys__node:nth-of-type(2) text': { en: 'TECHNOLOGY', es: 'TECNOLOGÍA', pt: 'TECNOLOGIA' },
  '.live-sys__constellation .live-sys__node:nth-of-type(3) text': { en: 'EMOTION', es: 'EMOCIÓN', pt: 'EMOÇÃO' },
  '.live-sys__constellation .live-sys__node:nth-of-type(4) text': { en: 'SYSTEMS', es: 'SISTEMAS', pt: 'SISTEMAS' },
  '.live-sys__constellation .live-sys__node:nth-of-type(5) text': { en: 'CRAFT', es: 'OFICIO', pt: 'OFÍCIO' },
  '.live-sys__constellation .live-sys__node:nth-of-type(6) text': { en: 'STUDIO', es: 'ESTUDIO', pt: 'ESTÚDIO' },
  '.live-sys__hud span:nth-child(1)': { en: 'SYS', es: 'SIS', pt: 'SIS' },
  '.live-sys__hud b:nth-child(2)': { en: 'LIVE', es: 'VIVO', pt: 'VIVO' },
  '.live-sys__hud span:nth-child(3)': { en: 'MODE', es: 'MODO', pt: 'MODO' },
  '.live-sys__hud b:nth-child(4)': { en: 'ADDITIVE', es: 'ADITIVO', pt: 'ADITIVO' },
  '.live-sys__card--dark h3': { en: 'How The Studio Runs', es: 'Cómo Funciona El Estudio', pt: 'Como O Estúdio Funciona' },
  '.live-sys__card--dark .lede': { en: 'Every project starts as a system: rules, motions and visuals that grow with the culture it speaks to — not a one-off campaign.', es: 'Cada proyecto arranca como un sistema: reglas, movimientos y visuales que crecen con la cultura a la que le habla — no una campaña de una sola vez.', pt: 'Cada projeto começa como um sistema: regras, movimentos e visuais que crescem com a cultura à qual fala — não uma campanha única.' },
  '.live-sys__card--dark .live-sys__tags span:nth-child(1)': { en: 'Direction', es: 'Dirección', pt: 'Direção' },
  '.live-sys__card--dark .live-sys__tags span:nth-child(2)': { en: 'Technology', es: 'Tecnología', pt: 'Tecnologia' },
  '.live-sys__card--dark .live-sys__tags span:nth-child(3)': { en: 'Emotion', es: 'Emoción', pt: 'Emoção' },
  '.live-sys__card--light .live-sys__kicker': { en: 'Workflow <b>→</b>', es: 'Flujo de Trabajo <b>→</b>', pt: 'Fluxo de Trabalho <b>→</b>' },
  '.live-sys__card--light h3': { en: 'From Brief To Living System', es: 'Del Brief Al Sistema Vivo', pt: 'Do Brief Ao Sistema Vivo' },
  '.live-sys__card--light p': { en: 'Prototype fast, ship living systems, teach the methods behind them — direction, technology and emotion move as one continuous gesture.', es: 'Prototipamos rápido, lanzamos sistemas vivos, enseñamos los métodos detrás de ellos — dirección, tecnología y emoción se mueven como un solo gesto continuo.', pt: 'Prototipamos rápido, lançamos sistemas vivos, ensinamos os métodos por trás deles — direção, tecnologia e emoção se movem como um único gesto contínuo.' },
  '.live-sys__stats div:nth-child(1) span': { en: 'chapters / project', es: 'capítulos / proyecto', pt: 'capítulos / projeto' },
  '.live-sys__stats div:nth-child(2) span': { en: 'iterations', es: 'iteraciones', pt: 'iterações' },
  '.live-sys__stats div:nth-child(3) span': { en: 'this system', es: 'este sistema', pt: 'este sistema' },

  '#statement-1 .sh-statement > span:nth-of-type(1)': { en: 'WE DESIGN <span class="outline">BRAND LANGUAGES</span>,', es: 'DISEÑAMOS <span class="outline">LENGUAJES DE MARCA</span>,', pt: 'DESENHAMOS <span class="outline">LINGUAGENS DE MARCA</span>,' },
  '#statement-1 .sh-statement > span:nth-of-type(2)': { en: '<em>DIGITAL EXPERIENCES</em> AND', es: '<em>EXPERIENCIAS DIGITALES</em> Y', pt: '<em>EXPERIÊNCIAS DIGITAIS</em> E' },
  '#statement-1 .sh-statement > span:nth-of-type(3)': { en: '<span class="font-swap type-erase" data-swap>GENERATIVE VISUALS</span> THAT', es: '<span class="font-swap type-erase" data-swap>VISUALES GENERATIVOS</span> QUE', pt: '<span class="font-swap type-erase" data-swap>VISUAIS GENERATIVOS</span> QUE' },
  '#statement-1 .sh-statement > span:nth-of-type(4)': { en: 'CONNECT <span class="outline">ART</span> WITH DATA,', es: 'CONECTAN EL <span class="outline">ARTE</span> CON LOS DATOS,', pt: 'CONECTAM A <span class="outline">ARTE</span> COM DADOS,' },
  '#statement-1 .sh-statement > span:nth-of-type(5)': { en: 'HUMAN TOUCH WITH <em>ALGORITHMIC FLOW.</em>', es: 'EL TOQUE HUMANO CON EL <em>FLUJO ALGORÍTMICO.</em>', pt: 'TOQUE HUMANO COM <em>FLUXO ALGORÍTMICO.</em>' },
  '#statement-1 .sh-label': { en: 'Our Creative Ecosystem <b>[02]</b>', es: 'Nuestro Ecosistema Creativo <b>[02]</b>', pt: 'Nosso Ecossistema Criativo <b>[02]</b>' },

  '#ecosystem .eco-card:nth-child(1) .eco-card__meta': { en: 'CREATIVE DIRECTION<br />BRANDING<br />ADVERTISING<br />WEB DEVELOPMENT', es: 'DIRECCIÓN CREATIVA<br />BRANDING<br />PUBLICIDAD<br />DESARROLLO WEB', pt: 'DIREÇÃO CRIATIVA<br />BRANDING<br />PUBLICIDADE<br />DESENVOLVIMENTO WEB' },
  '#ecosystem .eco-card:nth-child(2) .eco-card__meta': { en: 'VISUAL PROGRAMMING<br />TOUCH DESIGNER<br />PLUG-INS<br />CREATIVE CODING', es: 'PROGRAMACIÓN VISUAL<br />TOUCH DESIGNER<br />PLUG-INS<br />PROGRAMACIÓN CREATIVA', pt: 'PROGRAMAÇÃO VISUAL<br />TOUCH DESIGNER<br />PLUG-INS<br />PROGRAMAÇÃO CRIATIVA' },
  '#ecosystem .eco-card:nth-child(3) .eco-card__meta': { en: 'WHERE WE TEACH THE METHODS<br />BEHIND THE AGENCY AND SYSTEM.', es: 'DONDE ENSEÑAMOS LOS MÉTODOS<br />DETRÁS DE LA AGENCIA Y EL SISTEMA.', pt: 'ONDE ENSINAMOS OS MÉTODOS<br />POR TRÁS DA AGÊNCIA E DO SISTEMA.' },

  '#about .eyebrow': { en: 'The Studio · [03]', es: 'El Estudio · [03]', pt: 'O Estúdio · [03]' },
  '.sh-story-lead': { en: 'We believe every project has a story to tell — and a system worth building.', es: 'Creemos que cada proyecto tiene una historia para contar — y un sistema que vale la pena construir.', pt: 'Acreditamos que todo projeto tem uma história para contar — e um sistema que vale a pena construir.' },
  '.sh-editorial > div:nth-child(1) h3': { en: 'What we are thinking of', es: 'En qué estamos pensando', pt: 'No que estamos pensando' },
  '.sh-editorial > div:nth-child(1) p:nth-child(2)': { en: 'We design brand languages and living digital experiences where direction meets code. Every South Hustles project starts as a system: a set of rules, motions and visuals that can grow with the culture it speaks to.', es: 'Diseñamos lenguajes de marca y experiencias digitales vivas donde la dirección se encuentra con el código. Cada proyecto de South Hustles arranca como un sistema: un conjunto de reglas, movimientos y visuales que puede crecer con la cultura a la que le habla.', pt: 'Desenhamos linguagens de marca e experiências digitais vivas onde a direção encontra o código. Todo projeto da South Hustles começa como um sistema: um conjunto de regras, movimentos e visuais que pode crescer com a cultura à qual fala.' },
  '.sh-editorial > div:nth-child(1) p:nth-child(3)': { en: 'Art with data. Human touch with algorithmic flow. We treat the studio as a laboratory — testing, breaking and refining until the work belongs to the future.', es: 'Arte con datos. Toque humano con flujo algorítmico. Tratamos al estudio como un laboratorio — probando, rompiendo y refinando hasta que el trabajo pertenece al futuro.', pt: 'Arte com dados. Toque humano com fluxo algorítmico. Tratamos o estúdio como um laboratório — testando, quebrando e refinando até que o trabalho pertença ao futuro.' },
  '.sh-editorial > div:nth-child(2) h3': { en: 'Our approach made easy', es: 'Nuestro enfoque, simplificado', pt: 'Nosso enfoque, simplificado' },
  '.sh-editorial > div:nth-child(2) p:nth-child(2)': { en: 'Direction, technology and emotion are not three departments — they are one continuous gesture. We prototype fast, ship living systems, and teach the methods behind them.', es: 'Dirección, tecnología y emoción no son tres departamentos — son un solo gesto continuo. Prototipamos rápido, lanzamos sistemas vivos, y enseñamos los métodos detrás de ellos.', pt: 'Direção, tecnologia e emoção não são três departamentos — são um único gesto contínuo. Prototipamos rápido, lançamos sistemas vivos, e ensinamos os métodos por trás deles.' },
  '.sh-editorial > div:nth-child(2) p:nth-child(3)': { en: 'Based in Argentina and Mexico, working worldwide, building creative systems for a conscious era.', es: 'Con base en Argentina y México, trabajando en todo el mundo, construyendo sistemas creativos para una era consciente.', pt: 'Sediados na Argentina e no México, trabalhando no mundo todo, construindo sistemas criativos para uma era consciente.' },
  '#about .bg-note': { en: '<b>note//</b> the studio is the method — not the deliverable.', es: '<b>nota//</b> el estudio es el método — no el entregable.', pt: '<b>nota//</b> o estúdio é o método — não o entregável.' },

  '#studio-manifesto .sh-label': { en: 'The Studio <b>[03.b]</b>', es: 'El Estudio <b>[03.b]</b>', pt: 'O Estúdio <b>[03.b]</b>' },
  '.manif__lede': { en: 'South Hustles is a <em>creative studio</em> for a conscious era. We merge direction, technology and emotion into systems that keep producing culture after we ship them — born between the sierra and the sea, built for everywhere.', es: 'South Hustles es un <em>estudio creativo</em> para una era consciente. Fusionamos dirección, tecnología y emoción en sistemas que siguen produciendo cultura después de que los lanzamos — nacido entre la sierra y el mar, construido para todos lados.', pt: 'South Hustles é um <em>estúdio criativo</em> para uma era consciente. Fundimos direção, tecnologia e emoção em sistemas que continuam produzindo cultura depois que os lançamos — nascido entre a serra e o mar, feito para todo lugar.' },
  '.manif__col:nth-child(1) h3': { en: 'What we believe', es: 'En qué creemos', pt: 'No que acreditamos' },
  '.manif__col:nth-child(2) h3': { en: 'How we work', es: 'Cómo trabajamos', pt: 'Como trabalhamos' },
  '.manif__col:nth-child(3) h3': { en: 'Who we teach', es: 'A quién le enseñamos', pt: 'A quem ensinamos' },
  '#studio-manifesto .bg-note': { en: '<b>NOTE//</b> precision is a feeling — open me.', es: '<b>NOTA//</b> la precisión es un sentimiento — abrime.', pt: '<b>NOTA//</b> a precisão é um sentimento — me abra.' },
  '.manif__col:nth-child(1) p': { en: `Brands are living systems, not artifacts. If it can't evolve without us, we haven't finished the job. Every identity we build carries its own rules for breaking its rules.`, es: 'Las marcas son sistemas vivos, no artefactos. Si no puede evolucionar sin nosotros, no terminamos el trabajo. Cada identidad que construimos lleva sus propias reglas para romper sus reglas.', pt: 'Marcas são sistemas vivos, não artefatos. Se não consegue evoluir sem nós, não terminamos o trabalho. Toda identidade que construímos carrega suas próprias regras para quebrar suas regras.' },
  '.manif__col:nth-child(2) p': { en: 'Direction first, pixels last. Async by default, present when it matters. One system per problem, documented so hard it teaches itself. Additive only — we never tear down what works.', es: 'Primero la dirección, últimos los píxeles. Async por defecto, presentes cuando importa. Un sistema por problema, documentado tan a fondo que se enseña solo. Solo aditivo — nunca tiramos abajo lo que funciona.', pt: 'Direção primeiro, pixels por último. Assíncrono por padrão, presente quando importa. Um sistema por problema, documentado tão a fundo que se ensina sozinho. Só aditivo — nunca derrubamos o que funciona.' },
  '.manif__col:nth-child(3) p': { en: 'Everyone who asks. The University shares the methods behind the agency and the system — because students break our tools in ways that improve them, and the best ones never really leave.', es: 'A todos los que preguntan. La Universidad comparte los métodos detrás de la agencia y el sistema — porque los estudiantes rompen nuestras herramientas de maneras que las mejoran, y los mejores nunca se van del todo.', pt: 'Todos que perguntam. A Universidade compartilha os métodos por trás da agência e do sistema — porque os estudantes quebram nossas ferramentas de formas que as melhoram, e os melhores nunca vão embora de vez.' },
  '.mt-beat:nth-child(1) p': { en: 'First hustle — a borrowed laptop, a music video, a name that stuck.', es: 'Primer hustle — una laptop prestada, un videoclip, un nombre que quedó.', pt: 'Primeiro hustle — um laptop emprestado, um videoclipe, um nome que ficou.' },
  '.mt-beat:nth-child(2) p': { en: 'The studio forms: direction + code under one roof for the first time.', es: 'Nace el estudio: dirección + código bajo un mismo techo por primera vez.', pt: 'Nasce o estúdio: direção + código sob o mesmo teto pela primeira vez.' },
  '.mt-beat:nth-child(3) p': { en: 'Global reach — first worldwide clients, first system that outlived its campaign.', es: 'Alcance global — primeros clientes internacionales, primer sistema que sobrevivió a su campaña.', pt: 'Alcance global — primeiros clientes internacionais, primeiro sistema que sobreviveu à sua campanha.' },
  '.mt-beat:nth-child(4) p': { en: 'CUSA System is born: our TouchDesigner practice becomes shippable instruments.', es: 'Nace CUSA System: nuestra práctica de TouchDesigner se vuelve instrumentos listos para entregar.', pt: 'Nasce o CUSA System: nossa prática de TouchDesigner vira instrumentos prontos para entregar.' },
  '.mt-beat:nth-child(5) .mt-year': { en: 'NOW', es: 'HOY', pt: 'AGORA' },
  '.mt-beat:nth-child(5) p': { en: 'Tandil, Córdoba, La Saladita, Tulum → worldwide. Agency, system and university running as one ecosystem.', es: 'Tandil, Córdoba, La Saladita, Tulum → todo el mundo. Agencia, sistema y universidad funcionando como un solo ecosistema.', pt: 'Tandil, Córdoba, La Saladita, Tulum → o mundo todo. Agência, sistema e universidade funcionando como um único ecossistema.' },

  '#work .sh-label': { en: 'Selected Projects <b>[04]</b>', es: 'Proyectos Seleccionados <b>[04]</b>', pt: 'Projetos Selecionados <b>[04]</b>' },
  '.projects-preview span': { en: 'PREVIEW', es: 'VISTA PREVIA', pt: 'PRÉVIA' },
  '.project-row[data-preview="AGENCY.GIF"] .project-row__col:nth-child(3)': { en: 'CreativeAgency', es: 'Agencia Creativa', pt: 'Agência Criativa' },
  '.project-row[data-preview="DATA-SYMPHONY.GIF"] .project-row__col:nth-child(3)': { en: 'Development', es: 'Desarrollo', pt: 'Desenvolvimento' },
  '.project-row[data-preview="CODECRAFT.GIF"] .project-row__col:nth-child(3)': { en: 'Development', es: 'Desarrollo', pt: 'Desenvolvimento' },
  '.project-row[data-preview="PIXEL-PERFECT.GIF"] .project-row__col:nth-child(3)': { en: 'Design', es: 'Diseño', pt: 'Design' },
  '.project-row[data-preview="MOTION-ATLAS.GIF"] .project-row__col:nth-child(3)': { en: 'Development', es: 'Desarrollo', pt: 'Desenvolvimento' },
  '.discover-btn': { en: 'Discover Now →', es: 'Descubrí Ahora →', pt: 'Descubra Agora →' },


  '#ig-feed .sh-label': { en: 'From The Feed <b>[04.d]</b>', es: 'Desde El Feed <b>[04.d]</b>', pt: 'Do Feed <b>[04.d]</b>' },
  '.ig-lede': { en: 'Every drop is a <em>system in miniature</em> — reactive rigs, brand loops and generative posters, shipped to the feed before they scale to clients.', es: 'Cada drop es un <em>sistema en miniatura</em> — rigs reactivos, loops de marca y posters generativos, lanzados al feed antes de escalar a clientes.', pt: 'Cada drop é um <em>sistema em miniatura</em> — rigs reativos, loops de marca e pôsteres generativos, lançados no feed antes de escalar para clientes.' },
  '.ig-card--wide .ig-card__kicker': { en: 'DROP · 01 — REEL', es: 'DROP · 01 — REEL', pt: 'DROP · 01 — REEL' },
  '.ig-card--wide h3': { en: 'Reactive Systems, Live', es: 'Sistemas Reactivos, En Vivo', pt: 'Sistemas Reativos, Ao Vivo' },
  '.ig-bento .ig-card:nth-child(2) h3': { en: 'Brand Loop 001', es: 'Loop de Marca 001', pt: 'Loop de Marca 001' },
  '.ig-bento .ig-card:nth-child(3) h3': { en: 'Generative Poster Series', es: 'Serie de Pósters Generativos', pt: 'Série de Pôsteres Generativos' },
  '.ig-follow': { en: 'Follow the system — @south.hustles', es: 'Seguí el sistema — @south.hustles', pt: 'Siga o sistema — @south.hustles' },

  '.reel__head .sh-label': { en: 'The Reel <b>[04.a]</b>', es: 'El Reel <b>[04.a]</b>', pt: 'O Reel <b>[04.a]</b>' },
  '.reel__hint': { en: 'SCROLL → THE ROOM MOVES SIDEWAYS', es: 'SCROLL → EL CUARTO SE MUEVE DE COSTADO', pt: 'SCROLL → A SALA SE MOVE DE LADO' },
  '.reel__track .reel-panel:nth-child(1) .reel-panel__big': { en: 'WE KEEP<br /><span class="outline">MOVING</span>', es: 'SEGUIMOS<br /><span class="outline">EN MOVIMIENTO</span>', pt: 'CONTINUAMOS<br /><span class="outline">EM MOVIMENTO</span>' },
  '.reel__track .reel-panel:nth-child(1) .reel-panel__cap': { en: 'DIRECTION · TECHNOLOGY · EMOTION', es: 'DIRECCIÓN · TECNOLOGÍA · EMOCIÓN', pt: 'DIREÇÃO · TECNOLOGIA · EMOÇÃO' },
  '.reel-panel__quote': { en: `Systems that don't just look advanced — they <em>belong</em> to the future.<footer>— STUDIO NOTES, GENEVA</footer>`, es: 'Sistemas que no solo se ven avanzados — <em>pertenecen</em> al futuro.<footer>— NOTAS DEL ESTUDIO, GENEVA</footer>', pt: 'Sistemas que não só parecem avançados — <em>pertencem</em> ao futuro.<footer>— NOTAS DO ESTÚDIO, GENEBRA</footer>' },
  '.reel__track .reel-panel:nth-child(3) .reel-panel__cap': { en: 'FROM THE STICKER ROOM', es: 'DESDE EL STICKER ROOM', pt: 'DO STICKER ROOM' },
  '.reel__track .reel-panel:nth-child(5) .reel-panel__big': { en: 'HUMAN <em>touch</em><br /><span class="outline">ALGORITHMIC</span> FLOW', es: 'TOQUE <em>humano</em><br /><span class="outline">FLUJO</span> ALGORÍTMICO', pt: 'TOQUE <em>humano</em><br /><span class="outline">FLUXO</span> ALGORÍTMICO' },
  '.reel__track .reel-panel:nth-child(5) .reel-panel__cap': { en: 'THE METHOD BEHIND EVERYTHING', es: 'EL MÉTODO DETRÁS DE TODO', pt: 'O MÉTODO POR TRÁS DE TUDO' },
  '.reel__track .reel-panel:nth-child(6) .reel-panel__cap': { en: 'CREATIVE STUDIO — EST. 2012', es: 'ESTUDIO CREATIVO — DESDE 2012', pt: 'ESTÚDIO CRIATIVO — DESDE 2012' },

  '.sticker-hint': { en: '<span class="mono">STICKER ROOM //</span> drag them, <em>they fight back.</em>', es: '<span class="mono">STICKER ROOM //</span> arrastralos, <em>se defienden.</em>', pt: '<span class="mono">STICKER ROOM //</span> arraste-os, <em>eles revidam.</em>' },

  '.mq-menu__word[data-icon="SVC"]': { en: 'SERVICES', es: 'SERVICIOS', pt: 'SERVIÇOS' },
  '.mq-menu__word[data-icon="BLG"]': { en: 'BLOG', es: 'BLOG', pt: 'BLOG' },
  '.mq-menu__word[data-icon="CNT"]': { en: 'CONTACT', es: 'CONTACTO', pt: 'CONTATO' },
  '.mq-menu__word[data-icon="PRJ"]': { en: 'PROJECTS', es: 'PROYECTOS', pt: 'PROJETOS' },
  '.mq-menu__word[data-icon="ABT"]': { en: 'ABOUT', es: 'NOSOTROS', pt: 'SOBRE' },

  '#statement-2 .sh-statement': {
    en: 'WE MERGE <span class="outline">DIRECTION</span>, TECHNOLOGY AND <em>EMOTION</em> TO BUILD EXPERIENCES THAT <em>LIVE</em> IN DIGITAL SPACE.',
    es: 'FUSIONAMOS LA <span class="outline">DIRECCIÓN</span>, LA TECNOLOGÍA Y LA <em>EMOCIÓN</em> PARA CREAR EXPERIENCIAS QUE <em>VIVEN</em> EN EL ESPACIO DIGITAL.',
    pt: 'FUNDIMOS A <span class="outline">DIREÇÃO</span>, A TECNOLOGIA E A <em>EMOÇÃO</em> PARA CRIAR EXPERIÊNCIAS QUE <em>VIVEM</em> NO ESPAÇO DIGITAL.',
  },

  '.sh2-magnetic-copy .sh2-three-giant': { en: 'A FIELD THAT <em>RESPONDS</em>', es: 'UN CAMPO QUE <em>RESPONDE</em>', pt: 'UM CAMPO QUE <em>RESPONDE</em>' },
  '.sh2-magnetic-copy .sh2-three-lede': { en: 'Six thousand particles hold formation until you move. The system bends around your cursor — then settles back into place. Interfaces should behave the same way.', es: 'Seis mil partículas mantienen la formación hasta que te movés. El sistema se dobla alrededor de tu cursor — y después vuelve a su lugar. Las interfaces deberían comportarse igual.', pt: 'Seis mil partículas mantêm a formação até você se mover. O sistema se curva ao redor do seu cursor — e depois volta ao lugar. As interfaces deveriam se comportar do mesmo jeito.' },
  '.sh2-gravity-copy .sh2-three-giant': { en: 'WORK IN <em>ZERO GRAVITY</em>', es: 'TRABAJOS EN <em>GRAVEDAD CERO</em>', pt: 'TRABALHOS EM <em>GRAVIDADE ZERO</em>' },
  '.sh2-gravity-copy .sh2-three-note': { en: '14 frames · fibonacci-sphere spread · parallax ×3 — <b>hover one</b>', es: '14 cuadros · esfera fibonacci · parallax ×3 — <b>pasá por uno</b>', pt: '14 quadros · esfera fibonacci · parallax ×3 — <b>passe o mouse em um</b>' },

  '.sh2-canopy-copy .sh2-three-giant': { en: 'PROJECT <em>REUNALT 4</em>', es: 'PROYECTO <em>REUNALT 4</em>', pt: 'PROJETO <em>REUNALT 4</em>' },
  '.sh2-canopy-copy .sh2-three-lede': { en: 'Section placeholder — low-density procedural leaves, generated on canvas and animated with Three.js. Replace copy and CTA once the project is confirmed.', es: 'Placeholder de sección — hojas procedurales de baja densidad, generadas en canvas y animadas con Three.js. Reemplazar copy y CTA cuando se confirme el proyecto real.', pt: 'Placeholder de seção — folhas procedurais de baixa densidade, geradas em canvas e animadas com Three.js. Substituir o copy e o CTA quando o projeto for confirmado.' },
  '.sh2-canopy-cta': { en: 'View project ›', es: 'Ver proyecto ›', pt: 'Ver projeto ›' },
  '.cr-kicker': { en: 'the project journey', es: 'el viaje del proyecto', pt: 'a jornada do projeto' },
  '.cr-hero': { en: 'MEMOR<em>A</em>BLE', es: 'MEMOR<em>A</em>BLES', pt: 'MEMOR<em>Á</em>VEIS' },
  '.cr-lede': { en: `We don't design campaigns.<br />We build systems that keep<br />producing culture after<br />we ship them.`, es: 'No diseñamos campañas.<br />Construimos sistemas que siguen<br />produciendo cultura después<br />de que los entregamos.', pt: 'Não desenhamos campanhas.<br />Construímos sistemas que seguem<br />produzindo cultura depois<br />que os entregamos.' },
  '.cr-caption em': { en: 'from sketch to signal', es: 'del boceto a la señal', pt: 'do rascunho ao sinal' },

  '.case__kicker': { en: '<em>an identity that listens</em>', es: '<em>una identidad que escucha</em>', pt: '<em>uma identidade que escuta</em>' },
  '.case__meta span:nth-child(1)': { en: 'CLIENT — CONCERT HALL, GENEVA', es: 'CLIENTE — SALA DE CONCIERTOS, GENEVA', pt: 'CLIENTE — SALA DE CONCERTOS, GENEBRA' },
  '.case__meta span:nth-child(2)': { en: 'YEAR — 2022 · MARCEL · JULY', es: 'AÑO — 2022 · MARCEL · JULIO', pt: 'ANO — 2022 · MARCEL · JULHO' },
  '.case__meta span:nth-child(3)': { en: 'VECTORS — DEVELOPMENT · GENERATIVE · IDENTITY', es: 'VECTORES — DESARROLLO · GENERATIVO · IDENTIDAD', pt: 'VETORES — DESENVOLVIMENTO · GENERATIVO · IDENTIDADE' },
  '.case__epigraph': { en: '« Forty years of programmes, four thousand concerts, one question: what does a season <em>look</em> like? »', es: '« Cuarenta años de programas, cuatro mil conciertos, una pregunta: ¿cómo se <em>ve</em> una temporada? »', pt: '« Quarenta anos de programas, quatro mil concertos, uma pergunta: como é que uma temporada <em>se parece</em>? »' },
  '#case-study > div:nth-of-type(2) .case__num': { en: 'The Brief', es: 'El brief', pt: 'O brief' },
  '#case-study > div:nth-of-type(2) .case__big': { en: 'THE HALL WANTED ITS <em>music</em> TO BE SEEN BEFORE IT WAS HEARD.', es: 'LA SALA QUERÍA QUE SU <em>música</em> SE VIERA ANTES DE ESCUCHARSE.', pt: 'A SALA QUERIA QUE SUA <em>música</em> FOSSE VISTA ANTES DE SER OUVIDA.' },
  '#case-study > div:nth-of-type(2) .case__body': { en: 'Their archive held every programme since 1982 — composers, keys, durations, applause lengths. Data nobody had ever looked at twice. Our brief: turn that archive into the visual identity of the coming season.', es: 'Su archivo guardaba cada programa desde 1982 — compositores, tonalidades, duraciones, largos de aplausos. Datos que nadie había mirado dos veces. Nuestro brief: convertir ese archivo en la identidad visual de la temporada entrante.', pt: 'Seu arquivo guardava cada programa desde 1982 — compositores, tonalidades, durações, tamanhos de aplausos. Dados que ninguém tinha olhado duas vezes. Nosso brief: transformar esse arquivo na identidade visual da temporada seguinte.' },
  '#case-study > div:nth-of-type(2) figcaption': { en: 'The raw archive, 1982–2022, before the system touched it.', es: 'El archivo crudo, 1982–2022, antes de que el sistema lo tocara.', pt: 'O arquivo bruto, 1982–2022, antes de o sistema tocá-lo.' },
  '.case__banner-word': { en: 'LISTENING&nbsp;WITH&nbsp;YOUR&nbsp;EYES', es: 'ESCUCHANDO&nbsp;CON&nbsp;LOS&nbsp;OJOS', pt: 'ESCUTANDO&nbsp;COM&nbsp;OS&nbsp;OLHOS' },
  '#case-study > div:nth-of-type(4) .case__num': { en: 'The System', es: 'El sistema', pt: 'O sistema' },
  '#case-study > div:nth-of-type(4) .case__big': { en: 'A TOUCHDESIGNER NETWORK THAT <em>composes</em> LIKE THE ORCHESTRA.', es: 'UNA RED DE TOUCHDESIGNER QUE <em>compone</em> COMO LA ORQUESTA.', pt: 'UMA REDE DE TOUCHDESIGNER QUE <em>compõe</em> COMO A ORQUESTRA.' },
  '#case-study > div:nth-of-type(4) .case__body': { en: 'Audio analysis drives geometry: key signatures choose palettes, tempo bends the grid, applause length decides how long a frame survives. 40,000 generated frames — curated by hand, red marker on printouts, taste over stamina.', es: 'El análisis de audio maneja la geometría: las tonalidades eligen paletas, el tempo dobla la grilla, el largo del aplauso decide cuánto sobrevive un cuadro. 40.000 cuadros generados — curados a mano, marcador rojo sobre impresiones, gusto sobre resistencia.', pt: 'A análise de áudio comanda a geometria: as tonalidades escolhem paletas, o tempo dobra a grade, o tamanho do aplauso decide quanto tempo um quadro sobrevive. 40.000 quadros gerados — curados à mão, marcador vermelho sobre impressões, gosto sobre resistência.' },
  '#case-study > div:nth-of-type(4) figcaption': { en: 'The network — every operator is a musician that never tires.', es: 'La red — cada operador es un músico que nunca se cansa.', pt: 'A rede — cada operador é um músico que nunca se cansa.' },
  '.case__stats div:nth-child(1) span': { en: 'frames generated', es: 'cuadros generados', pt: 'quadros gerados' },
  '.case__stats div:nth-child(2) span': { en: 'concerts mapped', es: 'conciertos mapeados', pt: 'concertos mapeados' },
  '.case__stats div:nth-child(3) span': { en: 'living identity', es: 'identidad viva', pt: 'identidade viva' },
  '.case__stats div:nth-child(4) span': { en: 'seasons it can score', es: 'temporadas que puede musicalizar', pt: 'temporadas que consegue musicar' },
  '#case-study > div:nth-of-type(6) .case__num': { en: 'The Output', es: 'El resultado', pt: 'O resultado' },
  '#case-study > div:nth-of-type(6) .case__big': { en: `EVERY NIGHT'S POSTER IS <em>played</em>, NOT DESIGNED.`, es: 'EL PÓSTER DE CADA NOCHE SE <em>toca</em>, NO SE DISEÑA.', pt: 'O PÔSTER DE CADA NOITE É <em>tocado</em>, NÃO DESENHADO.' },
  '#case-study > div:nth-of-type(6) .case__body': { en: `The season launched with posters, tickets and façade projections all rendered from the same system — each night unique, all nights unmistakably one voice. The identity now belongs to the hall's own team: they play it, we tuned it.`, es: 'La temporada se lanzó con pósters, entradas y proyecciones de fachada renderizados desde el mismo sistema — cada noche única, todas las noches inconfundiblemente una sola voz. La identidad ahora es del equipo de la sala: ellos la tocan, nosotros la afinamos.', pt: 'A temporada foi lançada com pôsteres, ingressos e projeções de fachada, todos renderizados a partir do mesmo sistema — cada noite única, todas as noites inconfundivelmente uma só voz. A identidade agora pertence à própria equipe da sala: eles a tocam, nós a afinamos.' },
  '.case__fullmoment-big': { en: 'THE SYSTEM<br/>TAKES THE <em>stage</em>', es: 'EL SISTEMA<br/>TOMA EL <em>escenario</em>', pt: 'O SISTEMA<br/>TOMA O <em>palco</em>' },
  '.case__others .sh-label': { en: 'More Dossiers <b>[04.c]</b>', es: 'Más Dossiers <b>[04.c]</b>', pt: 'Mais Dossiês <b>[04.c]</b>' },
  '.case__other:nth-child(1) .mono-note': { en: 'dev diaries as a brand', es: 'diarios de dev como marca', pt: 'diários de dev como marca' },
  '.case__other:nth-child(2) .mono-note': { en: 'a grid you can feel', es: 'una grilla que se siente', pt: 'uma grade que se sente' },
  '.case__other:nth-child(3) .mono-note': { en: 'portraits the model dreamt', es: 'retratos que soñó el modelo', pt: 'retratos que o modelo sonhou' },
  '.case__other:nth-child(4) .mono-note': { en: 'choreography for cursors', es: 'coreografía para cursores', pt: 'coreografia para cursores' },

  '#journal .wrap > .sh-label': { en: 'Field Notes <b>[07]</b> — <em>read · paint · mark</em>', es: 'Notas de Campo <b>[07]</b> — <em>leé · pintá · marcá</em>', pt: 'Notas de Campo <b>[07]</b> — <em>leia · pinte · marque</em>' },
  '.dna-strip-wrap .sh-label': { en: 'Your DNA <b>[07.b]</b> <span class="mono-note">// what you marked, kept</span>', es: 'Tu ADN <b>[07.b]</b> <span class="mono-note">// lo que marcaste, guardado</span>', pt: 'Seu DNA <b>[07.b]</b> <span class="mono-note">// o que você marcou, guardado</span>' },
  '.dna-empty': { en: 'Nothing marked yet. Open a note and highlight a phrase, or paint over a page.', es: 'Todavía no marcaste nada. Abrí una nota y resaltá una frase, o pintá sobre una página.', pt: 'Nada marcado ainda. Abra uma nota e destaque uma frase, ou pinte sobre uma página.' },
  '.journal-lede': { en: 'Open a note. Highlight what resonates with the mouse. Arm a tool and paint over the page — marker, fineliner, spray or eraser. Everything you mark feeds the <b>DNA strip</b> below. <span class="mono-note">// backend sync coming soon</span>', es: 'Abrí una nota. Resaltá lo que resuena con el mouse. Armá una herramienta y pintá sobre la página — marcador, fineliner, aerosol o goma. Todo lo que marcás alimenta la <b>tira de ADN</b> de abajo. <span class="mono-note">// sync con backend próximamente</span>', pt: 'Abra uma nota. Destaque o que ressoa com o mouse. Escolha uma ferramenta e pinte sobre a página — marcador, caneta fina, spray ou borracha. Tudo que você marca alimenta a <b>faixa de DNA</b> abaixo. <span class="mono-note">// sincronização com backend em breve</span>' },
  '[data-card-id="creative-systems"] .jc-title': { en: 'Creative Systems, Not Campaigns', es: 'Sistemas Creativos, No Campañas', pt: 'Sistemas Criativos, Não Campanhas' },
  '[data-card-id="creative-systems"] .jc-teaser': { en: 'Why we build living structures instead of one-off deliverables.', es: 'Por qué construimos estructuras vivas en vez de entregables de una sola vez.', pt: 'Por que construímos estruturas vivas em vez de entregáveis únicos.' },
  '[data-card-id="touchdesigner-pipelines"] .jc-title': { en: 'TouchDesigner As A Drawing Hand', es: 'TouchDesigner Como Mano Que Dibuja', pt: 'TouchDesigner Como Uma Mão Que Desenha' },
  '[data-card-id="touchdesigner-pipelines"] .jc-teaser': { en: 'Visual programming pipelines from the CUSA System practice.', es: 'Pipelines de programación visual de la práctica CUSA System.', pt: 'Pipelines de programação visual da prática CUSA System.' },
  '[data-card-id="branding-rituals"] .jc-title': { en: 'Branding Is A Ritual, Not A Logo', es: 'El Branding Es Un Ritual, No Un Logo', pt: 'Branding É Um Ritual, Não Um Logo' },
  '[data-card-id="branding-rituals"] .jc-teaser': { en: 'The repeatable acts that make identity stick.', es: 'Los actos repetibles que hacen que la identidad quede.', pt: 'Os atos repetíveis que fazem a identidade grudar.' },
  '[data-card-id="generative-art"] .jc-title': { en: 'Art With Data, Touch With Flow', es: 'Arte Con Datos, Toque Con Flujo', pt: 'Arte Com Dados, Toque Com Fluxo' },
  '[data-card-id="generative-art"] .jc-teaser': { en: 'Where the human hand meets the algorithm — and who leads.', es: 'Donde la mano humana se encuentra con el algoritmo — y quién lidera.', pt: 'Onde a mão humana encontra o algoritmo — e quem lidera.' },
  '[data-card-id="teaching-methods"] .jc-title': { en: 'Teaching The Method Behind The Magic', es: 'Enseñar El Método Detrás De La Magia', pt: 'Ensinando O Método Por Trás Da Mágica' },
  '[data-card-id="teaching-methods"] .jc-teaser': { en: 'Visualizing Wisdom — why we open-source our process.', es: 'Visualizing Wisdom — por qué abrimos nuestro proceso.', pt: 'Visualizing Wisdom — por que abrimos nosso processo.' },
  '[data-card-id="geneva-worldwide"] .jc-title': { en: 'Based In The Sierra And The Sea', es: 'Con Base En La Sierra Y El Mar', pt: 'Sediados Na Serra E No Mar' },
  '[data-card-id="geneva-worldwide"] .jc-teaser': { en: 'Running a worldwide studio from Tandil, Córdoba, La Saladita and Tulum.', es: 'Cómo llevar un estudio mundial desde Tandil, Córdoba, La Saladita y Tulum.', pt: 'Como rodar um estúdio mundial a partir de Tandil, Córdoba, La Saladita e Tulum.' },
  '.jc-open': { en: 'OPEN →', es: 'ABRIR →', pt: 'ABRIR →' },

  '#perspective .bg-note': { en: `<b>note//</b> intuition is just precision that hasn't been measured yet.`, es: '<b>nota//</b> la intuición es solo precisión que todavía no se midió.', pt: '<b>nota//</b> intuição é só precisão que ainda não foi medida.' },
  '#university .bg-note': { en: '<b>note//</b> zero gravity is just enough distance to see the pattern.', es: '<b>nota//</b> gravedad cero es solo la distancia justa para ver el patrón.', pt: '<b>nota//</b> gravidade zero é só a distância certa para ver o padrão.' },
  '.perspective-text': { en: `WE COMBINE ARTISTIC <em>INTUITION</em> WITH TECHNOLOGICAL PRECISION TO CREATE VISUAL SYSTEMS THAT DON'T JUST LOOK ADVANCED, THEY <em>BELONG TO THE FUTURE.</em>`, es: 'COMBINAMOS LA <em>INTUICIÓN</em> ARTÍSTICA CON LA PRECISIÓN TECNOLÓGICA PARA CREAR SISTEMAS VISUALES QUE NO SOLO SE VEN AVANZADOS, SINO QUE <em>PERTENECEN AL FUTURO.</em>', pt: 'COMBINAMOS A <em>INTUIÇÃO</em> ARTÍSTICA COM PRECISÃO TECNOLÓGICA PARA CRIAR SISTEMAS VISUAIS QUE NÃO SÓ PARECEM AVANÇADOS, ELES <em>PERTENCEM AO FUTURO.</em>' },

  '#university .sh-label': { en: 'Visualizing Wisdom · University <b>[05]</b>', es: 'Visualizing Wisdom · Universidad <b>[05]</b>', pt: 'Visualizing Wisdom · Universidade <b>[05]</b>' },
  '.uni-lead': { en: 'Where we teach the methods behind the agency <em>and system.</em> Expert-led courses, engaging workshops and inspiring resources.', es: 'Donde enseñamos los métodos detrás de la agencia <em>y el sistema.</em> Cursos guiados por expertos, talleres que enganchan y recursos que inspiran.', pt: 'Onde ensinamos os métodos por trás da agência <em>e do sistema.</em> Cursos guiados por especialistas, workshops envolventes e recursos inspiradores.' },
  '.uni-tile--red .uni-tile__title': { en: 'Reactive Design Impact', es: 'Impacto del Diseño Reactivo', pt: 'Impacto do Design Reativo' },
  '.uni-tile--red .uni-tile__type': { en: 'Expert-led course', es: 'Curso guiado por expertos', pt: 'Curso guiado por especialistas' },
  '.uni-tile--amber .uni-tile__title': { en: 'Power Designs Impact', es: 'Impacto de Diseños con Poder', pt: 'Impacto de Designs Poderosos' },
  '.uni-tile--amber .uni-tile__type': { en: 'Engaging workshop', es: 'Taller que engancha', pt: 'Workshop envolvente' },
  '.uni-tile--green .uni-tile__title': { en: 'TouchDesigner Systems', es: 'Sistemas TouchDesigner', pt: 'Sistemas TouchDesigner' },
  '.uni-tile--green .uni-tile__type': { en: 'Inspiring resource', es: 'Recurso que inspira', pt: 'Recurso inspirador' },
  '.uni-tile--blue .uni-tile__title': { en: 'Generative Brand Craft', es: 'Oficio Generativo de Marca', pt: 'Ofício Generativo de Marca' },
  '.uni-tile--blue .uni-tile__type': { en: 'Expert-led course', es: 'Curso guiado por expertos', pt: 'Curso guiado por especialistas' },

  '#systems .sh-label': { en: 'Methods &amp; Tools <b>[06]</b>', es: 'Métodos y Herramientas <b>[06]</b>', pt: 'Métodos e Ferramentas <b>[06]</b>' },
  '.glass-grid .glass-card:nth-child(1) .glass-card__title': { en: 'Creative Direction', es: 'Dirección Creativa', pt: 'Direção Criativa' },
  '.glass-grid .glass-card:nth-child(1) .glass-card__sub': { en: 'DIRECTION · STORY', es: 'DIRECCIÓN · HISTORIA', pt: 'DIREÇÃO · HISTÓRIA' },
  '.glass-grid .glass-card:nth-child(1) .glass-card__data p': { en: 'We set the narrative before a single pixel moves — tone, pacing, the arc a brand follows across every touchpoint.', es: 'Definimos la narrativa antes de que se mueva un solo píxel — tono, ritmo, el arco que una marca sigue en cada punto de contacto.', pt: 'Definimos a narrativa antes que um único pixel se mova — tom, ritmo, o arco que uma marca segue em cada ponto de contato.' },
  '.glass-grid .glass-card:nth-child(2) .glass-card__sub': { en: 'VISUAL PROGRAMMING', es: 'PROGRAMACIÓN VISUAL', pt: 'PROGRAMAÇÃO VISUAL' },
  '.glass-grid .glass-card:nth-child(2) .glass-card__data p': { en: 'Real-time visual programming for installations, live sets and generative brand assets — nodes instead of timelines.', es: 'Programación visual en tiempo real para instalaciones, sets en vivo y assets de marca generativos — nodos en vez de timelines.', pt: 'Programação visual em tempo real para instalações, sets ao vivo e assets de marca generativos — nós em vez de timelines.' },
  '.glass-grid .glass-card:nth-child(3) .glass-card__title': { en: 'Web Development', es: 'Desarrollo Web', pt: 'Desenvolvimento Web' },
  '.glass-grid .glass-card:nth-child(3) .glass-card__sub': { en: 'SYSTEMS · CODE', es: 'SISTEMAS · CÓDIGO', pt: 'SISTEMAS · CÓDIGO' },
  '.glass-grid .glass-card:nth-child(3) .glass-card__data p': { en: `Hand-built front-ends, no bloated framework where it isn't earning its keep — fast, accessible, built to last.`, es: 'Front-ends hechos a mano, sin frameworks inflados que no se ganan su lugar — rápidos, accesibles, hechos para durar.', pt: 'Front-ends feitos à mão, sem frameworks inchados que não merecem seu lugar — rápidos, acessíveis, feitos para durar.' },
  '.glass-grid .glass-card:nth-child(4) .glass-card__title': { en: 'Creative Coding', es: 'Programación Creativa', pt: 'Programação Criativa' },
  '.glass-grid .glass-card:nth-child(4) .glass-card__sub': { en: 'GENERATIVE · SHADERS', es: 'GENERATIVO · SHADERS', pt: 'GENERATIVO · SHADERS' },
  '.glass-grid .glass-card:nth-child(4) .glass-card__data p': { en: 'Shaders, particle systems and procedural motion — code as a design material, not just plumbing.', es: 'Shaders, sistemas de partículas y movimiento procedural — el código como material de diseño, no solo plomería.', pt: 'Shaders, sistemas de partículas e movimento processual — código como material de design, não só encanamento.' },
  '.glass-grid .glass-card:nth-child(5) .glass-card__sub': { en: 'IDENTITY · LANGUAGE', es: 'IDENTIDAD · LENGUAJE', pt: 'IDENTIDADE · LINGUAGEM' },
  '.glass-grid .glass-card:nth-child(5) .glass-card__data p': { en: 'Identity systems that flex — a mark, a voice and a set of rules a team can actually run with.', es: 'Sistemas de identidad que flexionan — una marca, una voz y reglas que un equipo puede usar de verdad.', pt: 'Sistemas de identidade que flexionam — uma marca, uma voz e um conjunto de regras que um time realmente consegue usar.' },
  '.glass-grid .glass-card:nth-child(6) .glass-card__title': { en: 'Advertising', es: 'Publicidad', pt: 'Publicidade' },
  '.glass-grid .glass-card:nth-child(6) .glass-card__sub': { en: 'CAMPAIGN · MOTION', es: 'CAMPAÑA · MOVIMIENTO', pt: 'CAMPANHA · MOVIMENTO' },
  '.glass-grid .glass-card:nth-child(6) .glass-card__data p': { en: 'Campaigns built to move — media planning and motion design that earns attention instead of interrupting it.', es: 'Campañas hechas para moverse — motion design que se gana la atención en vez de interrumpirla.', pt: 'Campanhas feitas para se mover — motion design que conquista a atenção em vez de interrompê-la.' },

  '#contact .sh-label': { en: 'Start A Project <b>[08]</b>', es: 'Empezá Un Proyecto <b>[08]</b>', pt: 'Comece Um Projeto <b>[08]</b>' },
  '.contact-lede': { en: `Tell us what you're building. Pick a budget, mark your vectors, and we answer within <em>48 hours</em>.`, es: 'Contanos qué estás construyendo. Elegí un presupuesto, marcá tus vectores, y te respondemos en <em>48 horas</em>.', pt: 'Conte o que você está construindo. Escolha um orçamento, marque seus vetores, e respondemos em <em>48 horas</em>.' },
  'label[for="cf-name"]': { en: 'Your name', es: 'Tu nombre', pt: 'Seu nome' },
  '.cf-error': { en: 'needs a real email', es: 'necesita un email real', pt: 'precisa de um email real' },
  'fieldset.cf-group:nth-of-type(1) > legend': { en: 'Budget', es: 'Presupuesto', pt: 'Orçamento' },
  'fieldset.cf-group:nth-of-type(2) > legend': { en: 'Vectors', es: 'Vectores', pt: 'Vetores' },
  '.cf-chips .cf-chip:nth-child(1) span': { en: 'Creative Direction', es: 'Dirección Creativa', pt: 'Direção Criativa' },
  '.cf-chips .cf-chip:nth-child(3) span': { en: 'Web Development', es: 'Desarrollo Web', pt: 'Desenvolvimento Web' },
  '.cf-chips .cf-chip:nth-child(4) span': { en: 'Creative Coding', es: 'Programación Creativa', pt: 'Programação Criativa' },
  '.cf-chips .cf-chip:nth-child(6) span': { en: 'University', es: 'Universidad', pt: 'Universidade' },
  'label[for="cf-msg"]': { en: 'The project', es: 'El proyecto', pt: 'O projeto' },
  '.cf-summary': { en: '> pick your vectors…', es: '> elegí tus vectores…', pt: '> escolha seus vetores…' },
  '.cf-submit': { en: 'SEND IT →', es: 'ENVIALO →', pt: 'ENVIAR →' },
  '.cf-success__big': { en: 'RECEIVED.', es: 'RECIBIDO.', pt: 'RECEBIDO.' },
  '.cf-success p': { en: 'We answer in 48h. Or jump the queue:', es: 'Respondemos en 48h. O saltate la fila:', pt: 'Respondemos em 48h. Ou pule a fila:' },

  '.pixelated-block h3': { en: 'Pixelated <em>everything</em>', es: 'Todo <em>pixelado</em>', pt: 'Tudo <em>pixelado</em>' },
  '.pixelated-block__body': { en: 'Every asset — a poster, a UI, a loading screen — gets pushed through the same grid until it reads as one language. Zoom in and the pixels tell you which studio made it.', es: 'Cada asset — un póster, una UI, una pantalla de carga — pasa por la misma grilla hasta leerse como un solo lenguaje. Hacé zoom y los píxeles te dicen qué estudio lo hizo.', pt: 'Cada asset — um pôster, uma UI, uma tela de carregamento — passa pela mesma grade até soar como uma só linguagem. Dê zoom e os pixels dizem qual estúdio fez.' },
  '.pixelated-block .mono': { en: `Explore the innovative 'Pixelated Everything' concept with our TouchDesigner plugin.`, es: `Explorá el concepto innovador 'Pixelated Everything' con nuestro plugin de TouchDesigner.`, pt: `Explore o conceito inovador 'Pixelated Everything' com nosso plugin de TouchDesigner.` },
  '.pixelated-block .button:not(.button--primary)': { en: 'Button', es: 'Botón', pt: 'Botão' },
  '.pixelated-block .button--primary': { en: 'Button ›', es: 'Botón ›', pt: 'Botão ›' },

  '.footer-menu a:nth-child(1)': { en: 'SERVICES', es: 'SERVICIOS', pt: 'SERVIÇOS' },
  '.footer-menu a:nth-child(3)': { en: 'CONTACT', es: 'CONTACTO', pt: 'CONTATO' },
  '.footer-menu a:nth-child(4)': { en: 'PROJECTS', es: 'PROYECTOS', pt: 'PROJETOS' },
  '.footer-menu a:nth-child(5)': { en: 'ABOUT', es: 'NOSOTROS', pt: 'SOBRE' },
  '.footer-giant__type': { en: 'Create memorable <em>experiences</em> <b>together.</b>', es: 'Creemos <em>experiencias</em> memorables <b>juntos.</b>', pt: 'Crie <em>experiências</em> memoráveis <b>juntos.</b>' },
  '.footer-news p': { en: 'Never miss out on the latest updates, trends, and inspirations. Subscribe to our newsletter and join us.', es: 'No te pierdas las últimas novedades, tendencias e inspiraciones. Suscribite a nuestro newsletter y sumate.', pt: 'Não perca as últimas novidades, tendências e inspirações. Assine nossa newsletter e junte-se a nós.' },
  'label[for="news-email"]': { en: 'Email address', es: 'Correo electrónico', pt: 'Endereço de email' },
  '.footer-news__form button[type="submit"]': { en: 'Subscribe', es: 'Suscribirme', pt: 'Assinar' },
  '.footer__tagline': { en: 'BASED IN ARGENTINA — MEXICO — WORKING WORLDWIDE', es: 'CON BASE EN ARGENTINA — MÉXICO — TRABAJANDO EN TODO EL MUNDO', pt: 'SEDIADOS NA ARGENTINA — MÉXICO — TRABALHANDO NO MUNDO TODO' },
  '.footer-trust div:nth-child(1) b': { en: 'AR·MX', es: 'AR·MX', pt: 'AR·MX' },
  '.footer-trust div:nth-child(1) span': { en: 'Argentina — México', es: 'Argentina — México', pt: 'Argentina — México' },
  '.footer-trust div:nth-child(2) span': { en: 'Working worldwide', es: 'Trabajando en todo el mundo', pt: 'Trabalhando no mundo todo' },
  '.footer-trust div:nth-child(3) span': { en: 'Tandil · Córdoba · La Saladita · Tulum', es: 'Tandil · Córdoba · La Saladita · Tulum', pt: 'Tandil · Córdoba · La Saladita · Tulum' },
  '.footer__grid > div:nth-child(1) > div:nth-of-type(2)': { en: 'creative studio — creative systems for a conscious era', es: 'estudio creativo — sistemas creativos para una era consciente', pt: 'estúdio criativo — sistemas criativos para uma era consciente' },
  '.footer__grid > div:nth-child(1) > div:nth-of-type(4)': { en: 'CP 5152, Argentina · CP 77760, México', es: 'CP 5152, Argentina · CP 77760, México', pt: 'CEP 5152, Argentina · CEP 77760, México' },
  '.footer__grid > div:nth-child(2) .footer__col-title': { en: 'Studio', es: 'Estudio', pt: 'Estúdio' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(1) a': { en: 'Work', es: 'Trabajos', pt: 'Trabalhos' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(2) a': { en: 'Studio', es: 'Estudio', pt: 'Estúdio' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(3) a': { en: 'Services', es: 'Servicios', pt: 'Serviços' },
  '.footer__grid > div:nth-child(2) .footer__links li:nth-child(4) a': { en: 'Contact', es: 'Contacto', pt: 'Contato' },
  '.footer__grid > div:nth-child(3) .footer__col-title': { en: 'More', es: 'Más', pt: 'Mais' },
  '.footer__grid > div:nth-child(3) .footer__links li:nth-child(1) a': { en: 'Terms', es: 'Términos', pt: 'Termos' },
  '.footer__grid > div:nth-child(3) .footer__links li:nth-child(3) a': { en: 'University', es: 'Universidad', pt: 'Universidade' },
  '.footer__grid > div:nth-child(3) .footer__links li:nth-child(4) a': { en: 'Projects', es: 'Proyectos', pt: 'Projetos' },
  '.footer__copy': { en: '© South Hustles 2026 — Based in Argentina and Mexico, working worldwide.', es: '© South Hustles 2026 — Con base en Argentina y México, trabajando en todo el mundo.', pt: '© South Hustles 2026 — Sediados na Argentina e no México, trabalhando no mundo todo.' }
};

function storedLang() {
  try {
    const l = localStorage.getItem(KEY);
    return LANGS.includes(l) ? l : null;
  } catch {
    return null;
  }
}

/* flag SVG markup per language — swapped into .lang-toggle__flag-slot */
const FLAGS = {
  es: '<rect width="32" height="20" fill="#fff"/><rect width="32" height="6.4" fill="#74ACDF"/><rect y="13.6" width="32" height="6.4" fill="#74ACDF"/><circle cx="16" cy="10" r="2.6" fill="#FCBF49" stroke="#85340A" stroke-width="0.4"/>',
  pt: '<rect width="32" height="20" fill="#009739"/><polygon points="16,3 29,10 16,17 3,10" fill="#FEDD00"/><circle cx="16" cy="10" r="4.2" fill="#012169"/>',
  en: '<rect width="32" height="20" fill="#fff"/><rect y="0" width="32" height="1.54" fill="#B22234"/><rect y="3.08" width="32" height="1.54" fill="#B22234"/><rect y="6.16" width="32" height="1.54" fill="#B22234"/><rect y="9.24" width="32" height="1.54" fill="#B22234"/><rect y="12.32" width="32" height="1.54" fill="#B22234"/><rect y="15.4" width="32" height="1.54" fill="#B22234"/><rect y="18.48" width="32" height="1.54" fill="#B22234"/><rect width="13" height="10.8" fill="#3C3B6E"/>',
};
const CODES = { es: 'ARG', pt: 'PT', en: 'EN' };
const ARIA = {
  es: 'Cambiar a portugués', // shown while es is active — names the NEXT language
  pt: 'Mudar para inglês',
  en: 'Switch to Spanish',
};

export function setLang(next, persist = true) {
  const root = document.documentElement;
  if (!LANGS.includes(next)) next = 'es';

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

  // flag + code swap together with the language (ARG/AR → PT/BR → EN/US → …)
  const btn = document.querySelector('[data-lang-toggle]');
  if (btn) {
    const flagSlot = btn.querySelector('.lang-toggle__flag');
    if (flagSlot) flagSlot.innerHTML = FLAGS[next];
    const code = btn.querySelector('.lang-toggle__code');
    if (code) code.textContent = CODES[next];
    btn.setAttribute('aria-label', ARIA[next]);
  }

  document.dispatchEvent(new CustomEvent('sh-lang-changed', { detail: { lang: next } }));
}

/* Positions .lang-toggle-wrap just past .site-nav's own right edge —
   see the HTML comment above .lang-toggle-wrap for why this can't be
   plain CSS. When the nav pill is already wide enough that nothing
   fits beside it without overlapping (narrow-ish windows, or a nav
   that's grown with more links), it drops to its own row under the
   nav instead of clamping into an overlap — clamping into the gap was
   an earlier bug: on a tight viewport the "clamped" spot could sit
   *behind* the pill, right where a click would hit the nav instead.

   The nav's rendered width isn't stable at the instant this first runs
   — webfonts swapping in (Archivo/Instrument Serif) reflow it a beat
   later, so a single measurement on load could freeze the "doesn't fit,
   drop below" fallback in forever even once there'd be room beside it
   (Franco: "carga abajo y no se va al lado hasta que cambio de idioma").
   A ResizeObserver on the nav itself re-measures every time its actual
   box changes size, whatever the cause; `scroll` is kept as a cheap
   extra safety net. */
function initLangTogglePosition() {
  const wrap = document.querySelector('.lang-toggle-wrap');
  const nav = document.querySelector('.site-nav');
  if (!wrap || !nav) return;

  const reposition = () => {
    const navRect = nav.getBoundingClientRect();
    const gap = 14;
    const fitsBeside = navRect.right + gap + wrap.offsetWidth + 12 <= window.innerWidth;
    if (fitsBeside) {
      wrap.style.top = '14px';
      wrap.style.left = `${navRect.right + gap}px`;
    } else {
      wrap.style.top = `${navRect.bottom + 10}px`;
      wrap.style.left = `${Math.max(12, window.innerWidth - wrap.offsetWidth - 12)}px`;
    }
  };

  reposition();
  window.addEventListener('resize', reposition, { passive: true });
  window.addEventListener('scroll', reposition, { passive: true });
  document.addEventListener('sh-lang-changed', () => requestAnimationFrame(reposition));
  if (window.ResizeObserver) new ResizeObserver(reposition).observe(nav);
  if (document.fonts?.ready) document.fonts.ready.then(reposition);
}

export function initI18n() {
  // Spanish is the default voice (Franco: "que siempre cargue en spanish").
  // Always run through setLang — even for 'en', where the DOM rewrite is a
  // no-op against the shipped English markup — so the button's flag/code
  // state is set the same single way on every load, no separate branch to
  // keep in sync.
  const initial = storedLang() || 'es';
  setLang(initial, false);

  const btn = document.querySelector('[data-lang-toggle]');
  if (btn) {
    btn.addEventListener('click', () => {
      const cur = document.documentElement.dataset.lang || 'es';
      const next = LANGS[(LANGS.indexOf(cur) + 1) % LANGS.length];
      setLang(next);
    });

    // opening spotlight: draws the eye to the language toggle on first
    // paint (Franco: "resalte en opacidad al contrario del sitio ... bien
    // creativamente"). Three ring pulses (~5s), then settles on its own —
    // dismissed early on click/hover so it never fights an intentional pick.
    requestAnimationFrame(() => btn.classList.add('is-spotlit'));
    const dismissSpotlight = () => btn.classList.remove('is-spotlit');
    btn.addEventListener('pointerenter', dismissSpotlight, { once: true });
    btn.addEventListener('click', dismissSpotlight, { once: true });
    setTimeout(dismissSpotlight, 5200);
  }

  initLangTogglePosition();
}
