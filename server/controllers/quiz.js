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
    this.io.to(this.room).emit("updateQuiz", this.getQuizState());
  }

  getQuizState() {
    return {
      participants: this.participants,
      questions: this.questions,
      rounds: this.rounds,
    };
  }

  async getQuestion(category, difficulty) {}
}

module.exports = Quiz;
