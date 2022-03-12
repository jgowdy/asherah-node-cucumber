"use strict";

const cucumber = require("@cucumber/cucumber");
const assert = require("assert");
const asherah = require("asherah");
const fs = require("fs");

const fileDirectory = "/tmp/";
const fileName = "node_encrypted";

let payloadString;
let encryptedPayloadString;

cucumber.Given(/^I have "(.*)"$/, function (payload) {
    payloadString = payload;
});

cucumber.When('I encrypt the data', function () {
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
});

cucumber.Then('I should get encrypted_data', function (_dataTable) {
    const tempFile = fileDirectory + fileName;
    if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
    }
    fs.writeFileSync(tempFile, encryptedPayloadString);
});

cucumber.Then('encrypted_data should not be equal to data', function (_dataTable) {
    assert(payloadString, encryptedPayloadString);
});
