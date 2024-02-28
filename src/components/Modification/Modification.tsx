import {Button, Card, Tabs, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './Modification.scss';
import React, {useState} from 'react';
import {FormulaModificationSpec, ModificationSpec} from '../../utils/modification';

const b = block('modification');

type FormulaModificationProps = {
    className: string | undefined;
    applyModification: (spec: FormulaModificationSpec) => void;
};

const FormulaModification: React.FC<FormulaModificationProps> = ({
    className,
    applyModification,
}) => {
    const [formula, setFormula] = useState('');
    const onClick = () => {
        applyModification({
            type: 'formula',
            formula,
        });
        setFormula('');
    };

    return (
        <div className={className + ' ' + b('container')}>
            <TextInput
                label="Formula"
                placeholder="= SUM(A1)"
                onChange={(e) => setFormula(e.target.value)}
                value={formula}
            ></TextInput>
            <Button onClick={onClick}>Apply</Button>
        </div>
    );
};

export type ModificationProps = {
    applyModification: (spec: ModificationSpec) => void;
};

export const Modification: React.FC<ModificationProps> = ({applyModification}) => {
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
            />
        </Card>
    );
};

export default Modification;
