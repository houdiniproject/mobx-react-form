import { CommonProperties } from './CommonProps';
/**
  Field Utils
*/
declare class SharedUtils implements CommonProperties {
    path: any;
    state: any;
    fields: any;
    $submitting: boolean;
    hasNestedFields: boolean;
    execHook: (hook: string, o: any) => any;
    invalidate: (message?: any, async?: boolean) => any;
    validator: any;
    validate: (o: any) => any;
    initField: (key: any, path: any, data: any, update?: boolean) => any;
    get: (path: string) => any;
    /**
     Fields Selector
     */
    select(path: any, fields?: any, isStrict?: boolean): any;
    /**
      Get Container
     */
    container($path?: any): any;
    /**
      Has Field
     */
    has(path: any): any;
    /**
     Map Fields
    */
    map(cb: any): any;
    /**
     * Iterates deeply over fields and invokes `iteratee` for each element.
     * The iteratee is invoked with three arguments: (value, index|key, depth).
     *
     * @param {Function} iteratee The function invoked per iteration.
     * @param {Array|Object} [fields=form.fields] fields to iterate over.
     * @param {number} [depth=1] The recursion depth for internal use.
     * @returns {Array} Returns [fields.values()] of input [fields] parameter.
     * @example
     *
     * JSON.stringify(form)
     * // => {
       *   "fields": {
       *     "state": {
       *       "fields": {
       *         "city": {
       *           "fields": { "places": {
       *                "fields": {},
       *                "key": "places", "path": "state.city.places", "$value": "NY Places"
       *              }
       *           },
       *           "key": "city", "path": "state.city", "$value": "New York"
       *         }
       *       },
       *       "key": "state", "path": "state", "$value": "USA"
       *     }
       *   }
       * }
     *
     * const data = {};
     * form.each(field => data[field.path] = field.value);
     * // => {
       *   "state": "USA",
       *   "state.city": "New York",
       *   "state.city.places": "NY Places"
       * }
     *
     */
    each(iteratee: any, fields?: any, depth?: number): void;
}
export default SharedUtils;
