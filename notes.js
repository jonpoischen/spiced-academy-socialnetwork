// 1. start.js (import a bunch of things)
    // - Provider from react-redux
    // - createStore and applyMiddleware from redux
    // - reduxPromise from redux-promise
    // - your reducer from ./reducer.js
    // - composeWithDevtools from redux-devtools-extension
    // - createStore passing the reducer and the result of calling `composeWithDevtools` and passing
    //   it the reulst of calling applyMiddleware and passing it reduxPromise
    // - wrap App component in Provider component and pass Provider the store as a prop
// 2. app.js
    // - import Friends component from ./friends.js
    // - add a Route for the Friends component
    // - `<Route path='/friends' component={Friends} />`
3. friends.js
    // - import connect
    // - import receiveFriendsAndWannabes, acceptFriendRequest and unfriend action creators
    //   from ./actions.js
    - create a Friends component
      (this component does not need to be exported, needs to be a class because it
      uses a lifecycle method)
    - when the component mounts it should dispatch the action for receiving
      friends and wannabes
      (`props.dispatch(receiveFriendsAndWannabes());`)
    - render two lists of users, both of which will be passed to it as props: friends and wannabes
    - write a mapStateToPropFunction that returns an object with a property named
      friends which is an array of objects created by filtering out unaccepted friend
      requests from the list of friends and wannabes in the state, same for wannabes
    - call connect and pass it the mapStateToProps function
    - call the function connect returns and pass it the Friends component
    - export the result
      export default connect(mapStateToProps)(Friends)
4. actions.js
    - receive receiveFriendsAndWannabes function that returns appropriate action
      (property of list of friends and wannabes)
    - acceptFriendRequest function that returns appropriate action
      (property of id of the user who made request)
    - unfriend function that returns appropriate action
      (property for the ide of user to unfriend)
5. reducer.js
    - Conditionals for action type RECEIVE_FRIENDS_AND_WANNABES
      (return new object that has all of the properties of the current
      state object, but the list of friends and wannabes from the action
      is added as a property. If the existing state object already had a
      list of friends and wannabes, that list is replaced with the new one)
    - action type ACCEPT_FRIEND_REQUEST
      (return a new object that has all the properties of the current state
      object but it replaces the list of friends and wannabes with a new
      list of friends and wanna bes that has in it all of the objects that
      were in the old list except one of them in replaced with a new object
      that has all of the properties of the old object except the accpted
      property is set to true)
    - action type UNFRIEND
      (return a new object that has all of the properties of the current
      state object but the list of friends and wannabes is replaced with
      a new list in which the one user specified in the action is removed)


// function mapStateToProps(state) {
//     return {
//         wannabes: state.friendsWannabes && state.friendsWannabes.filter(
//             friendsOrWannabes => !friendsOrWannabes.accepted
//         )
//     }
// }

return (
    <div>
        <h1>Wannabes</h1>
        {this.props.wannabes.map(
            wannabes => (
                <div key={wannabe.id}>
                    {wannabe.first} {wannabe.last}
                    <img src={wannabe.image} />
                    <button onClick={dispatch(accept(wannabe.id))}>accept</button>
                </div>
            )
        )}
    </div>
)
