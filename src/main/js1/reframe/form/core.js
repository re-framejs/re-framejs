import {view} from 'reframe/react';
import {makeAtom, pluck} from 'reframe/ratom';
import * as React from 'react';
import * as Immutable from 'immutable';
import {shouldUpdate} from 'reframe/shouldupdate';

function normalizeNumStr(s) {
    return s
        .replaceAll(/,/, '.')
        .replaceAll(/\s/, '');
}

class FormatCoercer {
    constructor(format, parse, regex, allowBlank) {
        this._format = format;
        this._parse = parse;
        this._regex = regex;
        this._allowBlank = allowBlank;
    }

    toStr(value) {
        if (value === null) {
            return '';
        }

        return this._format(value);
    }

    fromStr(strValue) {
        if (!strValue) {
            return null;
        }
        return this._parse(strValue);
    }

    isValidStr(strValue) {
        return this._allowBlank && !strValue || this._regex.test(strValue);
    }
}

class IntCoercer extends FormatCoercer {
    constructor(nf) {
        super(true, nf.format.bind(nf), /(\+|\-)?[\s\d]+/, s => parseInt(normalizeNumStr(s)));
    }
}

class NumberCoercer extends FormatCoercer {
    constructor(nf) {
        super(true, nf.format.bind(nf), /(\+|\-)?[\s\d]+/, s => parseFloat(normalizeNumStr(s)));
    }
}

class BoolCoercer {
    constructor(blankAsFalse) {
        constructor._blankAsFalse = blankAsFalse;
    }

    toStr(value) {
        return '' + value;
    }

    fromStr(strValue) {
        if (this._blankAsFalse && !strValue) {
            return false;
        }
        return Boolean(strValue);
    }

    isValidStr(strValue) {
        return true;
    }
}


function fieldPath(type, path) {
    return [type].concat(path);
}

function resetForm(form, value) {
    return form.merge({
        'value': value,
        'original-value': value,
        'form-touched': false,
        'field-touched': {},
        'str-value': {},
        'coercion-error': {},
        'validator-error': {}
    });
}

function updateForm(form) {
    const
        validator = form.get('validator'),
        value = form.get('value');
    return form.set('validator-error', validator(value));
}


class Field {
    constructor(form, path, coercer) {
        this._form = form;
        this._path = path;
        this._coercer = coercer;
    }

    originalValue() {
        return this._form.peekValue().getIn(fieldPath('value', this._path));
    }

    value() {
        return pluck(this._form, fieldPath('value', this._path));
    }

    resetValue(value) {
        this._form.swap(form => {
            const originalValue = form.getIn(fieldPath('original-value', this._path));
            return updateForm(form
                .setIn(fieldPath('value', this._path), originalValue)
                .setIn(fieldPath('str-value', this._path), null)
                .setIn(fieldPath('coercion-error', this._path), false)
                .setIn(fieldPath('field-touched', this._path), false));
        });
    }

    setValue(value) {
        this._form.swap(form => {
            return updateForm(form
                .setIn(fieldPath('value', this._path), value)
                .setIn(fieldPath('str-value', this._path), null)
                .setIn(fieldPath('coercion-error', this._path), false)
                .setIn(fieldPath('field-touched', this._path), true));
        });
    }

    setStrValue(strValue, touch = true) {
        this._form.swap(form => {
            if (this._coercer.isValidStr(strValue)) {
                const value = this._coercer.fromStr(this._coercer.toStr(this._coercer.fromStr(strValue)));
                return updateForm(form
                    .setIn(fieldPath('value', this._path), value)
                    .setIn(fieldPath('str-value', this._path), strValue)
                    .setIn(fieldPath('coercion-error', this._path), false)
                    .updateIn(fieldPath('field-touched', this._path), old => old || touch));
            } else {
                return updateForm(form
                    .setIn(fieldPath('value', this._path), null)
                    .setIn(fieldPath('str-value', this._path), strValue)
                    .setIn(fieldPath('coercion-error', this._path), true)
                    .setIn(fieldPath('field-touched', this._path), old => old || touch));
            }
        });
    }

