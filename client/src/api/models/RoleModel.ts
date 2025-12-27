import EzModel from "../model/EzModel.ts";

export default class RoleModel extends EzModel {
    static modelName = "role";

    constructor(data: Record<string, any>) {
        super({
            fields: [{
                name: "role_id", type: "int"
            }, {
                name: 'role_name', type: 'string'
            }, {
                name: 'role_description', type: 'string'
            }, {
                name: 'permission_id', type: 'int'
            }],
            data, suffix: 'role', requiresPrimary: false
        });
    }
}