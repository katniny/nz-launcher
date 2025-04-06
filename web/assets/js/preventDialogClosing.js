// we dont want dialogs being closed with ESC
// so we override default behavior
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.querySelectorAll("dialog").forEach(dialog => {
            if (dialog.open) {
                e.preventDefault();
            }
        });
    }
});