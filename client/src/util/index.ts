// Gather all utils in one place
import { updateSessionStore, getFromSessionStore } from "./updateLocalStore.ts";
import { imageToBase64 } from "./imageTo64.ts";
import { downloadToFile } from "./downloadFile.ts";
import { formatPhoneNumber, removePhoneMask } from "./formatPhoneNumber.ts";
import { encodeDecode } from "./encodeDecode.ts";
import { capitalizeWords } from "./capitalizeFirstLetter.ts";
import { formatMoney } from "./formatMoney.ts";
import { valueToLabel } from "./convertData.ts";
import { normalizedData } from "./normalizedData.ts";
import { getNameFromUrl } from "./getNameFromUrl.ts";
import { updateFormData } from "./updateFormData.ts";
import { createId } from "./createId.ts";
import { hasRequiredKeys } from "./hasRequiredKeys.ts";
import { ezAwait } from "./ezAwait.ts";
import { rangeDate} from "./rangeDate.ts";
import * as sanitizer from './sanitizer.ts';
import {openDocumentOnBrowser} from "./openDocumentOnBrowser.ts";

// Named exports (tree-shakeable)
export {
    updateSessionStore,
    getFromSessionStore,
    imageToBase64,
    downloadToFile,
    formatPhoneNumber,
    removePhoneMask,
    encodeDecode,
    capitalizeWords,
    formatMoney,
    valueToLabel,
    normalizedData,
    getNameFromUrl,
    updateFormData,
    createId,
    hasRequiredKeys,
    ezAwait,
    rangeDate,
    sanitizer,
    openDocumentOnBrowser
};

// 👇 Default export as `_`, lodash-style
const u = {
    openDocumentOnBrowser,
    sanitizer,
    rangeDate,
    updateSessionStore,
    getFromSessionStore,
    imageToBase64,
    downloadToFile,
    formatPhoneNumber,
    removePhoneMask,
    encodeDecode,
    capitalizeWords,
    formatMoney,
    valueToLabel,
    normalizedData,
    getNameFromUrl,
    updateFormData,
    createId,
    hasRequiredKeys,
    ezAwait,
};

export default u;