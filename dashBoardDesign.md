# The "Paper Workspace" Design Playbook
*A design system blending Neo-Brutalism, Artsy Sketchbook vibes, and Functional UI.*

## 1. Core Philosophy
The interface should feel like a **digital workspace made of physical materials**. It combines the tactility of paper, the boldness of a marker pen, and the creativity of a sketchbook.
- **Keyterms**: Cartoonist, Authentic, Neo-Brutalist, playful, "Ink & Paper".

---

## 2. Color System

### Base Layers (The Paper)
Avoid pure white (`#FFFFFF`). Use warm, creamy off-whites to simulate paper.
- **Main Background**: `#FFFEF8` (Cream)
- **Secondary Background**: `#FFFDF5` (Warm Notepad)
- **Card Background**: `#FFFFFF` (Stark White for contrast against cream)

### The Ink
All structural elements use pure black to mimic ink outlines.
- **Borders/Text**: `#000000`

### The Highlighters (Accents)
Use punchy, saturated "marker" colors for focal points.
- **Yellow (Attention)**: `#FFD028` or `bg-yellow-300`
- **Blue (Action)**: `#3B82F6`
- **Purple (Focus)**: `#A855F7`
- **Orange (Energy)**: `#F97316`

---

## 3. Typography

### Headlines
**Font**: `Tanker` (or similar Condensed, Heavy Sans-serif).
**Style**: Uppercase, Massive, Tight Tracking.
**Usage**: Page titles, big shout-outs.
**Example**:
```css
font-family: 'Tanker-Regular';
font-weight: 900;
text-transform: uppercase;
letter-spacing: -0.05em; /* tight */
```

### Body Copy
**Font**: Standard Sans-serif (Inter/Arial).
**Style**: Clean, medium weight for readability.
**Tip**: Use `font-bold` for labels to match the heavy stroke aesthetic.

---

## 4. Component Styling (The "Neo-Brutalist" Look)

### The "Ink Outline" Rule
Every interactive card or major container must have a thick, black border.
- **Border**: `border-[3px] border-black` solid.

### The "Hard Shadow" Rule
Shadows should not be blurry. They should look like offset layers.
- **Shadow**: `box-shadow: 4px 4px 0px 0px #000000;`
- **Hover Effect**: Increase the offset to simulate lifting.
  - Hover: `translate(-2px, -2px)` + `box-shadow: 6px 6px 0px 0px #000000;`

### Buttons
Buttons should look like cut-out stickers.
- **Default**: White bg, Black border, Black text.
- **Primary**: Black bg, White text (High contrast).
- **Interaction**: Hard press effect (remove shadow, translate down).

---

## 5. Textures & Decorative Elements

### Technical Patterns
Use CSS gradients to create subtle grid lines or notebook lines.
- **Dot Grid**: `radial-gradient(#E5E5E5 1px, transparent 1px)`
- **Notebook Lines**: `linear-gradient(#E5E7EB 1px, transparent 1px)`

### "Doodle" Details
Add imperfections to make it feel human.
- **Wavy Underlines**: `decoration-wavy`
- **Rotated Elements**: slightly rotate labels (`rotate-[-2deg]`) to break the grid.
- **"Paper Holes"**: create circles on the left side of lists to mimic a spiral-bound notebook.

---

## 6. Icons
Use **Lucide React** icons, but styled to look hand-drawn.
- **Stroke Width**: `3px` (Bold) gives it the same weight as the container borders.
- **Size**: `24px` is standard.

---

## 7. Example Component (Tailwind)

```jsx
<div className="
    bg-white 
    border-[3px] border-black 
    rounded-2xl 
    p-6 
    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
    transition-all 
    hover:-translate-y-1 
    hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
">
    <h2 className="font-black text-2xl uppercase">Your Title</h2>
</div>
```
