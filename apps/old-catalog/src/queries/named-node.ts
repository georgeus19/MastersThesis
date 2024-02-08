import * as RDF from '@rdfjs/types';
import { NamedNode as RdfNamedNode } from 'rdf-data-factory';

export class NamedNode extends RdfNamedNode {
    static fromNamedNode(namedNode: RDF.NamedNode) {
        return new NamedNode(namedNode.value);
    }

    constructor(public readonly value: string) {
        super(value);
    }

    toSparql(): string {
        return `<${this.value}>`;
    }
}