import { World, WorldContext } from "#core/engine.js";
import { getMaxEntityCount } from "#core/EntitySizingConfig.js";
import { get } from "http";

/** Keeps track of the current game state */
const createGameStateProps = () => ({
    state: new Uint8Array(getMaxEntityCount() + 1),
    getName: () => "GameState",
});

/** Register component with a world */
export const registerGameState = (world: World<WorldContext>) => {
    world.components.GameState = createGameStateProps();
}

/** Set the current game state */
export const setGameState = (world: World<WorldContext>, state: number) => {
    world.components.GameState.state[world.gameId] = state;
}

/** Get the current game state */
export const getGameState = (world: World<WorldContext>): number => {
    // Can directly access because we don't expect the component to every be removed.
    return world.components.GameState.state[world.gameId];
}