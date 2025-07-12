# VR Walmart Experience

A 3D VR web experience of a Walmart store built with React, Three.js (via @react-three/fiber), and physics powered by Cannon.js.

## Features

- Minecraft-inspired voxel visual style
- First-person controls (WASD + mouse)
- Interactive product displays
- Product filtering and search
- Popup modals with product details
- Shopping cart functionality
- Voice assistant (mock)
- Ambient lighting and background music

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create required assets directories**:
   ```bash
   mkdir -p public/assets/images public/assets/audio
   ```

3. **Add placeholder audio**:
   You'll need to add an ambient music file at `public/assets/audio/ambient.mp3`.
   If you don't have one, you can download royalty-free music or the app will continue to work without music.

4. **Add placeholder images**:
   Product images should be placed in `public/assets/images/` 
   (e.g., tv.png, apples.png, tshirt.png, etc.)

5. **Run the development server**:
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

## Controls

- **WASD** or **Arrow Keys**: Move
- **Mouse**: Look around
- **Click**: Select products
- **Space**: Jump

## Project Structure

- `src/components/Scene.jsx`: Main Three.js scene setup
- `src/components/Player.jsx`: First-person controller
- `src/components/StoreLayout.jsx`: Store environment
- `src/components/ProductsDisplay.jsx`: Interactive product items
- `src/components/UI.jsx`: Overlay UI components
- `src/store.js`: Global state management with Zustand
- `public/products.json`: Mock product data

## Technologies Used

- React
- Three.js (@react-three/fiber)
- Cannon.js (@react-three/cannon)
- GSAP for animations
- Zustand for state management
