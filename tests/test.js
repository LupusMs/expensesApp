describe("obtain API Key", function() {
  it("return API Key in case the local storage value is not empty", function() {
    localStorage.setItem("apiKey", "testKey");
    assert.equal(obtainAPIKey(), "testKey");
  });
});
