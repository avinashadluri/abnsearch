import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import App from './App';
import Header from "../Header/Header";

describe('App component', () => {
    beforeEach(function() {
      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({Abn: "38353028748",
      AbnStatus: "0000000002",
      IsCurrent: true,
      Name: "COL CO",
      NameType: "Trading Name",
      Postcode: "0832",
      Score: 100,
      State: "NT"}));
    });
    it('Test rendering', () => {
      const component = renderer.create(<App />);
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
    it('renders the inner component', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find(Header).length).toEqual(1);
    });
    it('renders the input', () => {
      const wrapper = shallow(<App />);
      expect(wrapper.find('input').length).toEqual(1);
    });
    it('check heading', () => {
      const wrapper = shallow(<App />);
      const counterWrapper = wrapper.find('h1');
      expect(counterWrapper.text()).toEqual('Search for an Entity below');
    });
    it('check input change', () => {
      const wrapper = shallow(<App />);
      wrapper.find('input').simulate('change', { currentTarget: { value: 'test' }, value:'test' })
      wrapper.instance().onChange({ currentTarget: { value: 'test' }, value:'test' }).then(response => {
        expect(response.NameType).toBe("Trading Name");  
      });
      expect(wrapper).toMatchSnapshot();    
    });
    it('check input onClick', () => {
      const wrapper = shallow(<App />);
      wrapper.find('input').simulate('click', {})
      wrapper.instance().onClick({});
      expect(wrapper).toMatchSnapshot();    
    });
    it('check input onKeyDown', () => {
      const wrapper = shallow(<App />);
      wrapper.find('input').simulate('change', {currentTarget: { value: 'test' }, value:'test' })
      wrapper.instance().onKeyDown({});
      expect(wrapper).toMatchSnapshot();    
    });
});