document.addEventListener('DOMContentLoaded', () => {
   const startButton = document.querySelector('#start-btn');
   const gameNode = document.querySelector('#game-container');
   const timeElem = document.querySelector('#time');
   const scoreElem = document.querySelector('#score');
   const screens = document.querySelectorAll('.screen');
   const chooseSweetBtns = document.querySelectorAll('.choose-sweet-btn');
   const highScoreElem = document.querySelector('#high-score');

   let intervalId;

   const gameData = {
      seconds: 0,
      score: 0,
      selectedSweet: {},
      highScore: parseInt(localStorage.getItem('highScore')) || 0,
   };

   highScoreElem.textContent = `Лучший счёт: ${gameData.highScore}`;

   startButton.addEventListener('click', () => {
      toggleScreen(screens[0], screens[1]);
   });

   chooseSweetBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
         gameData.selectedSweet.src = btn.querySelector('img').getAttribute('src');
         toggleScreen(screens[1], screens[2]);
         startGame();
      });
   });

   function toggleScreen(screenToHide, screenToShow) {
      screenToHide.classList.remove('visible');
      screenToShow.classList.add('visible');
   }

   function startGame() {
      gameData.seconds = 0;
      gameData.score = 0;
      updateScore();
      updateTimer();
      clearInterval(intervalId);
      intervalId = setInterval(updateTimer, 1000);
      createSweet();
   }

   function updateTimer() {
      timeElem.innerHTML = `Время: ${gameData.seconds++}s`;
   }

   function createSweet() {
      const sweet = document.createElement('img');
      const { x, y } = getRandomLocation();
      sweet.src = gameData.selectedSweet.src;
      sweet.classList.add('sweet');
      sweet.style.cssText = `position: absolute; top: ${y}px; left: ${x}px; transform: rotate(${
         Math.random() * 360
      }deg);`;
      sweet.addEventListener('click', catchSweet);
      gameNode.appendChild(sweet);
   }

   function getRandomLocation() {
      const gameRect = gameNode.getBoundingClientRect();
      return {
         x: Math.random() * (gameRect.width - 100),
         y: Math.random() * (gameRect.height - 100),
      };
   }

   function catchSweet() {
      playBiteSound();
      gameData.score++;
      updateScore();
      this.remove();
      setTimeout(createSweet, 1000);
   }

   function playBiteSound() {
      const audio = document.querySelector('#bite');
      audio.play();
   }

   function updateScore() {
      scoreElem.innerHTML = `Счёт: ${gameData.score}`;
      saveHighScore();
      if (gameData.score >= 50) endGame();
   }

   function endGame() {
      clearInterval(intervalId);
      toggleScreen(screens[2], screens[0]);
      alert(`Игра окончена! Ваш счёт: ${gameData.score}`);
      saveHighScore(true);
   }

   function saveHighScore(force = false) {
      if (force || gameData.score > gameData.highScore) {
         localStorage.setItem('highScore', gameData.score);
         highScoreElem.textContent = `Лучший счёт: ${gameData.score}`;
      }
   }
});
