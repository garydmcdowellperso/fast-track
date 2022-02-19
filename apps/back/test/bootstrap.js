import _ from "lodash";
import assert from "assert";
import config from "../src/config";

// Uncomment this block if you want to restrict running tests locally e.g. so you don't delete DBs :-)
// prettier-ignore
assert(
  _.startsWith(config.db.url, 'mongodb://localhost') ||
    _.startsWith(config.db.url, 'mongodb://mongo'),
  'For security reasons, this test utility works only localhost'
);
