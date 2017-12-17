let mongoose = require("mongoose");
let Event = require('../../../api/models/Event');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let should = chai.should();

let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWYwMDM4ODkwN2IzNzA0YjRjNDYxZmQiLCJpc3MiOiJZb3VyVGFibGUiLCJpYXQiOjE1MDg5MDE3OTl9.ot_1psqlXEdsaG64zgigJz3DWJYKS-n-QEd-9INz1Mg';

chai.use(chaiHttp);

describe('Events Search', () => {
	
	describe('/GET /events', () => {
	it('update one event title to TORONTO', (done) => {
		chai.request(server)
		.put('/event/' + '59fa7b35c121b4197441860e')
		.set('Authorization', token)
		.send({"title": "TORONTO",
			  "description": "update",
			  "purpose": "test1",
			  "minAge": 11,
			  "maxAge": 22})
		.end((err, res) => {
			res.should.have.status(204);
		  done();
			});
		});
		
	it('Try to find event with search -- toronto', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000&search=toronto')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.events[0].should.have.property('yelpID').eql('22');
			res.body.events[0].should.have.property('title').eql('TORONTO');
			res.body.events[0].should.have.property('description').eql('update');
			res.body.events[0].should.have.property('purpose').eql('test1');
			done();
			});
		});
	
	it('update one event description to MonTreal', (done) => {
		chai.request(server)
		.put('/event/' + '59fa7b35c121b4197441860e')
		.set('Authorization', token)
		.send({"title": "TORONTO",
			  "description": "MonTreal",
			  "purpose": "test2",
			  "minAge": 11,
			  "maxAge": 22})
		.end((err, res) => {
			res.should.have.status(204);
		  done();
			});
		});
		
	it('Try to find event with search -- MonT', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000&search=MonT')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events[0].should.have.property('yelpID').eql('22');
			res.body.events[0].should.have.property('title').eql('TORONTO');
			res.body.events[0].should.have.property('description').eql('MonTreal');
			res.body.events[0].should.have.property('purpose').eql('test2');
			done();
			});
		});
		
	it('Try to find non-exist events by searching -- ottawa', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000&search=ottawa')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events.length.should.be.eql(0);
			done();
			});
		});
		
	it('Try to find most recently created events with EMPTY search query', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000&search=')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events.length.should.be.eql(10);
			done();
			});
		});
	
	it('Try to find most recently created events WITHOUT search query', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events.length.should.be.eql(10);
			done();
			});
		});
		
	it('Try to find a starbucks event close to lat:50 lng:50', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&lat=50&lng=50&radius=10000')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events.length.should.be.eql(1);
			done();
			});
		});
		
	it('Try to find an event close to lat:50 lng:50 by searching -- mcdonalds', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&lat=50&lng=50&radius=10000&search=mcdonalds')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events.length.should.be.eql(0);
			done();
			});
		});
		
	});
});

