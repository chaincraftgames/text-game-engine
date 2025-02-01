const stateKeys: string[] = [];

export const State = {
    stateId: new Uint8Array()
};

export const setState = (gameId: number, stateKey: string) => {
    // Get the index of the stateKey in the stateKeys array.  If it doesn't exist, add it.
    const stateIndex = stateKeys.indexOf(stateKey);
    if (stateIndex === -1) {
        stateKeys.push(stateKey);
        State.stateId[gameId] = stateKeys.length - 1;
    } else {
        State.stateId[gameId] = stateIndex;
    }
};

export const getState = (gameId: number): string | undefined => {
    return stateKeys[State.stateId[gameId]];
};