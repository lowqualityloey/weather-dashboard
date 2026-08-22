---
name: Modern Weather Dashboard
colors:
  primary: "#2563EB"
  primary-foreground: "#FFFFFF"
  secondary: "#E2E8F0"
  background: "#F0F4F8"
  foreground: "#1E293B"
  card: "#FFFFFF"
  card-foreground: "#1E293B"
  muted: "#F1F5F9"
  muted-foreground: "#64748B"
  border: "#E2E8F0"
  accent-yellow: "#FACC15"
typography:
  headline-lg:
    fontFamily: Geist Variable, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 1.2
  headline-md:
    fontFamily: Geist Variable, sans-serif
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
  body-md:
    fontFamily: Geist Variable, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: Geist Variable, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  full: 9999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  card:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.lg}"
    padding: 24px
  button-icon:
    rounded: "{rounded.full}"
    size: 36px
---

# Modern Weather Dashboard Design Specification

## Overview

A calm, modern, and accessible weather dashboard interface designed for clarity and rapid visual comprehension.

## Colors

- **Primary (`#2563EB`):** Ocean blue for active states, key data accents, and gradients.
- **Card (`#FFFFFF` / dark mode counterpart):** Crisp floating panels for content grouping.
- **Accent Yellow (`#FACC15`):** Golden accent for favorite stars and daytime sun highlights.

## Typography

- Utilizes Geist Variable for clean, geometric, high-legibility typographic hierarchy.

## Components

- **Search Bar:** Pill-shaped input with subtle elevation, embedded left search indicator, and right geolocation action button.
- **Current Weather Card:** Gradient-rich focus card with weather metrics, wind compass, and interactive favorite star pill.
- **Forecast Accordion:** Expandable 5-day cards with smooth 24-hour horizontal forecast carousels.

## Do's and Don'ts

- Do provide clear active/loading feedback on every button interaction.
- Do keep scrollbars hidden while ensuring smooth horizontal scrolling.
- Don't truncate essential time or temperature labels.
