const { MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/articles') // connect to db
  .then(db => {
    console.log('Client ready');

    // 8.9 : INSERT document
    const article = {
      title: 'I like cake',
      content: 'It is quite good.'
    };
    db.collection('articles')
      .insertOne(article) // collection.insertOne(doc) —Insert a single document
      .then(result => {
        console.log(result.insertedId); // If the document has no _id, a new ID is created. insertedId will be that ID
        console.log(article._id); // The original object defining the document is mutated, adding an _id property
      });

    db.close();
  }, console.error);


/**   Most interactions with the database are via the collection API :
 collection.insert(doc) —Insert one or more documents

 collection.find(query) —Find documents matching the query
 collection.remove(query) —Remove documents matching the query
 collection.update(query) —Update documents matching the query
 collection.count(query) —Count documents matching the query

 collection.drop() —Remove the entire collection

Operations such as find , insert , and delete come in a few flavors, depending on whether you’re operating on one or many values. For example:
 collection.insertOne(doc) —Insert a single document
 collection.insertMany([doc1, doc2]) —Insert many documents // takes an array of multiple documents. insertMany response will contain an array of insertedIds, in the order the documents were supplied, instead of a singular insertedId.
 collection.findOne(query) —Find a single document matching the query
 collection.updateMany(query) —Update all documents matching the query

Many query operators exist in the M ongo DB query language—for example:
 $eq —Equal to a particular value
 $neq —Not equal to a particular value
 $in —In array
 $nin —Not in array
 $lt , $lte , $gt , $gte —Greater/less than or equal to comparison
 $near —Geospatial value is near a certain coordinate
 $not , $and , $or , $nor —Logical operators

 https://docs.mongodb.com/manual/reference/operator/query
*/