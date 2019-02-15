const mongodb = require('mongodb')

const server = `mongodb://pvpasm:${process.env.DB_PWD}@daniellimws.hopto.org:27017/pvpasm`

module.exports = {
    serverUrl: server,
    async loadNewsCollection() {
        const client = await mongodb.MongoClient.connect(server)    
        return client.db('pvpasm').collection('news');
    },    
    async loadUserCollection() {
        const client = await mongodb.MongoClient.connect(server)    
        return client.db('pvpasm').collection('user');
    },
    async loadChallengeCollection() {
        const client = await mongodb.MongoClient.connect(server)    
        return client.db('pvpasm').collection('challenge');
    }
}