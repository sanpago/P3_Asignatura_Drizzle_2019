import React from 'react';

import {drizzleConnect} from 'drizzle-react';
import PropTypes from 'prop-types'


const mapStateToProps = state => {
    return {
        Asignatura: state.contracts.Asignatura
    }
}


class AppAlumnos extends React.Component {

    state = {
        ready: false,
        matriculasLengthKey: null,
        matriculasKeys: [],
        datosAlumnoKeys: []
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
            matriculasLengthKey,
            matriculasKeys,
            datosAlumnoKeys
        } = JSON.parse(JSON.stringify(this.state));

        if (!matriculasLengthKey) { // Observar el metodo matriculasLength().
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

                if (matriculasKeys[i]) {
                    let addr = instanceState.matriculas[this.state.matriculasKeys[i]];
                    if (addr) {
                        addr = addr.value;
                        if (!datosAlumnoKeys[i]) {
                            datosAlumnoKeys[i] = instance.methods.datosAlumno.cacheCall(addr);
                            changed = true;
                        }
                    }
                }
            }
        }

        if (changed) {
            this.setState({
                matriculasLengthKey,
                matriculasKeys,
                datosAlumnoKeys
            });
        }
    }


    render() {

        let matriculasLength;
        let tbody;

        const instanceState = this.props.Asignatura;
        if (instanceState && instanceState.initialized) {

            let ml = instanceState.matriculasLength[this.state.matriculasLengthKey];
            matriculasLength = ml ? ml.value : "??";

            let matriculas = [];
            for (let i = 0; i < this.state.matriculasKeys.length; i++) {
                const addr = instanceState.matriculas[this.state.matriculasKeys[i]];
                matriculas[i] = addr ? addr.value : "";
            }

            let datosAlumnos = [];
            for (let i = 0; i < this.state.datosAlumnoKeys.length; i++) {
                const da = instanceState.datosAlumno[this.state.datosAlumnoKeys[i]];
                datosAlumnos[i] = da ? da.value : {nombre: "??", email: "@"};
            }

            tbody = datosAlumnos.map((datosAlumno, index) =>
                <tr key={index}>
                    <th>A {index}</th>
                    <td>{matriculas[index]}</td>
                    <td>{datosAlumno.nombre}</td>
                    <td>{datosAlumno.email}</td>
                </tr>)
        }

        return (
            <section>
                <h1>Alumnos [{matriculasLength}]</h1>

                <table border={1}>
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


AppAlumnos.contextTypes = {
    drizzle: PropTypes.object
};


const AppAlumnosContainer = drizzleConnect(AppAlumnos, mapStateToProps);

export default AppAlumnosContainer;