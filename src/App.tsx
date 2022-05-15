import React, {useState} from 'react';
import './App.css';
import axios from 'axios'
import Questions from './Questions'


interface Question {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

interface QuestionsState extends Question{
  answers: string[];
} 

enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface Answer {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const shuffleArray = (array: any[]) =>
  [...array].sort(() => Math.random() - 0.5);

const App : React.FC = () => {

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Answer[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [show, setShow] = useState(false)

  const startQuiz = async (amount: number, difficulty: Difficulty) => {
    setLoading(true);
    setGameOver(false);
    
    await axios
    .get(`https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&type=multiple`)
    .then(res => {
      const Questions = res.data.results.map((question: Question) => ({
        ...question,
        answers: shuffleArray([...question.incorrect_answers, question.correct_answer])
      }))
      setQuestions(Questions)
    })
    .catch(err => console.log(err.message))

    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  };
  
  const checkAnswer = (e: any) => {
    if (!gameOver) {
      // User's answer
      const answer = e.currentTarget.value;
      // Check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      // Add score if answer is correct
      if (correct) setScore((prev) => prev + 1);
      // Save the answer in the array for user answers
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  };

  const nextQuestion = () => {
    // Move on to the next question if not the last question
    const nextQ = number + 1;

    if (nextQ === 15) {
      setGameOver(true);
    } else {
      setNumber(nextQ);
    }
  };

  console.log(questions)

  return (
    <div className='App'>
      <h1>QUIZ APP</h1>
      {(gameOver || userAnswers.length === 15) && 
        (
        <button className='start' onClick={() => setShow(true)}>
          Start
        </button>
        )}
      {show && 
        <div>
          <button 
          type="button" 
          className="btn btn-success" 
          style={{marginRight: '20px'}}
          onClick={() => {startQuiz(15, Difficulty.EASY); setShow(false)}}
          >Easy</button>
          <button 
          type="button" 
          className="btn btn-warning" 
          style={{marginRight: '20px'}}
          onClick={() => {startQuiz(15, Difficulty.MEDIUM); setShow(false)}}
          >Medium</button>
          <button 
          type="button" 
          className="btn btn-danger"
          onClick={() => {startQuiz(15, Difficulty.HARD); setShow(false)}}
          >Hard</button>
        </div>
      }
      {!gameOver && <p className='score'>Score: {score}</p>}
      {loading && <p>Loading...</p> }
      {!loading && !gameOver && 
      (
        <Questions
        questionNr={number + 1}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        checkAnswer={checkAnswer}
        />
      )}
      {!gameOver && !loading && userAnswers.length === number + 1 && number !== 14 &&
      (
        <button className='next' onClick={nextQuestion}>Next</button>
      )}
    </div>
)}

export default App;
