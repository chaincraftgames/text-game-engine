import { Runnable } from "@langchain/core/runnables";
import { StructuredOutputParser } from "langchain/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z, ZodObject, ZodSchema } from "zod";
import { getModel } from "./model.js";
import { PlayerInput } from "#core/messaging/MessageQueues.js";

const initializationTemplate = `
  You are an AI simulation expert tasked with initializing a text-based game simulation.
  You will set up the initial game state and provide welcome messages and initial instructions 
  to all players.

  The description of the game is as follows:
  {gameDescription}

  The players participating in the game are:
  {players}

  Initialize the game state and provide welcome messages including initial instructions according 
  to the following format:
  {formattingInstructions}
`;

const runtimeTemplate = `
  You are an AI simulation expert tasked with running a text-based game simulation. You will be
  responsible for managing the game state and player actions. You will be responsible for the following:
    2. Communication with the players to get their actions and report the game state
    3. Ensuring that player actions are valid within the rules of the game.  
    4. Updating the game state based on player actions and the rules of the game.
    5. Determining when the game is over and reporting the results to the players.  When the game is over, you 
       should set the gameEnded flag to true and provide the final game state and the results to the players via
       the player messages. 

  When a player takes an action, you will be provided with the player id and their action.  Upon receiving
  an action you must:
  1. Validate the action against game rules
  2. Update game state accordingly
  3. Provide feedback to players via messages

  If players attempt illegal  actions you may remind them of the rules, explain why the action is illegal 
  and ask them to choose a valid action.  If you receive an illegal action you should update the illegal 
  action count for the player.  Upon legal action you may set it back to 0.  If the count reaches 3, or 
  if the player tries to circumvent the rules or your instructions you may end the game with an appropriate 
  message to all players.

  When the game is over, set the gameEnded flag to true and provide the final game state and the results to
  the players via the player messages.

  The description of the game is as follows:
  {gameDescription}

  Here is the current game state:
  {gameState}

  Here is the action taken by a player:
  {playerAction}

  Provide updated game state and player messages according to the following format:
  {formattingInstructions}
`;

const runtimeGameStateSchemaExtension = z.object({
  gameEnded: z.boolean().default(false),
});

const runtimePlayerStateSchemaExtension = z.object({
  illegalActionCount: z.number().default(0),
  messageToPlayer: z.string().optional(),
});

interface BaseRuntimeState {
  gameState: {
    gameEnded: boolean;
  };
  players: Record<string, RuntimePlayerState>;
}

interface RuntimePlayerState {
  illegalActionCount: number;
  messageToPlayer?: string;
}

export interface Runtime {
  initializeGame: (players: string[]) => Promise<RuntimeResponse>;
  processPlayerAction: (playerAction: PlayerInput) => Promise<RuntimeResponse>;
}

// Custom error types for better error handling
export class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RuntimeError";
  }
}

export class ValidationError extends RuntimeError {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Update RuntimeResponse to be more specific
export interface RuntimeResponse {
  gameEnded: boolean;
  playerMessages: Map<string, string | undefined>;
}

export const initializeRuntime = async (
  gameDescription: string,
  stateSchema: ZodSchema
): Promise<Runtime> => {
  // Ensure we're working with an object schema
  if (!(stateSchema instanceof z.ZodObject)) {
    throw new Error("State schema must be an object schema");
  }

  const initializationPrompt = ChatPromptTemplate.fromTemplate(
    initializationTemplate
  );
  const runtimePrompt = ChatPromptTemplate.fromTemplate(runtimeTemplate);

  const schema = extendSchema(stateSchema);
  type GameState = z.infer<typeof schema> & BaseRuntimeState;
  const parser = new StructuredOutputParser(schema);
  const model = await getModel();

  const partialInitializationChain = await initializationPrompt.partial({
    gameDescription,
    formattingInstructions: parser.getFormatInstructions(),
  });

  const initializationChain = partialInitializationChain
    .pipe(model)
    .pipe(parser);

  const partialRuntimeChain = await runtimePrompt.partial({
    gameDescription,
    formattingInstructions: parser.getFormatInstructions(),
  });

  const runtimeChain = partialRuntimeChain.pipe(model).pipe(parser);

  let currentState: GameState = {
    gameState: {
      gameEnded: false,
    },
    players: {},
  };

  return {
    initializeGame: async (players: string[]): Promise<RuntimeResponse> => {
      try {
        const response = await initializationChain.invoke({
          players,
        });

        // Validate response against schema
        currentState = schema.parse(response) as GameState;
        const playerMessages = extractPlayerMessages(currentState);

        return {
          playerMessages,
          gameEnded: currentState.gameState?.gameEnded ?? false,
        };
      } catch (error) {
        handleError(error);
        return Promise.reject(error);
      }
    },

    processPlayerAction: async (
      playerAction: PlayerInput
    ): Promise<RuntimeResponse> => {
      try {
        const response = await runtimeChain.invoke({
          playerAction: playerAction,
          gameState: currentState,
        });

        // Validate response against schema
        currentState = schema.parse(response) as GameState;

        const playerMessages = extractPlayerMessages(currentState);

        return {
          playerMessages,
          gameEnded: currentState.gameState?.gameEnded ?? false,
        };
      } catch (error) {
        handleError(error);
        return Promise.reject(error);
      }
    },
  };
};

const extendSchema = (schema: ZodObject<any>) => {
  // Get the value type of the players record
  const playerSchema =
    schema.shape.players instanceof z.ZodRecord
      ? schema.shape.players.valueSchema
      : schema.shape.players;

  const extendedSchema = z.object({
    gameState: runtimeGameStateSchemaExtension.merge(schema.shape.gameState),
    players: z.record(runtimePlayerStateSchemaExtension.merge(playerSchema)),
  });

  return schema.merge(extendedSchema);
};

/**
 * Get the player messages from the state.  Note this will remove the messages after
 * they are retrieved.
 * @param currentState
 * @returns
 */
const extractPlayerMessages = (currentState: BaseRuntimeState) => {
  const playerMessages = new Map<string, string>();
  for (const [playerId, playerData] of Object.entries(
    currentState.players as Record<string, RuntimePlayerState>
  )) {
    const playerMessage = playerData?.messageToPlayer;
    if (playerMessage) {
      playerMessages.set(playerId, playerMessage);
      // Remove the message to keep it from confusing the AI on the next turn
      playerData.messageToPlayer = undefined;
    }

    
  }
  return playerMessages;
};

const handleError = (error: unknown): never => {
if (error instanceof z.ZodError) {
    throw new ValidationError(`Invalid game state: ${error.message}`);
  }
  throw new RuntimeError(
    `Runtime error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
}
