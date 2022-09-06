/* @refresh reload */
import {render} from 'solid-js/web';
import {Router, Routes, Route, Link} from "@solidjs/router";
import SimpleApp from "./simple/App";
import EditorApp from "./editor/App";
import HeaderApp from "./header/App";
import FullApp from "./full/App";

import './index.css';

function App() {
    return <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
        <h1>AG Grid SolidJS Examples</h1>
        <nav>
            <Link href="/simple">Simple Grid</Link>
            <Link href="/editor">Editor Grid</Link>
            <Link href="/header">Header Grid</Link>
            <Link href="/full">Full Grid</Link>
        </nav>
        <hr/>
        <Routes>
            <Route path="/simple" component={SimpleApp} />
            <Route path="/editor" component={EditorApp} />
            <Route path="/header" component={HeaderApp} />
            <Route path="/full" component={FullApp} />
        </Routes>
    </div>
}

render(() =>
        <Router>
            <App/>
        </Router>
    , document.getElementById('root') as HTMLElement);
