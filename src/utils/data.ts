export const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
};

export const generateData = (size: number): number[][] => {
    return Array(size)
        .fill(0)
        .map(() =>
            Array(size)
                .fill(0)
                .map(() => getRandomInt(1000)),
        );
};
