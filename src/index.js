import React from 'react';
import ReactDOM from 'react-dom';

import { DrizzleProvider } from 'drizzle-react';

import './index.css';
import App from './App';

import options from "./drizzle";


ReactDOM.render(
	<DrizzleProvider options={options}>
		<App />
	</DrizzleProvider>,
	document.getElementById('root')
);
