interface Counter {
    [key: string]: number | undefined;
    uppercase?: number;
    lowercase?: number;
    number?: number;
    special?: number;
};

export { Counter };