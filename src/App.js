
import React from 'react';
import {drizzleConnect} from 'drizzle-react';
import PropTypes from 'prop-types'

import './App.css';


const mapStateToProps = state => {
    return {
        drizzleStatus: state.drizzleStatus,
        web3: state.web3
    }
}


class App extends React.Component {

    render() {
        if (this.props.web3.status === 'failed') {
            return ( // Display a web3 warning.
                <main>
                    <h1>⚠️</h1>
                    <p>No connection to the Ethereum network. Please use the MetaMask extension.</p>
                </main>
            )
        }

        if (!this.props.drizzleStatus.initialized) {
            return ( // Display a loading indicator.
                <main>
                    <h1>⚙️</h1>
                    <p>Loading dapp...</p>
                </main>
            );
        }

        return (
            <main>
                <header className="App">
                    <h1>P3 - Asignatura</h1>
                </header>
            </main>
        );
    }
}

App.contextTypes = {
    drizzle: PropTypes.object
};

const AppContainer = drizzleConnect(App, mapStateToProps);

export default AppContainer;