import DataTable, {Column} from '@gravity-ui/react-data-table';
import {CellValue} from 'hyperformula';
import {YCLOUD_THEME} from '@gravity-ui/react-data-table/build/esm/lib/constants';
import {generateColumnNames} from '../../utils/columns';

export type TableProps = {
    data: CellValue[][];
};

export const Table: React.FC<TableProps> = ({data}) => {
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

    return <DataTable theme={YCLOUD_THEME} data={dataByColumns} columns={columns} startIndex={1} />;
};

export default Table;
