import { combineReducers } from 'redux';
import { AlbumType } from "../customTypes";
import { postAlbum } from '../utils/api-client';

const screenReducer = (
    state = {screen: 0, viewAlbum: false, editAlbum: false, uploading: false, offline: false, activeAlbum: {} as AlbumType}, 
    action: { type: string, payload?: number | AlbumType}
  ) => {
  switch(action.type) {
    case 'CHANGE_SCREEN':
      return {
        screen: action.payload,
        viewAlbum: false,
        editAlbum: false,
        activeAlbum: {} as AlbumType
      }
    case 'VIEW_ALBUM':
      return {
        ...state,
        viewAlbum: true,
        activeAlbum: action.payload
      }
      case 'EDIT_ALBUM':
        return {
          ...state,
          editAlbum: true,
          activeAlbum: action.payload
        }
      case 'TOGGLE_EDIT':
        return {
          ...state,
          editAlbum: !state.editAlbum,
        }
      case 'UPDATE_ACTIVE':
        return {...state, activeAlbum: action.payload};
      case 'TOGGLE_ACTIVE_FAVE':
        return {...state, activeAlbum: { ...state.activeAlbum, favorite: !state.activeAlbum.favorite }};
      case 'TOGGLE_OFFLINE':
        return {...state, offline: !state.offline};
      case 'SET_UPLOADING':
        return {...state, uploading: action.payload};
    default : return state;
  }
}

const initialAlbumState = [] as AlbumType[];

const albumsReducer = (state = initialAlbumState, action: { type: string, payload?: number | string | AlbumType}) => {
  switch(action.type) {
    case 'GET_ALBUMS':
      return action.payload;
    case 'ADD_ALBUM':
      return [
        ...state,
        action.payload
      ];
    case 'UPDATE_ALBUM':
      const updatedAlbum = action.payload as AlbumType;
      const updatedAlbumList = [...state.map(album => {
        // Update the album with matching ID
        const newAlbum = album.id === updatedAlbum.id
        ? {
          ...updatedAlbum,
        }
        : album;
        return newAlbum;
      })
    ];
      // const updatedlist =  [ ...state.map((album, index) => {
      //   if (album.id === updatedAlbum.id) {
      //     album = updatedAlbum;
      //   }
      // }) ]
      console.log('Updated state list is : ', updatedAlbumList);
      return updatedAlbumList;
    case 'TOGGLE_FAVE':
      const newAlbumList = [...state.map(album => {
          // Update the album with matching ID
          const updatedAlbum = album.id === action.payload 
          ? {
            ...album,
            favorite: !album.favorite
          }
          : album;
          // Update the album on the DB
          if (album.id === action.payload) postAlbum(process.env.REACT_APP_USER, updatedAlbum);
          return updatedAlbum;
        })
      ];
      return newAlbumList;
    default: return state;
  }
}

const reducer = combineReducers({
  screenReducer,
  albumsReducer,
});

export default reducer;
