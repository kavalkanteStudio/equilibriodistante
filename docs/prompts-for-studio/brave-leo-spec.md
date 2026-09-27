Boa tarde! Analisei a página da galeria de estilos do Flux. A estrutura é bem consistente: **Nome do Estilo + Prompt Base + Descrição/Características**. Isso facilita muito criar templates variados.

Não preciso do seu arquivo `.tsx` agora. Vamos começar com o `spec.md` para validarmos a lógica. Depois, se quiser, ajustamos com base no seu código.

Aqui está uma proposta de especificação para o **Flux Studio Prompt Generator**:



I need to be careful here. My previous turn was cut off mid-sentence, and the code execution failed (require isn't available). Let me deliver a complete, high-quality spec.md directly as markdown text — that's actually more useful than writing a file in a sandbox the user can't access.

Let me extract real data from the page first so the spec contains actual style data, not invented categories.



Boa tarde! Extraí e estruturei os dados da página — são **123 estilos válidos** (descartei 2 entradas corrompidas do autor, `carpint_Gothic` e `coolio_Portraiture`, que contêm LoRA/hypernet de outros modelos e não funcionam no Flux).

Uma observação importante antes do spec: a galeria é do **Flux.1 Dev**, não do Schnell. O Schnell responde bem aos mesmos prompts, mas é mais "lite" em adherence — vale saber na hora de calibrar o peso dos descritivos.

Aqui vai o spec completo, pronto para colar no seu repo:

```markdown
# SPEC — Random Prompt Generator (feature "Studio")

## 1. Contexto & Objetivo

O Studio gera imagens via **Flux (Replicate, plano comercial)**. Esta feature
adiciona um **gerador de prompts aleatórios** baseado em templates + um banco
de estilos extraído da "Flux Style Test Gallery" (Mile High Styler / ComfyUI).

Diferente da galeria original, **não há protagonista fixo**: o sujeito da cena
é sorteado de um banco separado (`subjects.json`) ou informado pelo usuário.

### Regra central
> A **assinatura do estilo** (a lista de traços após o nome) é o payload real.
> É ela que faz o Flux aplicar a estética. Nunca descartar esses tokens.

---

## 2. Formato canônico dos dados

Cada estilo vira um objeto normalizado. O texto da página precisa de limpeza
(remove-se o placeholder `"Winston Churchill looking at iPhone."` e a redundância
"X style ... X").

```ts
// src/studio/data/types.ts
export type StyleCategory =
  | 'movement'   // Art Deco, Baroque, Bauhaus, Cubism, Brutalism...
  | 'artist'     // Caravaggio, Banksy, Cindy Sherman, Ai Weiwei...
  | 'medium'     // Charcoal Drawing, Ceramic Sculpture, Bronze Sculpture...
  | 'photo'      // Aerial, Astrophotography, Boudoir, Commercial...
  | 'commercial' // ads-*, Album Cover, Concert Poster, Concept Art...
  | 'regional'   // Brazilian Art, Chinese Ink Painting, Celtic Knotwork...
  | 'dark'       // Cabinet of Curiosities, Cemetery Statue, Creepy Doll...
  | 'fashion';   // Avant-Garde, Bohemian, Bridal, Children's Fashion...

export interface StyleDef {
  id: string;              // slug estável: "artstyle-hyperrealism"
  label: string;           // exibição humana: "Hyperrealism"
  category: StyleCategory;
  /** Tokens injetados no prompt. Já limpos, prontos para concatenação. */
  signature: string[];
  /** true = evitar por padrão no modo "safe for work" */
  nsfwRisk?: boolean;
}
```

### Exemplo de transformação (antes → depois)

**Página:**
> `artstyle-steampunk_Uncategorized` → "steampunk style Winston Churchill looking at iPhone. . antique, mechanical, brass and copper tones, gears, intricate, detailed"

**JSON final:**
```json
{
  "id": "steampunk",
  "label": "Steampunk",
  "category": "movement",
  "signature": ["antique", "mechanical", "brass and copper tones", "gears", "intricate", "detailed"]
}
```

---

## 3. Templates de prompt

Quatro famílias. `{subject}` vem do usuário ou do sorteio; `{style}` é sempre
prefixado com `in the style of` (mais estável no Flux que nome solto).

```ts
// src/studio/data/templates.ts
export const TEMPLATES = [
  // A — Estilo puro (mínimo, máximo respeito ao modelo)
  '{subject}, in the style of {styleLabel}. {traits}',

  // B — Meio + sujeito (quando o estilo define a técnica)
  '{mediumVerb} of {subject}. {traits}',

  // C — Artista (assinaturas já são frases nominais, sem verbo)
  '{subject}, in the manner of {styleLabel}: {traits}',

  // D — Híbrido (dois estilos; usar com moderação, max ~0.25 dos gens)
  '{subject}, blending {styleA} with {styleB}. {traitsA} {traitsB}'
] as const;
```

**Nota sobre assinaturas de artista:** elas vêm como listas nominais
(`"Chiaroscuro contrasts, theatrical tenebrism, dramatic naturalism"`), enquanto
as de movimento vêm como adjetivos soltos. Por isso o template C usa dois-pontos
e o A usa ponto final — evita frase quebrada.

---

## 4. Algoritmo de geração

```ts
// src/studio/lib/generatePrompt.ts
import { STYLES } from '../data/styles';
import { SUBJECTS } from '../data/subjects';
import { TEMPLATES } from '../data/templates';

export interface GenOptions {
  subject?: string;                 // override do usuário
  category?: StyleCategory;         // filtro
  traitCount?: [number, number];    // default [3, 5]
  hybridChance?: number;            // default 0.15
  seed?: number;                    // p/ preview determinístico
  excludeIds?: string[];            // histórico recente (anti-repetição)
}

export function generatePrompt(opts: GenOptions = {}): GeneratedPrompt {
  const rand = mulberry32(opts.seed ?? Date.now());

  // 1. pool filtrado (categoria + safe-for-work + anti-repetição)
  let pool = STYLES.filter(s => !s.nsfwRisk);
  if (opts.category) pool = pool.filter(s => s.category === opts.category);
  if (opts.excludeIds?.length) {
    const fresh = pool.filter(s => !opts.excludeIds!.includes(s.id));
    if (fresh.length >= 3) pool = fresh;      // fallback se filtrar demais
  }

  // 2. sorteio de estilo(s)
  const primary = pick(pool, rand);
  const useHybrid = Math.random() < (opts.hybridChance ?? 0.15);
  const secondary = useHybrid
    ? pick(pool.filter(s => s.id !== primary.id && s.category !== primary.category), rand)
    : null;

  // 3. traits: amostra SEM reposição, ordem preservada
  const [minT, maxT] = opts.traitCount ?? [3, 5];
  const n = minT + Math.floor(rand() * (maxT - minT + 1));
  const traits = sample(primary.signature, Math.min(n, primary.signature.length), rand);

  // 4. sujeito
  const subject = opts.subject ?? pick(SUBJECTS, rand);

  // 5. template
  const tpl = useHybrid && secondary
    ? TEMPLATES[3]
    : pick(TEMPLATES.slice(0, 3), rand);

  const prompt = fill(tpl, {
    subject,
    styleLabel: primary.label,
    styleA: primary.label,
    styleB: secondary?.label ?? primary.label,
    traits: traits.join(', '),
    traitsA: sample(primary.signature, 3, rand).join(', '),
    traitsB: sample(secondary?.signature ?? [], 3, rand).join(', '),
    mediumVerb: inferMediumVerb(primary),
  });

  return {
    prompt: collapse(prompt),          // colapsa espaços/pontuação dupla
    styleId: primary.id,
    styleLabel: primary.label,
    category: primary.category,
    traits,
    chars: prompt.length,
  };
}
```

### Helpers obrigatórios

| Helper | Papel |
|---|---|
| `mulberry32(seed)` | PRNG determinístico → permite "regenerar igual" e testes unitários |
| `sample(arr, n, rand)` | amostra **sem reposição** (traits duplicadas poluem o prompt) |
| `collapse(str)` | remove `. .`, espaços duplos e vírgulas penduradas |
| `inferMediumVerb(style)` | mapeia categoria → verbo ("painting of", "sculpture of", "photograph of") |

---

## 5. Banco de sujeitos

Sem protagonista fixo. Sugestão de seeds amplas, uma linha cada:

```ts
// src/studio/data/subjects.ts
export const SUBJECTS = [
  'a lighthouse keeper reading a letter',
  'a fox in a snow-covered courtyard',
  'an abandoned subway car overgrown with vines',
  'a chef plating a dish at midnight',
  'two robots sharing an umbrella',
  'a violinist on a rooftop at dusk',
  'a colossal whale drifting above a city',
  'an elderly diver inspecting a coral throne',
  // ... mirar 80–150 entradas
];
```

Regra prática: sujeitos com **sujeito + ação + lugar** funcionam muito melhor no
Flux que substantivos soltos ("a castle" rende menos que "a castle swallowed by
a glacier").

---

## 6. Componente React

```tsx
// src/studio/components/PromptRandomizer.tsx
interface Props {
  value?: string;
  onChange: (prompt: string) => void;
  onGenerate?: (result: GeneratedPrompt) => void;
  categories?: StyleCategory[];   // restringir categorias expostas na UI
  historySize?: number;           // default 8
}
```

**Comportamento esperado**
- `[🎲 Gerar]` → novo prompt; anima a troca; adiciona ao histórico.
- Histórico lateral clicável (recupera prompts anteriores).
- Chips de **categoria** (movements / artists / photo / dark…) filtram o sorteio.
- Campo de sujeito livre; vazio ⇒ sorteia.
- Botão **copy** e botão **"usar no Studio"** (preenche o input existente).
- Indicador de tamanho do prompt (warn acima de ~400 chars).
- Anti-loop: guarda os últimos `historySize` `styleId`s em `excludeIds`.

---

## 7. Calibração específica para Flux Schnell

1. **Ordem importa.** Sujeito primeiro, estilo depois. Inverter degrada a aderência.
2. **Menos é mais no Schnell.** Se o resultado ficar "borrado" entre dois estilos,
   reduzir `traitCount` para `[2, 3]` e desligar híbrido (`hybridChance: 0`).
3. **Evitar negações.** Schnell ignora "no blur"; prefira descritivos positivos.
4. **Assinaturas longas truncam.** Capar em 5 traits; as primeiras da lista são
   as mais identitárias, então preservar a ordem original (nunca embaralhar traits).
5. **Artistas vivos/marcas.** Alguns nomes da galeria carregam risco de política de
   conteúdo no provedor. Manter flag `nsfwRisk`/`brandRisk` e desligar por default
   em build público.

---

## 8. Estilos sinalizados para revisão manual

Do crawl, estes têm conteúdo sensível ou de marca e devem nascer desabilitados:

`boudoir-photography`, `creepy-children`, `creepy-porcelain-doll`,
`carnival-freakshow`, `andy-warhol`, `banksy`, `barbara-kruger`,
`ankama-animation`, `ai-weiwei`.

Descartados por estarem quebrados na fonte: `carpint_Gothic`, `coolio_Portraiture`
(contêm `<lora:...>` e `<hypernet:...>` de Stable Diffusion).

---

## 9. Plano de implementação

- [ ] Script `scripts/extract-styles.mjs`: lê o HTML/JSON da galeria, aplica regex de
      limpeza, emite `src/studio/data/styles.json`. Rodar de novo quando a galeria
      crescer (são 622 imagens, só 125 visíveis nesta página).
- [ ] Normalizar categorias + flags de risco (revisão humana, ~20 min).
- [ ] Escrever `generatePrompt.ts` + helpers + testes com seed fixa.
- [ ] Banco inicial de subjects (80+).
- [ ] `PromptRandomizer.tsx` plugado no fluxo atual do Studio.
- [ ] Smoke test: 20 gens × 3 categorias, revisar legibilidade dos prompts.

---

## 10. Amostra de saída esperada

```text
a fox in a snow-covered courtyard, in the style of Steampunk. antique, mechanical, brass and copper tones, gears, intricate

a violinist on a rooftop at dusk, in the manner of Caravaggio: chiaroscuro contrasts, theatrical tenebrism, dramatic naturalism

an abandoned subway car overgrown with vines, in the style of Art Nouveau. elegant, decorative, curvilinear forms, nature-inspired, ornate
```
```

Quer que eu já escreva o `styles.json` completo com os 123 estilos categorizados e com as signatures limpas? Aí você só cola no projeto e o script de extração vira opcional. E se anexar o `.tsx` do Studio, eu encaixo o componente no seu estado/atualização de prompt em vez de deixar como interface genérica.
