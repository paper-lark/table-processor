import {Wrapper} from './components/Wrapper';
import {ViewScreen} from './components/ViewScreen';
import {ToasterComponent} from '@gravity-ui/uikit';

const App = () => {
    return (
        <Wrapper>
            <ViewScreen />
            <ToasterComponent />
        </Wrapper>
    );
};

export default App;
