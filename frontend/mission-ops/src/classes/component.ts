export class Component {
    /**
     * The unique ID.
     * 
     * @type {number}
     * @memberof Component
     */
    componentID: number;

    /**
     * The ID of the @alias System associated.
     * 
     * @type {number}
     * @memberof Component
     */
    systemID: number;

    /**
     * The name.
     * 
     * @type {string}
     * @memberof Component
     */
    name: string;

    /**
     * Constructs a new instance of a @class Component.
     * @param systemID The associated System.
     * @param name The name.
     */
    constructor(systemID: number, name: string) {
        this.systemID = systemID;
        this.name = name;
    }
}