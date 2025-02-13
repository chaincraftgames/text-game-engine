# ChainCraft Game Module Creation Guide

## Module Structure

A game module consists of these key components, which should be implemented in the following order:

1. Game Definition
   - Constants and types
   - World context
   - Game state definitions

2. Component Setup
   - Core component registration
   - Game-specific components
   - Component relationships

3. System Configuration
   - Required system setup
   - Game flow control
   - Player interaction handling

4. Game Logic Implementation
   - Action processing
   - State transitions
   - Scoring and win conditions

## Step 1: Game Definition

### Required Inputs
- Game rules and mechanics
- Number of players
- Game piece types
- Valid player actions

### Expected Outputs
```typescript
// Game module interface implementation
export const maxPlayers: number;
export const createGame: () => number;
export const initializeGame: (gameId: number, players: string[], engine: IEngine) => void;
export const startGame: (gameId: number) => void;
export const getGeneralInstructions: () => string;

// Game-specific types
interface GameWorldContext extends WorldContext {
    playerIds: number[];
    round: number;
    // Add game state properties
}

// Game constants
const GameStates = {
    INIT: 1,
    PLAYING: 2,
    // Add game-specific states
} as const;

const PlayerMessages = {
    CHOOSE_ACTION: 1,
    INVALID_ACTION: 2,
    // Add game-specific messages
} as const;
```

### RPS Example
```typescript
// Constants
export const maxPlayers: number = 2;
const numberOfRounds = 3;
const playerRoleId = 1;

// Game piece types
const RPSType = {
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3
} as const;

// World context
interface RPSWorldContext extends WorldContext {
    playerIds: number[];
    playedGamepieces: number[];
    round: number;
}
```

## Step 2: Component Setup

### Required Inputs
- Game piece types
- Player roles
- Inventory types
- Score tracking needs

### Expected Outputs
```typescript
const registerComponents = (world: GameWorld) => {
    // Core components
    registerPlayerComponents(world);
    registerGamepieceComponents(world);
    registerPlayerMessage(world);
    registerPlayerScore(world);

    // Game-specific components
    registerCustomComponents(world);
};
```

### RPS Example
```typescript
const registerRPSComponents = (world: RPSWorld) => {
    registerPlayerComponents(world);
    registerGamepieceComponents(world);
    registerPlayerMessage(world);
    registerPlayerScore(world);
    
    registerCustomComponent(world, 'GamePieceType', (size) => ({
        type: new Uint8Array(size)
    }));
};
```

## Step 3: System Configuration

### Required Inputs
- State transition rules
- Player input patterns
- Scoring rules
- Turn/round structure

### Expected Outputs
```typescript
const createSystems = (world: GameWorld) => {
    // Game state system
    createGameStateSystem(world, [
        // State transitions
    ]);

    // Player interaction
    createPlayerMessagingSystem(world, messages);
    createPlayerInputSystem(world, inputPatterns);

    // Game mechanics
    createScoringSystem(world, scoringRules);
};
```

### RPS Example
```typescript
const createRPSSystems = (world: RPSWorld) => {
    createGameStateSystem(world, [
        {
            from: GAME_STATE_INIT,
            to: RPSGameState.PLAYING,
            when: (world: RPSWorld) => world.round < numberOfRounds,
            execute: (world: RPSWorld) => {
                startRound(world, ++world.round);
            }
        }
    ]);

    createPlayerInputSystem(world, [
        {
            pattern: /^r$/i,
            action: (world: RPSWorld, playerId: number) => {
                addPlayerMessage(world, playerId, PlayerMessage.YOU_CHOSE_ROCK);
                addPlayAction(world, playerId, RPSType.ROCK);
            }
        }
        // ... more input patterns
    ]);
};
```

## Step 4: Game Logic Implementation

### Required Inputs
- Valid actions
- Win conditions
- State transition logic
- Scoring rules

### Expected Outputs
```typescript
// Action processing
const processAction = (world: GameWorld, playerId: number, action: string) => {
    // Validate and execute action
};

// State management
const updateGameState = (world: GameWorld) => {
    // Check conditions and update state
};

// Win condition checking
const checkWinCondition = (world: GameWorld): boolean => {
    // Evaluate win conditions
};
```

### RPS Example
```typescript
const processRPSRound = async (world: RPSWorld): Promise<void> => {
    if (isTurnComplete(world)) {
        await updatePlayedGamepieces(world);
        await notifyOpponentChoices(world);
        await addRecoveryActions(world);
    }
};

const determineWinner = (world: RPSWorld) => {
    const scores = getPlayerScores(world);
    // ... winner determination logic
};
```