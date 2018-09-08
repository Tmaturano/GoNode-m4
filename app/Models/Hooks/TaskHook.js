'use strict'

const Kue = use('Kue')
const Job = use('App/Jobs/NewTaskMail')

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

  Kue.dispatch(Job.key, { email, username, file, title }, { attempts: 3 })
}
