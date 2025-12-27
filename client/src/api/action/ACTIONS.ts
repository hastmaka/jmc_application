import {getFromSessionStore, updateSessionStore} from "@/util/updateLocalStore.ts";
import {encodeDecode} from '@/util/encodeDecode.ts'
import {FetchApi} from "../FetchApi.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import {logoutUser} from "@/api/firebase/FirebaseAuth.ts";
import {getModel} from "@/api/models";

export const LOGOUT_USER = async () => {
    window.toast.Progress({
        id: 'logging-out',
        title: 'Logging Out...',
        message: 'Please Wait',
    })
    return await logoutUser()
    // await FetchApi('user/logout', 'POST');
}

export const LOGIN_USER =
    async (token: string): Promise<void> => {
        const potasio = getFromSessionStore('potasio');
        if(!potasio) {
            if (!token) {
                return LOGOUT_USER();
            }

            const _token = await encodeDecode(token, 'encode');
            updateSessionStore('potasio', _token);
        }

        const dbUser = await FetchApi('login', 'POST');

        if(dbUser) {
            const user = new (getModel('user'))(dbUser.auth.user)
            LoginController.setUser(user);
            LoginController.loadingBtn = false;
        } else {
            return LOGOUT_USER();
        }
    }

