const testdata = [
  { name: "ProjectA", parent: "" },
  { name: "ApplicationA", parent: "ProjectA" },
  { name: "EnvironmentB", parent: "ProjectA" },

  { name: "TierC", parent: "ApplicationA" },
  { name: "TierD", parent: "ApplicationA" },
  { name: "TierE", parent: "ApplicationA" },

  { name: "ServiceF", parent: "EnvironmentB" },

  { name: "ContainerG", parent: "EnvironmentB" },
  { name: "ContainerH", parent: "TierE" },
  { name: "ContainerH", parent: "TierE" },
  { name: "ContainerH", parent: "TierE" },
  { name: "ContainerH", parent: "TierE" },
  { name: "ContainerH", parent: "TierE" },
  { name: "ContainerH", parent: "TierE" }
];

module.exports = testdata;
