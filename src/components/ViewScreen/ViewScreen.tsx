import {ToastProps, useToaster} from '@gravity-ui/uikit';
import {useEffect, useMemo, useState} from 'react';
import {RawCellContent} from 'hyperformula';
import {generateData} from '../..//utils/data';
import {TableCard} from '../../components/TableCard';
import {Modification} from '../../components/Modification';
import {
    ModificationSpec,
    applyModificationSpec,
    createFormulaValidator,
} from '../../utils/modification';
import {Canvas} from '../Canvas';

export type ViewScreenProps = {};

export const ViewScreen: React.FC<ViewScreenProps> = () => {
    // input
    const originalData = useMemo(() => generateData(10), []);

    // state
    const [modifications, setModifications] = useState<ModificationSpec[]>([]);
    const [modifiedData, setModifiedData] = useState<RawCellContent[][]>(originalData);
    const [modifiedName, setModifiedName] = useState('Modified data');
    const [errorToast, setErrorToast] = useState<ToastProps | undefined>(undefined);
    const applyModification = (spec: ModificationSpec): boolean => {
        const [modified, error] = applyModificationSpec(modifiedData, spec);
        if (error) {
            setErrorToast({
                name: 'formula error',
                title: `Failed to apply formula: [${error.type}] ${error.message}`,
                theme: 'warning',
                isClosable: true,
            });
            return false;
        } else {
            setModifiedData(modified);
            setModifications([...modifications, spec]);
            setModifiedName(spec.modificationName);
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
        <Canvas>
            <TableCard name="Original data" data={originalData}></TableCard>
            <Modification
                applyModification={applyModification}
                validateModification={validateModification}
            />
            <TableCard name={modifiedName} data={modifiedData}></TableCard>
        </Canvas>
    );
};

export default ViewScreen;
