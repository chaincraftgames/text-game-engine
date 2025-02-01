import { 
    createWorld as beCreateWorld,
    deleteWorld as beDeleteWorld, 
    resetWorld as beResetWorld, 
    getAllEntities as beGetAllEntities,
    getWorldComponents as beGetWorldComponents,
    addEntity as beAddEntity,
    getEntityComponents as beGetEntityComponents,
    addComponent as beAddComponent,
    removeComponent as beRemoveComponent,
    hasComponent as beHasComponent,
    set as beSet,
    createRelation as beCreateRelation,
    getRelationTargets as beGetRelationTargets,
    query as beQuery,
    Or as beOr,
    observe as beObserve,
    onAdd as beOnAdd,
    onRemove as beOnRemove,
    onSet as beOnSet,
    // IsA as beIsA
} from 'bitecs/core/index.mjs';

import type { 
    World, 
    ComponentRef as Component, 
    Relation, 
    OnTargetRemovedCallback,
    QueryTerm,
    ObservableHook
} from 'bitecs/core';

import { IMessageQueue } from '#core/messaging/MessageQueues.js';

export type { 
    World, 
    Component, 
    Relation, 
    OnTargetRemovedCallback,
    QueryTerm
};

export type ObserverCallback = (entity: number, ...args: any[]) => void;

type PendingCallback = {
    entity: number;
    callback: ObserverCallback;
    args: any[];
}

export interface WorldContext {
    components: Record<string, any>;
    systems: Record<string, any>;  // Add systems storage
    actionHandlers: Map<string, (world: World<WorldContext>, entity: number, action: Component) => void>;
    gameId: number;
    inputQueues: Map<string, IMessageQueue<string>>;
    outputQueues: Map<string, IMessageQueue<string>>;

    /** Callback to be executed when the game ends */
    endGame: (gameId: number) => void;
    unsubscribes?: (() => void)[];

    /** Callbacks to be executed after the next call to addComponent completes. */
    pendingAddCallbacks: PendingCallback[];
    executingAddCallbacks: boolean;
}

export const createWorld = <T extends WorldContext>(context = {}):
        World<T> => {
    const defaultContext: WorldContext = {
        gameId: 0,
        components: {},
        systems: {},  // Initialize systems storage
        actionHandlers: new Map(),
        inputQueues: new Map(),
        outputQueues: new Map(),
        endGame: () => {},
        pendingAddCallbacks: [],
        executingAddCallbacks: false
    };
    return beCreateWorld({ ...defaultContext, ...context } as T);
}

/** World */
export const resetWorld = (world: World):World => beResetWorld(world);
export const deleteWorld = (world: World):void => beDeleteWorld(world);
export const getWorldComponents = (world: World):Component[] => 
    beGetWorldComponents(world);
export const getAllEntities = (world: World):number[] => beGetAllEntities(world);

/** Entities */
export const addEntity = (world: World):number => beAddEntity(world);
// export const addPrefab = (world: World, prefab: number):number => 
//     beAddPrefab(world, prefab);
export const getEntityComponents = (
    world: World, 
    entity: number
):Component[] => beGetEntityComponents(world, entity);

/** Components */
export const addComponent = (
    world: World<WorldContext>, 
    entity: number, 
    component: Component
):void => {
    beAddComponent(world, entity, component);
    executePendingAddCallbacks(world);
};

export const hasComponent = (
    world: World, 
    entity: number, 
    component: Component
):boolean => beHasComponent(world, entity, component);

export const removeComponent = (
    world: World, 
    entity: number, 
    component: Component
):void => beRemoveComponent(world, entity, component);

export const getComponent = (
    world: World, 
    entity: number,
    component: Component
): Component | undefined => (hasComponent(world, entity, component) && component) || undefined;

export const set = <T>(component: Component, value: T): Component => beSet(component, value);

/** Relations */
export const createRelation = <T>(options: {
    store?: () => T;
    exclusive?: boolean;
    autoRemoveSubject?: boolean;
    onTargetRemoved?: OnTargetRemovedCallback;
} = {}): Relation<T> => 
    beCreateRelation(options);
export const getRelationTargets = <T>(
    world: World, 
    entity: number, 
    relation: Relation<T>
):number[] => beGetRelationTargets(world, entity, relation);

/** Query */
export const query = (world: World, components: Component[]):number[] => beQuery(world, components);
export const Or = (...components: Component[]): any => beOr(...components);
export const onAdd = (...terms: QueryTerm[]): ObservableHook => beOnAdd(...terms) as unknown as ObservableHook;
export const onRemove = (...terms: QueryTerm[]): ObservableHook => beOnRemove(...terms) as unknown as ObservableHook;
export const onSet = (...terms: QueryTerm[]): ObservableHook => beOnSet(...terms) as unknown as ObservableHook;



export const observe = (
    world: World<WorldContext>, 
    hook: ObservableHook, 
    callback: ObserverCallback
): () => void => {
    // In bitECS observers fire before the component is added to the entity
    // We need to defer the callback to ensure the component is added.
    const wrappedCallback: ObserverCallback = (entity: number, ...args: any[]) => {
        queueCallback(world, entity, callback, args);
    };

    const unsubscribe = beObserve(world, hook, wrappedCallback);
    world.unsubscribes = world.unsubscribes || [];
    world.unsubscribes.push(unsubscribe);
    return unsubscribe;
};

/** Relations */
// export const IsA = (baseComponent: Component, component: Component): void => beIsA(baseComponent, component);

const queueCallback = (
    world: World<WorldContext>, 
    entity: number, 
    callback: ObserverCallback,
    args: any[]
) => {
    world.pendingAddCallbacks = world.pendingAddCallbacks || [];
    world.pendingAddCallbacks.push({ entity, callback, args });
};

const executePendingAddCallbacks = (world: World<WorldContext>) => {
    if (world.executingAddCallbacks) {
        return;
    }
    world.executingAddCallbacks = true;
    const queue = world.pendingAddCallbacks;

    try {
        while (queue.length > 0) {
            const {entity, callback, args} = queue[0];
            queue.shift();
            callback(entity, ...args);
        }
    } finally {
        world.executingAddCallbacks = false;
    }
};
