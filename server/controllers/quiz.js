const fetch = require("node-fetch");

class Quiz {
  participants = [];
  room = "";
  questions = "";
  rounds = "";
  io = null;
  sockets = [];
  questionHasBeenAnswered = false;
  correctReward = 10;
  incorrectPunishment = 5;
  __startingQuestions__ = "";
  timeout = null;
  timeLimit = 1000 * 15;
  pause = 1000 * 2;

  constructor(io, sockets, participants, room, questions, rounds) {
    this.io = io;
    this.sockets = sockets;
    this.participants = participants;
    this.room = room;
    this.questions = questions;
    this.rounds = rounds;
    this.__startingQuestions__ = questions;
  }

  async start() {
    let quizStarted = false;
    for (const socket of this.sockets) {
      socket.on("readyToStartQuiz", () => {
        socket.readyToStartQuiz = true;
        let allReady = true;
        for (const sock of this.sockets) {
          if (!sock.readyToStartQuiz) {
            allReady = false;
          }
        }
        if (allReady) {
          this.beginQuiz();
          quizStarted = true;
        }
        const startAnyway = () => {
          if (!quizStarted) {
            this.beginQuiz();
          }
        };
        setTimeout(startAnyway, 1000 * 8);
      });
      socket.emit("confirmReadyToStartQuiz");
    }
  }

  async beginQuiz() {
    for (const socket of this.sockets) {
      socket.removeAllListeners("readyToStartQuiz");
      socket.on("respondToQuestion", ({ question, response }) =>
        this.handleResponse(socket.nickname, question, response)
      );
    }
    await this.io.to(this.room).emit("updateQuiz", this.getQuizState());
    this.askNextQuestion();
  }

  async askNextQuestion() {
    this.questions--;
    if (this.questions < 0) {
      if (this.rounds > 0) {
        return this.nextRound();
      } else {
        return this.endQuiz();
      }
    }
    const question = await this.getQuestion();
    if (!question) {
      return this.endQuiz();
    }
    this.questionHasBeenAnswered = false;
    for (const participant of this.participants) {
      participant.hasResponded = false;
    }
    await this.io.to(this.room).emit("askQuestion", {
      quizState: this.getQuizState(),
      question,
      timeLimit: this.timeLimit,
    });
    this.timeout = setTimeout(() => this.askNextQuestion(), this.timeLimit);
  }

  handleResponse(nickname, question, response) {
    if (this.questionHasBeenAnswered) return;
    const responder = this.participants.find(
      participant => participant.nickname === nickname
    );
    responder.hasResponded = true;
    const correct = question.question.correct_answer === response;
    if (correct) {
      clearTimeout(this.timeout);
      this.questionHasBeenAnswered = true;
      responder.score += this.correctReward;
      setTimeout(() => this.askNextQuestion(), this.pause);
    } else {
      responder.score -= this.incorrectPunishment;
      let allResponded = true;
      for (const participant of this.participants) {
        if (!participant.hasResponded) {
          allResponded = false;
        }
      }
      if (allResponded) {
        setTimeout(() => this.askNextQuestion(), this.pause);
      }
    }
    this.io.to(this.room).emit("updateQuiz", this.getQuizState());
  }

  getQuizState() {
    return {
      participants: this.participants,
      questions: this.questions,
      rounds: this.rounds,
      room: this.room,
      questionHasBeenAnswered: this.questionHasBeenAnswered,
    };
  }

  async getQuestion() {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=1&encode=base64"
    );
    const parsed = await response.json();
    return parsed.results[0];
  }

  nextRound() {}

  endQuiz() {
    for (const socket of this.sockets) {
      socket.removeAllListeners("readyToStartQuiz");
      socket.removeAllListeners("respondToQuestion");
    }
  }
}

module.exports = Quiz;
