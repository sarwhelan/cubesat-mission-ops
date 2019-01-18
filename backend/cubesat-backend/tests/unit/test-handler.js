'use strict';

const template = require('../../template.js');
const chai = require('chai');
const expect = chai.expect;
var event, context;


describe('Tests get handler', function () {
    it('verifies successful response', async () => {
        const result = await template.getHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("This is the get route");
    });
});

describe('Tests post handler', function () {
    it('verifies successful response', async () => {
        const result = await template.postHandler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("This is the post route");
    });
});
