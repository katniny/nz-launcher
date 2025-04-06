// just not necessary to have in prod
window.addEventListener("DOMContentLoaded", () => {
    eel.is_dev_mode()().then(isDev => {
        if (!isDev) {
            window.addEventListener("contextmenu", e => e.preventDefault());
            console.log("Production mode is enabled.");
        } else {
            console.log("Development mode is enabled.");
        }
    });
});