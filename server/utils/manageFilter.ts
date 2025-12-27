import {ModelStatic, Op} from 'sequelize';

/**
 * manageFilter()
 * ----------------
 * Converts client-side filters (sent as JSON through req.query.filters)
 * into a Sequelize-compatible query object.
 *
 * PURPOSE:
 * - Parse query parameters: filters, group, order, offset, limit.
 * - Sanitize filters based on model attribute definitions.
 * - Convert client operators ("=", "like", "between", etc.) into Sequelize operators.
 * - Convert values to proper data types (numbers, decimals, floats).
 * - Produce a ready-to-use Sequelize query config:
 *      { where: {}, group, order, offset, limit }
 *
 * PARAMETERS:
 * @param reqQuery   Express request query object.
 *                   Expected shape:
 *                   {
 *                      filters?: "[{ fieldName, operator, value }]",
 *                      group?: string[],
 *                      order?: string[],
 *                      offset?: string,
 *                      limit?: string
 *                   }
 *
 * @param model      Sequelize Model — used to validate allowed fields
 *                   and detect column data types.
 *
 * FILTER OBJECT STRUCTURE (from client):
 * {
 *   fieldName: string;      // DB column name
 *   operator?: Operator;    // one of: '=', 'like', '>=', '<=', 'between', etc.
 *   value: any;             // raw value
 * }
 *
 * OPERATOR CONVERSION:
 * Example:
 *  "="       → { [Op.eq]: value }
 *  "like"    → { [Op.like]: `%value%` }
 *  "between" → { [Op.between]: [start, end] }
 *
 * INTERNAL LOGIC:
 * 1. Start with `query = { where: {} }`.
 * 2. Apply group/order/offset/limit if present.
 * 3. If no filters → return base query.
 * 4. Parse filters as JSON.
 * 5. For each filter:
 *      - Ignore unknown fields not defined in model attributes.
 *      - Ignore VIRTUAL attributes.
 *      - Convert number-based fields properly (INTEGER, DECIMAL, FLOAT).
 *      - Convert operator/value using convertOperatorToSequelize().
 *      - Assign result to query.where[fieldName].
 *
 * RETURNS:
 * A fully constructed Sequelize query object, ready for:
 *   Model.findAll(query)
 *   Model.findAndCountAll(query)
 *   Model.findOne(query)
 *
 * EXAMPLE USAGE:
 * const query = manageFilter(req.query, ReservationModel);
 * const results = await ReservationModel.findAndCountAll(query);
 */

type Operator =
    | '=' | '==' | 'like' | 'LIKE' | 'contains' | 'notLike' | 'NOTLIKE'
    | '<' | '<=' | '>=' | '>' | '!=' | 'in' | 'notin' | 'between' | '[]';

type Filter = {
    fieldName: string;
    operator?: Operator | undefined;
    value: any;
    logic?: string;
};

const convertOperatorToSequelize = (
    operator?: Operator,
    value?: any
): Record<string | symbol, any> => {
    const symbols: Record<Operator, Record<string | symbol, any>> = {
        '=': { [Op.eq]: value },
        '==': { [Op.eq]: value },
        'like': { [Op.like]: `%${value}%` },
        'LIKE': { [Op.like]: `%${value}%` },
        'contains': { [Op.substring]: value },
        'notLike': { [Op.notLike]: `%${value}%` },
        'NOTLIKE': { [Op.notLike]: `%${value}%` },
        '<': { [Op.lt]: value },
        '<=': { [Op.lte]: value },
        '>=': { [Op.gte]: value },
        '>': { [Op.gt]: value },
        '!=': { [Op.ne]: value },
        'in': { [Op.in]: value },
        'notin': { [Op.notIn]: value },
        'between': { [Op.between]: value },
        '[]': { [Op.between]: value },
    };

    return symbols[operator || 'contains'];
};

export const manageFilter = (
    reqQuery: Record<string, any>,
    model: ModelStatic<any>,
) => {
    const query: any = { where: {} };
    let { filters, group, order, offset, limit } = reqQuery as {
        filters?: string;
        group?: string[];
        order?: string[];
        offset?: string;
        limit?: string;
    }

    if (group) query.group = group;
    if (order) query.order = order;
    if (offset) query.offset = parseInt(offset as string);
    if (limit) query.limit = parseInt(limit as string);

    if (!filters) return query;

    const whiteFields = model.getAttributes();
    const filtersArray: Filter[] = JSON.parse(filters);

    const OR: any[] = [];
    const AND: any[] = [];

    for (const filter of filtersArray) {
            const {fieldName, operator, value, logic = 'and'} = filter;
        if (
            Object.prototype.hasOwnProperty.call(whiteFields, fieldName) &&
            whiteFields[fieldName].type.constructor.name !== 'VIRTUAL'
        ) {
            const attr = whiteFields[fieldName];

            let parsedValue = value;
            if (['DECIMAL', 'INTEGER', 'FLOAT', 'DOUBLE', 'REAL'].includes(attr.type.constructor.name)) {
                parsedValue = isNaN(Number(value)) ? value : Number(value);
            }
            // query.where[fieldName] = convertOperatorToSequelize(operator, parsedValue);

            const condition = convertOperatorToSequelize(operator, parsedValue);

            // logic = "or" or "and" (default = and)
            if (logic === "or") {
                OR.push({ [fieldName]: condition });
            } else {
                AND.push({ [fieldName]: condition });
            }
        }
    }

    // Apply OR conditions
    if (OR.length > 0) {
        query.where[Op.or] = OR;
    }

    // Apply AND conditions
    if (AND.length > 0) {
        query.where[Op.and] = AND;
    }

    return query;
};