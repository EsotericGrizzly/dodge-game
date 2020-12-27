$(document).ready(function () {
  console.log("document loaded");

  // player starting position
  var px = 235;
  var py = 220;
  var jump = 125;
  var move = 25;
  var direction = "left";

  //controls
  document.onkeydown = function (e) {
    e = e || window.event;
    console.log(e.key);

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
        direction = "down";
        py += move;
        break;
      // fine movement
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
    }
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

  //spawn
  var count = 0;
  setInterval(spawn, 500);

  function spawn() {
    ex = Math.floor(Math.random() * 500);
    $(".playground").append(`<div class="enemy" id="enemy${count}"></div>`);
    $(`#enemy${count}`).css("left", ex + "px");
    count++;
  }
  //despawn
  setTimeout(function () {
    setInterval(despawn, 500);
  }, 5500);
  first = 0;
  function despawn() {
    $(`#enemy${first}`).remove();
    first++;
  }

  // falling
  setInterval(falling, 10);

  function falling() {
    for (let i = first; i < count; i++) {
      let height = $(`#enemy${i}`).position().top;
      $(`#enemy${i}`).css("top", height + 1 + "px");
    }
  }

  //collision
  // setInterval(collision, 100);

  function collision() {
    if (ey - py > -30 && ey - py < 30 && ex - px > -30 && ex - px < 30) {
      $("#collision").css("display", "block");
      $(".enemy").css("background", "red");
    }
  }
});
