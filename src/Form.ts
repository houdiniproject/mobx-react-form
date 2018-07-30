import { action, computed, observable, ObservableMap
  // , asMap 
} from 'mobx';
import * as _ from 'lodash';

import Base from './Base';
import Validator from './Validator';
import State from './State';
import Field from './Field';


export abstract class OuterForm extends Base{
  plugins?:() => any
  setup?:() => any
  options?:() => any
  bindings?:() => any
}

export default class Form extends OuterForm {

  name;
  state;
  validator;

  debouncedValidation:any

  $hooks = {};
  $handlers = {};

  @observable $submitting = false;
  @observable $validating = false;

  @observable fields:ObservableMap = observable.map ? observable.map({}) : 
  // asMap({})
  null
  ;

  $touched:boolean
  $changed:boolean

  

  constructor(setup:any = {}, {

    name = null,
    options = {},
    plugins = {},
    bindings = {},
    hooks = {},
    handlers = {},

  } = {}) {
    super();

    this.name = name;
    this.$hooks = hooks;
    this.$handlers = handlers;

    // load data from initializers methods
    let initial:any = {
      
      plugins: plugins,
      setup:setup,
      options: options,
      binding: bindings

    }
    if (this.plugins && _.isFunction(this.plugins))
    {
     initial.plugins = _.merge(plugins, this.plugins() )
    }

    if (this.setup && _.isFunction(this.setup))
    {
     initial.setup = _.merge(setup, this.setup() )
    }

    if (this.options && _.isFunction(this.options))
    {
     initial.options = _.merge(options, this.options() )
    }

    if (this.bindings && _.isFunction(this.bindings))
    {
     initial.bindings = _.merge(bindings, this.bindings() )
    }


    this.state = new State({
      form: this,
      initial: initial.setup,
      options: initial.options,
      bindings: initial.bindings,
    });

    this.validator = new Validator({
      form: this,
      plugins: initial.plugins,
      schema: initial.setup.schema,
    });

    this.initFields(initial.setup);

    this.debouncedValidation = _.debounce(
      this.validate,
      this.state.options.get('validationDebounceWait'),
      this.state.options.get('validationDebounceOptions'),
    );

    // execute validation on form initialization
    if (this.state.options.get('validateOnInit') === true) {
      this.validator.validate({ showErrors: this.state.options.get('showErrorsOnInit') });
    }

    this.execHook('onInit');
  }

  /* ------------------------------------------------------------------ */
  /* COMPUTED */

  @computed get submitting() {
    return this.$submitting;
  }

  @computed get validating() {
    return this.$validating;
  }

  @computed get clearing() {
    return this.check('clearing', true);
  }

  @computed get resetting() {
    return this.check('resetting', true);
  }

  @computed get error() {
    return this.validator.error;
  }

  @computed get hasError() {
    return !!this.validator.error
     || this.check('hasError', true);
  }

  @computed get isValid() {
    return !this.validator.error
      && this.check('isValid', true);
  }

  @computed get isDirty() {
    return this.check('isDirty', true);
  }

  @computed get isPristine() {
    return this.check('isPristine', true);
  }

  @computed get isDefault() {
    return this.check('isDefault', true);
  }

  @computed get isEmpty() {
    return this.check('isEmpty', true);
  }

  @computed get focused() {
    return this.check('focused', true);
  }

  @computed get touched() {
    return this.check('touched', true);
  }

  @computed get changed() {
    return this.check('changed', true);
  }

  @computed get disabled() {
    return this.check('disabled', true);
  }




/**
  Prototypes
*/


  makeField(data) {
    return new Field(data);
  }

  /**
   Init Form Fields and Nested Fields
   */
  @action
  init($fields:any = null) {
    _.set(this, 'fields', observable.map
      ? observable.map({})
      // : asMap({})
      : null
    );

    this.state.initial.props.values = $fields; // eslint-disable-line
    this.state.current.props.values = $fields; // eslint-disable-line

    this.initFields({
      fields: $fields || this.state.struct(),
    });
  }

  @action
  invalidate(message = null) {
    this.validator.error = message
      || this.state.options.get('defaultGenericError')
      || true;
  }

  showErrors(show = true) {
    this.each(field => field.showErrors(show));
  }

  /**
    Clear Form Fields
  */
  @action clear() {
    this.$touched = false;
    this.$changed = false;
    this.each(field => field.clear(true));
  }

  /**
    Reset Form Fields
  */
  @action reset() {
    this.$touched = false;
    this.$changed = false;
    this.each(field => field.reset(true));
  }

};
