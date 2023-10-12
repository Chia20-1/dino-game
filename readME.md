# A simple game of running and jumping obstacles.

Features for the game to operate:
<ul>
  <li>A t-rex character that can jump over obstacles by pressing the space bar. A sound effect should be played when the t-rex jumps.</li>
  <li>The jump animation should be smooth and natural. Bonus if you can include the gravity effect.</li>
  <li>A moving ground and obstacles. The ground and obstacles should scroll endlessly to the left and the obstacles should be randomly generated.</li>
  <li>A score counter that tracks the score of the player. The score should increase gradually as long as the game is running.</li>
  <li>For every 100 points scored, a sound effect should play and the speed of the ground and obstacles should increase slowly.</li>
  <li>When the t-rex character collides with an obstacle, a sound effect should play and the game should end.</li>
</ul>


Tips
--

Handling game area within a div (Visual / What you see aspects)
1. You have the div.ground including div.cactus so that the whole thing is considered one entity where you only need to code the animation scrolling to the right once.

2. What are the animations included in the game?
- Dino jump
- Ground

Using JavaScript on functionality. So what' you see is still CSS, but having the game understand the "bottom list" is the logic part.

Personal Quickbite Notes:
1. The game state: Game / Game Over

2. Check if dino collide with cactus: 
A) Using getBoundingClientRect() to find out the element's position in User's viewport
B) If Dino element & Cactus element overlap, that means game over.

What are the Game Logics that needs to be implemented:

// Before the game start
- Listen for keyboard action
- Start the game

// After the game start
- Jump dino when space bar is pressed.
- Listen for collision between dino and cactus
- If there is a collision, make the game end.
- If there is no collision, update the score and generate obstacle

// Game ends (Game Over)