import React from 'react';

import {DrizzleContext} from "drizzle-react";

import {
    BrowserRouter as Router,
    Route,
    Link
} from "react-router-dom";

import AppHeader from './AppHeader';
import AppEvaluaciones from "./AppEvaluaciones";
import AppAlumnos from "./AppAlumnos";
import AppCalificaciones from "./AppCalificaciones";

const Navegacion = () => (
    <nav>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/evaluaciones/">Evaluaciones</Link></li>
            <li><Link to="/alumnos/">Alumnos</Link></li>
            <li><Link to="/calificaciones/">Calificaciones</Link></li>
        </ul>
    </nav>
);

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const {drizzle, drizzleState, initialized} = drizzleContext;

            if (!initialized) {
                return (
                    <main><h1>⚙️ Cargando dapp...</h1></main>
                );
            }

            return (
                <Router>
                    <Navegacion/>

                    <AppHeader drizzle={drizzle}
                               drizzleState={drizzleState}/>

                    <Route path="/" exact>
                        <p>Bienvenido a la práctica de BCDA. </p>
                    </Route>
                    < Route path="/evaluaciones/">
                        <AppEvaluaciones drizzle={drizzle}
                                         drizzleState={drizzleState}/>
                    </Route>
                    <Route path="/alumnos/">
                        <AppAlumnos drizzle={drizzle}
                                    drizzleState={drizzleState}/>
                    </Route>
                    <Route path="/calificaciones/">
                        <AppCalificaciones drizzle={drizzle}
                                           drizzleState={drizzleState}/>
                    </Route>
                </Router>
            )
        }}
    </DrizzleContext.Consumer>
);
