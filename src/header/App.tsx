import {ModuleRegistry} from '@ag-grid-community/core';
import {Component, createResource, onMount} from 'solid-js';
import {createEffect, createSignal, onCleanup} from "solid-js";
import AgGridSolid, {AgGridSolidRef} from '@ag-grid-community/solid';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

import '@ag-grid-community/styles/ag-grid.css';
import "@ag-grid-community/styles/ag-theme-alpine.css";
import styles from "./style.module.css"
import spinnerGif from './images/spinner.gif';

const SortingHeader = (props:any) => {

    const [sortState, setSortState] = createSignal();

    const onClick = () => {
        props.progressSort();
    };

    onMount(() => {
        const listener = () => {
            if (props.column.isSortAscending()) {
                setSortState('ASC');
            } else if (props.column.isSortDescending()) {
                setSortState('DESC');
            } else {
                setSortState(undefined);
            }
        };

        props.column.addEventListener('sortChanged', listener);

        onCleanup(() => props.column.removeEventListener('sortChanged', listener));
    });

    return (
        <span class={styles["my-header"]} onClick={onClick}>
            <img src={spinnerGif} class={styles["my-spinner"]} />
            {props.displayName} {sortState}
        </span>
    );
};

const MyGroupHeader = (props:any) => {

    const [getExpanded, setExpanded] = createSignal(false);
    const { columnGroup } = props;
    const expandable = columnGroup.isExpandable();
    const providedColumnGroup = columnGroup.getProvidedColumnGroup();

    const onExpandClicked = () => props.setExpanded(!columnGroup.isExpanded());

    onMount(() => {
        const listener = () => {
            setExpanded(columnGroup.isExpanded());
        };
        listener();
        providedColumnGroup.addEventListener('expandedChanged', listener);
        onCleanup(() => providedColumnGroup.removeEventListener('expandedChanged', listener))
    });

    const showExpandJsx = () => (
        <button onClick={onExpandClicked} class={styles["my-expand"]}>
            {getExpanded() ? '<' : '>'}
        </button>
    );

    return (
        <span class={styles["my-group-header"]}>
             <img src={spinnerGif} class={styles["my-spinner"]} />
            {props.displayName}
            {expandable && showExpandJsx()}
         </span>
    );
};

const fetchData = async () =>
    (await fetch(`https://www.ag-grid.com/example-assets/olympic-winners.json`)).json();


const App: Component = () => {
    const [rowData] = createResource<any[]>(fetchData);

    const columnDefs = [
        {
            headerName: 'Group A',
            headerGroupComponent: MyGroupHeader,
            children: [
                { field: 'athlete', headerComponent: SortingHeader },
                { field: 'age', headerComponent: SortingHeader },
            ]
        },
        {
            headerName: 'Group B',
            headerGroupComponent: MyGroupHeader,
            children: [
                { field: 'country' },
                { field: 'year' },
                { field: 'date', columnGroupShow: 'open' },
                { field: 'sport', columnGroupShow: 'open' }
            ]
        },
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
                    rowData={rowData()}
                    defaultColDef={defaultColDef}
                    ref={gridRef!}
                />
            </div>
        </div>
    );
};

export default App;
