import { CONFIG } from '../js/config.js';
import { appState } from '../js/state.js';

// Vanilla JavaScript Outline Tree (no dependencies)
export class OutlineTreeVanilla {
    constructor() {
        this.outlineContainer = null;
        this.initialized = false;
        this.treeData = [];
    }

    // Initialize the tree component
    initialize() {
        if (this.initialized) return;
        
        this.outlineContainer = document.getElementById('outline-list');
        this.initialized = true;
    }

    // Update the outline tree with new markdown content
    updateOutline() {
        const editor = appState.getEditor();
        if (!editor || !this.outlineContainer) {
            this.showMessage('Editor not ready.');
            return;
        }
        
        const markdown = editor.getMarkdown();
        this.treeData = this.parseMarkdownToTree(markdown);
        
        if (this.treeData.length === 0) {
            this.showMessage(markdown.trim() === '' ? 
                'Start typing headings to see an outline.' : 
                'No headings found.'
            );
            return;
        }
        
        this.renderTree();
    }

    // Parse markdown content into tree structure
    parseMarkdownToTree(markdown) {
        const lines = markdown.split('\n');
        const headingRegex = /^(#+)\s+(.*)/;
        const treeData = [];
        const stack = [{ level: 0, children: treeData }];

        lines.forEach((line, index) => {
            const match = line.match(headingRegex);
            if (match) {
                const level = match[1].length;
                const title = match[2].trim();
                const lineNumber = index + 1;

                const node = {
                    text: title,
                    level: level,
                    line: lineNumber,
                    type: 'heading',
                    expanded: level <= 2, // Auto-expand first two levels
                    children: []
                };

                // Pop the stack to the correct parent level
                while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                    stack.pop();
                }

                // Add to parent
                stack[stack.length - 1].children.push(node);
                // Push this node to the stack
                stack.push({ level: level, children: node.children });
            }
        });

        return treeData;
    }

    // Render the tree HTML
    renderTree() {
        this.outlineContainer.innerHTML = this.renderNodes(this.treeData);
        this.attachEventListeners();
    }

    // Render tree nodes recursively
    renderNodes(nodes, depth = 0) {
        if (!nodes || nodes.length === 0) return '';

        return nodes.map(node => {
            const hasChildren = node.children && node.children.length > 0;
            const expandedClass = node.expanded ? 'expanded' : '';
            const toggleIcon = hasChildren ? (node.expanded ? '▼' : '▶') : '';
            const indent = depth * 16;

            return `
                <li class="outline-node ${expandedClass}" data-line="${node.line}" data-level="${node.level}">
                    <div class="outline-node-content" style="padding-left: ${indent}px">
                        ${hasChildren ? `<button class="outline-toggle" data-line="${node.line}">${toggleIcon}</button>` : '<span class="outline-spacer"></span>'}
                        <span class="outline-text heading-level-${node.level}" data-line="${node.line}">
                            ${node.text}
                            <span class="line-number">:${node.line}</span>
                        </span>
                    </div>
                    ${hasChildren ? `<ul class="outline-children ${node.expanded ? 'expanded' : ''}">${this.renderNodes(node.children, depth + 1)}</ul>` : ''}
                </li>
            `;
        }).join('');
    }

    // Attach event listeners to tree nodes
    attachEventListeners() {
        // Toggle buttons
        this.outlineContainer.querySelectorAll('.outline-toggle').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const line = parseInt(button.dataset.line);
                this.toggleNode(line);
            });
        });

        // Text clicks for navigation
        this.outlineContainer.querySelectorAll('.outline-text').forEach(text => {
            text.addEventListener('click', (e) => {
                const line = parseInt(text.dataset.line);
                this.handleNodeClick(line);
            });
        });
    }

    // Toggle node expansion
    toggleNode(line) {
        const node = this.findNodeByLine(this.treeData, line);
        if (node) {
            node.expanded = !node.expanded;
            this.renderTree();
        }
    }

    // Find node by line number
    findNodeByLine(nodes, line) {
        for (const node of nodes) {
            if (node.line === line) {
                return node;
            }
            if (node.children) {
                const found = this.findNodeByLine(node.children, line);
                if (found) return found;
            }
        }
        return null;
    }

    // Handle node click - jump to line in editor
    handleNodeClick(line) {
        const editor = appState.getEditor();
        if (editor) {
            editor.setSelection([line, 1], [line, 1]);
            editor.focus();
        }
    }

    // Show message when no outline is available
    showMessage(message) {
        this.outlineContainer.innerHTML = `<div class="outline-message">${message}</div>`;
    }

    // Expand all nodes
    expandAll() {
        this.setAllNodesExpanded(this.treeData, true);
        this.renderTree();
    }

    // Collapse all nodes
    collapseAll() {
        this.setAllNodesExpanded(this.treeData, false);
        this.renderTree();
    }

    // Set expansion state for all nodes
    setAllNodesExpanded(nodes, expanded) {
        nodes.forEach(node => {
            if (node.children && node.children.length > 0) {
                node.expanded = expanded;
                this.setAllNodesExpanded(node.children, expanded);
            }
        });
    }

    // Get current tree data
    getTree() {
        return this.treeData;
    }

    // Destroy the tree (for cleanup)
    destroy() {
        if (this.outlineContainer) {
            this.outlineContainer.innerHTML = '';
        }
        this.treeData = [];
        this.initialized = false;
    }
}

// Create and export a singleton instance
export const outlineTreeVanilla = new OutlineTreeVanilla();