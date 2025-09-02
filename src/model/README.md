# Model Overview

This folder contains the Phase 2 data structures described in `.agents/データ構造.md`.

- `types.ts`: `CardId`, `GameState`
- `Mana.ts`: `Mana`, `createMana()`
- `Player.ts`: `Player`, `createPlayer()`
- `GameManager.ts`: `GameManager`, immutable helpers and `createGameManager()`
 - `util.ts`: shared `deepClone()` utility for plain objects/arrays

Guideline: Treat all structures as immutable. Use factory functions and `with*` helpers to produce new instances instead of mutating existing ones.
