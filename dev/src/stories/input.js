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
                {this.props.render(this.state)}
            </React.Fragment>
        );
    }
}
