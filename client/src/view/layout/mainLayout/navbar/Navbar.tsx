import { IconLogin,} from '@tabler/icons-react';
import { Center, Stack, Image } from '@mantine/core';
import classes from './Navbar.module.scss';
import {LOGOUT_USER} from "@/api/action/ACTIONS.ts";
import {AppController} from "@/AppController.ts";
import getModules from "@/view/layout/mainLayout/navbar/getModules.ts";
import {EzSideNavItem} from "@/ezMantine/sideNavItem/EzSideNavItem.tsx";
import UnStyledButton from "@/ezMantine/sideNavItem/UnstyledButton.tsx";

export function Navbar() {
    const accessibleModules = getModules()
    const {burger} = AppController

    const links = accessibleModules.map((link) => (
        <EzSideNavItem {...link} key={link.path}/>
    ));

    return (
        <nav
            className={classes.navbar}
            style={{['--navbar-width' as any]: burger.opened ? '80px' : '220px'}}
        >
            <Center>
                <Image src='/fav-180x180.avif' w={30} h='auto'/>
            </Center>

            <div className={classes.navbarMain}>
                {links}
            </div>

            <Stack justify="center" gap={0}>
                <UnStyledButton icon={IconLogin} label="Logout" onClick={LOGOUT_USER}/>
            </Stack>
        </nav>
    );
}