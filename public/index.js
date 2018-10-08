(function(){
    window.addEventListener('DOMContentLoaded', () => {
        const canv = document.body.querySelector('.snake-game');
        new SnakeGame(canv);    
    });
})();