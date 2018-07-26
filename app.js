const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

//connection url
const url = 'mongodb://localhost:27017';
 
//Database Name
const dbName = 'myproject';


const insertDocuments = function(db, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Insert some documents
    collection.insertMany([
      {a : 1}, {a : 2}, {a : 3}
    ], function(err, result) {
      assert.equal(err, null);
      assert.equal(3, result.result.n);
      assert.equal(3, result.ops.length);
      console.log("Inserted 3 documents into the collection");
      callback(result);
    });
  }

//INSERT A DOCUMENT
const findDocuments = function(db, callback) {
    // get the documents collection
    const collection = db.collection('documents');
    // find some documents
    collection.find({'a': 3}).toArray(function(err, docs){
        assert.equal(err, null);
        console.log("found the following records");
        console.log(docs);
        callback(docs);
    });
}

//FIND ALL DOCUMENTS
const updateDocument = function(db, callback) {
    // get the documents collection
    const collection = db.collection('documents');
    // update document where a is 2, set b equal to 1
    collection.updateOne({ a : 2 },
    { $set: {b:1}}, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });
}





//REMOVE A DOCUMENT
const removeDocument = function(db, callback) {
    //get the documents collection
    const collection = db.collection('documents');
  // Delete document where a is 3
    collection.deleteOne({ a : 3 }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });    
}




//INDEX A COLLECTIION
const indexCollection = function(db, callback) {
    db.collection('documents').createIndex(
      { "a": 1 },
        null,
        function(err, results) {
          console.log(results);
          callback();
      }
    );
  };

  
  
  // Use connect method to connect to the server
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  
    insertDocuments(db, function() {
      indexCollection(db, function() {
        client.close();
      });
    });
  }); 
