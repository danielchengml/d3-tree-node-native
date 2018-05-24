import React, { Component } from "react";
import * as d3 from "d3";
import { svg } from "d3";
import data from "./data";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    console.log(d3);
    this.setState({ data: data });
    // Create a root Node if none
    if (
      data.filter(item => {
        item.parents.length > 1;
      })
    ) {
      // Create a new root
      const rootNode = {
        name: "root",
        id: 0,
        parents: [],
        children: []
      };
      // Add root node id to all nodes without parent
      const parents = data.filter(item => item.parents.length === 0);
      parents.map(item => {
        item.parents.push(rootNode.id);
        rootNode.children.push(item.id);
      });
      // Add rootNode into data Array
      const treeData = [...data];
      treeData.push(rootNode);
      this.setState({ treedata: treeData });
      this.generateTree(treeData);
    } else {
      this.generateTree(data);
    }
  }

  generateTree(source) {
    const width = 800,
      height = 600;

    const tree = d3.tree().size([height, width - 160]);

    const stratify = d3
      .stratify()
      .id(d => {
        return d.id;
      })
      .parentId(d => {
        return d.parents[0];
      });

    const root = stratify(source);
    console.log(root);
    this.setState({ paths: tree(root).links() });
    this.setState({ nodes: root.descendants() });
    // console.log(root);
  }

  render() {
    let paths =
      this.state.paths &&
      this.state.paths.map((item, i) => {
        let data = [
          { x: item.source.x, y: item.source.y },
          { x: item.target.x, y: item.target.y }
        ];

        let line = d3
          .line()
          .x(d => {
            return d.x;
          })
          .y(d => {
            return d.y;
          });
        return item.source.data.name === "root" ? null : (
          <path
            key={"line" + i}
            style={{
              fill: "none",
              stroke: "#ccc",
              strokeWidth: "2px"
            }}
            className="link"
            d={line(data)}
          />
        );
      });

    let nodes =
      this.state.nodes &&
      this.state.nodes.map((node, i) => {
        return node.data.name === "root" ? null : (
          <g
            key={node.id}
            className={
              "node" + node.children ? " node--internal" : " node--leaf"
            }
            transform={`translate(${node.x}, ${node.y})`}
          >
            <circle
              r="10"
              style={{
                stroke: "#c4c4c4",
                strokeWidth: "1px",
                fill: node.children ? "#4fa1ff" : "#bcdbff"
              }}
            />
            <text
              y="6"
              dy="0"
              x="20"
              transform="rotate(90)"
              textAnchor="start"
              style={{ fillOpacity: 1, color: "black" }}
            >
              {node.data.name}
            </text>
          </g>
        );
      });

    return (
      <div className="App">
        <header className="App-header">
          <h2 className="App-title">Tree Node</h2>
        </header>
        <div style={{ height: "100%", width: "100%" }}>
          <svg
            className="tree-chart"
            ref={r => (this.chartRf = r)}
            style={{ width: "100%", height: "800px" }}
          >
            <g transform="translate(20,20)">
              {paths}
              {nodes}
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
