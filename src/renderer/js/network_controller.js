class NetworkController {
    constructor(player) {
        this.player = player;
    }

    async startTurn(player) {
        // Wait for network event to execute action
        ui.popup(null, null, null, null, "OPPONENT'S TURN", "Waiting for opponent...");
        // the actual action execution will be driven from handleNetworkMessage in multiplayer.js
    }
}
window.NetworkController = NetworkController;
