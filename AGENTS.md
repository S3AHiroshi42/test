# AGENTS.md

This file contains guidelines for agentic coding agents working in this repository.

## Project Overview

This is a Chinese HTML5 game collection platform featuring classic arcade-style games. The project consists of:
- `index.html` - Main game hub/landing page with navigation
- `game1.html` - Dinosaur jumping game (similar to Chrome's T-Rex game)
- `game2.html` - Tic-tac-toe game with AI opponent
- `README.md` - Project documentation (in Chinese)

## Build/Lint/Test Commands

This is a static HTML project with no build system. To test:

```bash
# Serve the project locally (recommended)
python -m http.server 8000
# or
npx serve .

# Open in browser
open http://localhost:8000

# For individual game testing
open http://localhost:8000/game1.html  # Dinosaur game
open http://localhost:8000/game2.html  # Tic-tac-toe
```

## Code Style Guidelines

### HTML Structure
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, etc.)
- All pages use Traditional Chinese (`zh-HK` or `zh-TW`)
- Include proper viewport meta tag for responsiveness
- Use external CDN for Font Awesome icons and Google Fonts

### CSS Guidelines
- Use modern CSS features (Grid, Flexbox, CSS variables)
- Mobile-first responsive design with media queries
- Consistent color scheme: gradients using `#ff0080` (pink) and `#00ffcc` (cyan)
- Backdrop filters and glassmorphism effects
- Smooth transitions and animations (0.3s ease typical)
- Use CSS custom properties for repeated values

### JavaScript Conventions
- Modern ES6+ syntax (const/let, arrow functions, template literals)
- Event delegation for dynamic content
- Local storage for persistent game data
- Canvas API for game rendering
- 60 FPS game loops using `setInterval`
- Proper game state management

### Naming Conventions
- **CSS Classes**: kebab-case (`.game-container`, `.player-score`)
- **JavaScript Variables**: camelCase (`currentPlayer`, `gameBoard`)
- **JavaScript Functions**: camelCase with descriptive verbs (`updateScore()`, `drawGame()`)
- **HTML IDs**: kebab-case (`#game-board`, `#current-player`)
- **File Names**: lowercase with hyphens (not applicable to current structure)

### Error Handling
- Always validate game state before moves
- Provide clear user feedback for invalid actions
- Use try-catch for localStorage operations
- Graceful degradation for unsupported features

### Performance Guidelines
- Optimize canvas rendering with clearRect()
- Debounce resize events
- Use requestAnimationFrame for smooth animations when appropriate
- Minimize DOM queries by caching elements

### Internationalization
- All user-facing text in Traditional Chinese
- Use Unicode characters for game symbols (🦖, 🔘, ✕, 🐸)
- Ensure proper font loading for Chinese characters

## File Organization

```
/
├── index.html          # Main landing page with game navigation
├── game1.html          # Dinosaur jumping game
├── game2.html          # Tic-tac-toe game
├── README.md           # Project documentation
└── AGENTS.md           # This file
```

## Game-Specific Guidelines

### Dinosaur Game (game1.html)
- Canvas-based 2D game with 60 FPS
- Progressive difficulty system with levels
- Local storage for high scores
- Keyboard controls (spacebar) with mobile button fallback
- Obstacle generation with intelligent spacing

### Tic-Tac-Toe (game2.html)
- Grid-based game board (3x3)
- AI opponent with configurable difficulty
- Score tracking across sessions
- Visual win detection with line drawing
- Player vs Computer gameplay

## Browser Compatibility

Target modern browsers (Chrome 90+, Firefox 88+, Safari 14+). Features used:
- Canvas 2D API
- CSS Grid and Flexbox
- Local Storage API
- Modern JavaScript (ES6+)

## Testing Checklist

When making changes:
1. Test all games in both desktop and mobile viewports
2. Verify game state persistence (localStorage)
3. Check responsive design at 768px and 480px breakpoints
4. Test keyboard and touch controls
5. Verify all Chinese text displays correctly
6. Check game animations and transitions are smooth

## Common Pitfalls to Avoid

- Don't use inline styles or scripts in HTML
- Avoid hardcoding dimensions that break responsiveness
- Don't forget to prevent default browser behaviors for game controls
- Always clean up intervals and event listeners when games end
- Be careful with canvas coordinate systems and scaling

## Adding New Games

When adding new games:
1. Follow existing naming pattern (`game3.html`, etc.)
2. Include game in main navigation on `index.html`
3. Use consistent styling and fonts
4. Implement proper game state management
5. Add Chinese instructions and interface
6. Test on both desktop and mobile devices