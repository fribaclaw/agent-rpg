# Agent RPG 🎮

A 3D RPG dashboard for configuring [OpenClaw](https://openclaw.ai) agents. Walk around a virtual world as your AI agent and interact with objects to open configuration panels.

![Status](https://img.shields.io/badge/status-proof%20of%20concept-purple)

## Concept

Instead of editing YAML files or navigating settings menus, you control your AI agent as a character in a 3D RPG world. Walk up to objects to configure different aspects of your agent:

- **Soul Chamber** — Edit your agent's identity and personality (SOUL.md)
- **Memory Vault** — Browse and manage agent memory *(coming soon)*
- **Tool Forge** — Configure available tools and permissions *(coming soon)*
- **Channel Hub** — Manage communication channels *(coming soon)*

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look around |
| Click | Capture cursor |
| E | Interact with nearby objects |
| ESC | Release cursor |

## Stack

- React + Vite + TypeScript
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) (Three.js)
- [@react-three/drei](https://github.com/pmndrs/drei) for helpers
- Tailwind CSS for UI panels

## PoC Scope

This is a proof of concept. Current features:
- WASD movement with mouse look and camera follow
- One interactive zone (Soul Chamber) with a glowing crystal
- Config panel overlay with editable SOUL.md content
- Ground plane with grid and placeholder objects for future zones

## License

MIT
