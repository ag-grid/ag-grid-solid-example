import {ModuleRegistry} from '@ag-grid-community/core';
import {Component, createResource, onMount} from 'solid-js';
import {createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css"
import spinnerGif from './images/spinner.gif';

const MyRenderer = (props: any) => {
    return <span class={styles["my-renderer"]}>
        <img src={spinnerGif} class={styles["my-spinner"]}/>
        {props.value}
    </span>;
}

const fetchData = async () =>
    (await fetch(`https://www.ag-grid.com/example-assets/olympic-winners.json`)).json();

const App: Component = () => {
    const [rowData] = createResource<any[]>(fetchData);

    const columnDefs = [
        {field: 'athlete'}, {field: 'age', cellRenderer: MyRenderer},
        {field: 'country'}, {field: 'year'}, {field: 'date'}, {field: 'sport'},
        {field: 'gold'}, {field: 'silver'}, {field: 'bronze'}, {field: 'total'}
    ];

    const defaultColDef = {
        resizable: true,
        filter: true
    };

    let gridRef: AgGridSolidRef;

    return (
        <div class="ag-theme-alpine" style={{height: '500px'}}>
            <AgGridSolid
                columnDefs={columnDefs}
                rowData={rowData()}
                defaultColDef={defaultColDef}
                ref={gridRef!}
            />
        </div>
    );
};

export default App;
