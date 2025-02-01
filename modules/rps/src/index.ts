import { World, WorldContext, addComponent, createWorld, query, getComponent, removeComponent } from '@chaincraft/text-game-engine/core/engine.js';
import { addPlayerEntity, registerPlayerComponents } from '@chaincraft/text-game-engine/core/entities/Player.js';
import { addGamepieceEntity, registerGamepieceComponents } from '@chaincraft/text-game-engine/core/entities/Gamepiece.js';
import { addGamepieceToInventory, createInventory, defineInventoryType, getGamepiecesInInventory } from '@chaincraft/text-game-engine/core/components/Inventory.js';
import { createGameEntity, getGameWorld, registerGameComponents } from '@chaincraft/text-game-engine/core/entities/Game.js';
import { EntityType, setMaxEntityCount } from '@chaincraft/text-game-engine/core/EntitySizingConfig.js';
import { setActive } from '@chaincraft/text-game-engine/core/components/player/PlayerState.js';
import { addPlayerMessage, registerPlayerMessage } from '@chaincraft/text-game-engine/core/components/player/PlayerMessage.js';
import { getGameState, setGameState } from '@chaincraft/text-game-engine/core/components/game/GameState.js';
import { createGameStateSystem } from '@chaincraft/text-game-engine/core/systems/state/GameStateSystem.js';
import { createPlayerMessagingSystem } from '@chaincraft/text-game-engine/core/systems/player/PlayerMessagingSystem.js';
import { IEngine } from '@chaincraft/text-game-engine/core/IModule.js';
import { createPlayerInputSystem } from '@chaincraft/text-game-engine/core/systems/player/PlayerInputSystem.js';
import { registerCustomComponent } from '@chaincraft/text-game-engine/core/helpers/componentHelpers.js';
import { registerCustomActionComponent } from '@chaincraft/text-game-engine/core/helpers/actionHelper.js';
import { addMoveBetweenInventoriesAction, registerMoveBetweenInventoriesAction } from '@chaincraft/text-game-engine/core/components/actions/MoveBetweenInventoriesAction.js';
import { createActionSystem } from '@chaincraft/text-game-engine/core/systems/action/ActionSystem.js';
import { registerAction } from '@chaincraft/text-game-engine/core/components/actions/Action.js';
import { createTrumpSystem, createMatrixRule } from '@chaincraft/text-game-engine/core/mechanics/trump/systems/TrumpSystem.js';
import { registerPlayerScore, getPlayerScoreState, getPlayerScore } from '@chaincraft/text-game-engine/core/components/player/PlayerScore.js';
import { createScoringSystem } from '@chaincraft/text-game-engine/core/systems/ScoringSystem.js';
import { getGamepieceOwner } from '@chaincraft/text-game-engine/core/components/gamepiece/GamepieceOwner.js';
import { createReactiveSystem, createSystem, execute, GameSystemsConfig, ReactiveSystemTrigger, SystemExecutionType } from '@chaincraft/text-game-engine/core/systems/orchestration.js';
import { Extends } from '@chaincraft/text-game-engine/core/extension.js';
import { getTrumpResults, registerTrumpResults } from '@chaincraft/text-game-engine/core/mechanics/trump/components/TrumpResults.js';
import { create } from 'domain';

// Constants
export const maxPlayers: number = 2;

/** How many rounds in a game. */
const numberOfRounds = 3;

// All players have the same role in this game
const playerRoleId = 1;

// Only one type of gamepiece in this game (rock, paper, scissors)
const rpsGamepieceTypeId = 1;

const playerMessages = [
    "None", // Unused
    "Please choose rock (r), paper (p), or scissors (s).",
    "Invalid choice.  Please choose rock (r), paper (p), or scissors (s).",
    "You chose rock.",
    "You chose paper.",
    "You chose scissors.",
    "Opponent chose rock.",
    "Opponent chose paper.",
    "Opponent chose scissors.",
    "You win this round!",
    "Opponent wins this round!",
    "It's a tie!",
    "You win the game!",
    "Opponent wins the game!",
    "Starting Round 1...",
    "Starting Round 2...",
    "Starting Round 3..."
];

