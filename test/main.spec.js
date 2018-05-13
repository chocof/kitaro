const expect = require('chai').expect;
const {Kitaro, RemoteKitaro} = require('../lib');

describe("---- Kitaro ----", () => {
  let kitaro;

  it("Should create a new Kitaro", (done) => {
    kitaro = new Kitaro("myKitaro", 4334);
    expect(kitaro).to.be.an('Object');
    done();
  });

  it("Should bind to specific port", (done) => {
    kitaro.listen()
    .then((r) => {
      expect(r).to.be.an('Object')
      done();
    })
    .catch((err) => {
      expect(err).to.not.exist;
    })
  });

  it("Should add new functions", (done) => {
    expect(kitaro.addFunction("myFunction",
     () => true,))
      .to.not.throw
    done();
  });

  it("Should close the connection", (done) => {
    kitaro.close()
    .then(r => {
      done();
    })
    .catch((err) => {
      expect(err).to.not.exist;
    })
  })

});


describe("---- Remote Kitaro ----", () => {
  let kitaro;
  let remote;

  before( (done) => {
    new Kitaro("myKitaro", 3226).listen()
      .then((me) => {
        me.addFunction('myFunction', () => true,);
        kitaro = me
        done();
      });
  })

  after(() => {
    kitaro.close();
  })

  it("Should create a new Remote Kitaro", (done) => {
    remote = new RemoteKitaro("127.0.0.1", 3226);
    expect(remote).to.be.an("Object");
    done();
  });

  it("Should register to the Remote Kitaro", (done) => {
    remote.connect()
      .then(r => {
        console.log(r)
        done();
      })
  })

  it("Should close the Remote Kitaro", (done) => {
    remote.close()
      .then(r => {
        done();
      })
      .catch((err) => {
        expect(err).to.not.exist;
      })
  });

});