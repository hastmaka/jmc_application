import EzCard from "@/ezMantine/card/EzCard.tsx";
import IconText from "@/components/IconText.tsx";
import {
    IconHome,
    IconClock,
    IconPhone,
    IconClipboardHeart,
    IconHeartHandshake,
    IconCalendar,
    IconGenderBigender,
    IconLanguage,
    IconNotes
} from "@tabler/icons-react";
import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import {useLayoutEffect} from "react";
import {ClientInfoController} from "./ClientInfoController.tsx";
import {Skeleton} from "@mantine/core";
import moment from "moment";
import {formatPhoneNumber} from "@/util";
import _ from "lodash";

const ClientDetail = () => {
    const {clientDetailData, clientDetailLoading, clientDetailGetData} = ClientInfoController

    useLayoutEffect(() => {
        clientDetailGetData().then();
        return () => {
            ClientInfoController.clientDetailData = []
            ClientInfoController.clientDetailLoading = true
        }
    }, []);

    if (clientDetailLoading) return <Skeleton height={346} radius='sm'/>

    return (
        <EzCard title='Details'>
            <EzGrid gridTemplateColumns='repeat(2, minmax(180px, 1fr))'>
                <IconText
                    icon={IconNotes}
                    text={['Diagnosis', 'pancho']}
                />
                <IconText
                    icon={IconClock}
                    text={['DOB', clientDetailData?.client_dob || 'Not Set']}
                />
                <IconText
                    icon={IconHome}
                    text={['Primary Address', clientDetailData?.client_primary_address || 'Not Set']}
                />
                <IconText
                    icon={IconPhone}
                    text={['Primary Phone',
                        clientDetailData?.client_primary_phone ? formatPhoneNumber(clientDetailData?.client_primary_phone) : 'Not Set']}
                />
                <IconText
                    icon={IconClipboardHeart}
                    text={['Primary Caregiver', _.startCase(clientDetailData?.client_primary_caregiver) || 'Not Set']}
                />

                <IconText
                    icon={IconGenderBigender}
                    text={['Client Sex', clientDetailData?.client_sex || 'Not Set']}
                />
                <IconText
                    icon={IconCalendar}
                    text={['Created at',
                        clientDetailData?.created_at ? moment(clientDetailData?.created_at).format('MMM DD YYYY') : 'Not Set']}
                />
                <IconText
                    icon={IconLanguage}
                    text={[
                        // 'Language',
                        // clientDetailData.client_language.map((l: string, i: number) =>
                        //     _.startCase(l) + (i < clientDetailData.client_language.length - 1 ? ", " : "")),
                        'Preferred Language:',
                        _.startCase(clientDetailData?.client_primary_language) || 'Not Set'
                    ]}
                />
                <IconText
                    icon={IconHeartHandshake}
                    text={[
                        'Primary Insurance',
                        clientDetailData.client_primary_insurance,
                        `Effective Date: ${
                            clientDetailData?.client_primary_insurance_effective_start_date
                            ? moment(clientDetailData.client_primary_insurance_effective_start_date).format('MMM DD YYYY')
                            : 'Not Set'}`,
                        `Expiration Date: ${
                            clientDetailData?.client_primary_insurance_effective_end_date
                            ? moment(clientDetailData.client_primary_insurance_effective_end_date).format('MMM DD YYYY') 
                            : 'Not Set'
                        }`,
                    ]}
                    style={{gridColumn: 'span 2'}}
                />
            </EzGrid>
        </EzCard>
    )
}

export default ClientDetail;