enum PlayerMessage {
    CHOOSE_RPS = 1,
    INVALID_CHOICE = 2,
    YOU_CHOSE_ROCK = 3,
    YOU_CHOSE_PAPER = 4,
    YOU_CHOSE_SCISSORS = 5,
    OPPONENT_CHOSE_ROCK = 6,
    OPPONENT_CHOSE_PAPER = 7,
    OPPONENT_CHOSE_SCISSORS = 8,
    YOU_WIN_ROUND = 9,
    OPPONENT_WIN_ROUND = 10,
    TIE_ROUND = 11,
    YOU_WIN_GAME = 12,
    OPPONENT_WIN_GAME = 13,
    STARTING_ROUND_1 = 14,
    STARTING_ROUND_2 = 15,
    STARTING_ROUND_3 = 16
}

/** 
 * The type values for the rps gamepieces.  Using const instead of enum so we 
 * can iterate over the values.
 */
const RPSType = {
    ROCK: 1,
    PAPER: 2,
    SCISSORS: 3
} as const

/** Game states */
const RPSGameState = {
    /** Game is in progress */
    INIT: 1,
    ROUND_1: 2,
    ROUND_2: 3,
    ROUND_3: 4,
    END: 5
};

const RPSGameStateNames = [
    "None",
    "Init",
    "Round 1",
    "Round 2",
    "Round 3",
    "End"
]

/** Inventories */
enum InventoryType {
    PLAYER_HAND = 1,
    TABLE = 2
}

interface RPSWorldContext extends WorldContext {
    playerIds: number[];
    playedGamepieces: number[];
}

type RPSWorld = World<RPSWorldContext>;

const createSystems = (world: RPSWorld) => {
    // Create all systems
    createGameStateSystem(world, {
        initialState: RPSGameState.INIT,
        currentState: RPSGameState.INIT,
        transitions: [
            {
                from: RPSGameState.INIT,
                to: RPSGameState.ROUND_1,
                condition: () => true,
                onTransition: (world: RPSWorld) => startRound(world)
            },
            {
                from: RPSGameState.ROUND_1,
                to: RPSGameState.ROUND_2,
                condition: (world: RPSWorld) => scoreIsComplete(world, RPSGameState.ROUND_1),
                onTransition: (world: RPSWorld) => startRound(world)
            },
            {
                from: RPSGameState.ROUND_2,
                to: RPSGameState.ROUND_3,
                condition: (world: RPSWorld) => scoreIsComplete(world, RPSGameState.ROUND_2),
                onTransition: (world: RPSWorld) => startRound(world)
            },
            {
                from: RPSGameState.ROUND_3,
                to: RPSGameState.END,
                condition: (world: RPSWorld) => scoreIsComplete(world, RPSGameState.ROUND_3),
                onTransition: (world: RPSWorld) => determineWinnerAndExit(world)
            }
        ]
    });

    createPlayerMessagingSystem(world, playerMessages);

    createPlayerInputSystem(world, [
        {
            pattern: /^r$/i,
            action: (world: RPSWorld, playerId: number) => {
                addPlayerMessage(world, playerId, PlayerMessage.YOU_CHOSE_ROCK);
                addPlayAction(world, playerId, RPSType.ROCK);
            }
        },
        {
            pattern: /^p$/i,
            action: (world: RPSWorld, playerId: number) => {
                addPlayerMessage(world, playerId, PlayerMessage.YOU_CHOSE_PAPER);
                addPlayAction(world, playerId, RPSType.PAPER);
            }
        },
        {
            pattern: /^s$/i,
            action: (world: RPSWorld, playerId: number) => {
                addPlayerMessage(world, playerId, PlayerMessage.YOU_CHOSE_SCISSORS);
                addPlayAction(world, playerId, RPSType.SCISSORS);
            }
        },
        {
            pattern: /^(?!r$|p$|s$)/i,
            action: (world: RPSWorld, playerId: number) => {
                addPlayerMessage(world, playerId, PlayerMessage.INVALID_CHOICE);
            }
        }
    ]);

    createScoringSystem(world, [{
        evaluate: (world: RPSWorld) => {
            const scores = new Map<number, number>();
            const messages = new Map<number, number>();
            
            const playedPieces = getGamepiecesInInventory(world, world.gameId, InventoryType.TABLE);
            const rank0Pieces = playedPieces.filter(gp => getTrumpResults(world, gp) === 0);
            
            if (rank0Pieces.length === 1) {
                const winningPlayer = getGamepieceOwner(world, rank0Pieces[0]);
                scores.set(winningPlayer, 1);
                messages.set(winningPlayer, PlayerMessage.YOU_WIN_ROUND);
                messages.set(getOtherPlayer(world, winningPlayer), PlayerMessage.OPPONENT_WIN_ROUND);
            } else if (rank0Pieces.length > 1) {
                world.playerIds.forEach(player => 
                    messages.set(player, PlayerMessage.TIE_ROUND));
            }
            
            messages.forEach((messageId, playerId) => 
                addPlayerMessage(world, playerId, messageId));

            return scores;
        }
    }]);

    createTrumpSystem(world,
        { 
            owner: world.gameId, 
            type: InventoryType.TABLE
        },
        [
            createMatrixRule(
                (world: RPSWorld, id: number) => 
                    getComponent(world, id, world.components.RPSType)?.rpsType[id],
                [
                    [0, -1, 1],  // Rock:     loses to Paper, beats Scissors
                    [1, 0, -1],  // Paper:    beats Rock, loses to Scissors
                    [-1, 1, 0]   // Scissors: loses to Rock, beats Paper
                ],
                new Map([
                    [RPSType.ROCK, 0],
                    [RPSType.PAPER, 1],
                    [RPSType.SCISSORS, 2]
                ])
            )
        ]
    );

    createActionSystem(world);
};

