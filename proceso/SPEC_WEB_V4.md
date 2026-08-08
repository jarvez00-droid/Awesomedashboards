# SPEC WEB v4 — LA VOZ DE LA EMPRESA (Jose, 2026-08-07 noche — textual)

"Me gusta cómo quedó, PERO hay que ajustar demasiado el lenguaje:
1. NO me atribuyas tanto crédito — parezco egocéntrico. NO me cites. De hecho: CERO citas de Jose. Las reglas se enseñan como reglas de LA EMPRESA, no como 'palabras de Jose'.
2. BALANCE DE VALORES: parece que lo único que importa es el sistema y la verdad. SÍ son muy importantes, pero IGUAL de importantes son: LA OBRA, IR a la obra, GESTIONAR correctamente, SER PROACTIVO. No tomarse al literal mis explicaciones y citas — el proceso se sigue tal cual, pero la empresa/motivaciones se redactan mejor.
3. LA PARTE DE EMPRESA Y MOTIVACIÓN 'está muy monse y sosa — parece una burla'. Reescribirla como un MASTER TRAINER / CONSULTOR con 20+ años en la industria de la construcción: con BASES SÓLIDAS y RESEARCH detrás (Lean Construction/Last Planner, los principios de calidad de Gawande/checklists, poka-yoke, la regla 1-10-100, hold points ITP, estadísticas de la industria), con EXPERTISE real del área, y con PEP TALK — energía que motive de verdad.
4. MILAGROS: está EN EEUU (no en Perú) y es EL NEXO ENTRE EL BACKOFFICE Y EL CAMPO, además de sus funciones de administradora — corregir su ficha y donde aparezca.
5. CERO montos o números exactos del pasado: fuera los costos fijos en dólares, la cantidad exacta de proyectos, rankings, cifras históricas. Las historias se cuentan cualitativas ('una etapa de crecimiento acelerado nos enseñó que...'). No necesitan tanta información interna.
EL PROCESO Y CÓMO SE ENSEÑA NO SE TOCA — 'está a la perfección'."

Fuentes para el research del master trainer (YA EXISTEN en el estate):
- ~/.openclaw/workspace-assistant/knowledge/consulting/LEAN_CONSTRUCTION.md (Last Planner, PPC, make-ready)
- ~/.openclaw/workspace-assistant/knowledge/consulting/BUILDER_OPERATIONS.md
- ~/.openclaw/workspace-assistant/knowledge/consulting/FRAMEWORKS.md
- ~/.openclaw/workspace-assistant/knowledge/companycam/CHECKLIST_GENERATION_PLAYBOOK.md (los 13 principios QC: Gawande, Shingo/poka-yoke, ITP hold points, 1-10-100, PDCA/Kaizen)

# ADENDA — MENÚ/HEADER + MOBILE (Jose, mismo día)
"Mejora el header — o sea el MENÚ: que sea INTUITIVO, no se entiende para nada cómo guiarse o hacia dónde ir, está todo DESPARRAMADO. Y asegúrate de que TODO sea mobile friendly."

Diseño requerido:
1. El nav plano de 12 links MUERE. Estructura agrupada e intuitiva:
   - **Inicio**
   - **El Proceso** (dropdown/sección con las 7 páginas de proceso EN SU ORDEN de estudio: 1 Proceso constructivo · 2 Proceso de empresa · 3 Bucle diario · 4 JobTread · 5 Dinero · 6 Reloj y reportes · 7 Casos reales)
   - **Posiciones** (dropdown con las 8 + hub)
   - **Temario** · **Materiales** · **Glosario** (directos)
2. Orientación permanente: el usuario SIEMPRE sabe dónde está (breadcrumb o título de sección activa) y hacia dónde sigue — navegación "← anterior · siguiente →" al pie de cada página de proceso siguiendo el orden del camino de aprendizaje.
3. MOBILE FRIENDLY de verdad: hamburguesa con los grupos colapsables, dropdowns usables con tap (no hover), targets táctiles ≥44px, sin overflow horizontal en 375px, diagramas con scroll interno y hint, tipografía legible sin zoom. Verificar TODAS las páginas en viewport móvil.