    strValue() {
        return this._form.map(form => {
            return form.getIn(fieldPath('str-value', this._path)) || this.toStr(form.getIn(fieldPath('value', this._path)));
        });
    }

    toStr(value) {
        return this._coercer.toStr(value);
    }

    touch() {
        this._form.swap(form => form.setIn(fieldPath('field-touched', this._path), true));
    }

    isTouched() {
        return pluck(this._form, fieldPath('field-touched', this._path));
    }

    errors() {
        return pluck(this._form, fieldPath('validator-error', this._path));
    }

    isValid() {
        return this._form.map(form => {
            let isNotError = form.getIn(fieldPath('validator-error', this._path)).isEmpty();
            let isNotCoercionError = !form.getIn(fieldPath('coercion-error', this._path));
            return isNotCoercionError && isNotError;
        });
    }

}

class Form {
    constructor(form) {
        this._form = form;
    }

    originalValue() {
        return this._form.peekValue().get('original-value');
    }

    value() {
        return pluck(this._form, ['value']);
    }

    resetValue() {
        this._form.swap(form => resetForm(form, form.get('original-value')));
    }

    setValue(value) {
        this._form.swap(form => updateForm(form.set('value', value)));
    }

    touch() {
        this._form.swap(form => form.set('form-touched', true));
    }

    isTouched() {
        return pluck(this._form, ['form-touched']);
    }

    isValid() {
        return this._form.map(form => {
            const noCoercionError = form.get('coercion-error').filter(Boolean).isEmpty();
            const isValid = form.get('validator-error').isEmpty();
            return noCoercionError && isValid;
        });
    }

    field(path, coercer) {
        return new Field(this, path, coercer);
    }
}

function getOptions(field, attributes) {
    if (attributes.choices) {
        const choices = attributes.choices.map(([id, label]) => React.DOM.option({
            value: field.toStr(id),
            key: field.toStr(id)
        }, label));

        if (choices.toArray) {
            return choices.toArray();
        }
        return choices;
    }
    return attributes.options;
}

function selectInput(field, attributes) {
    const options = getOptions(attributes);
    let attrs = Object.assign(
        {type: 'text'},
        attributes, {
            value: field.strValue().deref(),
            onChange: e => field.setStrValue(e.target.value, true)
        });
    delete attrs.options;
    delete attrs.choices;
    return React.DOM.select(attrs, options);
}

function checkboxInput(field, attributes) {
    let attrs = Object.assign(
        {type: 'checkbox'},
        attributes, {
            checked: field.value().deref() || false,
            onChange: e => field.setValue(e.target.checked)
        });
    return React.DOM.input(attrs);
}


function radioInput(field, attributes) {
    const value = attributes.value;
    let attrs = Object.assign(
        {type: 'radio'},
        attributes, {
            value: field.toStr(value),
            checked: field.value().deref() === value,
            onChange: e => field.setValue(value)
        });
    return React.DOM.input(attrs);
}

function textInput(field, attributes) {
    let attrs = Object.assign(
        {type: 'text'},
        attributes, {
            value: field.strValue().deref(),
            onChange: e => field.setStrValue(e.target.value, attributes.touchOnChange || true),
            onBlur: e => field.touch()
        });
    delete attrs.touchOnChange;
    return React.DOM.input(attrs);
}

const Input = view('Input', {
    shouldComponentUpdate: function (nextProps, nextState) {
        let fieldDifferent = this.props.argv[0] !== nextProps.argv[0];
        let attributesDifferent = shouldUpdate(this.props.argv[1], nextProps.argv[1], ['choices', 'options']);
        return fieldDifferent || attributesDifferent;
    },
    render (field, attributes) {
        switch (attributes.type) {
            case 'select':
                return selectInput(field, attributes);
            case 'checkbox':
                return checkboxInput(field, attributes);
            case 'radio':
                return radioInput(field, attributes);
            default:
                return textInput(field, attributes);
        }
    }
});


export function makeForm(value, {validator}) {
    return new Form(makeAtom(resetForm(Immutable.Map({
        validator: validator || (() => Immutable.Map())
    }), value)));
}
