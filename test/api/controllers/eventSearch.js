let mongoose = require("mongoose");
let Event = require('../../../api/models/Event');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let should = chai.should();

let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWYwMDM4ODkwN2IzNzA0YjRjNDYxZmQiLCJpc3MiOiJZb3VyVGFibGUiLCJpYXQiOjE1MDg5MDE3OTl9.ot_1psqlXEdsaG64zgigJz3DWJYKS-n-QEd-9INz1Mg';

chai.use(chaiHttp);

describe('Events Search', () => {

	describe('/GET /events/', () => {

	var id;

	it('it should create an event', (done) => {
		let event = {
				"yelpID": "01",
				"title": "TORONTO",
				"description": "update",
				"purpose": "test1",
				"startTime": "22",
				"minAge": 11,
				"maxAge": 22,
				"capacity": 22,
				"gender": "m",
				"lng": 22,
				"lat": 22
		};
			chai.request(server)
			.post('/events/')
			.set('Authorization', token)
			.send(event)
			.end((err, res) => {
				id = res.body;
				res.should.have.status(200);
				done();
			});
		});
		
	it('Try to find event with search -- toron', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000&search=toron')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.events[0].should.have.property('yelpID').eql('01');
			res.body.events[0].should.have.property('title').eql('TORONTO');
			res.body.events[0].should.have.property('description').eql('update');
			res.body.events[0].should.have.property('purpose').eql('test1');
			done();
			});
		});
		
	it('Try to find most recently created events with EMPTY search query', (done) => {
		chai.request(server)
		.get('/events/' + '?page=1&pageSize=10&radius=10000&search=')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.events.should.be.a('array');
			res.body.events.length.should.be.eql(1);
			done();
			});
		});
	
	it('Clean up test event', (done) => {
		chai.request(server)
		.delete('/events/' + id)
		.set('Authorization', token)
		.end((err, res) => {
			res.should.have.status(204);
			done();
			});
		});
		
	it('it should create an event', (done) => {
		let event = {
				"yelpID": "01",
				"title": "starbucks",
				"description": "starbucks",
				"purpose": "coffee",
				"startTime": "22",
				"minAge": 11,
				"maxAge": 22,
				"capacity": 22,
				"gender": "m",
				"lng": 50,
				"lat": 50
		};
			chai.request(server)
			.post('/events/')
			.set('Authorization', token)
			.send(event)
			.end((err, res) => {
				id = res.body;
				res.should.have.status(200);
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
		
	it('Clean up test event', (done) => {
		chai.request(server)
		.delete('/events/' + id)
		.set('Authorization', token)
		.end((err, res) => {
			res.should.have.status(204);
			done();
			});
		});

	});
});

