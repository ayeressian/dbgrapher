import { connect } from 'lit-redux-watch';
import store from '../store/store';
import { LitElement } from 'lit-element';

export default connect(store)(LitElement);