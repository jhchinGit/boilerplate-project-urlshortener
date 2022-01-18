var chai = require("chai");
var assert = chai.assert; // Using Assert style
var fetch = require("cross-fetch");

describe("Array", function () {
  describe("#indexOf()", function () {
    const url = "https://boilerplate-project-urlshortener.jinhoong1995.repl.co";
    // const url = "http://localhost:14355";
    it("You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties. Here's an example: { original_url : 'https://freeCodeCamp.org', short_url : 1}", async () => {
      const urlVariable = Date.now();
      const fullUrl = `${url}/?v=${urlVariable}`;
      console.log("url", url);
      console.log("fullUrl", fullUrl);
      const res = await fetch(url + "/api/shorturl", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=${fullUrl}`,
      });

      if (res.ok) {
        const response = await res.json();
        console.log("response", response);
        const { short_url, original_url } = response;
        assert.isNotNull(short_url);
        assert.strictEqual(original_url, `${url}/?v=${urlVariable}`);
      } else {
        console.log("Exception!!!!");
        throw new Error(`${res.status} ${res.statusText}`);
      }
    });

    it("When you visit /api/shorturl/<short_url>, you will be redirected to the original URL.", async () => {
      const urlVariable = Date.now();
      const fullUrl = `${url}/?v=${urlVariable}`;
      let shortenedUrlVariable;
      const postResponse = await fetch(url + "/api/shorturl", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=${fullUrl}`,
      });
      if (postResponse.ok) {
        const responseJson = await postResponse.json();
        console.log("responseJson", responseJson);
        const { short_url } = responseJson;
        shortenedUrlVariable = short_url;
      } else {
        throw new Error(`${postResponse.status} ${postResponse.statusText}`);
      }

      const navigateUrl = url + "/api/shorturl/" + shortenedUrlVariable;
      console.log("navigateUrl", navigateUrl);
      const getResponse = await fetch(navigateUrl);
      if (getResponse) {
        const { redirected, url } = getResponse;
        assert.isTrue(redirected);
        assert.strictEqual(url, fullUrl);
      } else {
        throw new Error(`${getResponse.status} ${getResponse.statusText}`);
      }
    });

    it("If you pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain { error: 'invalid url' }", async () => {
      const res = await fetch(url + "/api/shorturl", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=ftp:/john-doe.org`,
      });
      if (res.ok) {
        const { error } = await res.json();
        assert.isNotNull(error);
        assert.strictEqual(error.toLowerCase(), "invalid url");
      } else {
        throw new Error(`${res.status} ${res.statusText}`);
      }
    });
  });
});
