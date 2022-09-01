/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './sampleApp/App';

render(() => <App />, document.getElementById('root') as HTMLElement);
