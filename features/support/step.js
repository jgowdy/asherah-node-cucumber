"use strict";

const { Given, When, Then } = require('@cucumber/cucumber')
const assert = require('assert');
const asherah = require("asherah");
const fs = require("fs");

const fileDirectory = "./";
const fileName = "node_encrypted";

let payloadString;
let encryptedPayloadString;

Given("I have {string}", async function (payload) {
    payloadString = payload;
});

When('I encrypt the data', async function () {
    const config = {
        KMS: 'static',
        Metastore: 'memory',
        ServiceName: 'TestService',
        ProductID: 'TestProduct',
        Verbose: true,
        EnableSessionCaching: true,
        ExpireAfter: null,
        CheckInterval: null,
        ConnectionString: null,
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
    encryptedPayloadString = asherah.encrypt_string('partition', payloadString);
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

Given('I have encrypted_data from {string}', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('I decrypt the encrypted_data', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('I should get decrypted_data', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('decrypted_data should be equal to {string}', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});


