# ChainCraft Engine API Reference



**ChainCraft Text Game Engine API**


# Enumeration: EntityType

Defined in: ChainCraft/text-game-engine/src/core/EntitySizingConfig.ts:1

## Enumeration Members

### GAME

> **GAME**: `"game"`

Defined in: ChainCraft/text-game-engine/src/core/EntitySizingConfig.ts:2


### GAMEPIECE

> **GAMEPIECE**: `"gamepiece"`

Defined in: ChainCraft/text-game-engine/src/core/EntitySizingConfig.ts:4


### PLAYER

> **PLAYER**: `"player"`

Defined in: ChainCraft/text-game-engine/src/core/EntitySizingConfig.ts:3

**ChainCraft Text Game Engine API**


# Function: getMaxEntityCount()

> **getMaxEntityCount**(): `number`

Defined in: ChainCraft/text-game-engine/src/core/EntitySizingConfig.ts:16

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: setMaxEntityCount()

> **setMaxEntityCount**(`entityType`, `maxEntityCount`): `void`

Defined in: ChainCraft/text-game-engine/src/core/EntitySizingConfig.ts:12

## Parameters

### entityType

`string`

### maxEntityCount

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# EntitySizingConfig

## Enumerations

- EntityType

## Functions

- getMaxEntityCount
- setMaxEntityCount

**ChainCraft Text Game Engine API**


# Interface: IEngine

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:5

## Properties

### inputQueues

> **inputQueues**: `Map`\<`string`, `IMessageQueue`\<`string`\>\>

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:6


### outputQueues

> **outputQueues**: `Map`\<`string`, `IMessageQueue`\<`string`\>\>

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:7

## Methods

### endGame()

