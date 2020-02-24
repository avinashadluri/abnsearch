import React from 'react';
import renderer from 'react-test-renderer';
import Header from './Header';

describe('Header component', () => {
    it('Test rendering', () => {
        const tree = renderer.create(<Header/>).toJSON();
        expect(tree).toMatchSnapshot();
    });
});