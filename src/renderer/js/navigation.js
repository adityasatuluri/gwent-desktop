class NavigationManager {
    static screens = ['main-menu', 'settings-menu', 'tutorial-menu', 'multiplayer-lobby', 'deck-customization', 'game-view'];
    
    static showScreen(targetId) {
        this.screens.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            if (id === targetId) {
                el.classList.remove('hide');
                el.style.display = '';
            } else {
                el.classList.add('hide');
            }
        });
    }

    static isScreenActive(targetId) {
        const el = document.getElementById(targetId);
        return el && !el.classList.contains('hide');
    }
}
window.NavigationManager = NavigationManager;
