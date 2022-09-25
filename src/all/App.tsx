import {IFilter, IFilterParams, IFloatingFilter, ModuleRegistry} from '@ag-grid-community/core';
import {Component, createResource, onMount} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css"

const MyToolPanel = (props:any) => {

    const [value, setValue] = createSignal(0);

    // expose AG Grid Filter Lifecycle callbacks
    const api:any = {
        sampleToolPanelMethod() {
            setValue(value => value + 1);
        }
    };

    (props as any).ref(api);
    return (
        <div class={styles["my-tool-panel"]}>
            <div>
                Sample Tool Panel
            </div>
            <div class={styles["my-tool-panel-value"]}>
                {value}
            </div>
        </div>
    )
};

const MyStatusPanel = (props: any) => {

    const [value, setValue] = createSignal(0);

    // expose AG Grid Filter Lifecycle callbacks
    const api: any = {
        sampleStatusPanelMethod() {
            setValue(value => value + 1);
        }
    };

    (props as any).ref(api);

    return (
        <div class={styles["my-status-panel"]}>
            <span>
                Sample Status Panel
            </span>
            <span class={styles["my-status-panel-value"]}>
                {value()}
            </span>
        </div>
    )
}

const MyLoadingOverlay = () => {
    return (
        <div class={styles["my-loading-overlay"]}>
            <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" class={styles["my-all-spinner"]} />
            Loading...
        </div>
    )
};

const MyNoRowsOverlay = () => {
    return (
        <div class={styles["my-no-rows-overlay"]}>
            <img src="https://d1yk6z6emsz7qy.cloudfront.net/static/images/loading.gif" class={styles["my-all-spinner"]} />
            No Rows
        </div>
    )
};

const MyTooltip = (params: any) => {
    return (
        <div class={styles["my-tooltip"]}>
            My Tooltip: {params.value}
        </div>
    )
};

const YearFloatingFilter = (props: any) => {
    const [filterActive, setFilterActive] = createSignal();

    const api: IFloatingFilter = {
        onParentModelChanged(parentModel: any) {
            // When the filter is empty we will receive a null value here
            setFilterActive(parentModel != null);
        }
    };

    (props as any).ref(api);

    const onCheckboxChecked = () => {
        setFilterActive(!filterActive())
        props.parentFilterInstance((instance: any) => {
            instance.setValueFromFloatingFilter(filterActive());
        });
    };

    return (
        <div style={{display: 'inline-block', 'margin-top': '10px'}}>
            <label>
                <input
                    type="checkbox"
                    checked={filterActive()}
                    onChange={onCheckboxChecked}/> &gt;= 2010
            </label>
        </div>
    )
}

const YearFilter = (props: IFilterParams) => {

    const [getYear, setYear] = createSignal('All');

    const api: IFilter = {
        doesFilterPass(params) {
            return params.data.year >= 2010;
        },

        isFilterActive() {
            return getYear() === '2010';
        },

        getModel() {
            return getYear() === '2010' ? {active: true} : undefined;
        },

        setModel(model) {
            const active = model && model.active;
            setYear(active ? '2010' : 'All');
        },

        setValueFromFloatingFilter(value) {
            setYear(value ? '2010' : 'All');
            props.filterChangedCallback()
        },

        sampleToggleMethod() {
            setYear(!(getYear() === '2010') ? '2010' : 'All');
            props.filterChangedCallback();
        }
    };

    (props as any).ref(api);

    const onYearChange = (event: string) => {
        setYear(event.target.value);
        props.filterChangedCallback();
    };

    return (
        <div style={{display: "inline-block"}}>
            <div style={{padding: "10px", backgroundColor: "#d3d3d3", textAlign: "center"}}>Year Filter</div>
            <label style={{margin: "10px", padding: "20px", display: "inline-block", backgroundColor: "#999999"}}>
                <input type="radio" name="year" value="All" checked={getYear() === 'All'} onChange={onYearChange}/> All
            </label>
            <label style={{margin: "10px", padding: "20px", display: "inline-block", backgroundColor: "#999999"}}>
                <input type="radio" name="year" value="2010" checked={getYear() === '2010'} onChange={onYearChange}/> Since 2010
            </label>
        </div>);
}

const fetchData = async () =>
    (await fetch(`https://www.ag-grid.com/example-assets/olympic-winners.json`)).json();

const App: Component = () => {
    const [rowData] = createResource<any[]>(fetchData);

    let gridRef: AgGridSolidRef;

    const columnDefs = [
        {field: 'athlete', tooltipField: 'athlete'},
        {field: 'age', tooltipField: 'athlete'},
        {field: 'country', tooltipField: 'athlete'},
        {
            field: 'year',
            filter: YearFilter,
            floatingFilter: true,
            floatingFilterComponent: YearFloatingFilter,
            tooltipField: 'athlete'
        },
    ];

    const defaultColDef = {
        resizable: true,
        sortable: true,
        filter: true,
        flex: 1,
        tooltipComponent: MyTooltip
    };

    const sideBar = {
        toolPanels: [
            'columns',
            'filters',
            {
                id: "myToolPanel",
                labelDefault: "My Tool Panel",
                labelKey: "myToolPanel",
                iconKey: "filter",
                toolPanel: MyToolPanel
            }
        ],
        defaultToolPanel: "myToolPanel"
    }

    const statusBar = {
        statusPanels: [
            { key: 'myStatusPanel', statusPanel: MyStatusPanel }
        ]
    }

    const onCallFilter = () => {
        // because Filter could be created Async, we use the callback mechanism in the method
        gridRef.api.getFilterInstance('year', filterRef => filterRef.sampleToggleMethod());
    };

    const onCallToolPanel = () => {
        // tool panels are created up front, so no need for async
        const toolPanelRef = gridRef.api.getToolPanelInstance('myToolPanel');
        toolPanelRef.sampleToolPanelMethod();
    };

    const onCallStatusPanel = () => {
        // status panels are created up front, so no need for async
        const statusPanelRef = gridRef.api.getStatusPanel('myStatusPanel');
        statusPanelRef.sampleStatusPanelMethod();
    };

    const onBtShowLoading = () => gridRef.api.showLoadingOverlay();
    const onBtShowNoRows = () => gridRef.api.showNoRowsOverlay();
    const onBtHide = () => gridRef.api.hideOverlay();

    return (
        <div class={styles["top-level"]}>
            <div class={styles["buttons-bar"]}>
                <div>
                    <button onClick={onCallFilter}>Toggle Filter</button>
                    <button onClick={onCallToolPanel}>Increment Tool Panel</button>
                    <button onClick={onCallStatusPanel}>Increment Status Panel</button>
                </div>
                <div>
                    <button onClick={onBtShowLoading}>Show Loading Overlay</button>
                    <button onClick={onBtShowNoRows}>Show No Rows Overlay</button>
                    <button onClick={onBtHide}>Hide Overlay</button>
                </div>
            </div>
            <div class={`ag-theme-alpine ${styles["my-grid"]}`}>
                <AgGridSolid
                    ref={gridRef!}
                    sideBar={sideBar}
                    statusBar={statusBar}
                    animateRows={true}
                    loadingOverlayComponent={MyLoadingOverlay}
                    noRowsOverlayComponent={MyNoRowsOverlay}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData()}
                />
            </div>
        </div>
    );
};

export default App;
