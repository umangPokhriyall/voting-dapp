const Voting = artifacts.require("Voting");

module.exports = function (deployer) {
  deployer.deploy(Voting,["Party1", "Party2", "Party3", "Party4"], 90);
};