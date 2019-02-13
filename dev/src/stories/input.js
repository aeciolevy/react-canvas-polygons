import React from 'react';

export default class Input extends React.PureComponent {
    state = {
        brush: 2,
        color: '#000000'
    }

    handleChange = (event) => {
        const { value, name } = event.target;
        const newValue = { [name]: value };
        this.setState({ ...newValue })
    }

    handleButtonClick = (event) => {
        event.stopPropagation();
        const { name } = event.target;
        this.setState({ tool: name });
    };

    render() {
        return(
            <React.Fragment>
                <div>
                    <input type="range" min="1" max="20" value={this.state.brush}
                        name="brush" className="slider" onChange={this.handleChange} />
                    <span> Size: {this.state.brush}</span>
                </div>
                <div>
                    <input type="color" name="color"
                        value={this.state.color} onChange={this.handleChange}/>
                    <label htmlFor="color"> Color </label>
                </div>
                <div onClick={this.handleButtonClick}>
                    <button name="Line"
                        style={{ backgroundColor: this.state.tool === 'Line' && '#8080805c' || 'unset' }}>
                        Line
                    </button>
                    <button name="Polygon"
                        style={{ backgroundColor: this.state.tool === 'Polygon' && '#8080805c' || 'unset' }}
                    >
                        Polygon
                    </button>
                    <button name="Rectangle"
                        style={{ backgroundColor: this.state.tool === 'Rect' && '#8080805c' || 'unset' }}
                    >
                        Rectangle
                    </button>
                </div>
                {/* <div>
                    <button onClick={this.cleanCanvas}>
                        Clean Canvas
                    </button>
                    <button onClick={this.undo}>
                        Undo
                    </button>
                </div> */}
                {this.props.render(this.state)}
            </React.Fragment>
        );
    }
}
