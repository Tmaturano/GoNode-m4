'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.post('users', 'UserController.store')
Route.post('sessions', 'SessionController.store')

Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

Route.get('files/:id', 'FileController.show')

/**
 * User will only be able to call these routes if send an auth token
 */
Route.group(() => {
  Route.post('files', 'FileController.store')

  Route.resource('projects', 'ProjectController').apiOnly()

  // this route will be something like: /projects/:idProject/tasks
  Route.resource('projects.tasks', 'TaskController').apiOnly()
}).middleware(['auth'])
