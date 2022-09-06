import { ICellEditor, ICellEditorParams, ICellRendererParams, IDoesFilterPassParams, IFilter, IFilterParams } from '@ag-grid-community/core';
import { createSignal } from 'solid-js';

export const SolidFilterComp = (props: IFilterParams) => {

    const [getFilterState, setFilterState] = createSignal('everything');

    const api: IFilter = {
        doesFilterPass(params: IDoesFilterPassParams) {
            const cellValue = props.api.getValue(props.column, params.node);
            const cellValueEven = cellValue % 2 === 0;
            return getFilterState() === 'even' ? cellValueEven : !cellValueEven;
        },

        isFilterActive() {
            return getFilterState() != 'everything';
        },

        getModel() {
        },

        setModel() {
        }
    };

    (props as any).ref(api);

    const setValue = (newValue: string) => {
        setFilterState(newValue);
        props.filterChangedCallback();
    };

    return (
        <div class='My Custom Solid Filter'>
            <div>
                State = {getFilterState()}
            </div>
            <div>
                <button onClick={()=>setValue('everything')}>Everything</button>
                <button onClick={()=>setValue('odd')}>Odd</button>
                <button onClick={()=>setValue('even')}>Even</button>
            </div>
        </div>
    );    
}

export const SolidHeaderComp = (props: any) => {
    return (
        <div>My Comp</div>
    );
};

export const SolidCellRenderer = (props: any) => {
    props.ref({
        myMethod: () => {
            console.log('my method called inside Solid comp');
        }
    });
    return <>S-{props.value}</>;
}

export const SolidHeaderGroupComp = (props: any) => {
    return <>Header-{props.displayName}</>;
}

export const SolidDetailCellRenderer = (props: any) => {
    return (
        <>
            <div>
                <h2>Detail Cell Renderer Solid</h2>
                <div style={{ border: '10px solid red' }}>
                </div>
                <div style={{ border: '10px solid green' }}>
                </div>
                <div style={{ border: '10px solid blue' }}>
                </div>
            </div>
        </>
    );
}

export class JsCellRenderer {
    constructor() {
    }
    eGui?: HTMLElement;
    init(p: ICellRendererParams) {
        this.eGui = document.createElement('span');
        this.eGui.innerHTML = 'J-' + p.value;
    }
    getGui() {
        return this.eGui;
    }
    refresh(p: ICellRendererParams) {
        this.eGui!.innerHTML = 'J-' + p.value;
        return true;
    }
    myMethod() {
        console.log('my method called inside JS comp');
    }
}


export class JsEmptyComp {
    constructor() {
    }
    eGui?: HTMLElement;
    init(p: ICellRendererParams) {
        this.eGui = document.createElement('span');
        this.eGui.innerHTML = 'Empty JS Comp';
    }
    getGui() {
        return this.eGui;
    }
}

export const SolidCellEditor = (props: ICellEditorParams) => {
    let value = props.value;

    const api: ICellEditor = {
        getValue: () => value
    };

    (props as any).ref(api);

    const onValueChanged = (newValue: number) => {
        value = newValue;
        props.stopEditing();
    };

    return (
        <div style={{ border: '2px solid green' }}>
            <button onclick={() => onValueChanged(1)}>1</button>
            <button onclick={() => onValueChanged(2)}>2</button>
        </div>
    );
}
