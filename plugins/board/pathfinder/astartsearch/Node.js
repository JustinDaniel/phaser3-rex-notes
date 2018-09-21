const AngleBetween = Phaser.Math.Angle.Between;
const Shuffle = Phaser.Utils.Array.Shuffle;

class Node {
    constructor(manager) {
        this.preNodeKeys = [];
        this.manager = manager;
    }

    reset() {
        // overwrite
        this.pathFinder = undefined;
        this.sn = undefined; // for sorting by created order        
        this.key = undefined;
        this.x = undefined;
        this.y = undefined;
        // overwrite

        this._px = undefined;
        this._py = undefined;
        this.cost = undefined; // cost cache
        this.f = 0;
        this.g = 0;
        this.h = 0;
        this.closerH = 0;
        this.visited = false;
        this.closed = false;
        this.preNodeKeys.length = 0;
    }

    destroy() {
        this.preNodeKeys.length = 0;
        this.pathFinder = undefined;
    }

    heuristic(endNode, pathMode, baseNode) {
        if (pathMode === null) {
            return 0;
        }

        var h, dist = this.board.getDistance(endNode, this, true) * this.pathFinder.weightHeuristic;

        if ((pathMode === 1) && (baseNode !== undefined)) {
            var deltaAngle = endNode.angleTo(baseNode) - this.angleTo(baseNode);
            h = dist + quickAbs(deltaAngle);
        } else if (pathMode === 2) {
            h = dist + Math.random();
        } else {
            h = dist;
        }

        return h;
    }

    getNeighborNodes() {
        var neighborsLXY = this.board.getNeighborTileXY(this);
        if (this.pathFinder.shuffleNeighbors) {
            Shuffle(neighborsLXY);
        }

        var node, neighborNodes = [];
        for (var i = 0, cnt = neighborsLXY.length; i < cnt; i++) {
            node = this.manager.getNode(neighborsLXY[i]);
            neighborNodes.push(node)
        }
        return neighborNodes;
    }

    getCost(preNode) {
        if (this.pathFinder.costCache) {
            if (this.cost === undefined) {
                this.cost = this.pathFinder.getCost(this, preNode);
            }
        } else {
            this.cost = this.pathFinder.getCost(this, preNode);
        }
        return this.cost;
    }

    angleTo(endNode) {
        return AngleBetween(this.worldX, this.wroldY, endNode.worldX, endNode.wroldY);
    }

    get board() {
        return this.pathFinder.board;
    }

    get worldX() {
        if (this._px === undefined) {
            this._px = this.board.tileXYToWroldX(this.x, this.y);
        }
        return this._px;
    }

    get wroldY() {
        if (this._py === undefined) {
            this._py = this.board.tileXYToWroldY(this.x, this.y);
        }
        return this._py;
    }
}

function quickAbs(x) {
    return x < 0 ? -x : x;
};
export default Node;