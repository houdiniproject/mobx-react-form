import { 
  // useStrict, 
  configure } from 'mobx';

import Form from './Form';
import Field from './Field';

/* shared prototype methods */
import fieldInitializer from './shared/Initializer';
import fieldHelpers from './shared/Helpers';
import fieldActions from './shared/Actions';
import fieldUtils from './shared/Utils';
import fieldEvents from './shared/Events';

const { TEST } = process.env;

/**
  Enables MobX strict mode globally (TEST only).
  - - - - - - - - - - - - - - - - - -
  In strict mode, it is not allowed to
  change any state outside of an action
*/
if (TEST) {
  if (configure) {
    configure({ enforceActions: true });
  } else {
    // useStrict(true);
  }
}

/**
  Extend Classes with Prototype
  - - - - - - - - - - - - - - - - - -
  Cannot use Object.assign as @action
  methods on mixins are non-enumerable
*/
function extend(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach(baseCtor => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
  });
}

const shared = [
  fieldInitializer,
  fieldActions,
  fieldHelpers,
  fieldUtils,
  fieldEvents,
];

extend(Form, shared);
extend(Field, shared);

export default Form;
export { Form, Field };
