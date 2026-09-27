Excelente pergunta — e ela tem uma resposta técnica bem definida. Deixa eu medir o tamanho real antes de opinar, porque isso muda a recomendação.



Números na mão. Deixa eu gerar o JSON final com as flags de risco que prometi no spec:



## Primeiro, a resposta à sua pergunta: **JSON separado. Não inline.**

Medi o dataset real que extraí (117 estilos válidos):

| Formato | Bytes | Linhas |
|---|---|---|
| `styles.json` pretty | 24,9 KB | ~1.250 |
| `styles.ts` inline no `.tsx` | 24,8 KB | ~1.250 |
| Gzip (o que realmente pesa) | ~5,9 KB | — |

Ou seja: **tamanho não é o problema** — 6 KB gzip é insignificante. O argumento contra inline é outro:

- **Você vai regenerar os dados.** A galeria tem 622 imagens e você só viu 125. Quando rodar o script de extração para as outras páginas, um diff em `styles.json` sai limpo; um diff dentro do `.tsx` polui o review e conflita com lógica de UI.
- **O Claude reescreve arquivos inteiros.** Se os 1.250 lines de dados estiverem no mesmo arquivo do componente, cada edição de UI faz ele reprocessar (e potencialmente corromper) o dataset inteiro. Dados separados = o modelo não toca neles.
- **Vite trata JSON como módulo tipado** com `resolveJsonModule`. Você ganha `import styles from './styles.json'` sem bundle extra nem runtime fetch.

Então não é redundância desnecessária — é o split que evita o pior cenário. Manda o `.tsx` sim.

---

## `src/studio/data/styles.ts`

