export class Player {
    constructor(speed: number) {
        this.setSpeed(speed);
    }

    getPlayer(): HTMLVideoElement | null {
        return document.querySelector('.html5-main-video');
    }

    setSpeed(speed: number) {
        const player = this.getPlayer();
        if (player) {
            player.playbackRate = speed;
        }
    }
}
