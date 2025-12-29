import {Group} from "@mantine/core";
import {lazy, Suspense, useMemo} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {IconCar, IconFileExport, IconUsers} from "@tabler/icons-react";
import EzGroupBtn from "@/ezMantine/buttonGroup/EzGroupBtn.tsx";
import ToolBar from "@/ezMantine/mantineDataGrid/toolbar/ToolBar.tsx";
import EzSearchInput from "@/ezMantine/searchInput/EzSearchInput.tsx";
import {ReservationModalController} from "@/view/reservation/_modal/ReservationModalController.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import {ReservationController} from "@/view/reservation/ReservationController.ts";
import EzSelect from "@/ezMantine/select/EzSelect.tsx";
import DatePickerInputWithMonth from "@/components/DatePickerInputWithMonth.tsx";
// dynamic import
const ManageEmployee =
    lazy(() => import('./_modal/manageEmployee/ManageEmployee.tsx'))
const ManageCar =
    lazy(() => import('./_modal/manageCar/ManageCar.tsx'))
const AddEditReservationNew =
    lazy(() => import('./_modal/AddEditReservationNew.tsx'))

export default function ReservationGridToolbar({
    state
}: {
    state: any;
}) {
    const {resetState, updateMonthAndYear, cleanupPendingEmployeeUploads} = ReservationModalController
    const {_handleInput} = ReservationController
    const {user} = LoginController

    function handleManageCar(){
        const modalId = "manage-car-modal"
        window.openModal({
            modalId,
            title: "Manage Cars",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h='100vh'/>}>
                    <ManageCar/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    function handleManageEmployee(){
        const modalId = "manage-employee-modal"
        window.openModal({
            modalId,
            title: "Manage Employee",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h='100vh'/>}>
                    <ManageEmployee/>
                </Suspense>
            ),
            onClose: () => {
                cleanupPendingEmployeeUploads()
                resetState()
            }
        })
    }

    function handleCreateReservation(){
        const modalId = 'create-reservation-modal';
        window.openModal({
            modalId,
            title: "Create Reservation",
            fullScreen: true,
            children: (
                <Suspense fallback={<EzLoader h='100vh'/>}>
                    <AddEditReservationNew modalId={modalId}/>
                </Suspense>
            ),
            onClose: resetState
        })
    }

    const ACTIONBTNS =
        useMemo(() => [
            {
                icon: IconFileExport,
                label: "Create Reservation",
                onClick: handleCreateReservation
            },
            {
                icon: IconCar,
                label: 'Manage Cars',
                onClick: handleManageCar
            },
            {
                icon: IconUsers,
                label: 'Manage Employee',
                onClick: handleManageEmployee
            }
        ], [])

    function handleDateRangeChange(v: any){
        _handleInput('rangeDateValue', v)
        if (v[0] !== null && v[1] !== null) {
            updateMonthAndYear(ReservationController.rangeDateValue)
        }

        if (v[0] === null && v[1] === null) {
            updateMonthAndYear([null,null])
        }
    }

    function handleFilterByCar(v: string){
        _handleInput('carFilter', v)
        if (v) {
            ReservationController.manageFilters({
                fieldName: 'car_car_id',
                value: v,
                operator: '='
            })
        } else {
            ReservationController.manageFilters({fieldName: 'car_car_id'}, 'remove')
        }
    }

    return (
        <ToolBar>
            <Group justify='space-between' flex={1}>
                <EzSearchInput
                    state={state}
                    handleInput={_handleInput}
                    value={ReservationController.search || ''}
                />
                <Group>
                    <EzSelect
                        onOptionSubmit={handleFilterByCar}
                        value={ReservationController.carFilter || ''}
                        url='v1/car/asset'
                        iterator={{label: 'car_plate', value: 'car_id'}}
                        fetchEveryTime={false}
                    />
                    <DatePickerInputWithMonth
                        value={ReservationController?.rangeDateValue || user?.user_preference.rangeDateValue}
                        handleInput={(_type, _name, value) => handleDateRangeChange(value)}
                        type=''
                    />
                    <EzGroupBtn ITEMS={ACTIONBTNS}/>
                </Group>
            </Group>
        </ToolBar>
    )
}