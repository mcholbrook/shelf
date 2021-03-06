import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Signup from "../Signup/Signup";
import Login from "../Login/Login";
import authService from "../../services/authService";
import Users from '../Users/Users'
import Chat from '../Chat/Chat'
import HomePage from '../HomePage/HomePage'
import MyProfile from '../MyProfile/MyProfile'
import OtherProfile from '../OtherProfile/OtherProfile'
import Search from '../Search/Search'
import UpdateCollection from '../UpdateCollection/UpdateCollection'
import ShowCollection from '../ShowCollection/ShowCollection'
import UpdateProfile from '../UpdateProfile/UpdateProfile'
import AddResource from '../AddResource/AddResource'
import AddNewResourceToCollection from '../AddNewResourceToCollection/AddNewResourceToCollection'
import AddCollection from '../AddCollection/AddCollection'
import * as userService from '../../services/userService'
import * as resourceApi from '../../services/resourceApi'
import * as collectionApi from '../../services/collectionApi'
import "./App.css";
// import resource from "../../../models/resource";

class App extends Component {
  state = {
    user: authService.getUser(),
    collections: [],
    newResource: "",
    currentCollection: null,
    friends: []
  };

  async componentDidMount(){
    if(this.state.user){
      const collections = await collectionApi.getMyCollections(this.state.user)
      const friends = await userService.getMyFriends(this.state.user)
      this.setState((state) => ({
        collections: collections,
        friends: friends
      }))
    }
  }

  handleLogout = () => {
    authService.logout();
    this.setState({ user: null });
    this.props.history.push("/");
  };

  handleSignupOrLogin = () => {
    this.setState({ user: authService.getUser() });
  };

  handleAddResource = async(newResourceData) => {
    const newResource = await resourceApi.create(newResourceData)
    this.setState(
      (state) => ({
        newResource: newResource._id
      }), () =>  this.props.history.push({
        pathname: '/addnewresource',
        state: this.state.newResource
      })
    )
  }

  handleAddCollection = async(newCollectionData) => {
    const newCollection = await collectionApi.create(newCollectionData)
    this.setState(
      (state) => ({
        collections: [...state.collections, newCollection]
      }), () =>  this.props.history.push('/myprofile')
    )
  }

  handleAddNewResourceToCollection = async(newResourceCollectionData) => {
    const collection = await collectionApi.addNewResource(newResourceCollectionData)
    this.setState(
      (state) => ({
        collections: [...state.collections, collection]
      }),
      () => this.props.history.push({
        pathname: '/showcollection',
        state: collection
      })
    )
  }

  handleAddResourceToCollection = async(newResourceCollectionData) => {
    console.log('this is the add resource to collection function from home page')
    console.log(newResourceCollectionData)
    const collection = await collectionApi.addNewResource(newResourceCollectionData)
    const collectionIdx = this.state.collections.indexOf(collection._id)
    const collections = this.state.collections.filter(c => c._id !== collection._id)
    // const collections = this.state.collections.splice(collectionIdx, 1, collection)
    this.setState(
      (state) => ({
        collections: [...collections, collection]
      })
    )
  }

  handleDeleteResourceFromCollection = async(deleteData) => {
    const collection = await collectionApi.deleteResource(deleteData)
    const collectionIdx = this.state.collections.findIndex(c => c._id == collection._id)
    const collections = this.state.collections.splice(collectionIdx, 1, collection)
    this.setState((state) => ({
      currentCollection: collection,
      collections: collections
    }))
  }

  handleAddFriend = async(formData) => {
    const currentUser = await userService.addFriend(formData)
    this.setState((state) => ({
      user: currentUser, 
      friends: [...currentUser.friends]}
    ))
  }

  handleDeleteFriend = async(formData) => {
    const currentUser = await userService.deleteFriend(formData)
    this.setState((state) => ({
      user: currentUser, 
      friends: [...currentUser.friends]}
    ))
  }


  render() {
    const { user } = this.state
    return (
      <>
        <NavBar user={this.state.user} handleLogout={this.handleLogout}/>
        <Route
          exact
          path="/"
          render={({history, location})=>
            user ? 
            <HomePage 
              location={location}
              history={history}
              user={this.state.user}
              collections={this.state.collections}
              handleAddResourceToCollection={this.handleAddResourceToCollection}
            /> : <Redirect to="/login" /> 
            }
        />
        <Route
          exact
          path="/signup"
          render={({ history }) => (
            <Signup
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          )}
        />
        <Route
          exact
          path="/login"
          render={({ history }) => (
            <Login
              history={history}
              handleSignupOrLogin={this.handleSignupOrLogin}
            />
          )}
        />
        <Route
          exact
          path="/users"
          render={() =>
            user ? 
            <Users 
              currentUser={this.state.user}
            /> : <Redirect to="/login" />
          }
        />
        <Route 
          exact path="/chat"
          render={()=>
          user ? <Chat /> : <Redirect to="/login" /> 
        }
        />
        <Route 
          exact path="/myprofile"
          render={()=>
          user ? 
            <MyProfile 
              collections={this.state.collections}
              user={this.state.user}
            /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/profile"
          render={({location})=>
          user ? 
            <OtherProfile 
              location={location}
              currentUser={this.state.user}
              friends={this.state.friends}
              handleAddFriend={this.handleAddFriend}
              handleDeleteFriend={this.handleDeleteFriend}
            /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/search"
          render={()=>
          user ? 
            <Search
            collections={this.state.collections}
            user={this.state.user}
            /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/updatecollection"
          render={()=>
          user ? <UpdateCollection /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/showcollection"
          render={({ location, history })=>
          user ? 
            <ShowCollection 
              history={history}
              location={location}
              user={this.state.user}
              currentCollection={this.state.currentCollection}
              handleDeleteResourceFromCollection={this.handleDeleteResourceFromCollection}
            /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/updateprofile"
          render={()=>
          user ? <UpdateProfile /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/addresource"
          render={({history})=>
          user ? 
          <AddResource
            history={history}
            handleAddResource={this.handleAddResource}
            user={this.state.user}
          /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/addnewresource"
          render={({history, location})=>
          user ? 
          <AddNewResourceToCollection 
            history={history}
            location={location}
            collections={this.state.collections}
            handleAddNewResourceToCollection={this.handleAddNewResourceToCollection}
          /> : <Redirect to="/login" /> 
          }
        />
        <Route 
          exact path="/addcollection"
          render={({ history })=>
          user ? <AddCollection handleAddCollection={this.handleAddCollection} user={this.state.user} history={history}/> : <Redirect to="/login" /> 
          }
        />
      </>
    );
  }
}

export default App;
