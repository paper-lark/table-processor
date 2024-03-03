import {Container, ToastProps, useToaster} from '@gravity-ui/uikit';
import {useEffect, useMemo, useState} from 'react';
import {CellValue, RawCellContent} from 'hyperformula';
import {generateData} from '../..//utils/data';
import {TableCard} from '../../components/TableCard';
import {Modification} from '../../components/Modification';
import {
    ModificationSpec,
    applyModificationSpec,
    createFormulaValidator,
} from '../../utils/modification';

export type ViewScreenProps = {};

export const ViewScreen: React.FC<ViewScreenProps> = () => {
    // input
    const originalData = useMemo(() => generateData(10), []);

    // state
    const [modifications, setModifications] = useState<ModificationSpec[]>([]);
    const [modifiedData, setModifiedData] = useState<RawCellContent[][]>(originalData);
    const [errorToast, setErrorToast] = useState<ToastProps | undefined>(undefined);
    const applyModification = (spec: ModificationSpec): boolean => {
        const [modified, error] = applyModificationSpec(modifiedData, spec);
        if (error) {
            setErrorToast({
                name: 'formula error',
                title: `Failed to apply formula: ${error.message}`,
                theme: 'warning',
                isClosable: true,
            });
            return false;
        } else {
            setModifiedData(modified);
            setModifications([...modifications, spec]);
            return true;
        }
    };

    // toaster
    const {add: addToast} = useToaster();
    useEffect(() => {
        if (errorToast) {
            addToast(errorToast);
        }
    }, [errorToast]);

    // callbacks
    const validateModification = useMemo(() => {
        const formulaValidator = createFormulaValidator(modifiedData);
        return (spec: ModificationSpec): boolean => {
            if (spec.type === 'formula') {
                return formulaValidator(spec.formula);
            }
            return true;
        };
    }, [modifiedData]);

    return (
        <Container style={{display: 'flex', padding: 20, gap: 20}}>
            <TableCard data={originalData}></TableCard>
            <Modification
                applyModification={applyModification}
                validateModification={validateModification}
            />
            <TableCard data={modifiedData as CellValue[][]}></TableCard>
        </Container>
    );
};

export default ViewScreen;
