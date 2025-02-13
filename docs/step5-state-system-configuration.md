# Game State System Configuration Guide

## Overview

The Game State System manages game flow through a flexible state machine implementation. It supports:
- Simple state transitions
- Conditional transitions
- Repeating sequences
- Nested state flows
- State generations for tracking iterations

## State Representation

### State Structure
Each state consists of two parts:
1. Base State: The core state value (defined in transitions)
2. Generation: Automatically appended number tracking iterations

```typescript
// Example state values
101  // Base state 1, generation 1
102  // Base state 1, generation 2
201  // Base state 2, generation 1
```

### Helper Functions
```typescript
// Extract base state from full state value
const baseState = getBaseState(currentState);  // Removes generation

// Pre-defined states
GAME_STATE_INIT  // Initial state (0)
GAME_STATE_END   // Final state (2^32 - 1)
```

## Transition Configuration

### Basic Transition
```typescript
interface Transition {
    from: number;      // Source state
    to: number;        // Destination state
    when?: () => boolean;  // Optional condition
    execute?: () => void;  // Optional action
}

// Example
{
    from: GAME_STATE_INIT,
    to: PLAYING_STATE,
    when: (world) => world.playersReady,
    execute: (world) => startGame(world)
}
```

### Repeat Transition
A repeat transition is a transition that, once triggered, will execute a set of transitions a number of times or until a condition is met.  Fixed repeats will execute until the repeat target state is achieved the specified number of time.

```typescript
interface RepeatTransition extends Transition {
    repeat: {
        times?: number;             // Fixed number of iterations
        until?: () => boolean;      // Dynamic completion condition
    };
    transitions: Transition[];      // Inner transitions
}

// Example: Fixed repeat
{
    from: ROUND_START,
    to: ROUND_END,
    repeat: { times: 3 },          // Exactly 3 rounds
    transitions: [
        // Inner transitions
    ]
}

// Example: Variable repeat
{
    from: TURN_START,
    to: GAME_END,
    repeat: { 
        until: (world) => world.score >= 10 
    },
    transitions: [
        // Inner transitions
    ]
}
```

## Transition Execution Rules

### Evaluation Order
1. Transitions are evaluated in configuration order
2. First matching transition (state + condition) executes
3. Once a repeat transition triggers, only its inner transitions are evaluated
4. After repeat completes, subsequent transitions are evaluated.

### Repeat Transition Flow
1. Initial Trigger:
   - Matches `from` state
   - Evaluates `when` condition (if any)
   - Updates state to `to` value
   - Executes `execute` function (if any)

2. Subsequent Ticks:
   - Only evaluates inner transitions
   - Tracks iterations or condition
   - Continues until completion

### Example: Three-Round Game
```typescript
createGameStateSystem(world, [
    // Start game
    {
        from: GAME_STATE_INIT,
        to: PLAYING_STATE,
        execute: (world) => setupGame(world),
        repeat: { times: 3 },  // Three rounds
        transitions: [
            // Round flow
            {
                from: PLAYING_STATE,
                to: COLLECT_MOVES,
                when: (world) => allPlayersActive(world),
                execute: (world) => requestMoves(world)
            },
            {
                from: COLLECT_MOVES,
                to: RESOLVE_ROUND,
                when: (world) => allMovesCollected(world),
                execute: (world) => resolveRound(world)
            },
            {
                from: RESOLVE_ROUND,
                to: PLAYING_STATE,  // Back to start for next round
                execute: (world) => prepareNextRound(world)
            }
        ]
    },
    // End game after rounds complete
    {
        from: PLAYING_STATE,
        to: GAME_STATE_END,
        when: (world) => allRoundsComplete(world),
        execute: (world) => endGame(world)
    }
]);
```

### State Flow Example
```typescript
// Initial trigger of repeat
Tick 1: GAME_STATE_INIT -> PLAYING_STATE (101)
// First round
Tick 2: PLAYING_STATE (101) -> COLLECT_MOVES (201)
Tick 3: COLLECT_MOVES (201) -> RESOLVE_ROUND (301)
Tick 4: RESOLVE_ROUND (301) -> PLAYING_STATE (102)
// Second round
Tick 5: PLAYING_STATE (102) -> COLLECT_MOVES (202)
Tick 6: COLLECT_MOVES (202) -> RESOLVE_ROUND (302)
Tick 7: RESOLVE_ROUND (302) -> PLAYING_STATE (103)
// Third round
Tick 8: PLAYING_STATE (103) -> COLLECT_MOVES (203)
Tick 9: COLLECT_MOVES (203) -> RESOLVE_ROUND (303)
Tick 10: RESOLVE_ROUND (303) -> PLAYING_STATE (104)
// End game
Tick 11: PLAYING_STATE (104) -> GAME_STATE_END
```

## Best Practices

1. State Definition
   - Use constants for state values
   - Start with GAME_STATE_INIT
   - End with GAME_STATE_END
   - Use meaningful intermediate states

2. Transition Organization
   - Order transitions from most to least specific
   - Group related states in repeats
   - Use clear condition functions
   - Keep execute functions focused

3. Repeat Configuration
   - Choose appropriate repeat type (fixed vs variable)
   - Consider nested repeats for complex flows
   - Ensure proper completion conditions
   - Handle state cleanup in execute functions

4. Error Prevention
   - Define all possible state transitions
   - Include fallback transitions where needed
   - Validate conditions thoroughly
   - Handle edge cases explicitly

## Common Patterns

### Round-Based Games
```typescript
{
    from: GAME_STATE_INIT,
    to: ROUND_START,
    repeat: { times: numberOfRounds },
    transitions: [
        // Round setup
        {
            from: ROUND_START,
            to: PLAYER_TURNS,
            execute: (world) => initializeRound(world)
        },
        // Player turns
        {
            from: PLAYER_TURNS,
            to: ROUND_END,
            when: (world) => allPlayersActed(world),
            execute: (world) => resolveRound(world)
        },
        // Prepare next round
        {
            from: ROUND_END,
            to: ROUND_START,
            execute: (world) => cleanupRound(world)
        }
    ]
}
```

### Turn-Based Games
```typescript
{
    from: GAME_STATE_INIT,
    to: TURN_START,
    repeat: { until: (world) => gameIsComplete(world) },
    transitions: [
        {
            from: TURN_START,
            to: PLAYER_ACTION,
            execute: (world) => startPlayerTurn(world)
        },
        {
            from: PLAYER_ACTION,
            to: TURN_START,
            when: (world) => turnIsComplete(world),
            execute: (world) => nextPlayer(world)
        }
    ]
}
```