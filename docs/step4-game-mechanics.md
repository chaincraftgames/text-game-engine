# Step 4: Game Mechanics

## Trump System Overview

The Trump system provides a flexible mechanism for determining hierarchical relationships between game pieces. It supports:
- Simple dominant value relationships (e.g., Ace trumps all)
- Comparative relationships (e.g., higher/lower value wins)
- Complex matrix-based relationships (e.g., Rock-Paper-Scissors)

### Core Concepts

1. **Trump Rules**
   - Define how game pieces compare to each other
   - Can be chained for tie-breaking
   - Apply to pieces in a specified inventory

2. **Trump Results**
   - Stored as ranks (0 is highest)
   - Applied to game pieces
   - Used by scoring systems

## Trump Rule Types

### 1. Dominant Value Rule
Best for games with a single dominant piece type:

```typescript
// Example: Ace trumps all other cards
const dominantRule = createDominantValueRule(
    (world, entityId) => getGamepieceType(world, entityId),
    ACE_TYPE_ID
);
```

### 2. Comparison Rule
For simple numeric comparisons:

```typescript
// Example: Higher card wins
const comparisonRule = createComparisonRule(
    (world, entityId) => getCardValue(world, entityId),
    true  // true = highest wins, false = lowest wins
);
```

### 3. Matrix Rule
For complex relationships between piece types:

```typescript
// Example: Rock-Paper-Scissors relationships
const matrixRule = createMatrixRule(
    // Value getter function
    (world, entityId) => getComponent(world, entityId, 
        world.components.RPSType)?.rpsType[entityId],
    // Matrix of relationships
    [
        [0, -1, 1],   // Rock:     loses to Paper, beats Scissors
        [1, 0, -1],   // Paper:    beats Rock, loses to Scissors
        [-1, 1, 0]    // Scissors: loses to Rock, beats Paper
    ],
    // Map piece types to matrix indices
    new Map([
        [RPSType.ROCK, 0],
        [RPSType.PAPER, 1],
        [RPSType.SCISSORS, 2]
    ])
);
```

## Trump Rule Chaining

The Trump system supports multiple rules that are applied in order, creating a hierarchy of comparisons. Each rule assigns ranks to game pieces, where:
- Rank 0 indicates the winner(s)
- Rank 1 indicates second place
- and so on...
- Higher ranks indicate lower placement
- Equal ranks indicate ties

For example, in a card game with Spades as trump:

```typescript
// Configure trump system with multiple ordered rules
createTrumpSystem(
    world,
    { 
        owner: world.gameId,
        type: InventoryType.TABLE
    },
    [
        // Rule 1: Spades trump all other suits
        createDominantValueRule(
            (world, entityId) => getCardSuit(world, entityId),
            SPADES_SUIT_ID
        ),
        
        // Rule 2: Within same trump status, higher card wins
        createComparisonRule(
            (world, entityId) => getCardValue(world, entityId),
            true  // highest wins
        )
    ]
);
```

In this example:
1. First rule separates spades (rank 0) from non-spades (rank 1)
2. Second rule orders cards within their rank groups:
   - Among spades: Ace (0) > King (1) > Queen (2) etc.
   - Among non-spades: Ace (1) > King (2) > Queen (3) etc.

So if played cards are:
- Ace of Spades: rank 0 (winner)
- King of Spades: rank 1
- Nine of Hearts: rank 2
- Nine of Clubs: rank 2

## Implementing Trump in Your Game

### 1. Register Required Components

```typescript
const registerGameComponents = (world: GameWorld) => {
    // Register core components...
    
    // Register Trump Results component
    registerTrumpResults(world);
    
    // Register game-specific components...
};
```

### 2. Configure Trump System

```typescript
const createGameSystems = (world: GameWorld) => {
    // Configure trump system with inventory and rules
    createTrumpSystem(
        world,
        { 
            owner: world.gameId,    // Entity owning inventory
            type: InventoryType.TABLE  // Inventory to evaluate
        },
        [
            // Add your trump rules here
            createMatrixRule(/* rule configuration */)
        ]
    );
};
```

### 3. Process Trump Results

```typescript
const evaluateRound = (world: GameWorld) => {
    // Get pieces with highest rank (0)
    const playedPieces = getGamepiecesInInventory(
        world, 
        world.gameId, 
        InventoryType.TABLE
    );
    
    const winningPieces = playedPieces.filter(
        piece => getTrumpResults(world, piece) === 0
    );

    // Handle results
    if (winningPieces.length === 1) {
        // Clear winner
        const winner = getGamepieceOwner(world, winningPieces[0]);
        updatePlayerScore(world, winner, 1);
    } else {
        // Tie - handle according to game rules
    }
};
```

## Example: RPS Trump Implementation

```typescript
// 1. Create the trump rule
const createRPSTrumpRule = () => createMatrixRule(
    // Get piece type
    (world, id) => getComponent(world, id, 
        world.components.RPSType)?.rpsType[id],
    // Define relationships
    [
        [0, -1, 1],   // Rock
        [1, 0, -1],   // Paper
        [-1, 1, 0]    // Scissors
    ],
    // Map types to indices
    new Map([
        [RPSType.ROCK, 0],
        [RPSType.PAPER, 1],
        [RPSType.SCISSORS, 2]
    ])
);

// 2. Configure the system
createTrumpSystem(world,
    { 
        owner: world.gameId, 
        type: InventoryType.TABLE
    },
    [createRPSTrumpRule()]
);

// 3. Use results in scoring
createScoringSystem(world, [{
    evaluate: (world: GameWorld) => {
        const scores = new Map<number, number>();
        const playedPieces = getGamepiecesInInventory(
            world, 
            world.gameId, 
            InventoryType.TABLE
        );
        
        // Find pieces with rank 0 (winners)
        const winningPieces = playedPieces.filter(
            piece => getTrumpResults(world, piece) === 0
        );
        
        if (winningPieces.length === 1) {
            const winner = getGamepieceOwner(world, winningPieces[0]);
            scores.set(winner, 1);
        }
        
        return scores;
    }
}]);
```

## Best Practices

1. Trump Rule Design
   - Keep rules simple and composable
   - Use matrix rules for complex relationships
   - Chain rules for tie-breaking

2. System Integration
   - Configure trump system before scoring
   - Clear trump results between rounds
   - Handle ties explicitly

3. Performance
   - Minimize value getter function complexity
   - Use appropriate rule types
   - Consider inventory size in matrix calculations