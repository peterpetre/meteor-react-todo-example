// AccountsUIWrapper React component - represents the accounts UI
AccountsUIWrapper = React.createClass({
  /**
   * React's componentDidMount method, invoked once, only on the client,
   * immediately after the initial rendering occurs
   */
  componentDidMount() {
    // Uses Meteor Blaze to renders login buttons
    this.view = Blaze.render(Template.loginButtons,
      ReactDOM.findDOMNode(this.refs.container));
  },
  /**
   * React's componentWillUnmount method, invoked immediately before a component
   * is unmounted from the DOM. Performs any necessaty cleanup, such as
   * invalidating timers or cleaning up any DOM elements that were created in 
   * componentDidMount
   */
  componentWillUnmount() {
    // Cleans up Blaze view
    Blaze.remove(this.view);
  },

  // Just renders a placeholder container that will be filled in
  render() {
    return <span ref="container" />;
  }
});