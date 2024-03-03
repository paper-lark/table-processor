import {Button, Card, Flex, Icon} from '@gravity-ui/uikit';
import {NamedTable} from '../../utils/history';
import {ModificationSpec, createFormulaValidator} from '../../utils/modification';
import {Modification} from '../Modification';
import {useMemo} from 'react';
import {Table} from '../Table';
import {Xmark} from '@gravity-ui/icons';

export type CreateModificationScreenProps = {
    table: NamedTable;
    onApplyModification: (spec: ModificationSpec) => boolean;
    onClose: () => void;
};

export const CreateModificationScreen: React.FC<CreateModificationScreenProps> = (props) => {
    const validateModification = useMemo(() => {
        const formulaValidator = createFormulaValidator(props.table.table);
        return (spec: ModificationSpec): boolean => {
            if (spec.type === 'formula') {
                return formulaValidator(spec.formula);
            }
            return true;
        };
    }, [props.table.table]);

    return (
        <Card style={{padding: '20px'}}>
            <Flex gap={4}>
                <Modification
                    applyModification={props.onApplyModification}
                    validateModification={validateModification}
                />
                <Table data={props.table.table} />
                <Button size="s" view="flat" onClick={props.onClose}>
                    <Icon data={Xmark}></Icon>
                </Button>
            </Flex>
        </Card>
    );
};

export default CreateModificationScreen;
