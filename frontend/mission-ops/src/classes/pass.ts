import { QueuedTelecommand } from './queuedTelecommand';

export class Pass {
    id: number;
    queuedTelecommands : QueuedTelecommand[];
    passDateTime : Date;

    constructor(id: number) {
        this.id = id;
    }
}