import React from 'react';
import { RetroGrid } from "../components/magicui/retro-grid";

const About: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <RetroGrid />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">About Guess The Number</h1>
        
        <div className="max-w-3xl mx-auto bg-black/50 p-6 rounded-lg backdrop-blur-sm">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">About the Game</h2>
            <p className="text-gray-300 mb-4">
              Guess The Number is a classic game that challenges your logical thinking and number sense.
              The game generates a random number, and your goal is to guess it within the fewest attempts possible.
            </p>
            <p className="text-gray-300">
              Each time you make a guess, the game will tell you if your guess is too high or too low,
              helping you narrow down the correct number. The fewer attempts you take, the higher your score!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">How to Play</h2>
            <ol className="list-decimal list-inside text-gray-300 space-y-2">
              <li>Start a new game by clicking the "Play" button on the home page</li>
              <li>The game will generate a random number between 1 and 100</li>
              <li>Enter your guess in the input field</li>
              <li>The game will tell you if your guess is too high or too low</li>
              <li>Keep guessing until you find the correct number</li>
              <li>Try to guess the number in as few attempts as possible</li>
              <li>Your score will be based on the number of attempts you take</li>
              <li>You can view the leaderboard to see how you compare to other players</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About; 