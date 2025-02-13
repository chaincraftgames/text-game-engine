# Step 7: System Orchestration and Game Execution

## Overview

The ChainCraft engine uses a sophisticated system orchestration model that combines:
- Reactive systems that respond to component changes
- Managed systems that execute on regular ticks
- Hierarchical system grouping with parallel or sequential execution
- Preconditions for conditional execution
- Exit conditions for game termination

## System Types

### Reactive Systems

Reactive systems respond immediately to component changes. They are triggered by:
- Component addition (ADD)
- Component removal (REMOVE)
- Both addition and removal (ADD_REMOVE)

```typescript
// Configure reactive system for player messages
createReactiveSystem(
    'Player Messaging',              // Description
    [world.components.PlayerMessage],// Component to observe
    ReactiveSystemTrigger.ADD,      // Trigger on component add
    world.systems.PlayerMessaging    // System to execute
);

// Using Extends for action components
createReactiveSystem(
    'Action Processing',
    [Extends(world.components.Action)],  // Match any action component
    ReactiveSystemTrigger.ADD,
    world.systems.Action
);
```

### Managed Systems

Managed systems execute on regular engine ticks in a defined order:

```typescript
// Create managed system
createSystem('Player Input', world.systems.PlayerInput);

// Group managed systems
{
    type: SystemExecutionType.SEQUENTIAL,
    description: 'Turn Resolution',
    systems: [
        createSystem('Trump Resolution', world.systems.Trump),
        createSystem('Scoring', world.systems.Scoring)
    ]
}
```

## Execution Types

### Sequential Execution
Systems execute one after another, waiting for each to complete:

```typescript
{
    type: SystemExecutionType.SEQUENTIAL,
    description: 'Turn Resolution',
    systems: [
        createSystem('Step 1', step1System),
        createSystem('Step 2', step2System),  // Waits for Step 1
        createSystem('Step 3', step3System)   // Waits for Step 2
    ]
}
```

### Parallel Execution
Systems execute simultaneously:

```typescript
{
    type: SystemExecutionType.PARALLEL,
    description: 'Independent Resolution Steps',
    systems: [
        createSystem('Process A', processASystem),
        createSystem('Process B', processBSystem)  // Runs with Process A
    ]
}
```

## Conditional Execution

### Preconditions
Control when system groups execute:

```typescript
{
    type: SystemExecutionType.SEQUENTIAL,
    description: 'Turn Resolution',
    precondition: (world) => isTurnComplete(world),  // Only execute if turn is complete
    systems: [
        // Turn resolution systems
    ]
}
```

### Exit Conditions
Determine when game execution should stop:

```typescript
// Exit when game state reaches end
const exitCondition = (world: GameWorld) => 
    getGameState(world) === GAME_STATE_END;
```

## Complete Configuration Example

```typescript
const GameSystemConfig: GameSystemsConfig = {
    description: 'Game Systems',
    // Reactive systems execute immediately on component changes
    reactiveSystems: [
        // Message processing
        createReactiveSystem(
            'Player Messaging',
            [world.components.PlayerMessage],
            ReactiveSystemTrigger.ADD,
            world.systems.PlayerMessaging
        ),
        // Action processing
        createReactiveSystem(
            'Action Processing',
            [Extends(world.components.Action)],
            ReactiveSystemTrigger.ADD,
            world.systems.Action
        )
    ],
    // Managed systems execute on ticks
    managedSystems: {
        description: 'Game Loop',
        type: SystemExecutionType.SEQUENTIAL,
        precondition: (world) => getGameState(world) !== GAME_STATE_END,
        systems: [
            // Core game flow
            createSystem('Game State', world.systems.GameState),
            createSystem('Player Input', world.systems.PlayerInput),
            
            // Turn resolution (only executes when turn is complete)
            {
                type: SystemExecutionType.SEQUENTIAL,
                description: 'Turn Resolution',
                precondition: isTurnComplete,
                systems: [
                    // Parallel independent processes
                    {
                        type: SystemExecutionType.PARALLEL,
                        description: 'Resolution Steps',
                        systems: [
                            createSystem('Trump Resolution', world.systems.Trump),
                            createSystem('Update State', updateGameState)
                        ]
                    },
                    // Sequential cleanup processes
                    {
                        type: SystemExecutionType.SEQUENTIAL,
                        description: 'Cleanup',
                        systems: [
                            createSystem('Recovery', addRecoveryActions),
                            createSystem('Reset', resetState)
                        ]
                    }
                ]
            }
        ]
    }
};
```

## Critical Considerations

1. System Order
   - Reactive systems process immediately
   - Managed systems follow strict ordering
   - Parallel systems must be truly independent
   - Sequential systems must not create circular dependencies

2. Deadlock Prevention
   - Ensure preconditions can be met
   - Avoid circular dependencies
   - Use parallel execution carefully
   - Follow state transitions properly

3. Common Patterns
   - Input → Process → Update → Cleanup
   - Independent processes in parallel
   - Dependent processes in sequence
   - Cleanup after resolution

4. Best Practices
   - Group related systems together
   - Use clear, descriptive names
   - Keep system responsibilities focused
   - Document dependencies between systems
   - Test system flow thoroughly

## Game Execution Flow

```typescript
// Start game execution
execute(
    world,           // Game world
    GameSystemConfig,// System configuration
    exitCondition    // When to stop
);
```

The execution process:
1. Registers reactive systems
2. Begins main game loop
3. On each tick:
   - Checks exit condition
   - Executes managed systems
   - Reactive systems run as needed
4. Continues until exit condition met
5. Cleans up reactive systems

## Example Flow RPS Turn

1. Reactive Systems (Always Monitoring):
   - Player Message System (notifications)
   - Action System (piece movements)

2. Managed Systems (Each Tick):
   ```typescript
   {
       type: SystemExecutionType.SEQUENTIAL,
       systems: [
           // Core Loop
           GameState,        // Check state transitions
           PlayerInput,      // Process new inputs
           
           // Turn Resolution (precondition: turn complete)
           {
               type: SystemExecutionType.SEQUENTIAL,
               precondition: isTurnComplete,
               systems: [
                   // Parallel Resolution
                   {
                       type: SystemExecutionType.PARALLEL,
                       systems: [
                           TrumpResolution,
                           UpdateState
                       ]
                   },
                   // Sequential Cleanup
                   {
                       type: SystemExecutionType.SEQUENTIAL,
                       systems: [
                           RecoveryActions,
                           ResetState
                       ]
                   }
               ]
           }
       ]
   }
   ```