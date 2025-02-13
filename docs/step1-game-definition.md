# Step 1: Game Definition

## Overview

A ChainCraft game module is a TypeScript implementation that defines how a text-based game operates within the engine. Each module must implement the `IModule` interface and extend the base `WorldContext` with game-specific state.

## Module Interface Requirements

Every game module must implement these required exports:

```typescript
/** The maximum number of players that can play the game */
export const maxPlayers: number;

/** Creates and configures a new game instance */
export const createGame: () => number;

/** Sets up the game with players and engine interface */
export const initializeGame: (gameId: number, players: string[], engine: IEngine) => void;

/** Begins game execution after initialization */
export const startGame: (gameId: number) => void;

/** Provides game instructions to players */
export const getGeneralInstructions: () => string;
```

## World Context

The game world is the central state container for your game. It maintains all game state, entities, and systems.  Each instance of your game will have it's own world.  All state specific to a game instance 
must live in a game world either directly or through components that are added to entities.

### Base World Context
```typescript
interface WorldContext {
    gameId: number;                                      // Unique identifier for the game instance
    inputQueues: Map<string, IMessageQueue<string>>;     // Player input handling
    outputQueues: Map<string, IMessageQueue<string>>;    // Player message output
    components: Record<string, any>;                     // Component storage
    systems: Record<string, Function>;                   // System storage
    endGame: (gameId: number) => void;                  // Game termination callback
}
```

### Extending World Context
Your game must extend the base context with game-specific properties:

```typescript
interface GameWorldContext extends WorldContext {
    // Add properties needed for your game state
    playerIds: number[];          // Track player entities
    round?: number;              // Track game rounds if needed
    // Add other game-specific state
}

// Create a type alias for your world
type GameWorld = World<GameWorldContext>;
```

Example from RPS:
```typescript
interface RPSWorldContext extends WorldContext {
    playerIds: number[];         // Track player entities
    playedGamepieces: number[];  // Track pieces in play
    round: number;              // Current round number
}
```

## Required Game Constants
These are some constants and types you may need to define for your game.

1. **Player Configuration**
```typescript
// Maximum players allowed in the game
export const maxPlayers: number = 2;

// Player role identifier.  You must define at least one for the players in your game and
// you can define more if you have different roles for players, e.g. with different actions.
const playerRoleId = 1;
```

2. **Game States**
Define the states of your game.  Note that the starting state and end state are provided for you in
`engine.ts`.  
```typescript
const GameStates = {
    PLAYING: 2,   // Active gameplay
    // Add game-specific states
} as const;
```

3. **Player Messages**
The engine includes a system that can send messages to players.  The content of these messages
is fixed and is specified by id.  You will need to supply an array of message texts when you 
setup the system in step 3.
Define message IDs and corresponding text:
```typescript
const PlayerMessages = {
    CHOOSE_ACTION: 1,
    INVALID_ACTION: 2,
    // Add game-specific messages
} as const;

const messageText = [
    "None",  // 0 is unused
    "Please choose your action.",
    "Invalid choice. Try again.",
    // Add message text
];
```

4. **Game Pieces**
Gamepieces represent anything in the game that can be placed, moved, exchanged, played on, etc...
Define types for game pieces if your game uses them:
```typescript
const GamePieceType = {
    TYPE_1: 1,
    TYPE_2: 2,
    // Add game piece types
} as const;
```

## Inventory Types
Gamepieces are held in collections called inventories.  A common action is to move gamepieces
between inventories.  You'll want to define types for any inventories your game uses.
```typescript
enum InventoryType {
    PLAYER_HAND = 1,
    GAME_BOARD = 2,
    // Add game-specific inventory locations
}
```

## Complete Example
Here's how these elements come together, using RPS as an example:

