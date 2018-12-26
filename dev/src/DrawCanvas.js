import React from 'react';
import type from 'prop-types';

class DrawCanvas extends React.PureComponent {

    static propTypes = {
        width: type.string,
        height: type.string,
    }



    render() {
        return(
            <div> Test </div>
        );
    }
}

export default DrawCanvas;
