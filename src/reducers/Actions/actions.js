import * as types from './actionTypes';
export function CreateToDo(data) {
    return (dispatch, getState) => {
        dispatch(createData(data))
    }
}
export function UpdateToDo(data) {
    return (dispatch, getState) => {
        dispatch(updateData(data))
    }
}
export function RemoveToDo() {
    return (dispatch, getState) => {
        dispatch(removeData())
    }
}
const createData = data => (
    {
        type: types.CREATE_DATA,
        data: data,
        tag: "TAG_CREATE"
    }
)

const updateData = data => (
    {
        type: types.UPDATE_DATA,
        data: data,
        tag: "TAG_UPDATE"
    }
)
const removeData = data => (
    {
        type: types.UPDATE_DATA,
        data: data,
        tag: "TAG_REMOVE"
    }
)

