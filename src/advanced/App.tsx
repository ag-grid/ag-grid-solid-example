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
        <span class="my-renderer-value">{props.value}</span>
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
        {field: 'sport', enableRowGroup: true, hide: true, rowGroup: true, cellRenderer: MyRenderer},
        {field: 'country', enableRowGroup: true, rowGroup: true, hide: true},
        {field: 'athlete', enableRowGroup: true, hide: true},
        {field: 'gold', aggFunc: 'sum'},
        {field: 'silver', aggFunc: 'sum'},
        {field: 'bronze', aggFunc: 'sum'},
        {field: 'total', aggFunc: 'sum'}
    ];

    const defaultColDef = {
        resizable: true,
        sortable: true
    };
    const autoGroupColumnDef = {
        cellRendererParams: {
            suppressCount: true,
            checkbox: true
        },
        field: 'athlete',
        width: 300
    }

    let gridRef: AgGridSolidRef;

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    animateRows={true}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    rowGroupPanelShow="always"
                    enableRangeSelection={true}
                    rowData={getRowData()}
                    rowSelection="multiple"
                    groupSelectsChildren={true}
                    suppressRowClickSelection={true}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
