/**
 * Description of a limitation set on a pass (i.e. maximum bandwidth usage allowed per pass).
 */
export class PassLimit {
    /**
     * The unique ID of the pass limit.
     */
    limitID: number;

    /**
     * The name of the pass limitation, i.e. what resource is being tracked.
     */
    name: string;

    /**
     * The maximum value allowed per pass.
     */
    maxValue: number;

    /**
     * Creates a new instance of {@link PassLimit}.
     * @param name The name of the pass limitation.
     * @param maxValue The maximum value allowed per pass.
     */
    constructor(name: string, maxValue: number) {
        this.name = name;
        this.maxValue = maxValue;
    }
}