import React from 'react';
import ReactDOM from 'react-dom';

import { DrizzleProvider } from 'drizzle-react';

import './css/index.css';
import './css/App.css';

import App from './components/App';

import options from "./drizzle";


ReactDOM.render(
	<DrizzleProvider options={options}>
		<App />
	</DrizzleProvider>,
	document.getElementById('root')
);
