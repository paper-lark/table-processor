import {Table, TableProps} from '../Table';
import {Card} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './TableCard.scss';

const b = block('table-card');

export const TableCard: React.FC<TableProps> = (props) => {
    return (
        <Card className={b()} view="outlined">
            <Table {...props}></Table>
        </Card>
    );
};

export default TableCard;
