export const generateColumnName = (columnNumber: number): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyz';

    let columnName = '';
    let i = columnNumber;
    while (i > 0 || columnName.length === 0) {
        // NOTE: From 2nd onwards A is 0, B is 1, and so on.
        const charIndex = columnName.length === 0 ? i % chars.length : (i % chars.length) - 1;
        columnName = chars[charIndex] + columnName;
        i = Math.trunc(i / chars.length);
    }
    return columnName.toUpperCase();
};

export const generateColumnNames = (columnCount: number): string[] => {
    const names: string[] = [];
    for (let i = 0; i < columnCount; i++) {
        names.push(generateColumnName(i));
    }
    return names;
};
