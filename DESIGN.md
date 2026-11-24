---
name: TerraVigil Karhutla Intelligence
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#e0c0b1'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#a78b7d'
  outline-variant: '#584237'
  surface-tint: '#ffb690'
  primary: '#ffb690'
  on-primary: '#552100'
  primary-container: '#f97316'
  on-primary-container: '#582200'
  inverse-primary: '#9d4300'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#ff6a64'
  on-tertiary-container: '#6c000b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbca'
  primary-fixed-dim: '#ffb690'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#783200'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: '0'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.04em
  metric-display:
    fontFamily: JetBrains Mono
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
The design system delivers an operational intelligence interface engineered for mission-critical environmental preservation and peatland hydrological monitoring. Targeted at field rangers, disaster mitigation officers (BPBD/BNPB), environmental scientists, and regional command centers, the system prioritizes instant situational awareness, absolute visual clarity under high cognitive load, and immediate hazard triage.

Drawing from modern high-performance telemetry consoles and technical utility interfaces, the style pairs deep slate-charcoal tonal layering with razor-sharp instrumentation. It avoids superficial ornament in favor of data-dense layouts, tactile status indicators, and unambiguous alert states. The visual hierarchy communicates immediate readiness, transitioning smoothly from serene baseline equilibrium to high-urgency suppression commands without disorienting the operator.

## Colors
The color foundation is built on an ultra-deep charcoal slate palette (`#0F172A` as base ground with stepped containers at `#1E293B` and `#334155`), providing maximum optical contrast for luminescence-based alert levels without causing eye fatigue during 24/7 watch shifts.

The status signaling system follows strict environmental tri-state semantics:
- **Alert / Bahaya (Tertiary):** `#EF4444` (Crimson Fire). Reserved strictly for active fire hotspots, peat moisture collapse below ignition thresholds, and critical battery/connectivity failures.
- **Warning / Waspada (Primary):** `#F97316` (Combustion Amber/Orange). Applied to elevated groundwater drawdown, spiking canopy temperatures, and high Fire Weather Index (FWI) ratings.
- **Safe / Aman (Secondary):** `#10B981` (Peatland Emerald). Used for stable groundwater tables, safe soil moisture, normal weather conditions, and verified operational sensor nodes.

Neutral text steps down from `#F8FAFC` (pure readability for metrics) through `#94A3B8` (subtitles, axis labels) to `#475569` (disabled markers, subtle gridlines). Vibrant accents must never be used decoratively; color presence always denotes operational state.

## Typography
Typography is separated strictly into three functional tiers:
1. **Structural & Spatial (`Space Grotesk`):** Delivers clean, technical character to high-level headers, sector names, and situational briefs.
2. **Operational Body (`Hanken Grotesk`):** Provides high legibility at micro and regular body sizes for logs, observation reports, and incident management instructions.
3. **Telemetry & Sensor Data (`JetBrains Mono`):** Dedicated to all numerical readout formats, geo-coordinates (lat/long), timestamp intervals, battery milliamp ratings, and sensor telemetry cards. Monospaced rendering ensures numerical jitter does not cause layout shifts during real-time web-socket stream refreshes.

## Layout & Spacing
The layout architecture leverages a 12-column adaptive fluid grid engineered for real-time monitoring multi-pane environments. 

- **Desktop (1280px+):** 12 columns with 24px (`gutter-lg`) gutters and 32px (`margin-lg`) canvas padding. Optimized for split telemetry: a dynamic 8-column geospatial map view paired with a 4-column telemetry card stream and real-time alert feed.
- **Tablet (768px - 1279px):** 8 columns with 16px (`gutter`) gutters and 24px (`margin-md`) padding. Sidebars collapse to icon rails; telemetry cards stack in 2x2 grids above sensor data tables.
- **Mobile (< 768px):** 4 columns with 16px margins. Telemetry arrays shift into horizontal carousels or collapsible accordions to ensure critical alert cards occupy the first viewport screenfold.

