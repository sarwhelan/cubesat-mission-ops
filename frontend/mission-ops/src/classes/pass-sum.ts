export class PassSum {
    /**
     * The ID of the Pass being
     * summed over.
     * 
     * @type {number}
     * @memberof PassSum
     */
    passID: number;

    /**
     * The sum of the bandwidth usage
     * contained in the Pass.
     * 
     * @type {number}
     * @memberof PassSum
     */
    sumBandwidth: number;

    /**
     * The sum of the pwer consumption
     * contained in the Pass.
     * 
     * @type {number}
     * @memberof PassSum
     */
    sumPower: number;

    /**
     * Constructs a new instance of a @class PassSum.
     * @param sumBandwidth The sum of the bandwidth in the pass.
     * @param sumPower The sum of the power in the pass.
     */
    constructor(sumBandwidth: number, sumPower: number)
    {
        this.sumBandwidth = sumBandwidth;
        this.sumPower = sumPower;
    }
}