import React, { Component } from "react";
import { Context } from './context';
const io = require("socket.io-client");

export default class Provider extends Component {
  protected socket: any;

  constructor(props: any) {
    super(props);

    this.socket = io(props.url);
  }

  render() {
    return (
      <Context.Provider value={this.socket}>
        {this.props.children}
      </Context.Provider>
    );
  }
}