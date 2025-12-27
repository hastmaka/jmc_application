import {SignalController} from "@/signals/SignalController.js";
import {
    CLIENT_SKILL_BEHAVIOR_BY_BEHAVIOR_ID,
    CREATE_MEASURE,
    CREATE_SKILL_BEHAVIOR, CREATE_TERM_OBJECTIVE, DELETE_MEASURE,
    DELETE_SKILL_BEHAVIOR, DELETE_TERM_OBJECTIVE, UPDATE_MEASURE,
    UPDATE_SKILL_BEHAVIOR, UPDATE_TERM_OBJECTIVE
} from "@/api/action/clientViewAction/SKILLANDBEHAVIOR.js";
import {
    COMPETENCE_CAREGIVER_BY_CLIENT_ID,
    COMPETENCE_RBT_BY_CLIENT_ID,
    CREATE_TASK,
    DELETE_TASK,
    EMPLOYEE_COMPETENCE_BY_CLIENT_ID,
    UPDATE_TASK
} from '@/api/action/clientViewAction/CAREGIVERCOMPETENCE.js'

export const CompetenceController = new SignalController({
    localData: {sto: [],lto: [],initial_observation: [],baseline: [],task: []},
    editMap: {
        rbt_caregiver_competence: async (id, who) => {
            // sto, lto, initial_observation, baseline -> localData
            // rest -> formData
            let me = CompetenceController,
                {
                    sto,
                    lto,
                    initial_observation,
                    baseline,
                    tasks,
                    // eslint-disable-next-line no-unused-vars
                    term_objectives, measures,
                    ...rest
                } = await CLIENT_SKILL_BEHAVIOR_BY_BEHAVIOR_ID(id, who);

            me['localData'] = {
                ...me['localData'],
                sto, lto, initial_observation, baseline, task: tasks
            }
            me['formData']['skill_behavior'] = {...rest}
            me['tempId'] = {
                ...me['tempId'],
                sto: sto.length + 1,
                lto: lto.length + 1,
                initial_observation: initial_observation.length + 1,
                baseline: baseline.length + 1,
                task: tasks.length + 1
            }
        },
    },
    activeRbt: '',
}, {
    caregiverCompetenceGetData: async () => {
        let recordId = CompetenceController['recordId']
        CompetenceController.caregiverCompetenceData = await COMPETENCE_CAREGIVER_BY_CLIENT_ID(recordId)
        CompetenceController.caregiverCompetenceLoading = false
    },
    rbtCompetenceGetData: async (employee_id) => {
        let me = CompetenceController
        me.rbtCompetenceData = await COMPETENCE_RBT_BY_CLIENT_ID(employee_id)
        me.rbtCompetenceLoading = false
    },

    updateAfterOperation: async (who) => {
        let me = CompetenceController,
            updateMap = {
                4: () => {
                    me.caregiverCompetenceLoading = true
                    me.caregiverCompetenceGetData()
                },
                5: () => {
                    me.clientRbtsLoading = true
                    me.clientRbtsGetData()
                }
            }

        updateMap[who]()
    },
    handleSubmitCompetence: async (who) => {
        let me = CompetenceController,
            formData = me['formData']['skill_behavior'],
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id,
            client_client_id = me['recordId'],
            getModalData;

        formData.skill_behavior_measure = '1'

        if (me['modal'].state === 'edit') {
            await UPDATE_SKILL_BEHAVIOR({...formData, client_client_id, ...me['localData']})
            getModalData = me.editMap['rbt_caregiver_competence'](skillBehaviorId, who)
        } else {
            await CREATE_SKILL_BEHAVIOR({...formData, client_client_id, ...me['localData']}, who)
        }

        me.updateAfterOperation(who)
        getModalData && await getModalData.then()
    },
    handleDeleteSkillBehavior: async (id, who) => {
        let me = CompetenceController;
        await DELETE_SKILL_BEHAVIOR(id)
        me.updateAfterOperation(who)
    },

    handleCreateTermObjective: async (data, type, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
        await CREATE_TERM_OBJECTIVE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
        me.cancelIsAdding(type)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },
    handleEditTermObjective: async (data, type, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
        me.cancelIsAdding(type)
        await UPDATE_TERM_OBJECTIVE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },
    handleDeleteTermObjective: async (id, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
        await DELETE_TERM_OBJECTIVE(id)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },

    handleCreateMeasure: async (data, type, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
        await CREATE_MEASURE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
        me.cancelIsAdding(type)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },
    handleEditMeasure: async (data, type, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
        await UPDATE_MEASURE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
        me.cancelIsAdding(type)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },
    handleDeleteMeasure: async (id, who) => {
        let me = CompetenceController
        const skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
        await DELETE_MEASURE(id)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },

    handleCreateTask: async (data, type, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
        await CREATE_TASK({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
        me.cancelIsAdding(type)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },
    handleEditTask: async (data, type, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
        await UPDATE_TASK({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
        me.cancelIsAdding(type)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },
    handleDeleteTask: async (id, who) => {
        let me = CompetenceController,
            skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
        await DELETE_TASK(id)
        me.editMap['caregiver_competence'](skillBehaviorId, who)
        me.updateAfterOperation(who)
    },

    setActiveRbt: (value) => {
        let me = CompetenceController;
        me.activeRbt = value ? me.clientRbtsData.find(i=>i.value===value).label : ''
        if (value) {
            me.rbtCompetenceLoading = true
            me.rbtCompetenceGetData(value)
        }
    },
    clientRbtsGetData: async () => {
        let me = CompetenceController,
            recordId = me['recordId'],
            response = await EMPLOYEE_COMPETENCE_BY_CLIENT_ID(recordId);
        me['clientRbtsData'] = response.data.map((item) => {
            return {
                label: item['employee_full_name'],
                value: item['employee_id'].toString(),
            }
        })
        me.clientRbtsLoading = false
        me.activeRbt = me.clientRbtsData[0].label
        me.rbtCompetenceGetData(me.clientRbtsData[0].value)
    }
}).signal