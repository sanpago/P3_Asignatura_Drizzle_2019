import React from 'react';

import {drizzleConnect} from 'drizzle-react';
import PropTypes from 'prop-types'


const mapStateToProps = state => {
    return {
        drizzleStatus: state.drizzleStatus,
        Asignatura: state.contracts.Asignatura
    }
}


class AppHeader extends React.Component {

    state = {
        name: null,
        curso: null
    }

    constructor(props, context) {
        super(props)
        this.drizzle = context.drizzle;
    }

    async componentDidMount() {
        const instance = this.drizzle.contracts.Asignatura;
        const name = await instance.methods.nombre().call();
        const curso = await instance.methods.curso().call();

        this.setState({name, curso})
    }

    render() {
        return (
            <header className="App">
                <h1>P3 - Asignatura {this.state.name} (<em>{this.state.curso}</em>)</h1>
            </header>
        );
    }
}

AppHeader.contextTypes = {
    drizzle: PropTypes.object
};

const AppHeaderContainer = drizzleConnect(AppHeader, mapStateToProps);

export default AppHeaderContainer;