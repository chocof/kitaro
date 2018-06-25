const expect = require('chai').expect;
const { Kitaro, RemoteKitaro } = require('../lib');
const sinon = require('sinon');

describe("---- Kitaro ----", () => {
  let kitaro;

  it("Should create a new Kitaro", done => {
    kitaro = new Kitaro("myKitaro", 4334);
    expect(kitaro).to.be.an('Object');
    done();
  });

  it("Should bind to specific port", done => {
    kitaro.listen()
    .then((r) => {
      expect(r).to.be.an('Object');
      done();
    })
    .catch((err) => {
      expect(err).to.not.exist;
    })
  });

  it("Should add new functions", done => {
    expect(kitaro.addFunction("myFunction",
     () => true,)).to.not.throw;
    done();
  });

  it("Should close the connection", done => {
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

  before( done => {
    new Kitaro("myKitaro", 3226).listen()
      .then((me) => {
        me.addFunction('myFunction', () => true,);
        me.addFunction('negate', b => -b,);
        me.addFunction('sum3', (a, b, c) => a + b + c,);
        kitaro = me;
        done();
      });
  })

  after(() => {
    kitaro.close();
  })

  it("Should create a new Remote Kitaro", done => {
    remote = new RemoteKitaro("127.0.0.1", 3226);
    expect(remote).to.be.an("Object");
    done();
  });

  it("Should register to the Remote Kitaro", done => {
    remote.connect()
      .then(r => {
        expect(r).to.be.an('array').that.is.not.empty;
        expect(r).to.deep.include({label: "myFunction", returns: "function"});
        done();
      })
  })

  it("Should execute remote function without params", done => {
    remote.exec.myFunction()
      .then(r => {
        expect(r).to.be.true;
        done();
      })
  })

  it("Should execute remote function with one param", done => {
    remote.exec.negate(5)
      .then(r => {
        expect(r).to.equal(-5);
        done();
      })
  })

  it("Should execute remote function with multiple params", done => {
    remote.exec.sum3(1,2,5)
      .then(r => {
        expect(r).to.equal(8);
        done();
      })
  })

  it("Should close the Remote Kitaro", done => {
    remote.close()
      .then(r => {
        done();
      })
      .catch((err) => {
        expect(err).to.not.exist;
      })
  });

});