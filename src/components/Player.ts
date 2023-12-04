export class Player {
    constructor(speed: number) {
        this.setSpeed(speed);
    }

    getPlayer(): HTMLVideoElement | null {
        return document.querySelector('.html5-main-video');
    }

    setSpeed(speed: number) {
        const player = this.getPlayer();
        console.log(`setSpeed(${speed})`, player)
        if (player === null) {
            return
        }

        // const isPaused = player.paused;

        // if (isPaused) {
        //     player.play();
        // }
        player.playbackRate = speed;
        // player.onloadedmetadata = function () {
        //     player.playbackRate = speed;
        // };
        // if (isPaused) {
        //     player.pause();
        // }
    }
}
