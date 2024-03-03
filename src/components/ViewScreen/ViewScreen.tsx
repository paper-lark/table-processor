import {Flex, Modal, useToaster} from '@gravity-ui/uikit';
import {useEffect, useMemo, useState} from 'react';
import {TableCard} from '../../components/TableCard';
import {ModificationSpec, applyModificationSpec} from '../../utils/modification';
import {Canvas} from '../Canvas';
import {
    ModificationHistory,
    NamedTable,
    applyModificationHistory,
    removeHistoryEntry,
} from '../../utils/history';
import {range} from '../../utils/range';
import {stubInputData, stubModificationHistory} from '../../utils/stub';
import Xarrow, {Xwrapper} from 'react-xarrows';
import {CreateModificationScreen} from '../CreateModificationScreen';

export type ViewScreenProps = {};

export const ViewScreen: React.FC<ViewScreenProps> = () => {
    // input
    const inputData = stubInputData;

    // history state
    const [history, setHistory] = useState<ModificationHistory>(stubModificationHistory);

    // calculate tables from history
    const {add: addToast} = useToaster();
    const [tables, initError] = useMemo(
        () => applyModificationHistory(inputData, history),
        [inputData],
    );
    useEffect(() => {
        if (initError) {
            addToast({
                name: initError.type,
                title: `Failed to apply history: ${initError.message}`,
                theme: 'warning',
                isClosable: true,
            });
        }
    }, [initError]);

    // create callbacks
    const [modifiedTable, setModifiedTable] = useState<number | undefined>(undefined);
    const resetModifiedTable = () => setModifiedTable(undefined);
    const applyModification = (modifiedTable: number, spec: ModificationSpec): boolean => {
        const [nt, applyError] = applyModificationSpec(tables[modifiedTable].table, spec);
        if (applyError) {
            addToast({
                name: 'formula error',
                title: `Failed to apply formula: [${applyError.type}] ${applyError.message}`,
                theme: 'warning',
                isClosable: true,
            });
            return false;
        } else {
            const newHistory: ModificationHistory = {
                modifications: [
                    ...history.modifications,
                    {
                        type: 'operation',
                        inputs: [modifiedTable],
                        spec,
                    },
                ],
            };
            setHistory(newHistory);
            tables.push({name: spec.modificationName, table: nt});
            resetModifiedTable();
            return true;
        }
    };
    const removeTable = (i: number) => {
        const [newHistory, error] = removeHistoryEntry(history, i);
        if (error) {
            addToast({
                name: error.type,
                title: `Failed to remove table: ${error.message}`,
                theme: 'warning',
                isClosable: true,
            });
        } else {
            setHistory(newHistory);
            tables.splice(i, 1);
        }
    };

    // organize tables
    const tablesByColumn = Array(history.modifications.length).fill(0);
    history.modifications.forEach((entry, i) => {
        if (entry.type === 'operation') {
            tablesByColumn[i] = Math.max(...entry.inputs.map((input) => tablesByColumn[input])) + 1;
        }
    });

    // render
    return (
        <Canvas>
            <Modal open={modifiedTable !== undefined} onClose={resetModifiedTable}>
                {modifiedTable === undefined ? undefined : (
                    <CreateModificationScreen
                        table={tables[modifiedTable]}
                        onApplyModification={(spec) => applyModification(modifiedTable, spec)}
                        onClose={resetModifiedTable}
                    ></CreateModificationScreen>
                )}
            </Modal>
            <Xwrapper>
                <Flex direction="row" gap="10">
                    {range(0, Math.max(...tablesByColumn) + 1, 1).map((i) => (
                        <Flex direction="column" key={i} gap="10">
                            {tables
                                .map<[NamedTable, number]>((t, n) => [t, n])
                                .filter((_, j) => tablesByColumn[j] === i)
                                .map(([t, n]) => (
                                    <TableCard
                                        id={`table-${n}`}
                                        key={n}
                                        name={t.name}
                                        data={t.table}
                                        onCreateModification={() => setModifiedTable(n)}
                                        onDelete={() => removeTable(n)}
                                    ></TableCard>
                                ))}
                        </Flex>
                    ))}
                </Flex>
                {history.modifications.flatMap((entry, j) => {
                    if (entry.type === 'operation') {
                        return entry.inputs.map((i) => (
                            <div style={{position: 'relative'}}>
                                <Xarrow
                                    key={`${j}-${i}`}
                                    color="var(--g-color-base-brand)"
                                    start={`table-${i}`}
                                    end={`table-${j}`}
                                    strokeWidth={2}
                                    headSize={6}
                                    curveness={1}
                                />
                            </div>
                        ));
                    }
                    return [];
                })}
            </Xwrapper>
        </Canvas>
    );
};

export default ViewScreen;
