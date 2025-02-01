export interface IMessageQueue<T> {
    /** Enqueues the message. */
    enqueue(message: T): void;
    
    /** Returns the next message in the queue or null if no message is available. */
    dequeue(): T | null;

    /** 
     * Returns a promise that resolves when a message is available in the
     * queue, without removing the message.
     */
    waitForAvailableMessage(): Promise<void>;

    clear(): void;
}

export class MessageQueue<T> implements IMessageQueue<T> {
    private queue: T[] = [];
    private resolvers: (() => void)[] = [];

    enqueue(message: T): void {
        console.debug('[MessageQueue] Enqueue: %s', message);
        this.queue.push(message);
        
        // Notify all waiters
        if (this.resolvers.length > 0) console.debug('[MessageQueue] Message arrived, resolving promise');
        this.resolvers.forEach(resolve => resolve());
        this.resolvers.length = 0;
    }

    dequeue(): T | null {
        if (this.queue.length > 0) console.debug('[MessageQueue] Dequeueing message %s', this.queue[0]);
        return this.queue.shift() ?? null;
    }

    async waitForAvailableMessage(): Promise<void> {
        if (this.queue.length > 0) {
            console.debug('[MessageQueue] Message was already available');
            return Promise.resolve();
        }
        
        return new Promise<void>(resolve => {
            console.debug('[MessageQueue] Waiting for message to arrive');
            this.resolvers.push(resolve);
        });
    }

    clear(): void {
        this.queue.length = 0;
    }
}
