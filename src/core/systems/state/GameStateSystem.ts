import { World, WorldContext } from "#core/engine.js";

type W = World<WorldContext>;

export type StateTransition<T extends W, S> = {
    from: S;
    to: S;
    condition: (world: T) => boolean;
    onTransition?: (world: T) => void;
  }
  
  export type StateMachineConfig<T extends W, S> = {
    initialState: S;
    currentState: S;
    transitions: StateTransition<T, S>[];
  }
  
  export const createGameStateSystem = <T extends W, S>(world: T, config: StateMachineConfig<T, S>) => {
    const system = async (world: T): Promise<void> => {
        const applicableTransitions = config.transitions.filter(t => 
            t.from === config.currentState && t.condition(world)
        );

        if (applicableTransitions.length > 0) {
            const transition = applicableTransitions[0];
            config.currentState = transition.to;
            console.debug(`[GameStateSystem] Transitioning from ${transition.from} to ${transition.to}`);
            world.components.GameState.state[world.gameId] = config.currentState;
            transition.onTransition?.(world);
            return;
        }
    };

    world.systems.GameState = system;
    return system;
};