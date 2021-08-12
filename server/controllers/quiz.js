class Quiz {
  sockets = [];
  room = "";
  questions = 5;
  rounds = 2;

  constructor(sockets, room, questions, rounds) {
    this.sockets = sockets;
    this.room = room;
    this.questions = questions;
    this.rounds = rounds;
  }

  async Start() {
    console.log(this);
  }
}

module.exports = Quiz;
