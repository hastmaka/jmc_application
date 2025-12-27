import {SignalController} from "@/signals/SignalController.js";
import {
    CLIENT_SKILL_BEHAVIOR_BY_BEHAVIOR_ID,
    CREATE_SKILL_BEHAVIOR,
    DELETE_SKILL_BEHAVIOR,
    UPDATE_SKILL_BEHAVIOR
} from "@/api/action/clientViewAction/SKILLANDBEHAVIOR.js";
import {INTERVENTION_BY_CLIENT_ID} from '@/api/action/clientViewAction/INTERVENTIONS.js'

export const InterventionController = new SignalController({
    editMap: {
        intervention: async (id) => {
            InterventionController.formData['intervention'] = await CLIENT_SKILL_BEHAVIOR_BY_BEHAVIOR_ID(id, 6);
        }
    }
},{
    interventionGetData: async () => {
        let me = InterventionController,
            recordId = me['recordId'];
        me.interventionData = await INTERVENTION_BY_CLIENT_ID(recordId)
        me.interventionLoading = false
    },

    handleInterventionSubmit: async () => {
        let me = InterventionController,
            formData = me.formData.intervention,
            client_client_id = me['recordId'];

        if (me['modal'].state === 'edit') {
            await UPDATE_SKILL_BEHAVIOR({...formData, client_client_id})
        } else {
            await CREATE_SKILL_BEHAVIOR({...formData, client_client_id}, 6)
        }

        me.interventionLoading = true
        me.interventionGetData()
    },

    handleDeleteIntervention: async (id) => {
        let me = InterventionController;
        await DELETE_SKILL_BEHAVIOR(id)
        me.interventionLoading = true
        me.interventionGetData()
    },
}).signal