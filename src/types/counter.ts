interface Counter {
    [key: string]: number | undefined;
    uppercase?: number;
    lowercase?: number;
    numbers?: number;
    special?: number;
};

export { Counter };