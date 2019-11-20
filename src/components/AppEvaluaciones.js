import React from 'react';

import {drizzleConnect} from 'drizzle-react';
import PropTypes from 'prop-types'


const mapStateToProps = state => {
    return {
        Asignatura: state.contracts.Asignatura
    }
}


class AppEvaluaciones extends React.Component {

    state = {
        ready: false,
        evaluacionesLengthKey: null,
        evaluacionesKeys: []
    }

    constructor(props, context) {
        super(props)
        this.drizzle = context.drizzle;
    }

    componentDidMount() {
        this.setState({ready: true});
    }

    componentDidUpdate(prevProps, prevState, snapshoot) {

        const instanceState = this.props.Asignatura;
        if (!instanceState || !instanceState.initialized) return;

        const instance = this.drizzle.contracts.Asignatura;

        let changed = false;

        // Copiar el estado
        let {
            evaluacionesLengthKey,
            evaluacionesKeys
        } = JSON.parse(JSON.stringify(this.state));

        if (!evaluacionesLengthKey) { // Observar el metodo evaluacionesLength().
            evaluacionesLengthKey = instance.methods.evaluacionesLength.cacheCall();
            changed = true;
        } else {
            let el = instanceState.evaluacionesLength[this.state.evaluacionesLengthKey];
            el = el ? el.value : 0;
            for (let i = evaluacionesKeys.length; i < el; i++) {
                evaluacionesKeys[i] = instance.methods.evaluaciones.cacheCall(i);
                changed = true;
            }
        }

        //console.log(calificaciones)
        if (changed) {
            this.setState({
                evaluacionesLengthKey,
                evaluacionesKeys
            });
        }

    }


    render() {

        let evaluacionesLength;
        let tbody;

        const instanceState = this.props.Asignatura;
        if (instanceState && instanceState.initialized) {

            let el = instanceState.evaluacionesLength[this.state.evaluacionesLengthKey];
            evaluacionesLength = el ? el.value : 0;

            let evaluaciones = [];
            for (let i = 0; i < this.state.evaluacionesKeys.length; i++) {
                const eva = instanceState.evaluaciones[this.state.evaluacionesKeys[i]];
                evaluaciones[i] = eva ? eva.value : {nombre: "??", fecha: 0, puntos: 0};
            }

            tbody = evaluaciones.map((evaluacion, index) =>
                <tr key={index}>
                    <th>E {index}</th>
                    <td>{evaluacion.nombre}</td>
                    <td>{evaluacion.fecha ? (new Date(1000 * evaluacion.fecha)).toLocaleString() : ""}</td>
                    <td>{(evaluacion.puntos / 10).toFixed(1)}</td>
                </tr>);
        }


        return (
            <section>
                <h1>Evaluaciones [{evaluacionesLength}]</h1>
                <table border={1}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Fecha</th>
                        <th>Puntos</th>
                    </tr>
                    </thead>
                    <tbody>{tbody}</tbody>
                </table>
            </section>
        );
    }
}

AppEvaluaciones.contextTypes = {
    drizzle: PropTypes.object
};

const AppEvaluacionesContainer = drizzleConnect(AppEvaluaciones, mapStateToProps);

export default AppEvaluacionesContainer;