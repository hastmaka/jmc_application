export function checkRequirement(model: Record<string, any>, data: any){
    type Field = {
        allowNull?: boolean;
        [key: string]: any;
    };

    const result = Object.entries(model['fieldRawAttributesMap'] as Record<string, Field>)
        .filter(([key, value]) => {
            // value must be a non-null object
            if (!value || typeof value !== 'object') return false;

            // must own the property, not inherited
            if (!Object.hasOwn(value, 'allowNull')) return false;

            // allowNull must be strictly false AND not one of the ignored fields
            return value.allowNull === false && key !== 'created_at' && key !== 'updated_at';
        })
        .map(([key]) => key);
    for (const key of result) {
        if (!data[key]) {
            const field = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const error = new Error(`${field} is required`);
            (error as any).field = key;
            throw error;
        }
    }
}