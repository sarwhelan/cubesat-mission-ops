let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Queue', () => {
    beforeEach((done) => {
        // Remove the queue.json from ext location
        done();
    });

    /*
    * Test queue GET.
    */
   describe('GET /queue', () => {
       it('it should get current queue', (done) => {
           chai.request(server)
            .get('/queue')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                //res.body.length.should.be.eql()
                done();
            });
       });
   });
   
   /*
   * Test queue POST.
   */
  describe('POST /queue', () => {
      it('it should not post without batch', (done) => {
          let updateQueue = {
              id: 1,
              component:"blah",
              command: "Q",
              name: "fake name",
              defaultPriorityLevel: false,
              bandwidthUsage: 0.5,
              powerConsumption: 0.9
          };
          chai.request(server)
            .post('/queue')
            .send(JSON.stringify(updateQueue))
            .end((err, res) => {
                //res.should.have.status()
                //res.body.should.be.a('object)
                //res.body.should.have.property('errors)
                //res.body.errors.should.have.property('batch')
                done();
            });
      });

      it('it should post with valid batch', (done) => {
        let updateQueue = {
            batch:[
                {
                    id:1,
                    component:"blah",
                    command:"A",
                    name:"example name",
                    defaultPriorityLevel:true,
                    bandwidthUsage:0.5,
                    powerConsumption:0.9
                },
                {
                    id:2,
                    component:"boop",
                    command:"B",
                    name:"hola",
                    defaultPriorityLevel:true,
                    bandwidthUsage:0.5,
                    powerConsumption:0.9
                }
            ]
        };
        chai.request(server)
        .post('/queue')
        .send(JSON.stringify(updateQueue))
        .end((err, res) => {
            //res.should.have.status()
            //res.body.should.be.a('object)
            //res.body.should.have.property('message')
            //res.body.batch.should.have.property('....)
            //........
            done();
        });
      });
  });
});