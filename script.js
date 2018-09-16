class DAG {

    constructor() {
        this.vertices = {};
    }

    getVertex(value) {
        return this.vertices[value];
    }

    addVertex(vertex) {
        this.vertices[vertex] = this.vertices[vertex] || {
            edges: {}
        };
    }

    addEdge(v1, v2) {
        this.vertices[v1].edges[v2] = this.vertices[v2];
        this.checkCyclic(v1, v2);
    }

    removeEdge(v1, v2) {
        delete this.vertices[v1].edges[v2];
    }

    checkCyclic(parent, target) {
        const cyclic = (v) => {
            Object.keys(v.edges).forEach(edge => {
                if (edge === parent) {
                    this.removeEdge(parent, target);
                    throw new Error('Graph is cyclic');
                }
                cyclic(this.getVertex(edge));
            });
        }
        cyclic(this.getVertex(parent));
    }

}

let dag = new DAG();
const vertices = [0, 1, 2, 3, 4, 5, 6];
vertices.forEach(v => {
    dag.addVertex(v);
});

dag.addEdge(0, 1);
dag.addEdge(0, 2);
dag.addEdge(1, 3);
dag.addEdge(1, 5);
dag.addEdge(2, 5);
dag.addEdge(6, 2);

let generatePaths = (object) => {
    var result = [];
    Object.entries(object).forEach(function iter(keys) {
        return function ([key, { edges }]) {
            var entries = Object.entries(edges);
            if (entries.length) {
                return entries.forEach(iter(keys.concat(key)));
            }
            result.push(keys.concat(key).join('->'));
        };
    }([]));
    return result;
}

document.getElementById('node0').innerText = generatePaths(dag.vertices);

const data = [
    [0, 1],
    [0, 2],
    [1, 3],
    [1, 5],
    [2, 5],
    [6, 2],
];

let html = '[<br/>';
data.forEach(e => {
    html += '&nbsp;&nbsp;[' + e + ']<br/>';
});
html += ']';

document.getElementById('path').innerHTML = html;

let newDag = new DAG();
data.forEach(edges => {
    edges.forEach(v => {
        if (newDag.getVertex(v) === undefined) {
            newDag.addVertex(v);
        }
    });
    newDag.addEdge(...edges);
});

document.getElementById('edges-object').innerHTML = '<pre>' + JSON.stringify(newDag.vertices, null, 2) + '</pre>';