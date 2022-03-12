const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert');
const asherah = require("asherah");
const fs = require("fs");

const fileDirectory = "./";
const fileName = "node_encrypted";

var encryptedPayload;
var decryptedPayload;

var adoDatabaseName = process.env.MYSQL_DATABASE;
var adoUsername = process.env.MYSQL_USERNAME;
var adoPassword = process.env.MYSQL_PASSWORD;
var adoPort = process.env.MYSQL_PORT;
var adoConnectionString = adoUsername+":"+adoPassword+"@tcp(localhost:"+adoPort+")/"+adoDatabaseName+"?tls=false"

Given('I have encrypted_data from {string}', async function (string) {
    var payload = fs.readFileSync(fileDirectory + fileName, 'utf8');
    encryptedPayload = Buffer.from(payload, 'base64').toString('utf8')
    return 'passed';
});

When('I decrypt the encrypted_data', async function () {
    const config = {
        KMS: 'static',
        Metastore: 'rdbms',
        ServiceName: 'TestService',
        ProductID: 'TestProduct',
        Verbose: true,
        EnableSessionCaching: true,
        ExpireAfter: null,
        CheckInterval: null,
        ConnectionString: adoConnectionString,
        ReplicaReadConsistency: null,
        DynamoDBEndpoint: null,
        DynamoDBRegion: null,
        DynamoDBTableName: null,
        SessionCacheMaxSize: null,
        SessionCacheDuration: null,
        RegionMap: null,
        PreferredRegion: null,
        EnableRegionSuffix: null
    };
    asherah.setup(config);
    console.log("Attempt to decrypt: " + encryptedPayload);
    decryptedPayload = asherah.decrypt_string('partition', encryptedPayload);
    asherah.shutdown();
    return 'passed';
});

Then('I should get decrypted_data', async function () {
    assert(decryptedPayload != null);
    return 'passed';
});

Then('decrypted_data should be equal to {string}', async function (originalPayload) {
    assert(decryptedPayload == originalPayload);
    return 'passed';
});
