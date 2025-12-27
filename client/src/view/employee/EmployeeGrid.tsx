import {EmployeeGridController} from "./EmployeeGridController.ts";
import {useLayoutEffect} from "react";
import ClientGridToolBar from "@/view/client/ClientGridToolbar.tsx";
import MantineGrid from "@/ezMantine/mantineDataGrid/MantineGrid.tsx";
import EmployeeGridActions from "@/view/employee/EmployeeGridActions.tsx";

const columns = [
    {
        accessorKey: 'employee_full_name',
        header: 'Full Name',
    }, {
        accessorKey: 'employee_certification',
        header: 'Certification',
    }, {
        accessorKey: 'employee_department',
        header: 'Department',
    }, {
        accessorKey: 'employee_primary_phone',
        header: 'Phone',
        cell: ({cell}: { cell: any }) => {
            return <span>{`${cell.getValue() || 'Not set'}`}</span>
        },
    }, {
        accessorKey: 'employee_location',
        header: 'Location',
    }, {
        accessorKey: 'employee_status',
        header: 'Status',
    }
]

function EmployeeGrid() {
    const {fetchData} = EmployeeGridController
    useLayoutEffect(() => {fetchData().then()}, [fetchData])

    return (
        <MantineGrid
            state={{...EmployeeGridController, columns}}
            rowId='employee_id'
            toolbar={<ClientGridToolBar state={{...EmployeeGridController}}/>}
            actions={{comp: EmployeeGridActions, itemCount: 3}}
        />
    );
}

export default EmployeeGrid;