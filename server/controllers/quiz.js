const fetch = require("node-fetch");

class Quiz {
  io = null;
  sockets = [];
  participants = [];
  room = "";
  __startingQuestions__ = "";
  __startingRounds__ = "";
  questionsRemaining = "";
  roundsRemaining = "";
  questionHasBeenAnswered = false;
  correctReward = 10;
  incorrectPunishment = 5;
  timeout = null;
  timeLimit = 1000 * 15;
  pause = 1000 * 2;
  roundBreak = 1000 * 15;

  constructor(
    io,
    sockets,
    participants,
    room,
    questions,
    rounds,
    timeLimit,
    roundBreak
  ) {
    this.io = io;
    this.sockets = sockets;
    this.participants = participants;
    this.room = room;
    this.__startingQuestions__ = parseInt(questions);
    this.__startingRounds__ = parseInt(rounds);
    this.questionsRemaining = this.__startingQuestions__;
    this.roundsRemaining = this.__startingRounds__;
    this.timeLimit = parseInt(timeLimit) * 1000;
    this.roundBreak = parseInt(roundBreak) * 1000;
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
    this.nextRound();
  }

  async askNextQuestion() {
    this.questionsRemaining--;
    if (this.questionsRemaining < 0) {
      if (this.roundsRemaining > 0) {
        this.questionsRemaining = this.__startingQuestions__;
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
    await this.sendQuestion(question, this.timeLimit, this.getQuizState());
    this.timeout = setTimeout(() => this.askNextQuestion(), this.timeLimit);
  }

  async sendQuestion(question, timeLimit, quizState) {
    await this.io.to(this.room).emit("askQuestion", {
      question,
      timeLimit,
      quizState,
    });
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
        clearTimeout(this.timeout);
        setTimeout(() => this.askNextQuestion(), this.pause);
      }
    }
    this.io.to(this.room).emit("updateQuiz", this.getQuizState());
  }

  getQuizState() {
    return {
      participants: this.participants,
      questions: this.questionsRemaining,
      rounds: this.roundsRemaining,
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

  async nextRound() {
    clearTimeout(this.timeout);
    if (this.roundsRemaining < this.__startingRounds__) {
      await this.sendQuestion(
        {
          question: Buffer.from("Next round starting soon").toString("base64"),
        },
        this.roundBreak,
        this.getQuizState()
      );
      this.timeout = setTimeout(() => this.askNextQuestion(), this.roundBreak);
    } else {
      this.timeout = setTimeout(() => this.askNextQuestion(), this.pause);
    }
    this.roundsRemaining--;
  }

  async endQuiz() {
    clearTimeout(this.timeout);
    this.questionsRemaining = 0;
    this.roundsRemaining = 0;
    await this.sendQuestion(
      {
        question: Buffer.from("Quiz Finished").toString("base64"),
      },
      0,
      this.getQuizState()
    );
    for (const socket of this.sockets) {
      socket.removeAllListeners("readyToStartQuiz");
      socket.removeAllListeners("respondToQuestion");
    }
  }
}

module.exports = Quiz;
