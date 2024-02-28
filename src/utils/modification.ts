import {DetailedCellError, HyperFormula, RawCellContent} from 'hyperformula';

export type FormulaModificationSpec = {
    type: 'formula';
    formula: string;
    // TODO: range: [number, number];
};

export type ModificationSpec = FormulaModificationSpec;

export const applyModificationSpec = (
    data: RawCellContent[][],
    spec: ModificationSpec,
): (RawCellContent | DetailedCellError)[][] => {
    switch (spec.type) {
        case 'formula': {
            const hfInstance = HyperFormula.buildFromArray(
                data.map((row, i) => [...row, i === 0 ? spec.formula : '']),
                {
                    licenseKey: 'gpl-v3',
                },
            );
            const source = {sheet: 0, col: data[0].length, row: 0};
            hfInstance.copy({start: source, end: source});
            for (let i = 1; i < data.length; i++) {
                const destination = {sheet: 0, col: data[i].length, row: i};
                hfInstance.paste(destination);
            }
            const modifiedData = data.map((row, i) => [
                ...row,
                hfInstance.getCellValue({col: row.length, row: i, sheet: 0}),
            ]);

            hfInstance.destroy();

            return modifiedData;
        }
        default:
            return data;
    }
};
