import MuserIcon from '../assets/icon.png'

function notify(body: string, title = 'Muser') {
  const notification = new Notification(title, { body, icon: MuserIcon })
  return notification
}

export { notify }
