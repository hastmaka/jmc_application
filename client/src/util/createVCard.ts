// import VCard from "vcard-creator";
//
// export async function createVCard({
//     formData
// }: {
//     formData: any
// }) {
//     const {
//         prefix,
//         firstName,
//         additional,
//         lastName,
//         suffix,
//         nickname,
//         organization,
//         title,
//         role,
//         workUrl,
//         personalEmail,
//         workEmail,
//         homePhone,
//         workPhone,
//         cellPhone,
//         homeFax,
//         workFax,
//         street,
//         city,
//         state,
//         zipCode,
//         country,
//         workStreet,
//         workCity,
//         workState,
//         workZipCode,
//         workCountry,
//         photo,
//         companyLogo,
//         linkedin,
//         twitter,
//         facebook,
//         instagram,
//         youtube,
//         customSocial,
//         customSocialUrl,
//         notes,
//     } = formData
//     // Define a new vCard
//     const myVCard = new VCard()
//
//     // myVCard.addName(firstName, lastName, additional, prefix, suffix)
//     myVCard.addName(
//         String(firstName ?? '') || undefined,
//         String(lastName ?? '') || undefined,
//         String(additional ?? '') || undefined,
//         String(prefix ?? '') || undefined,
//         String(suffix ?? '') || undefined
//     )
//     if (nickname)
//         myVCard.addNickname(
//             String(nickname ?? '') || [],
//         )
//     if (organization)
//         myVCard.addCompany(
//             String(organization ?? ''),
//             String(title ?? '')
//         )
//     myVCard.addRole(
//         String(role ?? ''),
//     )
//     if (workUrl)
//         myVCard.addURL(
//             String(workUrl ?? ''),
//             String('WORK'),
//         )
//     if (personalEmail)
//         myVCard.addEmail(
//             String(personalEmail ?? ''),
//             String('PREF'),
//         )
//     if (workEmail)
//         myVCard.addEmail(
//             String(workEmail ?? ''),
//             String('WORK'),
//         )
//     if (homePhone)
//         myVCard.addPhoneNumber(String(homePhone), 'HOME')
//     if (workPhone)
//         myVCard.addPhoneNumber(String(workPhone), 'WORK')
//     if (cellPhone)
//         myVCard.addPhoneNumber(String(cellPhone), 'PREF;CELL')
//     if (homeFax)
//         myVCard.addPhoneNumber(String(homeFax), 'HOME;FAX')
//     if (workFax)
//         myVCard.addPhoneNumber(String(workFax), 'WORK;FAX')
//     if (street && city && state && zipCode && country)
//         myVCard.addAddress(
//             String(street),
//             String(city),
//             String(state),
//             String(zipCode),
//             String(country),
//             'HOME'
//         )
//     if (workStreet && workCity && workState && workZipCode && workCountry)
//         myVCard.addAddress(
//             String(workStreet),
//             String(workCity),
//             String(workState),
//             String(workZipCode),
//             String(workCountry),
//             'WORK'
//         )
//     if (photo && typeof photo === 'object' && 'base64' in photo)
//         myVCard.addPhoto((photo as { base64: string }).base64)
//     if (companyLogo && typeof companyLogo === 'object' && 'base64' in companyLogo)
//         myVCard.addLogo((companyLogo as { base64: string }).base64)
//     if (linkedin)
//         myVCard.addSocial(String(linkedin), 'LinkedIn')
//     if (twitter)
//         myVCard.addSocial(String(twitter), 'Twitter')
//     if (facebook)
//         myVCard.addSocial(String(facebook), 'Facebook')
//     if (instagram)
//         myVCard.addSocial(String(instagram), 'Instagram')
//     if (youtube)
//         myVCard.addSocial(String(youtube), 'Youtube')
//     if (customSocial)
//         myVCard.addSocial(String(customSocialUrl), String(customSocial))
//     if (notes)
//         myVCard.addNote(String(notes))
//
//     return myVCard
// }