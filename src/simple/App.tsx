import {ModuleRegistry} from '@ag-grid-community/core';
import type {Component} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import "./styles.css";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

export const MyRenderer = (props: any) => {
    return <span class="my-renderer">
        <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" class="my-spinner"/>
        {props.value}
    </span>;
}

const App: Component = () => {

    const [getRowData, setRowData] = createSignal<any[]>([]);

    createEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then(data => setRowData(data));
    })

    const columnDefs = [
        {field: 'athlete'},
        {field: 'age', cellRenderer: MyRenderer},
        {field: 'country'},
        {field: 'year'},
        {field: 'date'},
        {field: 'sport'},
        {field: 'gold'},
        {field: 'silver'},
        {field: 'bronze'},
        {field: 'total'}
    ];

    const defaultColDef = {
        resizable: true,
        filter: true
    };

    let gridRef: AgGridSolidRef;

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    enableRangeSelection={true}
                    columnDefs={columnDefs}
                    rowData={getRowData()}
                    defaultColDef={defaultColDef}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
