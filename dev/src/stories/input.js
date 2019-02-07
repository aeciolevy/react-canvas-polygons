import React from 'react';

export default class Input extends React.PureComponent {
    state = {
        value: 2
    }

    handleChange = (event) => {
        const { value } = event.target;
        this.setState({ value: Number(value) })
    }

    render() {
        return(
            <React.Fragment>
                <input type="range" min="1" max="20" value={this.state.value}
                    className="slider" onChange={this.handleChange} />
                {this.props.render(this.state)}
                <span> Size: {this.state.value}</span>
            </React.Fragment>
        );
    }
}
