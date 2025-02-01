import { MessageQueue } from '#core/messaging/MessageQueues.js';

export interface GameMessageQueues {
    inputQueues: Map<string, MessageQueue<string>>;
    outputQueues: Map<string, MessageQueue<string>>;
}

export class GameMessageQueueManager {
    private gameQueues = new Map<number, GameMessageQueues>();

    createGameQueues(players: string[]): GameMessageQueues {
        const queues: GameMessageQueues = {
            inputQueues: new Map(),
            outputQueues: new Map()
        };

        players.forEach(playerId => {
            queues.inputQueues.set(playerId, new MessageQueue<string>());
            queues.outputQueues.set(playerId, new MessageQueue<string>());
        });

        return queues;
    }

    registerGameQueues(gameId: number, queues: GameMessageQueues): void {
        this.gameQueues.set(gameId, queues);
    }

    getGameQueues(gameId: number): GameMessageQueues | undefined {
        return this.gameQueues.get(gameId);
    }

    addPlayerToGame(gameId: number, playerId: string): void {
        const queues = this.gameQueues.get(gameId);
        if (queues) {
            queues.inputQueues.set(playerId, new MessageQueue<string>());
            queues.outputQueues.set(playerId, new MessageQueue<string>());
        }
    }
}
