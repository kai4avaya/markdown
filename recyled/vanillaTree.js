// Lightweight vanilla JS tree component
export class VanillaTree {
    constructor(container) {
        this.container = container;
        this.data = [];
        this.onNodeClick = null;
    }

    setData(data) {
        this.data = data;
        this.render();
    }

    render() {
        this.container.innerHTML = this.renderNodes(this.data);
        this.bindEvents();
    }

    renderNodes(nodes, level = 0) {
        return nodes.map(node => `
            <div class="tree-node" data-key="${node.key}" style="margin-left: ${level * 16}px;">
                <div class="tree-item flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer">
                    ${node.children?.length ? '<i class="fas fa-chevron-right tree-toggle w-3 text-xs mr-2"></i>' : '<span class="w-3 mr-2"></span>'}
                    <i class="fas fa-file-text text-gray-500 mr-2"></i>
                    <span class="tree-title">${node.title}</span>
                    ${node.data?.line ? `<span class="text-xs text-gray-400 ml-auto">:${node.data.line}</span>` : ''}
                </div>
                ${node.children?.length ? `<div class="tree-children hidden">${this.renderNodes(node.children, level + 1)}</div>` : ''}
            </div>
        `).join('');
    }

    bindEvents() {
        this.container.addEventListener('click', (e) => {
            const toggle = e.target.closest('.tree-toggle');
            if (toggle) {
                const children = toggle.closest('.tree-node').querySelector('.tree-children');
                if (children) {
                    children.classList.toggle('hidden');
                    toggle.classList.toggle('fa-chevron-right');
                    toggle.classList.toggle('fa-chevron-down');
                }
                return;
            }

            const item = e.target.closest('.tree-item');
            if (item && this.onNodeClick) {
                const key = item.closest('.tree-node').dataset.key;
                const node = this.findNode(this.data, key);
                if (node) this.onNodeClick(node);
            }
        });
    }

    findNode(nodes, key) {
        for (const node of nodes) {
            if (node.key === key) return node;
            if (node.children) {
                const found = this.findNode(node.children, key);
                if (found) return found;
            }
        }
        return null;
    }

    expandAll() {
        this.container.querySelectorAll('.tree-children').forEach(el => el.classList.remove('hidden'));
        this.container.querySelectorAll('.tree-toggle').forEach(el => {
            el.classList.remove('fa-chevron-right');
            el.classList.add('fa-chevron-down');
        });
    }
}