export const createGame = (): number => {
    // Configure entity counts
    setMaxEntityCount(EntityType.PLAYER, maxPlayers);
    setMaxEntityCount(EntityType.GAMEPIECE, Object.keys(RPSType).length * maxPlayers);

    const world = createWorld(createWorldContext()) as RPSWorld;
    
    // Game entity components need to be bootstrapped before we can create the game
    registerCoreComponents(world);
    const gameId = createGameEntity(world);
    world.gameId = gameId;
    // Register RPS specific components
    registerRPSComponents(world);

    createSystems(world);

    return gameId;
}

export const initializeGame = (gameId: number, players: string[], engine: IEngine) => {
    // Get the game world
    const world = getGameWorld(gameId) as RPSWorld;
    
    // Set the message queues on the world
    world.inputQueues = engine.inputQueues;
    world.outputQueues = engine.outputQueues;
    world.endGame = engine.endGame;

    defineInventoryType(world, InventoryType.PLAYER_HAND, [rpsGamepieceTypeId]);
    defineInventoryType(world, InventoryType.TABLE, [rpsGamepieceTypeId]);

    // Create the game inventory
    createInventory(world, gameId, InventoryType.TABLE);

    // Create players
    for (let i = 0; i < players.length; i++) {
        createPlayer(world, players[i], playerRoleId);
    }

    // Set initial game state
    setGameState(world, RPSGameState.INIT);
};

