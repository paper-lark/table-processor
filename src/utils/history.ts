import {RawCellContent} from 'hyperformula';
import {ModificationError, ModificationSpec, applyModificationSpec} from './modification';

export type ModificationHistory = {
    // Modifications in order of their addition.
    // Each entry can only have previous entries as inputs.
    modifications: ModificationHistoryEntry[];
};

export type ModificationHistoryEntry = ModificationInput | ModificationOperation;

export type ModificationInput = {
    type: 'input';
    name: string;
};

export type ModificationOperation = {
    type: 'operation';
    spec: ModificationSpec;
    inputs: number[];
};

export type NamedTable = {
    name: string;
    table: RawCellContent[][];
};

export const applyModificationHistory = (
    input: RawCellContent[][],
    history: ModificationHistory,
): [NamedTable[], ModificationError | undefined] => {
    const t = [];
    for (const entry of history.modifications) {
        if (entry.type === 'input') {
            t.push({name: entry.name, table: input});
        } else if (entry.type === 'operation') {
            // TODO: support multiple inputs
            const [nt, error] = applyModificationSpec(t[entry.inputs[0]].table, entry.spec);
            if (error) {
                t.length = 0;
                return [[], error];
            } else {
                t.push({name: entry.spec.modificationName, table: nt});
            }
        } else {
            t.length = 0;
            return [
                [],
                {type: 'UNIMPLEMENTED', message: `Unsupported history entry type: ${entry}`},
            ];
        }
    }
    return [t, undefined];
};

export const removeHistoryEntry = (
    history: ModificationHistory,
    removedEntry: number,
): [ModificationHistory, ModificationError | undefined] => {
    // check length
    if (history.modifications.length <= removedEntry) {
        return [
            history,
            {
                type: 'INVALID_ARGUMENT',
                message: `Cannot remove entry #${removedEntry} because it does not exist`,
            },
        ];
    }

    // check that removed element is the last one
    for (const entry of history.modifications) {
        if (entry.type === 'operation' && removedEntry in entry.inputs) {
            return [
                history,
                {
                    type: 'INVALID_ARGUMENT',
                    message: `Cannot remove non leaf entry #${removedEntry}`,
                },
            ];
        }
    }

    // modify elements
    return [
        {
            modifications: [
                ...history.modifications.slice(0, removedEntry),
                ...history.modifications.slice(removedEntry + 1).map((entry) => {
                    if (entry.type === 'operation') {
                        return {
                            ...entry,
                            inputs: entry.inputs.flatMap((i) => {
                                if (i === removedEntry) {
                                    return [];
                                }
                                if (i > removedEntry) {
                                    return [i - 1];
                                }
                                return [i];
                            }),
                        };
                    }
                    return entry;
                }),
            ],
        },
        undefined,
    ];
};
