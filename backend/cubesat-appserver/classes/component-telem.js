class ComponentTelem{
    constructor(componentTelemID, upperBound, lowerBound) {
        this.componentTelemID = componentTelemID;
        this.upperBound = upperBound;
        this.lowerBound = lowerBound;
    }

    get componentTelemID() {
        return this.componentTelemID
    }

    get upperBound() {
        return this.upperBound;
    }

    get lowerBound() {
        return this.lowerBound;
    }

    set componentTelemID(id) {
        this.componentTelemID = id;
    }

    set upperBound(bound) {
        this.upperBound = bound;
    }

    set lowerBound(bound) { 
        this.lowerBound = bound;
    }
}

module.export = ComponentTelem;