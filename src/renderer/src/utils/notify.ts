function info(body: string, title = 'Muser'): Notification {
  const notification = new Notification(title, { body })
  return notification
}

export default { info }
