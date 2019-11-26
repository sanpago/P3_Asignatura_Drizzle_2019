import React from 'react';

import {newContextComponents} from "drizzle-react-components";

const {ContractData} = newContextComponents;

class AppCalificaciones extends React.Component {

    state = {
        ready: false,
        evaluacionesLengthKey: null,
        matriculasLengthKey: null,
        matriculasKeys: []
    }

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.setState({ready: true});
    }

    componentDidUpdate(prevProps, prevState, snapshoot) {
        const {drizzle, drizzleState} = this.props;

        const instanceState = drizzleState.contracts.Asignatura;
        if (!instanceState || !instanceState.initialized) return;

        const instance = drizzle.contracts.Asignatura;

        let changed = false;

        // Copiar el estado
        let {
            evaluacionesLengthKey,
            matriculasLengthKey,
            matriculasKeys
        } = JSON.parse(JSON.stringify(this.state));

        if (!evaluacionesLengthKey) {
            evaluacionesLengthKey = instance.methods.evaluacionesLength.cacheCall();
            changed = true;
        }
        let el = instanceState.evaluacionesLength[this.state.evaluacionesLengthKey];
        el = el ? el.value : 0;

        if (!matriculasLengthKey) {
            matriculasLengthKey = instance.methods.matriculasLength.cacheCall();
            changed = true;
        }
        let ml = instanceState.matriculasLength[this.state.matriculasLengthKey];
        ml = ml ? ml.value : 0;

        for (let i = 0; i < ml; i++) {
            if (!matriculasKeys[i]) {
                matriculasKeys[i] = instance.methods.matriculas.cacheCall(i);
                changed = true;
            }
        }

        if (changed) {
            this.setState({
                evaluacionesLengthKey,
                matriculasLengthKey,
                matriculasKeys
            });
        }
    }

    render() {
        const {drizzle, drizzleState} = this.props;

        const instanceState = drizzleState.contracts.Asignatura;
        if (!this.state.ready || !instanceState || !instanceState.initialized) {
            return <span>Initializing...</span>;
        }

        let el = instanceState.evaluacionesLength[this.state.evaluacionesLengthKey];
        el = el ? el.value : 0;

        let ml = instanceState.matriculasLength[this.state.matriculasLengthKey];
        ml = ml ? ml.value : 0;

        let thead = [<th key={"ha"}>A-E</th>];
         for (let i = 0; i < el; i++) {
            thead.push(<th key={"h-" + i}>E {i}</th>);
        }

        let calificaciones = [];
        for (let mi = 0; mi < ml ; mi++) {
            calificaciones[mi] = [];

            let addr = instanceState.matriculas[this.state.matriculasKeys[mi]];
            addr = addr ? addr.value : false;

            if (addr) {
                for (let ei = 0; ei < el; ei++) {

                    calificaciones[mi][ei] = (
                        <ContractData
                            drizzle={drizzle}
                            drizzleState={drizzleState}
                            contract={"Asignatura"}
                            method={"calificaciones"}
                            methodArgs={[addr, ei]}
                            render={nota => (
                                <td key={"p2-" + mi + "-" + ei}>
                                    {nota.tipo === "0" ? "N.P." : ""}
                                    {nota.tipo === "1" ? (nota.calificacion / 10).toFixed(1) : ""}
                                    {nota.tipo === "2" ? (nota.calificacion / 10).toFixed(1) + "(M.H.)" : ""}
                                </td>
                            )}
                        />
                    );
                }
            }
        }

        let tbody = calificaciones.map((row, mi) => (
            <tr key={"d" + mi}>
                <th>A {mi}</th>
                {row}
            </tr>)
        );

        return (
            <section>
                <h1>Calificaciones</h1>
                <table>
                    <thead>{thead}</thead>
                    <tbody>{tbody}</tbody>
                </table>
            </section>
        );
    }
}

export default AppCalificaciones;