export const getDataReadyForDb = (data, userCredentials) => {
    let dataReady = {}
    Object.entries(data).map(([key, value]) => {
        if(key.includes('phone')) {
            return dataReady[key] = value.trim().replace (/\D/g, '')
        }
        if(key.includes('business_credit')) {
            return dataReady[key] = value * 100
        }
        dataReady[key] = typeof value === 'string'
                ? userCredentials ? value.trim() : value.trim().replace(/\s+/g, ' ')
                // : typeof value === 'boolean'
                // ? (value ? 1 : 0)
                : value
        
    })
    return dataReady
}
