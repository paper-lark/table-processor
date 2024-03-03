import block from 'bem-cn-lite';

import './Canvas.scss';

const b = block('canvas');

export type CanvasProps = {
    children: React.ReactNode;
};

export const Canvas: React.FC<CanvasProps> = (props) => {
    return (
        <div className={b()}>
            <div className={b('container')}>{props.children}</div>
        </div>
    );
};

export default Canvas;
