import {view} from 'reframe/react';
import {makeCursor, makeAtom} from 'reframe/ratom';
import * as React from 'react';
import * as Immutable from 'immutable';

function normalizeNumStr(s) {
    return s
        .replaceAll(/,/, '.')
        .replaceAll(/\s/, '');
}

class Coercer {
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

class IntCoercer extends Coercer {
    constructor(nf) {
        super(true, nf.format.bind(nf), /(\+|\-)?[\s\d]+/, s => parseInt(normalizeNumStr(s)));
    }
}

class NumberCoercer extends Coercer {
    constructor(nf) {
        super(true, nf.format.bind(nf), /(\+|\-)?[\s\d]+/, s => parseFloat(normalizeNumStr(s)));
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
        return makeCursor(this._form, fieldPath('value', this._path));
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

    toStr(value) {
        return this._coercer.toStr(value);
    }

    touch() {
        this._form.swap(form => form.setIn(fieldPath('field-touched', this._path), true));
    }

    isTouched() {
        return makeCursor(this._form, fieldPath('field-touched', this._path));
    }

    errors() {
        return makeCursor(this._form, fieldPath('validator-error', this._path));
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
        return makeCursor(this._form, ['value']);
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
        return makeCursor(this._form, ['form-touched']);
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


export function makeForm(value, {validator}) {
    return new Form(makeAtom(resetForm(Immutable.Map({
        validator: validator || (() => Immutable.Map())
    }), value)));
}
