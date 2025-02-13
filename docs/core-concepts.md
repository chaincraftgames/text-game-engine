# ChainCraft Game Engine Core Concepts

## Architecture Overview

ChainCraft is built on an Entity-Component-System (ECS) architecture optimized for text-based games. The engine provides a structured way to manage game state, player interactions, and game rules through composable components and systems.

### Key Abstractions

#### World
The World is the central container for all game state. It maintains:
- Entity registries
- Component data
- System configurations
- Game context

```typescript
interface WorldContext {
    gameId: number;
    inputQueues: Map<number, string[]>;
    outputQueues: Map<number, string[]>;
    components: Record<string, any>;
    systems: Record<string, Function>;
}
```
Implementations are free to extend the world context to add properties specific to the gameplay.  

#### Entities
Entities are unique identifiers that represent distinct game objects. Core entity types:
- Game (singleton representing the game instance)
- Players
- Gamepieces

#### Components
Components are pure data containers attached to entities. They define the properties and state of entities. Examples:
- Player state (active/inactive)
- Inventory contents
- Score tracking
- Action definitions

#### Systems
Systems implement game logic by operating on entities with specific components. Key system types:
- Game State System (manages game flow)
- Player Input System (handles player commands)
- Action System (processes game actions)
- Scoring System (updates scores)
- Trump System (implements comparison/ranking logic)

### Game Lifecycle

1. **Creation**
   - World initialization
   - Component registration
   - System setup
   - Entity configuration

2. **Initialization**
   - Player creation
   - Initial inventory setup
   - Game state initialization

3. **Execution**
   - System orchestration
   - State transitions
   - Player interactions
   - Action processing

4. **Termination**
   - Final scoring
   - Winner determination
   - Cleanup

### Core Mechanics

#### State Management
The engine provides a flexible state machine for managing game flow:
- Defined states (INIT, PLAYING, END)
- State transitions with conditions
- State-specific behaviors

#### Player Interaction
Built-in support for:
- Command processing
- Message queuing
- Player state tracking
- Multi-player coordination

#### Action Processing
Structured approach to handling game actions:
- Action definition
- Validation
- Execution
- Recovery

#### Component Registration
Standardized component registration system:
- Core components
- Custom components
- Component dependencies