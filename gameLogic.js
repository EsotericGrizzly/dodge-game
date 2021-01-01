$(document).ready(function () {
  console.log("document loaded");

  // player starting position
  var px = 235;
  var py = 220;
  var jump = 125;
  var move = 40;
  var direction = "left";

  //controls
  document.onkeydown = function (e) {
    e = e || window.event;

    switch (e.key) {
      //basic movement
      case "ArrowLeft":
      case "a":
        direction = "left";
        px += -move;
        break;
      case "ArrowUp":
      case "w":
        direction = "up";
        py += -move;
        break;
      case "ArrowRight":
      case "d":
        direction = "right";
        px += move;
        break;
      case "ArrowDown":
      case "s":
        e.preventDefault();
        direction = "down";
        py += move;
        break;
      // presize movement
      case "q":
        direction = "left";
        px += -move / 4;
        break;
      case "e":
        direction = "right";
        px += move / 4;
        break;
      //jumping
      case " ":
        e.preventDefault();
        switch (direction) {
          case "left":
            px += -jump;
            break;
          case "up":
            py += -jump;
            break;
          case "right":
            px += jump;
            break;
          case "down":
            py += jump;
            break;
        }
    };
    //borders
    if (px < 10) {
      px = 5;
    }
    if (py < 10) {
      py = 5;
    }
    if (px > 460) {
      px = 465;
    }
    if (py > 265) {
      py = 265;
    }
    $(".character").css("left", px + "px");
    $(".character").css("top", py + "px");
  };

  // enemy code
  var speed = 1;

  //spawn
  var count = 0;
  var enemiesPresent = [];
  var spawnDelay = 400;
  var spawnInterval = null;

  function spawn() {
    ex = Math.floor(Math.random() * 500);
    $(".playground").append(`<div class="enemy" id="enemy${count}"></div>`);
    $(`#enemy${count}`).css("left", ex + "px");
    enemiesPresent.push(count);
    count++;
  };

  spawnInterval = setInterval(spawn, spawnDelay);

  //despawn
  first = 0;
  var despawnInterval = null;

  function despawn() {
    $(`#enemy${first}`).remove();
    const index = enemiesPresent.indexOf(first);
    if (index > -1) {
      enemiesPresent.splice(index, 1);
    }
    first++;
  };

  function assignInterval() {
    despawnInterval = setInterval(despawn, spawnDelay);
  };
  
  setTimeout(assignInterval, 5500);

  //Increasing difficulty
  function harder() {            
      spawnDelay = spawnDelay - 40;
      console.log(spawnDelay);

      clearInterval(spawnInterval);
      spawnInterval = setInterval(spawn, spawnDelay);

      clearInterval(despawnInterval);
      setTimeout(assignInterval, 1000);
    
    if (spawnDelay < 150) {
      clearInterval(hardening);
      // break;
    }
    
  };
  var hardening = null
  hardening = setInterval(harder, 6000);

  // enemy falling movement
  var fallingTimer = null;
  fallingTimer = setInterval(falling, 10);

  function falling() {
    for (let i = 0; i < enemiesPresent.length; i++) {
      let height = $(`#enemy${enemiesPresent[i]}`).position().top;
      $(`#enemy${enemiesPresent[i]}`).css("top", height + speed + "px");
    }
  }

  //collision
  let lives = 6;

  function collision() {
    for (let i = 0; i < enemiesPresent.length; i++) {
      let currentEnemy = $(`#enemy${enemiesPresent[i]}`);
      let currentEx = currentEnemy.css("left").slice(0, -2);
      let currentEy = currentEnemy.css("top").slice(0, -2);
      if (
        currentEy - py > -30 &&
        currentEy - py < 30 &&
        currentEx - px > -30 &&
        currentEx - px < 30
      ) {
        // $("#collision").css("display", "block");
        currentEnemy.css("background", "red");
        currentEnemy.addClass(
          "animate__animated animate__fadeOutTopLeft"
        );
        enemiesPresent.splice(i, 1);
        let life = $(`#life${lives}`);
        life.addClass("animate__animated animate__fadeOutLeft");
        lives -= 1;
      }
    }
  }

  setInterval(collision, 100);

  
});
