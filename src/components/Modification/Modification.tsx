import {Button, Card, Tabs, TextInput, Text as UIText} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';

import './Modification.scss';
import React, {useMemo, useState} from 'react';
import {FormulaModificationSpec, ModificationSpec} from '../../utils/modification';

const b = block('modification');

type FormulaModificationProps = {
    className: string | undefined;
    modificationName: string;
    applyModification: (spec: FormulaModificationSpec) => boolean;
    validateModification: (spec: FormulaModificationSpec) => boolean;
};

const FormulaModification: React.FC<FormulaModificationProps> = ({
    className,
    modificationName,
    applyModification,
    validateModification,
}) => {
    const [formula, setFormula] = useState('');
    const modification: FormulaModificationSpec = {
        type: 'formula',
        modificationName,
        formula,
    };
    const onClick = () => {
        if (applyModification(modification)) {
            setFormula('');
        }
    };
    const isFormulaValid = useMemo(() => validateModification(modification), [formula]);
    const shouldShowError = !isFormulaValid && formula.length > 0;
    const isButtonActive = isFormulaValid && modificationName.length > 0;

    return (
        <div className={className + ' ' + b('container')}>
            <TextInput
                label="Formula:"
                placeholder="= SUM(A1)"
                onChange={(e) => setFormula(e.target.value)}
                value={formula}
                validationState={shouldShowError ? 'invalid' : undefined}
                errorMessage="Formula is invalid"
            ></TextInput>
            <Button onClick={onClick} disabled={!isButtonActive}>
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
    const tabs = [
        {id: 'formula', title: 'Apply formula'},
        {id: 'drop_columns', title: 'Drop columns'},
        {id: 'filter_rows', title: 'Filter rows'},
    ];
    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [name, setName] = useState('');

    return (
        <Card className={b()} view="outlined">
            <UIText whiteSpace="nowrap" variant="subheader-2" className={b('title')}>
                Modification
            </UIText>
            <TextInput
                label="Name:"
                placeholder="Modification name"
                onChange={(e) => setName(e.target.value)}
                value={name}
            ></TextInput>
            <Tabs
                className={b('tabs')}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                items={tabs}
            />
            <FormulaModification
                className={b(activeTab === 'formula' ? 'active' : 'hidden')}
                modificationName={name}
                applyModification={applyModification}
                validateModification={validateModification}
            />
        </Card>
    );
};

export default Modification;
