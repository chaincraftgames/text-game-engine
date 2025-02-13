# Step 6: Player Interaction Systems

## Overview

The player interaction systems manage:
1. Player input processing
2. Player message output
3. Action handling

These systems work together to create the game's interactive flow:
- Input System matches player commands to game actions
- Messaging System delivers feedback to players
- Action System processes game actions triggered by input

## Player Input System

The Input System matches player commands against patterns and executes corresponding actions.

### Configuration

```typescript
createPlayerInputSystem(world, [
    {
        // Match exact text 'r' case-insensitive
        pattern: /^r$/i,
        action: (world: GameWorld, playerId: number) => {
            // Add message confirming choice
            addPlayerMessage(world, playerId, PlayerMessage.YOU_CHOSE_ROCK);
            // Add action component to process the choice
            addPlayAction(world, playerId, GamePieceType.ROCK);
        }
    },
    {
        // Match any input not matching valid commands
        pattern: /^(?!r$|p$|s$)/i,
        action: (world: GameWorld, playerId: number) => {
            addPlayerMessage(world, playerId, PlayerMessage.INVALID_CHOICE);
        }
    }
]);
```

### Pattern Types
1. Regular Expressions: For complex pattern matching
```typescript
pattern: /^[1-9]$/,  // Match single digit
```

2. String Literals: For exact matches
```typescript
pattern: "help",     // Match exact word
```

### Best Practices
- Order patterns from most to least specific
- Include fallback pattern for invalid input
- Keep actions focused and simple
- Use action components to trigger game logic
- Add feedback messages in input handlers

## Player Messaging System

The Messaging System manages communication with players.

### Configuration

1. Define message catalog:
```typescript
const playerMessages = [
    "None",                              // 0 is unused
    "Please make your choice.",          // Message ID 1
    "Invalid choice, try again.",        // Message ID 2
    "You win this round!",              // Message ID 3
    "Opponent wins this round!"         // Message ID 4
];

createPlayerMessagingSystem(world, playerMessages);
```

2. Send messages to players:
```typescript
// Add message component to player
addPlayerMessage(world, playerId, MessageId.YOU_WIN_ROUND);
```

### Best Practices
- Start message IDs at 1 (0 is reserved)
- Group related messages together
- Use enum for message ID constants
- Add messages for all game states
- Include error/invalid input messages

## Action System

The Action System processes action components added to entities. It's self-configuring based on registered actions.

### Configuration

```typescript
// Create the action system
createActionSystem(world);
```

### Usage Pattern

1. Register custom actions:
```typescript
// Register custom action derived from MoveBetweenInventories
registerCustomActionComponent(
    world,
    "PlayAction",
    world.components.MoveBetweenInventoriesAction,
    {
        sourceInventoryType: InventoryType.PLAYER_HAND,
        destinationInventoryType: InventoryType.TABLE
    }
);
```

2. Add actions to entities:
```typescript
// Add action using base action's add function
addMoveBetweenInventoriesAction(world, playerId, world.components.PlayAction, {
    sourceInventoryOwner: playerId,
    item: gamepiece
});
```

## Example: Player Turn Flow

```typescript
// 1. Configure input handling
createPlayerInputSystem(world, [
    {
        pattern: /^play ([1-9])$/i,
        action: (world: GameWorld, playerId: number, match: RegExpMatchArray) => {
            const cardNumber = parseInt(match[1]);
            // Confirm action to player
            addPlayerMessage(world, playerId, MessageId.CARD_PLAYED);
            // Add action to process the play
            addPlayAction(world, playerId, cardNumber);
        }
    }
]);

// 2. Define messages
const playerMessages = [
    "None",
    "Your turn - play a card (1-9)",
    "Card played successfully",
    "Invalid card number"
];

// 3. Create messaging system
createPlayerMessagingSystem(world, playerMessages);

// 4. Create action system
createActionSystem(world);
```

## Best Practices

1. Input Processing
   - Validate input before processing
   - Provide clear feedback for invalid input
   - Use regex groups to extract parameters
   - Keep input patterns simple and clear

2. Player Messages
   - Send confirmation for all actions
   - Include error messages
   - Keep messages clear and concise
   - Use consistent message formatting

3. Actions
   - Use custom actions for different purposes
   - Clean up actions after processing
   - Handle action failures gracefully
   - Maintain action order when needed