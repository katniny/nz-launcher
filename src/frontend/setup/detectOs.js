export async function detectOS() {
    return new Promise((resolve) => {
        let os = localStorage.setItem("os", window.system.platform);
        let arch = localStorage.setItem("arch", window.system.arch);
        resolve(os, arch);
    });
}