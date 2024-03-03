import {Button, Card, Tabs, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './Modification.scss';
import React, {useMemo, useState} from 'react';
import {FormulaModificationSpec, ModificationSpec} from '../../utils/modification';

const b = block('modification');

type FormulaModificationProps = {
    className: string | undefined;
    applyModification: (spec: FormulaModificationSpec) => boolean;
    validateModification: (spec: FormulaModificationSpec) => boolean;
};

const FormulaModification: React.FC<FormulaModificationProps> = ({
    className,
    applyModification,
    validateModification,
}) => {
    const [formula, setFormula] = useState('');
    const modification: FormulaModificationSpec = {
        type: 'formula',
        formula,
    };
    const onClick = () => {
        if (applyModification(modification)) {
            setFormula('');
        }
    };
    const isFormulaValid = useMemo(() => validateModification(modification), [formula]);
    const shouldShowError = !isFormulaValid && formula.length > 0;

    return (
        <div className={className + ' ' + b('container')}>
            <TextInput
                label="Formula"
                placeholder="= SUM(A1)"
                onChange={(e) => setFormula(e.target.value)}
                value={formula}
                validationState={shouldShowError ? 'invalid' : undefined}
                errorMessage="Formula is invalid"
            ></TextInput>
            <Button onClick={onClick} disabled={!isFormulaValid}>
                Apply
            </Button>
        </div>
    );
};

export type ModificationProps = {
    applyModification: (spec: ModificationSpec) => boolean;
    validateModification: (spec: ModificationSpec) => boolean;
};

export const Modification: React.FC<ModificationProps> = ({
    applyModification,
    validateModification,
}) => {
    // const [formulaResult, setFormulaResult] = useState<CellValue | undefined>(undefined);
    // const evaluateFormula = useCallback(() => {
    //     const evaluated = HyperFormula.buildFromArray(
    //         data.map((a) => [...a, formula]),
    //         {
    //             licenseKey: 'gpl-v3',
    //         },
    //     );
    //     const result = evaluated.getCellValue({col: data[0].length, row: 0, sheet: 0});
    //     evaluated.destroy();
    //     setFormulaResult(result);
    // }, [data, formula, setFormulaResult]);

    const tabs = [
        {id: 'formula', title: 'Apply formula'},
        {id: 'drop_columns', title: 'Drop columns'},
        {id: 'filter_rows', title: 'Filter rows'},
    ];
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <Card className={b()} view="outlined">
            <Tabs
                className={b('tabs')}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                items={tabs}
            />
            <FormulaModification
                className={b(activeTab === 'formula' ? 'active' : 'hidden')}
                applyModification={applyModification}
                validateModification={validateModification}
            />
        </Card>
    );
};

export default Modification;
