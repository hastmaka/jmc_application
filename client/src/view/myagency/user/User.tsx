import {dateFilterFn, stringFilterFn} from "mantine-data-grid";
import {UserGridController} from "@/view/myagency/user/UserGridController.tsx";
import {useLayoutEffect} from "react";
import MantineGrid from "@/ezMantine/mantineDataGrid/MantineGrid.tsx";
import UserGridToolbar from "@/view/myagency/user/UserGridToolbar.tsx";
import UserGridActions from "@/view/myagency/user/UserGridActions.tsx";

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
        accessorKey: 'client_primary_phone',
        header: 'Phone',
        filterFn: stringFilterFn,
        cell: ({cell}: { cell: any}) => {
            return <span>{`${cell.getValue()?.phone_number || 'Not phone set'}`}</span>
        },
    }
]

function User() {
    const {fetchData} = UserGridController
    useLayoutEffect(() => {fetchData().then()}, [fetchData])

    return (
        <MantineGrid
            state={{...UserGridController, columns}}
            rowId='client_id'
            toolbar={<UserGridToolbar state={{...UserGridController}}/>}
            actions={{comp: UserGridActions, itemCount: 3}}
        />
    );
}

export default User;