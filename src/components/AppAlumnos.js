import React from 'react';

import {newContextComponents} from "drizzle-react-components";

const {ContractData} = newContextComponents;

class AppAlumnos extends React.Component {

    state = {
        ready: false,
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
            matriculasLengthKey,
            matriculasKeys
        } = JSON.parse(JSON.stringify(this.state));

        if (!matriculasLengthKey) {
            matriculasLengthKey = instance.methods.matriculasLength.cacheCall();
            changed = true;
        } else {
            let ml = instanceState.matriculasLength[this.state.matriculasLengthKey];
            ml = ml ? ml.value : 0;
            for (let i = 0; i < ml; i++) {
                if (!matriculasKeys[i]) {
                    matriculasKeys[i] = instance.methods.matriculas.cacheCall(i);
                    changed = true;
                }
            }
        }

        if (changed) {
            this.setState({
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

        let ml = instanceState.matriculasLength[this.state.matriculasLengthKey];
        ml = ml ? ml.value : "??";

        let tbody = [];
        for (let i = 0; i < ml; i++) {

            let addr = instanceState.matriculas[this.state.matriculasKeys[i]];
            addr = addr ? addr.value : "";

            tbody[i] = (
                <tr key={"ALU-" + i}>
                    <th>A {i}</th>
                    <ContractData
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                        contract={"Asignatura"}
                        method={"matriculas"}
                        methodArgs={[i]}
                        render={matricula => (
                            <td>{matricula}</td>
                        )}
                    />
                    <ContractData
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                        contract={"Asignatura"}
                        method={"datosAlumno"}
                        methodArgs={[addr]}
                        render={datos => (
                            <>
                                <td>{datos.nombre}</td>
                                <td>{datos.email}</td>
                            </>
                        )}
                    />
                </tr>
            );
        }


        return (
            <section>
                <h1>Alumnos [{ml}]</h1>

                <table>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>Nombre</th>
                        <th>email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tbody}
                    </tbody>
                </table>
            </section>
        );
    }
}


export default AppAlumnos;