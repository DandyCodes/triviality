import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser($nickname: String!, $email: String!, $password: String!) {
    addUser(nickname: $nickname, email: $email, password: $password) {
      token
      user {
        _id
        nickname
      }
    }
  }
`;

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        nickname
      }
    }
  }
`;

export const REQUEST_TO_BEGIN_QUIZ = gql`
  mutation requestToBeginQuiz($questions: Int!, $rounds: Int!) {
    requestToBeginQuiz(questions: $questions, rounds: $rounds)
  }
`;
