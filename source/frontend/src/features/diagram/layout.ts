import ELK, { ElkExtendedEdge, ElkNode, LayoutOptions } from 'elkjs/lib/elk.bundled.js';
import { SchemaEdge, SchemaNode } from './use-positioning';

const elk = new ELK();

// Elk has a *huge* amount of options to configure. To see everything you can
// tweak check out:
//
// - https://www.eclipse.org/elk/reference/algorithms.html
// - https://www.eclipse.org/elk/reference/options.html
const defaultLayoutOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100',
    'elk.spacing.nodeNode': '80',
};

export function layoutNodes(
    nodes: SchemaNode[],
    edges: SchemaEdge[],
    options: LayoutOptions = {}
): Promise<{ nodes: SchemaNode[]; positionsUpdated: boolean }> {
    const layoutOptions = { ...defaultLayoutOptions, ...options };
    const graph: ElkNode = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: nodes.map<ElkNode>((node) => ({ id: node.id, width: node.width ?? undefined, height: node.height ?? undefined })),
        edges: edges.map<ElkExtendedEdge>((edge) => ({ id: edge.id, sources: [edge.source], targets: [edge.target] })),
    };
    return elk.layout(graph).then((layoutedGraph: ElkNode) => {
        if (layoutedGraph.children) {
            const positions: { [key: string]: { x: number; y: number } | null } = Object.fromEntries(
                layoutedGraph.children.map<[string, { x: number; y: number } | null]>((node) => [
                    node.id,
                    node.x !== undefined && node.y !== undefined ? { x: node.x, y: node.y } : null,
                ])
            );
            let positionsUpdated = false;
            const updatedNodes = nodes.map((node) => {
                if (node.position.x !== positions[node.id]?.x || node.position.y !== positions[node.id]?.y) {
                    positionsUpdated = true;
                }
                return { ...node, position: positions[node.id] ?? node.position };
            });
            return {
                nodes: updatedNodes,
                positionsUpdated: positionsUpdated,
            };
        } else {
            return Promise.reject('Layouted graph contains no children.');
        }
    });
}
