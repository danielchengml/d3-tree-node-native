import React, { Component } from "react";
import * as d3 from "d3";
import { svg } from "d3";
import data from "./data";
import "./App.css";

class App extends Component {
  state = {
    translate: null
  };

  componentDidMount() {
    const dimensions = this.treeContainer.getBoundingClientRect();
    this.setState({
      translate: {
        x: dimensions.width / 2,
        y: -dimensions.height / 7
      }
    });

    const stratify = d3
      .stratify()
      .id(d => {
        return d.id;
      })
      .parentId(d => {
        return d.parents[0];
      });
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
      const root = stratify(treeData);
      this.assignInternalProperties([root]);
      this.setState({ root: root });
      this.generateTree(root);
    } else {
      const root = stratify(data);
      this.setState({ root: root });
      this.generateTree(root);
    }
  }

  assignInternalProperties(root) {
    return root.map(node => {
      node._collapsed = false;
      // if there are children, recursively assign properties to them too
      if (node.children && node.children.length > 0) {
        node.children = this.assignInternalProperties(node.children);
        node._children = node.children;
      }
      return node;
    });
  }

  generateTree(root) {
    const width = 800,
      height = 600;

    const tree = d3
      .tree()
      .size([height, width - 160])
      .separation((a, b) => (a.parent.id === b.parent.id ? 0.2 : 0.4));
    this.setState({ paths: tree(root).links() });
    this.setState({ nodes: root.descendants() });
  }

  handleNodeToggle(node) {
    const { root } = this.state;
    const matches = this.findNodesById(node.data.id, [root], []);
    const targetNode = matches[0];
    node._collapsed ? this.expandNode(node) : this.collapseNode(node);
    this.setState({ root: root });
    this.generateTree(root);
  }

  collapseNode(node) {
    node._collapsed = true;
    node._children = node.children;
    node.children = null;
    return node;
  }

  expandNode(node) {
    node._collapsed = false;
    node.children = node._children;
    node._children = null;
    return node;
  }

  findNodesById(nodeId, nodeSet, hits) {
    if (hits.length > 0) {
      return hits;
    }

    hits = hits.concat(nodeSet.filter(node => node.data.id === nodeId));

    nodeSet.forEach(node => {
      if (node.children && node.children.length > 0) {
        hits = this.findNodesById(nodeId, node.children, hits);
        return hits;
      }
      return hits;
    });

    return hits;
  }

  render() {
    const { translate } = this.state;
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
            onClick={this.handleNodeToggle.bind(this, node)}
          >
            <circle
              r="10"
              style={{
                stroke: "#c4c4c4",
                strokeWidth: "1px",
                fill: node.children || node._children ? "#4fa1ff" : "#bcdbff"
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
        <div
          style={{ height: "100%", width: "100%" }}
          ref={tc => (this.treeContainer = tc)}
        >
          <svg
            className="tree-chart"
            ref={r => (this.chartRf = r)}
            style={{ width: "100%", height: "100vh" }}
          >
            <g
              transform={
                translate === null
                  ? "translate(0,0)"
                  : `translate(${translate.x},${translate.y})`
              }
            >
              {console.log(translate)}
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
