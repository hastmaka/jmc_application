import Ez from "./Ez.ts";
import {Op, Transaction} from "sequelize";
import models from '../db/index.ts';
import {checkRequirement} from "../utils/index.ts";

class Document extends Ez {
    constructor(data: any, user: any = {}) {
        super(data, models.document, user);
    }

    static async listDocument(method: string, options: Record<string, any> = {}) {
        const instance = new Document({});
        return await instance.list(method, options);
    }

    static async listDocumentByPk(id: number, options: Record<string, any> = {}) {
        const instance = new Document({});
        return await instance.listByPk(id, options);
    }

    static async createDocumentFactory(transaction: Transaction | undefined, document: any, user: any) {
        checkRequirement(models.document, document);

        let newDocument = new Document(document, user);

        return await newDocument.create(transaction);
    }

    static async updateDocument(transaction: Transaction | undefined, record: Record<string, any>, options: any, user: any) {
        const instance = new Document(record, user);
        return await instance.update(transaction, options);
    }

    static async updateDocumentFactory(transaction: Transaction | undefined, record: Record<string, any>, user: any) {
        let options = {
            where: {
                document_id: {
                    [Op.eq]: record.document_id
                }
            }
        };

        return await Document.updateDocument(transaction, record, options, user);
    }

    static async deleteDocument(transaction: Transaction | undefined, document_id: number, user: any) {
        const instance = new Document({}, user);
        return await instance.delete(transaction, document_id);
    }
}

export default Document;
