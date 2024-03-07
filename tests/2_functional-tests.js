const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    let randomNum = Math.floor(Math.random() * 1000000) + 1
    let projectName = `Test${randomNum}`
    let id1;
    let id2;

    // # 1
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post(`/api/issues/${projectName}`)
            .send({
                issue_title: 'PostTest1', 
                issue_text: 'every field', 
                created_by: 'test1', 
                assigned_to: 'sam', 
                status_text: 'what?'
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                let obj = JSON.parse(res.text);
                assert.equal(obj.issue_title,'PostTest1',`expect ${obj.issue_title} to be equal to 'PostTest1'`);
                assert.equal(obj.issue_text,'every field',`expect ${obj.issue_text} to be equal to 'every field'`);
                assert.equal(obj.created_by,'test1',`expect ${obj.created_by} to be equal to 'test1'`);
                assert.equal(obj.assigned_to,'sam',`expect ${obj.assigned_to} to be equal to 'sam'`);
                assert.equal(obj.status_text,'what?',`expect ${obj.status_text} to be equal to 'what?'`);
                assert.isDefined(obj._id);
                assert.isDefined(obj.updated_on)
                assert.isTrue(obj.open);

                id1 = obj._id;

                done();
            })
    }) 
    
    // # 2
    test('Create an issue with only required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post(`/api/issues/${projectName}`)
            .send({
                issue_title: 'PostTest2', 
                issue_text: 'required field', 
                created_by: 'test2', 
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                let obj = JSON.parse(res.text);
                assert.equal(obj.issue_title,'PostTest2',`expect ${obj.issue_title} to be equal to 'PostTest2'`);
                assert.equal(obj.issue_text,'required field',`expect ${obj.issue_text} to be equal to 'required field'`);
                assert.equal(obj.created_by,'test2',`expect ${obj.created_by} to be equal to 'test2'`);
                assert.equal(obj.assigned_to,'',`expect ${obj.assigned_to} to be equal to ''`);
                assert.equal(obj.status_text,'',`expect ${obj.status_text} to be equal to ''`);
                assert.isDefined(obj._id);
                assert.isDefined(obj.updated_on)
                assert.isTrue(obj.open);
                done();
            })
    }) 

    // # 3
    test('Create an issue with missing required fields: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post(`/api/issues/${projectName}`)
            .send({
                issue_title: 'PostTest1',  
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,'{"error":"required field(s) missing"}',`expect ${res.text} to be equal to '{"error":"required field(s) missing"}'`);
                done();
            })
    }) 

    // # 4-1
    test('Create an issue with every field: POST request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post(`/api/issues/${projectName}`)
            .send({
                issue_title: 'PostTest3', 
                issue_text: 'issue to be updated', 
                created_by: 'test3', 
                assigned_to: 'sam',
            })
            .end((err, res)=> {
                id2 = JSON.parse(res.text)._id;
                assert.equal(res.status, 200, 'Response status should be 200');
                done();
            })
    })

    // # 4-2
    test('View issues on a project: GET request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .get(`/api/issues/${projectName}`)
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');

                let arr = JSON.parse(res.text);
                assert.equal(arr.length,3,'There should be 3 issue.')

                let arr1 = JSON.parse(res.text)[0];
                assert.equal(arr1.issue_title,'PostTest1',`expect ${arr1.issue_title} to be equal to 'PostTest1'`);
                assert.equal(arr1.issue_text,'every field',`expect ${arr1.issue_text} to be equal to 'every field'`);
                assert.equal(arr1.created_by,'test1',`expect ${arr1.created_by} to be equal to 'test1'`);
                assert.equal(arr1.assigned_to,'sam',`expect ${arr1.assigned_to} to be equal to 'sam'`);
                assert.equal(arr1.status_text,'what?',`expect ${arr1.status_text} to be equal to 'what?'`);
                assert.isDefined(arr1._id);
                assert.isDefined(arr1.updated_on)
                assert.isTrue(arr1.open);

                let arr2 = JSON.parse(res.text)[1];
                assert.equal(arr2.issue_title,'PostTest2',`expect ${arr2.issue_title} to be equal to 'PostTest2'`);
                assert.equal(arr2.issue_text,'required field',`expect ${arr2.issue_text} to be equal to 'required field'`);
                assert.equal(arr2.created_by,'test2',`expect ${arr2.created_by} to be equal to 'test2'`);
                assert.equal(arr2.assigned_to,'',`expect ${arr2.assigned_to} to be equal to ''`);
                assert.equal(arr2.status_text,'',`expect ${arr2.status_text} to be equal to ''`);
                assert.isDefined(arr2._id);
                assert.isDefined(arr2.updated_on)
                assert.isTrue(arr2.open);

                let arr3 = JSON.parse(res.text)[2];
                assert.equal(arr3.issue_title,'PostTest3',`expect ${arr3.issue_title} to be equal to 'PostTest3'`);
                
                assert.equal(arr3.created_by,'test3',`expect ${arr3.created_by} to be equal to 'test3'`);
                assert.equal(arr3.assigned_to,'sam',`expect ${arr3.assigned_to} to be equal to 'sam'`);
                assert.equal(arr3.status_text,'',`expect ${arr3.status_text} to be equal to ''`);
                assert.isDefined(arr3._id);
                assert.isDefined(arr3.updated_on)
                assert.isTrue(arr3.open);

                done();
            })
    }) 

    // # 5
    test('View issues on a project with one filter: GET request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .get(`/api/issues/${projectName}?issue_text=every field`)
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');

                let arr = JSON.parse(res.text);
                assert.equal(arr.length, 1,'There should be 1 issue.')
                
                let obj = arr[0];
                assert.equal(obj.issue_title,'PostTest1',`expect ${obj.issue_title} to be equal to 'PostTest1'`);
                done();
            })
    }) 

    // # 6
    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .get(`/api/issues/${projectName}?assigned_to=sam&issue_text=issue to be updated`)
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');

                let arr = JSON.parse(res.text);
                assert.equal(arr.length, 1,'There should be 1 issue.')
                
                let obj = arr[0];
                assert.equal(obj.issue_title,'PostTest3',`expect ${obj.issue_title} to be equal to 'PostTest3'`);
                done();
            })
    }) 

    // # 7-1
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .put(`/api/issues/${projectName}`)
            .send({
                _id: id2,
                issue_text: 'updated',
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"result":"successfully updated","_id":"${id2}"}`, `expect ${res.text} to be equal to '{"result":"successfully updated","_id":"${id2}"}'`)
                done();
            })
    }) 

    // # 7-2
    test('Update one field on an issue: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .get(`/api/issues/${projectName}?issue_title=PostTest3`)
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                
                let obj = JSON.parse(res.text)[0];
                
                assert.equal(obj.issue_title,'PostTest3',`expect ${obj.issue_title} to be equal to 'PostTest3'`);
                assert.equal(obj.issue_text,'updated',`expect ${obj.issue_text} to be equal to 'updated'`);
                assert.notEqual(obj.created_on, obj.updated_on, `expect ${obj.created_on} not to be equal to ${obj.updated_on}`)
                
                done();
            })
    })

    // # 8-1
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .put(`/api/issues/${projectName}`)
            .send({
                _id: id1,
                issue_text: 'to be deleted',
                open: false,
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"result":"successfully updated","_id":"${id1}"}`, `expect ${res.text} to be equal to '{"result":"successfully updated","_id":"${id1}"}'`)
                done();
            })
    }) 

    // # 8-2
    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .get(`/api/issues/${projectName}?issue_title=PostTest1`)
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                
                let obj = JSON.parse(res.text)[0];
                
                assert.equal(obj.issue_title,'PostTest1',`expect ${obj.issue_title} to be equal to 'PostTest1'`);
                assert.equal(obj.issue_text,'to be deleted',`expect ${obj.issue_text} to be equal to 'to be deleted'`);
                assert.strictEqual(obj.open, false, `expect ${obj.open} to be equal to false` )
                assert.notEqual(obj.created_on, obj.updated_on, `expect ${obj.created_on} not to be equal to ${obj.updated_on}`)
                
                done();
            })
    }) 

    // # 9
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .put(`/api/issues/${projectName}`)
            .send({
                issue_text: 'to be deleted',
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"error":"missing _id"}`, `expect ${res.text} to be equal to '{"error":"missing _id"}'`)
                done();
            })
    }) 

    // # 10
    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .put(`/api/issues/${projectName}`)
            .send({
                _id: id1
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"error":"no update field(s) sent","_id":"${id1}"}`, `expect ${res.text} to be equal to '{"error":"no update field(s) sent","_id":"${id1}"}'`)
                done();
            })
    }) 
    
    // # 11
    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .put(`/api/issues/${projectName}`)
            .send({
                _id: "5871dda29faedc3491ff93bb",
                issue_text: 'invalid id',
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"error":"could not update","_id":"5871dda29faedc3491ff93bb"}`, `expect ${res.text} to be equal to '{"error":"could not update","_id":"5871dda29faedc3491ff93bb"}'`)
                done();
            })
    }) 
    
    // # 12-1
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .delete(`/api/issues/${projectName}`)
            .send({
                _id: id1,
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"result":"successfully deleted","_id":"${id1}"}`, `expect ${res.text} to be equal to '{"result":"successfully deleted","_id":"${id1}"}'`)
                done();
            })
    }) 

    // # 12-2
    test('Delete an issue: DELETE request to /api/issues/{project}', (done) => {
        chai
            .request(server)
            .keepOpen()
            .get(`/api/issues/${projectName}?issue_title=PostTest1`)
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                
                let arr = JSON.parse(res.text);
                assert.strictEqual(arr.length, 0, 'data should have been deleted')
                done();
            })
    }) 

    // # 13
    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .delete(`/api/issues/${projectName}`)
            .send({
                _id: id1,
            })
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"error":"could not delete","_id":"${id1}"}`, `expect ${res.text} to be equal to '{"error":"could not delete","_id":"${id1}"}'`)
                done();
            })
    })

    // # 14
    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', (done) => {
        
        chai
            .request(server)
            .keepOpen()
            .delete(`/api/issues/${projectName}`)
            .send({})
            .end((err, res) => {
                assert.equal(res.status, 200, 'Response status should be 200');
                assert.equal(res.text,`{"error":"missing _id"}`, `expect ${res.text} to be equal to '{"error":"missing _id"}'`)
                done();
            })
    })

});