> **endGame**(`gameId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:8

#### Parameters

##### gameId

`number`

#### Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: IModule

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:12

The interface for any text game supported by the engine.

## Properties

### maxPlayers

> **maxPlayers**: `number`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:14

The maximum number of players that can play the game.

## Methods

### createGame()

> **createGame**(): `number`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:19

Create the game world and return the gameId for the game.

#### Returns

`number`


### getGeneralInstructions()

> **getGeneralInstructions**(): `string`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:39

Return the general instructions for the game, e.g. how to play, what the goal is, etc.

#### Returns

`string`


### getSpecificInstructions()

> **getSpecificInstructions**(`gameId`, `playerId`): `string`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:45

Get instructions specific to the current game state, e.g. the current game status,
what the player can do next.

#### Parameters

##### gameId

`number`

##### playerId

`string`

#### Returns

`string`


### initializeGame()

> **initializeGame**(`gameId`, `players`, `engine`): `void`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:28

Initializes the game with the specified players.  This should setup the game world
and any other necessary state.

#### Parameters

##### gameId

`number`

The id of the game.

##### players

`string`[]

The players that will be playing the game.

##### engine

`IEngine`

The api for interacting with the game engine.

#### Returns

`void`


### onPlayerAction()

> **onPlayerAction**(`gameId`, `playerId`, `action`): `void`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:55

Take an action in the game.

#### Parameters

##### gameId

`number`

The id of the game.

##### playerId

`string`

The id of the player making the move.

##### action

`string`

The action the player is taking.  This will be a string that the 
              module will interpret based on the game rules.

#### Returns

`void`

#### Throws

An error if the action is invalid.


### startGame()

> **startGame**(`gameId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:34

Start the game.  This will be called after all players have joined the game and the 
game is initialized.

#### Parameters

##### gameId

`number`

#### Returns

`void`

**ChainCraft Text Game Engine API**


# Type Alias: InvalidActionError

> **InvalidActionError**: `Error`

Defined in: ChainCraft/text-game-engine/src/core/IModule.ts:3

**ChainCraft Text Game Engine API**


# IModule

## Interfaces

- IEngine
- IModule

## Type Aliases

- InvalidActionError

**ChainCraft Text Game Engine API**


# Function: addGamepieceToInventory()

> **addGamepieceToInventory**(`world`, `entityId`, `inventoryType`, `gamepieceId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:69

Adds a gamepiece to the specified inventory

## Parameters

### world

`World`\<`WorldContext`\>

### entityId

`number`

### inventoryType

`number`

### gamepieceId

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: createInventory()

> **createInventory**(`world`, `entity`, `inventoryType`): `Inventory`

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:50

Creates an inventory for the specified type

## Parameters

### world

`World`

### entity

`number`

### inventoryType

`number`

## Returns

`Inventory`

**ChainCraft Text Game Engine API**


# Function: defineInventoryType()

> **defineInventoryType**(`world`, `typeId`, `allowedItemTypes`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:34

## Parameters

### world

`World`

### typeId

`number`

### allowedItemTypes

`number`[]

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: getGamepiecesInInventory()

> **getGamepiecesInInventory**(`world`, `entityId`, `inventoryType`): `number`[]

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:99

Get the gamepieces in the inventory

## Parameters

### world

`World`

### entityId

`number`

### inventoryType

`number`

## Returns

`number`[]

**ChainCraft Text Game Engine API**


# Function: getInventory()

> **getInventory**(`world`, `entityId`, `inventoryType`): `undefined` \| `Inventory`

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:30

## Parameters

### world

`World`

### entityId

`number`

### inventoryType

`number`

## Returns

`undefined` \| `Inventory`

**ChainCraft Text Game Engine API**


# Function: getInventoryConstraints()

> **getInventoryConstraints**(`world`, `typeId`): `number`[]

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:64

## Parameters

### world

`World`

### typeId

`number`

## Returns

`number`[]

**ChainCraft Text Game Engine API**


# Function: removeGamepieceFromInventory()

> **removeGamepieceFromInventory**(`world`, `entityId`, `inventoryType`, `gamepieceId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/Inventory.ts:86

Removes a gamepiece from the specified inventory

## Parameters

### world

`World`

### entityId

`number`

### inventoryType

`number`

### gamepieceId

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/Inventory

## Functions

- addGamepieceToInventory
- createInventory
- defineInventoryType
- getGamepiecesInInventory
- getInventory
- getInventoryConstraints
- removeGamepieceFromInventory

**ChainCraft Text Game Engine API**


# Function: addAction()

> **addAction**\<`T`\>(`world`, `entity`, `component`, `params`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/Action.ts:21

## Type Parameters

• **T** *extends* `ActionParams`

## Parameters

### world

`World`\<`WorldContext`\>

### entity

`number`

### component

`any`

### params

`T`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: registerAction()

> **registerAction**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/Action.ts:17

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: ActionParams

Defined in: ChainCraft/text-game-engine/src/core/components/actions/Action.ts:4

## Extended by

- `MoveBetweenInventoriesParams`

## Properties

### order?

> `optional` **order**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/Action.ts:5

**ChainCraft Text Game Engine API**


# components/actions/Action

## Interfaces

- ActionParams

## Functions

- addAction
- registerAction

**ChainCraft Text Game Engine API**


# Function: addMoveBetweenInventoriesAction()

> **addMoveBetweenInventoriesAction**(`world`, `entity`, `component`, `params`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:55

## Parameters

### world

`World`\<`WorldContext`\>

### entity

`number`

### component

`any`

### params

`Partial`\<`MoveBetweenInventoriesParams`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: registerMoveBetweenInventoriesAction()

> **registerMoveBetweenInventoriesAction**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:37

Register component with a world

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: MoveBetweenInventoriesParams

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:28

## Extends

- `ActionParams`

## Properties

### destinationInventoryOwner

> **destinationInventoryOwner**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:32


### destinationInventoryType

> **destinationInventoryType**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:31


### item

> **item**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:33


### order?

> `optional` **order**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/Action.ts:5

#### Inherited from

`ActionParams`.`order`


### sourceInventoryOwner

> **sourceInventoryOwner**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:30


### sourceInventoryType

> **sourceInventoryType**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/actions/MoveBetweenInventoriesAction.ts:29

**ChainCraft Text Game Engine API**


# components/actions/MoveBetweenInventoriesAction

## Interfaces

- MoveBetweenInventoriesParams

## Functions

- addMoveBetweenInventoriesAction
- registerMoveBetweenInventoriesAction

**ChainCraft Text Game Engine API**


# Function: getGamepieceOwner()

> **getGamepieceOwner**(`world`, `gamepieceId`): `undefined` \| `number`

Defined in: ChainCraft/text-game-engine/src/core/components/gamepiece/GamepieceOwner.ts:22

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceId

`number`

## Returns

`undefined` \| `number`

**ChainCraft Text Game Engine API**


# Function: registerGamepieceOwner()

> **registerGamepieceOwner**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/gamepiece/GamepieceOwner.ts:9

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setGamepieceOwner()

> **setGamepieceOwner**(`world`, `gamepieceId`, `owner`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/gamepiece/GamepieceOwner.ts:13

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceId

`number`

### owner

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/gamepiece/GamepieceOwner

## Functions

- getGamepieceOwner
- registerGamepieceOwner
- setGamepieceOwner

**ChainCraft Text Game Engine API**


# Function: getGamepieceType()

> **getGamepieceType**(`world`, `gamepieceId`): `number`

Defined in: ChainCraft/text-game-engine/src/core/components/gamepiece/GamepieceType.ts:17

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceId

`number`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: registerGamepieceType()

> **registerGamepieceType**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/gamepiece/GamepieceType.ts:9

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setGamepieceType()

> **setGamepieceType**(`world`, `gamepieceId`, `type`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/gamepiece/GamepieceType.ts:13

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceId

`number`

### type

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/gamepiece/GamepieceType

## Functions

- getGamepieceType
- registerGamepieceType
- setGamepieceType

**ChainCraft Text Game Engine API**


# Function: addPlayerMessage()

> **addPlayerMessage**(`world`, `playerId`, `messageId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerMessage.ts:21

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

### messageId

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: getPlayerMessage()

> **getPlayerMessage**(`world`, `playerId`): `undefined` \| `number`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerMessage.ts:26

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`undefined` \| `number`

**ChainCraft Text Game Engine API**


# Function: registerPlayerMessage()

> **registerPlayerMessage**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerMessage.ts:14

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: PlayerMessageParams

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerMessage.ts:10

## Properties

### message?

> `optional` **message**: `number`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerMessage.ts:11

**ChainCraft Text Game Engine API**


# components/player/PlayerMessage

## Interfaces

- PlayerMessageParams

## Functions

- addPlayerMessage
- getPlayerMessage
- registerPlayerMessage

**ChainCraft Text Game Engine API**


# Function: getPlayerName()

> **getPlayerName**(`world`, `playerId`): `undefined` \| `string`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerName.ts:18

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`undefined` \| `string`

**ChainCraft Text Game Engine API**


# Function: registerPlayerName()

> **registerPlayerName**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerName.ts:9

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setPlayerName()

> **setPlayerName**(`world`, `playerId`, `name`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerName.ts:13

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

### name

`string`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/player/PlayerName

## Functions

- getPlayerName
- registerPlayerName
- setPlayerName

**ChainCraft Text Game Engine API**


# Function: getPlayerRole()

> **getPlayerRole**(`world`, `playerId`): `number`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerRole.ts:16

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: registerPlayerRole()

> **registerPlayerRole**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerRole.ts:8

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setPlayerRole()

> **setPlayerRole**(`world`, `playerId`, `role`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerRole.ts:12

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

### role

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/player/PlayerRole

## Functions

- getPlayerRole
- registerPlayerRole
- setPlayerRole

**ChainCraft Text Game Engine API**


# Function: getPlayerScore()

> **getPlayerScore**(`world`, `playerId`): `undefined` \| `number`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerScore.ts:42

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`undefined` \| `number`

**ChainCraft Text Game Engine API**


# Function: getPlayerScoreState()

> **getPlayerScoreState**(`world`, `playerId`): `undefined` \| `number`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerScore.ts:47

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`undefined` \| `number`

**ChainCraft Text Game Engine API**


# Function: registerPlayerScore()

> **registerPlayerScore**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerScore.ts:14

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: updatePlayerScore()

> **updatePlayerScore**(`world`, `playerId`, `scoreChange`, `state`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerScore.ts:28

Updates the player score

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

### scoreChange

`number`

The amount to add to (or subtract from if negative) the player's score.

### state

`number`

The state when the score was last updated.

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/player/PlayerScore

## Functions

- getPlayerScore
- getPlayerScoreState
- registerPlayerScore
- updatePlayerScore

**ChainCraft Text Game Engine API**


# Function: getActive()

> **getActive**(`world`, `playerId`): `boolean`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerState.ts:25

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`boolean`

**ChainCraft Text Game Engine API**


# Function: registerPlayerState()

> **registerPlayerState**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerState.ts:13

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setActive()

> **setActive**(`world`, `playerId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerState.ts:17

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setInactive()

> **setInactive**(`world`, `playerId`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/PlayerState.ts:21

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/player/PlayerState

## Functions

- getActive
- registerPlayerState
- setActive
- setInactive

**ChainCraft Text Game Engine API**


# Function: getTurnOrder()

> **getTurnOrder**(`world`, `playerId`): `undefined` \| `number`

Defined in: ChainCraft/text-game-engine/src/core/components/player/TurnOrder.ts:16

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

## Returns

`undefined` \| `number`

**ChainCraft Text Game Engine API**


# Function: registerTurnOrder()

> **registerTurnOrder**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/TurnOrder.ts:8

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setTurnOrder()

> **setTurnOrder**(`world`, `playerId`, `turnOrder`): `void`

Defined in: ChainCraft/text-game-engine/src/core/components/player/TurnOrder.ts:12

## Parameters

### world

`World`\<`WorldContext`\>

### playerId

`number`

### turnOrder

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# components/player/TurnOrder

## Functions

- getTurnOrder
- registerTurnOrder
- setTurnOrder

**ChainCraft Text Game Engine API**


# Function: Or()

> **Or**(...`components`): `any`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:181

## Parameters

### components

...`any`[]

## Returns

`any`

**ChainCraft Text Game Engine API**


# Function: addComponent()

> **addComponent**(`world`, `entity`, `component`): `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:136

Components

## Parameters

### world

`World`\<`WorldContext`\>

### entity

`number`

### component

`any`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: addEntity()

> **addEntity**(`world`): `number`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:127

Entities

## Parameters

### world

`World`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: createRelation()

> **createRelation**\<`T`\>(`options`): `Relation`\<`T`\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:166

Relations

## Type Parameters

• **T**

## Parameters

### options

#### autoRemoveSubject?

`boolean`

#### exclusive?

`boolean`

#### onTargetRemoved?

`OnTargetRemovedCallback`

#### store?

() => `T`

## Returns

`Relation`\<`T`\>

**ChainCraft Text Game Engine API**


# Function: createWorld()

> **createWorld**\<`T`\>(`context`): `World`\<`T`\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:84

## Type Parameters

• **T** *extends* `WorldContext`

## Parameters

### context

## Returns

`World`\<`T`\>

**ChainCraft Text Game Engine API**


# Function: deleteWorld()

> **deleteWorld**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:121

## Parameters

### world

`World`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: getAllEntities()

> **getAllEntities**(`world`): `number`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:124

## Parameters

### world

`World`

## Returns

`number`[]

**ChainCraft Text Game Engine API**


# Function: getBaseState()

> **getBaseState**(`stateId`): `number`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:257

## Parameters

### stateId

`number`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: getComponent()

> **getComponent**(`world`, `entity`, `component`): `any`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:157

## Parameters

### world

`World`

### entity

`number`

### component

`any`

## Returns

`any`

**ChainCraft Text Game Engine API**


# Function: getEntityComponents()

> **getEntityComponents**(`world`, `entity`): `any`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:130

## Parameters

### world

`World`

### entity

`number`

## Returns

`any`[]

**ChainCraft Text Game Engine API**


# Function: getGameState()

> **getGameState**(`world`): `number`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:242

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: getRelationTargets()

> **getRelationTargets**\<`T`\>(`world`, `entity`, `relation`): `number`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:173

## Type Parameters

• **T**

## Parameters

### world

`World`

### entity

`number`

### relation

`Relation`\<`T`\>

## Returns

`number`[]

**ChainCraft Text Game Engine API**


# Function: getStateGeneration()

> **getStateGeneration**(`stateId`): `number`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:256

## Parameters

### stateId

`number`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: getWorldComponents()

> **getWorldComponents**(`world`): `any`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:122

## Parameters

### world

`World`

## Returns

`any`[]

**ChainCraft Text Game Engine API**


# Function: hasComponent()

> **hasComponent**(`world`, `entity`, `component`): `boolean`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:145

## Parameters

### world

`World`

### entity

`number`

### component

`any`

## Returns

`boolean`

**ChainCraft Text Game Engine API**


# Function: isCompleted()

> **isCompleted**(`world`, `ref`): `boolean`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:112

## Parameters

### world

`World`\<`WorldContext`\>

### ref

`string`

## Returns

`boolean`

**ChainCraft Text Game Engine API**


# Function: observe()

> **observe**(`world`, `hook`, `callback`): () => `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:188

## Parameters

### world

`World`\<`WorldContext`\>

### hook

#### [$opTerms]

`any`[]

#### [$opType]

`"add"` \| `"remove"` \| `"set"` \| `"get"`

### callback

`ObserverCallback`

## Returns

`Function`

### Returns

`void`

**ChainCraft Text Game Engine API**


# Function: observeGameState()

> **observeGameState**(`world`, `callback`): () => `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:246

## Parameters

### world

`World`\<`WorldContext`\>

### callback

`GameStateChangeCallback`

## Returns

`Function`

### Returns

`void`

**ChainCraft Text Game Engine API**


# Function: onAdd()

> **onAdd**(...`terms`): `object`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:182

## Parameters

### terms

...`any`[]

## Returns

`object`

### \[$opTerms\]

> **\[$opTerms\]**: `any`[]

### \[$opType\]

> **\[$opType\]**: `"add"` \| `"remove"` \| `"set"` \| `"get"`

**ChainCraft Text Game Engine API**


# Function: onRemove()

> **onRemove**(...`terms`): `object`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:183

## Parameters

### terms

...`any`[]

## Returns

`object`

### \[$opTerms\]

> **\[$opTerms\]**: `any`[]

### \[$opType\]

> **\[$opType\]**: `"add"` \| `"remove"` \| `"set"` \| `"get"`

**ChainCraft Text Game Engine API**


# Function: onSet()

> **onSet**(...`terms`): `object`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:184

## Parameters

### terms

...`any`[]

## Returns

`object`

### \[$opTerms\]

> **\[$opTerms\]**: `any`[]

### \[$opType\]

> **\[$opType\]**: `"add"` \| `"remove"` \| `"set"` \| `"get"`

**ChainCraft Text Game Engine API**


# Function: query()

> **query**(`world`, `components`): `number`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:180

Query

## Parameters

### world

`World`

### components

`any`[]

## Returns

`number`[]

**ChainCraft Text Game Engine API**


# Function: removeComponent()

> **removeComponent**(`world`, `entity`, `component`): `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:151

## Parameters

### world

`World`

### entity

`number`

### component

`any`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: resetWorld()

> **resetWorld**(`world`): `World`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:120

World

## Parameters

### world

`World`

## Returns

`World`

**ChainCraft Text Game Engine API**


# Function: set()

> **set**\<`T`\>(`component`, `value`): `any`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:163

## Type Parameters

• **T**

## Parameters

### component

`any`

### value

`T`

## Returns

`any`

**ChainCraft Text Game Engine API**


# Function: setGameState()

> **setGameState**(`world`, `newState`): `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:236

## Parameters

### world

`World`\<`WorldContext`\>

### newState

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: updateCompletion()

> **updateCompletion**(`world`, `ref`): `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:103

## Parameters

### world

`World`\<`WorldContext`\>

### ref

`string`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: WorldContext

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:53

## Properties

### actionHandlers

> **actionHandlers**: `Map`\<`string`, (`world`, `entity`, `action`) => `void`\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:56


### completionTracking

> **completionTracking**: `object`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:72

#### Index Signature

\[`ref`: `string`\]: \{ `current`: `number`; `target`: `number`; `type`: `"fixed"`; \} \| \{ `completed`: `boolean`; `type`: `"variable"`; \}


### components

> **components**: `Record`\<`string`, `any`\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:54


### endGame()

> **endGame**: (`gameId`) => `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:62

Callback to be executed when the game ends

#### Parameters

##### gameId

`number`

#### Returns

`void`


### executingAddCallbacks

> **executingAddCallbacks**: `boolean`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:67


### gameId

> **gameId**: `number`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:57


### gameState

> **gameState**: `number`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:69


### gameStateObservers

> **gameStateObservers**: `Set`\<`GameStateChangeCallback`\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:70


### inputQueues

> **inputQueues**: `Map`\<`string`, `IMessageQueue`\<`string`\>\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:58


### outputQueues

> **outputQueues**: `Map`\<`string`, `IMessageQueue`\<`string`\>\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:59


### pendingAddCallbacks

> **pendingAddCallbacks**: `PendingCallback`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:66

Callbacks to be executed after the next call to addComponent completes.


### systems

> **systems**: `Record`\<`string`, `any`\>

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:55


### unsubscribes?

> `optional` **unsubscribes**: () => `void`[]

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:63

#### Returns

`void`

**ChainCraft Text Game Engine API**


# Type Alias: Component

> **Component**: `any`

Defined in: bitECS/dist/core/Component.d.ts:5

**ChainCraft Text Game Engine API**


# Type Alias: GameStateChangeCallback()

> **GameStateChangeCallback**: (`newState`, `prevState`) => `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:51

## Parameters

### newState

`number`

### prevState

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Type Alias: ObserverCallback()

> **ObserverCallback**: (`entity`, ...`args`) => `void`

Defined in: ChainCraft/text-game-engine/src/core/engine.ts:43

## Parameters

### entity

`number`

### args

...`any`[]

## Returns

`void`

**ChainCraft Text Game Engine API**


# Type Alias: OnTargetRemovedCallback()

> **OnTargetRemovedCallback**: (`subject`, `target`) => `void`

Defined in: bitECS/dist/core/Relation.d.ts:3

## Parameters

### subject

`EntityId`

### target

`EntityId`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Type Alias: QueryTerm

> **QueryTerm**: `Component` \| `QueryOperator`

Defined in: bitECS/dist/core/Query.d.ts:29

**ChainCraft Text Game Engine API**


# Type Alias: Relation()\<T\>

> **Relation**\<`T`\>: (`target`) => `T`

Defined in: bitECS/dist/core/Relation.d.ts:9

## Type Parameters

• **T**

## Parameters

### target

`RelationTarget`

## Returns

`T`

**ChainCraft Text Game Engine API**


# Type Alias: World\<T\>

> **World**\<`T`\>: `{ [K in keyof T]: T[K] }`

Defined in: bitECS/dist/core/World.d.ts:22

## Type Parameters

• **T** *extends* `object` = \{\}

**ChainCraft Text Game Engine API**


# engine

## Interfaces

- WorldContext

## Type Aliases

- Component
- GameStateChangeCallback
- ObserverCallback
- OnTargetRemovedCallback
- QueryTerm
- Relation
- World

## Functions

- addComponent
- addEntity
- createRelation
- createWorld
- deleteWorld
- getAllEntities
- getBaseState
- getComponent
- getEntityComponents
- getGameState
- getRelationTargets
- getStateGeneration
- getWorldComponents
- hasComponent
- isCompleted
- observe
- observeGameState
- onAdd
- onRemove
- onSet
- Or
- query
- removeComponent
- resetWorld
- set
- setGameState
- updateCompletion

**ChainCraft Text Game Engine API**


# Function: createGameEntity()

> **createGameEntity**(`world`): `number`

Defined in: ChainCraft/text-game-engine/src/core/entities/Game.ts:8

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: getGameWorld()

> **getGameWorld**(`gameId`): `undefined` \| `World`\<\{\}\>

Defined in: ChainCraft/text-game-engine/src/core/entities/Game.ts:15

## Parameters

### gameId

`number`

## Returns

`undefined` \| `World`\<\{\}\>

**ChainCraft Text Game Engine API**


# entities/Game

## Functions

- createGameEntity
- getGameWorld

**ChainCraft Text Game Engine API**


# Function: addGamepieceEntity()

> **addGamepieceEntity**(`world`, `gamepieceType`, `gamepieceOwner`?): `number`

Defined in: ChainCraft/text-game-engine/src/core/entities/Gamepiece.ts:10

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceType

`number`

### gamepieceOwner?

`number`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: registerGamepieceComponents()

> **registerGamepieceComponents**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/entities/Gamepiece.ts:5

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# entities/Gamepiece

## Functions

- addGamepieceEntity
- registerGamepieceComponents

**ChainCraft Text Game Engine API**


# Function: addPlayerEntity()

> **addPlayerEntity**(`world`, `name`, `role`): `number`

Defined in: ChainCraft/text-game-engine/src/core/entities/Player.ts:15

## Parameters

### world

`World`\<`WorldContext`\>

### name

`string`

### role

`number`

## Returns

`number`

**ChainCraft Text Game Engine API**


# Function: registerPlayerComponents()

> **registerPlayerComponents**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/entities/Player.ts:8

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# entities/Player

## Functions

- addPlayerEntity
- registerPlayerComponents

**ChainCraft Text Game Engine API**


# entities/State

**ChainCraft Text Game Engine API**


# Function: Extends()

> **Extends**(`component`): `any`

Defined in: ChainCraft/text-game-engine/src/core/extension.ts:67

## Parameters

### component

`any`

## Returns

`any`

**ChainCraft Text Game Engine API**


# Function: hasComponentExtends()

> **hasComponentExtends**(`world`, `entity`, `component`): `boolean`

Defined in: ChainCraft/text-game-engine/src/core/extension.ts:73

## Parameters

### world

`World`\<`WorldContext`\>

### entity

`number`

### component

`any`

## Returns

`boolean`

**ChainCraft Text Game Engine API**


# Function: withExtension()

> **withExtension**\<`T`\>(`baseComponent`, `newProperties`): `T`

Defined in: ChainCraft/text-game-engine/src/core/extension.ts:53

Extends a component such that queryExtends and hasComponentExtends can be used
to query and check for the base component and all its extensions.

## Type Parameters

• **T** *extends* `ComponentProps`\<`T`\>

## Parameters

### baseComponent

`T`

### newProperties

`Partial`\<`T`\> = `{}`

## Returns

`T`

**ChainCraft Text Game Engine API**


# extension

## Functions

- Extends
- hasComponentExtends
- withExtension

**ChainCraft Text Game Engine API**


# Function: registerCustomActionComponent()

> **registerCustomActionComponent**\<`T`\>(`world`, `name`, `baseAction`, `defaultValues`): `void`

Defined in: ChainCraft/text-game-engine/src/core/helpers/actionHelper.ts:17

Registers a new action component with the proper type information

## Type Parameters

• **T** *extends* `ActionProps`\<`T`\>

## Parameters

### world

`World`\<`WorldContext`\>

### name

`string`

### baseAction

`T`

### defaultValues

`Partial`\<`Record`\<keyof `T`, `number`\>\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# helpers/actionHelper

## Functions

- registerCustomActionComponent

**ChainCraft Text Game Engine API**


# Function: createComponentObserver()

> **createComponentObserver**\<`T`\>(`world`, `component`): `void`

Defined in: ChainCraft/text-game-engine/src/core/helpers/componentHelpers.ts:110

## Type Parameters

• **T** *extends* `Record`\<`string`, `number`\>

## Parameters

### world

`World`\<`WorldContext`\>

### component

`any`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: createEmptyComponentCopy()

> **createEmptyComponentCopy**\<`T`\>(`baseComponent`): `T`

Defined in: ChainCraft/text-game-engine/src/core/helpers/componentHelpers.ts:52

## Type Parameters

• **T** *extends* `ComponentProps`\<`T`\>

## Parameters

### baseComponent

`T`

## Returns

`T`

**ChainCraft Text Game Engine API**


# Function: registerCustomComponent()

> **registerCustomComponent**\<`T`\>(`world`, `name`, `createProps`): `void`

Defined in: ChainCraft/text-game-engine/src/core/helpers/componentHelpers.ts:98

## Type Parameters

• **T** *extends* `ArrayProps`\<`T`\>

## Parameters

### world

`World`\<`WorldContext`\>

### name

`string`

### createProps

(`size`) => `T`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: withDefaultValues()

> **withDefaultValues**\<`T`\>(`baseComponent`, `defaults`, `doNotExtend`): `T`

Defined in: ChainCraft/text-game-engine/src/core/helpers/componentHelpers.ts:76

Create a component with default values filled in.  By default, this will create
an extension of the base component.  If you do not want to extend the base component,
set `doNotExtend` to `true`.

## Type Parameters

• **T** *extends* `ComponentProps`\<`T`\>

## Parameters

### baseComponent

`T`

### defaults

`Partial`\<`Record`\<keyof `T`, `number`\>\>

### doNotExtend

`boolean` = `false`

## Returns

`T`

**ChainCraft Text Game Engine API**


# Type Alias: ArrayProps\<T\>

> **ArrayProps**\<`T`\>: `{ [K in keyof T]: T[K] extends TypedArray ? T[K] : never }`

Defined in: ChainCraft/text-game-engine/src/core/helpers/componentHelpers.ts:26

## Type Parameters

• **T**

**ChainCraft Text Game Engine API**


# Type Alias: ComponentProps\<T\>

> **ComponentProps**\<`T`\>: `{ [K in keyof T]: T[K] extends TypedArray ? T[K] : T[K] extends ComponentFunction ? T[K] : never }`

Defined in: ChainCraft/text-game-engine/src/core/helpers/componentHelpers.ts:32

## Type Parameters

• **T**

**ChainCraft Text Game Engine API**


# helpers/componentHelpers

## Type Aliases

- ArrayProps
- ComponentProps

## Functions

- createComponentObserver
- createEmptyComponentCopy
- registerCustomComponent
- withDefaultValues

**ChainCraft Text Game Engine API**


# Function: getTrumpResults()

> **getTrumpResults**(`world`, `gamepieceId`): `undefined` \| `number`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/components/TrumpResults.ts:26

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceId

`number`

## Returns

`undefined` \| `number`

**ChainCraft Text Game Engine API**


# Function: registerTrumpResults()

> **registerTrumpResults**(`world`): `void`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/components/TrumpResults.ts:14

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`void`

**ChainCraft Text Game Engine API**


# Function: setTrumpResults()

> **setTrumpResults**(`world`, `gamepieceId`, `rank`): `void`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/components/TrumpResults.ts:21

## Parameters

### world

`World`\<`WorldContext`\>

### gamepieceId

`number`

### rank

`number`

## Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: TrumpResultsParams

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/components/TrumpResults.ts:10

## Properties

### rank

> **rank**: `number`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/components/TrumpResults.ts:11

**ChainCraft Text Game Engine API**


# mechanics/trump/components/TrumpResults

## Interfaces

- TrumpResultsParams

## Functions

- getTrumpResults
- registerTrumpResults
- setTrumpResults

**ChainCraft Text Game Engine API**


# Function: createComparisonRule()

> **createComparisonRule**(`getValue`, `useHighestWins`): `ComparisonRule`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:74

## Parameters

### getValue

(`world`, `entityId`) => `number`

### useHighestWins

`boolean`

## Returns

`ComparisonRule`

**ChainCraft Text Game Engine API**


# Function: createDominantValueRule()

> **createDominantValueRule**(`getValue`, `dominantValue`): `DominantValueRule`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:65

## Parameters

### getValue

(`world`, `entityId`) => `number`

### dominantValue

`number`

## Returns

`DominantValueRule`

**ChainCraft Text Game Engine API**


# Function: createMatrixRule()

> **createMatrixRule**(`getValue`, `matchupMatrix`, `valueToIndex`): `MatrixRule`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:83

## Parameters

### getValue

(`world`, `entityId`) => `number`

### matchupMatrix

`number`[][]

### valueToIndex

`Map`\<`number`, `number`\>

## Returns

`MatrixRule`

**ChainCraft Text Game Engine API**


# Function: createTrumpSystem()

> **createTrumpSystem**(`world`, `inventory`, `rules`): (`world`) => `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:183

## Parameters

### world

`World`\<`WorldContext`\>

### inventory

`InventoryConfig`

### rules

`TrumpRuleConfig`[]

## Returns

`Function`

### Parameters

#### world

`World`\<`WorldContext`\>

### Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# Interface: InventoryConfig

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:23

## Properties

### owner

> **owner**: `number`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:27

The entity that owns the inventory


### type

> **type**: `number`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:32

The inventory type

**ChainCraft Text Game Engine API**


# Interface: MatrixRuleConfig

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:6

## Properties

### matchupMatrix

> **matchupMatrix**: `number`[][]

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:17

Explicit head to head matchups.  E.g.
[ 0,  -1,  2,  1], // Fire
[ 1,   0, -1,  2], // Water
[-2,   1,  0, -1], // Earth
[-1,  -2,  1,  0]  // Air
Positive number means row beats column
Negative means column beats row
Magnitude indicates strength of victory


### valueToIndex

> **valueToIndex**: `Map`\<`number`, `number`\>

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:20

Maps the values to row/col indices in the matchup matrix

**ChainCraft Text Game Engine API**


# Type Alias: TrumpRuleConfig

> **TrumpRuleConfig**: `DominantValueRule` \| `ComparisonRule` \| `MatrixRule`

Defined in: ChainCraft/text-game-engine/src/core/mechanics/trump/systems/TrumpSystem.ts:63

Combined type - only one variant possible

**ChainCraft Text Game Engine API**


# mechanics/trump/systems/TrumpSystem

## Interfaces

- InventoryConfig
- MatrixRuleConfig

## Type Aliases

- TrumpRuleConfig

## Functions

- createComparisonRule
- createDominantValueRule
- createMatrixRule
- createTrumpSystem

**ChainCraft Text Game Engine API**


# Function: createScoringSystem()

> **createScoringSystem**(`world`, `rules`): (`world`) => `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/ScoringSystem.ts:8

## Parameters

### world

`World`\<`WorldContext`\>

### rules

`ScoringRule`[]

## Returns

`Function`

### Parameters

#### world

`World`\<`WorldContext`\>

### Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# Type Alias: ScoringRule

> **ScoringRule**: `object`

Defined in: ChainCraft/text-game-engine/src/core/systems/ScoringSystem.ts:4

## Type declaration

### evaluate()

> **evaluate**: (`world`) => `Map`\<`number`, `number`\>

#### Parameters

##### world

`World`\<`WorldContext`\>

#### Returns

`Map`\<`number`, `number`\>

**ChainCraft Text Game Engine API**


# systems/ScoringSystem

## Type Aliases

- ScoringRule

## Functions

- createScoringSystem

**ChainCraft Text Game Engine API**


# systems/TurnSystem

**ChainCraft Text Game Engine API**


# Function: createActionSystem()

> **createActionSystem**(`world`): (`world`, `entity`?) => `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/action/ActionSystem.ts:13

## Parameters

### world

`World`\<`WorldContext`\>

## Returns

`Function`

### Parameters

#### world

`World`\<`WorldContext`\>

#### entity?

`number`

### Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# Function: registerActionHandler()

> **registerActionHandler**(`world`, `actionType`, `handler`): `void`

Defined in: ChainCraft/text-game-engine/src/core/systems/action/ActionSystem.ts:4

## Parameters

### world

`World`\<`WorldContext`\>

### actionType

`string`

### handler

(`world`, `entity`, `action`) => `void`

## Returns

`void`

**ChainCraft Text Game Engine API**


# systems/action/ActionSystem

## Functions

- createActionSystem
- registerActionHandler

**ChainCraft Text Game Engine API**


# Function: moveBetweenInventoriesActionHandler()

> **moveBetweenInventoriesActionHandler**(`world`, `entity`, `component`): `void`

Defined in: ChainCraft/text-game-engine/src/core/systems/action/handlers/MoveBetweenInventoriesActionHandler.ts:4

## Parameters

### world

`World`\<`WorldContext`\>

### entity

`number`

### component

`any`

## Returns

`void`

**ChainCraft Text Game Engine API**


# systems/action/handlers/MoveBetweenInventoriesActionHandler

## Functions

- moveBetweenInventoriesActionHandler

**ChainCraft Text Game Engine API**


# Enumeration: ReactiveSystemTrigger

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:10

## Enumeration Members

### ADD

> **ADD**: `0`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:11


### ADD\_REMOVE

> **ADD\_REMOVE**: `2`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:13


### REMOVE

> **REMOVE**: `1`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:12

**ChainCraft Text Game Engine API**


# Enumeration: SystemExecutionType

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:25

## Enumeration Members

### PARALLEL

> **PARALLEL**: `0`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:26


### SEQUENTIAL

> **SEQUENTIAL**: `1`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:27

**ChainCraft Text Game Engine API**


# Function: createReactiveSystem()

> **createReactiveSystem**(`description`, `query`, `trigger`, `system`): `ReactiveSystem`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:47

## Parameters

### description

`string`

### query

`any`[]

### trigger

`ReactiveSystemTrigger`

### system

`System`

## Returns

`ReactiveSystem`

**ChainCraft Text Game Engine API**


# Function: createSystem()

> **createSystem**(`description`, `system`): `DescribedSystem`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:42

## Parameters

### description

`string`

### system

`System`

## Returns

`DescribedSystem`

**ChainCraft Text Game Engine API**


# Function: execute()

> **execute**(`world`, `config`, `exitCondition`): `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:118

## Parameters

### world

`World`\<`WorldContext`\>

### config

`GameSystemsConfig`

### exitCondition

`ExitCondition`

## Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# Type Alias: DescribedSystem

> **DescribedSystem**: `object`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:30

## Type declaration

### description

> **description**: `string`

### execute

> **execute**: `System`

**ChainCraft Text Game Engine API**


# Type Alias: ExitCondition()

> **ExitCondition**: (`world`) => `boolean`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:59

## Parameters

### world

`World`

## Returns

`boolean`

**ChainCraft Text Game Engine API**


# Type Alias: GameSystemsConfig

> **GameSystemsConfig**: `object`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:4

## Type declaration

### description

> **description**: `string`

### managedSystems

> **managedSystems**: `SystemGroup`

### reactiveSystems?

> `optional` **reactiveSystems**: `ReactiveSystem`[]

**ChainCraft Text Game Engine API**


# Type Alias: ReactiveSystem

> **ReactiveSystem**: `object`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:18

## Type declaration

### description

> **description**: `string`

### query

> **query**: `QueryTerm`[]

### system

> **system**: `System`

### trigger

> **trigger**: `ReactiveSystemTrigger`

**ChainCraft Text Game Engine API**


# Type Alias: System()

> **System**: (`world`, `entity`?) => `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:16

## Parameters

### world

`World`

### entity?

`number`

## Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# Type Alias: SystemGroup

> **SystemGroup**: `object`

Defined in: ChainCraft/text-game-engine/src/core/systems/orchestration.ts:35

## Type declaration

### description

> **description**: `string`

### precondition()?

> `optional` **precondition**: (`world`) => `boolean`

#### Parameters

##### world

`World`

#### Returns

`boolean`

### systems

> **systems**: (`DescribedSystem` \| `SystemGroup`)[]

### type

> **type**: `SystemExecutionType`

**ChainCraft Text Game Engine API**


# systems/orchestration

## Enumerations

- ReactiveSystemTrigger
- SystemExecutionType

## Type Aliases

- DescribedSystem
- ExitCondition
- GameSystemsConfig
- ReactiveSystem
- System
- SystemGroup

## Functions

- createReactiveSystem
- createSystem
- execute

**ChainCraft Text Game Engine API**


# Function: createPlayerInputSystem()

> **createPlayerInputSystem**\<`T`\>(`world`, `mappings`): (`world`) => `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/player/PlayerInputSystem.ts:10

## Type Parameters

• **T** *extends* `World`\<`WorldContext`\>

## Parameters

### world

`T`

### mappings

`InputMapping`\<`T`\>[]

## Returns

`Function`

### Parameters

#### world

`T`

### Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# Type Alias: InputMapping\<T\>

> **InputMapping**\<`T`\>: `object`

Defined in: ChainCraft/text-game-engine/src/core/systems/player/PlayerInputSystem.ts:5

## Type Parameters

• **T** *extends* `World`\<`WorldContext`\>

## Type declaration

### action()

> **action**: (`world`, `playerId`, `match`?) => `void`

#### Parameters

##### world

`T`

##### playerId

`number`

##### match?

`RegExpMatchArray`

#### Returns

`void`

### pattern

> **pattern**: `RegExp` \| `string`

**ChainCraft Text Game Engine API**


# systems/player/PlayerInputSystem

## Type Aliases

- InputMapping

## Functions

- createPlayerInputSystem

**ChainCraft Text Game Engine API**


# Function: createPlayerMessagingSystem()

> **createPlayerMessagingSystem**(`world`, `messages`): (`world`, `player`?) => `Promise`\<`void`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/player/PlayerMessagingSystem.ts:5

## Parameters

### world

`World`\<`WorldContext`\>

### messages

`string`[]

## Returns

`Function`

### Parameters

#### world

`World`\<`WorldContext`\>

#### player?

`number`

### Returns

`Promise`\<`void`\>

**ChainCraft Text Game Engine API**


# systems/player/PlayerMessagingSystem

## Functions

- createPlayerMessagingSystem

**ChainCraft Text Game Engine API**


# Function: createGameStateSystem()

> **createGameStateSystem**\<`T`\>(`world`, `config`): () => `void`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:298

## Type Parameters

• **T** *extends* `World`\<`WorldContext`\>

## Parameters

### world

`T`

### config

`TransitionConfig`\<`T`\>[]

## Returns

`Function`

### Returns

`void`

**ChainCraft Text Game Engine API**


# Interface: FixedRepeat

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:23

## Properties

### times

> **times**: `number`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:24

**ChainCraft Text Game Engine API**


# Interface: RepeatTransition\<T, R\>

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:33

## Extends

- `Transition`\<`T`\>

## Type Parameters

• **T** *extends* `W`

• **R** *extends* `Repeat`\<`T`\> = `FixedRepeat` \| `VariableRepeat`\<`T`\>

## Properties

### execute()?

> `optional` **execute**: (`world`) => `void`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:20

#### Parameters

##### world

`World`

#### Returns

`void`

#### Inherited from

`Transition.execute`


### from

> **from**: `number`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:17

#### Inherited from

`Transition.from`


### repeat

> **repeat**: `R`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:37


### to

> **to**: `number`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:18

#### Inherited from

`Transition.to`


### transitions

> **transitions**: `TransitionConfig`\<`T`\>[]

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:38


### when()?

> `optional` **when**: (`world`) => `boolean`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:19

#### Parameters

##### world

`World`

#### Returns

`boolean`

#### Inherited from

`Transition.when`

**ChainCraft Text Game Engine API**


# Interface: VariableRepeat\<T\>

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:27

## Type Parameters

• **T** *extends* `W`

## Properties

### until()

> **until**: (`world`) => `boolean`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:28

#### Parameters

##### world

`T`

#### Returns

`boolean`

**ChainCraft Text Game Engine API**


# Type Alias: TransitionConfig\<T\>

> **TransitionConfig**\<`T`\>: `Transition`\<`T`\> \| `RepeatTransition`\<`T`\>

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:41

## Type Parameters

• **T** *extends* `W`

**ChainCraft Text Game Engine API**


# Variable: GAME\_STATE\_END

> `const` **GAME\_STATE\_END**: `number`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:14

**ChainCraft Text Game Engine API**


# Variable: GAME\_STATE\_INIT

> `const` **GAME\_STATE\_INIT**: `0` = `0`

Defined in: ChainCraft/text-game-engine/src/core/systems/state/GameStateSystem.ts:13

**ChainCraft Text Game Engine API**


# systems/state/GameStateSystem

## Interfaces

- FixedRepeat
- RepeatTransition
- VariableRepeat

## Type Aliases

- TransitionConfig

## Variables

- GAME\_STATE\_END
- GAME\_STATE\_INIT

## Functions

- createGameStateSystem