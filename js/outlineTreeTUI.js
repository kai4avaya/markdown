import { CONFIG } from './config.js';
import { appState } from './state.js';

// Lightweight Outline Tree using TUI Tree (no jQuery dependency)
export class OutlineTreeTUI {
    constructor() {
        this.tree = null;
        this.outlineContainer = null;
        this.initialized = false;
    }

    // Initialize the tree component
    initialize() {
        if (this.initialized) return;
        
        this.outlineContainer = document.getElementById('outline-list');
        this.setupTree();
        this.initialized = true;
    }

    // Setup the TUI Tree component
    setupTree() {
        // Clear the container
        this.outlineContainer.innerHTML = '';
        
        // Create the tree container
        const treeContainer = document.createElement('div');
        treeContainer.id = 'outline-tree-tui';
        treeContainer.className = 'tui-tree-wrap';
        this.outlineContainer.appendChild(treeContainer);

        // Initialize TUI Tree
        // Check if tui is available globally
        if (typeof tui === 'undefined' || !tui.Tree) {
            console.error('TUI Tree library not loaded');
            this.showMessage('Tree component not available');
            return;
        }
        
        this.tree = new tui.Tree(treeContainer, {
            data: [],
            nodeDefaultState: 'opened',
            template: {
                internalNode: 
                    '<div class="tui-tree-content-wrapper" style="padding-left: {{indent}}px">' +
                        '<button type="button" class="tui-tree-toggle-btn tui-js-tree-toggle-btn">' +
                            '<span class="tui-ico-tree"></span>' +
                        '</button>' +
                        '<span class="tui-tree-text tui-js-tree-text heading-level-{{level}}">' +
                            '<span class="tui-tree-ico tui-ico-folder"></span>' +
                            '{{text}}' +
                            '<span class="line-number">:{{line}}</span>' +
                        '</span>' +
                    '</div>' +
                    '<ul class="tui-tree-subtree tui-js-tree-subtree">{{children}}</ul>',
                leafNode:
                    '<div class="tui-tree-content-wrapper" style="padding-left: {{indent}}px">' +
                        '<span class="tui-tree-text tui-js-tree-text heading-level-{{level}}">' +
                            '<span class="tui-tree-ico tui-ico-file"></span>' +
                            '{{text}}' +
                            '<span class="line-number">:{{line}}</span>' +
                        '</span>' +
                    '</div>'
            },
            usageStatistics: false
        });

        // Add click event listener
        this.tree.on('click', (evt) => {
            const nodeData = evt.nodeData;
            if (nodeData && nodeData.line) {
                this.handleNodeClick(nodeData);
            }
        });
    }

    // Update the outline tree with new markdown content
    updateOutline() {
        const editor = appState.getEditor();
        if (!editor || !this.tree) {
            this.showMessage('Editor not ready.');
            return;
        }
        
        const markdown = editor.getMarkdown();
        const treeData = this.parseMarkdownToTree(markdown);
        
        if (treeData.length === 0) {
            this.showMessage(markdown.trim() === '' ? 
                'Start typing headings to see an outline.' : 
                'No headings found.'
            );
            return;
        }
        
        // Reset and reload the tree with new data
        this.tree.resetAllData(treeData);
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
                    state: level <= 2 ? 'opened' : 'closed', // Auto-expand first two levels
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

    // Handle node click - jump to line in editor
    handleNodeClick(nodeData) {
        if (nodeData && nodeData.line) {
            const editor = appState.getEditor();
            if (editor) {
                editor.setSelection([nodeData.line, 1], [nodeData.line, 1]);
                editor.focus();
            }
        }
    }

    // Show message when no outline is available
    showMessage(message) {
        this.outlineContainer.innerHTML = `<div class="outline-message">${message}</div>`;
    }

    // Expand all nodes
    expandAll() {
        if (this.tree) {
            this.tree.eachAll((node) => {
                if (node.getChildCount() > 0) {
                    this.tree.open(node.getId());
                }
            });
        }
    }

    // Collapse all nodes
    collapseAll() {
        if (this.tree) {
            this.tree.eachAll((node) => {
                if (node.getChildCount() > 0) {
                    this.tree.close(node.getId());
                }
            });
        }
    }

    // Get current tree instance
    getTree() {
        return this.tree;
    }

    // Destroy the tree (for cleanup)
    destroy() {
        if (this.tree) {
            this.tree.destroy();
            this.tree = null;
        }
        this.initialized = false;
    }
}

// Create and export a singleton instance
export const outlineTreeTUI = new OutlineTreeTUI();