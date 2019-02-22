'use strict';

const template = require('../../routes/template.js');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

// these are broken rip

describe('Tests GET', function () {
    it('verifies successful response', (done) => {
        const result = chai.request(template)
        .get('/')
        .end((err, res) => {
            res.should.be.a('object');
            res.should.have.status(200);
            res.body.to.be.a('string');
    
            let response = JSON.parse(result.body);
    
            response.to.be.an('object');
            response.message.to.be.equal("This is the get route");
            done();
        });
    });
});

describe('Tests post handler', function () {
    it('verifies successful response', (done) => {
        const result = chai.request(template)
        .post('/')
        .end((err, res) => {
            res.should.be.a('object');
            res.should.have.status(200);
            res.body.should.be.a('string');
            
            let response = JSON.parse(result.body);

            response.to.be.an('object');
            response.message.to.be.equal("This is the post route");
            done();
        });
    });
});
