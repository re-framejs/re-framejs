import {view} from 'reframe/react';
import {makeCursor, makeAtom} from 'reframe/ratom';
import * as React from 'react';
import * as Immutable from 'immutable';

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
    return form;
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
}

export function makeForm(value, {validator}) {
    return new Form(makeAtom(resetForm(Immutable.Map({
        validator
    }), value)));
}

export function makeField(form, path) {

}