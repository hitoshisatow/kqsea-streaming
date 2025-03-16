import { Event, HivemindEventHandler, obs } from "../server.js";

export class InstantReplayHandler implements HivemindEventHandler {
    handle(event: Event) {
        if (event.type === 'victory') {
            setTimeout(() => {
                obs.call('SetCurrentProgramScene', { sceneName: 'Waiting' }).then(() => {
                    setTimeout(() => {
                        obs.call('SetCurrentProgramScene', { sceneName: 'HMAutoGame' });
                    }, 8000);
                });
            }, 8000);
        }
    }
}