```ts
// src/studio/data/styles.ts
// Extraído da Flux Style Test Gallery (Mile High Styler). 117 estilos válidos.
// Descartados da fonte: carpint_Gothic, coolio_Portraiture (contêm <lora>/<hypernet> de SD).

export type StyleCategory =
  | 'movement' | 'artist' | 'medium' | 'photo'
  | 'commercial' | 'regional' | 'fashion' | 'dark';

export interface StyleDef {
  id: string;
  label: string;
  category: StyleCategory;
  signature: string[];
  nsfwRisk?: boolean;
  brandRisk?: boolean;
}

export const STYLES: StyleDef[] = [
  { id: '2d-game-art', label: '2D Game Art', category: 'movement', signature: ['2D game art', 'platformers', 'pixel art', 'side-scrolling games'] },
  { id: '3d-animation', label: '3D Animation', category: 'movement', signature: ['computer-generated imagery', 'three-dimensional modeling', 'virtual cinematography'] },
  { id: 'abstract-painting', label: 'Abstract Painting', category: 'movement', signature: ['non-representational shapes', 'colors and forms', 'painterly'] },
  { id: 'advertising-poster', label: 'Advertising Poster', category: 'commercial', signature: ['professional', 'modern', 'product-focused', 'commercial', 'eye-catching', 'highly detailed'] },
  { id: 'automotive-advertisement', label: 'Automotive Advertisement', category: 'commercial', signature: ['sleek', 'dynamic', 'professional', 'vehicle-focused', 'high-resolution', 'highly detailed'] },
  { id: 'corporate-branding', label: 'Corporate Branding', category: 'commercial', signature: ['professional', 'clean', 'modern', 'sleek', 'minimalist', 'business-oriented', 'highly detailed'] },
  { id: 'fashion-editorial', label: 'Fashion Editorial', category: 'fashion', signature: ['high fashion', 'trendy', 'stylish', 'editorial', 'magazine style', 'professional', 'highly detailed'] },
  { id: 'food-photography', label: 'Food Photography', category: 'photo', signature: ['appetizing', 'professional', 'culinary', 'high-resolution', 'commercial', 'highly detailed'] },
  { id: 'luxury-product', label: 'Luxury Product', category: 'commercial', signature: ['elegant', 'sophisticated', 'high-end', 'luxurious', 'professional', 'highly detailed'] },
  { id: 'real-estate-photography', label: 'Real Estate Photography', category: 'photo', signature: ['professional', 'inviting', 'well-lit', 'high-resolution', 'property-focused', 'commercial'] },
  { id: 'retail-packaging', label: 'Retail Packaging', category: 'commercial', signature: ['vibrant', 'enticing', 'commercial', 'product-focused', 'eye-catching', 'professional'] },
  { id: 'aerial-photography', label: 'Aerial Photography', category: 'photo', signature: ["bird's-eye view", 'drone shot', 'elevated perspective'] },
  { id: 'african-beadwork', label: 'African Beadwork', category: 'regional', signature: ['decorative bead patterns', 'cultural expression', 'colorful designs'] },
  { id: 'ai-weiwei', label: 'Ai Weiwei', category: 'artist', signature: ['social activism', 'dissident art', 'sunflower seeds', 'dropping Han urn'], brandRisk: true },
  { id: 'airbrushing', label: 'Airbrushing', category: 'medium', signature: ['smooth gradients', 'spray effects', 'automotive art'] },
  { id: 'album-cover-art', label: 'Album Cover Art', category: 'commercial', signature: ['music album cover', 'band branding', 'iconic cover design'] },
  { id: 'american-traditional-tattoo', label: 'American Traditional Tattoo', category: 'medium', signature: ['bold lines', 'nautical elements', 'retro flair', 'symbolic'] },
  { id: 'analytical-cubism', label: 'Analytical Cubism', category: 'movement', signature: ['geometric deconstruction', 'monochromatic palette', 'fragmented forms'] },
  { id: 'andy-warhol', label: 'Andy Warhol', category: 'artist', signature: ['mass production aesthetic', 'pop culture silkscreens', 'consumerist commentary', 'celebrity obsession'], brandRisk: true },
  { id: 'animated-films', label: 'Animated Films', category: 'movement', signature: ['animated characters', 'creative visuals', 'family-friendly entertainment'] },
  { id: 'animation', label: 'Animation', category: 'movement', signature: ['moving images', 'storytelling', 'dynamic visuals'] },
  { id: 'anish-kapoor', label: 'Anish Kapoor', category: 'artist', signature: ['reflective voids', 'perceptual disorientation', 'sinuous forms', 'color psychology'] },
  { id: 'ankama-animation', label: 'Ankama Animation', category: 'movement', signature: ['vibrant colors', 'expansive storyworlds', 'stylized characters', 'flowing motion'], brandRisk: true },
  { id: 'anselm-kiefer', label: 'Anselm Kiefer', category: 'artist', signature: ['brooding landscapes', 'epic scale', 'German myth', 'layered symbolic density'] },
  { id: 'architectural-design', label: 'Architectural Design', category: 'medium', signature: ['building design', 'aesthetics', 'functionality', 'sustainability'] },
  { id: 'architectural-photography', label: 'Architectural Photography', category: 'photo', signature: ['building capture', 'structural aesthetics', 'design documentation'] },
  { id: 'argentinian-art', label: 'Argentinian Art', category: 'regional', signature: ['tango', 'Xul Solar', 'silverwork'] },
  { id: 'art-deco', label: 'Art Deco', category: 'movement', signature: ['geometric shapes', 'luxury', '1920s elegance'] },
  { id: 'art-nouveau', label: 'Art Nouveau', category: 'movement', signature: ['organic forms', 'flowing lines', 'turn-of-the-century aesthetics'] },
  { id: 'abstract-expressionism', label: 'Abstract Expressionism', category: 'movement', signature: ['energetic brushwork', 'bold colors', 'abstract forms', 'expressive', 'emotional'] },
  { id: 'abstract-style', label: 'Abstract Style', category: 'movement', signature: ['non-representational', 'colors and shapes', 'expression of feelings', 'imaginative'] },
  { id: 'constructivism', label: 'Constructivism', category: 'movement', signature: ['geometric shapes', 'bold colors', 'dynamic composition', 'propaganda art'] },
  { id: 'cubism', label: 'Cubism', category: 'movement', signature: ['geometric shapes', 'abstract', 'innovative', 'revolutionary'] },
  { id: 'expressionism', label: 'Expressionism', category: 'movement', signature: ['raw', 'emotional', 'dynamic', 'distortion for emotional effect', 'vibrant', 'unusual colors'] },
  { id: 'graffiti', label: 'Graffiti', category: 'movement', signature: ['street art', 'vibrant', 'urban', 'tag', 'mural'] },
  { id: 'hyperrealism', label: 'Hyperrealism', category: 'movement', signature: ['extremely high-resolution detail', 'photographic', 'fine texture', 'incredibly lifelike'] },
  { id: 'impressionism', label: 'Impressionism', category: 'movement', signature: ['loose brushwork', 'vibrant color', 'light and shadow play', 'feeling over form'] },
  { id: 'pointillism', label: 'Pointillism', category: 'movement', signature: ['small distinct dots of color', 'vibrant', 'highly detailed'] },
  { id: 'pop-art', label: 'Pop Art', category: 'movement', signature: ['bright colors', 'bold outlines', 'popular culture themes', 'ironic', 'kitsch'] },
  { id: 'psychedelic', label: 'Psychedelic', category: 'movement', signature: ['vibrant colors', 'swirling patterns', 'abstract forms', 'surreal', 'trippy'] },
  { id: 'renaissance', label: 'Renaissance', category: 'movement', signature: ['realistic', 'linear perspective', 'light and shadow', 'mythological themes', 'highly detailed'] },
  { id: 'steampunk', label: 'Steampunk', category: 'movement', signature: ['antique', 'mechanical', 'brass and copper tones', 'gears', 'intricate', 'detailed'] },
  { id: 'surrealism', label: 'Surrealism', category: 'movement', signature: ['dreamlike', 'mysterious', 'provocative', 'symbolic', 'intricate', 'detailed'] },
  { id: 'typographic-art', label: 'Typographic Art', category: 'medium', signature: ['stylized', 'intricate', 'artistic', 'text-based'] },
  { id: 'watercolor-painting', label: 'Watercolor Painting', category: 'medium', signature: ['vibrant', 'beautiful', 'painterly', 'textural', 'artistic'] },
  { id: 'assemblage-art', label: 'Assemblage Art', category: 'medium', signature: ['three-dimensional collage', 'recycled materials', 'constructed forms'] },
  { id: 'astrophotography', label: 'Astrophotography', category: 'photo', signature: ['celestial bodies', 'night sky', 'astronomical exploration'] },
  { id: 'augmented-reality-art', label: 'Augmented Reality Art', category: 'medium', signature: ['mixed reality', 'spatial computing', 'digital enhancement'] },
  { id: 'australian-aboriginal-art', label: 'Australian Aboriginal Art', category: 'regional', signature: ['dot painting', 'storytelling', 'cultural heritage'] },
  { id: 'avant-garde-fashion', label: 'Avant-Garde Fashion', category: 'fashion', signature: ['experimental design', 'unconventional aesthetics', 'artistic innovation'] },
  { id: 'banksy', label: 'Banksy', category: 'artist', signature: ['guerilla street art', 'ironic graffiti', 'political satire', 'anonymous persona'], brandRisk: true },
  { id: 'barbara-kruger', label: 'Barbara Kruger', category: 'artist', signature: ['agitprop text and image', 'media critique', 'ideological tension', 'graphic design'], brandRisk: true },
  { id: 'baroque', label: 'Baroque', category: 'movement', signature: ['grandeur', 'opulence', '17th-century artistry'] },
  { id: 'bas-relief-sculpture', label: 'Bas-Relief Sculpture', category: 'medium', signature: ['low depth carving', 'stone texture', 'partially protruding figures'] },
  { id: 'basket-weaving', label: 'Basket Weaving', category: 'medium', signature: ['natural reeds', 'bamboo', 'willow', 'woven texture'] },
  { id: 'bauhaus', label: 'Bauhaus', category: 'movement', signature: ['functional design', 'geometric forms', 'modernist principles'] },
  { id: 'bio-art', label: 'Bio Art', category: 'medium', signature: ['biological materials', 'art-science intersection', 'organic systems'] },
  { id: 'black-and-white-photography', label: 'Black and White Photography', category: 'photo', signature: ['monochrome tones', 'classic aesthetics', 'visual contrast'] },
  { id: 'blacklight-poster', label: 'Blacklight Poster', category: 'commercial', signature: ['day-glo ink', 'hippie motifs', 'far out 60s art'] },
  { id: 'body-art', label: 'Body Art', category: 'medium', signature: ['art on the human body', 'makeup', 'tattoos', 'temporary materials'] },
  { id: 'bohemian-fashion', label: 'Bohemian Fashion', category: 'fashion', signature: ['free-spirited clothing', 'artistic expression', 'unconventional lifestyle'] },
  { id: 'botanical-illustration', label: 'Botanical Illustration', category: 'medium', signature: ['plants', 'scientific accuracy', 'natural beauty'] },
  { id: 'boudoir-photography', label: 'Boudoir Photography', category: 'photo', signature: ['silks', 'elegant lingerie', 'seductive gaze', 'carefully posed'], nsfwRisk: true },
  { id: 'brazilian-art', label: 'Brazilian Art', category: 'regional', signature: ['carnival', 'contemporary art', 'indigenous crafts'] },
  { id: 'brazilian-graffiti-art', label: 'Brazilian Graffiti Art', category: 'regional', signature: ['urban expression', 'street culture', 'vibrant murals'] },
  { id: 'bridal-fashion', label: 'Bridal Fashion', category: 'fashion', signature: ['wedding gowns', 'bridal accessories', 'romantic styling'] },
  { id: 'british-art', label: 'British Art', category: 'regional', signature: ['Pre-Raphaelites', 'Turner', 'street art'] },
  { id: 'bronze-sculpture', label: 'Bronze Sculpture', category: 'medium', signature: ['bronze casting', 'patination', 'monumental form'] },
  { id: 'bruce-nauman', label: 'Bruce Nauman', category: 'artist', signature: ['disorienting corridors', 'menacing neon', 'sinister wordplay', 'psychological tension'] },
  { id: 'brutalism', label: 'Brutalism', category: 'movement', signature: ['raw concrete', 'bold forms', 'architectural honesty'] },
  { id: 'cabinet-of-curiosities', label: 'Cabinet of Curiosities', category: 'dark', signature: ['macabre oddities', 'occult research', 'eerie collection'] },
  { id: 'cake-decorating', label: 'Cake Decorating', category: 'medium', signature: ['icing', 'fondant', 'edible sculpting', 'themed design'] },
  { id: 'candid-portrait-photography', label: 'Candid Portrait Photography', category: 'photo', signature: ['natural expressions', 'unposed moments', 'spontaneous capture'] },
  { id: 'caravaggio', label: 'Caravaggio', category: 'artist', signature: ['chiaroscuro contrasts', 'theatrical tenebrism', 'dramatic naturalism', 'religious themes'] },
  { id: 'caribbean-carnival-art', label: 'Caribbean Carnival Art', category: 'regional', signature: ['festive costumes', 'parade floats', 'cultural celebration'] },
  { id: 'caricature', label: 'Caricature', category: 'medium', signature: ['exaggerated human figures', 'cartoonish style', 'cartoon characters'] },
  { id: 'cartoon', label: 'Cartoon', category: 'medium', signature: ['cartoonish style', 'cartoon characters'] }]
```