export const startGame = (gameId: number) => {
    const world = getGameWorld(gameId) as RPSWorld;
    console.debug('[RPS] World systems: %o', world.systems);

    const RPSSystemConfig: GameSystemsConfig = {
        description: 'Rock, Paper, Scissors Game',
        reactiveSystems: [
            createReactiveSystem(
                'Player Messaging',
                [world.components.PlayerMessage],
                ReactiveSystemTrigger.ADD,
                world.systems.PlayerMessaging
            ),
            createReactiveSystem(
                'Action Processing',
                [Extends(world.components.Action)],
                ReactiveSystemTrigger.ADD,
                world.systems.Action
            )
        ],
        managedSystems: {
            description: 'RPS Game Loop',
            type: SystemExecutionType.SEQUENTIAL,
            precondition: (world: RPSWorld) => getGameState(world) !== RPSGameState.END,
            systems: [
                createSystem('Game State', world.systems.GameState),
                createSystem('Player Input', world.systems.PlayerInput),
                createSystem('Update Played Gamepieces', updatePlayedGamepieces),
                {
                    type: SystemExecutionType.SEQUENTIAL,
                    description: 'Turn Resolution',
                    precondition: isTurnComplete,
                    systems: [
                        {
                            type: SystemExecutionType.PARALLEL,
                            description: 'Independent Resolution Steps',
                            systems: [
                                createSystem('Notify Opponent Choices', notifyOpponentChoices),
                                createSystem('Trump Resolution', world.systems.Trump)
                            ]
                        },
                        {
                            type: SystemExecutionType.PARALLEL,
                            description: 'Round Scoring',
                            systems: [
                                createSystem('Scoring', world.systems.Scoring)
                            ]
                        },
                        {
                            type: SystemExecutionType.PARALLEL,
                            description: 'Round Cleanup',
                            systems: [
                                createSystem('Add Recovery Actions', addRecoveryActions),
                                // createSystem('Notify Round Results', notifyRoundResults),
                                createSystem('Reset Trump and Played Gamepieces', reset)
                            ]
                        }
                    ]
                }
            ]
        }
    };
    execute(world, RPSSystemConfig, (world: RPSWorld) => getGameState(world) === RPSGameState.END);
}

export const getGeneralInstructions = () => {
    return `Rock, Paper, Scissors is a game where each player chooses one of three options: rock, paper, or scissors.  Rock beats scissors, scissors beats paper, and paper beats rock.  The goal is to choose the option that will beat your opponent\'s choice.  The game will be played over ${numberOfRounds} rounds.  The player with the most wins at the end of the game is the winner.`;
};

const createWorldContext = (): Partial<RPSWorldContext> => {
    return {
        playerIds: [],
        playedGamepieces: []
    };
}

const createPlayer = (world: RPSWorld, name: string, roleId: number) => {
    const player = addPlayerEntity(world, name, roleId);
    world.playerIds.push(player);

    // Create an RPS inventory (used for both player hand and played items)
    createInventory(world, player, InventoryType.PLAYER_HAND);

    // Create the gamepieces for the player and add them to the 
    // player's inventory
    Object.values(RPSType).forEach(rpsValue => {
        const gamepiece = createGamepiece(world, player, rpsValue);
        addGamepieceToInventory(world, player, InventoryType.PLAYER_HAND, gamepiece);
    });

    return player;
};

const createGamepiece = (world: RPSWorld, owner: number, rpsValue: number) => {
    const gamepiece = addGamepieceEntity(world, rpsGamepieceTypeId, owner);
    addComponent(world, gamepiece, world.components.RPSType);
    world.components.RPSType.rpsType[gamepiece] = rpsValue;
    return gamepiece;
}

const registerCoreComponents = (world: RPSWorld) => {
    // Register core components for entities
    registerGameComponents(world);
    registerPlayerComponents(world);
    registerGamepieceComponents(world);

    registerPlayerMessage(world);
    registerPlayerScore(world);

    registerAction(world);
    registerMoveBetweenInventoriesAction(world);

    registerTrumpResults(world);
}

const registerRPSComponents = (world: RPSWorld) => {
    // RPS gamepiece type
    registerCustomComponent(world, 'RPSType', (size) => {
        return {
            rpsType: new Uint8Array(size)
        }
    });

    // Play RPS Action
    registerCustomActionComponent(
        world,
        "PlayAction",
        world.components.MoveBetweenInventoriesAction,
        {
            sourceInventoryType: InventoryType.PLAYER_HAND,
            destinationInventoryType: InventoryType.TABLE,
            destinationInventoryOwner: world.gameId
        }
    )

    // Recover RPS Action
    registerCustomActionComponent(
        world,
        "RecoverAction",
        world.components.MoveBetweenInventoriesAction,
        {
            sourceInventoryOwner: world.gameId,
            sourceInventoryType: InventoryType.TABLE,
            destinationInventoryType: InventoryType.PLAYER_HAND
        }
    )
}

