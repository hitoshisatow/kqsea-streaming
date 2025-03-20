import { Event, HivemindEventHandler, obs } from "../server.js";

export class InstantReplayHandler implements HivemindEventHandler {
    async handle(event: Event) {
        if (event.type === 'victory') {
            await obs.call('TriggerHotkeyByName', {
                hotkeyName: "ReplaySource.Replay",
            });

            setTimeout(() => {
                obs.call('SetCurrentProgramScene', {
                    sceneName: "Replay",
                });
            }, 4000);

            setTimeout(() => {
                obs.call('SetCurrentProgramScene', {
                    sceneName: "Main",
                });
            }, 8000);
        } 
    }
}
