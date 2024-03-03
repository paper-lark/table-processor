import {Table} from '../Table';
import {Card, Text as UIText} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './TableCard.scss';
import {RawCellContent} from 'hyperformula';

const b = block('table-card');

export type TableCardProps = {
    name: string;
    data: RawCellContent[][];
};

export const TableCard: React.FC<TableCardProps> = (props) => {
    return (
        <Card className={b()} view="outlined">
            <UIText whiteSpace="nowrap" variant="subheader-2">
                {props.name}
            </UIText>
            <Table data={props.data}></Table>
        </Card>
    );
};

export default TableCard;
