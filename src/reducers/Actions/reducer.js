
import * as types from './actionTypes'

const initState = {
    tag: undefined,
    data: undefined,
};
export default function action(state = initState, action) {
    switch (action.type) {
        case types.CREATE_DATA:
            return { ...state, data: action.data, tag: action.tag };
        case types.UPDATE_DATA:
            return { ...state, data: action.data, tag: action.tag };
        case types.REMOVE_DATA:
            return { ...state, data: undefined, tag: action.tag };
        default:
            return state;
    }
}