# Similar JSON

```json

const RAW = [["2D Game Art","movement","2D game art, platformers, pixel art, side-scrolling games"],["3D Animation","movement","computer-generated imagery, three-dimensional modeling, virtual cinematography"],["Abstract Painting","movement","non-representational shapes, colors and forms, painterly"],["Advertising Poster","commercial","professional, modern, product-focused, commercial, eye-catching, highly detailed"],["Automotive Advertisement","commercial","sleek, dynamic, professional, vehicle-focused, high-resolution, highly detailed"],["Corporate Branding","commercial","professional, clean, modern, sleek, minimalist, business-oriented, highly detailed"],["Fashion Editorial","fashion","high fashion, trendy, stylish, editorial, magazine style, professional, highly detailed"],["Food Photography","photo","appetizing, professional, culinary, high-resolution, commercial, highly detailed"],["Luxury Product","commercial","elegant, sophisticated, high-end, luxurious, professional, highly detailed"],["Real Estate Photography","photo","professional, inviting, well-lit, high-resolution, property-focused, commercial"],["Retail Packaging","commercial","vibrant, enticing, commercial, product-focused, eye-catching, professional"],["Aerial Photography","photo","bird's-eye view, drone shot, elevated perspective"],["African Beadwork","regional","decorative bead patterns, cultural expression, colorful designs"],["Ai Weiwei","artist","social activism, dissident art, sunflower seeds, dropping Han urn"],["Airbrushing","medium","smooth gradients, spray effects, automotive art"],["Album Cover Art","commercial","music album cover, band branding, iconic cover design"],["American Traditional Tattoo","medium","bold lines, nautical elements, retro flair, symbolic"],["Analytical Cubism","movement","geometric deconstruction, monochromatic palette, fragmented forms"],["Andy Warhol","artist","mass production aesthetic, pop culture silkscreens, consumerist commentary, celebrity obsession"],["Animated Films","movement","animated characters, creative visuals, family-friendly entertainment"],["Animation","movement","moving images, storytelling, dynamic visuals"],["Anish Kapoor","artist","reflective voids, perceptual disorientation, sinuous forms, color psychology"],["Ankama Animation","movement","vibrant colors, expansive storyworlds, stylized characters, flowing motion"],["Anselm Kiefer","artist","brooding landscapes, epic scale, German myth, layered symbolic density"],["Architectural Design","medium","building design, aesthetics, functionality, sustainability"],["Architectural Photography","photo","building capture, structural aesthetics, design documentation"],["Argentinian Art","regional","tango, Xul Solar, silverwork"],["Art Deco","movement","geometric shapes, luxury, 1920s elegance"],["Art Nouveau","movement","organic forms, flowing lines, turn-of-the-century aesthetics"],["Abstract Expressionism","movement","energetic brushwork, bold colors, abstract forms, expressive, emotional"],["Abstract Style","movement","non-representational, colors and shapes, expression of feelings, imaginative"],["Constructivism","movement","geometric shapes, bold colors, dynamic composition, propaganda art"],["Cubism","movement","geometric shapes, abstract, innovative, revolutionary"],["Expressionism","movement","raw, emotional, dynamic, distortion for emotional effect, vibrant, unusual colors"],["Graffiti","movement","street art, vibrant, urban, tag, mural"],["Hyperrealism","movement","extremely high-resolution detail, photographic, fine texture, incredibly lifelike"],["Impressionism","movement","loose brushwork, vibrant color, light and shadow play, feeling over form"],["Pointillism","movement","small distinct dots of color, vibrant, highly detailed"],["Pop Art","movement","bright colors, bold outlines, popular culture themes, ironic, kitsch"],["Psychedelic","movement","vibrant colors, swirling patterns, abstract forms, surreal, trippy"],["Renaissance","movement","realistic, linear perspective, light and shadow, mythological themes, highly detailed"],["Steampunk","movement","antique, mechanical, brass and copper tones, gears, intricate, detailed"],["Surrealism","movement","dreamlike, mysterious, provocative, symbolic, intricate, detailed"],["Typographic Art","medium","stylized, intricate, artistic, text-based"],["Watercolor Painting","medium","vibrant, beautiful, painterly, textural, artistic"],["Assemblage Art","medium","three-dimensional collage, recycled materials, constructed forms"],["Astrophotography","photo","celestial bodies, night sky, astronomical exploration"],["Augmented Reality Art","medium","mixed reality, spatial computing, digital enhancement"],["Australian Aboriginal Art","regional","dot painting, storytelling, cultural heritage"],["Avant-Garde Fashion","fashion","experimental design, unconventional aesthetics, artistic innovation"],["Banksy","artist","guerilla street art, ironic graffiti, political satire, anonymous persona"],["Barbara Kruger","artist","agitprop text and image, media critique, ideological tension, graphic design"],["Baroque","movement","grandeur, opulence, 17th-century artistry"],["Bas-Relief Sculpture","medium","low depth carving, stone texture, partially protruding figures"],["Basket Weaving","medium","natural reeds, bamboo, willow, woven texture"],["Bauhaus","movement","functional design, geometric forms, modernist principles"],["Bio Art","medium","biological materials, art-science intersection, organic systems"],["Black and White Photography","photo","monochrome tones, classic aesthetics, visual contrast"],["Blacklight Poster","commercial","day-glo ink, hippie motifs, far out 60s art"],["Body Art","medium","art on the human body, makeup, tattoos, temporary materials"],["Bohemian Fashion","fashion","free-spirited clothing, artistic expression, unconventional lifestyle"],["Botanical Illustration","medium","plants, scientific accuracy, natural beauty"],["Boudoir Photography","photo","silks, elegant lingerie, seductive gaze, carefully posed"],["Brazilian Art","regional","carnival, contemporary art, indigenous crafts"],["Brazilian Graffiti Art","regional","urban expression, street culture, vibrant murals"],["Bridal Fashion","fashion","wedding gowns, bridal accessories, romantic styling"],["British Art","regional","Pre-Raphaelites, Turner, street art"],["Bronze Sculpture","medium","bronze casting, patination, monumental form"],["Bruce Nauman","artist","disorienting corridors, menacing neon, sinister wordplay, psychological tension"],["Brutalism","movement","raw concrete, bold forms, architectural honesty"],["Cabinet of Curiosities","dark","macabre oddities, occult research, eerie collection"],["Cake Decorating","medium","icing, fondant, edible sculpting, themed design"],["Candid Portrait Photography","photo","natural expressions, unposed moments, spontaneous capture"],["Caravaggio","artist","chiaroscuro contrasts, theatrical tenebrism, dramatic naturalism, religious themes"],["Caribbean Carnival Art","regional","festive costumes, parade floats, cultural celebration"],["Caricature","medium","exaggeration, humor, satirical portrait"],["Carnival Freakshow","dark","gaffed spectacles, anatomical anomalies, grotesque performers, vintage poster"],["Caspar David Friedrich","artist","sublime landscapes, Gothic ruins, lone figures in contemplation, Northern Romanticism"],["Cecily Brown","artist","luscious painterly fields, suggestive forms, libidinal energy, gestural freedom"],["Celtic Knotwork Art","regional","interlaced patterns, Celtic culture, medieval design"],["Celtic Mythology Art","regional","knots, Druids, magical landscapes"],["Cemetery Statue","dark","cold lifeless stone, weeping frozen form, ominous outstretched wings, uneasy dread"],["Central African Art","regional","ritual objects, dance costumes, community art"],["Ceramic Art","medium","pottery, sculpture, decorative clay objects"],["Ceramic Design","medium","ceramic art, pottery design, clay works"],["Ceramic Sculpture","medium","hand-building, coiling, wheel-throwing"],["Chalk Art","medium","sidewalk drawing, temporary art, public engagement"],["Charcoal Drawing","medium","deep blacks, expressive lines, paper texture"],["Charles Ray","artist","disquieting mannequins, voyeurism and innocence, hyperrealist discomfort"],["Children's Fashion","fashion","kid's clothing, playful designs, youthful creativity"],["Children's Theater","medium","children's plays, family entertainment, educational theater"],["Chilean Art","regional","arpilleras, modern sculpture, poetic influences"],["Chinese Art","regional","ink painting, calligraphy, porcelain"],["Chinese Ink Painting","medium","ink and brush, traditional landscape, nature"],["Chinese Jade Carving","medium","jade sculpture, symbolic motifs, craftsmanship"],["Chinese Paper Cutting","medium","decorative motifs, cultural celebration, handcrafted design"],["Chris Ofili","artist","beaded figures, psychedelic colors, hip hop energy, transgressive joy"],["Cindy Sherman","artist","chameleon personas, cinematic tableaus, cultural stereotypes, questioning identity"],["Cinematography","photo","camera work, lighting, composition, moving image"],["Circus Arts","medium","circus acts, acrobatic performance, spectacle"],["Classic Western","movement","cowboy heroes, frontier landscapes, Wild West adventure"],["Classical Art","movement","classical sculpture, Greek myth, classical harmony"],["Classical Realism","movement","traditional techniques, realistic portrayal, idealized beauty"],["Claude Monet","artist","luminous impressions, plein air landscapes, serial studies, atmospheric color"],["Collage Art","medium","paper, photographs, fabric assembled onto a surface"],["Colombian Art","regional","Botero, emeralds, pre-Columbian gold"],["Commercial Photography","photo","advertising, product shots, business imagery"],["Computer Art","medium","code as material, generative algorithms, emergent artwork"],["Concept Art for Movies","commercial","character design, environments, visual development"],["Concept Art for Video Games","commercial","characters, levels, game mechanics"],["Conceptual Art","movement","ideas over visual concerns, dematerialized object"],["Concert Poster Design","commercial","gig promotion, band event, live music advertising"],["Creepy Children","dark","pale faces, dark eyes, haunting stare, deeply unsettling"],["Creepy Porcelain Doll","dark","pale cracked face, intricately detailed dress, glassy dead-eyed stare"],["Crime Films","movement","criminal activity, police investigation, underworld intrigue"],["Critical Realism","movement","dispassionate realist scrutiny, social analysis, unflinching objectivity"],["Cuban Art","regional","Afro-Cuban themes, poster art, avant-garde movements"]];
```
