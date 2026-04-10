import Phaser from 'phaser';

// Configuración básica para validar la arquitectura
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container', // Debe coincidir con el ID en tu index.html
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
        create: function() {
            // Si ves este texto, el GT-01 es un éxito total
            this.add.text(512, 384, 'GRID TACTICS: SISTEMA INICIALIZADO', {
                fontSize: '32px',
                fill: '#ffffff'
            }).setOrigin(0.5);
            
            console.log("👾 Log: Phaser funcionando y arquitectura validada.");
        }
    }
};

new Phaser.Game(config);