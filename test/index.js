// add library supertest
const supertest = require("supertest");
// supertest will run on localhost 8080
const request = supertest("http://localhost:8080");
const app = require("../src/server");

let server;

describe("HTTP API", () => {
  //make before tests
  before((next) => {
    //we write "next" so our server will run first and only after that the next function will be executed(start tests)
    server = app.listen(8080, next);
    // 8080 is a port on which we will listen
    // app listen returns object http server that we need to save in variable "server" to be able to close server later(in after tests)
  });

  //start tests
  describe("GET /notes", () => {
    it("should return status code 200", () => {
      return request
        .get("/notes")
        .expect(200)
        .expect("Content-Type", /html/) //check if responce has html file
        .expect((res) => {
          // function that takes responce and check if it contains string Notes.
          if (!res.text.includes("Notes")) {
            throw new Error("Invalid body");
          }
        });
    });
  });

  //after all tests we need to close server
  after(() => {
    server.close();
  });
});
