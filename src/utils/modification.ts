import logger from '@gravity-ui/ui-logger';
import {DetailedCellError, HyperFormula, RawCellContent} from 'hyperformula';

export type FormulaModificationSpec = {
    type: 'formula';
    formula: string;
    modificationName: string;
    // TODO: range: [number, number];
};

export type ModificationSpec = FormulaModificationSpec;

export type FormulaValidateFunc = (formula: string) => boolean;

const createHFInstance = (data: RawCellContent[][]): HyperFormula =>
    HyperFormula.buildFromArray(data, {
        licenseKey: 'gpl-v3',
    });

export const createFormulaValidator = (data: RawCellContent[][]): FormulaValidateFunc => {
    return (formula) => {
        const hfInstance = createHFInstance(data);
        return hfInstance.validateFormula(formula);
    };
};

export type ModificationError = {
    message: string;
    type: string;
};

export const applyModificationSpec = (
    data: RawCellContent[][],
    spec: ModificationSpec,
): [RawCellContent[][], ModificationError | undefined] => {
    switch (spec.type) {
        case 'formula': {
            const hfInstance = createHFInstance(
                data.map((row, i) => [...row, i === 0 ? spec.formula : '']),
            );
            const source = {sheet: 0, col: data[0].length, row: 0};
            hfInstance.copy({start: source, end: source});
            for (let i = 1; i < data.length; i++) {
                const destination = {sheet: 0, col: data[i].length, row: i};
                hfInstance.paste(destination);
            }
            let error;
            const modifiedData = data.map((row, i) => {
                const value = hfInstance.getCellValue({col: row.length, row: i, sheet: 0});
                if (value instanceof DetailedCellError) {
                    logger.logError(`Failed to apply formula: ${value}`);
                    error = value;
                    return [...row, ''];
                }
                return [...row, value];
            });

            hfInstance.destroy();

            return [modifiedData, error];
        }
        default:
            return [[], {type: 'UNIMPLEMENTED', message: `Unsupported modification: ${spec}`}];
    }
};
