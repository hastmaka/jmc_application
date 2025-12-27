import {ModelStatic, Op, Transaction} from 'sequelize';

class Ez {
    private fields: string[] = [];
    private readonly authUser: any;
    private model: ModelStatic<any>;

    constructor(data: Record<string, any>, model: ModelStatic<any>, authUser: any) {
        this.model = model;
        this.authUser = authUser;
        this.populateFields(data);
    }

    private populateFields(data: Record<string, any>) {
        if (!data || Object.keys(data).length === 0) return;

        const attributes = this.model.getAttributes();
        const ignoredFields = ['created_at', 'updated_at'];

        for (const field in attributes) {
            if (
                ignoredFields.includes(field) ||
                (attributes[field].type && attributes[field].type.constructor && attributes[field].type.constructor.name === 'VIRTUAL')
            ) continue;

            if (Object.prototype.hasOwnProperty.call(data, field)) {
                (this as any)[field] = data[field];
                this.fields.push(field);
            }
        }
    }

    private buildDataToCreate(): Record<string, any> {
        const dataToCreate: Record<string, any> = {};
        for (const field of this.fields) {
            dataToCreate[field] = (this as any)[field];
        }
        return dataToCreate;
    }

    list(method: string, options: Record<string, any> = {}): Promise<any> {
        options.distinct = true;
        return new Promise((resolve, reject) => {
            (this.model as any)[method](options)
                .then((results: any) => {
                    resolve(results);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    listByPk(id: number | string, options: Record<string, any> = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.findByPk(id, options)
                .then((results: any) => {
                    resolve(results);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    create(transaction: Transaction | undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            this.model.create(this.buildDataToCreate(), {
                fields: this.fields,
                authUser: this.authUser,
                transaction: transaction || null,
                individualHooks: true
            }).then(results => {
                resolve(results);
            }).catch(error => {
                reject(error);
            });
        });
    }

    bulkCreate(transaction: Transaction | undefined, records: Array<Record<string, any>>): Promise<any> {
        return new Promise((resolve, reject) => {
            const options = {
                fields: records[0]?.fields || [],
                authUser: this.authUser,
                transaction: transaction || null,
                individualHooks: true
            };

            this.model.bulkCreate(records, options)
                .then((response: any[]) => {
                    resolve(response);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    update(transaction: Transaction | undefined, options: Record<string, any> & {
        where: Record<string, any>
    }): Promise<any> {
        if (!options.where) {
            throw new Error("The 'where' clause is required in options for update.");
        }

        const updateOptions = {
            fields: this?.fields || [],
            authUser: this.authUser,
            transaction: transaction || null,
            individualHooks: true,
            ...options
        };

        return new Promise((resolve, reject) => {
            this.model.update(this.buildDataToCreate(), updateOptions)
                .then((results: any) => {
                    resolve(results);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    delete(transaction: Transaction | undefined, id: number): Promise<any> {
        const deleteOptions = {
            authUser: this.authUser,
            transaction: transaction || null,
            individualHooks: true,
            where: {
                [this.model.primaryKeyAttribute!]: {
                    [Op.eq]: +id
                }
            },
        };

        return new Promise((resolve, reject) => {
            this.model.destroy(deleteOptions)
                .then((results: any) => {
                    resolve(results);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    deleteGeneric(transaction: Transaction | undefined, where = {}): Promise<any> {
        const deleteOptions = {
            authUser: this.authUser,
            transaction: transaction || null,
            individualHooks: true,
            where
        };

        return new Promise((resolve, reject) => {
            this.model.destroy(deleteOptions)
                .then((results: any) => {
                    resolve(results);
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
}

export default Ez;