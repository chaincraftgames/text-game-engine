# Step 2: Component Setup

## Overview

Components in ChainCraft store game state data and provide controlled access through helper functions. The engine uses a reactive programming model where component changes trigger system responses. Always use the provided helper functions to modify component values to ensure proper system reactions.  Components in ChainCraft are based on a Structure of Typed Arrays model, where each component property is an array of values and each item in the array represents the value for a specific entity.  This is an ECS paradigm intended to maximize efficiency.  

## Component Access Pattern

Many components are added, removed, and updated by systems so a given game may not need to 
interact directly with components.  Should direct access be required, each component follows 
a consistent pattern:

```typescript
// Registration
registerComponent(world: World<WorldContext>)

// Get value
getValue(world: World<WorldContext>, entityId: number): ValueType | undefined

// Set value
setValue(world: World<WorldContext>, entityId: number, value: ValueType)
```

For example, the TrumpResults component:

```typescript
// Registration
registerTrumpResults(world: World<WorldContext>)

// Get rank
getTrumpResults(world: World<WorldContext>, gamepieceId: number): number | undefined

// Set rank
setTrumpResults(world: World<WorldContext>, gamepieceId: number, rank: number)
```

When not using a helper, components should be set when added.  This allows reactive systems to
access the component value when their observers are triggered.  To do this, follow this pattern:
```typescript
addComponent(world, gamepieceId, set(world.components.RPSType, { type }));
// where type is an object containing the component values to be set.
```

## Core Components and Their Helpers

### Player Components

1. **PlayerState** - Tracks player activity status
```typescript
// Registration
registerPlayerState(world)

// Helpers
setActive(world, playerId)           // Mark player as active
setInactive(world, playerId)         // Mark player as inactive
getActive(world, playerId): boolean  // Check if player is active
```

2. **PlayerScore** - Manages scoring
```typescript
// Registration
registerPlayerScore(world)

// Helpers
updatePlayerScore(world, playerId, scoreChange, state)  // Modify score
getPlayerScore(world, playerId): number                 // Get current score
getPlayerScoreState(world, playerId): number           // Get score state
```

3. **PlayerRole** - Defines player roles
```typescript
// Registration
registerPlayerRole(world)

// Helpers
setPlayerRole(world, playerId, role)      // Assign role
getPlayerRole(world, playerId): number    // Get current role
```

### Gamepiece Components

1. **GamepieceType** - Defines piece types
```typescript
// Registration
registerGamepieceType(world)

// Helpers
setGamepieceType(world, gamepieceId, type)   // Set piece type
getGamepieceType(world, gamepieceId): number // Get piece type
```

2. **GamepieceOwner** - Tracks piece ownership
```typescript
// Registration
registerGamepieceOwner(world)

// Helpers
setGamepieceOwner(world, gamepieceId, owner)    // Set owner
getGamepieceOwner(world, gamepieceId): number   // Get owner
```

## Component Registration

Components must be registered before use. After registration, they are accessible via `world.components`.
Each component has it's own registration function; however, for components that are always associated with 
entities, the entities provide a registration function to register all components for the entity type.

```typescript
// Register standard components for entities
registerPlayerComponents(world);
registerGamepieceComponents(world);

// Register an optional component
registerPlayerScore(world);

// Access registered components
world.components.PlayerState
world.components.GamepieceType
```

## Creating Custom Components
Game modules may need to define components that are specific to the gameplay.  
Custom components should follow the same pattern as core components:

```typescript
// Custom component definition
registerCustomComponent(
    world, 
    'RPSType', // The component name
    (size) => {
        return {
            rpsType: new Uint8Array(size)
        }
    } // A function that takes a size and returns an object that contains the component props as a Structure of Typed Arrays or SoTA
);

// After registering, the custom component can be accessed using `world.components.RPSType`.  Note that
// the component should be added, removed, and set using the methods above.
```

## Important Considerations

1. Always use helper functions instead of direct array access
   - Ensures proper change detection
   - Maintains data consistency
   - Enables reactive system responses

2. Component Registration Order
   - Register core components first
   - Register custom components after core components
   - Create observers after registration

3. Component Access Safety
   - Use getter functions to safely access optional components
   - Setter functions handle component creation if needed
   - Helpers provide type safety and validation

## Example: RPS Implementation

```typescript
// Register core and custom components
const setupRPSComponents = (world: RPSWorld) => {
    // Core components
    registerPlayerComponents(world);
    registerGamepieceComponents(world);
    registerPlayerMessage(world);
    registerPlayerScore(world);
    
    // Custom RPS components
    registerCustomComponent(world, 'RPSType', (size) => ({
        type: new Uint8Array(size),
        getName: () => "RPSType"
    }));

    // Helper functions
    const setRPSType = (world: RPSWorld, gamepieceId: number, type: number) => {
        addComponent(world, gamepieceId, set(world.components.RPSType, { type }));
    };

    const getRPSType = (world: RPSWorld, gamepieceId: number): number | undefined => {
        return getComponent(world, gamepieceId, world.components.RPSType)?.type[gamepieceId];
    };
};
```