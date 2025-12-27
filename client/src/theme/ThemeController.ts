import {getFromSessionStore, updateSessionStore} from "@/util/updateLocalStore.ts";
import {LoginController} from "@/view/login/LoginController.ts";
import {SignalState, type SignalType} from "@/signals/SignalClass.ts";

if (!getFromSessionStore('theme')) {updateSessionStore('theme', 'light')}

export const ThemeController: SignalType<any, any> = new SignalState({
    primaryColor: getFromSessionStore('primaryColor') || 'blue',
    theme: getFromSessionStore('theme') || 'dark',
},{
    getLogo: function(this:any, _type: string, force = ''){
        const me = ThemeController,
            theme = force || me.theme;

        return theme === 'dark'
            ? '/fav-180x180.avif'
            : '/fav-180x180.avif'
    },
    toggleTheme: async function(this: any, isLocal: boolean = false){
        const theme = this.theme
        this.theme = theme === 'dark' ? 'light' : 'dark'
        if (isLocal) {
            return updateSessionStore('theme', this.theme)
        }
        await LoginController.syncUserPreference({ theme: this.theme });
    },
    setTheme: function (this: any, preferences: Record<string, any>){
        this.theme = preferences.theme || 'light'
        this.primaryColor = preferences.color || 'blue'
        updateSessionStore('theme', this.theme)
        updateSessionStore('primaryColor', this.primaryColor)
    },
    setPrimaryColor: function (this: any, color: string) {
        this.primaryColor = color
    },
}).signal