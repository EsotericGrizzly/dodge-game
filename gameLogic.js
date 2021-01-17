$(document).ready(function () {
  console.log("document loaded");

  // player starting position
  let px = 235;
  let py = 220;
  let jump = 150;
  let move = 3;
  let direction = "left";

  //new controls
  let movement = null;
  let map = {};
  let blinkCount = 0;
  let blinkRelease = true;

  const controls = () => {
    if (map[" "] && blinkRelease) {
      blinkRelease = false;
      $(".playground").append(
        `<div class="blink" id=blink${blinkCount}></div>`
      );
      let blink = $(`#blink${blinkCount}`);
      blink.css({ top: `${py + "px"}`, left: `${px + "px"}` });
      setTimeout(() => {
        blink.remove();
      }, 950);
      blinkCount++;
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
        case "upleft":
          px += -jump;
          py += -jump;
          break;
        case "upright":
          py += -jump;
          px += jump;
          break;
        case "downright":
          px += jump;
          py += jump;
          break;
        case "downleft":
          py += jump;
          px += -jump;
          break;
      }
    } else if (map.ArrowLeft && map.ArrowUp) {
      px -= move;
      py -= move;
      direction = "upleft";
    } else if (map.ArrowLeft && map.ArrowDown) {
      px -= move;
      py += move;
      direction = "downleft";
    } else if (map.ArrowRight && map.ArrowUp) {
      px += move;
      py -= move;
      direction = "upright";
    } else if (map.ArrowRight && map.ArrowDown) {
      px += move;
      py += move;
      direction = "downright";
    } else if (map.ArrowLeft || map.a) {
      px += -move;
      direction = "left";
    } else if (map.ArrowRight || map.d) {
      px += move;
      direction = "right";
    } else if (map.ArrowUp || map.w) {
      py -= move;
      direction = "up";
    } else if (map.ArrowDown || map.s) {
      py += move;
      direction = "down";
    }

    if (px < 5) {
      px = 5;
    }
    if (py < 5) {
      py = 5;
    }
    if (px > 465) {
      px = 465;
    }
    if (py > 265) {
      py = 265;
    }

    $("#character").css("left", px + "px");
    $("#character").css("top", py + "px");
  };

  onkeydown = function (e) {
    map[e.key] = e.type == "keydown";
    console.log(map);
  };

  onkeyup = function (e) {
    map[e.key] = e.type == "keydown";
    console.log(map);
    if (!map[" "]) {
      blinkRelease = true;
    }
  };

  movement = setInterval(controls, 10);

  // Game running code
  let gameStopped = true;
  let gameCount = 1;
  let enemiesPresent = [];

  function GameStart() {
    if (gameStopped == true) {
      $(".colorful")[0].innerHTML = "Let's go!";
      if (gameCount == 2) {
        movement = setInterval(controls, 10);
        for (let i = 1; i < 7; i++) {
          let life = $(`#life${i}`);
          life.removeClass("animate__animated animate__fadeOutLeft");
        };
        enemiesPresent.map(num => {
          $(`#enemy${num}`).remove();
        })        
        enemiesPresent = [];
        $("#collision").css("display", "none");
      }
      gameStopped = false;

      //spawn
      let count = 0;      
      let spawnDelay = 400;
      let spawnInterval = null;
      let speed = 1;

      function spawn() {
        if (speed !== 0) {
          ex = Math.floor(Math.random() * 500);
          if (count % 5 == 1) {
            $(".playground").append(
              `<div class="ally" id="enemy${count}"></div>`
            );
            $(`#enemy${count}`).css("left", ex + "px");
          } else {
            $(".playground").append(
              `<div class="enemy" id="enemy${count}"></div>`
            );
            $(`#enemy${count}`).css("left", ex + "px");
          }
          enemiesPresent.push(count);
          count++;
        }
      }

      spawnInterval = setInterval(spawn, spawnDelay);

      //despawn
      first = 0;
      let despawnInterval = null;

      function despawn() {
        if (enemiesPresent !== []) {
          $(`#enemy${first}`).remove();
          const index = enemiesPresent.indexOf(first);
          if (index > -1) {
            enemiesPresent.splice(index, 1);
          }
          first++;
        }
      }

      function assignInterval() {
        despawnInterval = setInterval(despawn, spawnDelay);
      }

      setTimeout(assignInterval, 5500);

      //Increasing difficulty
      function harder() {
        spawnDelay = spawnDelay - 40;

        clearInterval(spawnInterval);
        spawnInterval = setInterval(spawn, spawnDelay);

        clearInterval(despawnInterval);
        setTimeout(assignInterval, 1000);

        if (spawnDelay < 150) {
          clearInterval(hardening);
        }
      }

      let hardening = null;
      hardening = setInterval(harder, 6000);

      // enemy falling movement
      let fallingTimer = null;
      fallingTimer = setInterval(falling, 10);

      function falling() {
        for (let i = 0; i < enemiesPresent.length; i++) {
          let height = $(`#enemy${enemiesPresent[i]}`).position().top;
          $(`#enemy${enemiesPresent[i]}`).css("top", height + speed + "px");
        }
      }

      //collision
      let lives = 6;
      let score = 0;

      function newGame() {
        gameStopped = true;
        $(".colorful")[0].innerHTML = "Try again?";
        gameCount = 2;
        px = 235;
        py = 220;
      }

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
            if (currentEnemy.hasClass("enemy")) {
              currentEnemy.css("background", "red");
              let life = $(`#life${lives}`);
              life.addClass("animate__animated animate__fadeOutLeft");
              lives -= 1;                            
              // on death game stops
              if (lives == 0) {
                console.log(score);
                if (score == 0) {
                  $("#death-text").html(`Still getting the feel for it, huh? </br> Score: 0`);
                } else if (score > 0 && score < 4000) {                  
                  $("#death-text").html(`You are hired! ...as a game tester. </br> Score: ${score}`);
                } else if (score >= 4000 && score <= 8000) {   
                  $("#death-text").html(`Don’t curse the darkness, light a candle. </br> Score: ${score}`);
                } else if (score >= 8000 && score <= 10000) {   
                  $("#death-text").html(`Every experience is a lesson. Every loss is a gain. </br> Score: ${score}`);
                } else if (score >= 10000) {   
                  $("#death-text").html(`You just became someone's reason to smile. </br> Score: ${score}`);
                }                        
                console.log(score);
                $("#collision").css("display", "flex");
                speed = 0;
                clearInterval(movement);
                setTimeout(newGame, 3000);
                clearInterval(spawnInterval);
                clearInterval(hardening);
                clearInterval(despawnInterval);
                clearInterval(collisionID);
                
              } else {
                currentEnemy.addClass(
                  "animate__animated animate__fadeOutTopLeft"
                );
                enemiesPresent.splice(i, 1);
              }
            } else {
              currentEnemy.addClass(
                "animate__animated animate__fadeOutTopRight"
              );
              score += 500;
              $(".score")[0].innerHTML = `Score: ${score}`;              
              enemiesPresent.splice(i, 1);      
            }
                  
          }
        }
      }
      collisionID = setInterval(collision, 70);
    }
  }

  $(".colorful").on("click", GameStart);
});
