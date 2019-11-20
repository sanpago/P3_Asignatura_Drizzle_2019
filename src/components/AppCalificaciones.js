import React from 'react';

import {drizzleConnect} from 'drizzle-react';
import PropTypes from 'prop-types'


let contador = 0;

const mapStateToProps = state => {
    return {
        Asignatura: state.contracts.Asignatura
    }
}


class AppCalificaciones extends React.Component {

    state = {
        ready: false,
        evaluacionesLengthKey: null,
        matriculasLengthKey: null,
        matriculasKeys: [],        // [indice matricula]
        calificacionesKeys: []   // [indice matricula][indice evaluacion]
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
            matriculasLengthKey,
            matriculasKeys,
            calificacionesKeys
        } = JSON.parse(JSON.stringify(this.state));


        if (!evaluacionesLengthKey) { // Observar el metodo evaluacionesLength().
            evaluacionesLengthKey = instance.methods.evaluacionesLength.cacheCall();
            changed = true;
        }

        let el = instanceState.evaluacionesLength[this.state.evaluacionesLengthKey];
        let evaluacionesLength = el ? el.value : 0;

        if (!matriculasLengthKey) { // Observar el metodo matriculasLength().
            matriculasLengthKey = instance.methods.matriculasLength.cacheCall();
            changed = true;
        }

        let ml = instanceState.matriculasLength[this.state.matriculasLengthKey];
        let matriculasLength = ml ? ml.value : 0;

        for (let i = 0; i < matriculasLength; i++) {
            if (!matriculasKeys[i]) {
                matriculasKeys[i] = instance.methods.matriculas.cacheCall(i);
                changed = true;
            }
        }

        for (let mi = 0; mi < matriculasLength; mi++) {
            calificacionesKeys[mi] = calificacionesKeys[mi] || [];

            let addr = instanceState.matriculas[this.state.matriculasKeys[mi]];
            addr = addr ? addr.value : false;

            if (addr) {
                for (let ei = calificacionesKeys[mi].length ; ei < evaluacionesLength; ei++) {
                    if (!calificacionesKeys[mi][ei]) {
                        calificacionesKeys[mi][ei] = instance.methods.calificaciones.cacheCall(addr, ei);
                        changed = true;
                    }
                }
            }
        }

        //console.log(calificaciones)
        if (changed) {
            this.setState({
                evaluacionesLengthKey,
                matriculasLengthKey,
                matriculasKeys,
                calificacionesKeys
            });
        }
    }

    render() {
        let thead;
        let tbody;

        const instanceState = this.props.Asignatura;
        if (instanceState && instanceState.initialized) {

            let el = instanceState.evaluacionesLength[this.state.evaluacionesLengthKey];
            let evaluacionesLength = el ? el.value : 0;

            let calificaciones = [];
            for (let mi = 0; mi < this.state.calificacionesKeys.length; mi++) {
                calificaciones[mi] = [];
                for (let ei = 0; ei < this.state.calificacionesKeys[mi].length; ei++) {
                    const cal = instanceState.calificaciones[this.state.calificacionesKeys[mi][ei]];
                    calificaciones[mi][ei] = cal ? cal.value : {tipo: "??", calificacion: 0};
                }
            }

            thead = [
                <th key={"ha"}>A-E</th>
            ];
            for (let i = 0 ; i < evaluacionesLength ; i++) {
                thead.push(<th key={"h-"+i}>E {i}</th>);
            }

            tbody = calificaciones.map((row, mi) => {
                let x = row.map((col, ei) => {
                    let str;
                    switch (col.tipo) {
                        case "0":
                            str = "N.P."
                            break;
                        case "1":
                            str = (col.calificacion/10).toFixed(1);
                            break;
                        case "2":
                            str = (col.calificacion/10).toFixed(1) + "(M.H.)";
                            break;
                        default:
                            str = "-"
                    }
                    return (
                        <td key={"p2-" + mi + "-" + ei}>{str}</td>
                    );
                })
                return (
                    <tr key={"d" + mi}>
                        <th>A {mi}</th>
                        {x}
                    </tr>);
            })
        }

        return (
            <section>
                <h1>Calificaciones</h1>
                <table border={3}>
                    <thead>{thead}</thead>
                    <tbody>{tbody}</tbody>
                </table>
            </section>
        );
    }
}


AppCalificaciones.contextTypes = {
    drizzle: PropTypes.object
};

const AppCalificacionesContainer = drizzleConnect(AppCalificaciones, mapStateToProps);

export default AppCalificacionesContainer;