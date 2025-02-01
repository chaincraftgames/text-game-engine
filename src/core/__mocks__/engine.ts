import { jest } from '@jest/globals';

export interface WorldContext {
    components: Record<string, any>;
}

export interface World<T = any> {
    components: Record<string, any>;
}

// Create a mock TrumpResults component
const mockTrumpResults = {
    rank: new Int32Array(10)
};

export const createWorld = jest.fn().mockImplementation(() => ({
    components: {
        TrumpResults: mockTrumpResults
    },
    systems: {},
}));

export const addComponent = jest.fn().mockImplementation((world, entity, component) => component);
export const removeComponent = jest.fn();
export const hasComponent = jest.fn();
export const getComponent = jest.fn();
export const set = jest.fn().mockImplementation((component) => component);
export const addEntity = jest.fn();
export const observe = jest.fn();
export const onAdd = jest.fn();
export const onRemove = jest.fn();
export const onSet = jest.fn();
export const query = jest.fn();
