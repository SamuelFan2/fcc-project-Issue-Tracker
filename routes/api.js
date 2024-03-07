'use strict';
const { ObjectId } = require('mongodb');

module.exports = function (app,myDB) {
    console.log('connect success!');
    
    app.route('/api/issues/:project')
      
      // Get
      .get(async function (req, res){
        console.log('\nget info');

        let project = req.params.project;
        let query = req.query;
        if (query._id) {
          query._id = new ObjectId(query._id);
        }
         
        console.log('project:',project,'query:',query);

        let db = myDB.db('fcc-project').collection(project);
        let data = await db.find(query).toArray();

        res.json(data);

      })

      // Submit
      .post(async function (req, res){
        console.log("");
        let project = req.params.project;

        let db = myDB.db('fcc-project').collection(project);
        let {issue_title, issue_text, created_by, assigned_to, status_text} = req.body
        
        // without the required fields
        if (!issue_title || !issue_text || !created_by) {
          res.json({ error: 'required field(s) missing' });
          return;
        }
        
        let obj = {
          assigned_to: assigned_to || "",
          status_text: status_text || "",
          open: true,
          issue_title: issue_title,
          issue_text: issue_text,
          created_by: created_by,
          created_on: new Date(),
          updated_on: new Date()
        }
        
        console.log('insert', 'issue title:', issue_title)

        // _id automatically inserted into obj
        await db.insertOne(obj);

        res.json(obj);
      })
      
      // Update
      .put(async function (req, res){
        console.log("");
        let project = req.params.project;
        let db = myDB.db('fcc-project').collection(project);

        let {_id} = req.body;
        delete req.body._id;
        console.log('id:',_id,'update:', req.body);

        // if _id not submitted
        if(!_id) {
          res.json({ error: 'missing _id' });
          console.log({ error: 'missing _id' });
          return;
        }

        try {

          // if only _id submitted
          if (Object.keys(req.body).length === 0) {
            res.json({ error: 'no update field(s) sent', '_id': _id });
            console.log({ error: 'no update field(s) sent', '_id': _id });
            return;
          }

          // if a invalid _id submitted
          let data = (await db.find({_id: new ObjectId(_id)}).toArray())[0];
          if (!data) {
            throw new Error('no data found');
          }
          console.log('data found',data);

          // update database
          await db.updateOne(
            {_id: new ObjectId(_id)}, 
            {$set: Object.assign({}, req.body, {updated_on: new Date()})}
            );

          res.json({result: "successfully updated", _id: _id});
          console.log({result: "successfully updated", _id: _id})

        } catch (err) {
          res.json({ error: 'could not update', _id: _id });
          console.log({ error: 'could not update', _id: _id });
        }
      })
      
      // Delete
      .delete(async function (req, res){
        console.log("");
        let project = req.params.project;
        let db = myDB.db('fcc-project').collection(project);
        let _id = req.body._id;
        console.log('delete', _id);

        // if no _id submitted
        if (!_id) {
          res.json({ error: 'missing _id' });
          console.log({error: 'missing _id' })
          return;
        }

        try {
          
          // if a invalid id submitted
          let data = (await db.find({_id: new ObjectId(_id)}).toArray())[0];
          if (!data) {
            throw new Error ('no data found');
          }

          // delete from database
          await db.deleteOne({_id: new ObjectId(_id)});
          res.json({result: 'successfully deleted', '_id': _id });
          console.log({result: 'successfully deleted', '_id': _id });

        } catch (err) {

          res.json({error: 'could not delete', '_id': _id});
          console.log({error: 'could not delete', '_id': _id});
          console.log('ERROR!!!!!',err);
          
          
        }
            
      });
};
