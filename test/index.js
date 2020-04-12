// add library supertest
const supertest = require("supertest");
// supertest will run on localhost 8080
const request = supertest("http://localhost:8080");
const app = require("../src/server");
const repository = require("../src/repository");

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
  describe("POST /notes", () => {
    it("should return status code 302 and redirect", () => {
      return request
        .post("/notes")
        .send("textField=My first note here")
        .expect(302)
        .expect("location", "/notes");
    });
    it("should display the new note on the notes page", () => {
      return request.get("/notes").expect((res) => {
        if (!res.text.includes("My first note here")) {
          throw new Error("new note not found");
        }
      });
    });
  });
  describe("DELETE /notes/:id", () => {
    let lastUrl;
    const createPost = async () => {
      //await till this post executes and sends something
      await request.post("/notes").send("textField=Will be deleted");
      const response = await request.get("/notes");
      const urls = response.text.match(/\/notes\/\d+/g);
      lastUrl = urls[urls.length - 1];
    };

    //context is same as describe but with different meaning. It's condition with which test is running
    context("When using method delete", () => {
      before(createPost);
      it("should return status 302 delete note with id and redirect", () => {
        return request.delete(lastUrl).expect(302).expect("location", "/notes");
      });
      it("should check that the note was deleted", () => {
        return request.get("/notes").expect((res) => {
          if (res.text.includes("Will be deleted")) {
            throw new Error("deleted note found");
          }
        });
      });
    });
    context("When using method post", () => {
      before(createPost);
      it("should return status 302 delete note with id and redirect", () => {
        return request
          .post(lastUrl)
          .query("_method=DELETE")
          .expect(302)
          .expect("location", "/notes");
      });
      it("should check that the note was deleted", () => {
        return request.get("/notes").expect((res) => {
          if (res.text.includes("Will be deleted")) {
            throw new Error("deleted note found");
          }
        });
      });
    });
  });
  //after all tests we need to close server
  after(() => {
    server.close();
  });
  after((callback) => repository.deleteAll(callback));
  after((callback) => repository.closeConnection(callback));
});
