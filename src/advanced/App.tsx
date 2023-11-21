import {ModuleRegistry} from '@ag-grid-community/core';
import {Component, createResource, onMount} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {FiltersToolPanelModule} from '@ag-grid-enterprise/filter-tool-panel';
import {SetFilterModule} from '@ag-grid-enterprise/set-filter';
import {RangeSelectionModule} from '@ag-grid-enterprise/range-selection';
import {StatusBarModule} from '@ag-grid-enterprise/status-bar';
import {GridChartsModule} from '@ag-grid-enterprise/charts';
import {MenuModule} from '@ag-grid-enterprise/menu';
import {ExcelExportModule} from '@ag-grid-enterprise/excel-export';
import {ClipboardModule} from '@ag-grid-enterprise/clipboard';

ModuleRegistry.registerModules([ExcelExportModule, ClipboardModule, MenuModule, GridChartsModule, RangeSelectionModule, StatusBarModule, ClientSideRowModelModule, FiltersToolPanelModule, SetFilterModule]);

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css"
import spinnerGif from './images/spinner.gif';

const MyRenderer = (props: any) => {
    return <span class={styles["my-renderer"]}>
        <img src={spinnerGif} class={styles["my-spinner"]}/>
        <span class={styles["my-renderer-value"]}>{props.value}</span>
    </span>;
}

const fetchData = async () =>
    (await fetch(`https://www.ag-grid.com/example-assets/olympic-winners.json`)).json();

const App: Component = () => {
    const [rowData] = createResource<any[]>(fetchData);

    let gridRef: AgGridSolidRef;

    // show chart of first rendering
    const onFirstDataRendered = ()=> {
        gridRef.api.createRangeChart({
            chartType: 'groupedColumn',
            cellRange: {
                rowStartIndex: 0,
                rowEndIndex: 4,
                columns: ['ag-Grid-AutoColumn', 'gold', 'silver'],
            }
        });
    };

    const columnDefs = [
        {field: 'country', enableRowGroup: true, rowGroup: true, hide: true, cellRenderer: MyRenderer},
        {field: 'sport', enableRowGroup: true, hide: true, rowGroup: true},
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

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    autoGroupColumnDef={autoGroupColumnDef}
                    rowGroupPanelShow="always"
                    enableRangeSelection={true}
                    enableCharts={true}
                    rowData={rowData()}
                    rowSelection="multiple"
                    onFirstDataRendered={onFirstDataRendered}
                    groupSelectsChildren={true}
                    suppressRowClickSelection={true}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