const startRound = async (world: RPSWorld) => {
    const state = getGameState(world);
    console.debug('[RPS] Starting %s', RPSGameStateNames[state]);  
    
    // Make players active and prompt them for their choice
    for (const player of world.playerIds) {
        setActive(world, player);
        addPlayerMessage(world, player, state + 12);
        addPlayerMessage(world, player, PlayerMessage.CHOOSE_RPS);
    }
}

const scoreIsComplete = (world: RPSWorld, state: number): boolean => {
    for (const player of world.playerIds) {
        const scoreState = getPlayerScoreState(world, player);
        if (scoreState !== state) {
            return false;
        }
    }
    return true;
}

const getOtherPlayer = (world: RPSWorld, playerId: number): number => {
    return world.playerIds.find(p => p !== playerId);
}

const determineWinnerAndExit = (world: RPSWorld) => {
    console.debug('[RPS] Determining winner');
    const highestScoringPlayer = world.playerIds.reduce((highestPlayer, player) => {
        const score = getPlayerScore(world, player);
        return score > getPlayerScore(world, highestPlayer) ? player : highestPlayer;
    });
    addPlayerMessage(world, highestScoringPlayer, PlayerMessage.YOU_WIN_GAME);
    addPlayerMessage(world, getOtherPlayer(world, highestScoringPlayer), PlayerMessage.OPPONENT_WIN_GAME);
    world.endGame(world.gameId);
}

const addPlayAction = (world: RPSWorld, playerId: number, rpsType: number) => {
    console.debug('[RPS] Adding play action for player %d with rps type %d', playerId, rpsType);
    // Find the gane piece entity for the rps type in the player's inventory
    const gamepieces = getGamepiecesInInventory(world, playerId, InventoryType.PLAYER_HAND);
    const gamepiece = gamepieces.find(gp => 
        getComponent(world, gp, world.components.RPSType)?.rpsType[gp] === rpsType);
    // addComponent(world, playerId, world.components.PlayAction);
    // world.components.PlayAction.item[playerId] = gamepiece;
    addMoveBetweenInventoriesAction(world, playerId, world.components.PlayAction, {
        sourceInventoryOwner: playerId,
        item: gamepiece
    });
}

const updatePlayedGamepieces = async (world: RPSWorld): Promise<void> => {
    const playedGamepieces = getGamepiecesInInventory(
        world, 
        world.gameId, 
        InventoryType.TABLE
    )
    console.debug('[RPS] Played gamepieces:', playedGamepieces);
    world.playedGamepieces = playedGamepieces;
}

const isTurnComplete = (world: RPSWorld): boolean => {
    return world.playedGamepieces.length === maxPlayers;
}

const notifyOpponentChoices = async (world: RPSWorld): Promise<void> => {
    for (const player of world.playerIds) {
        const opponent = getOtherPlayer(world, player);
        const opponentGamepiece = world.playedGamepieces.find(gp => 
            getGamepieceOwner(world, gp) === opponent);
        const opponentRpsType = getComponent(world, opponentGamepiece, 
                world.components.RPSType)?.rpsType[opponentGamepiece];
        addPlayerMessage(world, player, opponentRpsType + 5);
    }
}

const addRecoveryActions = async (world: RPSWorld): Promise<void> => {
    // Add recovery actions
    for (const gamepiece of world.playedGamepieces) {
        const owner = getGamepieceOwner(world, gamepiece);
        addMoveBetweenInventoriesAction(world, gamepiece, world.components.RecoverAction, {
            item: gamepiece,
            destinationInventoryOwner: owner
        });
    }
}

const reset = async (world: RPSWorld): Promise<void> => {
    world.playedGamepieces.length = 0;
}





