class SystemLimits {
    constructor(systemID) {
        this.systemID = systemID;
        this.components = new Array();
    }


    set setID(id) {
        this.systemID = id;
    }

    get getID() {
        return this.systemID;
    }

    get getComponents() {
        return this.components;
    }

    addComponent(component) {
        this.components.push(component);
    }
}

module.exports = SystemLimits;