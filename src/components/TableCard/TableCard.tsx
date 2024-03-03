import {Table} from '../Table';
import {Button, Card, Flex, Icon, Text as UIText} from '@gravity-ui/uikit';
import {Plus, TrashBin} from '@gravity-ui/icons';
import block from 'bem-cn-lite';

import './TableCard.scss';
import {RawCellContent} from 'hyperformula';

const b = block('table-card');

export type TableCardProps = {
    id: string | undefined;
    name: string;
    data: RawCellContent[][];

    onCreateModification: () => void;
    onDelete: () => void;
};

export const TableCard: React.FC<TableCardProps> = (props) => {
    return (
        <Card id={props.id} className={b()} view="outlined">
            <Flex direction="row" gap={2} justifyContent="space-between" alignItems="stretch">
                <UIText whiteSpace="nowrap" variant="subheader-2">
                    {props.name}
                </UIText>
                <Flex direction="row" gap={1}>
                    <Button size="s" view="flat" onClick={props.onCreateModification}>
                        <Icon data={Plus}></Icon>
                    </Button>
                    <Button size="s" view="flat" onClick={props.onDelete}>
                        <Icon data={TrashBin}></Icon>
                    </Button>
                </Flex>
            </Flex>
            <Table data={props.data}></Table>
        </Card>
    );
};

export default TableCard;
