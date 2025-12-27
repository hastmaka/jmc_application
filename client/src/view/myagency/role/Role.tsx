import {RoleController} from "./RoleController.ts";
import {useLayoutEffect} from "react";
import MantineGrid from "@/ezMantine/mantineDataGrid/MantineGrid.tsx";
import RoleGridToolbar from "./RoleGridToolbar.tsx";
import RoleGridActions from "./RoleGridActions.tsx";

const columns = [
    {
        accessorKey: 'role_name',
        header: 'Role Name',
    }, {
        accessorKey: 'role_description',
        header: 'Description',
    }
]

function RoleGrid() {
    const {fetchData} = RoleController
    useLayoutEffect(() => {fetchData().then()}, [fetchData])

    return (
        <MantineGrid
            state={{...RoleController, columns}}
            rowId='role_id'
            toolbar={<RoleGridToolbar state={{...RoleController}}/>}
            actions={{comp: RoleGridActions, itemCount: 3}}
        />
    );
}

export default RoleGrid;