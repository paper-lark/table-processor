import DataTable, {Column} from '@gravity-ui/react-data-table';
import {Wrapper} from './components/Wrapper';
import {Button, Text as GravityText, TextInput} from '@gravity-ui/uikit';
import {useCallback, useMemo, useState} from 'react';
import {CellValue, HyperFormula} from 'hyperformula';
import {YCLOUD_THEME} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import {generateColumnNames} from './utils/columns';
import {generateData} from './utils/data';

const App = () => {
    const data = useMemo(() => generateData(10), []);
    const columnCount = data.reduce((prev, arr) => Math.max(prev, arr.length), 0);
    const columnNames = generateColumnNames(columnCount);

    const dataByColumns = data.map((row) => {
        const result: {[key: string]: unknown} = {};
        row.forEach((v, i) => {
            result[columnNames[i]] = v;
        });
        return result;
    }, {});

    const columns: Column<unknown>[] = columnNames.map((v) => ({name: v}));

    const [formula, setFormula] = useState('');

    const [formulaResult, setFormulaResult] = useState<CellValue | undefined>(undefined);
    const evaluateFormula = useCallback(() => {
        const evaluated = HyperFormula.buildFromArray(
            data.map((a) => [...a, formula]),
            {
                licenseKey: 'gpl-v3',
            },
        );
        const result = evaluated.getCellValue({col: data[0].length, row: 0, sheet: 0});
        evaluated.destroy();
        setFormulaResult(result);
    }, [data, formula, setFormulaResult]);

    return (
        <Wrapper>
            <DataTable theme={YCLOUD_THEME} data={dataByColumns} columns={columns} startIndex={1} />
            <TextInput
                label="Formula"
                placeholder="=SUM(…)"
                onChange={(e) => setFormula(e.target.value)}
                value={formula}
            ></TextInput>
            <Button view="action" size="l" onClick={evaluateFormula}>
                Evaluate
            </Button>
            <GravityText>Result: {formulaResult?.toLocaleString()}</GravityText>
        </Wrapper>
    );
};

export default App;
