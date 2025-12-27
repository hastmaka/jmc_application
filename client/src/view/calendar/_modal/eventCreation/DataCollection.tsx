import EzGrid from "@/ezMantine/gridLayout/EzGrid.tsx";
import DataCollectionCard from "@/view/calendar/_modal/eventCreation/DataCollectionCard.tsx";
import {EventCreationModalController} from "./EventCreationModalController.ts";
import {useLayoutEffect} from "react";
import EzLoader from "@/ezMantine/loader/EzLoader.tsx";

function DataCollection() {
    const {maladaptiveBehaviorGetData, maladaptiveBehaviorData, maladaptiveBehaviorLoading} = EventCreationModalController

    useLayoutEffect(() => {
        maladaptiveBehaviorGetData().then()
        return () => {
            EventCreationModalController.maladaptiveBehaviorData = []
            EventCreationModalController.maladaptiveBehaviorLoading = true
        }
    }, [])

    if (maladaptiveBehaviorLoading) return <EzLoader h={400}/>

    return (
        <EzGrid
            gridTemplateColumns="repeat(auto-fill, minmax(400px, 1fr))"
        >
            {maladaptiveBehaviorData.map((item: any, index: number) => (
                <DataCollectionCard
                    key={index}
                    name={item.asset_option_name}
                    initialValue={10}
                />
            ))}
        </EzGrid>
    );
}

export default DataCollection;