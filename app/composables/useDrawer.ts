export const useDrawer = () => {
  const isDrawerOpen = useState<boolean>('drawer-open', () => true)

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  const openDrawer = () => {
    isDrawerOpen.value = true
  }

  const closeDrawer = () => {
    isDrawerOpen.value = false
  }

  return {
    isDrawerOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  }
}
