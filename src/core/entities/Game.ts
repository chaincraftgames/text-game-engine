import { registerGameState } from "#core/components/game/GameState.js";
import { addEntity, addComponent, World, WorldContext } from "#core/engine.js";

/**
 * Keep track of all the games and associated worlds
 */
const games: Map<number, World> = new Map();

export const registerGameComponents = (world: World<WorldContext>) => {
    registerGameState(world);
}

export const createGameEntity = (world: World<WorldContext>) => {
    const gameId = addEntity(world);
    games.set(gameId, world);

    // Add a GameState component to the game entity
    addComponent(world, gameId, world.components.GameState);

    return gameId;
}

export const getGameWorld = (gameId: number): World | undefined => {
    return games.get(gameId);
}