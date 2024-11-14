export class Player {
    static READY_FLAG = 'yts-listener';
    player: HTMLVideoElement | null = null;

    constructor(private speed: number) {
        this.setSpeed(this.speed);
    }

    getPlayer(): HTMLVideoElement | null {
        if (!this.player) {
            this.player = document.querySelector('.html5-main-video');
            if (this.player) {
                this.initEvent(this.player);
            }
        }
        return this.player;
    }

    initEvent(player: HTMLVideoElement) {
        if (!player.getAttribute(Player.READY_FLAG)) {
            player.addEventListener('ratechange', this.checkPlayerSpeed.bind(this));
            player.setAttribute(Player.READY_FLAG, 'ready');
        }
    }

    checkPlayerSpeed() {
        const player = this.getPlayer();
        if (player && Math.abs(player.playbackRate - this.speed) > 0.01) {
            player.playbackRate = this.speed;
            setTimeout(this.checkPlayerSpeed.bind(this), 200);
        }
    }

    setSpeed(speed: number) {
        this.speed = speed;
        const player = this.getPlayer();
        if (player !== null) {
            player.playbackRate = speed;
        }
    }
}
