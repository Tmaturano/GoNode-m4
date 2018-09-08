'use strict'

const Mail = use('Mail')
const Helpers = use('Helpers')

const TaskHook = exports = module.exports = {}

TaskHook.sendNewTaskMail = async taskInstance => {
  // the dirty method indicates what new information were added
  // into the Model
  if (!taskInstance.user_id && !taskInstance.dirty.user_id) {
    return
  }

  // the code bellow execute for example when a task were modified
  // and a new user were changed or a new task has been created with
  // a user

  // user.fetch will get the user relationed with this task
  const { email, username } = await taskInstance.user().fetch()
  const file = await taskInstance.file().fetch()
  const { title } = taskInstance

  await Mail.send(
    ['emails.new_task'],
    { username, title, hasAttachment: !!file },
    message => {
      message
        .to(email)
        .from('tmaturano@teste.com', 'Thiago | AdonisApi')
        .subject('New Task for you')

      if (file) {
        message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
          filename: file.name
        })
      }
    }
  )
}
