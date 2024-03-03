import {RawCellContent} from 'hyperformula';
import {generateData} from './data';
import {ModificationHistory} from './history';

export const stubInputData: RawCellContent[][] = generateData(10);
export const stubModificationHistory: ModificationHistory = {
    modifications: [
        {
            type: 'input',
            name: 'Input',
        },
        {
            type: 'operation',
            spec: {
                type: 'formula',
                modificationName: 'Summed 1',
                formula: '=SUM(A1:B3)',
            },
            inputs: [0],
        },
        {
            type: 'operation',
            spec: {
                type: 'formula',
                modificationName: 'Summed 2',
                formula: '=SUM(D1:F1)',
            },
            inputs: [0],
        },
        {
            type: 'operation',
            spec: {
                type: 'formula',
                modificationName: 'Summed 3',
                formula: '=SUM(A1:A3)',
            },
            inputs: [1],
        },
    ],
};
