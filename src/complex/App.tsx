import {GetDetailRowDataParams, GetRowIdParams, ICellRendererParams, ModuleRegistry} from '@ag-grid-community/core';
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel';
import {MasterDetailModule} from '@ag-grid-enterprise/master-detail';
import {MenuModule} from '@ag-grid-enterprise/menu';
import {RowGroupingModule} from '@ag-grid-enterprise/row-grouping';
import type {Component} from 'solid-js';
import {createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {FiltersToolPanelModule} from '@ag-grid-enterprise/filter-tool-panel';
import {SetFilterModule} from '@ag-grid-enterprise/set-filter';
import {RangeSelectionModule} from '@ag-grid-enterprise/range-selection';
import {StatusBarModule} from '@ag-grid-enterprise/status-bar';

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import "@ag-grid-community/styles/ag-theme-balham.css";

import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {JsCellRenderer, SolidCellEditor, SolidCellRenderer, SolidDetailCellRenderer, SolidFilterComp} from './userComponents';

ModuleRegistry.registerModules([StatusBarModule, RangeSelectionModule, SetFilterModule, FiltersToolPanelModule, ClientSideRowModelModule, RowGroupingModule, MasterDetailModule, MenuModule, ColumnsToolPanelModule]);

const LATIN_TEXT = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium';

const FullApp: Component = () => {

    const colors = ['Black', 'Red', 'Green', 'Orange', 'White']
    const initialRowData = [];
    for (var i = 0; i < 100; i++) {
        initialRowData.push({
            id: i,
            a: (i * 33) % 100,
            b: (i * 77) % 100,
            c: (i * 17) % 100,
            text: LATIN_TEXT.substring(0, ((i + 5) * 77 * 33) % LATIN_TEXT.length),
            color: colors[i % colors.length]
        });
    }

    const [getRowData, setRowData] = createSignal<any[]>(initialRowData);

    const columnDefs = [
        // {
        //   valueGetter: ()=> 'Master',
        //   cellRenderer: 'agGroupCellRenderer'
        // },
        {
            headerName: 'Group 1',
            // headerGroupComponent: SolidHeaderGroupComp,
            children: [
                {
                    field: 'a',
                    // headerComponent: SolidHeaderComp,
                    cellRenderer: SolidCellRenderer,
                    cellEditor: SolidCellEditor,
                    filter: SolidFilterComp,
                    checkboxSelection: true,
                    rowDrag: true,
                    // cellEditorPopup: true
                },
                {
                    field: 'b',
                    cellRenderer: JsCellRenderer,
                    cellEditorPopup: true,
                    cellEditorPopupPosition: 'under'
                },
            ]
        },
        {field: 'c'},
        {
            field: 'color',
            enableRowGroup: true,
            // rowGroup: true,
            // hide: true,
            // cellRenderer: JsCellRenderer,
            cellRenderer: (p: ICellRendererParams) => <># {p.value}</>
        },
        {
            field: 'text',
            width: 300,
            // autoHeight: true,
            // wrapText: true
        }
    ];

    const detailCellRendererParams = {
        detailGridOptions: {
            columnDefs: [
                {field: 'a'},
                {field: 'b'},
                {field: 'c'}
            ],
            defaultColDef: {
                flex: 1,
            },
        },
        getDetailRowData: (params: GetDetailRowDataParams) => {
            const res = [];
            for (let i = 0; i < 8; i++) {
                res.push({a: Math.random(), b: Math.random(), c: Math.random()});
            }
            params.successCallback(res)
        },
    };

    const defaultColDef = {
        resizable: true,
        filter: true,
        sortable: true,
        editable: true,
        floatingFilter: true
    };

    const getRowId = (p: GetRowIdParams) => p.data.id;

    const onUpdateData = () => {
        const rnd = () => Math.floor(Math.random() * 1000);
        gridRef.api.applyTransaction({
            update: [{id: '1', a: rnd(), b: rnd(), c: rnd()}]
        })
    };

    const onCallApi = () => {
        const rowNode = gridRef.api.getRowNode('1');
        console.log('row node', rowNode);
        const instances = gridRef.api.getCellRendererInstances({
            columns: ['a', 'b', 'c'],
            rowNodes: [rowNode!]
        });
        console.log('instances', instances);
        instances?.forEach((instance: any) => {
            instance.myMethod && instance.myMethod();
        });
    };

    const onSetRowData = () => {
        setRowData([{id: 0}, {id: 1}, {id: 2}]);
    };

    const statusBar = {
        statusPanels: [
            {statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left'},
            {statusPanel: 'agAggregationComponent'}
        ]
    };

    let gridRef: AgGridSolidRef;

    return (
        <div style={{height: '100%', display: 'flex', "flex-direction": 'column'}}>
            <div>
                <button onClick={onUpdateData}>Update Data</button>
                <button onClick={onCallApi}>Call API</button>
                <button onClick={onSetRowData}>Set Row Data</button>
            </div>
            <div class="ag-theme-alpine" style={{"flex-grow": 1}}>
                <AgGridSolid
                    enableRangeSelection={true}
                    statusBar={statusBar}
                    sideBar={true}
                    columnDefs={columnDefs}
                    rowDragManaged={true}
                    defaultColDef={defaultColDef}
                    detailCellRenderer={SolidDetailCellRenderer}
                    detailCellRendererParams={detailCellRendererParams}
                    getRowId={getRowId}
                    rowSelection='multiple'
                    detailRowAutoHeight={true}
                    suppressRowClickSelection={true}
                    rowGroupPanelShow='always'
                    rowData={getRowData()}
                    masterDetail={true}
                    animateRows={true}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default FullApp;
