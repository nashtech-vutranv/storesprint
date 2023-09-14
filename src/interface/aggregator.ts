interface IAggregator {
    id: string;
    name: string;
    version: number;
    status: string;
    createdAt?: string;
    modifiedAt?: string;
}

export type {IAggregator}