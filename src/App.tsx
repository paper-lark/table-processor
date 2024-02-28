import {Wrapper} from './components/Wrapper';
import {Container} from '@gravity-ui/uikit';
import {useMemo, useState} from 'react';
import {CellValue, RawCellContent} from 'hyperformula';
import {generateData} from './utils/data';
import {TableCard} from './components/TableCard';
import {Modification} from './components/Modification';
import {ModificationSpec, applyModificationSpec} from './utils/modification';

const App = () => {
    const originalData = useMemo(() => generateData(10), []);

    const [modifications, setModifications] = useState<ModificationSpec[]>([]);
    const [modifiedData, setModifiedData] = useState<unknown[][]>(originalData);
    const applyModification = (spec: ModificationSpec) => {
        setModifiedData(applyModificationSpec(modifiedData as RawCellContent[][], spec)); // FIXME: do not cast
        setModifications([...modifications, spec]);
    };

    return (
        <Wrapper>
            <Container style={{display: 'flex', padding: 20, gap: 20}}>
                <TableCard data={originalData}></TableCard>
                <Modification applyModification={applyModification} />
                <TableCard data={modifiedData as CellValue[][]}></TableCard>
            </Container>
        </Wrapper>
    );
};

export default App;
