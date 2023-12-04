import {AppController} from './controllers/AppController';

const app = new AppController();

async function init() {
    const ok = await app.initApp();

    if (!ok) {
        window.setTimeout(init, 2000);
    }
}

document.addEventListener('spfdone', init);

init();
