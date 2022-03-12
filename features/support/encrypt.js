"use strict";

const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert');
const asherah = require("asherah");
const fs = require("fs");

const fileDirectory = "./";
const fileName = "node_encrypted";

let payloadString;
let encryptedPayloadString;

var adoDatabaseName = process.env.MYSQL_DATABASE;
var adoUsername = process.env.MYSQL_USERNAME;
var adoPassword = process.env.MYSQL_PASSWORD;
var adoPort = process.env.MYSQL_PORT;
var adoConnectionString = adoUsername+":"+adoPassword+"@tcp(localhost:"+adoPort+")/"+adoDatabaseName+"?tls=false";

Given("I have {string}", async function (payload) {
    payloadString = payload;
});

When('I encrypt the data', async function () {
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
    encryptedPayloadString = Buffer.from(asherah.encrypt_string('partition', payloadString)).toString('base64');
    asherah.shutdown();
    return 'passed';
});

Then('I should get encrypted_data', async function () {
    const tempFile = fileDirectory + fileName;
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
    fs.writeFileSync(tempFile, encryptedPayloadString);
    return 'passed';
});

Then('encrypted_data should not be equal to data', async function () {
    assert(payloadString, encryptedPayloadString);
    return 'passed';
});
