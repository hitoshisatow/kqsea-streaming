import { Event, HivemindEventHandler, obs } from "../server.js";

export class MainStartSwitchHandler implements HivemindEventHandler {
    async handle(event: Event) {
        if (event.type === 'gamestart') {
            obs.call('SetCurrentProgramScene', {
                sceneName: "Main",
            });
        } 
    }
}
