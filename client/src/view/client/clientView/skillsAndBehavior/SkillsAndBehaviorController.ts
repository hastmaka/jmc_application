import {type BasePropsType, SignalController} from "@/signals/signalController/SignalController.ts";
import type {SignalType} from "@/signals/SignalClass.ts";
import {FetchApi} from "@/api/FetchApi.ts";
import {getModel} from "@/api/models";

type SkillsAndBehaviorControllerProps = BasePropsType & {
    localData: {sto: any[],lto: any[],initial_observation: any[],baseline: any[]}
}

type SkillsAndBehaviorControllerMethods = {
    maladaptiveBehaviorGetData: () => Promise<void>;
    replacementBehaviorGetData: () => Promise<void>;
    skillAcquisitionGetData: () => Promise<void>;
    updateAfterOperation: () => void;
    handleSubmitSkillBehavior: () => Promise<void>;
}

export type SkillsAndBehaviorControllerType = SignalType<SkillsAndBehaviorControllerProps, SkillsAndBehaviorControllerMethods>

export const SkillsAndBehaviorController: SkillsAndBehaviorControllerType = new SignalController({
    localData: {sto: [],lto: [],initial_observation: [],baseline: [],},
    editMap: {
        skill_behavior: async (field, id, who) => {
            // sto, lto, initial_observation, baseline -> localData
            // rest -> formData
            // let me = SkillsAndBehaviorController,
            //     // eslint-disable-next-line no-unused-vars
            //     {sto, lto, initial_observation, baseline, term_objectives, measures, ...rest} = await CLIENT_SKILL_BEHAVIOR_BY_BEHAVIOR_ID(id, who);
            //
            // me['localData'] = {
            //     ...me['localData'],
            //     sto, lto, initial_observation, baseline,
            // }
            // me['formData']['skill_behavior'] = {...rest}
            // me['tempId'] = {
            //     ...me['tempId'],
            //     sto: sto.length + 1,
            //     lto: lto.length + 1,
            //     initial_observation: initial_observation.length + 1,
            //     baseline: baseline.length + 1
            // }
        },
    },
}, {
    maladaptiveBehaviorGetData: async function(this: SkillsAndBehaviorControllerType){
        const response = await FetchApi(`v1/client/skill/maladaptive_behavior/${this?.recordId}`)
        // let recordId = SkillsAndBehaviorController['recordId']
        this.maladaptiveBehaviorData = new (getModel('client'))(response.data)
        // SkillsAndBehaviorController.maladaptiveBehaviorLoading = false;
        // debugger
    },
    replacementBehaviorGetData: async () => {
        // let recordId = SkillsAndBehaviorController['recordId']
        // SkillsAndBehaviorController.replacementBehaviorData = await REPLACEMENT_BEHAVIOR_BY_CLIENT_ID(recordId);
        // SkillsAndBehaviorController.replacementBehaviorLoading = false;
    },
    skillAcquisitionGetData: async () => {
        // let recordId = SkillsAndBehaviorController['recordId']
        // SkillsAndBehaviorController.skillAcquisitionData = await SKILL_ACQUISITION_BY_CLIENT_ID(recordId);
        // SkillsAndBehaviorController.skillAcquisitionLoading = false;
    },

    /** type
     * 1: maladaptive
     * 2: replacement
     * 3: skill acquisition
     * */
    updateAfterOperation: async (who) => {
        // let me = SkillsAndBehaviorController,
        //     updateMap = {
        //         1: () => {
        //             me.maladaptiveBehaviorLoading = true
        //             me.maladaptiveBehaviorGetData()
        //         },
        //         2: () => {
        //             me.replacementBehaviorLoading = true
        //             me.replacementBehaviorGetData()
        //         },
        //         3: () => {
        //             me.skillAcquisitionLoading = true
        //             me.skillAcquisitionGetData()
        //         }
        //     }
        //
        // updateMap[who]()
    },
    handleSubmitSkillBehavior: async (who) => {
        // let me = SkillsAndBehaviorController,
        //     formData = me['formData']['skill_behavior'],
        //     skillBehaviorId = me.formData.skill_behavior.skill_behavior_id,
        //     client_client_id = me['recordId'],
        //     getModalData;
        //
        // if (me['modal'].state === 'edit') {
        //     await UPDATE_SKILL_BEHAVIOR({...formData, client_client_id, ...me['localData']})
        //     getModalData = me.editMap['skill_behavior'](skillBehaviorId, who)
        // } else {
        //     await CREATE_SKILL_BEHAVIOR({...formData, client_client_id, ...me['localData']}, who)
        // }
        //
        // me.updateAfterOperation(who)
        // getModalData && await getModalData.then()

        // let obj = {
        //     client_client_id: me['recordId'],
        //     "skill_behavior_name": "test",
        //     "skill_behavior_start_date": "10/02/2024",
        //     "skill_behavior_intensity": "2",
        //     "skill_behavior_measure": "2",
        //     "skill_behavior_status": "2",
        //     "skill_behavior_functions": [
        //         "1",
        //         "2"
        //     ],
        //     "skill_behavior_topography": "tesat",
        //
        //     "sto": [
        //         {
        //             "term_objective_id": 1,
        //             "term_objective_name": "Sto #1",
        //             "term_objective_type": null,
        //             "term_objective_start_date": "10/01/2024",
        //             "term_objective_expected_met_date": "10/04/2024",
        //             "term_objective_status": 2,
        //             "term_objective_description": "test",
        //             "skill_behavior_skill_behavior_id": null
        //         }
        //     ],
        //         "lto": [
        //         {
        //             "term_objective_id": 1,
        //             "term_objective_name": "Lto #1",
        //             "term_objective_type": null,
        //             "term_objective_start_date": "10/01/2024",
        //             "term_objective_expected_met_date": "10/05/2024",
        //             "term_objective_status": 2,
        //             "term_objective_description": "test",
        //             "skill_behavior_skill_behavior_id": null
        //         }
        //     ],
        //         "initial_observation": [
        //         {
        //             "measure_id": 1,
        //             "measure_type": null,
        //             "measure_value": 1,
        //             "measure_start_date": "10/01/2024",
        //             "skill_behavior_skill_behavior_id": null
        //         }
        //     ],
        //         "baseline": [
        //         {
        //             "measure_id": 1,
        //             "measure_type": null,
        //             "measure_value": 1,
        //             "measure_start_date": "09/30/2024",
        //             "skill_behavior_skill_behavior_id": null
        //         }
        //     ]
        // }
    },
    // handleDeleteSkillBehavior: async (id, who) => {
    //     let me = SkillsAndBehaviorController;
    //     await DELETE_SKILL_BEHAVIOR(id)
    //     me.updateAfterOperation(who)
    // },
    //
    // handleCreateTermObjective: async (data, type, who) => {
    //     let me = SkillsAndBehaviorController,
    //         skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
    //     await CREATE_TERM_OBJECTIVE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
    //     me.cancelIsAdding(type)
    //     me.editMap['skill_behavior'](skillBehaviorId, who)
    //     me.updateAfterOperation(who)
    // },
    // handleEditTermObjective: async (data, type, who) => {
    //     let me = SkillsAndBehaviorController,
    //         skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
    //     me.cancelIsAdding(type)
    //     await UPDATE_TERM_OBJECTIVE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
    //     me.editMap['skill_behavior'](skillBehaviorId, who)
    //     me.updateAfterOperation(who)
    // },
    // handleDeleteTermObjective: async (id, who) => {
    //     let me = SkillsAndBehaviorController,
    //         skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
    //     await DELETE_TERM_OBJECTIVE(id)
    //     me.editMap['skill_behavior'](skillBehaviorId, who)
    //     me.updateAfterOperation(who)
    // },
    //
    // handleCreateMeasure: async (data, type, who) => {
    //     let me = SkillsAndBehaviorController,
    //         skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
    //     await CREATE_MEASURE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
    //     me.cancelIsAdding(type)
    //     me.editMap['skill_behavior'](skillBehaviorId, who)
    //     me.updateAfterOperation(who)
    // },
    // handleEditMeasure: async (data, type, who) => {
    //     let me = SkillsAndBehaviorController,
    //         skillBehaviorId = me.formData.skill_behavior.skill_behavior_id;
    //     await UPDATE_MEASURE({...data, skill_behavior_skill_behavior_id: skillBehaviorId})
    //     me.cancelIsAdding(type)
    //     me.editMap['skill_behavior'](skillBehaviorId, who)
    //     me.updateAfterOperation(who)
    // },
    // handleDeleteMeasure: async (id, who) => {
    //     let me = SkillsAndBehaviorController
    //     const skillBehaviorId = me.formData.skill_behavior.skill_behavior_id
    //     await DELETE_MEASURE(id)
    //     me.editMap['skill_behavior'](skillBehaviorId, who)
    //     me.updateAfterOperation(who)
    // },
}).signal


