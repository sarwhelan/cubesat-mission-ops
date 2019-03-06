class Component {
    constructor(componentID) {
        this.componentID = componentID;
        this.componentTelems = new Array();
    }

    set setComponentID(id) {
        this.componentID = id;
    }

    get getComponentID() {
        return this.componentID;
    }

    get getComponentTelems() {
        return this.componentTelems;
    }

    set addComponentTelems(telem) {
        this.componentTelems.push(telem);
    }
}

module.exports = Component;