import React from 'react';

import {DrizzleContext} from "drizzle-react";

import AppHeader from './AppHeader';
import AppEvaluaciones from "./AppEvaluaciones";
import AppAlumnos from "./AppAlumnos";
import AppCalificaciones from "./AppCalificaciones";

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
                <main>
                    <AppHeader drizzle={drizzle}
                               drizzleState={drizzleState}/>
                    <AppEvaluaciones drizzle={drizzle}
                                     drizzleState={drizzleState}/>
                    <AppAlumnos drizzle={drizzle}
                                drizzleState={drizzleState}/>
                    <AppCalificaciones drizzle={drizzle}
                                       drizzleState={drizzleState}/>
                </main>
            );
        }}
    </DrizzleContext.Consumer>
);
