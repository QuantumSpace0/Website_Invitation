# Design System

## Overview
Design tokens extracted from saiyam-jenny.invitationmedia.in.

## Colors
- **Primary** (#3d0f17): CTAs, active states, key interactive elements
- **Secondary** (#931f33): Supporting UI and secondary actions
- **Accent** (#000000): Accent highlights and badges
- **Surface** (#faf7f5): Page and card backgrounds
- **On surface** (#3d0f17): Primary text on surfaces

## Typography
- **Headlines**: "Cormorant Garamond", serif, 400, 16px
- **Body**: "Cormorant Garamond", serif, 400, 16px
- **Font family**: "Cormorant Garamond", serif (8 observed elements)

## Spacing
- **Scale**: 8px-based
- 16px (4 uses)
- 8px (2 uses)
- 20px (2 uses)

## Components
- **Elevation**: 1 shadow token(s) detected

## Breakpoints
- 600px
- 640px
- 768px
- 1400px

## Do's and Don'ts
- Do reserve the primary color for the most important action per view.
- Do preserve hover/focus states; they are part of the captured component contract.
- Don't invent new font stacks, spacing values, or brand colors without updating tokens.

## Source Artifacts
- `design/design-system.json`: raw computed-style extraction
- `design/tokens.dtcg.json`: W3C Design Tokens compatible export
- `research/DESIGN_TOKENS.md`: clone research summary
- `mirror/`: visual ground truth
- `source/`: editable reconstructed codebase when available
