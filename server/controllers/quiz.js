const fetch = require("node-fetch");

class Quiz {
  participants = [];
  room = "";
  questions = "";
  rounds = "";
  io = null;
  sockets = [];

  constructor(io, sockets, participants, room, questions, rounds) {
    this.io = io;
    this.sockets = sockets;
    this.participants = participants;
    this.room = room;
    this.questions = questions;
    this.rounds = rounds;
  }

  async Start() {
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
          this.BeginQuiz();
          quizStarted = true;
        }
        const startAnyway = () => {
          if (!quizStarted) {
            this.BeginQuiz();
          }
        };
        setTimeout(startAnyway, 5000);
      });
      socket.emit("confirmReadyToStartQuiz");
    }
  }

  async BeginQuiz() {
    for (const socket of this.sockets) {
      socket.removeAllListeners("readyToStartQuiz");
    }
    await this.io.to(this.room).emit("updateQuiz", this.getQuizState());
    const question = await this.getQuestion();
    if (!question) {
      return Quit();
    }
    await this.io.to(this.room).emit("askQuestion", question);
  }

  getQuizState() {
    return {
      participants: this.participants,
      questions: this.questions,
      rounds: this.rounds,
    };
  }

  async getQuestion() {
    const response = await fetch("https://opentdb.com/api.php?amount=1");
    const parsed = await response.json();
    return parsed.results[0];
  }

  Quit() {}
}

module.exports = Quiz;
