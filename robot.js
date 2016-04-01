var firstMasterStep = true;
var firstCloneStep = true;

function Robot(robot) {
  robot.clone();
}

var isMaster = function(robot) {
  return (robot.parentId == null);
}

var moveMaster = function(ev) {
  var robot = ev.robot;
  robot.turn(20);
  robot.ahead(randomBetween(110));
  robot.rotateCannon(-360);
  robot.ahead(randomBetween());
}

var moveClone = function(ev) {
  var robot = ev.robot;
  robot.turn(10);
  robot.ahead(randomBetween(190));
  robot.rotateCannon(-360);
  robot.back(randomBetween());
}

/**
 * Is this robot part of our team?
 */
function isMember(master, clone) {
  var firstOperand = master.parentId == clone.id;
  var secondOperand = master.id == clone.parentId;
  return firstOperand || secondOperand;
};

/** 
 * Random number betweeen 100 and 200
 */
function randomBetween(number)  {
  return Math.floor(Math.random() * (number || 200)) + 100;
}

function doMasterFirstStep(robot) {
  robot.rotateCannon(180);
  firstMasterStep = false;
}

function doCloneFirstStep(robot) {
  robot.turn(-10);
  robot.back(randomBetween(100));
  robot.rotateCannon(180);
  firstCloneStep = false;
}

Robot.prototype.onIdle = function(ev) {
  var robot = ev.robot;
  if (isMaster(robot)) {
    if (firstMasterStep) doMasterFirstStep(robot);
    moveMaster(ev);
  } else {
    if (firstCloneStep) doCloneFirstStep(robot);
    moveClone(ev);
  }
};

Robot.prototype.onRobotCollision = function(ev) {
  var robot = ev.robot;
  if (!isMember(ev.robot, ev.collidedRobot)) {
    var enemy = ev.collidedRobot;
    if (enemy.life < robot.life) {
      robot.rotateCannon(ev.bearing);
      robot.fire();
    } else {
      robot.turn(20);
      robot.ahead(100); // trying to run away}
    }
  } else {
    if (isMaster(robot)) {
      robot.turn(15);
      robot.ahead(60);
    } else {
      robot.turn(-15);
      robot.back(30);
    }
  }
};

Robot.prototype.onWallCollision = function(ev) {
  var robot = ev.robot;
  robot.turn(ev.bearing);
  robot.ahead(60);
};

Robot.prototype.onScannedRobot = function(ev) {

  if (isMember(ev.robot, ev.scannedRobot)) {
    return; // Don't shoot our clone or master robot
  }

  var robot = ev.robot;
  for (var i = 0; i < 100; i++) {
    robot.fire();
  }
};

Robot.prototype.onHitByBullet = function(ev) {
  var robot = ev.robot;
  if (robot.life < 50) robot.disappear();
  robot.turn(30 - ev.bulletBearing);
  robot.ahead(randomBetween(190));
};
