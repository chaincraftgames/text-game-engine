import { World, WorldContext, query } from '#core/engine.js';
import { getPlayerName } from '#core/components/player/PlayerName.js';
import { getActive } from '#core/components/player/PlayerState.js';

export type InputMapping<T extends World<WorldContext>> = {
    pattern: RegExp | string;
    action: (world: T, playerId: number, match?: RegExpMatchArray) => void;
}

export const createPlayerInputSystem = <T extends World<WorldContext>>(world: T, mappings: InputMapping<T>[]) => {
    const processInput = (world: T, playerId: number, input: string): boolean => {
        for (const mapping of mappings) {
            const pattern = typeof mapping.pattern === 'string' 
                ? new RegExp(`^${mapping.pattern}$`, 'i')
                : mapping.pattern;
            
            const match = input.match(pattern);
            if (match) {
                mapping.action(world, playerId, match);
                return true;
            }
        }
        return false;
    };

    const system = async (world: T) => {
        console.debug('[PlayerInputSystem] - execute.');
        // Get all active players
        const activePlayers = query(world, [world.components.PlayerState])
        // TODO: Properly handle active players.  probably need an add/remove observer
        //       and Active becomes a component that can be added/removed.  When
        //       the observer fires, we add/remove the player from the active list.
        //       we'll have to change the code to rerace any new active players.
            // .filter(playerId => getActive(world, playerId));
        
        // Wait for any player to have input
        const result = await Promise.race(activePlayers.map(async playerId => {
            const playerName = getPlayerName(world, playerId);
            console.debug(`[PlayerInputSystem] Waiting for input from player ${playerName}`);
            if (!playerName) return;
            
            const queue = world.inputQueues.get(playerName);
            if (!queue) return;

            await queue.waitForAvailableMessage();
            console.debug(`[PlayerInputSystem] Player ${playerName} has input`);
            return playerName;
        }));
        
        console.debug('[PlayerInputSystem] Received input from player %s', result);

        // Process any remaining inputs   
        for (const playerId of activePlayers) {
            const playerName = getPlayerName(world, playerId);
            if (!playerName) continue;
            
            const queue = world.inputQueues.get(playerName);
            if (!queue) continue;

            const input = queue.dequeue();
            if (!input) continue;

            console.debug(`[PlayerInputSystem] Processing input from player ${playerName}: ${input}`);
            processInput(world, playerId, input.trim());
        }
    };

    world.systems.PlayerInput = system;
    return system;
};