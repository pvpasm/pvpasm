const mongodb = require('mongodb')

const server = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PWD}@${process.env.MONGO_HOST}:27017/pvpasm?authSource=admin`

module.exports = {
    serverUrl: server,
    async loadNewsCollection() {
        const client = await mongodb.MongoClient.connect(server, { useNewUrlParser: true })    
        return client.db('pvpasm').collection('news');
    },    
    async loadUserCollection() {
        const client = await mongodb.MongoClient.connect(server, { useNewUrlParser: true })    
        return client.db('pvpasm').collection('user');
    },
    async loadChallengeCollection() {
        const client = await mongodb.MongoClient.connect(server, { useNewUrlParser: true })    
        return client.db('pvpasm').collection('challenge');
    }
}
