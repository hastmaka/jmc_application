import {useLayoutEffect} from "react";
import MantineGrid from "@/ezMantine/mantineDataGrid/MantineGrid.tsx"
import {ClientGridController} from "./ClientGridController.tsx";
import ClientGridToolBar from "./ClientGridToolbar.tsx";
import ClientGridActions from "./ClientGridActions.tsx";
import {stringFilterFn, dateFilterFn} from "mantine-data-grid";

const columns = [
    {
        accessorKey: 'client_first_name',
        header: 'First Name',
        filterFn: stringFilterFn
    }, {
        accessorKey: 'client_last_name',
        header: 'Last Name',
        filterFn: stringFilterFn,
    },{
        accessorKey: 'client_dob',
        header: 'Date of Birth',
        filterFn: dateFilterFn,
    }, {
        accessorKey: 'client_insurance_number',
        header: 'Insurance Number',
        filterFn: stringFilterFn,
        size: 225
    }, {
        accessorKey: 'client_eqhealth_id',
        header: 'EQHealth number',
        filterFn: stringFilterFn,
    }, {
        accessorKey: 'client_primary_phone',
        header: 'Phone',
        filterFn: stringFilterFn
    }
]

function ClientsGrid() {
    const {fetchData} = ClientGridController
    useLayoutEffect(() => {fetchData().then()}, [fetchData])

    return (
        <MantineGrid
            state={{...ClientGridController, columns}}
            rowId='client_id'
            toolbar={<ClientGridToolBar state={{...ClientGridController}}/>}
            actions={{comp: ClientGridActions, itemCount: 3}}
            fromTab
        />
    );
}

export default ClientsGrid;