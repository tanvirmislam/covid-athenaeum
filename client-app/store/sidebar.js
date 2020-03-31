export const state = () => ({
  isSidebarVisible: false,
  sidebarWidth: 300
})

export const getters = {
  isSidebarVisible: state => state.isSidebarVisible,
  sidebarWidth: state => state.sidebarWidth
}

export const mutations = {
  toggleSidebar (state) {
    state.isSidebarVisible = !state.isSidebarVisible
  },

  setSidebarVisibilityStatus (state, status) {
    state.isSidebarVisible = status
  }
}

export const actions = {
  toggleSidebar (context) {
    context.commit('toggleSidebar')
  },

  setSidebarVisibilityStatus (context, status) {
    context.commit('setSidebarVisibilityStatus', status)
  }
}
