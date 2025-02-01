import { WebSocketServer, WebSocket as WS} from 'ws';
import * as gameEngine from '../../core/GameEngine.js';
import { 
  MessageType, 
  CreateGameMessage, 
  JoinGameMessage, 
  GameCreatedMessage, 
  GameJoinedMessage, 
  GameEventMessage, 
  PlayerMessage, 
  PlayerActionMessage
} from './cli-messages.js';
import { GameMessageQueueManager } from '../../core/messaging/GameMessageQueues.js';

const wss = new WebSocketServer({ port: 8080 });

const clients = new Map<string, WS>();
const gamePlayers = new Map<number, Set<string>>();
const queueManager = new GameMessageQueueManager();

wss.on('connection', (ws: WS) => {
  ws.on('message', async (message) => {
    const parsedMessage = JSON.parse(message.toString()) as 
    CreateGameMessage | 
    JoinGameMessage | 
    PlayerActionMessage;
    const playerId = parsedMessage.playerId;
    clients.set(playerId, ws);

    switch (parsedMessage.type) {
      case MessageType.CreateGame: {
        const gameId = await createGame('rps', parsedMessage.playerId);
        const gameCreatedMessage: GameCreatedMessage = { 
          type: MessageType.GameCreated, gameId
        };
        ws.send(JSON.stringify(gameCreatedMessage));
        listenForMessages(gameId, playerId, ws);
        break;
      }
      case MessageType.JoinGame: {
        const gameId = parsedMessage.gameId;
        const players = joinGame(gameId, playerId);
        const gameJoinedMessage: GameJoinedMessage = { 
          type: MessageType.GameJoined, 
          gameId: parsedMessage.gameId, 
          players 
        };
        ws.send(JSON.stringify(gameJoinedMessage));
        listenForMessages(gameId, playerId, ws);
        break;
      }
      case MessageType.PlayerAction: {
        console.debug('[CLI Server] Received player %s action: %s', parsedMessage.playerId, parsedMessage.action);
        const gameQueues = queueManager.getGameQueues(parsedMessage.gameId);
        gameQueues?.inputQueues.get(parsedMessage.playerId)?.enqueue(parsedMessage.action);
        break;
      }
      default:
        console.error('[CLI Server] Unhandled message type:', (parsedMessage as any).type);
        break;
    }
  });
});

wss.on('error', (error) => {
  if ((error as any).code === 'EADDRINUSE') {
    console.error('Error: Port 8080 is already in use. Please ensure no other server is running on this port.');
  } else {
    console.error('WebSocket Server Error:', error);
  }
  process.exit(1);
});

async function listenForMessages(gameId: number, playerId: string, ws: WS) {
  const gameQueues = queueManager.getGameQueues(gameId);
  if (!gameQueues) return;

  const queue = gameQueues.outputQueues.get(playerId);
  if (!queue) return;

  while (true) {
    try {
      console.debug('[CLI Server] Waiting for message for player %s...', playerId);
      await queue.waitForAvailableMessage();
      const message = queue.dequeue();
      if (!message) continue;
      const playerMessage: PlayerMessage = {
        type: MessageType.PlayerMessage,
        message
      };
      ws.send(JSON.stringify(playerMessage));
    } catch (error) {
      console.error('Error in message loop:', error);
      break;
    }
  }
}

async function createGame(moduleName: string, playerId: string): Promise<number> {
  const gameQueues = queueManager.createGameQueues([playerId]);
  const gameId = await gameEngine.createGame(moduleName, [playerId], gameQueues);
  queueManager.registerGameQueues(gameId, gameQueues);
  gamePlayers.set(gameId, new Set([playerId]));
  registerGameEvents(gameId);
  return gameId;
}

function joinGame(gameId: number, playerId: string) {
  const players = gameEngine.joinGame(gameId, playerId);
  queueManager.addPlayerToGame(gameId, playerId);
  gamePlayers.get(gameId)?.add(playerId);
  return players;
}

function registerGameEvents(gameId: number) {
  gameEngine.subscribeToGameEvents(gameId, async (gameId, event, data) => {
    const players = gamePlayers.get(gameId); 
    if (players) {
      // Events should be delivered last to ensure all other messages are processed first
      queueMicrotask(async () => {
        const gameEventMessage: GameEventMessage = { type: MessageType.GameEvent, event, data };
        console.debug('[CLI Server] Sending game event:', gameEventMessage);
        const message = JSON.stringify(gameEventMessage);
        players.forEach((playerId) => {
          clients.get(playerId)?.send(message);
        });

        if (event === gameEngine.GameEvent.GameReady) {
          const message = await gameEngine.getGameInstructions(gameId);
          const gameInstructionsMessage: PlayerMessage = { type: MessageType.PlayerMessage, message };
          const instructionsMessage = JSON.stringify(gameInstructionsMessage);
          players.forEach((playerId) => {
            clients.get(playerId)?.send(instructionsMessage);
          });


          gameEngine.startGame(gameId);
        }
      });
    }
  });
}

console.log('WebSocket server is running on ws://localhost:8080');