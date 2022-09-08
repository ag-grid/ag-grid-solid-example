/* @refresh reload */
import {render} from 'solid-js/web';
import {Router, Routes, Route, Link} from "@solidjs/router";
import SimpleApp from "./simple/App";
import EditorApp from "./editor/App";
import HeaderApp from "./header/App";
import AdvancedApp from "./advanced/App";
import MasterDetailApp from "./master-detail/App";
import AllCustomisationsApp from "./all/App";
import ComplexApp from "./complex/App";

import './index.css';

function App() {
    return <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
        <h1>AG Grid SolidJS Examples</h1>
        <nav>
            <Link href="/simple">Simple Grid</Link>
            <Link href="/editor">Editor Grid</Link>
            <Link href="/header">Header Grid</Link>
            <Link href="/advanced">Advanced Grid</Link>
            <Link href="/master-detail">Master/Detail Grid</Link>
            <Link href="/all">All Customisations Grid</Link>
            <Link href="/complex">Complex Grid</Link>
        </nav>
        <hr/>
        <Routes>
            <Route path="/simple" component={SimpleApp} />
            <Route path="/editor" component={EditorApp} />
            <Route path="/header" component={HeaderApp} />
            <Route path="/advanced" component={AdvancedApp} />
            <Route path="/master-detail" component={MasterDetailApp} />
            <Route path="/all" component={AllCustomisationsApp} />
            <Route path="/complex" component={ComplexApp} />
        </Routes>
    </div>
}

render(() =>
        <Router>
            <App/>
        </Router>
    , document.getElementById('root') as HTMLElement);
