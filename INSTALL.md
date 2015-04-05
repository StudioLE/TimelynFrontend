## Install Timelyn

These instructions will install and configure both the front and backend, they were written for Ubuntu but you should be able to adapt them for your environment.

Let's start by creating and entering a clean directory.

```
mkdir timelyn
cd timelyn
```

### Frontend

Clone the frontend repository into `frontend`

```
git clone https://github.com/StudioLE/TimelynFrontend.git frontend
```

Enter the directory and install the dependencies. For this step you'll need to have [Node.js](https://nodejs.org/) and [bower](http://bower.io/) installed.

```
cd frontend
npm install
```

Behind the scenes this will also call `bower install`.

You now need to modify the `app_url` config setting in `app/config.js`. This is the domain of your timelyn backend which will probably be:

```
app_url: 'http://localhost:1337',
```

The frontend is now ready. To reach it you can either point your webserver to the directory:

```
timelyn/frontend/app
```

Or you run the bundled node dev server which will launch the frontend to `http://localhost:7426`

```
npm start
```

### Backend

Return to the `timelyn` directory

```
cd ../
```

Clone the backend repository into `backend`

```
git clone https://github.com/StudioLE/TimelynBackend.git backend
```

Enter the repository, install Sails.js and the backend dependencies.

```
cd backend
npm install -g sails
npm install
```

Before we launch the app there are a couple of the config files you may wish to edit.

By default sails uses a temporary local file as a database but you may wish to define your own database in `config/connections.js` then change the `connection` option in `config/models.js`.

With the database defined you can populate the database with some sample data (skip this step if you don't want to do so).

This will create some sample timelines for the users: `john@example.com`, `sarah@example.com`, `mark@example.com` & `victoria@example.com` each with the password `123456789`.

Launch the sails console, once it's loaded type the command then exit with CTRL+C, CTRL+C.

```
sails.console
sails.controllers.data.insert('all')
```

The server is now almost ready, there's just one slightly hacky thing we have to do. The waterline authentication library doesn't quite support JSON Web Tokens yet so we need to manually edit a few files. Feel free to complain about this on [pull request #41](https://github.com/waterlock/waterlock/pull/41). 

Make the edits shown [on this page](https://github.com/waterlock/waterlock/pull/41/files) to the files in `node_modules/waterlock`.

Ok! The backend server is finally ready

It can be launched temporarily with:

```
sails lift
```

Or with [forever](https://github.com/foreverjs/forever):

```
sh forever.sh
```

Happy hacking.
