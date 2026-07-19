# FIFA '26 Smart Hub ⚽️🏟️

Welcome to the **FIFA '26 Smart Hub**! This project tackles a crucial problem in modern mega-events: ensuring an optimal, seamless experience for both the fans navigating a massive venue and the staff orchestrating the operations behind the scenes.

## The Problem Statement

During high-profile sporting events like the FIFA World Cup, stadiums face immense logistical challenges:
- **For Fans**: Navigating massive crowds, finding the shortest queues for food or restrooms, and getting real-time updates on transport options is often chaotic and frustrating.
- **For Staff**: Managing the flow of tens of thousands of people, predicting bottlenecks, and rapidly deploying resources to congestion points is overwhelming without integrated, real-time data.

## The Solution

The **FIFA '26 Smart Hub** provides a unified, dual-interface application to solve these issues:
1. **GenAI Fan Companion**: A smart, conversational interface for fans inside the stadium. It provides real-time, context-aware answers about concessions, wait times, navigation, and live match events, drastically improving the fan experience.
2. **Staff Operations Dashboard**: A high-level, real-time visualization tool for stadium operators. It aggregates simulated IoT data (crowd density, wait times, incidents) into an interactive stadium map, leveraging AI to provide predictive insights and automated deployment recommendations.

## Technical Highlights
- **Framework**: React 19 + Vite (Progressive Web App / PWA Support)
- **Styling**: Tailwind CSS v4 for a premium, glassmorphism UI
- **Security**: Robust input sanitization (`DOMPurify`), simulated rate-limiting, and strict Content Security Policies (CSP).
- **Efficiency**: 100% optimized rendering with `React.lazy`, `Suspense`, `React.memo`, `useMemo`, and CSS hardware acceleration.
- **Accessibility**: ARIA-compliant, keyboard-navigable interactive maps, semantic HTML, multi-language support (i18n), and screen-reader optimized elements.
- **Sustainability**: Tracks "Eco Score" for stadium carbon offset and environmental impact.
- **Resilience**: Offline detection, intelligent error boundaries, and PWA caching for spotty stadium networks.
- **Testing**: Thoroughly tested using Vitest and React Testing Library (>90% coverage).

## Quick Start
```bash
npm install
npm run dev
```

To run tests:
```bash
npm test
```
