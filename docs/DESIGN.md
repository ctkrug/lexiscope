# Lexiscope — design direction

## Aesthetic direction

**Paper and ink.** Lexiscope is a well-set manuscript on a copyeditor's desk: warm paper,
dark ink, a serif voice, and one editor's-red pen for emphasis. The default theme is the
paper (light); the toggle flips to "night ink" (dark). Nothing about it should read as a
default dashboard - it is a reading tool for people who care how prose reads.

## Tokens

| Token | Paper (default) | Night ink (dark) | Used for |
|---|---|---|---|
| `--bg` | `#f5f0e6` | `#211e19` | page |
| `--panel-bg` | `#fdfbf5` | `#2a2620` | cards, editor |
| `--text` | `#262117` | `#ece4d3` | ink |
| `--muted` | `#7d7260` | `#a3987f` | labels, secondary |
| `--border` | `#ddd2bc` | `#453e30` | hairlines |
| `--accent` | `#b0402f` | `#d9705e` | the editor's red pen: links, focus, top word |
| `--viz-bar` | `#33538c` | `#7d9bc9` | ink-blue frequency bars |
| `--viz-track` | `#eae1cf` | `#3a342a` | gauge/meter tracks |

Semantic chart colors (shared constants in `src/viz/`): positive/easy `#4f9257`,
neutral `#a39a86`, caution/medium `#d9a13f`, negative/hard `#c14e3d` - the same family
as the paper palette, not stock traffic lights.

**Type:** display **Fraunces** (600/700) for the wordmark, headings, and stat numbers;
**Public Sans** (400/600/700) for UI text. The editor textarea sets Georgia/serif system
stack - manuscripts are read in serif. Fallback `system-ui, sans-serif`.

**Spacing** 8px scale. **Radius** 12px cards, 8px controls. **Shadows** soft paper lift
(`0 1px 2px rgb(38 33 23 / 0.06), 0 8px 24px rgb(38 33 23 / 0.06)`). **Motion** UI
150ms ease-out; D3 transitions keep their 200-250ms joins. Honors reduced motion.

## Layout intent

Single reading column (max 1080px) like a well-set page: masthead (mark + wordmark +
tagline, actions right), the **manuscript editor as the hero card** with the stats strip
(Fraunces numerals) directly under it, then a 2-up grid of analysis panels. At 390px
everything stacks; controls stay ≥44px.

## Signature detail

**The red pen.** The #1 most frequent word's bar is drawn in the editor's red while the
rest stay ink-blue - the tool circles the word you lean on hardest, exactly what a human
editor would do.
