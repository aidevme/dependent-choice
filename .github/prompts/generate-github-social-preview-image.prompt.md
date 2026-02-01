---
agent: agent
title: Generate GitHub Social Preview Image
description: Prompt for creating professional social preview image for repository
created: 2026-02-01
---

# GitHub Social Preview Image Generation Prompt

Use this prompt with ChatGPT/DALL-E to generate the social preview image for this repository.

---

## **Prompt for ChatGPT Image Generation**

Create a professional GitHub repository social preview image with the following specifications:

**TECHNICAL REQUIREMENTS:**
- Dimensions: 1280 pixels wide × 640 pixels tall (2:1 aspect ratio)
- Format: High-quality PNG with transparent or solid background
- Resolution: 300 DPI for crisp rendering when scaled
- Color mode: RGB

**LAYOUT STRUCTURE:**
- Left side (40%): Visual elements and icons
- Right side (60%): Text content and branding
- Safe zone: Keep all critical content 80 pixels from edges

**BACKGROUND:**
- Use a modern gradient from Microsoft Power Platform purple (#742774) on the left to Microsoft blue (#0078D4) on the right
- Alternative: Deep purple to vibrant blue diagonal gradient (top-left to bottom-right)
- Add subtle geometric patterns or circuit board motifs in 10% opacity to suggest technical/enterprise software
- Background should be slightly darker to ensure white/light text is highly readable

**LEFT SECTION - VISUAL ELEMENTS:**
- Display a stylized icon representing connected/dependent dropdown fields
- Show two overlapping dropdown/combobox icons with an arrow indicating dependency
- Include small recognizable tech logos in a vertical stack:
  * Power Apps logo (purple hexagon with white "PA")
  * React logo (light blue atom symbol)
  * Fluent UI logo or Microsoft design icon
  * TypeScript "TS" badge in blue
- Icons should be rendered in white or light colors with subtle glow effects
- Add a subtle "PCF" badge or ribbon

**RIGHT SECTION - TEXT CONTENT:**

*Primary Title (Top):*
- Text: "DependentChoice"
- Font: Modern sans-serif (Segoe UI, Inter, or SF Pro)
- Size: 96-110 pixels
- Weight: Bold or Semibold
- Color: White (#FFFFFF)
- Add subtle drop shadow for depth

*Secondary Title (Below primary):*
- Text: "PCF Control for Power Apps"
- Font: Same family as primary
- Size: 42-48 pixels
- Weight: Regular
- Color: Light gray (#E1E1E1) or white with 80% opacity

*Description Line (Middle):*
- Text: "Dynamic filtering for dependent choice fields"
- Font: Same family, slightly condensed
- Size: 32-36 pixels
- Weight: Light or Regular
- Color: White with 70% opacity
- Italic style for emphasis

*Technology Stack (Bottom area):*
- Text: "React 16 • Fluent UI v9 • TypeScript • 18 Languages"
- Font: Monospace or modern sans-serif
- Size: 24-28 pixels
- Color: Light blue (#64D2FF) or cyan for tech emphasis
- Use bullet points (•) or pipe separators (|)

*Footer/Attribution (Very bottom):*
- Text: "github.com/aidevme/dependent-choice"
- Font: Monospace (Consolas, Monaco, or JetBrains Mono)
- Size: 20-22 pixels
- Color: White with 50% opacity
- Position: Bottom-right corner with 40px padding

**DESIGN STYLE:**
- Modern, clean, professional enterprise software aesthetic
- Inspired by Microsoft Fluent Design System
- Depth through subtle shadows and layering
- Acrylic blur effect on background patterns (optional)
- High contrast for readability on social media platforms
- Avoid clutter - maintain generous white space
- Professional gradient overlays for premium feel

**VISUAL EFFECTS:**
- Add subtle glow or halo effect around icons (2-3px blur, white at 20% opacity)
- Light border or stroke on text for better contrast (optional)
- Soft shadow under main title (offset 2px down, 4px blur, black at 30%)
- Slight gradient on text itself (lighter at top, darker at bottom) for depth
- Optional: Add subtle noise texture (5% opacity) for premium feel

**BRANDING ELEMENTS:**
- Incorporate Microsoft/Power Platform design language
- Use rounded corners on any rectangular elements (8-12px radius)
- Maintain professional, enterprise-ready appearance
- Balance between technical and accessible design

**ACCESSIBILITY:**
- Ensure minimum 4.5:1 contrast ratio for all text
- Test readability when scaled to 600x315 (Twitter/LinkedIn preview size)
- Verify text remains legible on both light and dark backgrounds if using transparency

**MOOD & TONE:**
- Professional and trustworthy
- Modern and innovative
- Technical but approachable
- Enterprise-grade quality
- Microsoft ecosystem alignment

**ADDITIONAL CONTEXT:**
This is for a Power Apps Component Framework (PCF) control that provides dynamic filtering for dependent option set fields in Dynamics 365 and Dataverse. The control helps users create cascading dropdown experiences (e.g., select Continent → filter Countries → filter States). It's built with modern web technologies but needs to feel native to the Microsoft Power Platform ecosystem.

**OUTPUT:**
Generate a polished, production-ready social preview image that will represent this open-source project on GitHub, Twitter, LinkedIn, Slack, and Discord when the repository link is shared.

---

## **Alternative Simplified Prompt**

For faster generation with fewer details:

```
Design a 1280x640px GitHub social preview image for "DependentChoice PCF Control" with:

BACKGROUND: Gradient from Microsoft Power Platform purple (#742774) to blue (#0078D4)

LEFT SIDE: 
- Icon showing two connected dropdown/combobox fields
- Small tech stack logos: Power Apps, React, Fluent UI, TypeScript

RIGHT SIDE:
- Title: "DependentChoice" (white, bold, 100px)
- Subtitle: "PCF Control for Power Apps" (light gray, 45px)
- Description: "Dynamic filtering for dependent choice fields" (white 70% opacity, 34px)
- Tech stack: "React 16 • Fluent UI v9 • TypeScript • 18 Languages" (cyan, 26px)
- Footer: "github.com/aidevme/dependent-choice" (white 50% opacity, 22px, bottom-right)

STYLE: Modern, professional, Microsoft Fluent Design, high contrast, clean layout
```

---

## **Post-Generation Checklist**

After ChatGPT generates the image:

1. ✅ **Review** contrast and readability at full size
2. ✅ **Scale test** to 600x315 to verify text remains legible
3. ✅ **Test** on dark/light backgrounds (if using transparency)
4. ✅ **Export** at exactly 1280x640 pixels
5. ✅ **Optimize** file size (keep under 1 MB, ideally under 500 KB)
6. ✅ **Name file**: `social-preview.png` or `og-image.png`
7. ✅ **Upload** to GitHub repository settings
8. ✅ **Verify** by sharing repo link on Twitter/Discord
9. ✅ **Validate** using tools:
   - Twitter Card Validator: https://cards-dev.twitter.com/validator
   - Facebook Debugger: https://developers.facebook.com/tools/debug/
   - LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
   - Open Graph Check: https://opengraph.xyz/

---

## **Upload Instructions**

1. Navigate to: https://github.com/aidevme/dependent-choice/settings
2. Scroll to **"Social preview"** section
3. Click **"Edit"** → **"Upload an image..."**
4. Select your generated `social-preview.png` file
5. Preview the image
6. Click **"Save"**
7. Test by sharing the repository URL on social media

---

## **Technical Specifications Reference**

| Specification | Value | Notes |
|---------------|-------|-------|
| **Recommended Size** | 1280 x 640 pixels | 2:1 aspect ratio |
| **Minimum Size** | 640 x 320 pixels | For acceptable quality |
| **File Format** | PNG, JPG, or GIF | PNG recommended for transparency |
| **Max File Size** | Under 1 MB | GitHub requirement |
| **Aspect Ratio** | 2:1 (wide) | Standard for social media |
| **Color Profile** | sRGB | Best compatibility |
| **Transparency** | Supported (PNG) | Test on dark/light backgrounds |

---

## **Platform Display Sizes**

| Platform | Typical Display Size | Cropping Behavior |
|----------|---------------------|-------------------|
| Twitter/X | ~1200 x 628 | Center-crops to fit |
| LinkedIn | ~1200 x 627 | Center-crops to fit |
| Facebook | ~1200 x 630 | OG tags standard |
| Slack | ~1200 x 630 | Shows in link previews |
| Discord | ~1280 x 640 | Full display in embeds |
| GitHub | Variable | Responsive scaling |

---

## **Design Resources**

If you prefer to design manually instead of using ChatGPT:

**Design Tools:**
- **Figma** (free): https://figma.com - Use 1280x640 canvas
- **Canva** (free): https://canva.com - Custom dimensions
- **Adobe Photoshop**: Professional option
- **GIMP** (free): Open-source alternative

**Online Generators:**
- **OG Image Playground**: https://og-playground.vercel.app/
- **Bannerbear**: Template-based generation
- **Cloudinary**: Dynamic image generation

**Assets:**
- **Power Apps Logo**: Microsoft brand center
- **React Logo**: https://reactjs.org/
- **TypeScript Logo**: https://www.typescriptlang.org/
- **Icons**: Fluent UI icons, Font Awesome, Heroicons

---

## **Version History**

- **v1.0** (2026-02-01): Initial prompt creation
- Future versions: Update when project features/branding changes