```typescript
// Game constants
export const maxPlayers = 2;
const numberOfRounds = 3;
const playerRoleId = 1;

// Game piece types
const RPSType = {
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3
} as const;

// Game states
const RPSGameState = {
    PLAYING: 2
} as const;

// Inventory locations
enum InventoryType {
    PLAYER_HAND = 1,
    TABLE = 2
}

// World context
interface RPSWorldContext extends WorldContext {
    playerIds: number[];
    playedGamepieces: number[];
    round: number;
}

type RPSWorld = World<RPSWorldContext>;

// World context creation helper
const createWorldContext = (): Partial<RPSWorldContext> => {
    return {
        playerIds: [],
        playedGamepieces: [],
        round: 0
    };
}
```

## Module Lifecycle

### 1. Creation Phase (`createGame`)
This will be called by the engine when a player requests to create a new game.  It
should create the game world, the game entity, all game systems and register all components.  It should 
also determine entity counts.

```typescript
export const createGame = (): number => {
    // 1. Configure entity counts first
    setMaxEntityCount(EntityType.PLAYER, maxPlayers);
    setMaxEntityCount(EntityType.GAMEPIECE, piecesPerPlayer * maxPlayers);

    // 2. Create world with initial context
    const world = createWorld(createWorldContext()) as GameWorld;
    const gameId = createGameEntity(world);
    world.gameId = gameId;
    
    // 3. Register core components before game entity creation
    registerCoreComponents(world);
    
    // 4. Register game-specific components. 
    registerGameComponents(world);

    // 5. Create game systems
    createGameSystems(world);

    return gameId;
}
```

#### Sizing Considerations
- Component arrays are sized based on maximum entity counts
- Must account for all possible entities over game lifetime
- Size impacts memory usage and performance

```typescript
// Example sizing calculation
const maxPlayers = 2;
const piecesPerPlayer = 3;
const maxGamepieces = maxPlayers * piecesPerPlayer;

setMaxEntityCount(EntityType.PLAYER, maxPlayers);
setMaxEntityCount(EntityType.GAMEPIECE, maxGamepieces);
```

### 2. Initialization Phase (`initializeGame`)
This is called by the engine when all players have joined just before starting the game.
It should setup players, gamepieces, inventories, and initialize the game state.  It should
also connect the engine queues and endGame callback to the world.
```typescript
export const initializeGame = (
    gameId: number, 
    players: string[], 
    engine: IEngine
) => {
    // 1. Get world instance
    const world = getGameWorld(gameId) as GameWorld;
    
    // 2. Connect engine interfaces
    world.inputQueues = engine.inputQueues;
    world.outputQueues = engine.outputQueues;
    world.endGame = engine.endGame;

    // 3. Configure game inventories
    defineInventoryTypes(world);
    createGameInventories(world);

    // 4. Create player entities
    createPlayers(world, players);

    // 5. Initialize game state
    initializeGameState(world);
}
```

### 3. Start Phase (`startGame`)
This is called by the engine to start the game.  It should setup the game flow
and start game execution.
```typescript
export const startGame = (gameId: number) => {
    const world = getGameWorld(gameId) as GameWorld;

    // 1. Define system configuration
    const systemConfig: GameSystemsConfig = {
        description: 'Game Systems',
        reactiveSystems: [
            // Register reactive systems first
            createMessageSystem(),
            createActionSystem()
        ],
        managedSystems: {
            // Configure game loop
            description: 'Game Loop',
            type: SystemExecutionType.SEQUENTIAL,
            systems: [
                // Order systems by dependency
                createSystem('Game State', world.systems.GameState),
                createSystem('Player Input', world.systems.PlayerInput),
                // Additional systems...
            ]
        }
    };

    // 2. Start game execution
    execute(
        world,
        systemConfig,
        (world) => getGameState(world) === GAME_STATE_END
    );
}
```


## Next Steps
After defining these foundational elements:
1. Create the world context with game-specific state
2. Register game components (Step 2)
3. Configure game systems (Step 3)
4. Implement game logic (Step 4)