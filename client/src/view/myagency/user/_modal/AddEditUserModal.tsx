import FormGenerator from "@/components/form/FormGenerator.tsx";
import _ from "lodash";
import {Stack} from "@mantine/core";
import {UserModalController} from "@/view/myagency/user/_modal/UserModalController.ts";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";
import {useLayoutEffect} from "react";
import SaveCancelDeleteBtns from "@/components/SaveCancelDeleteBtns.tsx";

const FIELDS = [
    {
        type: 'string',
        name: 'user_email',
        label: 'Email',
        required: true,
        fieldProps: {
            type: 'email'
        }
    }, {
        type: 'string',
        name: 'employee_employee_id',
        label: 'Employee Relation',
        required: true
    }, {
        type: 'phone',
        name: 'client_phone',
        label: 'User Role',
        required: true
    }
]

function AddEditUserModal({id, from}: {id?: number, from: string}) {
    const {
        handleInput,
        formData,
        errors,
        checkRequired,
        resetState,
        modalData,
        modal,
        dirtyFields,
    } = UserModalController

    useLayoutEffect(() => {
        if(id)modalData('user', FIELDS, +id!).then()
    }, [id])

    function handleSubmit(){
        if(checkRequired('user', FIELDS)) {
            debugger
        }
    }

    if (modal!.loading && id) return <EzLoader h={300}/>

    return (
        <Stack>
            <FormGenerator
                field={FIELDS}
                structure={[1,1,1]}
                handleInput={(name, value, api) => {
                    handleInput('user', name, value, api)
                }}
                inputContainer={{gap: 8}}
                formData={{...formData?.['user']}}
                errors={errors?.['user']}
            />
            <SaveCancelDeleteBtns
                accept={handleSubmit}
                cancel={() => {
                    resetState()
                    window.closeModal(from)
                }}
                label={{accept: 'Save', cancel: 'Cancel'}}
                {...(modal?.state !== 'create' && {
                    acceptProps: {disabled: _.isEmpty(dirtyFields)}
                })}

            />
        </Stack>
    );
}

export default AddEditUserModal;

// email
// employee relation
// role