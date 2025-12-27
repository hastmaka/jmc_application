import {encodeDecode} from "./encodeDecode.js";

export const handleDataToReturn = async (
    data: any = {},
    auth: Record<string, any>
): Promise<{ success: boolean; data: any; status: number; dataCount?: number }> => {
    const tempData = data?.rows || data;
    let content = {
        success: true,
        decodedData: tempData,
        data: await encodeDecode(tempData),
        auth: await encodeDecode(auth),
        status: 200,
        dataCount: undefined
    };
    if (data?.rows) {
        content.dataCount = data?.count || 0;
    }
    return content;
};