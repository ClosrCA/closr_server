let mongoose = require("mongoose");
let Event = require('../../../api/models/Event');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../../app');
let should = chai.should();

let token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1OWYwMDM4ODkwN2IzNzA0YjRjNDYxZmQiLCJpc3MiOiJZb3VyVGFibGUiLCJpYXQiOjE1MDg5MDE3OTl9.ot_1psqlXEdsaG64zgigJz3DWJYKS-n-QEd-9INz1Mg';

chai.use(chaiHttp);

describe('Event', () => {
	describe('/POST /create/event', () => {
	  
	it('it should return error 401 because of bad token', (done) => {
	 let event = {
		  "yelpID": "02",
		  "title": "test",
		  "description": "test",
		  "purpose": "test",
		  "startTime": "22",
		  "minAge": 11,
		  "maxAge": 22,
		  "capacity": 22,
		  "gender": "m",
		  "lng": 22,
		  "lat": 22
	 };
		chai.request(server)
		.post('/create/event')
		.set('Authorization', token + 'bad') // bad token
		.send(event)
		.end((err, res) => {
			res.should.have.status(401);
		  done();
			});
		});
	
	it('it should return error 400 because of missing yelpID', (done) => {
	 let event = {
		  //"yelpID": "01",
		  "title": "test",
		  "description": "test",
		  "purpose": "test",
		  "startTime": "22",
		  "minAge": 11,
		  "maxAge": 22,
		  "capacity": 22,
		  "gender": "m",
		  "lng": 22,
		  "lat": 22
	 };
		chai.request(server)
		.post('/create/event')
		.set('Authorization', token)
		.send(event)
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.eql('Missing field: yelpID');
		  done();
			});
		});
		
		
	it('it should return error 400 because of missing location info', (done) => {
	 let event = {
		  "yelpID": "02",
		  "title": "test",
		  "description": "test",
		  "purpose": "test",
		  "startTime": "22",
		  "minAge": 11,
		  "maxAge": 22,
		  "capacity": 22,
		  "gender": "m",
		  "lng": 22,
		  //"lat": 22
	 };
		chai.request(server)
		.post('/create/event')
		.set('Authorization', token)
		.send(event)
		.end((err, res) => {
			res.should.have.status(400);
			res.body.should.eql('Missing location info');
		  done();
			});
		});
	
	it('it should create an event', (done) => {
         let event = {
			  "yelpID": "01",
			  "title": "test",
			  "description": "test",
			  "purpose": "test",
			  "startTime": "22",
			  "minAge": 11,
			  "maxAge": 22,
			  "capacity": 22,
			  "gender": "m",
			  "lng": 22,
			  "lat": 22
         };
            chai.request(server)
            .post('/create/event')
			.set('Authorization', token)
			.send(event)
            .end((err, res) => {
                res.should.have.status(204);
              done();
            });
      });
	});
	  
	describe('/GET /event', () => {
	it('it should get an specific event', (done) => {
		chai.request(server)
		.get('/event/' + '5a282e911300bd0be859e65f')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.event.should.have.property('yelpID').eql('01');
			res.body.event.should.have.property('title').eql('test');
			res.body.event.should.have.property('description').eql('test');
			res.body.event.should.have.property('purpose').eql('test');
			done();
			});
		});
		
	it('it should get an empty event', (done) => {
		chai.request(server)
		.get('/event/' + '5b282e911300bd0be859e65f')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.eql({'event':null})
			done();
			});
		});
	});
	
	
	describe('/PUT /event', () => {
	it('it should update an event and return 204', (done) => {
		chai.request(server)
		.put('/event/' + '5a282e911300bd0be859e65f')
		.set('Authorization', token)
		.send({"title": "update",
			  "description": "update",
			  "purpose": "update",
			  "minAge": 11,
			  "maxAge": 22})
		.end((err, res) => {
			res.should.have.status(204);
		  done();
			});
		});
		
	it('check the updated event', (done) => {
		chai.request(server)
		.get('/event/' + '5a282e911300bd0be859e65f')
		.end((err, res) => {
			res.should.have.status(200);
			res.body.should.be.a('object');
			res.body.event.should.have.property('yelpID').eql('01');
			res.body.event.should.have.property('title').eql('update');
			res.body.event.should.have.property('description').eql('update');
			res.body.event.should.have.property('purpose').eql('update');
			done();
			});
		});
	});
});

