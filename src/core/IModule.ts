import { IMessageQueue } from '#core/messaging/MessageQueues.js';

export type InvalidActionError = Error;

export interface IEngine {
    inputQueues: Map<string, IMessageQueue<string>>;
    outputQueues: Map<string, IMessageQueue<string>>;
    endGame(gameId: number): void;
}

/** The interface for any text game supported by the engine. */
export interface IModule {
    /** The maximum number of players that can play the game. */
    maxPlayers: number;

    /** 
     * Create the game world and return the gameId for the game.
     */
    createGame(): number;

    /** 
     * Initializes the game with the specified players.  This should setup the game world
     * and any other necessary state. 
     * @param gameId The id of the game.
     * @param players The players that will be playing the game.
     * @param engine The api for interacting with the game engine.
     */
    initializeGame(gameId: number, players: string[], engine: IEngine): void;

    /** 
     * Start the game.  This will be called after all players have joined the game and the 
     * game is initialized.
     */
    startGame(gameId: number): void;

    /** 
     * Return the general instructions for the game, e.g. how to play, what the goal is, etc.
     */
    getGeneralInstructions(): string;

    /** 
     * Get instructions specific to the current game state, e.g. the current game status,
     * what the player can do next.
     */
    getSpecificInstructions(gameId: number, playerId: string): string;

    /** 
     * Take an action in the game. 
     * @param gameId The id of the game.
     * @param playerId The id of the player making the move.
     * @param action The action the player is taking.  This will be a string that the 
     *               module will interpret based on the game rules.
     * @throws An error if the action is invalid.
     */
    onPlayerAction(gameId: number, playerId: string, action: string): void;
}