Micro-spacing strictly follows a 4px base rhythm (`space-xs` through `space-xl`), ensuring compact density within sensor cards without visual overcrowding.

## Elevation & Depth
Depth is constructed through flat, luminous surface tiers and hairline contrast borders rather than heavy blur shadows, maintaining clarity across field-grade rugged monitors and low-brightness displays:

- **Surface 0 (Canvas Base):** `#090D16` deep void background.
- **Surface 1 (Card/Container Panels):** `#111827` overlaid with a 1px structural stroke of `#1E293B`.
- **Surface 2 (Interactive Modules, Flyouts, Drawers):** `#1E293B` bounded by `#334155`.
- **Surface 3 (Overlays, Modals, Critical Warnings):** `#1F293D` accompanied by a localized ambient warning aura: 
  - *Alert Aura:* `0 0 24px -4px rgba(239, 68, 68, 0.25)`
  - *Warning Aura:* `0 0 24px -4px rgba(249, 115, 22, 0.2)`
  - *Nominal Aura:* `0 0 16px -4px rgba(16, 185, 129, 0.15)`

Hairline borders (1px) define spatial segregation, ensuring distinct widget containment without relying on high-contrast dividers that distract the eye.

## Shapes
The design system employs a soft technical corner profile (`roundedness: 1`). Baseline elements (sensor cards, tabular cells, telemetry panels) use 4px (`0.25rem`) border radii, while larger flyout modals and map overlays utilize 8px (`0.5rem`).

This restrained geometry preserves the industrial, precision-instrument aesthetic of environmental monitoring gear, avoiding casual pill shapes or playful softness. Badges and status pills feature a maximum of 4px radius with monospace labels to reinforce technical instrumentation.

## Components

### Telemetry & Sensor Cards
Compact, high-density blocks displaying vital IoT metrics (Water Table Depth [TMA], Peat Soil Moisture [%], Soil Temp [°C], and Ambient Air Quality [PM2.5/AQI]). Each card features:
- Top rail: Sensor identifier, last ping timestamp (`label-sm`), and a pulsing real-time sync beacon.
- Center: Large reading in `metric-display` accompanied by metric unit in `label-md`.
- Base: Micro inline historical sparkline (24-hour horizon) color-graded according to status bands.

### Buttons & Operational Triggers
- **Primary Action (Emergency Dispatch, Water Bombing Callout):** Filled Crimson `#EF4444` or Amber `#F97316` with dark slate text, high weight, and uppercase styling.
- **Secondary Action (Filter, Calibrate Sensor):** Dark Slate `#1E293B` background with `#E2E8F0` text and 1px border `#334155`.
- **Icon Actions (Refresh, Zoom to Hotspot):** 36x36px square containers with 4px border-radius, responding with instant background shifts on hover.

### Status Indicators & Chips
Compact badges with a standardized structure: 6px live status dot + Monospace text (`AMAN`, `WASPADA`, `BAHAYA`).
- **Aman Chip:** `#064E3B` background, `#34D399` text, solid emerald ping.
- **Waspada Chip:** `#7C2D12` background, `#FB923C` text, solid amber ping.
- **Bahaya Chip:** `#7F1D1D` background, `#F87171` text, animated ping ring effect.

### Data Tables & Sensor Registries
Dense tabular views built for rapid parsing across hundreds of IoT node telemetry lines:
- Row height fixed to 40px for data density.
- Alternate row striping using subtle alpha steps (`rgba(255,255,255,0.02)`).
- Monospaced alignments: all numbers, battery voltages, and coordinate points right-aligned; status tags centered.
- Inline mini-progress gauges indicating battery health and GSM/LoRa signal strength (RSSI dBm).

### Form Controls & Threshold Inputs
Inputs and range sliders feature dark charcoal fields `#0F172A`, bordered by `#334155`. Focus states trigger a sharp 1px glow in Amber `#F97316`. Checkboxes and radios are square with technical cross-check ticks rather than soft round fills.