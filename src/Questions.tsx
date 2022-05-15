import React from 'react'
import styled from 'styled-components';
import { Answer } from './App';


const Wrapper = styled.div`
  max-width: 1100px;
  background: #ebfeff;
  border-radius: 10px;
  border: 2px solid #0085a3;
  padding: 20px;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.25);
  text-align: center;
  p {
    font-size: 1rem;
    color: black;
    font-weight:bold
  }
`;

interface ButtonWrapperProps {
  correct: boolean;
  clicked: boolean;
}

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  transition: all 0.3s ease;
  :hover {
    opacity: 0.8;
  }
  button {
    cursor: pointer;
    user-select: none;
    font-size: 0.8rem;
    width: 100%;
    height: 40px;
    margin: 5px 0;
    background: ${
      ({ correct, clicked }) =>
      correct
        ? 'linear-gradient(90deg, #56FFA4, #59BC86)'
        : !correct && clicked
        ? 'linear-gradient(90deg, #FF5656, #C16868)'
        : 'linear-gradient(90deg, #56ccff, #6eafb4)'
    };
    border: 3px solid #ffffff;
    box-shadow: 1px 2px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    color: #fff;
    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.25);
  }
`;

interface Props {
  question: string;
  answers: string[];
  checkAnswer: (e: React.MouseEvent<HTMLButtonElement>) => void;
  userAnswer: Answer | undefined;
  questionNr: number;
}


const Questions : React.FC<Props> = ({
  question,
  answers,
  checkAnswer,
  userAnswer,
  questionNr,
}) => {

  console.log(question)
  return (
    <Wrapper>
      <p className='number'>Question: {questionNr} / 15</p>
      <p>{question}</p>
      {answers && answers.map((answer) => (
        <ButtonWrapper
          key={answer}
          correct={userAnswer?.correctAnswer === answer}
          clicked={userAnswer?.answer === answer}
        >
          <button disabled={userAnswer ? true : false} value={answer} onClick={checkAnswer}>
            <span>{answer}</span>
          </button>
        </ButtonWrapper>
      ))}
    </Wrapper>
  )
}

export default Questions