# Step 3: Actions and Inventories

## Actions Overview

Actions in ChainCraft are implemented as components that trigger system responses when added to entities. They follow a reactive pattern where adding an action component to an entity (typically a player) triggers the action system to process that action.

### Core Action System

The action system processes actions by:
1. Detecting when action components are added to entities
2. Looking up the registered handler for the action type
3. Executing the handler with the action parameters

```typescript
// Basic action component structure
interface ActionParams {
    order?: number;  // Execution order if multiple actions
}

// Register the base action component
const registerAction = (world: World<WorldContext>) => {
    world.components.Action = createActionProps();
};
```

### Built-in Actions

#### MoveBetweenInventoriesAction
Moves gamepieces between inventories. Used for:
- Playing cards/pieces from hand to table
- Drawing cards/pieces from deck to hand
- Recovering pieces from table to hand

```typescript
interface MoveBetweenInventoriesParams extends ActionParams {
    sourceInventoryType: number;
    sourceInventoryOwner: number;
    destinationInventoryType: number;
    destinationInventoryOwner: number;
    item: number;
}
```

### Creating and Using Custom Actions

Custom actions extend base action types but maintain their unique component identity. 

Games should create custom actions when:
- Different variations of the same action are needed
- Actions need different parameters
- Actions need different handlers

When creating a custom action:

1. Register the custom action component using the base action's properties
2. Use the base action's `addAction` function to add the custom action to entities

```typescript
// 1. Register custom Play action derived from MoveBetweenInventories
registerCustomActionComponent(
    world,
    "PlayAction",
    world.components.MoveBetweenInventoriesAction,
    {
        sourceInventoryType: InventoryType.PLAYER_HAND,
        destinationInventoryType: InventoryType.TABLE
    }
);

// 2. Add the custom action using the base action's add function
const playPiece = (world: GameWorld, playerId: number, piece: number) => {
    // Use addMoveBetweenInventoriesAction (base action's add function)
    addMoveBetweenInventoriesAction(world, playerId, world.components.PlayAction, {
        sourceInventoryOwner: playerId,
        item: piece,
        destinationInventoryOwner: world.gameId
    });
};
```

Important: Always use the base action's add function (e.g., `addMoveBetweenInventoriesAction`) instead of the generic `addAction` when adding custom actions. This ensures:
- Proper parameter validation
- Correct component initialization
- Appropriate system notification
- Consistent action processing


Example from RPS creating Play and Recover actions:

```typescript
// Register custom Play action
registerCustomActionComponent(
    world,
    "PlayAction",
    world.components.MoveBetweenInventoriesAction,
    {
        sourceInventoryType: InventoryType.PLAYER_HAND,
        destinationInventoryType: InventoryType.TABLE,
        destinationInventoryOwner: world.gameId
    }
);

// Register custom Recover action
registerCustomActionComponent(
    world,
    "RecoverAction",
    world.components.MoveBetweenInventoriesAction,
    {
        sourceInventoryOwner: world.gameId,
        sourceInventoryType: InventoryType.TABLE,
        destinationInventoryType: InventoryType.PLAYER_HAND
    }
);
```

## Inventories

Inventories are relations that associate gamepieces with entities (players, game, or other gamepieces). They manage collections of gamepieces and their ownership.

### Inventory Setup

1. Define inventory types and constraints:
```typescript
// Define allowed types for each inventory
defineInventoryType(world, InventoryType.PLAYER_HAND, [gamepeiceTypeId]);
defineInventoryType(world, InventoryType.TABLE, [gamepieceTypeId]);

// Create inventory for an entity
createInventory(world, entityId, InventoryType.PLAYER_HAND);
```

2. Managing Inventories:
```typescript
// Add gamepiece to inventory
addGamepieceToInventory(
    world, 
    entityId,          // Inventory owner 
    inventoryType,     // Type of inventory
    gamepieceId       // Piece to add
);

// Remove gamepiece from inventory
removeGamepieceFromInventory(
    world,
    entityId,
    inventoryType,
    gamepieceId
);

// Get inventory contents
const pieces = getGamepiecesInInventory(
    world,
    entityId,
    inventoryType
);
```

### Inventory Workflow Example

Common pattern for playing and recovering gamepieces:

```typescript
// Playing a piece
const addPlayAction = (world: GameWorld, playerId: number, pieceType: number) => {
    // Find the piece in player's hand
    const gamepieces = getGamepiecesInInventory(world, playerId, InventoryType.PLAYER_HAND);
    const gamepiece = gamepieces.find(gp => 
        getGamepieceType(world, gp) === pieceType);

    // Add action to move piece to table
    addMoveBetweenInventoriesAction(world, playerId, world.components.PlayAction, {
        sourceInventoryOwner: playerId,
        item: gamepiece
    });
};

// Recovering pieces after play
const addRecoveryActions = (world: GameWorld): void => {
    // Get pieces from table
    const playedPieces = getGamepiecesInInventory(
        world, 
        world.gameId, 
        InventoryType.TABLE
    );

    // Return each piece to its owner
    for (const piece of playedPieces) {
        const owner = getGamepieceOwner(world, piece);
        addMoveBetweenInventoriesAction(world, piece, world.components.RecoverAction, {
            item: piece,
            destinationInventoryOwner: owner
        });
    }
};
```

## Best Practices

1. Action Components
   - Create custom actions for different use cases
   - Use descriptive action names
   - Set default values when registering custom actions
   - Remember only one instance of a component type per entity

2. Inventory Management
   - Define inventory types and constraints early
   - Use inventory type constants
   - Track gamepiece ownership
   - Clean up inventories after use

3. Action Flow
   - Use action components to trigger game events
   - Handle action completion in systems
   - Maintain proper ordering of actions
   - Clean up completed actions

## Example: RPS Turn Flow

```typescript
// 1. Player chooses action
addPlayAction(world, playerId, RPSType.ROCK);

// 2. Action system processes move
// (Automatic via MoveBetweenInventoriesActionHandler)

// 3. Check turn completion
if (isTurnComplete(world)) {
    // 4. Process results
    await notifyOpponentChoices(world);
    
    // 5. Add recovery actions
    await addRecoveryActions(world);
    
    // 6. Clean up
    await reset(world);
}
```