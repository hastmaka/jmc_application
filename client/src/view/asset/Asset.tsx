import {Grid, Stack} from "@mantine/core";
import AssetList from "./AssetList.tsx";
import AssetOptionList from "./AssetOptionList.tsx";

function Asset() {
    return (
        <Stack style={{width: "100%", height: "100%", maxWidth: "1600px", margin: "0 auto"}}>
            <Grid gutter="md" h="100%">
                <Grid.Col span={4}>
                    <AssetList />
                </Grid.Col>
                <Grid.Col span={8}>
                    <AssetOptionList />
                </Grid.Col>
            </Grid>
        </Stack>
    );
}

export default Asset;
