// 提示信息
export function toast({ dispatch, state }, message) {
    dispatch('TOAST', message);
}
export function loading({ dispatch, state }, loading) {
    dispatch('LOADING', loading);
}
export function mask({ dispatch, state }, mask) {
    dispatch('MASK', mask);
}
export function setuserinfo({ dispatch, state }, userinfo) {
    dispatch('SETUSERINFO', userinfo);
}
export function setheadimg({ dispatch, state }, headimg) {
    dispatch('SETHEADIMG', headimg);
}