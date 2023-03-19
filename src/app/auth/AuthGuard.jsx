import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppContext from "app/appContext";

class AuthGuard extends Component {
  constructor(props, context) {
    super(props);
    let { routes } = context;

    this.state = {
      authenticated: false,
      routes,
    };
  }

  componentDidMount() {
    if (!this.state.authenticated) {
      this.redirectRoute(this.props);
    }
  }
  //
  // componentDidUpdate() {
  //   if (!this.state.authenticated) {
  //     this.redirectRoute(this.props);
  //   }
  // }

  // shouldComponentUpdate(nextProps, nextState) {
  //   return nextState.authenticated !== this.state.authenticated;
  // }

  static getDerivedStateFromProps(props, state) {
    const { location, user } = props;
    const { pathname } = location;
    const matched = state.routes.find((r) => {
      if (r.path === pathname) {
        return true;
      } else if (r.path === pathname.substring(0, pathname.length - 1)) {
        return true;
      } else {
        false;
      }
    });
    const authenticated = matched ? true : false;

    return {
      authenticated,
    };
  }

  redirectRoute(props) {
    const { location, history } = props;
    const { pathname } = location;

    // history.push({
    //   pathname: "/eoffice/",
    //   state: { redirectUrl: pathname },
    // });
    history.push({
      pathname: "/eoffice/dashboard/analytics",
      state: { redirectUrl: pathname },
    });
  }

  render() {
    let { children } = this.props;
    const { authenticated } = this.state;
    return authenticated ? <Fragment>{children}</Fragment> : null;
  }
}

AuthGuard.contextType = AppContext;

const mapStateToProps = (state) => ({
  user: state.user,
});

export default withRouter(connect(mapStateToProps)(AuthGuard));
